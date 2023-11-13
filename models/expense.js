"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Cashes = require("./cashes");
const Employee = require("./employee");

class Expense extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {}
}
Expense.init(
  {
    cash_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Cashes",
        key: "id",
      },
    },
    employee_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Employees",
        key: "id",
      },
    },
    registerNumber: DataTypes.INTEGER,
    reason: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    timestamp: DataTypes.DATE,
    status: DataTypes.ENUM(
      "Согласовано",
      "Отколонено",
      "На согласовании",
      "Выдано"
    ),

    imagePaths: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [], // Пустой массив по умолчанию
    },
  },
  {
    sequelize,
    modelName: "Expense",
  }
);

Expense.belongsTo(Cashes, { foreignKey: "cash_id", as: "cashes" });
Expense.belongsTo(Employee, { foreignKey: "employee_id", as: "employee" });

module.exports = Expense;
