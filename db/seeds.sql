USE company_db;

-- Seed data for department table 
INSERT INTO department (name) -- 1
VALUES ("Sales");

INSERT INTO department (name) -- 2
VALUES ("Engineering");

INSERT INTO department (name) -- 3
VALUES ("Finance");

INSERT INTO department (name) -- 4
VALUES ("Legal");

INSERT INTO department (name) -- 5
VALUES ("Human Resources");

INSERT INTO department (name) -- 6
VALUES ("Marketing");

-- Seed data for role table                     -- role id
INSERT INTO role (title, salary, department_id) -- 1 `Manager`
VALUES ("Sales Lead", 100000, 1);

INSERT INTO role (title, salary, department_id) -- 2
VALUES ("Sales Representative", 50000, 1);

INSERT INTO role (title, salary, department_id) -- 3 `Manager`
VALUES ("Lead Engineer", 150000, 2);

INSERT INTO role (title, salary, department_id) -- 4
VALUES ("Software Engineer", 120000, 2);

INSERT INTO role (title, salary, department_id) -- 5 `Manager`
VALUES ("Lead Accountant", 125000, 3);

INSERT INTO role (title, salary, department_id) -- 6
VALUES ("Financial Analyst", 90000, 3);

INSERT INTO role (title, salary, department_id) -- 7 `Manager`
VALUES ("Legal Team Lead", 250000, 4);

INSERT INTO role (title, salary, department_id) -- 8
VALUES ("Legal Assistant", 60000, 4);

INSERT INTO role (title, salary, department_id) -- 9 `Manager`
VALUES ("HR Manager", 100000, 5);

INSERT INTO role (title, salary, department_id) -- 10
VALUES ("HR Specialist", 60000, 5);

INSERT INTO role (title, salary, department_id) -- 11 `Manager`
VALUES ("Marketing Manager", 80000, 6);

INSERT INTO role (title, salary, department_id) -- 12
VALUES ("Marketing Coordinator", 50000, 6);

-- Seed data for employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jane", "Doe", 1, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Smith", 2, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sara", "Johnson", 2, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mike", "Williams", 3, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kelly", "Davis", 3, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tim", "Lee", 4, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Emily", "Brown", 4, 7);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Alex", "Lee", 5, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Rachel", "Miller", 5, 9);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ben", "Davis", 6, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tom", "Harris", 6, 11);
