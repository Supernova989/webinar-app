const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const users = sequelizeClient.define('users', {
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			maxLength: 20
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			maxLength: 80
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
			maxLength: 64
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
			maxLength: 64
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		is_email_confirmed: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		role: {
			type: DataTypes.INTEGER,  // 'USER': 1, 'ASSISTANT': 2, 'ADMIN': 3
			default: 1
		},
		
	}, {
		hooks: {
			beforeCount(options) {
				options.raw = true;
			}
		}
	});
	
	// eslint-disable-next-line no-unused-vars
	users.associate = function (models) {
		// console.log(models);
		users.hasMany(models.posts);
	};
	return users;
};
