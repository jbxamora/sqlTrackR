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

// Query to return all employees by manager
const viewAllEmployeesByManager = () => {
    db.findAllEmployees().then((employees) => {
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
const viewAllEmployeesByDepartment = () => {
    db.findAllDepartments().then((departments) => {
        const departmentChoices = departments.map((department) => ({
            name: department.name,
            value: department.id,
        }));

        inquirer
            .prompt({
                name: "department",
                type: "list",
                message: "Which department's employees would you like to see?",
                choices: departmentChoices,
            })
            .then((answer) => {
                db.findAllEmployeesByDepartment(answer.department).then((employees) => {
                    console.table(employees);
                    init();
                });
            });
    });
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

const updateEmployeeRole = () => {
    db.findAllEmployees().then((employees) => {
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
                    choices: db.viewAllRoles().then((roles) =>
                        roles.map((role) => ({
                            name: role.title,
                            value: role.id,
                        }))
                    ),
                },
            ])
            .then((answers) => {
                db.updateEmployeeRole(answers.employeeId, answers.roleId).then(() => {
                    console.log("Employee's role has been updated successfully.");
                    init();
                });
            });
    });
};

const updateEmployeeManager = () => {
    // get all employees to select from
    db.findAllEmployees().then((employees) => {
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
                    message: 'Who is the employee\'s new manager?',
                    choices: employeeChoices,
                },
            ])
            .then((answer) => {
                db.updateEmployeeManager(answer.employeeId, answer.managerId)
                    .then(() => console.log('Employee\'s manager updated successfully'))
                    .catch((err) => console.error(err));
            });
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

// View all roles
const viewAllRoles = () => {
    db.viewAllRoles()
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
const addRole = () => {
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
            db.createRole(answer)
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
const removeRole = () => {
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
            db.removeRole(answer.roleName.split(". ")[1])
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
const selectDepartment = async () => {
    const departments = await db.findAllDepartments();
    return departments.map((department) => ({
        name: department.name,
        value: department.id,
    }));
};

// Select all roles
const selectRole = async () => {
    const roles = await db.findAllRoles();
    return roles.map((role) => ({
        name: role.title,
        value: role.id,
    }));
};






