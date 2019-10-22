const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const zoomMeetings = sequelizeClient.define('zoom_meetings', {
		uuid: {
			type: DataTypes.STRING,
			allowNull: false
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		topic: {
			type: DataTypes.STRING,
			allowNull: false
		},
		start_time: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		duration: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		join_url: {
			type: DataTypes.STRING,
			allowNull: false,
		}
	}, {
		indexes: [
			{
				unique: true,
				fields: ['uuid']
			}
		],
		hooks: {
			beforeCount(options) {
				options.raw = true;
			}
		}
	});
	
	zoomMeetings.associate = function (models) {
	
	};
	
	return zoomMeetings;
};
