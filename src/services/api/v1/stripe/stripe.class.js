const crypto = require('crypto');
const {Op} = require('sequelize');
const config = require('config');
const moment = require('moment');
const {NotAuthenticated, Forbidden, BadRequest, NotFound} = require('@feathersjs/errors');

const POST_QUERIES = {
	NEW: 'new',
	CANCEL: 'cancel',
	RENEW: 'renew'
};

exports.Stripe = class Stripe {
	constructor(options) {
		this.options = options || {};
		this.stripe = this.options.stripe;
	}
	
	// checks if the user has an active subscription
	async find(params) {
		const {user} = params;
		const NOW = Math.floor(moment().valueOf() / 1000);
		let expires = null;
		let response = {};
		
		try {
			// const subscriptions = await this.stripe.subscriptions.list({ limit: 2 });
			// const subscription = subscriptions.data[0];
			// console.log('---------------');
			// console.log(subscriptions);
			// console.log('---------------');
			const subscription = await this.options.subscriptionService.Model.findOne({
				where: {
					userId: user.id,
					canceled: false,
					current_period_end: {
						[Op.gt]: NOW
					}
				},
			});
			
			response = {
				// scheduled_cancellation_date: subscription ? subscription.cancel_at : null,
				scheduled_cancellation_date: subscription ? subscription.scheduled_cancellation_date : null,
				has_scheduled_cancellation: subscription ? subscription.has_scheduled_cancellation : null,
				current_period_end: subscription ? subscription.current_period_end : null,
				active: !!subscription
			};
			
		} catch (err) {
			console.log(err);
			throw new BadRequest('Cannot fetch subscriptions');
		}
		
		return response;
	}
	
	async get(id, params) {
		return {
			id, text: `A new message with ID: ${id}!`
		};
	}
	
	/**
	 * For creating a new Subscription
	 * @param data
	 * @param params
	 */
	async create(data, params) {
		if (!data.q) {
			throw new BadRequest();
		}
		const {user} = params;
		let response = {};
		
		switch (data.q) {
			
			case POST_QUERIES.NEW: {
				let session_token;
				let subscriptions;
				try {
					subscriptions = await this.stripe.subscriptions.list({
						limit: 3,
						customer: user.customer_id,
						status: 'active'
					});
				} catch (err) {
					console.log('Error! ', err);
					throw new BadRequest('Cannot create a subscription.')
				}
				console.log('subscriptions found:', subscriptions);
				if (subscriptions.data.length > 0) {
					throw new BadRequest('You already have an active subscription.')
				}
				const storedSession = await this.options.sessionService.Model.findOne({
					where: {
						expiresAt: {
							[Op.gt]: new Date()
						},
						userId: user.id
					}
				});
				
				if (storedSession) {
					session_token = storedSession.session_token;
				} else {
					const session = await this.stripe.checkout.sessions.create({
						success_url: `${config.get('host')}/app#/account/billing?result=success`,
						cancel_url: `${config.get('host')}/app#/account/billing?result=canceled`,
						customer: user.customer_id,
						payment_method_types: ['card'],
						subscription_data: {
							items: [{
								plan: this.options.plan_id,
								quantity: 1
							}],
							metadata: {
								username: user.username
							}
						},
					}, {
						idempotency_key: this.generateHexToken64(),
					});
					
					const expiresAt = moment().add(24, 'hours').toDate();
					session_token = session.id;
					await this.options.sessionService.Model.create({
						userId: user.id,
						session_token,
						expiresAt // 24 hours
					});
				}
				
				response = {
					session_token,
					public_key: this.options.public_key
				};
				break;
			}
			
			/* ========================================== */
			case POST_QUERIES.CANCEL: {
				let subscription = null;
				try {
					const NOW = Math.floor(moment().valueOf() / 1000);
					subscription = await this.options.subscriptionService.Model.findOne({
						where: {
							userId: user.id,
							canceled: false,
							current_period_end: {
								[Op.gt]: NOW
							}
						},
					});
					if (subscription) {
						const request = await this.stripe.subscriptions.update(subscription.subscription_id, {cancel_at_period_end: true});
						console.log('result cancel', request);
					}
				} catch (err) {
					throw BadRequest(err.message);
				}
				
				if (!subscription) {
					throw new BadRequest('No subscription found.')
				}
				break;
			}
			/* ========================================== */
			case POST_QUERIES.RENEW: {
				console.log('here', data);
				let subscription = null;
				let subscriptions;
				try {
					const NOW = Math.floor(moment().valueOf() / 1000);
					
					subscriptions = await this.stripe.subscriptions.list({
						limit: 2,
						customer: user.customer_id,
						status: 'active'
					});
					// subscription = await this.options.subscriptionService.Model.findOne({
					// 	where: {
					// 		userId: user.id,
					// 		canceled: false,
					// 		current_period_end: {
					// 			[Op.gt]: NOW
					// 		}
					// 	},
					// });
					subscription = subscriptions.data[0];
					console.log('here',subscription);
					if (subscription) {
						const request = await this.stripe.subscriptions.update(subscription.id, {cancel_at_period_end: false});
						console.log('result renew', request);
					}
				} catch (err) {
					throw BadRequest(err.message);
				}
				
				if (!subscription) {
					throw new BadRequest('No subscription found.')
				}
				break;
			}
			
		}
		
		return response;
	}
	
	async update(id, data, params) {
		return data;
	}
	
	async patch(id, data, params) {
		return data;
	}
	
	async remove(id, params) {
		return {id};
	}
	
	generateHexToken64() {
		return crypto.randomBytes(64).toString('hex');
	}
	
};
