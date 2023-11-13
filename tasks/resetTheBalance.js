const cron = require("node-cron");
const Cashes = require("../models/cashes");

// Запустите задачу каждый день в 00:00
cron.schedule("0 0 * * *", async () => {
  try {
    // Найдите все кассы
    const allCashes = await Cashes.findAll();

    // Обнулите баланс для каждой кассы
    for (const cash of allCashes) {
      cash.balance = 0; // Обнулите баланс (вы можете установить другое начальное значение)
      await cash.save(); // Сохраните изменения в базе данных
    }

    console.log("Балансы касс были обнулены.");
  } catch (error) {
    console.error("Произошла ошибка при обнулении балансов касс:", error);
  }
});
