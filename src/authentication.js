const {AuthenticationService, JWTStrategy} = require('@feathersjs/authentication');
const {LocalStrategy} = require('@feathersjs/authentication-local');
const {expressOauth} = require('@feathersjs/authentication-oauth');
const {NotAuthenticated} = require('@feathersjs/errors');
const {
	ERROR_EMAIL_NOT_CONFIRMED,
	ERROR_ACCOUNT_DEACTIVATED
} = require('./dictionary');

module.exports = app => {
	const authentication = new AuthenticationService(app);
	
	authentication.register('jwt', new JWTStrategy());
	authentication.register('local', new LocalStrategy());
	
	app.use('/authentication', authentication);
	app.configure(expressOauth());
	
	app.service('authentication').hooks({
		before: {
			create: [
				async (context) => {
					const user = await context.app.service('/api/v1/users').Model.findOne({where: {email: context.data.email}});
					
					if (!user) {
						return context;
					}
					
					const {dataValues} = user;
					context.data.is_email_confirmed = dataValues.is_email_confirmed;
					context.data.is_active = dataValues.is_active;
					context.data.found = true;
					
					context.params.payload = {
						username: dataValues.username,
						role: dataValues.role,
					};
					
					return context;
				}
			],
		},
		after: {
			create: [
				async (context) => {
					const {result, data} = context;
					if (!data.is_email_confirmed && data.found) {
						throw new NotAuthenticated(ERROR_EMAIL_NOT_CONFIRMED)
					}
					if (!data.is_active && data.found) {
						throw new NotAuthenticated(ERROR_ACCOUNT_DEACTIVATED)
					}
					// override the User object
					context.result.user = {
						username: result.user.username,
						firstName: result.user.firstName,
						lastName: result.user.lastName,
						email: result.user.email
					};
					delete context.result.authentication;
					return context;
				}
			],
		},
	});
	
	
};
