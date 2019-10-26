const {stripe} = require('../stripe');
const {BadRequest} = require('@feathersjs/errors');

/**
 *	Obtains a customerID value from StripeAPI and saves it to the User model that is being created.
 *	If no customerID value has been received, the user gets deleted, and the creation request throws an error
 */
module.exports = (options = {}) => {
	return async context => {
		const {id, email, username} = context.result;
		let user;
		try {
			user = await context.app.service('api/v1/users').Model.findOne({where: {id}});
			const {id: customer_id} = await stripe.customers.create({email, metadata: {username}});
			user.customer_id = customer_id;
			await user.save();
		}
		catch (e) {
			// todo inform of the error
			if (user) {
				await user.destroy();
				throw new BadRequest('An error occurred. Please try again.');
			}
		}
		return context;
	};
};
