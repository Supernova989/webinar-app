const {NotAuthenticated, Forbidden} = require('@feathersjs/errors');

module.exports = (options = {}) => {
	return async context => {
		const roles = options.roles || [];
		const {user} = context.params;
		if (!user) {
			throw new NotAuthenticated();
		}
		const hasRole = roles.indexOf(user.role) !== -1;
		if (!hasRole) {
			throw new Forbidden('You have no rights to perform this action')
		}
		return context;
	};
};
