const config = require('config');

/**
 * @param zoomAPI {ZoomAPI} - Zoom API instance
 * @param appInstance - Application instance
 */
const fetchUpcomingMeetings = (zoomAPI, appInstance) => {
	zoomAPI.get_upcoming_meetings().then(async ({meetings}) => {
		meetings = meetings || [];
		try {
			await appInstance.service('/api/v1/zoom-meetings').Model.update({active: false}, {where: {}});
		} catch (e) {
			console.log('An error occurred when cleaning the ZOOM meetings table! ', e);
		}
		let errors = [];
		for (let meeting of meetings) {
			const details = await zoomAPI.get_meeting_details(meeting.id);
			if (details.host_id === config.get('zoom').zoom_host_id) { // make sure that the host is who we need
				let found;
				try {
					found = await appInstance.service('/api/v1/zoom-meetings').Model.findOne({where: {_id: meeting.id, uuid: meeting.uuid}});
					if (!found) {
						const m = {
							topic: details.topic,
							uuid: details.uuid,
							agenda: details.agenda,
							start_time: details.start_time,
							duration: details.duration,
							join_url: details.join_url,
							_id: details.id,
							active: true
						};
						await appInstance.service('/api/v1/zoom-meetings').Model.create(m);
					}
				} catch (e) {
					errors.push(e);
				}
			}
		}
		if (errors.length > 0) {
			console.log('Some errors occurred when fetching ZOOM meetings! ', errors);
		}
	});
};


/**
 * @param instantly {boolean} - Whether to be execute immediately
 * @param delay {number} - Delay in seconds
 * @return {Number} - Numeric handler for an instance of setInterval
 */
const initZoomMeetingScheduler = (instantly = false, delay = 45) => {
	delay = delay < 20 ? 20 : delay;
	const intervalMS = delay * 1000;
	if (instantly) {
		setTimeout(fetchUpcomingMeetings, 1000);
	}
	return setInterval(fetchUpcomingMeetings, intervalMS);
};

module.exports = {
	fetchUpcomingMeetings,
	initZoomMeetingScheduler
};
