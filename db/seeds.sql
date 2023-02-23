USE company_db;

INSERT INTO department (name)
VALUES ('Sales');
INSERT INTO department (name)
VALUES ('Engineering');
INSERT INTO department (name)
VALUES ('Finance');
INSERT INTO department (name)
VALUES ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ('Salesperson', 50000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 75000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ('Sales Assistant', 65000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ('Software Engineer', 80000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ('Software Engineer', 80000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ('Lead Engineer', 100000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ('Accounts Payable', 60000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ('Accounts Receivable', 60000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ('Legal Team Lead', 100000, 4);
INSERT INTO role (title, salary, department_id)
VALUES ('Legal Team Assistant', 100000,4);
INSERT INTO role (title, salary, department_id)
VALUES ('Legal Team Assistant', 100000,4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jane', 'Doe', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Bob', 'Smith', 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Sarah', 'Johnson', 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jack', 'Davis', 5, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Emily', 'Wilson', 6, 4);

