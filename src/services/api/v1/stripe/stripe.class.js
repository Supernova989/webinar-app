const crypto = require('crypto');

exports.Stripe = class Stripe {
	constructor(options) {
		this.options = options || {};
		this.stripe = this.options.stripe;
	}
	
	async find(params) {
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
		console.log('data', data);
		console.log('params', params);
		
		
		const {user} = params;
		
		
		// todo check if user already has an active recently created session
		
		const session = await this.stripe.checkout.sessions.create({
			success_url: 'https://webinar.maximdev.com/app#/account/billing/success',
			cancel_url: 'https://webinar.maximdev.com/app#/account/billing',
			customer: 'cus_FueXhqC2FeYyrV', // get from the User object
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
			idempotency_key: this.generateHexToken(), // todo generate an idempotency key
		});
		
		// console.log('session', session);
		// console.log('token', this.generateHexToken());
		
		return {
			session: session.id,
			publish_key: this.options.public_key
		};
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
	
	generateHexToken() {
		return crypto.randomBytes(32).toString('hex');
	}
};
