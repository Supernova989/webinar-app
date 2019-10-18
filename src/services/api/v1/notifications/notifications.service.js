// Initializes the `api/v1/notifications` service on path `/api/v1/notifications`
const { Notifications } = require('./notifications.class');
const createModel = require('../../../../models/notifications.model');
const hooks = require('./notifications.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/notifications', new Notifications(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/notifications');

  service.hooks(hooks);
};
