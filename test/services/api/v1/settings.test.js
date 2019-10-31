const app = require('../../../../src/app');

describe('\'api/v1/settings\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/settings');
    expect(service).toBeTruthy();
  });
});
