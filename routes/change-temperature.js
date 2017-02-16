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
var changeTemperature = express.Router();

// Specific constants for the background color
const FREEZING_COLD = 5;
const COLD = 15;
const HOT = 25;
const BOILING_HOT = 35;
const MINIMAL_TEMPERATURE = 2;
const MAXIMAL_TEMPERATURE = 60;

// Variables specific to this file
var values;
var background;
var baseTemperature;

app.use(bodyParser.urlencoded({extended: true}));

// database connection
var mySqlClient = database.mySQLCredentials;

// reads the main page
changeTemperature.post('/', urlencodedParser, function(req, res) {

// ---------------------------- select temperature ----------------------------------------
	mySqlClient.query(database.selectTempBgColor, function select(error, results, fields) {

		if (error) {

			console.log(error);
			mySqlClient.end();
			return;
		}

		// if something has been found
		if (results.length > 0) {

			// store the values in specific variables
			values = results[0];
			baseTemperature = values['temperature'];
			background = values['background_color'];
		}

// --------------------------- new temperature calculation -------------------------------
		// calculation
		var givenNumber = req.body.degreesToAdd;
		var newTemperature = baseTemperature + + givenNumber;

		// displaying old, new and added temperature
		console.log("base temperature:", baseTemperature);
		console.log("selected amount:", givenNumber);
		console.log("new temperature:", newTemperature);

// --------------------------- if temperature < 2 or > 60 --------------------------------
		var content_index;
		var compiled;

		if (newTemperature < MINIMAL_TEMPERATURE || newTemperature > MAXIMAL_TEMPERATURE) {

			// Displaying the situation in the terminal
			console.log("Error: temperature isn't between", MINIMAL_TEMPERATURE, "or", MAXIMAL_TEMPERATURE, "degrees!");

			// Denying the access to the thermometer
			mySqlClient.query(database.setAccessDenied, function(err, result) {

				if (!err) {
					res.status(201);
				}

				else {
					res.status(500);
				}
			});

			// Displaying changes in the terminal
			console.log("access set to denied");

			// Calling misuse.html
			content_index = fs.readFileSync('views/misuse.html', 'utf-8');
			compiled = ejs.compile(content_index);

			// Sending the background color only
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(compiled({background: background}));
			res.end();

			// Leaving this program
			return;
		}

// ---------------------------- update temperature in db --------------------------------
		var temperatureQuery = database.setTemperatureTo + newTemperature;

		mySqlClient.query(temperatureQuery, function(err, result) {

			if (!err) {
				res.status(201);
			}

			else {
				res.status(500);
			}
		});

// ------------------------------ background values --------------------------------------
		var setBackgroundQuery;

		// if temperature very low
		if (newTemperature <= FREEZING_COLD) {

			// background color is set to RoyalBlue
			background = "royalblue";
			setBackgroundQuery = database.setRoyalBlueBackground;
		}

		// if temperature low but not too much
		else if (newTemperature > FREEZING_COLD && newTemperature <= COLD) {

			// background color is set to SkyBlue
			background = "skyblue";
			setBackgroundQuery = database.setSkyBlueBackground;
		}

		// if temperature hot but not too much
		else if (newTemperature >= HOT && newTemperature < BOILING_HOT) {

			// background color is set to Tomato
			background = "tomato";
			setBackgroundQuery = database.setTomatoBackground;
		}

		// if temperature very hot
		else if (newTemperature >= BOILING_HOT) {

			// background color is set to Red
			background = "red";
			setBackgroundQuery = database.setRedBackground;
		}

		// Default case: if temperature is moderate
		else {

			// background color is set to YellowGreen
			background = "yellowgreen";
			setBackgroundQuery = database.setYellowGreenBackground;
		}

		// Informing about current background color in the terminal
		console.log("current background color:", background);

// ---------------------------- update background in db ---------------------------------
		mySqlClient.query(setBackgroundQuery, function(err, result) {

			if (!err) {
				res.status(201);
			}

			else {
				res.status(500);
			}
		});

// --------------------------------------------------------------------------------------
		// Calling next file
		content_index = fs.readFileSync('views/index.html', 'utf-8');
		compiled = ejs.compile(content_index);

		// Sending values to the HTML-file
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(compiled({background: background, temperature: newTemperature}));
		res.end();
	});
});

// Keeping the code in a module
module.exports = changeTemperature;
