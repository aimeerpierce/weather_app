//import modules
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');
var app = express();
var myRouter = require('./app/routes');


//support JSON-encoded bodies
app.use( bodyParser.json() );
//serve static files
app.use(express.static('public'));
app.use(express.static('app'));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));


var port = process.env.PORT || 8080;

//configure routes
app.use('/', myRouter);

var port = process.env.PORT || 8080;
app.listen(port);
console.log('Magic happens on port ' + port);

// expose app
exports = module.exports = app;
