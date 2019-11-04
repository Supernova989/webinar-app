const {BadRequest} = require('@feathersjs/errors');
const {stripe} = require('../../../../stripe');
const config = require('config');
const endpointSecret = config.get('stripe').webhook_secret;
const {
	sWH_EVENT_CUSTOMER_SUBSCRIPTION_CREATED,
	sWH_EVENT_CUSTOMER_SUBSCRIPTION_UPDATED,
	sWH_EVENT_CUSTOMER_SUBSCRIPTION_DELETED
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
			event = stripe.webhooks.constructEvent(Buffer.from(payload), sig, endpointSecret);
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
			case sWH_EVENT_CUSTOMER_SUBSCRIPTION_CREATED: {
				console.log(`EVENT (${event.id}) - :`, sWH_EVENT_CUSTOMER_SUBSCRIPTION_CREATED);
				try {
					const {
						id: subscription_id,
						customer: customer_id,
						cancel_at: scheduled_cancellation_date,
						cancel_at_period_end: has_scheduled_cancellation,
						billing_cycle_anchor,
						current_period_end
					} = object;
					
					const user = await this.options.userService.Model.findOne({where: {customer_id}});
					
					const sub_data = {
						userId: user.id,
						subscription_id,
						billing_cycle_anchor,
						current_period_end,
						scheduled_cancellation_date,
						has_scheduled_cancellation
					};
					
					const sub = await this.options.subscriptionService.create(sub_data);
					if (user.zoom_id) {
						await zoomAPI.change_user_status(user.zoom_id, true);
					}
				} catch (err) {
					error = err;
				}
				
				break;
			}
			
			case sWH_EVENT_CUSTOMER_SUBSCRIPTION_UPDATED: {
				console.log(`EVENT (${event.id}) - :`, sWH_EVENT_CUSTOMER_SUBSCRIPTION_UPDATED);
				try {
					const {
						id: subscription_id,
						customer: customer_id,
						cancel_at: scheduled_cancellation_date,
						cancel_at_period_end: has_scheduled_cancellation,
						billing_cycle_anchor,
						current_period_end
					} = object;
					
					const sub = await this.options.subscriptionService.Model.findOne({where: {subscription_id}});
					
					if (sub) {
						sub.scheduled_cancellation_date = scheduled_cancellation_date;
						sub.has_scheduled_cancellation = has_scheduled_cancellation;
						sub.billing_cycle_anchor = billing_cycle_anchor;
						sub.current_period_end = current_period_end;
						await sub.save();
					}
				} catch (err) {
					error = err;
				}
				
				break;
			}
			
			case sWH_EVENT_CUSTOMER_SUBSCRIPTION_DELETED: {
				console.log(`EVENT (${event.id}) - :`, sWH_EVENT_CUSTOMER_SUBSCRIPTION_DELETED);
				try {
					const {
						id: subscription_id,
						customer: customer_id,
						cancel_at: scheduled_cancellation_date,
						cancel_at_period_end: has_scheduled_cancellation,
						billing_cycle_anchor,
						current_period_end
					} = object;
					
					// todo optimize MySQL queries
					
					const sub = await this.options.subscriptionService.Model.findOne({where: {subscription_id}});
					
					if (sub) {
						sub.scheduled_cancellation_date = scheduled_cancellation_date;
						sub.has_scheduled_cancellation = has_scheduled_cancellation;
						sub.billing_cycle_anchor = billing_cycle_anchor;
						sub.current_period_end = current_period_end;
						sub.cancelled = true;
						await sub.save();
						
						const user = await this.options.userService.Model.findOne({where: {customer_id}});
						if (user && user.zoom_id) {
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
			console.log('Stripe-Hook message: ', error);
			return;
		}
		await this.options.stripeEventService.Model.create({event_id: event.id});
		this.options.response._data.received = true;
	}
};
