const {authenticate} = require('@feathersjs/authentication').hooks;
const require_role = require('../../../../hooks/require-role');
const {ROLE_ADMIN} = require('../../../../constants');


module.exports = {
	before: {
		all: [
			authenticate('jwt'),
		],
		find: [
			
			// (c) => {
			// 	console.log('==>', c.params.user);
			// 	return c;
			// }
		],
		get: [
			
			require_role({roles: [ROLE_ADMIN]})
		],
		create: [
			
			require_role({roles: [ROLE_ADMIN]})
		],
		patch: [
			
			require_role({roles: [ROLE_ADMIN]})
		],
		remove: [
			
			require_role({roles: [ROLE_ADMIN]})
		]
	},
	
	after: {
		all: [],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	},
	
	error: {
		all: [],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	}
};
