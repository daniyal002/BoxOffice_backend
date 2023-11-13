"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Expenses", "imagePaths", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: [],
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Expenses", "imagePaths");
  },
};
