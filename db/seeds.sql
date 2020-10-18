USE employee_db;

INSERT INTO departments (name)
VALUES 
  ('Sales'), 
  ('Engineering'), 
  ('Finance'), 
  ('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES 
  ('Sales Lead', 100000, 1), 
  ('Salesperson', 80000, 1), 
  ('Lead Engineer', 150000, 2), 
  ('Software Engineer', 120000, 2), 
  ('Accountant', 125000, 3), 
  ('Legal Team Lead', 250000, 4), 
  ('Lawyer', 190000, 4);

  INSERT INTO employees (first_name, last_name, role_id, manager_id)
  VALUES
    ('Kitty', 'Smith', 1, null), 
    ('Baby', 'Cooper', 3, null),
    ('Madison', 'Sparkles', 4, null),
    ('Jay', 'Malibu', 6, null),
    ('Frances', 'Little', 2, null),
    ('Emma', 'Bender', 5, null),
    ('Suki', 'Halloway', 7, null),
    ('Dusty', 'Rhodes', 2, null),