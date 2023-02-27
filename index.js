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
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
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
                "Remove employee",
                "Update employee role",
                "Update employee manager",
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

