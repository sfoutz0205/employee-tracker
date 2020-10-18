const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require("console.table");

// creating connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3002,
  user: 'root',
  password: '',
  database: 'employee_db'
});

// establishing connection to database
connection.connect(function(err) {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);

  
  promptUser();
});

// prompt user to begin application
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




