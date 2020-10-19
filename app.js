require('dotenv').config();
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
var figlet = require('figlet');


// creating connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: process.env.PASSWORD,
  database: 'employee_db'
});

// establishing connection to database
connection.connect(err => {
  if (err) throw err;

  console.log('connected to employee database!');
  promptUser();
});

// application title
figlet('Employee Tracker', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log('\n', data,'\n')
    
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
        getRoles();
        break;
      case "Update employee role":
        getEmployees();
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
    console.table('\n',res,'\n');
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
      console.table('\n',res,'\n');
      promptUser();
    })

  });
};

// VIEW ROLES
function viewRoles() {
  let query = 'SELECT a.id, a.title, b.name as department, a.salary FROM roles a JOIN departments b on a.department_id = b.id';
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table('\n',res,'\n');
    promptUser();
  });
};

// get Department names to use as choices in addRole
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
      console.table('\n',res,'\n');
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
    console.table('\n',res,'\n');
    promptUser();
  });
};

// get Role names to use as choices in addEmployee
function getRoles() {
  var query = `SELECT title AS name, id FROM roles`

  connection.query(query, function(err, res) {
    if (err) throw err;

    const roleChoice = res.map(({ id, name }) => ({
      value: id, 
      name: name
    }));

    getManagers(roleChoice);
  })
};

// get Manager names to use as choices in addEmployee
function getManagers(roleChoice) {
  var query = `SELECT * FROM employees`

  connection.query(query, function(err, res) {
    if (err) throw err;

    let managerChoice = res.map(({ id, first_name, last_name}) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }));
    const noManager = {
      name: 'This employee has no manager.',
      value: null
    }
    managerChoice.push(noManager)

    addEmployee(roleChoice, managerChoice);
  })
};

// ADD EMPLOYEE
function addEmployee(roleChoice, managerChoice) {
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
      type: "list",
      name: "employeeRole",
      message: "Choose a role for new employee",
      choices: roleChoice
    },
    {
      type: "list",
      name: "employeeManager",
      message: "Choose a manager for new employee.",
      choices: managerChoice
    },
  ]).then(function(answer) {

    connection.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answer.firstName, answer.lastName, answer.employeeRole, answer.employeeManager], function(err, res) {
      if (err) throw err;
      console.table('\n',res,'\n');
      promptUser();
    })

  });
};

// get employee names for updateEmployee
function getEmployees() {
  var query = `SELECT * FROM employees`

  connection.query(query, function(err, res) {
    if (err) throw err;

    const employeeChoice = res.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }));

    employeeRole(employeeChoice);
  })
};

// get employee roles for updateEmployee
function employeeRole(employeeChoice) {
  var query = `SELECT title AS name, id FROM roles`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const updateRoles = res.map(({ name, id }) => ({
      name: name, 
      value: id
    }));

    updateEmployee(employeeChoice, updateRoles)
  })
};

// UPDATE EMPLOYEE

function updateEmployee(employeeChoice, updateRoles) {
  return inquirer.prompt([
    {
      type: "list",
      name: "updateEmployee",
      message: "Which employee would you like to update?",
      choices: employeeChoice
    },

    {
      type: "list",
      name: "updateRole",
      message: "Select a new role for this employee.",
      choices: updateRoles
    }
  ]).then(function(answer) {

    connection.query('UPDATE employees SET role_id = ? WHERE id = ?', [answer.updateRole, answer.updateEmployee], function(err, res) {
      if (err) throw err;
      console.table('\n',res,'\n');
      promptUser();
    })

  });
};

// User selected QUIT
function quit() {
  connection.end();
  process.exit();
};
