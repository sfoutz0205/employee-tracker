const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require("console.table");
const { clear } = require('console');

// creating connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '14Rosalit@',
  database: 'employee_db'
});

// establishing connection to database
connection.connect(function(err) {
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
    name:"menu"
  })
  .then(function(result) {
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
      case 'Add roles':
        addRoles();
        break;
      case 'View departments':
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

// User selected VIEW DEPARTMENTS

function viewDepartments() {
  let query = "SELECT * FROM department";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
};

// User selected VIEW ROLES
function viewRoles() {
  let query = "SELECT * FROM roles";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
};

// User selected VIEW EMPLOYEES
function viewEmployees() {
  let query = "SELECT * FROM employees";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
};

// User selected ADD DEPARTMENT
function addDepartment() {

  inquirer.prompt({

    type: 'input',
    message: 'Enter name of new department.',
    name: 'deptName'

  }).then(function(answer) {

    connection.query('INSERT INTO department (name) VALUES (?)', [answer.deptName], function(err, res) {
      if (err) throw err;
      console.table(res);
      promptUser();
    })

  });
};


