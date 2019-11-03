const config = require('config');
const {sleep} = require('../../../../helpers');
const {uniqBy} = require('lodash');
const {Op} = require('sequelize');
const {ROLE_USER, ROLE_ASSISTANT} = require('../../../../constants');
/**
 * @param zoomAPI {ZoomAPI} - Zoom API instance
 * @param appInstance - Application instance
 */
const syncZoomUsers = async (zoomAPI, appInstance) => {
	const u = [];
	const r = await zoomAPI.get_users(1, 1);
	const {users, page_count} = r;
	u.push(...users);
	if (page_count > 1) {
		for (let p = 2; p <= page_count; p++) {
			await sleep(1000);
			const _r = await zoomAPI.get_users(p, 1);
			u.push(..._r.users);
		}
	}
	const uniqueUsers = uniqBy(u, (e) => e.id);
	const zoomUserIds = uniqueUsers.map(u => u.id);
	await appInstance.service('/api/v1/users').Model.update(
		{
			zoom_id: null
		},
		{
			where: {
				[Op.or]: [{role: ROLE_USER}, {role: ROLE_ASSISTANT}], // do NOT affect ADMIN users
				zoom_id: {
					[Op.notIn]: zoomUserIds
				}
			}
		}
	);
};

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
const initZoomUserSyncScheduler = (zoomAPI, appInstance, instantly = false, delay = 60) => {
	delay = delay < 20 ? 20 : delay;
	const intervalMS = delay * 1000;
	if (instantly) {
		setTimeout(() => {syncZoomUsers(zoomAPI, appInstance);}, 1000);
	}
	return setInterval(() => {syncZoomUsers(zoomAPI, appInstance);}, intervalMS);
};

module.exports = {
	fetchUpcomingMeetings,
	initZoomUserSyncScheduler
};
