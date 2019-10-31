const {NotAuthenticated, Forbidden, NotFound} = require('@feathersjs/errors');

const GET_ROUTES = {
	MEETINGS: 'get_meetings'
};

exports.Zoom = class Zoom {
	constructor(options) {
		this.options = options || {};
	}
	
	async find(params) {
		return [];
	}
	
	async get(id, params) {
		console.log('ID', id);
		console.log('PARAMS', params);
		let response = null;
		
		switch (id) {
			case GET_ROUTES.MEETINGS:
				response = await this.options.zoomMeetingsService.Model.findAll({
					where: {
					
					}
				});
				break;
			default:
				throw new NotFound();
		}
		return response;
	}
	
	async create(data, params) {
		console.log('PARAMS', params);
		if (Array.isArray(data)) {
			return Promise.all(data.map(current => this.create(current, params)));
		}
		
		return data;
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
