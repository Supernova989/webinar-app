// Initializes the `api/v1/settings` service on path `/api/v1/settings`
const {Settings} = require('./settings.class');
const createModel = require('../../../../models/settings.model');
const hooks = require('./settings.hooks');

module.exports = function (app) {
	const Model = createModel(app);
	
	const options = {
		Model
	};
	
	app.use('/api/v1/settings', new Settings(options, app));
	const service = app.service('api/v1/settings');
	service.hooks(hooks);
	
	service.setup = () => {
		const settings = {
			'MAINTENANCE': false,
			'ALLOW_REGISTRATION': true,
			
		};
	};
};
