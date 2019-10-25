const {authenticate} = require('@feathersjs/authentication').hooks;
const {BadRequest} = require('@feathersjs/errors');
const generateEmailToken = require('../../hooks/generate-email-token');
const requireHeader = require('../../hooks/require-header');

const {
	hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

module.exports = {
	before: {
		all: [],
		find: [
			requireHeader(),
			authenticate('jwt')
		],
		get: [
			requireHeader(),
			authenticate('jwt')
		],
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
		update: [
			requireHeader(),
			hashPassword('password'),
			authenticate('jwt')
		],
		patch: [
			requireHeader(),
			hashPassword('password'),
			authenticate('jwt')
		],
		remove: [
			requireHeader(),
			authenticate('jwt')
		]
	},
	
	after: {
		all: [
			protect('password')
		],
		find: [],
		get: [],
		create: [
			generateEmailToken(),
			(context) => {
				
				// send a confirmation email
				// console.log('result', context.result);
				
				return context;
			},
		],
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
