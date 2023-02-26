USE company_db;

-- Seed data for department table
VALUES ("Sales");
INSERT INTO department (name)
VALUES ("Engineering");
INSERT INTO department (name)
VALUES ("Finance");
INSERT INTO department (name)
VALUES ("Legal");

-- Seed data for role table
INSERT INTO role (id, title, salary, department_id) VALUES (1, 'Sales Lead', 100000.00, 1);
INSERT INTO role (id, title, salary, department_id) VALUES (2, 'Salesperson', 50000.00, 1);
INSERT INTO role (id, title, salary, department_id) VALUES (3, 'Lead Engineer', 150000.00, 2);
INSERT INTO role (id, title, salary, department_id) VALUES (4, 'Software Engineer', 120000.00, 2);
INSERT INTO role (id, title, salary, department_id) VALUES (5, 'Accountant', 125000.00, 3);
INSERT INTO role (id, title, salary, department_id) VALUES (6, 'Financial Analyst', 90000.00, 3);
INSERT INTO role (id, title, salary, department_id) VALUES (7, 'Marketing Manager', 150000.00, 4);
INSERT INTO role (id, title, salary, department_id) VALUES (8, 'Marketing Coordinator', 70000.00, 4);

-- Seed data for employee table
INSERT INTO employee (first_name, last_name, role_title, manager_id) VALUES ('John', 'Doe', 'Sales Lead', NULL);
INSERT INTO employee (first_name, last_name, role_title, manager_id) VALUES ('Mike', 'Smith', 'Salesperson', 1);
INSERT INTO employee (first_name, last_name, role_title, manager_id) VALUES ('Sarah', 'Johnson', 'Salesperson', 1);
INSERT INTO employee (first_name, last_name, role_title, manager_id) VALUES ('Pat', 'Williams', 'Lead Engineer', NULL);
INSERT INTO employee (first_name, last_name, role_title, manager_id) VALUES ('Bob', 'Jones', 'Software Engineer', 4);
INSERT INTO employee (first_name, last_name, role_title, manager_id) VALUES ('Karen', 'Davis', 'Software Engineer', 4);
INSERT INTO employee (first_name, last_name, role_title, manager_id) VALUES ('Tom', 'Jackson', 'Accountant', NULL);
INSERT INTO employee (first_name, last_name, role_title, manager_id) VALUES ('Joe', 'Brown', 'Financial Analyst', 7);
INSERT INTO employee (first_name, last_name, role_title, manager_id) VALUES ('Ava', 'Garcia', 'Marketing Manager', NULL);
INSERT INTO employee (first_name, last_name, role_title, manager_id) VALUES ('Matt', 'Taylor', 'Marketing Coordinator', 9);

