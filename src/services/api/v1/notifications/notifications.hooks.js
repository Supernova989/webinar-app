const {authenticate} = require('@feathersjs/authentication').hooks;
const require_role = require('../../../../hooks/require-role');
const {ROLE_ADMIN} = require('../../../../constants');


module.exports = {
	before: {
		all: [],
		find: [],
		get: [],
		create: [
			// authenticate('jwt'),
			// require_role({roles: [ROLE_ADMIN]})
		],
		update: [
			authenticate('jwt'),
			require_role({roles: [ROLE_ADMIN]})
		],
		patch: [
			authenticate('jwt'),
			require_role({roles: [ROLE_ADMIN]})
		],
		remove: [
			authenticate('jwt'),
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
