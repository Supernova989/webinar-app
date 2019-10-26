const {authenticate} = require('@feathersjs/authentication').hooks;
const {BadRequest} = require('@feathersjs/errors');
const generateEmailToken = require('../../hooks/generate-email-token');
const requireHeader = require('../../hooks/require-header');
const getStripeCustomerID = require('../../hooks/get-customer-id');
const require_role = require('../../hooks/require-role');
const {ROLE_ADMIN} = require('../../constants');
const {disallow, iff} = require('feathers-hooks-common');

const {
	hashPassword,
	protect
} = require('@feathersjs/authentication-local').hooks;

module.exports = {
	before: {
		all: [],
		find: [
			requireHeader(),
			authenticate('jwt'),
		],
		get: [
			requireHeader(),
			// todo only own
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
			// only own and certain fields when not Admin
			hashPassword('password'),
			authenticate('jwt')
		],
		patch: [
			requireHeader(),
			// only own and certain fields when not Admin
			hashPassword('password'),
			authenticate('jwt')
		],
		remove: [
			requireHeader(),
			require_role({roles: [ROLE_ADMIN]}),
			authenticate('jwt')
		]
	},
	
	after: {
		all: [
			protect('password')
		],
		find: [
			// only admin can list user
			iff((context) => {
				const obj = context.params.user || context.params.payload;
				const {role} = obj;
				if (role === ROLE_ADMIN) {
					return false;
				}
				return true;
			}, disallow('external')),
		],
		get: [],
		create: [
			getStripeCustomerID(),
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
