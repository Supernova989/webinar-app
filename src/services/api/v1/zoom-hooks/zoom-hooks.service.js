const {ZoomHooks} = require('./zoom-hooks.class');

module.exports = function (app) {
	const options = {
		zoomMeetingsService: app.service('/api/v1/zoom-meetings'),
		userService: app.service('/api/v1/users'),
		subscriptionService: app.service('/api/v1/subscriptions'),
	};
	
	app.use('/api/v1/zoom-hooks', new ZoomHooks(options, app));
	const service = app.service('api/v1/zoom-hooks');
};
