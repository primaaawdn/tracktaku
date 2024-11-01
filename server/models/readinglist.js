'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReadingList extends Model {
    static associate(models) {
      ReadingList.belongsTo(models.User);
    }
  }
  ReadingList.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    mangaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: DataTypes.STRING,
    progress: DataTypes.INTEGER,
    userRating: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ReadingList',
  });
  return ReadingList;
};