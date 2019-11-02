const app = require('../../../../src/app');

describe('\'api/v1/zoom-registrants\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/v1/zoom-registrants');
    expect(service).toBeTruthy();
  });
});
