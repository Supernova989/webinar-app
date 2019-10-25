const {Confirmation} = require('./confirmation.class');
const hooks = require('./confirmation.hooks');

module.exports = function (app) {
	const options = {
		tokenService: app.service('api/v1/email-tokens'),
		userService: app.service('api/v1/users'),
	};
	app.use('/api/v1/confirmation',
		(req, res, next) => {
			// options.response = res;
			if (!res.data) {
				res.data = {};
			}
			options.response = res;
			next();
		},
		new Confirmation(options, app),
		(req, res, next) => {
			if (res.notFound) {
				res.status(404).send('This token is either invalid or has already been used.');
			}
			else if (res.found) {
				res.status(200).send('Your email has been confirmed successfully!');
			}
			else {
				next();
			}
		},
	);
	const service = app.service('api/v1/confirmation');
	service.hooks(hooks);
};
