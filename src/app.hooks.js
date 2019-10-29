const requireHeader = require('./hooks/require-header');
const { disallow, iff } = require('feathers-hooks-common');
const isNotPath = require('./hooks/is-not-path');

const beforeAllExceptions = [
	'api/v1/confirmation',
	'api/v1/users',
	'api/v1/stripe-hooks',
	'api/v1/zoom-hooks',
];

module.exports = {
	before: {
		all: [
			iff(isNotPath(beforeAllExceptions), requireHeader())
		],
		find: [
		
		],
		get: [
		
		],
		create: [
		
		],
		update: [
			disallow(),
		],
		patch: [
		],
		remove: [
		
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
