const {authenticate} = require('@feathersjs/authentication').hooks;
const require_role = require('../../../../hooks/require-role');

const role = 3; // admin only

module.exports = {
	before: {
		all: [],
		find: [],
		get: [],
		create: [
			authenticate('jwt'),
			require_role({roles: [role]})
		],
		update: [
			authenticate('jwt'),
			require_role({roles: [role]})
		],
		patch: [
			authenticate('jwt'),
			require_role({roles: [role]})
		],
		remove: [
			authenticate('jwt'),
			require_role({roles: [role]})
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
