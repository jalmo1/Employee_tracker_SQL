const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

//creates connection to database
const db = mysql.createConnection({
  host: "localhost",
  // Your MySQL username,
  user: "root",
  // Your MySQL password
  password: "/pNyxgg4F",
  database: "employee_tracker",
});

// starts the initial list of options when app is run
function init() {
  generateQ();
}
init();

//list of options
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

// function to see all the current employees
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

      //questions to get the info needed to add the new employee data
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

          //an if stateement to make sure that index doesn't go below 0
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

//function to update an employees role
function updateEmployee() {
  //gets the current first names last names and id's from the employee tables
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
  const sql = `SELECT *
  FROM departments`;

  db.query(sql, function (err, results) {
    // displays the department names instead of the id number
    const departId = [];
    const departArr = [];
    results.forEach((element) => departArr.push(element.name));
    results.forEach((element) => departId.push(element.id));

    console.log(departId, departArr);

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
          type: "list",
          name: "roleDepartId",
          message: "What is the new department id?",
          choices: departArr,
        },
      ])
      .then((answers) => {
        console.log(answers);
        const departIndex = departArr.indexOf(answers.roleDepartId);
        console.log(departIndex);

        role_name = answers.roleName;
        salary = answers.roleSalary;
        depart_id = answers.roleDepartId;
        // the MYSQL line to insert the info into the table
        let sql = `INSERT INTO roles
      (title, salary, department_id)
      VALUES ("${role_name}", ${salary}, ${departId[departIndex]});`;
        db.promise()
          .query(sql)
          .then(([rows, fields]) => {
            console.table(rows);

            generateQ();
          });
      });
  });
}

// functionality for creating a new department
function addDepartment() {
  //initial question for the new department name
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
      // the MYSQL line to insert the info into the table
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

// Function to close the database or end the program
function quit() {
  db.end();
}
