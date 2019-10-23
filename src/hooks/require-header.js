const {Forbidden} = require('@feathersjs/errors');

module.exports = (options = {}) => {
	return async context => {
		const {params: {headers}} = context;
		if (!('x-request-client' in headers)) {
			throw new Forbidden();
		}
		return context;
	};
};
