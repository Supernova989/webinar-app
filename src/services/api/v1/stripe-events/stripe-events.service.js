// Initializes the `api/v1/stripe-events` service on path `/api/v1/stripe-events`
const {StripeEvents} = require('./stripe-events.class');
const createModel = require('../../../../models/stripe-events.model');
const hooks = require('./stripe-events.hooks');

module.exports = function (app) {
	const Model = createModel(app);
	const paginate = app.get('paginate');
	
	const options = {
		Model,
		paginate
	};
	
	// Initialize our service with any options it requires
	app.use('/api/v1/stripe-events', new StripeEvents(options, app));
	
	// Get our initialized service so that we can register hooks
	const service = app.service('api/v1/stripe-events');
	
	service.hooks(hooks);
};
