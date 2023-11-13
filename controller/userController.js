const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { login, password, role, employee_id } = req.body;
    // Проверка наличия пользователя с таким именем
    const existingUser = await User.findOne({ where: { login } }); // Добавьте await здесь
    if (existingUser) {
      return res.status(409).json({ message: "Такой пользователь существует" });
    }

    // Хеширование пароля
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Создание пользователя в базе данных
    const newUser = await User.create({
      login,
      password: hashedPassword,
      role,
      employee_id,
    });

    return res.status(200).json({
      message: `Пользователь ${login} с ролью ${role} успешно создан`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при создании пользователя: ${error}` });
  }
};

const login = async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({ where: { login } });
    if (!user) {
      return res
        .status(409)
        .json({ message: "Такого пользователя не существует" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(409).json({ message: "Не верный пароль" });
    }
    const data = {
      userId: user.id,
      employee_id: user.employee_id,
      role: user.role,
    };

    const token = jwt.sign(data, "my_super_secret_key_lekar", {
      expiresIn: "24h",
    });

    return res.status(200).json({ token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при аутентификации: ${error}` });
  }
};

const getAllProfileUser = async (req, res) => {
  try {
    const user = await User.findAll();
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при получении пациентов: ${error}` });
  }
};

const getProfileUser = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при получении профиля пользователя: ${error}` });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    // Вам также потребуется механизм получения текущего пользователя
    // Здесь можно обновить информацию о пользователе в базе данных
    const user = await User.findOne({ where: { id: req.body.id } });

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Обновление полей профиля
    user.login = req.body.login;
    user.role = req.body.role;
    user.employee_id = req.body.employee_id;

    await user.save();

    return res.status(200).json({ message: "Профиль пользователя обновлен" });
  } catch (error) {
    return res.status(500).json({
      message: `Ошибка при обновлении профиля пользователя: ${error}`,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    // Вам также потребуется механизм получения текущего пользователя
    // Здесь можно получить информацию о пользователе из базы данных
    const user = await User.findOne({ where: { id: req.body.id } });

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Проверка текущего пароля
    bcrypt.compare(user.password, currentPassword, (err) => {
      if (err) {
        // В случае ошибки при сравнении
        console.error("Ошибка при сравнении паролей:", err);
        return res
          .status(500)
          .json({ message: "Ошибка при сравнении паролей" });
      }
    });

    // Хеширование и сохранение нового пароля
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Пароль успешно изменен" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при изменении пароля: ${error}` });
  }
};

const deleteUser = async (req, res) => {
  try {
    const patientId = req.body.id;
    const patient = await User.findByPk(patientId);

    if (!patient) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    await patient.destroy();
    return res.status(204).send();
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при удалении пациента: ${error}` });
  }
};

module.exports = {
  register,
  login,
  getAllProfileUser,
  getProfileUser,
  updateUserProfile,
  changePassword,
  deleteUser,
};
