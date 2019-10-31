const {authenticate} = require('@feathersjs/authentication').hooks;
const {disallow} = require('feathers-hooks-common');

module.exports = {
	before: {
		all: [
			// authenticate('jwt')
			// async (context) => {
			// 	console.log('CONTEXT: ', context);
			// 	return context;
			// }
		],
		find: [],
		get: [
			authenticate('jwt'),
			// disallow('external'), // only for Internal use
		
		],
		create: [
			authenticate('jwt'),
		],
		update: [],
		patch: [],
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
