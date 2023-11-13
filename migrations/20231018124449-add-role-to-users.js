"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "role", {
      type: Sequelize.ENUM(
        "Admin",
        "Director",
        "cashierIncome",
        "cashierExpense"
      ),
      allowNull: true,
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "role");
  },
};
