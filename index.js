const db = require('./db/connection');
var inquirer = require('inquirer');
var clog = require('c-log');


var promptUser = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "list",
        message: "What would you like to do?",
        choices: ['View all employees', 'View all employees by department', 'View all employees by manager', 'Add employee', 'Remove employee', 'Update employee role', 'Update employee manager', 'View all roles', 'Add role', 'Remove role', 'Exit node']
      }
    ]).then(({ list }) => {
      if (list === "View all employees") {
        db.query(
          "SELECT e.id, e.first_name AS First, e.last_name as Last, roles.title AS Title, department.department_name AS Department, roles.salary, CONCAT(m.first_name, ' ', m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id JOIN roles ON e.roles_id = roles.id JOIN department ON roles.department_id = department.id",
          function(err, results, fields) {
            clog.table(results); // results contains rows returned by server
          } 
        ); 
        setTimeout(function afterTwoSeconds() {
          console.log("========================================================================================")
          promptUser();
        }, 500);
      } else if (list === "View all employees by department") {
        inquirer.prompt([
          {
            type: "list",
            name: "departments",
            message:"Choose a department",
            choices: ['Sales', 'Engineering', 'Finance', 'Legal']
          }
        ]).then(({ departments }) => {
          if (departments === 'Sales') {
            db.query(
              'SELECT employee.id, employee.first_name, employee.last_name, department.department_name AS Department FROM employee JOIN roles ON employee.roles_id = roles.id JOIN department ON roles.department_id = department.id WHERE department.department_name = "Sales";',
              function(err, results, fields) {
                console.table(results);
              }
            ); 
            setTimeout(function afterTwoSeconds() {
              console.log("========================================================================================")
              promptUser();
            }, 500);
          } else if (departments === 'Engineering') {
            db.query(
              'SELECT employee.id, employee.first_name, employee.last_name, department.department_name AS Department FROM employee JOIN roles ON employee.roles_id = roles.id JOIN department ON roles.department_id = department.id WHERE department.department_name = "Engineering";',
              function(err, results, fields) {
                console.table(results);
              }
            ); 
            setTimeout(function afterTwoSeconds() {
              console.log("========================================================================================")
              promptUser();
            }, 500);
          } else if (departments === 'Finance') {
            db.query(
              'SELECT employee.id, employee.first_name, employee.last_name, department.department_name AS Department FROM employee JOIN roles ON employee.roles_id = roles.id JOIN department ON roles.department_id = department.id WHERE department.department_name = "Finance";',
              function(err, results, fields) {
                console.table(results);
              }
            ); 
            setTimeout(function afterTwoSeconds() {
              console.log("========================================================================================")
              promptUser();
            }, 500);
          } else if (departments === 'Legal') {
            db.query(
              'SELECT employee.id, employee.first_name, employee.last_name, department.department_name AS Department FROM employee JOIN roles ON employee.roles_id = roles.id JOIN department ON roles.department_id = department.id WHERE department.department_name = "Legal";',
              function(err, results, fields) {
                console.table(results);
              }
            ); 
            setTimeout(function afterTwoSeconds() {
              console.log("========================================================================================")
              promptUser();
            }, 500);
          }
        })
      } else if (list === "View all employees by manager") {
        inquirer.prompt([
          {
            type: "list",
            name: "manager",
            message:"Choose a manager",
            choices: ['John Doe', 'J Torres', 'Sarah Lourd']
          }
        ]).then(({ manager }) => {
          if (manager === "John Doe") {
            db.query(
              'SELECT e.id, e.first_name AS First, e.last_name as Last, m.first_name AS Manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id WHERE m.first_name = "John";',
              function(err, results, fields) {
                console.table(results)
              }
            ); 
        setTimeout(function afterTwoSeconds() {
          console.log("========================================================================================")
          promptUser();
        }, 500);
          } else if (manager === "J Torres") {
            db.query(
              'SELECT e.id, e.first_name AS First, e.last_name as Last, m.first_name AS Manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id WHERE m.first_name = "J";',
              function(err, results, fields) {
                console.table(results)
              }
            ); 
        setTimeout(function afterTwoSeconds() {
          console.log("========================================================================================")
          promptUser();
        }, 500);
          } else if (manager === 'Sarah Lourd') {
            db.query(
              'SELECT e.id, e.first_name AS First, e.last_name as Last, m.first_name AS Manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id WHERE m.first_name = "Sarah";',
              function(err, results, fields) {
                console.table(results);
              }
            ); 
        setTimeout(function afterTwoSeconds() {
          console.log("========================================================================================")
          promptUser();
        }, 500);
          }
        })
      } else if (list === "Add employee") {
        var roles = [];
        var managers = [];
        db.query('SELECT employee.id, first_name, last_name FROM employee;',
        function(err, results, fields) {
          for(i = 0; i < results.length; i++){
            managers.push({"id": results[i].id, "first_name": results[i].first_name, "last_name": results[i].last_name})
          }
        })
        db.query('SELECT roles.id, title FROM roles;',
        function(err, results, fields) {
          for (i = 0; i < results.length; i++) {
            roles.push({"id": results[i].id, "title": results[i].title});
          }
          var roleTitles = [];
          var managerTitles = [];
          for (i = 0; i < roles.length; i++) { roleTitles.push(roles[i].title) }
          for (i = 0; i < managers.length; i++) { managerTitles.push(managers[i].first_name + ' ' + managers[i].last_name) }
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
              name: 'role_id',
              message: "What is the employees role?",
              choices: roleTitles
            },
            {
              type: 'list',
              name: 'manager_id',
              message: "Who is the employee's manager?",
              choices: managerTitles
            }
          ]).then(data => {
            var role = ''
            var manager = ''
            for (i = 0; i < roles.length; i++) {
              if (data.role_id === roles[i].title) {
                role = roles[i].id
              }
            }
            for (i = 0; i < managers.length; i++) {
              if (data.manager_id === managers[i].first_name + ' ' + managers[i].last_name) {
                manager = managers[i].id
              }
            }
            db.query(
              'INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES ("' + data.first_name + '", "' + data.last_name + '", ' + role + ', ' + manager + ');',
              console.log("Employee added!")
            ); 
            setTimeout(function afterTwoSeconds() {
              console.log("========================================================================================")
              promptUser();
            }, 500);
          })
        });
      } else if (list === "Remove employee") {
        var employees = [];
        db.query('SELECT employee.id, first_name, last_name FROM employee;',
        function(err, results, fields){
          for (i = 0; i < results.length; i++) {
            employees.push(results[i].first_name + ' ' + results[i].last_name)
          }
          inquirer.prompt([
            {
              type: "list",
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
              console.log("========================================================================================")
              promptUser();
            }, 500);
          })
        })
      } else if (list === "Update employee role") {
        var employees = [];
        var roles = [];
        // retrieve roles data from DATABASE and push to roles Array
        db.query('SELECT roles.id, title FROM roles;',
        function(err, results, fields) {
          for (i = 0; i < results.length; i++) {
            roles.push({"id": results[i].id, "title": results[i].title});
          }
        });
        // retrieve employee data from DATABASE and push to employee array
        db.query('SELECT employee.id, first_name, last_name FROM employee;',
        function(err, results, fields) {
          for (i = 0; i < results.length; i++) {
            employees.push(results[i].first_name + ' ' + results[i].last_name)
          }
          var roleTitles = []
          for (i = 0; i < roles.length; i++) { roleTitles.push(roles[i].title) }
          // Begin prompt
          inquirer.prompt([
            {
              type: "list",
              name: "update",
              message: "Choose an employee to update.",
              choices: employees
            },
            {
              type: "list",
              name: "roles",
              message: "Choose a role.",
              choices: roleTitles
            }
          ]).then(employeeUpdate => {
            console.log(employeeUpdate)
            role_id = '';
            for (i = 0; i < roles.length; i++) {
              if(employeeUpdate.roles === roles[i].title) {
                role_id = roles[i].id
              }
            }
            db.query(
              "UPDATE employee SET roles_id = " + role_id + " WHERE CONCAT(first_name, ' ', last_name) = '" + employeeUpdate.update + "';",
              console.log("Employee Role Updated!")
            ); 
            setTimeout(function afterTwoSeconds() {
              console.log("========================================================================================")
              promptUser();
            }, 500);
          })
        })
      } else if (list === "Update employee manager") {
        var employees = [];
        db.query('SELECT employee.id, first_name, last_name FROM employee;',
        function(err, results, fields) {
          for (i = 0; i < results.length; i++) {
            employees.push(results[i].first_name + ' ' + results[i].last_name)
          }
          inquirer.prompt([
            {
              type: "list",
              name: "update",
              message: "Choose an employee to update.",
              choices: employees
            },
            {
              type: "list",
              name: "manager",
              message: "Choose a role.",
              choices: ['John Doe', 'J Torres', 'Sarah Lourd']
            }
          ]).then(managerUpdate => {
            console.log(managerUpdate)
            var manager = ''
            if (managerUpdate.manager === 'John Doe') { manager = 1}
            else if (managerUpdate.manager === 'J Torres') { manager = 3}
            else if (managerUpdate.manager === 'Sarah Lourd') { manager = 7};
            db.query(
              "UPDATE employee SET manager_id = " + manager + " WHERE CONCAT(first_name, ' ', last_name) = '" + managerUpdate.update + "';",
              console.log("Employee Manager Updated!")
            ); 
            setTimeout(function afterTwoSeconds() {
              console.log("========================================================================================")
              promptUser();
            }, 500);
          })
        })
      } else if (list === "View all roles") {
        db.query(
          'SELECT title, department.department_name AS department, salary FROM roles JOIN department ON roles.department_id = department.id;',
          function(err, results, fields){console.table(results)}
        ); 
        setTimeout(function afterTwoSeconds() {
          console.log("========================================================================================")
          promptUser();
        }, 500);
      } else if (list === "Add role") {
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
            choices: ["Sales", "Engineering", "Legal", "Finance"]
          }
        ]).then(rolesAdd => {
          var department = '';
          if (rolesAdd.department === 'Sales'){department = 1}
          else if (rolesAdd.department === 'Engineering'){department = 2}
          else if (rolesAdd.department === 'Legal'){department = 3}
          else if (rolesAdd.department === 'Finance'){department = 4}
          db.query(
            "INSERT INTO roles (title, salary, department_id) VALUES ('" + rolesAdd.title + "', " + rolesAdd.salary + ", " + department + ");",
            console.log("Role added")
          ); 
          setTimeout(function afterTwoSeconds() {
            console.log("========================================================================================")
            promptUser();
          }, 500);
        })
      } else if (list === "Remove role") {
        var roles = [];
        db.query('SELECT title, department.department_name AS department, salary FROM roles JOIN department ON roles.department_id = department.id;',
        function(err, results, fields) {
          for (i = 0; i < results.length; i++) {
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
              console.log("========================================================================================")
              promptUser();
            }, 500);
          })
        })
      } else if (list === "Exit node"){process.exit()}
    })
}

promptUser();
