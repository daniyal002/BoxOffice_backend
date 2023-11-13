const Cashes = require("../models/cashes");

// Получение всех касс
const getAllCashes = async (req, res) => {
  try {
    const cashes = await Cashes.findAll();
    return res.status(200).json(cashes);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при получении касс: ${error}` });
  }
};

// Получение кассы по id
const getCasheById = async (req, res) => {
  try {
    const casheId = req.body.id;
    const cashe = await Cashes.findByPk(casheId);

    if (!cashe) {
      return res.status(404).json({ message: "Касса не найдена" });
    }

    return res.status(200).json(cashe);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при получении кассы: ${error}` });
  }
};

// Создание кассы
const createCashe = async (req, res) => {
  try {
    const { name } = req.body;
    // Проверка наличия кассы с таким именем
    const existingUser = await Cashes.findOne({ where: { name } }); // Добавьте await здесь
    if (existingUser) {
      return res.status(409).json({ message: "Такая касса существует" });
    }

    // Создание кассы в базе данных
    const newCashe = await Cashes.create({
      name,
      balance: 0.0,
    });

    return res.status(200).json({
      message: `Касса ${name} успешно создана`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при создании кассы: ${error}` });
  }
};

// Обновление кассы
const updateCashe = async (req, res) => {
  try {
    const casheId = req.body.id;
    const { name } = req.body;
    // Проверка наличия кассы с таким именем
    const cashe = await Cashes.findByPk(casheId);
    if (!cashe) {
      return res.status(404).json({ message: "Касса не найдена" });
    }

    // Обновление кассы в базе данных
    await cashe.update({
      name,
    });

    return res.status(200).json(
      {
        message: `Касса ${name} успешно обновлена`,
      },
      cashe
    );
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при обновлении кассы: ${error}` });
  }
};

const deleteCashe = async (req, res) => {
  try {
    const casheId = req.body.id;
    const cashe = await Cashes.findByPk(casheId);

    if (!cashe) {
      return res.status(404).json({ message: "Касса не найдена" });
    }

    await cashe.destroy();
    return res.status(204).send();
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при удалении кассы: ${error}` });
  }
};

module.exports = {
  getAllCashes,
  getCasheById,
  createCashe,
  updateCashe,
  deleteCashe,
};
