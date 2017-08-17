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
router.get("/scrape/", function(req, res) {
	request("https://www.nytimes.com/section/world?nytmobile=0", function(error, response, html) {

		if(!error && res.statusCode === 200) {
			var $ = cheerio.load(html);
		} else {
			console.log("there was an error in the initial request");
		}

		// console.log("triggered scrape on click");

		var results = [];

		// FIND OUT HOW TO LIMIT THE AMOUNT OF SCRAPES
		$("section.highlights article.story.theme-summary").each(function(i, element) {
			console.log('//\n// BEGIN ARTICLE ' + i + '\n//');
			var result = {};
			var now = new Date();

			// collect the title contained in the h2 of the div of this
			result.title = $(this).children("div").children("h2").text().trim();
			// console.log("results for title: " + result.title);

			// collect the link contained in the a tag of the h2 where the header is of the div of this
			result.link = $(this).children("figure").attr("class", "photo").children("a").attr("href");
			// console.log("results for link: " + result.link);

			// collect the title contained in the p of the div of this
			result.summary = $(this).children("div").children("p").first().text().trim();
			// console.log("results for summary: " + result.summary);

			result.createdAt = now;

			result.comments = [];

			console.log(result);
			console.log('//\n// END ARTICLE ' + i + '\n//');


			Article.findOne({ "title": result.title }, function(error, articleRecord) {
				if(error) {
					console.log(error);
				} else {
					if(articleRecord == null) {

						var article = new Article(result);
						article.save(function(error, record) {
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
		});

		console.log("scrape completed");
	});
});

// route to load the articles -- WORKS.
router.get("/articles/", function(req, res) {
	console.log("triggered article on click");
	Article.find().populate("comments").sort({createdAt: -1}).exec(function(error, data) {
		if(error) {
			throw error;
			console.log("check your articles route");
		} else {
			console.log("pushed to the front end");
			res.json(data);
			console.log("vv data vv");
			console.log(data);

		} 
	});
});



// Add comment for article or updates an existing one
router.post('/articles/:id', function(req, res) {
	console.log("req:")
	console.log(req.body);
	// REQ.BODY IS COMING UP AS AN EMPTY OBJECT
	console.log("article._id:");
	// console.log(article._id);
	// creates a new comment and passes the req.body to the entry.
	// req.body should be the articles content?

	var newComment = new Comment({
		comment: req.body.comment
	});

	console.log("newComment");
	console.log(newComment);

	// saves that note in the db
	newComment.save(function(error, doc) {
		if(error) {
			console.log(error);
		} 

		console.log(doc);

		Article.findOneAndUpdate({
			_id: req.params.id
		}, {
			$push: {
				"comments": doc._id
			}
		}, function() {
			// finish the request - tell the frontend
			res.json(doc);

			console.log("doc: ", doc);
			console.log("!!! added new comment to article comments array");
		});

	}).then(function(error, data) {
		console.log("save callback: ", data);


		//update the article by pushing the comment id to 
		// the comment array -- j 
	});
});

// route to load comments for one article
// first it grabs the article by its _id -- WORKS.
router.get('/articles/:id', function(req, res){
	// finds the one that fits that id parameter
	console.log("getting article with ID " + req.params.id)
	Article.findOne({
		"_id": req.params.id
		// and populates the comments for it
	})
	.populate("comments")
	.exec(function(error, data) {
		if(error) {
			console.log(error);
			console.log("check your comments id route");
		} else {
			res.json(data);
			console.log(data.comments);
			console.log("pushed data to front end");
		}	
	});
});

// Delete comment for article
router.get('/deleteComment/:id', function(req, res){
	
});


module.exports = router;
