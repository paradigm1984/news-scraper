var mongoose = require("mongoose");

// Local Database Configuration with Mongoose
/*
mongoose.connect("mongodb://localhost/newsScraper", function(error) {
	if(error) {
		throw error;
		console.log("there was an error connecting with the DB");
	} 
	console.log("Database connected");
}); */

mongoose.connect("mongodb://dblanco:qwert1@ds159217.mlab.com:59217/heroku_4vgvv30r", function(error) {
	if(error) {
		throw error;
		console.log("there was an error connecting with the DB");
	} 
	console.log("Database connected");
}); 