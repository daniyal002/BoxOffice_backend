"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class User extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    User.belongsTo(models.Employee, { foreignKey: "employee_id" });
  }
}
User.init(
  {
    login: DataTypes.STRING,
    password: DataTypes.STRING,
    employee_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Employees",
        key: "id",
      },
    },
    role: {
      type: DataTypes.ENUM(
        "Admin",
        "Director",
        "cashierIncome",
        "cashierExpense"
      ),
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);
module.exports = User;
