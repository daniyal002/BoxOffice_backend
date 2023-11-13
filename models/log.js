"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
class Log extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    Log.belongsTo(models.Cash, { foreignKey: "cash_id" });
    Log.belongsTo(models.Income, { foreignKey: "income_id" });
    Log.belongsTo(models.Expense, { foreignKey: "expense_id" });
  }
}
Log.init(
  {
    operation: DataTypes.STRING,
    data_time_operation: DataTypes.DATE,
    cash_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Cashes",
        key: "id",
      },
    },
    income_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Income",
        key: "id",
      },
    },
    expense_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "expense",
        key: "id",
      },
    },
    amount: DataTypes.FLOAT,
  },
  {
    sequelize,
    modelName: "Logs",
  }
);

module.exports = Log;
