const inquirer = require("inquirer");
require("console.table");
const fs = require("fs");
const connection = require('./config/connection');
require("mysql2/promise");
const { createConnection } = require('mysql2');

const {
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
} = require('./db/queries');

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    console.log(`
    ╔═══╗─────╔╗──────────────╔═╗╔═╗
    ║╔══╝─────║║──────────────║║╚╝║║
    ║╚══╦╗╔╦══╣║╔══╦╗─╔╦══╦══╗║╔╗╔╗╠══╦═╗╔══╦══╦══╦═╗
    ║╔══╣╚╝║╔╗║║║╔╗║║─║║║═╣║═╣║║║║║║╔╗║╔╗╣╔╗║╔╗║║═╣╔╝
    ║╚══╣║║║╚╝║╚╣╚╝║╚═╝║║═╣║═╣║║║║║║╔╗║║║║╔╗║╚╝║║═╣║
    ╚═══╩╩╩╣╔═╩═╩══╩═╗╔╩══╩══╝╚╝╚╝╚╩╝╚╩╝╚╩╝╚╩═╗╠══╩╝
    ───────║║──────╔═╝║─────────────────────╔═╝║
    ───────╚╝──────╚══╝─────────────────────╚══╝`)
    // runs the app
    init();
});

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
                    HandleviewAllEmployees();
                    break;

                case 'View All Employees By Department':
                    HandleviewAllEmployeesByDepartment();
                    break;

                case 'View All Employees By Manager':
                    HandleviewAllEmployeesByManager();
                    break;

                case 'Add Employee':
                    HandleaddEmployee();
                    break;

                case 'Remove Employee':
                    HandleremoveEmployee();
                    break;

                case 'Update Employee Role':
                    HandleupdateEmployeeRole();
                    break;

                case 'Update Employee Manager':
                    HandleupdateEmployeeManager();
                    break;

                case 'View All Roles':
                    HandleviewAllRoles();
                    break;

                case 'Add Role':
                    HandleaddRole();
                    break;

                case 'Remove Role':
                    HandleremoveRole();
                    break;

                case 'View All Departments':
                    HandleviewAllDepartments();
                    break;

                case 'Add Department':
                    HandleaddDepartment();
                    break;

                case 'Remove Department':
                    HandleremoveDepartment();
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
const HandleviewAllEmployees = () => {
    connection.promise().query('SELECT * FROM employee')
        .then(([rows]) => {
            const employees = rows;
            console.table(employees);
        })
        .then(() => init());
};

// Query to return all employees by manager
const HandleviewAllEmployeesByManager = () => {
    findAllEmployees().then((employees) => {
        const managers = employees
            .map((employee) => ({
                name: `${employee.manager_first_name} ${employee.manager_last_name}`,
                value: employee.manager_id,
            }))
            .filter(
                (employee, index, self) =>
                    self.findIndex((e) => e.value === employee.value) === index
            );

        inquirer
            .prompt({
                name: "manager",
                type: "list",
                message: "Which manager's team would you like to see?",
                choices: managers,
            })
            .then((answer) => {
                const managerEmployees = employees.filter(
                    (employee) => employee.manager_id === answer.manager
                );
                console.table(managerEmployees);
                init();
            });
    });
};

// Query to return all employees by department
const HandleviewAllEmployeesByDepartment = async () => {
    try {
        const departments = await findAllDepartments();
        const departmentChoices = departments.map((department) => ({
            name: department.name,
            value: department.id,
        }));

        const answer = await inquirer.prompt({
            name: "department",
            type: "list",
            message: "Which department's employees would you like to see?",
            choices: departmentChoices,
        });

        const employees = await findAllEmployeesByDepartment(answer.department);
        console.table(employees);
    } catch (err) {
        console.log(err);
    }
    init();
};


// EMPLOYEE FUNCTIONS

// Add Employee
const HandleaddEmployee = () => {
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
            createEmployee(answer)
                .then(() => console.log('Employee added successfully!'))
                .then(() => init());
        });
};

const HandleupdateEmployeeRole = () => {
    findAllEmployees().then((employees) => {
        const employeeChoices = employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));

        inquirer
            .prompt([
                {
                    name: "employeeId",
                    type: "list",
                    message: "Which employee's role do you want to update?",
                    choices: employeeChoices,
                },
                {
                    name: "roleId",
                    type: "list",
                    message: "What is the employee's new role?",
                    choices: viewAllRoles().then((roles) =>
                        roles.map((role) => ({
                            name: role.title,
                            value: role.id,
                        }))
                    ),
                },
            ])
            .then((answers) => {
                updateEmployeeRole(answers.employeeId, answers.roleId).then(() => {
                    console.log("Employee's role has been updated successfully.");
                    init();
                });
            });
    });
};

const HandleupdateEmployeeManager = () => {
    // get all employees to select from
    findAllEmployees().then((employees) => {
        const employeeChoices = employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));

        inquirer
            .prompt([
                {
                    name: 'employeeId',
                    type: 'list',
                    message: 'Which employee do you want to update?',
                    choices: employeeChoices,
                },
                {
                    name: 'managerId',
                    type: 'list',
                    message: 'Who is the employees new manager?',
                    choices: employeeChoices,
                },
            ])
            .then((answer) => {
                updateEmployeeManager(answer.employeeId, answer.managerId)
                    .then(() => console.log('Employee\'s manager updated successfully'))
                    .catch((err) => console.error(err));
            });
    });
};

// Remove Employee
const HandleremoveEmployee = async () => {
    const departments = await findAllDepartments();
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

    const employees = await findAllEmployeesByDepartment(departmentId);
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

    await removeEmployee(employeeId);
    console.log('Employee removed successfully.');

    init();
};

// ROLE FUNCTIONS

// View all roles
const HandleviewAllRoles = () => {
    viewAllRoles()
        .then((roles) => {
            console.table(roles);
            init();
        })
        .catch((err) => {
            console.log(err);
            init();
        });
};

// Add a role
const HandleaddRole = () => {
    inquirer
        .prompt([
            {
                name: "title",
                type: "input",
                message: "What is the title of the role?",
                validate: (title) => {
                    if (title) {
                        return true;
                    } else {
                        console.log("Please enter the title of the role.");
                        return false;
                    }
                },
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary for this role?",
                validate: (salary) => {
                    if (isNaN(salary) || salary <= 0) {
                        console.log("Please enter a valid salary greater than 0.");
                        return false;
                    } else {
                        return true;
                    }
                },
            },
            {
                name: "departmentId",
                type: "list",
                message: "What department does this role belong to?",
                choices: selectDepartment(),
            },
        ])
        .then((answer) => {
            createRole(answer)
                .then(() => {
                    console.log("New role has been added.");
                    init();
                })
                .catch((err) => {
                    console.log(err);
                    init();
                });
        });
};

// Remove a role
const HandleremoveRole = () => {
    inquirer
        .prompt([
            {
                name: "roleName",
                type: "list",
                message: "Which role would you like to remove?",
                choices: selectRole(),
            },
        ])
        .then((answer) => {
            removeRole(answer.roleName.split(". ")[1])
                .then(() => {
                    console.log("The role has been removed.");
                    init();
                })
                .catch((err) => {
                    console.log(err);
                    init();
                });
        });
};


// Select all departments
const HandleselectDepartment = async () => {
    const departments = await findAllDepartments();
    return departments.map((department) => ({
        name: department.name,
        value: department.id,
    }));
};

// Select all roles
const HandleselectRole = async () => {
    const roles = await findAllRoles();
    return roles.map((role) => ({
        name: role.title,
        value: role.id,
    }));
};

// DEPARTMENT FUNCTIONS

// View all departments
const HandleviewAllDepartments = async () => {
    try {
        const departments = await findAllDepartments();
        console.table(departments);
    } catch (err) {
        console.log(err);
    }
    init();
};

// Add department
const HandleaddDepartment = async () => {
    try {
        const department = await inquirer.prompt({
            name: 'department',
            type: 'input',
            message: 'What is the name of the department?',
        });

        await createDepartment(department);
        console.log(`Department ${department.department} added successfully!`);
    } catch (err) {
        console.log(err);
    }
    init();
};

// Remove department
const HandleremoveDepartment = async () => {
    try {
        const departments = await findAllDepartments();
        const departmentChoices = departments.map((department) => ({
            name: department.name,
            value: department.id,
        }));

        const { departmentId } = await inquirer.prompt({
            name: 'departmentId',
            type: 'list',
            message: 'Which department would you like to remove?',
            choices: departmentChoices,
        });

        await deleteDepartment(departmentId);
        console.log(`Department removed successfully!`);
    } catch (err) {
        console.log(err);
    }
    init();
};











