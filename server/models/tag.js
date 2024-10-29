'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      Tag.belongsToMany(models.Manga, { through: models.MangaTag, foreignKey: 'tagId' });
    }
  }
  Tag.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Tag Name is required"
        },
        notEmpty: {
          msg: "Tag Name is required"
        }
      },
    }
  }, {
    sequelize,
    modelName: 'Tag',
  });
  return Tag;
};