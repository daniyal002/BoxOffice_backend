"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Expenses", "registerNumber", {
      type: Sequelize.INTEGER, // Замените тип данных на нужный
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Expenses", "registerNumber");
  },
};
