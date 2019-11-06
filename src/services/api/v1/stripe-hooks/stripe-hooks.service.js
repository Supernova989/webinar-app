const {StripeHooks} = require('./stripe-hooks.class');
const bodyParser = require('body-parser');

module.exports = function (app) {
	const options = {
		stripeEventService: app.service('api/v1/stripe-events'),
		subscriptionService: app.service('api/v1/subscriptions'),
		userService: app.service('api/v1/users')
	};
	
	app.use('/api/v1/stripe-hooks',
		bodyParser.raw({type: 'application/json'}),
		(req, res, next) => {
			if (!res._data) {
				res._data = {};
			}
			if (req.rawBody) {
				options.rawBody = req.rawBody;
			}
			options.response = res;
			next();
		},
		new StripeHooks(options, app),
		(req, res, next) => {
			if (res._data.badRequest) {
				res.status(400).send(res._data.badRequest);
			} else if (res._data.received) {
				res.json({received: true});
			} else {
				next();
			}
		}
	);
	const service = app.service('api/v1/stripe-hooks');
};
