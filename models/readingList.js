"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class readingList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      readingList.belongsTo(models.User);
      // readingList.belongsTo(models.content);
    }
  }
  readingList.init(
    {
      UserId: DataTypes.INTEGER,
      BookId: DataTypes.INTEGER,
      AuthorBook: DataTypes.STRING,
      Title: DataTypes.STRING,
      Sinopsis: DataTypes.STRING,
      Poster: DataTypes.STRING,
      Url: DataTypes.STRING,
      Stories: DataTypes.TEXT,
      Genres: DataTypes.STRING,
      ReleaseDate: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "readingList",
    }
  );
  return readingList;
};
