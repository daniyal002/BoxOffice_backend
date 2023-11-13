"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Incomes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      cash_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Cashes", // Укажите имя целевой таблицы
          key: "id", // Укажите имя целевого поля
        },
        onUpdate: "CASCADE", // При обновлении записи в целевой таблице, обновить также в этой
        onDelete: "CASCADE", // При удалении записи из целевой таблицы, удалить также из этой
      },
      amount: {
        type: Sequelize.FLOAT,
      },
      employee_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Employees", // Укажите имя целевой таблицы
          key: "id", // Укажите имя целевого поля
        },
        onUpdate: "CASCADE", // При обновлении записи в целевой таблице, обновить также в этой
        onDelete: "CASCADE", // При удалении записи из целевой таблицы, удалить также из этой
      },
      timestamp: {
        type: Sequelize.DATE,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Incomes");
  },
};
