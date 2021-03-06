const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const posts = sequelizeClient.define('posts', {
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
	
	posts.associate = function (models) {
		posts.belongsTo(models.users);
		
	};
	
	return posts;
};
