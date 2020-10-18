DROP DATABASE IF EXISTS employee_info;

CREATE DATABASE employee_info;

USE employee_info;

CREATE TABLE departments (
  id INT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE roles