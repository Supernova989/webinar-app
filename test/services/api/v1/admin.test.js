const app = require('../../../../src/app');

describe('\'api/v1/admin\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/admin');
    expect(service).toBeTruthy();
  });
});
