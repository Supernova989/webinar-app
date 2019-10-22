const app = require('../../../../src/app');

describe('\'api/v1/zoom-meetings\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/zoom-meetings');
    expect(service).toBeTruthy();
  });
});
