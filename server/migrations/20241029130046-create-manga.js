"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Mangas", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			title: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			description: {
				type: Sequelize.TEXT,
			},
			lastVolume: {
				type: Sequelize.INTEGER,
			},
			lastChapter: {
				type: Sequelize.INTEGER,
			},
			publicationDemographic: {
				type: Sequelize.STRING,
			},
			contentRating: {
				type: Sequelize.STRING,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Mangas");
	},
};
