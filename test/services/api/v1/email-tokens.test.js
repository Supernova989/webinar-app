const app = require('../../../../src/app');

describe('\'api/v1/email-tokens\' service', () => {
	it('registered the service', () => {
		const service = app.service('api/v1/email-tokens');
		expect(service).toBeTruthy();
	});
});
