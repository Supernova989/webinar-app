const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const emailTokens = sequelizeClient.define('email_tokens', {
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
	emailTokens.associate = function (models) {
	
	};
	
	return emailTokens;
};
