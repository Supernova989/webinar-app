const app = require('../../../../src/app');

describe('\'api/v1/confirmation\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/confirmation');
    expect(service).toBeTruthy();
  });
});
