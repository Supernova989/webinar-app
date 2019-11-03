const {NotAuthenticated, Forbidden, BadRequest, NotFound} = require('@feathersjs/errors');
const sequelize = require('sequelize');
const moment = require('moment');
const crypto = require('crypto');

const GET_ROUTES = {
	MEETINGS: 'meetings',
	ZOOM_STATUS: 'status'
};
const POST_QUERIES = {
	ADD_REGISTRANT: 'add_registrant',
	REMOVE_REGISTRANT: 'remove_registrant',
};

exports.Zoom = class Zoom {
	constructor(options) {
		this.options = options || {};
	}
	
	async find(params) {
		return [];
	}
	
	async get(id, params) {
		const {user} = params;
		if (!user) {
			throw new NotAuthenticated();
		}
		let response = null;
		switch (id) {
			case GET_ROUTES.MEETINGS: {
				try {
					response = await this.options.zoomMeetingsService.Model.findAll({
						where: {
							start_time: {
								[sequelize.Op.gt]: new Date(new Date() - (7 * 24 * 60 * 60 * 1000))
							},
							disabled: false
						}
					});
				} catch (err) {
					console.log('Error [Zoom hook] - ', err);
				}
				if (response) {
					response = response.filter((r) => {
						return r.end_time > new Date();
					});
				}
				
				break;
			}
			
			case GET_ROUTES.ZOOM_STATUS: {
				try {
					response = {
						linked: !!user.zoom_id
					}
				} catch (err) {
					console.log('Error [Zoom hook] - ', err);
				}
				
				break;
			}
			
			default:
				throw new NotFound();
		}
		return response;
	}
	
	async create(data, params) {
		const {query, user} = params;
		if (!user) {
			throw new NotAuthenticated();
		}
		if (!query.q || !data.id) {
			throw new BadRequest();
		}
		let meeting, response = {};
		switch (query.q) {
			case POST_QUERIES.ADD_REGISTRANT: {
				try {
					meeting = await this.options.zoomMeetingsService.Model.findOne({where: {id: data.id}});
					if (meeting) {
						const hash = crypto.randomBytes(2).toString('hex');
						response = await this.options.zoomAPI.add_registrant(meeting._id, user.email, user.firstName, hash);
						await this.options.zoomRegistrantService.Model.create({
							zoomMeetingId: meeting.id,
							registrant_id: response.registrant_id,
							join_url: response.join_url,
							userId: user.id,
						});
					}
				} catch (err) {
					console.log('Error when adding new registrant', err);
					throw new BadRequest('An error occurred. Please try later.');
				}
				break;
			}
			
			case POST_QUERIES.REMOVE_REGISTRANT: {
				try {
				
				} catch (err) {
					console.log('Error when removing a registrant', err);
				}
				break;
			}
			
			default: {
				console.log('Nothing');
			}
		}
		console.log('data::', data);
		if (!meeting) {
			throw new NotFound('Meeting not found.');
		}
		return response;
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
