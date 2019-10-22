const app = require('../../../../src/app');

describe('\'api/v1/zoom\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/zoom');
    expect(service).toBeTruthy();
  });
});
