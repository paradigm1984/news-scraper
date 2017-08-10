// Dependencies
var express = require("express");
var path = require('path');
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// https://github.com/armthepit/homework14-all-the-news

// Initialize Express
var app = express();

// Database
require("./config/connection");

// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

mongoose.Promise = Promise;

// Requiring our Note and Article models
var Comment = require("./models/comment.js");
var Article = require("./models/article.js");



// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));


// Import Routes/Controller
var routes = require('./controller/controllers.js');
app.use('/', routes);



// Listen on port
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Running on port: ' + port);
});
