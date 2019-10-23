const requireHeader = require('./hooks/require-header');

module.exports = {
	before: {
		all: [
			requireHeader(),
		],
		find: [],
		get: [],
		create: [],
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
