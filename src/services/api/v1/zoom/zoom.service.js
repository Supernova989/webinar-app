const {Zoom} = require('./zoom.class');
const hooks = require('./zoom.hooks');
const {ZoomAPI} = require('./zoom_api');
const {
	fetchUpcomingMeetings,
	// initZoomUserSyncScheduler
} = require('./func');
const zoomAPI = new ZoomAPI();

const service = (app) => {
	const options = {
		zoomAPI,
		zoomMeetingsService: app.service('/api/v1/zoom-meetings'),
		userService: app.service('/api/v1/users'),
		zoomRegistrantService: app.service('api/v1/zoom-registrants')
	};
	
	app.use('/api/v1/zoom', new Zoom(options, app));
	const service = app.service('api/v1/zoom');
	service.hooks(hooks);
	
	service.fetchMeetings = () => {
		fetchUpcomingMeetings(zoomAPI, app);
	};
	
	// service.zoomUserSyncScheduler = () => {
	// 	initZoomUserSyncScheduler(zoomAPI, app, true);
	// };
};

module.exports = {
	service,
	zoomAPI,
};
