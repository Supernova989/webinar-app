const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const subscriptions = sequelizeClient.define('subscriptions', {
		text: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		hooks: {
			beforeCount(options) {
				options.raw = true;
			}
		}
	});
	
	// eslint-disable-next-line no-unused-vars
	subscriptions.associate = function (models) {
	
	};
	
	return subscriptions;
};
