"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Logs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      operation: {
        type: Sequelize.STRING,
      },
      data_time_operation: {
        type: Sequelize.DATE,
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
      expense_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Expenses", // Укажите имя целевой таблицы
          key: "id", // Укажите имя целевого поля
        },
        onUpdate: "CASCADE", // При обновлении записи в целевой таблице, обновить также в этой
        onDelete: "CASCADE", // При удалении записи из целевой таблицы, удалить также из этой
      },
      income_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Incomes", // Укажите имя целевой таблицы
          key: "id", // Укажите имя целевого поля
        },
        onUpdate: "CASCADE", // При обновлении записи в целевой таблице, обновить также в этой
        onDelete: "CASCADE", // При удалении записи из целевой таблицы, удалить также из этой
      },
      amount: {
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable("Logs");
  },
};
