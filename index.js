const mysql = require('mysql');
const inquirer = require('inquirer');
require("console.table");


// Create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'FakePassword',
    database: 'company_db'
});
connection.connect(function (err) {
    if (err) throw err;
    start();
});



function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View all employees",
                "View all employees by department",
                "View all employees by manager",
                "Add employee",
                "Update employee role",
                "Update employee manager",
                "Remove employee",
                "View all roles",
                "Add role",
                "Remove role",
                "View all departments",
                "Add department",
                "Remove department",
                "Quit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View all employees":
                    viewAllEmployees();
                    break;

                case "View all employees by department":
                    viewAllEmployeesByDepartment();
                    break;

                case "View all employees by manager":
                    viewAllEmployeesByManager();
                    break;

                case "Add employee":
                    addEmployee();
                    break;

                case "Remove employee":
                    removeEmployee();
                    break;

                case "Update employee role":
                    updateEmployeeRole();
                    break;

                case "Update employee manager":
                    updateEmployeeManager();
                    break;

                case "View all roles":
                    viewAllRoles();
                    break;

                case "Add role":
                    addRole();
                    break;

                case "Remove role":
                    removeRole();
                    break;

                case "View all departments":
                    viewAllDepartments();
                    break;

                case "Add department":
                    addDepartment();
                    break;

                case "Remove department":
                    removeDepartment();
                    break;

                case "Quit":
                    connection.end();
                    break;
            }
        });
}

// View all employees
function viewAllEmployees() {
    connection.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
        LEFT JOIN role on employee.role_id = role.id
        LEFT JOIN department on role.department_id = department.id
        LEFT JOIN employee manager on manager.id = employee.manager_id
        ORDER BY employee.id`,
        function (err, res) {
            if (err) throw err;
            console.table(res);
            start();
        }
    );
}

// View all employees by department that asks the user what department they want to view, after the user selects the department then the employees under that department show
function viewAllEmployeesByDepartment() {
    connection.query(`SELECT name FROM department`, function (err, res) {
        if (err) throw err;

        const departments = res.map((department) => department.name);

        inquirer.prompt({
            name: "department",
            type: "list",
            message: "Which department's employees would you like to see?",
            choices: departments,
        }).then((answer) => {
            connection.query(
                `SELECT department.name AS department, role.title, employee.first_name, employee.last_name, role.salary
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                WHERE department.name = ?
                ORDER BY department.id`,
                [answer.department],
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    start();
                }
            );
        });
    });
}

// View all employees by manager
function viewAllEmployeesByManager() {
    connection.query(`SELECT CONCAT(first_name, ' ', last_name) AS manager FROM employee`, function (err, res) {
        if (err) throw err;

        const managers = res.map((manager) => manager.manager);
        console.log(managers);

        inquirer.prompt({
            name: "manager",
            type: "list",
            message: "Which manager's employees would you like to see?",
            choices: managers,
        }).then((answer) => {
            connection.query(
                `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee manager ON manager.id = employee.manager_id
                WHERE CONCAT(manager.first_name, ' ', manager.last_name) = ?
                ORDER BY department.id`,
                [answer.manager],
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    start();
                }
            );
        });
    });
}

// Add employee
function addEmployee() {
    // Query roles to get list of available roles
    connection.query(`SELECT title FROM role`, function (err, res) {
        if (err) throw err;

        // Map the role titles to an array of role choices
        const roles = res.map((role) => role.title);

        // Query employees to get a list of available managers
        connection.query(`SELECT CONCAT(first_name, ' ', last_name) AS manager FROM employee`, function (err, res) {
            if (err) throw err;

            // Map the manager names to an array of manager choices
            const managers = res.map((manager) => manager.manager);

            // Prompt the user for new employee details
            inquirer.prompt([
                {
                    name: "first_name",
                    type: "input",
                    message: "What is the employee's first name?",
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "What is the employee's last name?",
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is the employee's role?",
                    choices: roles,
                },
                {
                    name: "manager",
                    type: "list",
                    message: "Who is the employee's manager?",
                    choices: managers,
                },
            ]).then((answer) => {
                // Insert new employee into the database
                connection.query(
                    `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?, ?, (SELECT id FROM role WHERE title = ?), (SELECT manager.id FROM employee AS manager WHERE CONCAT(manager.first_name, ' ', manager.last_name) = ?));
`,
                    [answer.first_name, answer.last_name, answer.role, answer.manager],
                    function (err, res) {
                        if (err) throw err;
                        console.log("Employee added!");
                        start();
                    }
                );
            });
        });
    });
}

// Update Employee Role






