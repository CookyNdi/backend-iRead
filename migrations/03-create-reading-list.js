"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("readingLists", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      BookId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Contents",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      AuthorBook: {
        type: Sequelize.STRING,
      },
      Title: {
        type: Sequelize.STRING,
      },
      Poster: {
        type: Sequelize.STRING,
      },
      Url: {
        type: Sequelize.STRING,
      },
      Sinopsis: {
        type: Sequelize.STRING,
      },
      Stories: {
        type: Sequelize.TEXT,
      },
      Genres: {
        type: Sequelize.STRING,
      },
      ReleaseDate: {
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("readingLists");
  },
};
