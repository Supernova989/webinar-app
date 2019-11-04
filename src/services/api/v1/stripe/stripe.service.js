const {Stripe} = require('./stripe.class');
const hooks = require('./stripe.hooks');
const {stripe, plan_id, public_key} = require('../../../../stripe');

module.exports = function (app) {
	
	const options = {
		stripe,
		plan_id,
		public_key,
		sessionService: app.service('/api/v1/stripe-sessions')
	};
	
	app.use('/api/v1/stripe', new Stripe(options, app));
	const service = app.service('api/v1/stripe');
	service.hooks(hooks);
};
