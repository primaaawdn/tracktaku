'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = require("../data/mangas.json").map((e) => {
			delete e.id;
			e.createdAt = new Date();
			e.updatedAt = new Date();
			return e;
		});
		await queryInterface.bulkInsert("Mangas", data, {});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
			'TRUNCATE TABLE "Mangas" RESTART IDENTITY CASCADE'
		);
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
