const {NotAuthenticated, Forbidden, BadRequest, NotFound} = require('@feathersjs/errors');
const sequelize = require('sequelize');
const moment = require('moment');
const crypto = require('crypto');
const {validate: isEmailValid} = require('email-validator');
const GET_ROUTES = {
	MEETINGS: 'meetings',
	ZOOM_STATUS: 'status'
};
const POST_QUERIES = {
	ADD_REGISTRANT: 'add_registrant',
	REMOVE_REGISTRANT: 'remove_registrant',
	BIND: 'bind'
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
								[sequelize.Op.gt]: new Date(new Date() - (24 * 60 * 60 * 1000))
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
		if (!query.q) {
			throw new BadRequest();
		}
		
		let meeting, response = {};
		
		switch (query.q) {
			// case POST_QUERIES.ADD_REGISTRANT: {
			// 	if (!data.id) {
			// 		throw new BadRequest('No ID provided.');
			// 	}
			//
			// 	try {
			// 		meeting = await this.options.zoomMeetingsService.Model.findOne({where: {id: data.id}});
			// 		if (meeting) {
			// 			const hash = crypto.randomBytes(2).toString('hex');
			// 			response = await this.options.zoomAPI.add_registrant(meeting._id, user.email, user.firstName, hash);
			// 			await this.options.zoomRegistrantService.Model.create({
			// 				zoomMeetingId: meeting.id,
			// 				registrant_id: response.registrant_id,
			// 				join_url: response.join_url,
			// 				userId: user.id,
			// 			});
			// 		}
			// 	} catch (err) {
			// 		console.log('Error when adding new registrant', err);
			// 		throw new BadRequest('An error occurred. Please try later.');
			// 	}
			// 	break;
			// }
			
			// case POST_QUERIES.REMOVE_REGISTRANT: {
			// 	try {
			//
			// 	} catch (err) {
			// 		console.log('Error when removing a registrant', err);
			// 	}
			// 	break;
			// }
			
			case POST_QUERIES.BIND: { // zYI0UCddRRS19s38YiNZyg
				console.log(data);
				if (!isEmailValid(data.email)) {
					throw new BadRequest('Valid Email is required.');
				}
				const email = data.email.trim();
				let check;
				if (user.zoom_id) {
					throw new BadRequest('Already linked.')
				}
				try {
					check = await this.options.zoomAPI.check_email(email);
					if (!check.existed_email) {
						const zoom_user = await this.options.zoomAPI.create_user(user.email, user.firstName, user.lastName);
						if (zoom_user.code) {
							throw new Error();
						} else {
							await this.options.userService.Model.update({zoom_id: zoom_user.id}, {where: {id: user.id}});
							response = {success: true};
						}
					}
					if (check.existed_email) {
						throw new Error();
					}
				} catch (err) {
					console.log('Error when binding user to Zoom account', err);
					throw new BadRequest('Cannot use this email.');
				}
				
				break;
			}
			
			default: {
				console.log('Nothing');
			}
		}
		console.log('data::', data);
		// if (!meeting) {
		// 	throw new NotFound('Meeting not found.');
		// }
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
