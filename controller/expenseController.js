const { createWriteStream } = require("fs");
const Cashes = require("../models/cashes");
const Employee = require("../models/employee");
const Expense = require("../models/expense");
const Log = require("../models/log");
const path = require("path");
const { json } = require("express");
// Получение всех Расходов
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      include: [
        { model: Employee, as: "employee", attributes: ["full_name"] },
        { model: Cashes, as: "cashes", attributes: ["name", "balance"] },
      ],
    });
    return res.status(200).json(expenses);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при получении Расхода: ${error}` });
  }
};

// Получение Расхода по id
const getExpenseById = async (req, res) => {
  try {
    const expenseId = req.body.id;
    const expense = await Expense.findByPk(expenseId);

    if (!expense) {
      return res.status(404).json({ message: "Расход не найдена" });
    }

    return res.status(200).json(expense);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при получении Расхода: ${error}` });
  }
};

// Создание Расхода
const createExpense = async (req, res) => {
  try {
    const {
      cash_id,
      employee_id,
      reason,
      amount,
      timestamp,
      status,
      registerNumber,
    } = req.body;
    const files = req.files; // Обработанные файлы

    const imagePaths = []; // Создайте массив для хранения путей к изображениям

    const existingExpense = await Expense.findOne({
      where: { registerNumber },
    }); // Добавьте await здесь
    if (existingExpense) {
      return res
        .status(409)
        .json({ message: "По такому регистрационному номеру есть расход" });
    }

    if (files && files.length > 0) {
      // Обработка загруженных изображений
      files.forEach((file) => {
        console.log(file);
        imagePaths.push(file.path.replace("uploads\\", ""));
      });
    }

    // Проверка наличия кассы с таким именем

    const cash = await Cashes.findByPk(cash_id);

    if (cash.balance < amount) {
      return res.status(500).json({
        message: `Сумма ${amount}₽ которую вы хотите выдать, больше чем есть в кассе денег ${cash.balance}₽`,
      });
    }

    // Создание Расхода в базе данных
    const newexpense = await Expense.create({
      cash_id,
      employee_id,
      reason,
      amount,
      timestamp,
      status,
      registerNumber,
      imagePaths: imagePaths, // Сохраните пути к изображениям в модели
    });

    const newLog = await Log.create({
      operation: "Расход",
      data_time_operation: timestamp,
      cash_id: cash_id,
      expense_id: newexpense.id,
      amount: amount,
    });

    return res.status(200).json({
      message: `Расход ${newexpense.id} успешно создана`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при создании Расхода: ${error}` });
  }
};

// Обновление Расхода
const updateExpense = async (req, res) => {
  try {
    const expenseId = req.body.id;
    const {
      cash_id,
      employee_id,
      reason,
      amount,
      timestamp,
      status,
      registerNumber,
    } = req.body;
    const files = req.files; // Обработанные файлы

    const imagePaths = []; // Создайте массив для хранения путей к изображениям
    // Проверка наличия кассы с таким именем
    const expense = await Expense.findByPk(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Расход не найден" });
    }

    if (files && files.length > 0) {
      // Обработка загруженных изображений
      files.forEach((file) => {
        console.log(file);
        imagePaths.push(file.path.replace("uploads\\", ""));
      });
    }

    const cash = await Cashes.findByPk(expense.cash_id);

    if (cash.balance < amount) {
      return res.status(404).json({
        message: `Сумма ${amount}₽ которую вы хотите выдать, больше чем есть в кассе денег ${cash.balance}₽`,
      });
    }

    // Обновление Расхода в базе данных
    await expense.update({
      cash_id,
      employee_id,
      reason,
      amount,
      timestamp,
      status,
      registerNumber,
      imagePaths: imagePaths, // Сохраните пути к изображениям в модели
    });

    const newLog = await Log.create({
      operation: "Обновление Расхода",
      data_time_operation: timestamp,
      cash_id: cash_id,
      expense_id: expenseId,
      amount: amount,
    });

    return res.status(200).json(
      {
        message: `Расход  успешно обновлен`,
      },
      expense
    );
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при обновлении Расхода: ${error}` });
  }
};
// Обновление статуса расхода
const updateExpenseStatus = async (req, res) => {
  try {
    const expenseId = req.body.id;
    const { status } = req.body;
    const expense = await Expense.findByPk(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Расход не найден" });
    }

    // Обновление Расхода в базе данных
    await expense.update({
      status,
    });
    return res.status(200).json({
      message: `Расход  успешно обновлен`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при обновлении статуса Расхода: ${error}` });
  }
};

// удаление расхода
const deleteExpense = async (req, res) => {
  try {
    const expenseId = req.body.id;
    const expense = await Expense.findByPk(expenseId);

    if (!expense) {
      return res.status(404).json({ message: "Расход не найден" });
    }

    // Вычесть amount из баланса кассы
    if (expense.status === "Выдано") {
      const cash = await Cashes.findByPk(expense.cash_id);
      if (!cash) {
        return res.status(404).json({ message: "Касса не найдена" });
      }
      cash.balance += expense.amount;
      await cash.save();
    }

    await expense.destroy();

    return res.status(204).send();
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при удалении Расхода: ${error}` });
  }
};

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  updateExpenseStatus,
  deleteExpense,
};
