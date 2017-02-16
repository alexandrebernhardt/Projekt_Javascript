-- create the specific user we're going to need
CREATE USER 'rootusr'@'localhost' IDENTIFIED BY 'rootpsswd';

-- create new database
CREATE DATABASE thermometer;

-- Give the user we just created the rights to access and edit the database
GRANT SELECT, UPDATE ON thermometer TO 'rootusr'@'localhost' IDENTIFIED BY 'rootpsswd';

-- select database
use thermometer;

-- create table data that will store all the values
CREATE TABLE data (
  `temperature` int(11) NOT NULL,
  `background_color` text NOT NULL,
  `access_status` text NOT NULL,
  `purchase_date` date NOT NULL,
  `insurance_end` date NOT NULL,
  `failures_start` date NOT NULL
);

-- insert default values
INSERT INTO `data` (`temperature`, `background_color`, `access_status`, `purchase_date`, `insurance_end`, `failures_start`) VALUES
(20, 'yellowgreen', 'authorized', '2017-01-01', '2019-01-01', '2020-01-01');

-- create table users to store the valid usernames
CREATE TABLE `users` (
  `username` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- insert two users to the last table
INSERT INTO `users` (`username`, `password`) VALUES
('admin', 'admin'),
('htw', 'javascript');

-- display the entire database
show tables;
SELECT * FROM data;
SELECT * FROM users;
