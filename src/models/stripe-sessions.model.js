// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const stripeSessions = sequelizeClient.define('stripe_sessions', {
		session_token: {
			type: DataTypes.STRING(80),
			allowNull: false
		},
		expiresAt: {
			type: DataTypes.DATE,
			allowNull: false
		}
	}, {
		indexes: [
			{
				fields: ['expiresAt']
			}
		],
		hooks: {
			beforeCount(options) {
				options.raw = true;
			}
		}
	});
	
	stripeSessions.associate = function (models) {
		stripeSessions.belongsTo(models.users);
	};
	
	return stripeSessions;
};
