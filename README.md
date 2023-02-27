# sqlTrackR

With `sqlTrackR`, you'll be presented with several options when you start the application. You can choose to view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role. No need to fumble through a bunch of different menus or pages - it's all right there for you to choose from.
## User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, 
add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, 
job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database
```

## Installation

To install and run Note Taker on your local machine, follow these steps:

- Clone this repository to your local machine
- Install the necessary dependencies with `npm install` or `npm i`
- Start the application by typing `node app` in your terminal at the root of the folder

**IF THERES NO DATA**

In the terminal, use the following commands:
- mysql -u root -p
- Password: **`FakePassword`**
- `CREATE DATABASE company_db`
- `USE company_db`
- `source path/to/schema`
- `source path/to/seeds`

**IF THERES ALREADY A DATABASE BUT NOTHING IS SHOWING**
- mysql -u root -p
- Password: **`FakePassword`**
- **DROP DATABASE company_db**
- `CREATE DATABASE company_db`
- `USE company_db`
- `source path/to/schema`
- `source path/to/seeds`

![Picture of App Logo](./assets/Screenshot%202023-02-26%20at%207.58.34%20PM.png)

## Demo



https://user-images.githubusercontent.com/113067058/221472198-edb7c932-bfe3-40f8-bd63-81052b04d02c.mov



## Code Snippets

### Update Employee Managers
This function updates an employee's manager by first querying the employee and manager lists, prompting the user to select which employee's manager to update and their new manager, and then creating a temporary table to hold the employee IDs and full names before updating the employee's manager ID with the selected manager's ID. Once the update is complete, the temporary table is dropped and the user is returned to the main menu.
```js
function updateEmployeeManager() {
  // Query employees to get a list of available employees
  connection.query(
    `SELECT CONCAT(first_name, ' ', last_name) AS employee FROM employee`,
    function (err, res) {
      if (err) throw err;

      // Map the employee names to an array of employee choices
      const employees = res.map((employee) => employee.employee);

      // Query employees to get a list of available managers
      connection.query(
        `SELECT CONCAT(first_name, ' ', last_name) AS manager FROM employee`,
        function (err, res) {
          if (err) throw err;

          // Map the manager names to an array of manager choices
          const managers = res.map((manager) => manager.manager);

          // Prompt the user for new employee details
          inquirer
            .prompt([
              {
                name: "employee",
                type: "list",
                message: "Which employee's manager would you like to update?",
                choices: employees,
              },
              {
                name: "manager",
                type: "list",
                message: "Who is the employee's new manager?",
                choices: managers,
              },
            ])
            .then((answer) => {
              // Create a temporary table to hold the employee IDs and full names
              connection.query(
                `CREATE TEMPORARY TABLE temp_employee
                    SELECT id, CONCAT(first_name, ' ', last_name) AS full_name
                    FROM employee`,
                function (err, res) {
                  if (err) throw err;
                  // Update the employee's manager ID
                  connection.query(
                    `UPDATE employee
                            SET manager_id = (SELECT id FROM temp_employee WHERE full_name = ?)
                            WHERE CONCAT(first_name, ' ', last_name) = ?`,
                    [answer.manager, answer.employee],
                    function (err, res) {
                      if (err) throw err;
                      console.log(
                        colors.brightGreen("Employee manager updated!")
                      );
                      // Drop the temporary table
                      connection.query(
                        `DROP TEMPORARY TABLE temp_employee`,
                        function (err, res) {
                          if (err) throw err;
                          start();
                        }
                      );
                    }
                  );
                }
              );
            });
        }
      );
    }
  );
}
```

### View Department Budget
This function prompts the user to select a department and then queries the database to calculate and display the total utilized budget of that department, which is calculated as the sum of all salaries of employees who belong to that department.
```js
function viewBudget() {
  // Query departments to get a list of available departments
  connection.query(`SELECT name FROM department`, function (err, res) {
    if (err) throw err;

    // Map the department names to an array of department choices
    const departments = res.map((department) => department.name);

    // Prompt the user for the department to view the budget of
    inquirer
      .prompt([
        {
          name: "department",
          type: "list",
          message: "Which department's budget would you like to view?",
          choices: departments,
        },
      ])
      .then((answer) => {
        // Query the total utilized budget of the department
        connection.query(
          `SELECT SUM(salary) AS budget FROM role
                    INNER JOIN employee ON employee.role_id = role.id
                    INNER JOIN department ON role.department_id = department.id
                    WHERE department.name = ?`,
          [answer.department],
          function (err, res) {
            if (err) throw err;
            // Log the total utilized budget of the department
            console.table(res);
            start();
          }
        );
      });
  });
}
```

## License

MIT License

Copyright (c) [2022] [Jorge Zamora]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Badges

<a href=”https://www.linkedin.com/in/jorge-zamora-786945250/”>
<img src='https://img.shields.io/badge/LinkedIn-blue?style=flat&logo=linkedin&labelColor=blue'>

![badmath](https://img.shields.io/github/followers/jbxamora?label=JBXAMORA&logoColor=%23fd2423&style=social)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. If the issue goes unresolved for more than a week feel free to contact me at any of the links listed below. Be sure to add me on LinkedIn and Follow me on GitHub to view my course progression. You can also visit the deployed site and sent a messafe through the contact form.

[<img src='https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/github.svg' alt='github' height='40'>](https://github.com/jbxamora) [<img src='https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/linkedin.svg' alt='linkedin' height='40'>](https://www.linkedin.com/in/jorge-zamora-786945250//) [<img src='https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/instagram.svg' alt='instagram' height='40'>](https://www.instagram.com/jbxamora/) [<img src='https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/stackoverflow.svg' alt='stackoverflow' height='40'>](https://stackoverflow.com/users/20023706/jbxamora)
