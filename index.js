const inquirer = require('inquirer');
const connection = require('./config/connection');
const cTable = require('console.table');
const DB = require("./db/queries");

const db = new DB(connection);

const init = () => {
    inquirer
      .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'View All Employees By Department',
                'View All Employees By Manager',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View All Roles',
                'Add Role',
                'Remove Role',
                'View All Departments',
                'Add Department',
                'Remove Department',
                'Exit',
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;

                case 'View All Employees By Department':
                    viewAllEmployeesByDepartment();
                    break;

                case 'View All Employees By Manager':
                    viewAllEmployeesByManager();
                    break;

                case 'Add Employee':
                    addEmployee();
                    break;

                case 'Remove Employee':
                    removeEmployee();
                    break;

                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;

                case 'Update Employee Manager':
                    updateEmployeeManager();
                    break;

                case 'View All Roles':
                    viewAllRoles();
                    break;

                case 'Add Role':
                    addRole();
                    break;

                case 'Remove Role':
                    removeRole();
                    break;

                case 'View All Departments':
                    viewAllDepartments();
                    break;

                case 'Add Department':
                    addDepartment();
                    break;

                case 'Remove Department':
                    removeDepartment();
                    break;

                case "Exit":
                    console.log("Goodbye!");
                    connection.end();
                    break;

                default:
                    console.log(`Invalid action: ${answer.action}`);
                    start();
                    break;
            }
        });
};

// View all employees
const viewAllEmployees = () => {
    db.findAllEmployees()
        .then(([rows]) => {
            const employees = rows;
            console.log('\n');
            console.table(employees);
        })
        .then(() => init());
};

// Add Employee
const addEmployee = () => {
    inquirer
        .prompt([
            {
                name: 'first_name',
                type: 'input',
                message: "What is the employee's first name?",
            },
            {
                name: 'last_name',
                type: 'input',
                message: "What is the employee's last name?",
            },
            {
                name: 'role_id',
                type: 'number',
                message: "What is the employee's role ID?",
            },
            {
                name: 'manager_id',
                type: 'number',
                message: "What is the employee's manager's ID?",
            },
        ])
        .then((answer) => {
            db.createEmployee(answer)
                .then(() => console.log('Employee added successfully!\n'))
                .then(() => init());
        });
};

// Remove Employee
const removeEmployee = async () => {
    const departments = await db.findAllDepartments();
    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id,
    }));

    const { departmentId } = await inquirer.prompt({
        type: 'list',
        name: 'departmentId',
        message: 'Select a department to view its employees:',
        choices: departmentChoices,
    });

    const employees = await db.findAllEmployeesByDepartment(departmentId);
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
    }));

    if (employeeChoices.length === 0) {
        console.log('No employees found in this department.');
        return;
    }

    const { employeeId } = await inquirer.prompt({
        type: 'list',
        name: 'employeeId',
        message: 'Select an employee to remove:',
        choices: employeeChoices,
    });

    await db.removeEmployee(employeeId);
    console.log('Employee removed successfully.');

    start();
};







