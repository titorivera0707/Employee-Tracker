DROP DATABASE IF EXISTS database_DB;
CREATE database database_DB;

USE database_DB;

CREATE TABLE employee (
  id INT AUTO_INCREMENT,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role_id INT(20) NOT NULL,
  manager_id INT(20),
  PRIMARY KEY(id)
);

CREATE TABLE role (
    id INT AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL(20, 4),
    department_id INT(20),
    PRIMARY KEY(id)
);

CREATE TABLE department (
    id INT AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY(id)
)