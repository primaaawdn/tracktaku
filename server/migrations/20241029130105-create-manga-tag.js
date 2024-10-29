"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("MangaTags", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			mangaId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Mangas",
					key: "id",
				},
			},
			tagId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Tags",
					key: "id",
				},
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
		await queryInterface.dropTable("MangaTags");
	},
};
