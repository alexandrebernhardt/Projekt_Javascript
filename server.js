// Packages installation
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const express = require('express');
const favicon = require('static-favicon');
const fs = require('fs');
const http = require('http');
const path = require('path');
const session = require('cookie-session');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var app = express();

// Putting the paths to the JS-files in several variables
const index = require('./routes/index');
const agent = require('./routes/agent');
const changeTemperature = require('./routes/change-temperature');
const users = require('./routes/users');

	// HTML-files directory
	app.set('views', 'html');

	// putting the index file at the default address
	app.use('/', index);

	// linking agent.js to /agent47
	app.use('/agent47', agent);

	// linking change-temperature.js to /change-temperature
	app.use('/change-temperature', changeTemperature);

	// linking users.js to /users
	app.use('/users', users);

// Searching images and stylesheets in public
app.use(express.static(path.join(__dirname, 'public')));

// if url doesn't exist
app.use(function(req, res, next) {

	// Go to not-found.html
	var content = fs.readFileSync('./views/not-found.html', 'utf-8');
	var compiled = ejs.compile(content);

	// Send a default background color
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write(compiled({background: "yellowgreen"}));
	res.end();
});

// Server reading port
app.listen(8080);

// Making sure the server works
console.log('server started successfully');
