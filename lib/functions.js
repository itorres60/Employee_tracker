const db = require('../config/connection');
var clog = require('c-log');
const inquirer = require('inquirer');

class Functions {
  viewAll = () => {
  db.query(
    "SELECT e.id, e.first_name AS First, e.last_name as Last, roles.title AS Title, department.department_name AS Department, roles.salary, CONCAT(m.first_name, ' ', m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id JOIN roles ON e.roles_id = roles.id JOIN department ON roles.department_id = department.id ORDER BY department_name ASC",
    function(err, results, fields) {
      clog.table(results); // results contains rows returned by server
    } 
  ); 
  setTimeout(function afterTwoSeconds() {
    console.log("\n===================================================================================================================\n")
    promptUser();
  }, 500);
  };
  
viewByDepartment = () => {
  var departments = []
  db.query(
    'SELECT department_name FROM department;',
    function (err, results, fields) {
      for (let i = 0; i < results.length; i++) {
        departments.push(results[i].department_name)
      }
      inquirer.prompt([
        {
          type: "list",
          name: "departments",
          message:"Choose a department",
          choices: departments
        }
      ]).then(({ departments }) => {
        db.query(
          'SELECT employee.id, employee.first_name, employee.last_name, department.department_name AS Department FROM employee JOIN roles ON employee.roles_id = roles.id JOIN department ON roles.department_id = department.id WHERE department.department_name = "' + departments + '";',
          function(err, results, fields) {
            console.table(results);
          }
        ); 
        setTimeout(function afterTwoSeconds() {
          console.log("\n===================================================================================================================\n")
          promptUser();
        }, 500);  
      })
    }
  ); 
  };

viewByManager = () => {
  var managers = [];
  db.query("SELECT DISTINCT CONCAT(m.first_name, ' ', m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id WHERE m.first_name IS NOT NULL;",
  function (err, results, fields) {
    for (let i = 0; i < results.length; i++) {
      managers.push(results[i].Manager)
    }
    inquirer.prompt([
      {
        type: "list",
        name: "manager",
        message:"Choose a manager",
        choices: managers
      }
    ]).then(({ manager }) => {
      db.query(
        "SELECT e.id, e.first_name AS First, e.last_name as Last, CONCAT(m.first_name, ' ', m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id WHERE CONCAT(m.first_name, ' ', m.last_name) = '" + manager + "';",
        function (err, results, fields) {
          console.table(results)
        }
      );  setTimeout(function afterTwoSeconds() {
        console.log("\n===================================================================================================================\n")
        promptUser();
      }, 500);
    })    
  });
  };

addEmployee = () => {
  var roles = [];
  var managers = [];
  db.query('SELECT employee.id, first_name, last_name FROM employee;',
  function(err, results, fields) {
    for(let i = 0; i < results.length; i++){
      managers.push({"id": results[i].id, "first_name": results[i].first_name, "last_name": results[i].last_name})
    }
  })
  db.query('SELECT roles.id, title FROM roles;',
  function(err, results, fields) {
    for (let i = 0; i < results.length; i++) {
      roles.push({"id": results[i].id, "title": results[i].title});
    }
    var roleTitles = [];
    var managerTitles = [];
    for (let i = 0; i < roles.length; i++) { roleTitles.push(roles[i].title) }
    for (let i = 0; i < managers.length; i++) { managerTitles.push(managers[i].first_name + ' ' + managers[i].last_name) }
    inquirer.prompt ([
      {
        type: 'input',
        name: 'first_name',
        message: "What is the employee's first name?"
      },
      {
        type: 'input',
        name: 'last_name',
        message: "What is the employee's last name?"
      },
      {
        type: 'list',
        pageSize: 15,
        name: 'role_id',
        message: "What is the employees role?",
        choices: roleTitles
      },
      {
        type: 'confirm',
        name: 'isManager',
        message: "Will this employee have a manger?",
        default: true
      },
      {
        type: 'list',
        pageSize: 15,
        name: 'manager_id',
        message: "Who is the employee's manager?",
        choices: managerTitles,
        when: ({ isManager }) => isManager
      }
    ]).then(data => {
      var role = ''
      var manager = ''
      for (let i = 0; i < roles.length; i++) {
        if (data.role_id === roles[i].title) {
          role = roles[i].id
        }
      }
      for (let i = 0; i < managers.length; i++) {
        if (!data.manager_id) {manager = "''"}
        else if (data.manager_id === managers[i].first_name + ' ' + managers[i].last_name) {
          manager = managers[i].id
        }
      }
      db.query(
        'INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES ("' + data.first_name + '", "' + data.last_name + '", ' + role + ', ' + manager + ');',
        console.log("Employee added!")
      ); 
      setTimeout(function afterTwoSeconds() {
        console.log("\n===================================================================================================================\n")
        promptUser();
      }, 500);
    })
  });
  };

removeEmployee = () => {
  var employees = [];
  db.query('SELECT employee.id, first_name, last_name FROM employee;',
  function(err, results, fields){
    for (let i = 0; i < results.length; i++) {
      employees.push(results[i].first_name + ' ' + results[i].last_name)
    }
    inquirer.prompt([
      {
        type: "list",
        pageSize: 15,
        name: "delete",
        message: "Choose an employee to delete.",
        choices: employees
      }
    ]).then(employeeDelete => {
      db.query(
        "DELETE FROM employee WHERE CONCAT(first_name, ' ', last_name) = '" + employeeDelete.delete + "';",
        console.log("Employee removed")
      ); 
      setTimeout(function afterTwoSeconds() {
        console.log("\n===================================================================================================================\n")
        promptUser();
      }, 500);
    })
  })
  };

updateEmployeeRole = () => {
  var employees = [];
  var roles = [];
  // retrieve roles data from DATABASE and push to roles Array
  db.query('SELECT roles.id, title FROM roles;',
  function(err, results, fields) {
    for (let i = 0; i < results.length; i++) {
      roles.push({"id": results[i].id, "title": results[i].title});
    }
  });
  // retrieve employee data from DATABASE and push to employee array
  db.query('SELECT employee.id, first_name, last_name FROM employee;',
  function(err, results, fields) {
    for (let i = 0; i < results.length; i++) {
      employees.push(results[i].first_name + ' ' + results[i].last_name)
    }
    var roleTitles = []
    for (let i = 0; i < roles.length; i++) { roleTitles.push(roles[i].title) }
    // Begin prompt
    inquirer.prompt([
      {
        type: "list",
        pageSize: 15,
        name: "update",
        message: "Choose an employee to update.",
        choices: employees
      },
      {
        type: "list",
        pageSize: 15,
        name: "roles",
        message: "Choose a role.",
        choices: roleTitles
      }
    ]).then(employeeUpdate => {
      console.log(employeeUpdate)
      role_id = '';
      for (let i = 0; i < roles.length; i++) {
        if(employeeUpdate.roles === roles[i].title) {
          role_id = roles[i].id
        }
      }
      db.query(
        "UPDATE employee SET roles_id = " + role_id + " WHERE CONCAT(first_name, ' ', last_name) = '" + employeeUpdate.update + "';",
        console.log("Employee Role Updated!")
      ); 
      setTimeout(function afterTwoSeconds() {
        console.log("\n===================================================================================================================\n")
        promptUser();
      }, 500);
    })
  })
  };

updateEmployeeManager = () => {
  var employees = [];
  var employeeObjArr = [];
  db.query('SELECT employee.id, first_name, last_name FROM employee;',
  function(err, results, fields) {
    for (let i = 0; i < results.length; i++) {
      employees.push(results[i].first_name + ' ' + results[i].last_name)
      employeeObjArr.push({"id": results[i].id, "update": results[i].first_name + ' ' + results[i].last_name})
    }
    inquirer.prompt([
      {
        type: "list",
        pageSize: 15,
        name: "update",
        message: "Choose an employee to update.",
        choices: employees
      },
      {
        type: 'confirm',
        name: 'isPromoted',
        message: "Is this employee being promoted to manager?",
        default: false
      },
      {
        type: "list",
        pageSize: 15,
        name: "manager",
        message: "Choose a manager.",
        choices: employees,
        when: ({isPromoted}) => isPromoted === false
      }
    ]).then(managerUpdate => {
      console.log(managerUpdate)
      var manager_id = ''
      for (i=0; i < employeeObjArr.length; i++) {
        if (!managerUpdate.manager) {manager_id = "''"}
        else if (managerUpdate.manager === employeeObjArr[i].update) {manager_id = employeeObjArr[i].id}
      }
      db.query(
        "UPDATE employee SET manager_id = " + manager_id + " WHERE CONCAT(first_name, ' ', last_name) = '" + managerUpdate.update + "';",
        console.log("Employee Manager Updated!")
      ); 
      setTimeout(function afterTwoSeconds() {
        console.log("\n===================================================================================================================\n")
        promptUser();
      }, 500);
    })
  })
  };

viewAllRoles = () => {
  db.query(
    'SELECT title, department.department_name AS department, salary FROM roles JOIN department ON roles.department_id = department.id;',
    function(err, results, fields){console.table(results)}
  ); 
  setTimeout(function afterTwoSeconds() {
    console.log("\n===================================================================================================================\n")
    promptUser();
  }, 500);
  };

addRole = () => {
  var departments = [];
  var departmentsObjArr = [];
  db.query(
    'SELECT * FROM department;',
    function (err, results, fields) {
      for (let i = 0; i < results.length; i++) {
        departments.push(results[i].department_name)
        departmentsObjArr.push({"id": results[i].id, "department": results[i].department_name})
      }
      inquirer.prompt([
        {
          type: "input",
          name: "title",
          message: "What is title for the role?"
        },
        {
          type: "input",
          name: "salary",
          message: "What salary will be associated with this role?"
        },
        {
          type: "list",
          name: "department",
          message: "What department will the role belong to?",
          choices: departments
        }
      ]).then(rolesAdd => {
        var department_id = '';
        for (let i = 0; i < departmentsObjArr.length; i++) {
          if (rolesAdd.department === departmentsObjArr[i].department) {
            department_id = departmentsObjArr[i].id
          }
        }
        db.query(
          "INSERT INTO roles (title, salary, department_id) VALUES ('" + rolesAdd.title + "', " + rolesAdd.salary + ", " + department_id + ");",
          console.log("Role added")
        ); 
        setTimeout(function afterTwoSeconds() {
          console.log("\n===================================================================================================================\n")
          promptUser();
        }, 500);
      })
    }
  );
  };

removeRole = () => {
  var roles = [];
  db.query('SELECT title, department.department_name AS department, salary FROM roles JOIN department ON roles.department_id = department.id;',
  function(err, results, fields) {
    for (let i = 0; i < results.length; i++) {
      roles.push(results[i].title)
    }
    inquirer.prompt([
      {
        type: "list",
        name: "delete",
        message: "What role would you like to delete?",
        choices: roles
      }
    ]).then(rolesDelete => {
      db.query(
        "DELETE FROM roles WHERE title = '" + rolesDelete.delete + "';",
        console.log("Role deleted")
      ); 
      setTimeout(function afterTwoSeconds() {
        console.log("\n===================================================================================================================\n")
        promptUser();
      }, 500);
    })
  })
  };
}
module.exports = Functions;

