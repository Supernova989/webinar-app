const {EmailTokens} = require('./email-tokens.class');
const createModel = require('../../../../models/email-tokens.model');
const hooks = require('./email-tokens.hooks');

module.exports = function (app) {
	const Model = createModel(app);
	const paginate = app.get('paginate');
	
	const options = {
		Model,
		paginate
	};
	
	app.use('/api/v1/email-tokens', new EmailTokens(options, app));
	const service = app.service('api/v1/email-tokens');
	service.hooks(hooks);
};
