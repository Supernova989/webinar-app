// const {NotFound, Forbidden} = require('@feathersjs/errors');
const {zoomAPI} = require('../zoom/zoom.service');

exports.Confirmation = class Confirmation {
	constructor(options) {
		this.options = options || {};
	}
	
	async get(token, params) {
		let record = null;
		try {
			record = await this.options.tokenService.Model.findOne({where: {token}});
			if (!record || record.used) {
				this.options.response._data.notFound = true;
				return;
			}
			const {dataValues: {id}} = record;
			const user = await this.options.userService.Model.findOne({where: {id}});
			user.is_email_confirmed = true;
			record.used = true;
			record.save();
			const zoom_user = await zoomAPI.create_user(user.email, user.firstName, user.lastName);
			// console.log('zoom_user', zoom_user);
			user.zoom_id = zoom_user.id;
			const update = user.save();
			// const result = await this.options.userService.Model.update(
			// 	{is_email_confirmed: true},
			// 	{returning: false, where: {id}}
			// );
			// if (result.length === 1 && result[0] !== 0) {
			// 	record.used = true;
			// 	await record.save();
			// 	await zoomAPI.create_user()
			// }
			this.options.response._data.found = true;
		} catch (err) {
			console.log('Error - confirmation - ', err);
			// todo handle error
		}
	}
};
