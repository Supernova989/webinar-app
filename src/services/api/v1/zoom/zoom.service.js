const {Zoom} = require('./zoom.class');
const hooks = require('./zoom.hooks');
const {ZoomAPI} = require('./zoom_api');
const {fetchUpcomingMeetings} = require('./func');
const zoomAPI = new ZoomAPI();


const service = (app) => {
	const options = {
		zoomAPI,
		zoomMeetingsService: app.service('/api/v1/zoom-meetings'),
	};
	
	app.use('/api/v1/zoom', new Zoom(options, app));
	const service = app.service('api/v1/zoom');
	service.hooks(hooks);
	
	service.fetchMeetings = () => {
		fetchUpcomingMeetings(zoomAPI, app);
	};
};

module.exports = {
	service,
	zoomAPI,
};
