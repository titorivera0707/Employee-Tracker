const { resolveSoa, ADDRGETNETWORKPARAMS } = require("dns");
const inquirer = require("inquirer");
var mysql = require("mysql");
const { allowedNodeEnvironmentFlags } = require("process");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "database_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  initial()
});

function initial() {
    inquirer.prompt({
        type: "list",
        name: "initial",
        message: "What would you like to do?",
        choices: ["Add departments, roles, or employees.", "View departments, roles, or employees.", "Update departments, roles, or employees.", "Delete departments, roles, or employees.", "Exit"]
    }).then(function(answer) {
        switch (answer.initial){
        case "Add departments, roles, or employees.":
            add();
            break;
        
        case "View departments, roles, or employees.":
            viewer();
            break;
        
        case "Update departments, roles, or employees.":
            update();
            break;
        
        case "Delete departments, roles, or employees.":
            del();
            break;

        case "Exit":
            connection.end();
            break;
    }
    })
}

function add() {
    inquirer.prompt({
        type: "list",
        name: "add",
        message: "What would you like to add?",
        choices: ["Departments", "Roles", "Employees"]
    }).then((response) => {
        if(response.add === "Departments"){
            addDep()
        }
        if(response.add === "Roles") {
            addRole()
        }
        if(response.add === "Employees") {
            AddEmp()
        }
    })
    function addDep() {
        inquirer.prompt({
            type: "input",
            name: "Dep",
            message: "What department would you like to add?"
        }).then((response) => {
            connection.query("INSERT INTO department (name) VALUES (?)", [response.Dep], function(err, data) {
                if (err) throw err;
                console.log("Department successfully added!")
            })
        })
    }
    function addRole() {
        connection.query("SELECT * FROM department", function(err, res) {
            var departments = res
            console.log(res)
        inquirer.prompt([
            {
                type: "input",
                name: "addRole",
                message: "What would you like to name your new role?"
            },
            {
                type: "input",
                name: "salary",
                message: "What will the salary be?"
            },
            {
            type: "list",
            name: "list",
            message: "What department would you like to choose?",
            choices: departments
            }
        ]).then((response) => {
            console.log(response.list)
            connection.query("SELECT id FROM department WHERE ?", {name: response.list}, function(err, res) {
                console.log(res)
                connection.query("INSERT INTO role SET ?", [response.addRole, response.salary, response.list], function(err, res) {
                    console.log("Role Successfully added!")
                })
            })
        })
    })
    }
}

function viewer() {
    inquirer.prompt({
        type: "list",
        name: "viewer",
        message: "What would you like to view?",
        choices: ["Departments", "Roles", "Employees"]
    }).then((response) => {
        if(response.viewer === "Roles"){
            roles()
        }
        if(response.viewer === "Departments") {
            departments()
        }
        else {
            employees()
        }
    })
}

function roles() {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        console.log(res)
    })
}

function departments() {
    connection.query("SELECT * FROM department", function(err, res) {
        console.log(res)
        res.json()
    })
}

function employees() {
    connection.query("SELECT * FROM employee", function(err, res) {
        console.log(res)
    })
}