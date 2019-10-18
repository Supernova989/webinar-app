const app = require('../../../../src/app');

describe('\'api/v1/notifications\' service', () => {
	it('registered the service', () => {
		const service = app.service('api/v1/notifications');
		expect(service).toBeTruthy();
	});
});
