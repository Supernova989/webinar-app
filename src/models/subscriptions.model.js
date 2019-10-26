const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const subscriptions = sequelizeClient.define('subscriptions', {
		subscription_id: {
			type: DataTypes.STRING,
			allowNull: false
		},
		has_scheduled_cancellation: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		scheduled_cancellation_date: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		billing_cycle_anchor: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		current_period_end: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		cancelled: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		
	}, {
		indexes: [
			{
				unique: true,
				fields: ['subscription_id']
			}
		],
		hooks: {
			beforeCount(options) {
				options.raw = true;
			}
		}
	});
	
	// eslint-disable-next-line no-unused-vars
	subscriptions.associate = function (models) {
		subscriptions.belongsTo(models.users);
	};
	
	return subscriptions;
};
