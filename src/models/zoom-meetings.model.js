const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const moment = require('moment');

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const zoomMeetings = sequelizeClient.define('zoom_meetings', {
		_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		uuid: {
			type: DataTypes.STRING,
			allowNull: false
		},
		start_time: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		duration: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		disabled: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		topic: {
			type: DataTypes.STRING(200),
			allowNull: false
		},
		agenda: {
			type: DataTypes.STRING(2000),
			allowNull: true,
		},
		end_time: {
			type: Sequelize.VIRTUAL(Sequelize.DATE),
			get() {
				return moment(this.getDataValue('start_time')).add(this.getDataValue('duration'), 'minutes').toDate()
			}
		},
		join_url: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		started: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
	}, {
		indexes: [
			{
				unique: true,
				fields: ['uuid', '_id']
			}
		],
		hooks: {
			beforeCount(options) {
				options.raw = true;
			}
		}
	});
	
	zoomMeetings.associate = function (models) {
		zoomMeetings.hasMany(models.zoom_registrants);
	};
	
	return zoomMeetings;
};
