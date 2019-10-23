const {authenticate} = require('@feathersjs/authentication').hooks;
const {BadRequest} = require('@feathersjs/errors');

const {
	hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

module.exports = {
	before: {
		all: [],
		find: [authenticate('jwt')],
		get: [authenticate('jwt')],
		create: [
			(context) => {
				const {confirm, password} = context.data;
				if (confirm !== password) {
					throw new BadRequest('Passwords do not match.');
				}
				return context;
			},
			hashPassword('password'),
			
		],
		update: [hashPassword('password'), authenticate('jwt')],
		patch: [hashPassword('password'), authenticate('jwt')],
		remove: [authenticate('jwt')]
	},
	
	after: {
		all: [
			// Make sure the password field is never sent to the client
			// Always must be the last hook
			protect('password')
		],
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
		create: [
			(context) => {
				const {errors} = context.error;
				if (errors.length > 0 && errors[0].validatorKey === 'not_unique') {
					context.error.message = `This ${errors[0].path} is already in use.`
				}
				return context;
			}
		],
		update: [],
		patch: [],
		remove: []
	}
};
