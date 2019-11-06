const app = require('../../../../src/app');

describe('\'api/v1/forgot-password\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/forgot-password');
    expect(service).toBeTruthy();
  });
});
