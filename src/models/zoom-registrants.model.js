const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const zoomRegistrants = sequelizeClient.define('zoom_registrants', {
		registrant_id: {
			type: DataTypes.STRING,
			allowNull: false
		},
		join_url: {
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
	
	zoomRegistrants.associate = function (models) {
		zoomRegistrants.belongsTo(models.zoom_meetings);
	};
	
	return zoomRegistrants;
};
