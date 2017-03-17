// Constants for min and max temperatures allowed
const MINIMAL_TEMPERATURE = 2;
const MAXIMAL_TEMPERATURE = 60;

// Color constants
const RED = "red";
const ROYALBLUE = "royalblue";
const SKYBLUE = "skyblue";
const TOMATO = "tomato";
const YELLOWGREEN = "yellowgreen";

// Global variable with the temperature
var baseTemperature;

// Constant with the SQL requests
const database = require("../lib/database");

/**
 * calculateNewTemperature function
 * to calculate the new temperature
 *
 * @param {int} givenNumber the degrees the user wants to add
 * @return {int} newTemperature the new temperature
 * */
function calculateNewTemperature(givenNumber) {

	// Calculation
	var newTemperature = baseTemperature + + givenNumber;

	// displaying old, new and added temperature
	console.log("base temperature:", baseTemperature);
	console.log("selected amount:", givenNumber);
	console.log("new temperature:", newTemperature);

	// If temperature isn't allowed
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
	}

	// returning new temperature
	return newTemperature;
}

/**
 * defineNewBackgroundColor function
 * to define the background color
 *
 * @param {int} givenTemperature the current temperature
 * @return {String} the new background color
 * */
function defineNewBackgroundColor(givenTemperature) {

	// Temperature constants
	const FREEZING_COLD = 5;
	const COLD = 15;
	const HOT = 25;
	const BOILING_HOT = 35;

	// if temperature very low
	if (givenTemperature <= FREEZING_COLD) {

		// background color is set to RoyalBlue
		return ROYALBLUE;
	}

	// if temperature low but not too much
	else if (givenTemperature > FREEZING_COLD && givenTemperature <= COLD) {

		// background color is set to SkyBlue
		return SKYBLUE;
	}

	// if temperature hot but not too much
	else if (givenTemperature >= HOT && givenTemperature < BOILING_HOT) {

		// background color is set to Tomato
		return TOMATO;
	}

	// if temperature very hot
	else if (givenTemperature >= BOILING_HOT) {

		// background color is set to Red
		return RED;
	}

	// Default case: if temperature is moderate
	else {

		// background color is set to YellowGreen
		return YELLOWGREEN;
	}
}

/**
 * selectCorrespondingQuery function
 * to calculate the new temperature
 *
 * @param {int} backgroundColor the current bg color
 * @return {String} the corresponding SQL request
 * */
function selectCorrespondingQuery(backgroundColor) {

	// if background color is RoyalBlue
	if (backgroundColor == ROYALBLUE) {
		return database.setRoyalBlueBackground;
	}

	// if background color is SkyBlue
	else if (backgroundColor == SKYBLUE) {
		return database.setSkyBlueBackground;
	}

	// if background color is Tomato
	else if (backgroundColor == TOMATO) {
		return database.setTomatoBackground;
	}

	// if background color is Red
	else if (backgroundColor == YELLOWGREEN) {
		return database.setRedBackground;
	}

	// Default case: if background color is YellowGreen
	else {
		return database.setYellowGreenBackground;
	}
}

/**
 * main function
 * */
function main() {

	// Constants declaration
	const bodyParser = require('body-parser');
	const ejs = require('ejs');
	const express = require('express');
	const fs = require('fs');
	const http = require('http');

	// Variables declaration
	var app = express();
	var changeTemperature = express.Router();
	var urlencodedParser = bodyParser.urlencoded({extended: false});

	app.use(bodyParser.urlencoded({extended: true}));

	// database connection
	var mySqlClient = database.mySQLCredentials;

	// reads the main page
	changeTemperature.post('/', urlencodedParser, function(req, res) {

// ---------------------------- select temperature ----------------------------------------
		mySqlClient.query(database.selectTempBgColor, function select(error, results, fields) {

			// Variables specific to this file
			var values;
			var background;

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

// --------------------------- if temperature < 2 or > 60 --------------------------------
			var content_index;
			var compiled;

			// Sending the value to add to a specific function
			var newTemperature = calculateNewTemperature(req.body.degreesToAdd);

			// If temperature isn't allowed
			if (newTemperature < MINIMAL_TEMPERATURE || newTemperature > MAXIMAL_TEMPERATURE) {

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
			background = defineNewBackgroundColor(newTemperature);

			// Informing about current background color in the terminal
			console.log("current background color:", background);

			var setBackgroundQuery = selectCorrespondingQuery(background);

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
}

// Executing main
main();
