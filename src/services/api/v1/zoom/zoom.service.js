const {Zoom} = require('./zoom.class');
const hooks = require('./zoom.hooks');
const {ZoomAPI} = require('./zoom_api');

module.exports.service = function (app) {
	
	const zoomAPI = new ZoomAPI(app);
	
	const options = {
		zoomAPI
	};
	
	app.use('/api/v1/zoom', new Zoom(options, app));
	const service = app.service('api/v1/zoom');
	service.hooks(hooks);
	
	const meetingScheduler = initZoomMeetingScheduler(zoomAPI, app, true, app.get('zoom').fetch_delay);
};

/**
 * @param zoomAPI {ZoomAPI} - Zoom API instance
 * @param appInstance - Application instance
 * @param instantly {boolean} - Whether to be execute immediately
 * @param delay {number} - Delay in seconds
 * @return {Number} - Numeric handler for an instance of setInterval
 */
function initZoomMeetingScheduler(zoomAPI, appInstance, instantly = false, delay = 30) {
	delay = delay < 20 ? 20 : delay;
	const intervalMS = delay * 1000;
	const fn = () => {
		zoomAPI.get_upcoming_meetings().then(async ({meetings}) => {
			meetings = meetings || [];
			try {
				await appInstance.service('/api/v1/zoom-meetings').Model.update({active: false}, {where: {}});
			}
			catch (e) {
				console.log('An error occurred when cleaning the ZOOM meetings table! ', e);
			}
			let errors = [];
			meetings.forEach(async (meeting) => {
				const m = {
					topic: meeting.topic,
					uuid: meeting.uuid,
					start_time: meeting.start_time,
					duration: meeting.duration,
					join_url: meeting.join_url,
					_id: meeting.id,
					active: true
				};
				const options = {
					where: {
						uuid: meeting.uuid
					},
					returning: false
				};
				try {
					return await appInstance.service('/api/v1/zoom-meetings').Model.upsert(m, options);
				}
				catch (e) {
					errors.push(e);
				}
			});
			if (errors.length > 0) {
				console.log('Some errors occurred when fetching ZOOM meetings! ', errors);
			}
		});
	};
	if (instantly) {
		fn();
	}
	return setInterval(fn, intervalMS);
}

module.exports.initZoomMeetingScheduler = initZoomMeetingScheduler;
