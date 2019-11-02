const {NotAuthenticated, Forbidden} = require('@feathersjs/errors');
const {ERROR_NO_RIGHTS} = require('../dictionary');

module.exports = (options = {}) => {
	return async context => {
		const roles = options.roles || [];
		const {provider, user} = context.params;
		
		if (provider === 'rest') { // request via REST
			if (!user) {
				throw new NotAuthenticated();
			}
			const hasRole = roles.indexOf(user.role) !== -1;
			if (!hasRole) {
				throw new Forbidden(ERROR_NO_RIGHTS)
			}
		}
		return context;
	};
};
