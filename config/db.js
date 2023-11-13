const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "postgres", // или другая база данных, которую вы используете
  host: "localhost", // или ваш хост базы данных
  username: "postgres", // ваше имя пользователя
  password: "1234", // ваш пароль как строка
  database: "boxoffice", // имя вашей базы данных
});

module.exports = sequelize;
