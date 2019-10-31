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
		all: [
			(context) => {
			if (context.error && Array.isArray(context.error.errors)) {
				context.error.errors = context.error.errors.map((e,id)=> {
					return {
						id,
						message: e.message,
						path: e.path,
						value: e.value,
						validationKey: e.validationKey,
					};
				});
			}
			else if (context.error && !Array.isArray(context.error.errors) && typeof context.error.errors === 'object') {
				context.error.errors = [{id: 0, message: context.error.message}];
			}
			// console.log('HERE', context.error);
			return context;
			}
		],
		find: [],
		get: [],
		create: [],
		update: [],
		patch: [],
		remove: []
	}
};
