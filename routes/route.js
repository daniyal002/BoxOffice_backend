const express = require("express");
const router = express.Router();
const userController = require("../controller/userController.js");
const casheController = require("../controller/casheController.js");
const employeeController = require("../controller/employeeController.js");
const expenseController = require("../controller/expenseController.js");
const incomeController = require("../controller/incomeController.js");
const casheOperationController = require("../controller/casheOperationController.js");
const casheResetController = require("../controller/casheResetController.js");
const { authenticate } = require("../controller/authenticate.js");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Только фотографии.", false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync("uploads/")) {
      fs.mkdirSync("uploads/", { recursive: true });
    }
    cb(null, "uploads/"); // Папка, куда будут сохраняться загруженные файлы
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, Date.now() + extname); // Уникальное имя файла
  },
});

const upload = multer({ storage: storage, fileFilter: imageFilter });

//User routes

router.post("/user/register", userController.register);
router.post("/user/login", userController.login);
router.post(
  "/user/getProfileUser",
  authenticate,
  userController.getProfileUser
);
router.get(
  "/user/getAllProfileUser",
  authenticate,
  userController.getAllProfileUser
);
router.put(
  "/user/updateUserProfile",
  authenticate,
  userController.updateUserProfile
);
router.put("/user/changePassword", authenticate, userController.changePassword);
router.post("/user/deleteUser", authenticate, userController.deleteUser);

// Кассы

router.get("/cahes/getAllCashes", authenticate, casheController.getAllCashes);
router.post("/cahes/getCasheById", authenticate, casheController.getCasheById);
router.post("/cahes/createCashe", authenticate, casheController.createCashe);
router.put("/cahes/updateCashe", authenticate, casheController.updateCashe);
router.post("/cahes/deleteCashe", authenticate, casheController.deleteCashe);

// Сотрудники

router.get("/employee/getAllEmployees", employeeController.getAllEmployees);
router.post(
  "/employee/getEmployeesById",
  authenticate,
  employeeController.getEmployeesById
);
router.post(
  "/employee/createEmployee",
  authenticate,
  employeeController.createEmployee
);
router.put(
  "/employee/updateEmployee",
  authenticate,
  employeeController.updateEmployee
);
router.post(
  "/employee/deleteEmployee",
  authenticate,
  employeeController.deleteEmployee
);

// Расход

router.get(
  "/expense/getAllExpenses",
  authenticate,
  expenseController.getAllExpenses
);
router.post(
  "/expense/getExpenseById",
  authenticate,
  expenseController.getExpenseById
);
router.post(
  "/expense/createExpense",
  authenticate,
  upload.array("files", 10),
  expenseController.createExpense
);
router.put(
  "/expense/updateExpense",
  authenticate,
  expenseController.updateExpense
);
router.put(
  "/expense/updateExpenseStatus",
  authenticate,
  expenseController.updateExpenseStatus
);
router.post(
  "/expense/deleteExpense",
  authenticate,
  expenseController.deleteExpense
);

// Приход
router.get(
  "/income/getAllIncomes",
  authenticate,
  incomeController.getAllIncomes
);
router.post(
  "/income/getIncomeById",
  authenticate,
  incomeController.getIncomeById
);
router.post(
  "/income/createIncome",
  authenticate,
  incomeController.createIncome
);
router.put("/income/updateIncome", authenticate, incomeController.updateIncome);
router.post(
  "/income/deleteIncome",
  authenticate,
  incomeController.deleteIncome
);

// Приход и расход

router.post(
  "/expense/spendFromCash",
  authenticate,
  casheOperationController.spendFromCash
);

// Обнуление касс
router.post(
  "/expense/resetBalance",
  authenticate,
  casheResetController.resetBalance
);

module.exports = router;
