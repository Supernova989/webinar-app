const {NotAuthenticated, Forbidden} = require('@feathersjs/errors');

module.exports = (options = {}) => {
	return async context => {
		console.log('IF BANNED: ', context.params);
		if (context.params.user && context.params.user && !context.params.user.is_active) {
			throw new Forbidden('Your account has been deactivated.');
		}
		return context;
	};
};
