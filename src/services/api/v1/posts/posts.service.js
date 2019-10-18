// Initializes the `api/v1/posts` service on path `/api/v1/posts`
const {Posts} = require('./posts.class');
const createModel = require('../../../../models/posts.model');
const hooks = require('./posts.hooks');

module.exports = function (app) {
	const Model = createModel(app);
	const paginate = app.get('paginate');
	
	const options = {
		Model,
		paginate
	};
	
	// Initialize our service with any options it requires
	app.use('/api/v1/posts', new Posts(options, app));
	
	// Get our initialized service so that we can register hooks
	const service = app.service('api/v1/posts');
	
	service.hooks(hooks);
};
