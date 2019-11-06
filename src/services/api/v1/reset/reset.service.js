// Initializes the `api/v1/reset` service on path `/api/v1/reset`
const {Reset} = require('./reset.class');
const createModel = require('../../../../models/reset.model');
const hooks = require('./reset.hooks');

module.exports = function (app) {
	const Model = createModel(app);
	const paginate = app.get('paginate');
	
	const options = {
		Model,
		paginate
	};
	
	// Initialize our service with any options it requires
	app.use('/api/v1/reset', new Reset(options, app));
	
	// Get our initialized service so that we can register hooks
	const service = app.service('api/v1/reset');
	
	service.hooks(hooks);
};
