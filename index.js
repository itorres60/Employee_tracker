const inquirer = require('inquirer');
const Functions = require('./lib/functions');
let Fn = new Functions();


promptUser = () => {
  inquirer
    .prompt([
      {
        type: "list",
        pageSize:15,
        name: "list",
        message: "What would you like to do?",
        choices: ['View all employees', 'View all employees by department', 'View all employees by manager', 'Add employee', 'Remove employee', 'Update employee role', 'Update employee manager', 'View all roles', 'Add role', 'Remove role', 'Exit node']
      }
    ]).then(({ list }) => {
      if (list === "View all employees") {
        Fn.viewAll();
      } else if (list === "View all employees by department") {
        Fn.viewByDepartment()
      } else if (list === "View all employees by manager") {
        Fn.viewByManager();
      } else if (list === "Add employee") {
        Fn.addEmployee();
      } else if (list === "Remove employee") {
        Fn.removeEmployee();
      } else if (list === "Update employee role") {
        Fn.updateEmployeeRole();
      } else if (list === "Update employee manager") {
        Fn.updateEmployeeManager();
      } else if (list === "View all roles") {
        Fn.viewAllRoles();
      } else if (list === "Add role") {
        Fn.addRole();
      } else if (list === "Remove role") {
        Fn.removeRole();
      } else if (list === "Exit node"){process.exit()}
    });
}

promptUser();
