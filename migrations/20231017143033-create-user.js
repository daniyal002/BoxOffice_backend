"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      login: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      employee_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Employees", // Укажите имя целевой таблицы (во множественном числе)
          key: "id", // Укажите имя целевого поля
        },
        onUpdate: "CASCADE", // При обновлении записи в целевой таблице, обновить также в этой
        onDelete: "CASCADE", // При удалении записи из целевой таблицы, удалить также из этой
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
    await queryInterface.dropTable("Users");
  },
};
