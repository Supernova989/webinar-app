const app = require('../../../../src/app');

describe('\'api/v1/zoom-hooks\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/zoom-hooks');
    expect(service).toBeTruthy();
  });
});
