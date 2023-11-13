const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Требуется авторизация" });
  }

  try {
    const decoded = jwt.verify(token, "my_super_secret_key_lekar");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Неверный токен" });
  }
};

module.exports = {
  authenticate,
};
