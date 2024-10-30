"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Manga extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Manga.belongsToMany(models.User, {
				through: models.ReadingList,
				foreignKey: "mangaId",
			});
			Manga.belongsToMany(models.Tag, { through: models.MangaTag, foreignKey: "mangaId" });
		}
	}
	Manga.init(
		{
			title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Title is required"
          },
          notEmpty: {
            msg: "Title is required"
          }
        },
      },
			description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Description is required"
          },
          notEmpty: {
            msg: "Description is required"
          }
        },
      },
			lastVolume: DataTypes.INTEGER,
			lastChapter: DataTypes.INTEGER,
			publicationDemographic: DataTypes.STRING,
			contentRating: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "Manga",
		}
	);
	return Manga;
};
