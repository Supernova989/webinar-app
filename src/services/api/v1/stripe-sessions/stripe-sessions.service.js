// Initializes the `api/v1/stripe-sessions` service on path `/api/v1/stripe-sessions`
const {StripeSessions} = require('./stripe-sessions.class');
const createModel = require('../../../../models/stripe-sessions.model');
const hooks = require('./stripe-sessions.hooks');

module.exports = function (app) {
	const Model = createModel(app);
	const paginate = app.get('paginate');
	
	const options = {
		Model,
		paginate
	};
	
	app.use('/api/v1/stripe-sessions', new StripeSessions(options, app));
	const service = app.service('api/v1/stripe-sessions');
	service.hooks(hooks);
};
