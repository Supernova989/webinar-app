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
	
	app.use('/api/v1/subscriptions', new Subscriptions(options, app));
	const service = app.service('api/v1/subscriptions');
	service.hooks(hooks);
};
