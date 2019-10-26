const crypto = require('crypto');

module.exports = (options = {}) => {
	return async context => {
		const model = {
			token: crypto.randomBytes(32).toString('hex'), // = 64 digit string
			userId: context.result.id
		};
		try {
			const token = await context.app.service('api/v1/email-tokens').Model.create(model);
		}
		catch (e) {
			// todo handle
		}
		
		return context;
	};
};
