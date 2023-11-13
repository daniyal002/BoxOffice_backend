"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Cashes = require("./cashes");
const Employee = require("./employee");

class Income extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {}
}
Income.init(
  {
    cash_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Cashes",
        key: "id",
      },
    },
    amount: DataTypes.FLOAT,
    employee_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Employees",
        key: "id",
      },
    },
    timestamp: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Income",
  }
);

Income.belongsTo(Cashes, { foreignKey: "cash_id", as: "cashes" });
Income.belongsTo(Employee, {
  foreignKey: "employee_id",
  as: "employee",
});

module.exports = Income;
