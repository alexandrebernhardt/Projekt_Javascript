// Variables declaration
const mysql = require('mysql');

// Database connection
var mySQLCredentials = mysql.createConnection({
		host: 'localhost',
		user: 'rootusr',
		password: 'rootpsswd',
		database: 'thermometer'
});

// Select requests
var selectAllData = 'SELECT * FROM data';
var selectAllUsers = 'SELECT username, password FROM users';
var selectTempBgColor = 'SELECT temperature, background_color FROM data';
var selectTempBgColorAndAccess = 'SELECT temperature, background_color, access_status FROM data';

// Update requests
var setAccessAuthorized = 'UPDATE data SET access_status = "authorized"';
var setAccessDenied = 'UPDATE data SET access_status = "denied"';
var setTemperatureTo = 'UPDATE data SET temperature = ';

// Background color updates
var setRedBackground = 'UPDATE data SET background_color = "red"';
var setRoyalBlueBackground = 'UPDATE data SET background_color = "royalblue"';
var setSkyBlueBackground = 'UPDATE data SET background_color = "skyblue"';
var setTomatoBackground = 'UPDATE data SET background_color = "tomato"';
var setYellowGreenBackground = 'UPDATE data SET background_color = "yellowgreen"';

// Keeping the values in a module
module.exports = {mySQLCredentials: mySQLCredentials, selectAllData: selectAllData, selectAllUsers: selectAllUsers, selectTempBgColor: selectTempBgColor, selectTempBgColorAndAccess: selectTempBgColorAndAccess, setAccessAuthorized: setAccessAuthorized, setAccessDenied: setAccessDenied, setTemperatureTo: setTemperatureTo, setRedBackground: setRedBackground, setRoyalBlueBackground: setRoyalBlueBackground, setSkyBlueBackground: setSkyBlueBackground, setTomatoBackground: setTomatoBackground, setYellowGreenBackground: setYellowGreenBackground};
