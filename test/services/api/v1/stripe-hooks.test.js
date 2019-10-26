const app = require('../../../../src/app');

describe('\'api/v1/stripe-hooks\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/stripe-hooks');
    expect(service).toBeTruthy();
  });
});
