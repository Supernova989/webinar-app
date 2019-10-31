const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const settings = sequelizeClient.define('settings', {
		key: {
			type: DataTypes.STRING,
			allowNull: false
		},
		VALUE: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
		order: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		indexes: [
			{
				unique: true,
				fields: ['key']
			}
		],
		hooks: {
			beforeCount(options) {
				options.raw = true;
			}
		}
	});
	
	
	settings.associate = function (models) {
	
	};
	
	return settings;
};
