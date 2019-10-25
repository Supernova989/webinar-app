const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const emailTokens = sequelizeClient.define('email_tokens', {
		token: {
			type: DataTypes.STRING,
			allowNull: false
		},
		used: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
	}, {
		hooks: {
			beforeCount(options) {
				options.raw = true;
			}
		}
	});
	
	emailTokens.associate = function (models) {
		emailTokens.belongsTo(models.users);
	};
	
	return emailTokens;
};
