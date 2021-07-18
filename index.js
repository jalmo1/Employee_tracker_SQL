const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
const Connection = require("mysql2/typings/mysql/lib/Connection");

const db = mysql.createConnection({
  host: "localhost",
  // Your MySQL username,
  user: "root",
  // Your MySQL password
  password: "/pNyxgg4F",
  database: "employee_tracker",
});

function init() {
  generateQ();
}
init();

function generateQ() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "selection",
        choices: [
          {
            name: "View all employees",
            value: "viewAllEmployees",
          },
          {
            name: "View departments",
            value: "viewDepartment",
          },
          {
            name: "View all roles",
            value: "viewRole",
          },
          {
            name: "Add employee",
            value: "addEmployee",
          },
          {
            name: "Update employee",
            value: "updateEmployee",
          },
          {
            name: "Remove employee",
            value: "removeEmployee",
          },
          {
            name: "Add department",
            value: "addDepartment",
          },
          {
            name: "Add role",
            value: "addRole",
          },
          {
            name: "Quit",
            value: "quit",
          },
        ],
      },
    ])
    .then((res) => {
      switch (res.selection) {
        case "viewAllEmployees":
          viewAllEmployees();
          break;

        case "viewDepartment":
          viewDepartment();
          break;

        case "viewRole":
          viewRole();
          break;

        case "addEmployee":
          addEmployee();
          break;

        case "updateEmployee":
          updateEmployee();
          break;

        case "quit":
          quit();
          break;
      }
    });
}

function viewAllEmployees() {
  const sql = `SELECT *
  FROM employees`;
  db.promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.table(rows);
      generateQ();
    });
}

function viewDepartment() {
  const sql = `SELECT *
  FROM departments`;
  db.promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.table(rows);
      generateQ();
    });
}

function viewRole() {
  const sql = `SELECT *
  FROM roles`;
  db.promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.table(rows);
      generateQ();
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the new employees first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the new employees last name?",
      },
      {
        type: "input",
        name: "roleId",
        message:
          "What is the employees role? bagger = 1, cashier = 2, grocery clerk = 3, deli clerk = 4, produce clerk = 5:",
      },
      {
        type: "input",
        name: "managerId",
        message: "What is the new employees manager id?",
      },
    ])
    .then((answers) => {
      console.log(answers);
      first_name = answers.firstName;
      last_name = answers.lastName;
      role_id = answers.roleId;
      manager_id = answers.managerId;

      let sql = `INSERT INTO employees
        (first_name, last_name, role_id, manager_id)
        VALUES ("${first_name}", "${last_name}", ${role_id}, ${manager_id});`;
      console.log(sql);
      db.promise()
        .query(sql)
        .then(([rows, fields]) => {
          console.table(rows);

          generateQ();
        });
    });
}

async function updateEmployee() {
  let employees = await connection.query("SELECT * FROM employees");
  
  let employeeList = await inquirer.prompt([
      {
        type: "list",
        name: "employeeList",
        message: "What employee would you like to update?",
        choices: employees.map((name) => {
          return {
            name: name.first_name + "" + name.last_name,
            value: name.id
          }
        })
      }
    ])

    let showRoles = await connection.query("SELECT * FROM roles")
    let roleUpdateList = await inquirer.prompt([
      {
        type: "list",
        name: "role list",
        message: "What is the new role for this employee?",
        choices: roles.map((role) => {
          return {
            name: role.title,
            value: role.id
          }
        }) 
      }
    ])
}

function quit() {
  db.end();
}
