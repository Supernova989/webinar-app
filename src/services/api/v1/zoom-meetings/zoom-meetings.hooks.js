const {authenticate} = require('@feathersjs/authentication').hooks;
const {disallow} = require('feathers-hooks-common');

module.exports = {
	before: {
		all: [
			disallow('external'),
		],
		find: [],
		get: [],
		create: [
			// (c) => {console.log('HERE', c); return c}
		],
		update: [],
		patch: [
		
		],
		remove: []
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
