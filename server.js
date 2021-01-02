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
            addEmp()
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
                console.log(res[0].id)
                connection.query("INSERT INTO role SET ?", {title: response.addRole, salary: response.salary, department_id: res[0].id}, function(err, res) {
                    console.log("Role Successfully added!")
                })
            })
        })
    })
    }
    function addEmp() {
        connection.query("SELECT id, title AS name FROM role", function(err, res) {
            console.log(res)
            var roles = res
        inquirer.prompt([
            {
                type: "input",
                name: "firstName",
                message: "What is your first name?"
            },
            {
                type: "input",
                name: "lastName",
                message: "What is your last name?"
            },
            {
                type: "list",
                name: "list",
                message: "What role would you like to choose?",
                choices: roles
            },
            {
                type: "confirm",
                name: "manager",
                message: "Does this employee have a mananger?"
            }
        ]).then((response) => {
            console.log(response)
            if (response.manager){
                connection.query("SELECT first_name, last_name FROM employee", function(err, res) {
                    console.log(res)
                    var employees = res.map(function(employee) {
                        return {name: `${employee.first_name} ${employee.last_name}`}
                    })
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "managerList",
                            message: "Who is this employees manager?",
                            choices: employees
                        }
                    ]).then((resp) => {
                        connection.query("SELECT id FROM role WHERE ?", {title: response.list}, function(err, res) {
                            console.log(res)
                            var roleId = res[0].id

                            var names = resp.managerList.split(" ")
                        connection.query("SELECT id FROM employee WHERE ? AND ?", [{first_name: names[0]}, {last_name: names[1]}], function(err, res) {
                            var managerId = res[0].id
                            console.log(response.firstName, response.lastName, roleId, managerId)
                            connection.query("INSERT INTO employee SET ?", {first_name: response.firstName, last_name: response.lastName, role_id: roleId, manager_id: managerId}, function(err, res) {
                                console.log(res)
                            })
                        })
                        })
                    })
                })
                

            }else{
                connection.query("SELECT id FROM role WHERE ?", {title: response.list}, function(err, res) {
                    console.log(res)
                    var roleId = res[0].id
                    connection.query("INSERT INTO employee SET ?", {first_name: response.firstName, last_name: response.lastName, role_id: roleId}, function(err, res) {
                        console.log(res)
                    })
                })
            }
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

function update() {
    connection.query("SELECT * FROM employee", function(err, res) {
        var employee = res
        var Names = employee.map((item)=> {
            return `${item.first_name} ${item.last_name}`
        })
        console.log(Names)
        inquirer.prompt([
            {
                type: "list",
                name: "employee_name",
                message: "Which employee would you like to update?",
                choices: Names
            }
        ]).then ((response) => {
            connection.query("SELECT * FROM role", function(err, res) {
                var newRole = res
                var roleRes = newRole.map((item2) => {
                    return item2.title
                })
                inquirer.prompt([
                    {
                        type: "list",
                        name: "role_name",
                        message: "What role would you like to move into?",
                        choices: roleRes
                    }
                ]).then ((result) => {
                    var seperateNames = response.employee_name.split(" ")
                    connection.query("SELECT id FROM role WHERE ?", {title: result.role_name}, function(err, res){
                        connection.query(
                            "UPDATE employee SET ? WHERE ? AND ?",
                            [
                              {
                                role_id: res[0].id
                              },
                              {
                                first_name: seperateNames[0]
                              },
                              {
                                last_name: seperateNames[1]
                              }
                            ],
                            function(err, res) {
                              if (err) throw err;
                            }
                        )
                    })
                    }) 

                    
            })
        })
    })
}