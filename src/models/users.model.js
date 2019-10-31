const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const {BadRequest} = require('@feathersjs/errors');
const {
	ERROR_INVALID_EMAIL,
	ERROR_EMAIL_DOMAIN_NOT_SUPPORTED
} = require('../dictionary');

module.exports = function (app) {
	const sequelizeClient = app.get('sequelizeClient');
	const users = sequelizeClient.define('users', {
		username: {
			type: DataTypes.STRING(20),
			allowNull: false,
			unique: true,
			validate: {
				len: [4, 20]
			}
		},
		email: {
			type: DataTypes.STRING(80),
			allowNull: false,
			unique: true,
			validate: {
				isEmail: {
					msg: ERROR_INVALID_EMAIL
				},
				isAllowedDomain() {
					if (this.email.indexOf('@') === -1) {
						throw new BadRequest(ERROR_INVALID_EMAIL);
					}
					const domain = String(this.email.split('@')[1]).toLowerCase();
					if (!app.get('allowedEmailDomains').find(d => d === domain)) {
						throw new BadRequest(ERROR_EMAIL_DOMAIN_NOT_SUPPORTED);
					}
				}
			}
		},
		uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			unique: true
		},
		firstName: {
			type: DataTypes.STRING(64),
			allowNull: false,
			validate: {
				len: [2, 64]
			}
		},
		lastName: {
			type: DataTypes.STRING(64),
			allowNull: true,
			validate: {
				len: {
					args: [0, 64],
					msg: 'Field Last Name is too long.'
				}
			}
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true
		},
		is_email_confirmed: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		role: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
			validate: {
				is: /^[123]$/, // 'USER': 1, 'ASSISTANT': 2, 'ADMIN': 3
			}
		},
		customer_id: { // for Stripe
			type: DataTypes.STRING(128),
			unique: true,
			allowNull: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		
	}, {
		indexes: [
			{
				unique: true,
				fields: ['customer_id']
			}
		],
		hooks: {
			beforeCount(options) {
				options.raw = true;
			}
		}
	});
	
	// eslint-disable-next-line no-unused-vars
	users.associate = function (models) {
		users.hasMany(models.posts);
		users.hasMany(models.subscriptions);
		users.hasMany(models.email_tokens, {onDelete: 'cascade'});
	};
	return users;
};
