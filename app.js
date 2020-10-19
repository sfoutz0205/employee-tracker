require('dotenv').config();
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");



// creating connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '14Rosalit@',
  database: 'employee_db'
});

// establishing connection to database
connection.connect(err => {
  if (err) throw err;

  console.log('connected to employee database!');

  promptUser();
});

// prompt user to select from menu
function promptUser() {
  inquirer.prompt({
    type: 'list',
    choices: [
      'View departments',
      'View roles',
      'View employees',
      'Add department',
      'Add role',
      'Add employee',
      'Update employee role', 
      'Quit'
    ],
    message: 'Please select an option from the following menu.',
    name:"option"

  }).then(function(result) {
    console.log('You have selected ' + result.option);

    switch (result.option) {
      case 'View departments':
        viewDepartments();
        break;
      case 'View roles':
        viewRoles();
        break;
      case 'View employees':
        viewEmployees();
        break;
      case 'Add department':
        addDepartment();
        break;
      case 'Add role':
        getDept();
        break;
      case 'Add employee':
        addEmployee();
        break;
      case "Update employee role":
        updateEmployee();
        break;
      default:
        quit();
    }
  });
};

//VIEW DEPARTMENTS

function viewDepartments() {
  let query = "SELECT * FROM departments";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
};

// ADD DEPARTMENT
function addDepartment() {

  inquirer.prompt(
    {
      type: 'input',
      message: 'Enter name of new department.',
      name: 'deptName'
    }).then(function(answer) {

    connection.query('INSERT INTO departments (name) VALUES (?)', [answer.deptName], function(err, res) {
      if (err) throw err;
      console.table(res);
      promptUser();
    })

  });
};

// VIEW ROLES
function viewRoles() {
  let query = 'SELECT a.id, a.title, b.name as department, a.salary FROM roles a JOIN departments b on a.department_id = b.id';
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
};

// get Department names to use as choices
function getDept() {
  var query = "SELECT * FROM departments"

  connection.query(query, function (err, res) {
      if (err) throw err;

      const deptChoice = res.map(({ id, name }) => ({
          value: id, name: `${name}`
      }));
      addRole(deptChoice)
  })

}

// ADD ROLE
function addRole(deptChoice) {
  inquirer.prompt([
    {
      type: 'input',
      message: 'Enter name of new role.',
      name: 'roleName'
    },
    {
      type: 'input',
      message: 'Enter salary of new role.',
      name: 'roleSalary'
    },
    {
      type: 'list',
      name: 'roleDept',
      message: 'Which department does this role belong to?',
      choices: deptChoice,
      name: 'roleDept'
    }
  ]).then(function(answer) {

    connection.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [answer.roleName, answer.roleSalary, answer.roleDept], function(err, res) {
      if (err) throw err;
      console.table(res);
      promptUser();
    })

  });
};

// VIEW EMPLOYEES
function viewEmployees() {
  let query = `SELECT a.id, a.first_name, a.last_name, b.title, b.salary, c.name as department, CONCAT(d.first_name, ' ', d.last_name) as manager FROM employees a
               JOIN roles b on a.role_id = b.id 
               JOIN departments c ON c.id = b.department_id
               LEFT JOIN employees d ON d.id = a.manager_id`;
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
};



// ADD EMPLOYEE
function addEmployee() {
  inquirer.prompt ([
    {
      type: "input",
      message: "Enter first name of new employee.",
      name: "firstName"
    },
    {
      type: "input",
      message: "Enter last name of new employee.",
      name: "lastName"
    },
    {
      type: "input",
      message: "Enter role id for new employee.",
      name: "roleId"
    },
    {
      type: "input",
      message: "Enter manager id for new employee.",
      name: "managerId"
    },
  ]).then(function(answer) {

    connection.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answer.firstName, answer.lastName, answer.roleId, answer.managerId], function(err, res) {
      if (err) throw err;
      console.table(res);
      promptUser();
    })

  });
};

// UPDATE EMPLOYEE

function updateEmployee() {
  inquirer.prompt([
    {
      type: "input",
      message: "Which employee would you like to update?",
      name: "updateName"
    },

    {
      type: "input",
      message: "Select a new role for this employee.",
      name: "updateRole"
    }
  ]).then(function(answer) {

    connection.query('UPDATE employees SET role_id = ? WHERE first_name = ?', [answer.updateRole, answer.updateName], function(err, res) {
      if (err) throw err;
      console.table(res);
      promptUser();
    })

  });
};

// User selected QUIT
function quit() {
  connection.end();
  process.exit();
};
