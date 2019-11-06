const {AuthenticationService, JWTStrategy} = require('@feathersjs/authentication');
const {LocalStrategy} = require('@feathersjs/authentication-local');
const {expressOauth} = require('@feathersjs/authentication-oauth');
const {NotAuthenticated} = require('@feathersjs/errors');
const {BadRequest} = require('@feathersjs/errors');
const {zoomAPI} = require('./services/api/v1/zoom/zoom.service');
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
					if (context.data.strategy === 'local') {
						const user = await context.app.service('/api/v1/users').Model.findOne({where: {email: context.data.email}});
						if (!user) {
							return context;
						}
						context.data.is_email_confirmed = user.is_email_confirmed;
						context.data.is_active = user.is_active;
						
						let hasZoom = !!user.zoom_id;
						let verified = false;
						
						if (hasZoom) {
							const zUser = await zoomAPI.get_user(user.zoom_id);
							verified = !!zUser.verified;
							if (zUser.code) {
								context.app.service('api/v1/users').Model.update(
									{zoom_id: null},
									{
										where: {
											id: result.user.id
										}
									}
								);
								hasZoom = false;
							}
						}
						
						context.params.payload = {
							username: user.username,
							email: user.email,
							firstName: user.firstName,
							lastName: user.lastName,
							role: user.role,
							hasZoom,
							verified
						};
					}
					
					return context;
				}
			],
		},
		after: {
			create: [
				async (context) => {
					const {result, params} = context;
					try {
						if (result.user && !result.user.is_email_confirmed) {
							throw new NotAuthenticated(ERROR_EMAIL_NOT_CONFIRMED)
						}
						if (result.user && !result.user.is_active) {
							throw new NotAuthenticated(ERROR_ACCOUNT_DEACTIVATED)
						}
						
						console.log('==+>', context);
						// override the User object
						context.result.user = {
							username: result.user.username,
							firstName: result.user.firstName,
							lastName: result.user.lastName,
							role: result.user.role,
							email: result.user.email,
							hasZoom: params.payload.hasZoom,
							verified: params.payload.verified
						};
						delete context.result.authentication;
					} catch (err) {
						throw new BadRequest('An error occurred');
					}
					
					return context;
				}
			],
		},
	});
	
	
};
