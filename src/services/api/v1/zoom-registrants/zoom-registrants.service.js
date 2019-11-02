const {ZoomRegistrants} = require('./zoom-registrants.class');
const createModel = require('../../../../models/zoom-registrants.model');
const hooks = require('./zoom-registrants.hooks');

module.exports = function (app) {
	const Model = createModel(app);
	
	const options = {
		Model
	};
	
	app.use('/api/v1/zoom-registrants', new ZoomRegistrants(options, app));
	const service = app.service('api/v1/zoom-registrants');
	service.hooks(hooks);
};
