const { resolveSoa } = require("dns");
const inquirer = require("inquirer");
var mysql = require("mysql");

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
        
    })
}

function departments() {
    connection.query("SELECT * FROM departments", function(err, res) {
        console.log(res)
        console.log(err)
        console.log("HELLO")
    })
}

function employees() {
    connection.query("SELECT * FROM employees", function(err, res) {
        console.log(res)
        console.log(err)
        console.log("HELLO")
    })
}