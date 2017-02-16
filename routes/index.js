// Constants declaration
const database = require("../lib/database");
const ejs = require('ejs');
const express = require('express');
const fs = require('fs');
var router = express.Router();

// Variables declaration
var values;
var access;
var background;
var temperature;
var tempTest;

// reading the main page
router.get('/', function(req, res) {

	// database connection
	var mySqlClient = database.mySQLCredentials;

// ------------------------------- storing values into variables -------------------------
	mySqlClient.query(database.selectTempBgColorAndAccess, function select(error, results, fields) {

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
			access = values['access_status'];
		}

// ------------------------------------- access -----------------------------------------
		var content_index;

		// if access is authorized
		if (access === "authorized") {

			// Calling index.html
			content_index = fs.readFileSync('views/index.html', 'utf-8');
		}

		// if access isn't authorized
		else {

			// Calling misuse.html
			content_index = fs.readFileSync('views/misuse.html', 'utf-8');
		}

// ---------------------------------------------------------------------------------------
		// Displaying current access status in the terminal
		console.log("access", access);

		var compiled = ejs.compile(content_index);

		// Sending values to the HTML-file
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(compiled({background: background, temperature: temperature + ""}));
		res.end();
	});
});

// Keeping the code in a module
module.exports = router;
