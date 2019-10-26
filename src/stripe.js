const config = require('config');

let prefix = '';
if (config.get('stripe').use_demo_mode) {
	prefix = 'demo_';
}
const stripe = require('stripe')(config.get('stripe')[prefix + 'secret_key']);
const plan_id = config.get('stripe')['subscription_plan_id'];
const public_key = config.get('stripe')[prefix + 'public_key'];

module.exports = {
	stripe,
	plan_id,
	public_key
};
