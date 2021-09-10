INSERT INTO department (name)
VALUES
  ('Sales'),
  ('Engineering'),
  ('Legal'),
  ('Finance');


INSERT INTO roles (title, salary)
VALUES
  ('Sales Lead', 100000),
  ('Salesperson', 80000),
  ('Lead Engineer', 150000),
  ('Software Engineer', 120000),
  ('Accountant', 125000),
  ('Legal Team Lead', 250000),
  ('Lawyer', 190000);

  INSERT INTO employee (first_name, last_name, roles_id, manager_id)
  VALUES
    ('John', 'Doe', 1, 3),
    ('Mike', 'Chan', 2, 1),
    ('J', 'Torres', 3, null),
    ('Kevin', 'Tupik', 4, 3),
    ('Ashley', 'Rodriguez', 4, 3),
    ('Malia', 'Brown', 5, null),
    ('Sarah', 'Lourd', 6, null),
    ('Tom', 'Allen', 7, 7),
    ('Zach', 'Galifianakis', 4, 3);