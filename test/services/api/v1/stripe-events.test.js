const app = require('../../../../src/app');

describe('\'api/v1/stripe-events\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/stripe-events');
    expect(service).toBeTruthy();
  });
});
