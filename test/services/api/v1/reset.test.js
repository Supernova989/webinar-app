const app = require('../../../../src/app');

describe('\'api/v1/reset\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/reset');
    expect(service).toBeTruthy();
  });
});
