const connection = require('./config/connection');

class DB {
    constructor(connection) {
        this.connection = connection;
    }


    // Query to return all departments

    findAllDepartments() {
        return this.connection.query(
            'SELECT department.id, department.name, FROM department ORDER BY department.id'
        );
    }

    // Query to add a new department 
    createDepartment(department) {
        return this.connection.query(
            'INSERT INTO department SET?',
            department
        );
    }

    // Query to return all roles

    findAllRoles() {
        return this.connection.query(
            'SELECT role.id, role.title, depratment.name AS department, role.salary, FROM role LEFT JOIN department ON role.department.id ORDER BY role.id'
        );
    }

    // Query to add a new role 
    createRole(role) {
        return this.connection.query(
            'INSERT INTO role SET?',
            role
        );
    }

    // Query to return all employees

    findAllEmployees() {
        return this.connection.query(
            `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
            FROM employee 
            LEFT JOIN role ON employee.role_id = role.id 
            LEFT JOIN department ON role.department_id = department.id 
            LEFT JOIN employee manager ON employee.manager_id = manager.id 
            ORDER BY employee.id`
        );
    }

    // Query to add a new employee

    createEmployee(employee) {
        return this.connection.query(
            'INSERT INTO employee SET?',
            employee
        );
    }

    // Remove an employee
    removeEmployee(employeeId) {
        return this.connection.query(
            "DELETE FROM employee WHERE id = ?",
            employeeId
        );
    }

    // Query to update employee role

    updateEmployeeRole(employeeId, roleId) {
        return this.connection.query(
            `UPDATE employee SET role_id =? WHERE id =?`,
            [roleId, employeeId]
        );
    }

    // Add a role
    addRole(role) {
        return this.connection.query("INSERT INTO role SET ?", role);
    }

    // Remove a role
    removeRole(roleId) {
        return this.connection.query("DELETE FROM role WHERE id = ?", roleId);
    }

    // View all roles
    viewAllRoles() {
        return this.connection.query(
            "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
        );
    }

    // Query to update employee manager

    updateEmployeeManager(employeeId, managerId) {
        return this.connection.query(
            `UPDATE employee SET manager_id =? WHERE id =?`,
            [managerId, employeeId]
        );
    }

    // Query to update employee manager

    updateEmployeeManager(employeeId, managerId) {
        return this.connection.query(
            `UPDATE employee SET manager_id =? WHERE id =?`,
            [managerId, employeeId]
        );
    }

    // Query to return all employees by department

    findAllEmployeesByDepartment(departmentId) {
        return this.connection.query(
            `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
            FROM employee 
            LEFT JOIN role ON employee.role_id = role.id 
            LEFT JOIN department ON role.department_id = department.id 
            LEFT JOIN employee manager ON employee.manager_id = manager.id 
            WHERE department.id = ?
            ORDER BY employee.id`,
            departmentId
        );
    }

    // Query to return all employees by manager
    findAllEmployeesByManager(managerId) {
        return this.connection.query(
            `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, CONCAT(manager.first_name,'', manager.last_name) AS manager
            FROM employee 
            LEFT JOIN role ON employee.role_id = role.id 
            LEFT JOIN department ON role.department_id = department.id 
            LEFT JOIN employee manager ON employee.manager_id = manager.id 
            WHERE manager.id =?
            ORDER BY employee.id`,
            managerId
        );
    }

    // Query to delete a department

    deleteDepartment(departmentId) {
        return this.connection.query(
            `DELETE FROM department WHERE id =?`,
            departmentId
        );
    }

    // Add a department
    addDepartment(department) {
        return this.connection.query("INSERT INTO department SET ?", department);
    }

    // View the total utilized budget of a department
    viewDepartmentBudget(departmentId) {
        return this.connection.query(
            "SELECT SUM(salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id where role.department_id = ?;",
            departmentId
        );
    }
}

module.exports = new DB(connection);