CREATE DATABASE employee_db;
​
create table department (
 id int primary key auto_increment,
 name varchar(30) null
);
​
create table role (
	id int primary key auto_increment,
	department_id int,
    title varchar(30) null,
    salary decimal null,
    foreign key (department_id) references department(id)
);
​
CREATE TABLE employee (
id int primary key auto_increment,
first_name varchar(30) null,
last_name varchar(30) null,
role_id int,
manager_id int,
foreign key (role_id) references role(id),
foreign key (manager_id) references employee(id)
)