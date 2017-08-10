// Node Dependencies
var express = require('express');
var path = require('path');

// for web-scraping
var request = require('request'); 
var cheerio = require('cheerio');

var router = express.Router();
var mongoose = require('mongoose');

mongoose.Promise = Promise;



// Requiring our Note and Article models
var Comment = require("../models/comment.js");
var Article = require("../models/article.js");


/* router.get("/", function(req, res) {
	res.redirect("/scrape");
}); */ 

// route to scrape from the ny times
router.get("/scrape", function(req, res) {
	request("https://www.nytimes.com/section/world?nytmobile=0", function(error, response, html) {

		if(!error && res.statusCode === 200) {
			var $ = cheerio.load(html);
		} else {
			console.log("there was an error in the initial request");
		}

		// console.log("triggered scrape on click");

		var result = [];

		// FIND OUT HOW TO LIMIT THE AMOUNT OF SCRAPES
		$(".theme-summary").each(function(i, element) {

			// collect the title contained in the h2 of the div of this
			result.title = $(this).children("div").children("h2").text().trim();
			// console.log("results for title: " + result.title);

			// collect the link contained in the a tag of the h2 where the header is of the div of this
			result.link = $(this).children("figure").attr("class", "photo").children("a").attr("href");
			// console.log("results for link: " + result.link);

			// collect the title contained in the p of the div of this
			result.summary = $(this).children("div").children("p").first().text().trim();
			// console.log("results for summary: " + result.summary);

			// was trying to create some logic that would take out the extra empty elements
			/* if(result.link = "undefined") {
				return false;
			} */

			result[i] = ({
				title: result.title,
				link: result.link,
				summary: result.summary
			});
			console.log(result[i]);


			Article.findOne({"title": result.title}, function(error, articleRecord) {
				if(error) {
					console.log(error);
				} else {
					if(articleRecord == null) {
						Article.create(result[i], function(error, record) {
							if(error) {
								throw error;
							}
							console.log("record added to the database!!");
						});
					} else {
						console.log("no record was added because it already exists.");
					}
				}
			});
			return i<30;
		});
		// res.send("Scrape Complete"); 
		console.log("scrape completed");
		// res.redirect("/");
	});
});

// route to load the articles
router.get("/articles", function(req, res) {
	console.log("triggered article on click");
	Article.find().sort({createdAt: -1}).exec(function(error, data) {
		if(error) {
			throw error;
			console.log("check your articles route");
		} else {
			console.log("pushed to the front end");
			res.json(data);
			console.log("data: " + data);
		} 
	});
});

// route to load comments for one article
router.get('/comments/:id', function(req, res){
	Comment.find({'articleId': req.params.id}).exec(function(error, data) {
		if(error) {
			console.log(error);
			console.log("check your comments id route");
		} else {
			res.json(data);
		}	
	});
});

// Add comment for article
router.post('/addcomment/:id', function(req, res){
	console.log(req.params.id +' '+ req.body.comment);
	Comment.create({
		articleId: req.params.id,
		name: req.body.name,
		comment: req.body.comment
	}, function(error, docs){    
		if(error){
			console.log(error);			
		} else {
			console.log("New Comment Added");
		}
	});
});

// Delete comment for article
router.get('/deletecomment/:id', function(req, res){
	console.log(req.params.id)
	Comment.remove({'_id': req.params.id}).exec(function(error, data){
		if(error){
			console.log(error);
		} else {
			console.log("Comment deleted");
		}
	})
});


module.exports = router;
