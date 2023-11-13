const Cash = require("../models/cashes");

const depositToCash = async (req, res) => {
  try {
    const { cash_id, amount } = req.body;
    const cash = await Cash.findByPk(cash_id);
    if (!cash) {
      return res.status(404).json({ message: "Касса не найдена" });
    }
    cash.balance += amount;
    await cash.save();
    return res.status(200).json({
      message: "Баланс успешно пополнен",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при пополнении баланса кассы: ${error}` });
  }
};

const spendFromCash = async (req, res) => {
  try {
    const { cash_id, amount } = req.body;
    const cash = await Cash.findByPk(cash_id);
    if (!cash) {
      return res.status(404).json({ message: "Приход не найден" });
    }

    if (cash.balance < amount) {
      return res.status(409).json({
        message: `Сумма которую вы хотите выдать ${amount}₽ больше, чем есть в касе ${cash.balance}₽`,
      });
    }

    cash.balance -= amount;
    await cash.save();
    return res.status(200).json({
      message: "Деньги успешно выданы",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при выдаче денег кассы: ${error}` });
  }
};

module.exports = { depositToCash, spendFromCash };
