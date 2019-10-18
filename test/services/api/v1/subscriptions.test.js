const app = require('../../../../src/app');

describe('\'api/v1/subscriptions\' service', () => {
	it('registered the service', () => {
		const service = app.service('api/v1/subscriptions');
		expect(service).toBeTruthy();
	});
});
