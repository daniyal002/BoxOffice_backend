"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
class Employee extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    Employee.hasMany(models.Income, { foreignKey: "employee_id" });
    Employee.hasMany(models.Expense, { foreignKey: "employee_id" });
    Employee.hasMany(models.User, { foreignKey: "employee_id" });
  }
}
Employee.init(
  {
    full_name: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "Employee",
  }
);

module.exports = Employee;
