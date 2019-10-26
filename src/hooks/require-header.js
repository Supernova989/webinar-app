const {Forbidden} = require('@feathersjs/errors');

module.exports = (options = {}) => {
	return async context => {
		const {params: {headers}} = context;
		// console.log('2222 ', context);
		// console.log('2222 ', context.params.headers);
		if (context.params.provider === 'rest' && !('x-request-client' in headers)) {
			throw new Forbidden();
		}
		return context;
	};
};
