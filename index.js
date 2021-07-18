const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
// const Connection = require("mysql2/typings/mysql/lib/Connection");

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

        case "addRole":
          addRole();
          break;

        case "addDepartment":
          addDepartment();
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

function updateEmployee() {
  let employees = "SELECT * FROM employees";

  inquirer.prompt([
    {
      type: "list",
      name: "employee",
      message: "What employee would you like to update?",
      choices: employees((name) => {
        return {
          name: name.first_name + "" + name.last_name,
          value: name.id,
        };
      }),
    },
  ]);

  // let showRoles = await connection.query("SELECT * FROM roles");
  // let roleUpdateList = await inquirer.prompt([
  //   {
  //     type: "list",
  //     name: "role list",
  //     message: "What is the new role for this employee?",
  //     choices: showRoles.map((role) => {
  //       return {
  //         name: role.title,
  //         value: role.id,
  //       };
  //     }),
  //   },
  // ]);
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "roleName",
        message: "What is the name of the new role?",
      },
      {
        type: "input",
        name: "roleSalary",
        message: "What is the salary of the new role?",
      },
      {
        type: "input",
        name: "roleDepartId",
        message:
          "What is the new department id? CS=1, Grocery=2, DELI=3, PRODUCE=4:",
      },
    ])
    .then((answers) => {
      console.log(answers);
      role_name = answers.roleName;
      salary = answers.roleSalary;
      depart_id = answers.roleDepartId;

      let sql = `INSERT INTO roles
      (title, salary, department_id)
      VALUES ("${role_name}", ${salary}, ${depart_id});`;
      db.promise()
        .query(sql)
        .then(([rows, fields]) => {
          console.table(rows);

          generateQ();
        });
    });
}

// function addDepartment() {
//   inquirer.prompt([
//     {
//       type: "input",
//       name: ""
//     }
//   ])
// }

function quit() {
  db.end();
}
