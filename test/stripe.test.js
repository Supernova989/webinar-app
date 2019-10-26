const config = require('config');
const secret = config.get('stripe').webhook_secret;
const {stripe} = require('../src/stripe');

describe('Stripe tests (with jest)', () => {
	beforeAll(done => {
		done();
	});
	
	afterAll(done => {
		done();
	});
	
	it('Generates a webhook token and decodes it', async () => {
		const payload = {
			id: 'evt_test_webhook',
			object: 'event',
		};
		
		const payloadString = JSON.stringify(payload, null, 2);
		const header = stripe.webhooks.generateTestHeaderString({
			payload: payloadString,
			secret,
		});
		
		const event = stripe.webhooks.constructEvent(payloadString, header, secret);
		
		expect(event.id).toBe(payload.id);
	});
});
