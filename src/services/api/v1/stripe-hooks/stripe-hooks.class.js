const {BadRequest} = require('@feathersjs/errors');
const {stripe} = require('../../../../stripe');
const config = require('config');
const endpointSecret = config.get('stripe').webhook_secret;
const {
	WH_EVENT_CUSTOMER_SUBSCRIPTION_CREATED,
	WH_EVENT_CUSTOMER_SUBSCRIPTION_UPDATED,
	WH_EVENT_CUSTOMER_SUBSCRIPTION_DELETED
} = require('../../../../constants');

exports.StripeHooks = class StripeHooks {
	constructor(options) {
		this.options = options || {};
	}
	
	async create(payload, params) {
		const sig = params.headers['stripe-signature'];
		let event;
		try {
			event = stripe.webhooks.constructEvent(Buffer.from(payload), sig, endpointSecret);
		}
		catch (err) {
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
		
		// handle webhooks depending on their type
		switch (event.type) {
			case WH_EVENT_CUSTOMER_SUBSCRIPTION_CREATED: {
				console.log('EVENT - :', WH_EVENT_CUSTOMER_SUBSCRIPTION_CREATED);
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
				break;
			}
			
			case WH_EVENT_CUSTOMER_SUBSCRIPTION_UPDATED: {
				console.log('EVENT - :', WH_EVENT_CUSTOMER_SUBSCRIPTION_UPDATED);
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
				break;
			}
			
			case WH_EVENT_CUSTOMER_SUBSCRIPTION_DELETED: {
				console.log('EVENT - :', WH_EVENT_CUSTOMER_SUBSCRIPTION_DELETED);
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
					sub.cancelled = true;
					await sub.save();
				}
				break;
			}
			
			default: {
				// Unexpected event type
				this.options.response._data.badRequest = 'Unexpected event type';
				return;
			}
		}
		await this.options.stripeEventService.Model.create({event_id: event.id});
		this.options.response._data.received = true;
	}
};
