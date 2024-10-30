"use strict";
const bcrypt = require("bcrypt");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			User.hasMany(models.ReadingList, { foreignKey: "userId" });
		}
	}
	User.init(
		{
			username: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: {
					args: true,
					msg: "Email is taken",
				},
				validate: {
					isEmail: {
						args: true,
						msg: "Email format is wrong",
					},
					notNull: {
						msg: "Email is required",
					},
					notEmpty: {
						msg: "Email is required",
					},
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: {
						args: [5, 15],
						msg: "Password at least 5 characters",
					},
					notNull: {
						msg: "Input the password",
					},
					notNull: {
						msg: "Input the password",
					},
				},
			},
			role: {
				type: DataTypes.STRING,
				defaultValue: "User",
			},
		},
		{
			sequelize,
			modelName: "User",
			hooks: {
				beforeCreate: async (user) => {
					user.password = await bcrypt.hash(user.password, 10);
				},
			},
		}
	);
	return User;
};
