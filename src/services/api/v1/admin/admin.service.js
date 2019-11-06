// Initializes the `api/v1/admin` service on path `/api/v1/admin`
const {Admin} = require('./admin.class');
const hooks = require('./admin.hooks');

module.exports = function (app) {
	
	const paginate = app.get('paginate');
	
	const options = {
		paginate
	};
	
	// Initialize our service with any options it requires
	app.use('/api/v1/admin', new Admin(options, app));
	
	// Get our initialized service so that we can register hooks
	const service = app.service('api/v1/admin');
	
	service.hooks(hooks);
};
