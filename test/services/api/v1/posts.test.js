const app = require('../../../../src/app');

describe('\'api/v1/posts\' service', () => {
	it('registered the service', () => {
		const service = app.service('api/v1/posts');
		expect(service).toBeTruthy();
	});
});
