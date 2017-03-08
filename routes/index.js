// Constants declaration
const database = require("../lib/database");
const ejs = require('ejs');
const express = require('express');
const fs = require('fs');
var router = express.Router();

// reading the main page
router.get('/', function(req, res) {

	// database connection
	var mySqlClient = database.mySQLCredentials;

// ------------------------------- storing values into variables -------------------------
	mySqlClient.query(database.selectTempBgColorAndAccess, function select(error, results, fields) {

		// Variables declaration
		var values;
		var access;
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
			access = values['access_status'];
		}

		// Displaying current access status in the terminal
		console.log("access", access);

		var content_index = displayedFile(access);

		var compiled = ejs.compile(content_index);

		// Sending values to the HTML-file
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(compiled({background: background, temperature: temperature + ""}));
		res.end();
	});
});

/**
 * displayedFile function
 * to send a file to display
 *
 * @param {String} currentStatus the current access status
 * @return {String} the file that must be displayed
 * */
function displayedFile(currentStatus) {

	// if access is authorized
	if (currentStatus === "authorized") {

		// Calling index.html
		return fs.readFileSync('views/index.html', 'utf-8');
	}

	// if access isn't authorized
	else {

		// Calling misuse.html
		return fs.readFileSync('views/misuse.html', 'utf-8');
	}
}

// Keeping the code in a module
module.exports = router;
