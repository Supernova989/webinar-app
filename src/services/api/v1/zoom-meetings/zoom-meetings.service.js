// Initializes the `api/v1/zoom-meetings` service on path `/api/v1/zoom-meetings`
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
	
	// Initialize our service with any options it requires
	app.use('/api/v1/zoom-meetings', new ZoomMeetings(options, app));
	
	// Get our initialized service so that we can register hooks
	const service = app.service('api/v1/zoom-meetings');
	
	service.hooks(hooks);
};
