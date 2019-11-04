const crypto = require('crypto');
const {Op} = require('sequelize');
const config = require('config');
const moment = require('moment');

exports.Stripe = class Stripe {
	constructor(options) {
		this.options = options || {};
		this.stripe = this.options.stripe;
	}
	
	// checks if the user has an active subscription
	async find(params) {
		//
		
		
		/*
		To return:
		
		active: false,
		has_scheduled_cancellation: undefined,
		scheduled_cancellation_date: undefined,
		current_period_end: undefined
		 */
		return [];
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
		// console.log('data', data);
		// console.log('params', params);
		
		const {user} = params;
		
		
		const subscriptions = await this.stripe.subscriptions.list({limit: 3, customer: user.customer_id});
		console.log('subscriptions found:', subscriptions);
		
		if (subscriptions.data.length > 1) {
			console.log('YOU ALREADY HAVE AN ACTIVE SUBSCRIPTION');
		}
		
		let session_token;
		
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
		
		return {
			session_token,
			publish_key: this.options.public_key
		};
		/*
		stripe.redirectToCheckout({
			sessionId: '{{CHECKOUT_SESSION_ID}}'
		}).then(function (result) {
			// If `redirectToCheckout` fails due to a browser or network
			// error, display the localized error message to your customer
			// using `result.error.message`.
		});
		*/
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
