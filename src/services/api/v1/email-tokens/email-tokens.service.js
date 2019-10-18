// Initializes the `api/v1/email-tokens` service on path `/api/v1/email-tokens`
const { EmailTokens } = require('./email-tokens.class');
const createModel = require('../../../../models/email-tokens.model');
const hooks = require('./email-tokens.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/email-tokens', new EmailTokens(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/email-tokens');

  service.hooks(hooks);
};
