"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const data = require("../data/users.json").map((e) => {
			delete e.id;
			e.createdAt = new Date();
			e.updatedAt = new Date();
      e.password = bcrypt.hashSync(e.password, 10);
			return e;
		});
		await queryInterface.bulkInsert("Users", data, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.sequelize.query(
			'TRUNCATE TABLE "Users" RESTART IDENTITY CASCADE'
		);
	},
};
