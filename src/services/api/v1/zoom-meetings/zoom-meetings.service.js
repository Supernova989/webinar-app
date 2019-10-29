const {ZoomMeetings} = require('./zoom-meetings.class');
const createModel = require('../../../../models/zoom-meetings.model');
const hooks = require('./zoom-meetings.hooks');

module.exports = function (app) {
	const Model = createModel(app);
	const paginate = app.get('paginate');
	
	const options = {
		Model,
		paginate
	};
	
	app.use('/api/v1/zoom-meetings', new ZoomMeetings(options, app));
	const service = app.service('api/v1/zoom-meetings');
	service.hooks(hooks);
};
