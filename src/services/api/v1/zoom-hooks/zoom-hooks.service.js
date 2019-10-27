const {ZoomHooks} = require('./zoom-hooks.class');

module.exports = function (app) {
	const options = {};
	
	app.use('/api/v1/zoom-hooks', new ZoomHooks(options, app));
	const service = app.service('api/v1/zoom-hooks');
};
