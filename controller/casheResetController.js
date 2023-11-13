const Cashes = require("../models/cashes");

// Получение кассы по id
const resetBalance = async (req, res) => {
  try {
    const allCashes = await Cashes.findAll();

    for (const cash of allCashes) {
      cash.balance = 0; // Обнулите баланс (вы можете установить другое начальное значение)
      await cash.save(); // Сохраните изменения в базе данных
    }

    return res.status(200).json({ message: "все кассы обнулены" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при обнулении касс: ${error}` });
  }
};

module.exports = { resetBalance };
