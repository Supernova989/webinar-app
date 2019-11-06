const {BadRequest} = require('@feathersjs/errors');
const {stripe} = require('../../../../stripe');
const {log_msg} = require('../../../../helpers');
const config = require('config');
const endpointSecret = config.get('stripe').webhook_secret;
const {
	sWH_EVENT_CUSTOMER_SUBSCRIPTION_CREATED,
	sWH_EVENT_CUSTOMER_SUBSCRIPTION_UPDATED,
	sWH_EVENT_CUSTOMER_SUBSCRIPTION_DELETED,
	sWH_EVENT_CHECKOUT_SESSION_COMPLETED
} = require('../../../../constants');
const {zoomAPI} = require('../zoom/zoom.service');

exports.StripeHooks = class StripeHooks {
	constructor(options) {
		this.options = options || {};
	}
	
	async create(payload, params) {
		const sig = params.headers['stripe-signature'];
		let event;
		try {
			event = stripe.webhooks.constructEvent(Buffer.from(this.options.rawBody), sig, endpointSecret);
		} catch (err) {
			this.options.response._data.badRequest = `Webhook Error: ${err.message}`;
			return
		}
		
		// check if the event has already been processed
		const found = await this.options.stripeEventService.Model.findOne({where: {event_id: event.id}});
		if (found) {
			this.options.response._data.received = true;
			return;
		}
		
		const {object} = event.data;
		let error;
		
		// handle webhooks depending on their type
		switch (event.type) {
			
			case sWH_EVENT_CHECKOUT_SESSION_COMPLETED: {
				console.log('============================================');
				console.log(`EVENT (${event.id}) - :`, sWH_EVENT_CHECKOUT_SESSION_COMPLETED);
				console.log('============================================');
				log_msg(`${sWH_EVENT_CHECKOUT_SESSION_COMPLETED} [${event.id}]`, null, 'INFO', true);
				
				const {customer, subscription} = object;
				try {
					const sub = await stripe.subscriptions.retrieve(subscription);
					const user = await this.options.userService.Model.findOne({
							include: {
								model: this.options.subscriptionService.Model,
								where: {
									subscription_id: subscription
								},
								limit: 1,
								required: false
							},
							where: {
								customer_id: customer
							}
						}
					);
					
					// User found and has no subscription with the SUBSCRIPTION_ID provided
					if (user && user.subscriptions.length === 0) {
						const {
							id: subscription_id,
							cancel_at: scheduled_cancellation_date,
							cancel_at_period_end: has_scheduled_cancellation,
							billing_cycle_anchor,
							current_period_end
						} = sub;
						
						const sub_data = {
							userId: user.id,
							subscription_id,
							billing_cycle_anchor,
							current_period_end,
							scheduled_cancellation_date,
							has_scheduled_cancellation
						};
						
						await this.options.subscriptionService.create(sub_data);
						
						if (user.zoom_id) {
							await zoomAPI.change_user_status(user.zoom_id, true);
						}
					}
				} catch (err) {
					error = err;
				}
				
				break;
			}
			case sWH_EVENT_CUSTOMER_SUBSCRIPTION_CREATED: {
				console.log('============================================');
				console.log(`EVENT (${event.id}) - :`, sWH_EVENT_CUSTOMER_SUBSCRIPTION_CREATED);
				console.log('============================================');
				
				break;
			}
			
			case sWH_EVENT_CUSTOMER_SUBSCRIPTION_UPDATED: {
				console.log('============================================');
				console.log(`EVENT (${event.id}) - :`, sWH_EVENT_CUSTOMER_SUBSCRIPTION_UPDATED);
				console.log('============================================');
				log_msg(`${sWH_EVENT_CUSTOMER_SUBSCRIPTION_UPDATED} [${event.id}]`, null, 'INFO', true);
				
				
				// avoid triggering right after CHECKOUT.SESSION.COMPLETED
				const justCreated = (
					event.data.previous_attributes
					&& event.data.previous_attributes.status === 'incomplete'
					&& object.status === 'active'
				);
				
				if (!justCreated) {
					try {
						const {
							id: subscription_id,
							customer: customer_id,
							cancel_at: scheduled_cancellation_date,
							cancel_at_period_end: has_scheduled_cancellation,
							billing_cycle_anchor,
							current_period_end,
							status
						} = object;
						
						const sub = await this.options.subscriptionService.Model.findOne({where: {subscription_id}});
						
						if (sub) {
							sub.scheduled_cancellation_date = scheduled_cancellation_date;
							sub.has_scheduled_cancellation = has_scheduled_cancellation;
							sub.billing_cycle_anchor = billing_cycle_anchor;
							sub.current_period_end = current_period_end;
							if (status === 'canceled') {
								sub.canceled = true;
							}
							await sub.save();
						}
					} catch (err) {
						error = err;
					}
				}
				
				break;
			}
			
			case sWH_EVENT_CUSTOMER_SUBSCRIPTION_DELETED: {
				console.log('============================================');
				console.log(`EVENT (${event.id}) - :`, sWH_EVENT_CUSTOMER_SUBSCRIPTION_DELETED);
				console.log('============================================');
				log_msg(`${sWH_EVENT_CUSTOMER_SUBSCRIPTION_DELETED} [${event.id}]`, null, 'INFO', true);
				
				try {
					const {
						id: subscription_id,
						customer: customer_id,
						cancel_at: scheduled_cancellation_date,
						cancel_at_period_end: has_scheduled_cancellation,
						billing_cycle_anchor,
						current_period_end
					} = object;
					
					const user = await this.options.userService.Model.findOne({
							include: {
								model: this.options.subscriptionService.Model,
								where: {
									subscription_id
								},
								limit: 1,
								required: true
							},
							where: {
								customer_id
							}
						}
					);
					const {subscriptions} = user;
					
					if (subscriptions && subscriptions.length && subscriptions[0]) {
						subscriptions[0].scheduled_cancellation_date = scheduled_cancellation_date;
						subscriptions[0].has_scheduled_cancellation = has_scheduled_cancellation;
						subscriptions[0].billing_cycle_anchor = billing_cycle_anchor;
						subscriptions[0].current_period_end = current_period_end;
						subscriptions[0].canceled = true;
						await subscriptions[0].save();
						
						if (user.zoom_id) {
							await zoomAPI.change_user_status(user.zoom_id, false);
						}
					}
				} catch (err) {
					error = err;
				}
				
				break;
			}
			
			default: {
				// Unexpected event type
				error = 'Unexpected event type';
				return;
			}
		}
		if (error) {
			this.options.response._data.badRequest = error.message || error;
			log_msg(error.message || error, null, 'ERROR', true);
			return;
		}
		await this.options.stripeEventService.Model.create({event_id: event.id});
		this.options.response._data.received = true;
	}
};
