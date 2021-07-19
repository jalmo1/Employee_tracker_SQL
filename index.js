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
  var sql = `SELECT *
      FROM roles`;
  db.query(sql, function (err, results) {
    const roleId = [];
    const roleArr = [];
    results.forEach((element) => roleArr.push(element.title));
    results.forEach((element) => roleId.push(element.id));

    var sql = `SELECT first_name, last_name, employees.id FROM employees`;
    db.query(sql, function (err, results) {
      const id = [];
      const employeeArr = [];

      results.forEach((element) =>
        employeeArr.push(element.first_name + " " + element.last_name)
      );
      employeeArr.push("None");
      console.log(employeeArr);
      results.forEach((element) => id.push(element.id));

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
            type: "list",
            name: "roleId",
            message: "What is the employees role?",
            choices: roleArr,
          },
          {
            type: "list",
            name: "managerId",
            message: "What is the new employees manager id?",
            choices: employeeArr,
          },
        ])
        .then((answers) => {
          const index = employeeArr.indexOf(answers.managerId);
          const index1 = roleArr.indexOf(answers.roleId);
          console.log(index1);
          console.log(roleId);
          console.log(id[index]);
          if (index == employeeArr.length - 1) {
            var sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${answers.firstName}", "${answers.lastName}", ${roleId[index1]}, NULL);`;
          } else {
            var sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${answers.firstName}", "${answers.lastName}", ${roleId[index1]}, ${id[index]});`;
          }
          console.log(sql);
          db.promise()
            .query(sql)
            .then(([rows, fields]) => {
              console.table(rows);

              generateQ();
            });
        });
    });
  });
}

function updateEmployee() {
  var sql = `SELECT first_name, last_name, employees.id FROM employees`;
  db.query(sql, function (err, results) {
    const id = [];
    const employeeArr = [];

    results.forEach((element) =>
      employeeArr.push(element.first_name + " " + element.last_name)
    );

    results.forEach((element) => id.push(element.id));

    let pickEmployee = {
      type: "list",
      name: "employeePick",
      message: "What employee do You want to pick?",
      choices: employeeArr,
    };

    inquirer.prompt(pickEmployee).then((answer) => {
      console.log(answer);
      const index = employeeArr.indexOf(answer.employeePick);
      console.log(index);

      var sql = `SELECT *
      FROM roles`;
      db.query(sql, function (err, results) {
        const roleId = [];
        const roleArr = [];
        results.forEach((element) => roleArr.push(element.title));
        results.forEach((element) => roleId.push(element.id));

        console.log(roleId, roleArr);

        let pickRole = {
          type: "list",
          name: "rolePick",
          message: "What role do you want to pick?",
          choices: roleArr,
        };

        inquirer.prompt(pickRole).then((answer) => {
          console.log(answer);
          const index1 = roleArr.indexOf(answer.rolePick);
          console.log(index1);

          let sql = `UPDATE employees SET role_id = ${roleId[index1]} WHERE employees.id = ${id[index]}`;
          db.promise()
            .query(sql)
            .then(([rows, fields]) => {
              console.table(rows);

              generateQ();
            });
        });
      });
    });
  });
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

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "departName",
        message: "What would you like the new department name to be?",
      },
    ])
    .then((newName) => {
      console.log(newName);

      newDepart = newName.departName;

      let sql = `INSERT INTO departments 
      (name)
      VALUES ("${newDepart}");`;
      db.promise()
        .query(sql)
        .then(([rows, fields]) => {
          console.table(rows);

          generateQ();
        });
    });
}

function quit() {
  db.end();
}
