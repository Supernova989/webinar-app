// Initializes the `api/v1/subscriptions` service on path `/api/v1/subscriptions`
const {Subscriptions} = require('./subscriptions.class');
const createModel = require('../../../../models/subscriptions.model');
const hooks = require('./subscriptions.hooks');

module.exports = function (app) {
	const Model = createModel(app);
	const paginate = app.get('paginate');
	
	const options = {
		Model,
		paginate
	};
	
	// Initialize our service with any options it requires
	app.use('/api/v1/subscriptions', new Subscriptions(options, app));
	
	// Get our initialized service so that we can register hooks
	const service = app.service('api/v1/subscriptions');
	
	service.hooks(hooks);
};
