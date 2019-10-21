const {Stripe} = require('./stripe.class');
const hooks = require('./stripe.hooks');

module.exports = function (app) {
	
	// const paginate = app.get('paginate');
	
	let prefix = '';
	if (app.get('stripe').use_demo_mode) {
		prefix = 'demo_';
	}
	const stripe = require('stripe')(app.get('stripe')[prefix + 'secret_key']);
	const options = {
		stripe,
		plan_id: app.get('stripe')['subscription_plan_id'],
		public_key: app.get('stripe')[prefix + 'public_key']
	};
	
	// Initialize our service with any options it requires
	app.use('/api/v1/stripe', new Stripe(options, app));
	
	// Get our initialized service so that we can register hooks
	const service = app.service('api/v1/stripe');
	
	service.hooks(hooks);
};
