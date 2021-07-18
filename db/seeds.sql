INSERT INTO departments
(name)
VALUES
("Customer service"),
("Grocery"),
("Deli"),
("Produce");

INSERT INTO roles 
(title, salary, department_id)
VALUES
("bagger", 20000, 1),
("cashier", 25000, 1),
("grocery clerk", 30000, 2),
("deli clerk", 30000, 4),
("produce clerk", 50000, 4);

INSERT INTO employees
  (first_name, last_name, role_id, manager_id)
VALUES
('James', 'Fraser', 1, NULL),
('Joshua', 'Rosa', 2, NULL),
('Jason', 'Smith', 4, NULL),
('Sara', 'Tossi', 5, NULL),
('Filip', 'Tossi', 2, NULL),
('Jannie', 'Rosa', 1, NULL),
('Maddie', 'O,brien', 3, NULL),
('Carona', 'Veerus', 3, NULL);

