"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Content extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Content.belongsTo(models.User);
    }
  }
  Content.init(
    {
      UserId: DataTypes.INTEGER,
      Username: DataTypes.STRING,
      Title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Name must be filled" },
          notEmpty: { msg: "Name must be filled" },
        },
      },
      Sinopsis: DataTypes.STRING,
      Poster: DataTypes.STRING,
      Url: DataTypes.STRING,
      Stories: DataTypes.TEXT,
      isReadingList: DataTypes.STRING,
      Tags: DataTypes.STRING,
      ReleaseDate: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Content",
    }
  );
  return Content;
};
