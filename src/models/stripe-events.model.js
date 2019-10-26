const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const stripeEvents = sequelizeClient.define('stripe_events', {
		event_id: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		}
	}, {
		hooks: {
			beforeCount(options) {
				options.raw = true;
			}
		}
	});
	
	stripeEvents.associate = function (models) {
	
	};
	
	return stripeEvents;
};
