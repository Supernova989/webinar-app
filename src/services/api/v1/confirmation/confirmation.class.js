// const {NotFound, Forbidden} = require('@feathersjs/errors');

exports.Confirmation = class Confirmation {
	constructor(options) {
		this.options = options || {};
	}
	
	async get(token, params) {
		let record = null;
		try {
			record = await this.options.tokenService.Model.findOne({where: {token}});
			if (!record || record.used) {
				this.options.response.notFound = true;
				return;
			}
			const {dataValues: {id}} = record;
			const result = await this.options.userService.Model.update(
				{is_email_confirmed: true},
				{returning: false, where: {id}}
			);
			if (result.length === 1 && result[0] !== 0) {
				record.used = true;
				await record.save()
			}
			this.options.response.found = true;
		} catch (e) {
			// todo handle error
		}
	}
};
