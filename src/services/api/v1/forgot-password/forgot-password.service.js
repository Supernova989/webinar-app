// Initializes the `api/v1/forgot-password` service on path `/api/v1/forgot-password`
const {ForgotPassword} = require('./forgot-password.class');
const createModel = require('../../../../models/forgot-password.model');
const hooks = require('./forgot-password.hooks');

module.exports = function (app) {
	const Model = createModel(app);
	const paginate = app.get('paginate');
	
	const options = {
		Model,
		paginate
	};
	
	// Initialize our service with any options it requires
	app.use('/api/v1/forgot-password', new ForgotPassword(options, app));
	
	// Get our initialized service so that we can register hooks
	const service = app.service('api/v1/forgot-password');
	
	service.hooks(hooks);
};
