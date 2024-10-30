'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MangaTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MangaTag.init({
    mangaId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Mangas',
        key: 'mangaId'
      }
    },
    tagId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tags',
        key: 'tagId'
      }
    }
  }, {
    sequelize,
    modelName: 'MangaTag',
  });
  return MangaTag;
};