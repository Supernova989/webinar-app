const app = require('../../../../src/app');

describe('\'api/v1/stripe\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/stripe');
    expect(service).toBeTruthy();
  });
});
