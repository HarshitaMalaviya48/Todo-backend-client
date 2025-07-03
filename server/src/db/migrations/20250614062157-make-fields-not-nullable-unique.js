"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.changeColumn("users", "userName", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
    queryInterface.changeColumn("users", "email", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
    queryInterface.changeColumn("users", "phoneNo", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    queryInterface.changeColumn("users", "password", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    queryInterface.changeColumn("users", "userName", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    });
    queryInterface.changeColumn("users", "email", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    });
    queryInterface.changeColumn("users", "phoneNo", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    queryInterface.changeColumn("users", "password", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
