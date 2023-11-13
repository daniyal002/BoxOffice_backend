const Cashes = require("../models/cashes");
const Employee = require("../models/employee");
const Income = require("../models/income");
const Log = require("../models/log");
const { depositToCash } = require("./casheOperationController");

// Получение всех приходов
const getAllIncomes = async (req, res) => {
  try {
    const incomes = await Income.findAll({
      include: [
        { model: Employee, as: "employee", attributes: ["full_name"] },
        { model: Cashes, as: "cashes", attributes: ["name"] },
      ],
    });

    return res.status(200).json(incomes);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при получении прихода: ${error}` });
  }
};

// Получение прихода по id
const getIncomeById = async (req, res) => {
  try {
    const incomeId = req.body.id;
    const income = await Income.findByPk(incomeId, {
      include: [
        { model: Employee, as: "employee", attributes: ["full_name"] },
        { model: Cashes, as: "cashes", attributes: ["name"] },
      ],
    });

    if (!income) {
      return res.status(404).json({ message: "Приход не найдена" });
    }

    return res.status(200).json(income);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при получении прихода: ${error}` });
  }
};

// Создание прихода
const createIncome = async (req, res) => {
  try {
    const { cash_id, amount, employee_id, timestamp } = req.body;
    // Проверка наличия кассы с таким именем
    const existingIncome = await Income.findOne({ where: { timestamp } }); // Добавьте await здесь
    if (existingIncome) {
      return res
        .status(409)
        .json({ message: "По такой дате и времени был ранее приход" });
    }

    // Создание прихода в базе данных
    const newIncome = await Income.create({
      cash_id,
      amount,
      employee_id,
      timestamp,
    });

    const newLog = await Log.create({
      operation: "Приход",
      data_time_operation: timestamp,
      cash_id: cash_id,
      income_id: newIncome.id,
      amount: amount,
    });

    const cash = await Cashes.findByPk(cash_id);
    if (!cash) {
      return res.status(404).json({ message: "Касса не найдена" });
    }
    cash.balance += amount;
    await cash.save();

    return res.status(200);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при создании прихода: ${error}` });
  }
};

// Обновление прихода
const updateIncome = async (req, res) => {
  try {
    const incomeId = req.body.id;
    const { cash_id, amount, employee_id, timestamp } = req.body;

    // Найти приход
    const income = await Income.findByPk(incomeId);

    if (!income) {
      return res.status(404).json({ message: "Приход не найден" });
    }

    // Рассчитать разницу между новым и старым значением amount
    const oldAmount = income.amount;
    const difference = amount - oldAmount;

    // Обновить значение прихода
    income.cash_id = cash_id;
    income.amount = amount;
    income.employee_id = employee_id;
    income.timestamp = timestamp;
    await income.save();

    // Обновить баланс кассы
    const cash = await Cashes.findByPk(cash_id);
    if (!cash) {
      return res.status(404).json({ message: "Касса не найдена" });
    }

    cash.balance += difference;
    await cash.save();

    const newLog = await Log.create({
      operation: "Обновление Прихода",
      data_time_operation: timestamp,
      cash_id: cash_id,
      income_id: incomeId,
      amount: amount,
    });

    return res.status(200).json({
      message: `Приход успешно обновлен`,
      income,
      cash, // Возвращаем обновленную кассу
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при обновлении прихода: ${error}` });
  }
};

// удаление прихода
const deleteIncome = async (req, res) => {
  try {
    const incomeId = req.body.id;
    const income = await Income.findByPk(incomeId);

    if (!income) {
      return res.status(404).json({ message: "Приход не найден" });
    }

    // Получить связанную кассу
    const cash = await Cashes.findByPk(income.cash_id);

    if (!cash) {
      return res.status(404).json({ message: "Касса не найдена" });
    }

    // Вычесть amount из баланса кассы
    cash.balance -= income.amount;
    await cash.save();

    // Удалить приход
    await income.destroy();

    return res.status(204).send();
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при удалении прихода: ${error}` });
  }
};

module.exports = {
  getAllIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
};
