const connection = require('../config/connection.js');
const mysql = require('mysql2/promise');
// Query to return all departments

const findAllDepartments = () => {
    return connection.promise().query("SELECT * FROM department")
        .then(([rows]) => {
            return rows;
        });
};

// Query to add a new department 
function createDepartment(department) {
    return connection.query(
        'INSERT INTO department SET?',
        department
    );
}

// Query to return all roles

function findAllRoles() {
    return connection.query(
        'SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id ORDER BY role.id'
    );
}


// Query to add a new role 
function createRole(role) {
    return connection.query(
        'INSERT INTO role SET?',
        role
    );
}

// Query to return all employees

function findAllEmployees() {
    return connection.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee 
        LEFT JOIN role ON employee.role_id = role.id 
        LEFT JOIN department ON role.department_id = department.id 
        LEFT JOIN employee manager ON employee.manager_id = manager.id 
        ORDER BY employee.id`
    );
}


// Query to add a new employee

function createEmployee(employee) {
    return connection.query(
        'INSERT INTO employee SET?',
        employee
    );
}

// Remove an employee
function removeEmployee(employeeId) {
    return connection.query(
        "DELETE FROM employee WHERE id = ?",
        employeeId
    );
}

// Query to update employee role

function updateEmployeeRole(employeeId, roleId) {
    return connection.query(
        `UPDATE employee SET role_id =? WHERE id =?`,
        [roleId, employeeId]
    );
}

// Add a role
function addRole(role) {
    return connection.query("INSERT INTO role SET ?", role);
}

// Remove a role
function removeRole(roleId) {
    return connection.query("DELETE FROM role WHERE id = ?", roleId);
}

// View all roles
function viewAllRoles() {
    return connection.query(
        "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
    );
}

// Query to update employee manager

function updateEmployeeManager(employeeId, managerId) {
    return connection.query(
        `UPDATE employee SET manager_id =? WHERE id =?`,
        [managerId, employeeId]
    );
}


// Query to return all employees by department

    function findAllEmployeesByDepartment(departmentName) {
        return connection.promise().query(
            `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
        FROM employee 
        LEFT JOIN role ON employee.role_id = role.id 
        LEFT JOIN department ON role.department_id = department.id 
        LEFT JOIN employee manager ON employee.manager_id = manager.id 
        WHERE department.name = ?
        ORDER BY employee.id`,
            [departmentName]
        );
    }



// Query to return all employees by manager

function findAllEmployeesByManager(managerId) {
    return connection.promise().query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
        FROM employee 
        LEFT JOIN role ON employee.role_id = role.id 
        LEFT JOIN department ON role.department_id = department.id 
        LEFT JOIN employee manager ON employee.manager_id = manager.id 
        WHERE employee.manager_id = ?
        ORDER BY employee.id`,
        [managerId]
    );
}

// Query to delete a department

function deleteDepartment(departmentId) {
    return connection.query(
        `DELETE FROM department WHERE id =?`,
        departmentId
    );
}

// Add a department
function addDepartment(department) {
    return connection.query("INSERT INTO department SET ?", department);
}

// View the total utilized budget of a department
function viewDepartmentBudget(departmentId) {
    return connection.query(
        "SELECT SUM(salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id where role.department_id = ?;",
        departmentId
    );
}

module.exports = {
    findAllEmployees,
    findAllDepartments,
    findAllEmployeesByDepartment,
    findAllEmployeesByManager,
    findAllRoles,
    createDepartment,
    createEmployee,
    createRole,
    deleteDepartment,
    updateEmployeeManager,
    updateEmployeeRole,
    addDepartment,
    addRole,
    removeEmployee,
    removeRole,
    viewAllRoles,
    viewDepartmentBudget,
}