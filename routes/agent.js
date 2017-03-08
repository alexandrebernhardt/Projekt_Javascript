// Constants declaration
const database = require("../lib/database");
const ejs = require('ejs');
const express = require('express');
const fs = require('fs');
const http = require('http');
var router = express.Router();

// reading the main page
router.get('/', function(req, res) {

	// database connection
	var mySqlClient = database.mySQLCredentials;

// ------------------------------- storing values into variables -------------------------
	mySqlClient.query(database.selectAllData, function select(error, results, fields) {

		// Variables declaration
		var values;
		var access;
		var background;
		var failuresStart;
		var insuranceEnd;
		var purchaseDate;
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
			purchaseDate = values['purchase_date'];
			insuranceEnd = values['insurance_end'];
			failuresStart = values['failures_start'] ;
		}

// -------------------- update access status to "authorized" ------------------------------
		mySqlClient.query(database.setAccessAuthorized, function(err, result) {

			if (!err) {
				res.status(201);
			}

			else {
				res.status(500);
			}
		});

		// Display changes in the terminal
		console.log("The tech crew has reseted the access value");

// -------------------------------- launching tech-support.html --------------------------------
		var content_index = fs.readFileSync('views/tech-support.html', 'utf-8');
		var compiled = ejs.compile(content_index);

		// pass the values to the HTML-file
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(compiled({background: background, temperature: temperature, purchase: purchaseDate, insurance: insuranceEnd, failures: failuresStart}));
		res.end();
	});
});

// Keeping the code in a module
module.exports = router;
