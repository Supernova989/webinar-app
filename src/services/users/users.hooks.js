const {authenticate} = require('@feathersjs/authentication').hooks;
const {BadRequest, Forbidden} = require('@feathersjs/errors');
const generateEmailToken = require('../../hooks/generate-email-token');
const requireHeader = require('../../hooks/require-header');
const getStripeCustomerID = require('../../hooks/get-customer-id');
const require_role = require('../../hooks/require-role');
const filterDataFields = require('../../hooks/filter-data-fields');
const {disallow, iff} = require('feathers-hooks-common');
const {ROLE_ADMIN} = require('../../constants');
const {ERROR_NO_RIGHTS} = require('../../dictionary');

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
			// only admin can list user
			iff((context) => {
				if (!context.params.user) {
					return false; // user do not exist
				}
				const obj = context.params.user;
				const {role} = obj;
				if (role === ROLE_ADMIN) {
					return false;
				}
				return true;
			}, disallow('external')),
		],
		get: [
			requireHeader(),
			authenticate('jwt'),
			(context) => {
				const {user} = context.params;
				if (!user) {
					return context;
				}
				const {role, id} = user;
				if (context.params.provider === 'rest' && role !== ROLE_ADMIN && parseInt(context.id) !== id) {
					throw new Forbidden(ERROR_NO_RIGHTS);
				}
				return context
			}
		],
		create: [
			requireHeader(),
			(context) => {
				const {confirm, password} = context.data;
				if (confirm !== password) {
					throw new BadRequest('Passwords do not match.');
				}
				return context;
			},
			filterDataFields('role', 'is_active', 'is_email_confirmed', 'customer_id', 'zoom_id', 'uuid'),
			hashPassword('password'),
		],
		update: [],
		patch: [
			requireHeader(),
			hashPassword('password'),
			authenticate('jwt'),
			require_role({roles: [ROLE_ADMIN]}),
		],
		remove: [
			requireHeader(),
			authenticate('jwt'),
			require_role({roles: [ROLE_ADMIN]}),
		]
	},
	
	after: {
		all: [
			protect('password')
		],
		find: [],
		get: [],
		create: [
			getStripeCustomerID(),
			generateEmailToken(),
			
			// send a confirmation email
			
			(context) => {
				const {result: {uuid, firstName, email}} = context;
				context.dispatch = {uuid, firstName, email};
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
