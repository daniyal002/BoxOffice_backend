const Employee = require("../models/employee");

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    return res.status(200).json(employees);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при получение сотрудников:${error}` });
  }
};

const getEmployeesById = async (req, res) => {
  try {
    const employeeId = req.body.id;
    const employee = await Employee.findByPk(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Сотрудник не найдена" });
    }

    return res.status(200).json(employee);
  } catch (error) {
    return res.status(500).json({ message: `Ошибка при получении сотрудника` });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { full_name } = req.body;
    // Проверка наличия сотрудника с таким именем

    const existingEmployee = await Employee.findOne({ where: { full_name } }); // Добавьте await здесь
    if (existingEmployee) {
      return res.status(409).json({ message: "Такой сотрудник существует" });
    }

    // Создание сотрудника в базе данных
    const newEmployee = await Employee.create({
      full_name,
    });

    return res.status(200).json({
      message: `Сотрудник ${full_name} успешно создан`,
    });
  } catch (error) {}
};

const updateEmployee = async (req, res) => {
  try {
    const employeeId = req.body.id;
    const { full_name } = req.body;
    // Проверка наличия сотрудника с таким именем
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Сотрудник не найден" });
    }

    // Обновление Сотрудника в базе данных
    await employee.update({
      full_name,
    });

    return res.status(200).json(
      {
        message: `Сотрудник ${full_name} успешно обновлен`,
      },
      employee
    );
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при обновлении Сотрудника: ${error}` });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employeeId = req.body.id;
    const employee = await Employee.findByPk(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Сотрудник не найдена" });
    }

    await employee.destroy();
    return res.status(204).send();
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Ошибка при удалении сотрудника: ${error}` });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeesById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
