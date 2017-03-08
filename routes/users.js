// Constants declaration
const database = require("../lib/database");
const bodyParser = require('body-parser');
const ejs = require('ejs');
const express = require('express');
const fs = require('fs');
const http = require('http');

// Variables declaration
var app = express();
var urlencodedParser = bodyParser.urlencoded({extended: false});
var users = express.Router();

app.use(bodyParser.urlencoded({extended: true}));

// database connection
var mySqlClient = database.mySQLCredentials;

// reading the main page
users.post('/', urlencodedParser, function(req, res) {

// ---------------------------- select temperature ---------------------------------------
	mySqlClient.query(database.selectTempBgColor, function select(error, results, fields) {

		// Variables specific to this file
		var values;
		var background;
		var temperature;

		if (error) {

			console.log(error);
			mySqlClient.end();
			return;
		}

		// if something has been found
		if (results.length > 0) {

			// store the values in specific variables
			values = results[0];
			temperature = values['temperature'];
			background = values['background_color'];
		}

// ----------------------- checking if user and password exist --------------------------
		mySqlClient.query(database.selectAllUsers, function select(error, results, fields) {

			// Constant with the number of admins
			const NUMBER_OF_ADMINS = 2;

			if (error) {
				console.log(error);
				mySqlClient.end();
				return;
			}

			// if something has been found
			if (results.length > 0) {

				// Variables declaration
				var content_index;
				var compiled;
				var adminUser;

				// Variables to store what the user gave us
				var givenAlias = req.body.alias;
				var givenPassword = req.body.password;

				// Displaying those last 2 variables in the terminal
				console.log("given username:", givenAlias);
				console.log("given password:", givenPassword);

				// scanning the list of admin users
				for (var i = 0; i < NUMBER_OF_ADMINS; i++) {

					// putting the current one in a variable
					adminUser = results[i];

					// if its credentials are the same as the ones given by the user
					if (givenAlias === adminUser['username'] && givenPassword === adminUser['password']) {

						// display in terminal that the admin has logged in successfully
						console.log("admin login successful");

						// Calling login.html
						content_index = fs.readFileSync('views/login.html', 'utf-8');
						compiled = ejs.compile(content_index);

						// Sending values to the HTML-file
						res.writeHead(200, {'Content-Type': 'text/html'});
						res.write(compiled({background: background, temperature: temperature, user: adminUser['username']}));
						res.end();

						// Leaving this file
						return;
					}

					// if an admin mistyped his password
					else if (givenAlias === adminUser['username'] && givenPassword != adminUser['password']) {

						// telling him in the terminal that the password isn't correct
						console.log("login failed: wrong password");
					}
				}

				// If no admin corresponds to the credentials given by the user
				console.log("current user is not an admin, he can't change the temperature");

				// Calling no-rights.html
				content_index = fs.readFileSync('views/no-rights.html', 'utf-8');
				compiled = ejs.compile(content_index);

				// Sending values to the HTML-file
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.write(compiled({background: background}));
				res.end();
			}
		});
	});
});

// Keeping the code in a module
module.exports = users;
