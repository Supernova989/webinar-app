const {Forbidden, BadRequest} = require('@feathersjs/errors');
const config = require('config');
const {ERROR_ZOOM_EP_FORBIDDEN} = require('../../../../dictionary');
const {zoomAPI} = require('../zoom/zoom.service');
const {
	zWH_EVENT_MEETING_CREATED,
	zWH_EVENT_MEETING_STARTED,
	zWH_EVENT_MEETING_UPDATED,
	zWH_EVENT_MEETING_ENDED,
	zWH_EVENT_MEETING_DELETED,
	zWH_EVENT_REGISTRATION_CREATED,
	zWH_EVENT_REGISTRATION_CANCELLED
} = require('../../../../constants');

exports.ZoomHooks = class ZoomHooks {
	constructor(options) {
		this.options = options || {};
	}
	
	async find(params) {
		return [];
	}
	
	async get(id, params) {
		return {
			id, text: `A new message with ID: ${id}!`
		};
	}
	
	async create(data, params) {
		// console.log("data: ", data);
		// console.log("params: ", params);
		// console.log("=============");
		if (!params.headers.authorization || params.headers.authorization !== config.get('zoom').webhook_secret) {
			throw new Forbidden(ERROR_ZOOM_EP_FORBIDDEN);
		}
		data = data || {};
		let object;
		
		try {
			const {payload: {object: _object}} = data;
			object = _object;
		} catch (e) {
			console.log('Error! ', e);
		}

		switch (data.event) {
			case zWH_EVENT_MEETING_CREATED: {
				const {uuid, id} = object;
				const meeting = await zoomAPI.get_meeting_details(id);
				console.log(`======== Meeting created (id: ${id}, uuid: ${uuid}) =========`);
				object._id = object.id;
				delete object.id;
				object.join_url = meeting.join_url || 'https://zoom.us/j/' + object.id;
				object.agenda = meeting.agenda;
				console.log('to create:', object);
				const zm = await this.options.zoomMeetingsService.create(object);
				console.log('created:', zm);
				break;
			}
			case zWH_EVENT_MEETING_STARTED: {
				const {uuid, id} = object;
				console.log(`======== Meeting started (id: ${id}, uuid: ${uuid}) =========`);
				const zm = await this.options.zoomMeetingsService.Model.findOne({where: {_id: id}});
				if (zm) {
					const result = await this.options.zoomMeetingsService.patch(zm.id, {started: true});
				}
				break;
			}
			case zWH_EVENT_MEETING_ENDED: {
				const {uuid, id} = object;
				console.log(`======== Meeting ended (id: ${id}, uuid: ${uuid}) =========`);
				console.log('ended meeting', data);
				const zm = await this.options.zoomMeetingsService.Model.findOne({where: {_id: id, uuid}});
				const meeting = await zoomAPI.get_meeting_details(id);
				console.log('new meeting', meeting);
				if (zm && meeting.uuid) {
					const result = await this.options.zoomMeetingsService.patch(zm.id, {started: false, uuid: meeting.uuid});
				}
				break;
			}
			case zWH_EVENT_MEETING_UPDATED: {
				const {id} = object;
				console.log(`======== Meeting updated (id: ${id}  =========`);
				const zm = await this.options.zoomMeetingsService.Model.findOne({where: {_id: id}});
				if (zm) {
					const updates = Object.assign({}, object);
					delete updates.id;
					const result = await this.options.zoomMeetingsService.patch(zm.id, updates);
				}
				break;
			}
			case zWH_EVENT_MEETING_DELETED: {
				const {id} = object;
				console.log(`======== Meeting deleted (id: ${id}  =========`);
				break;
			}
			case zWH_EVENT_REGISTRATION_CREATED: {
				const {registrant, uuid, id} = object;
				
				console.log('======== ' + zWH_EVENT_REGISTRATION_CREATED + ' =========');
				console.log('registrant', registrant);
				console.log('uuid', uuid);
				console.log('id', id);
				
				break;
			}
			case zWH_EVENT_REGISTRATION_CANCELLED: {
				try {
					const {registrant, uuid, id} = object;
					console.log('======== ' + zWH_EVENT_REGISTRATION_CANCELLED + ' =========');
					console.log('registrant', registrant);
					console.log('uuid', uuid);
					console.log('id', id);
				} catch (e) {
				
				}
				break;
			}
			default: {
				console.log(`Unexpected Zoom event (${data.event})`);
				throw new BadRequest();
			}
		}
		
		return {};
	}
	
	async update(id, data, params) {
		return data;
	}
	
	async patch(id, data, params) {
		return data;
	}
	
	async remove(id, params) {
		return {id};
	}
};
