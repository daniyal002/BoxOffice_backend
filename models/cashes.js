"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
class Cashes extends Model {
  static associate(models) {
    Cashes.hasMany(models.income, { foreignKey: "cash_id" });
    Cashes.hasMany(models.expense, { foreignKey: "cash_id" });
    Cashes.hasMany(models.Log, { foreignKey: "cash_id" });
  }
}
Cashes.init(
  {
    name: DataTypes.STRING,
    balance: DataTypes.FLOAT,
  },
  {
    sequelize,
    modelName: "Cashes",
  }
);

module.exports = Cashes;
