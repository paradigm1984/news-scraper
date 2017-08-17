$(document).ready(function() {

	// setting up some initial variables
	var articleList = [];
	var articleID = "";
	var article = "";

	var previousArticle = 0;
	var currentArticle = 0;
	var nextArticle = 0;
	
	// intitially hides the div with the comments elements
	$("#comments").addClass("hidden");
	$("#commentBox").addClass("hidden");
	$("#commentsContainer").addClass("hidden");
	$("#deleteComment").addClass("hidden");



	// scrape the articles into the articles div on click of the button in the jumbo
	$("#scrapeArticles").on("click",function() {
		// scrape the website upon the website loading
		$.getJSON("/scrape", function() {

		});
	})

	// Scrape above
// ------------------------------------------------------------------- //
	
	// load the articles into the articles div on click of the button in the jumbo
	$("#getArticles").on("click",function() {
		$.getJSON("/articles/", function(data) {
			// console.log("data from the initial article load: ", data);

			// the articleList is an array of the articles which 
			// comes in as data
			articleList = data;
			// article is the var for each individucal article
			article = articleList[0];
			// runs the showArticle function on each article

			articleID = article._id;
			$("#commentBox").removeClass("hidden");
			showArticle(article);
		})
		 
		
	})
	
	// button to show the comment field
	$("#commentShowButton").on("click", function() {
		$("#comments").removeClass("hidden");
		$("#commentBox").addClass("hidden");
		$("#commentsContainer").removeClass("hidden");
		showArticle(article); 
		// console.log("*** log from the commentShowButton onClick: ", article);
	});

	// front end show article & comment button toggle button above
// ------------------------------------------------------------------- //
	
	// Display previous article from the array of articles
	$(document).on('click','.previous', function(){
		article = articleList[previousArticle];
		currentArticle = previousArticle;
		showArticle(article);
		$("#comments").addClass("hidden");
		$("#commentBox").removeClass("hidden");
	}); 

	// Display next article from the array of articles
	$(document).on('click','.next', function(){
		article = articleList[nextArticle];
		currentArticle = nextArticle;
		showArticle(article);
		$("#comments").addClass("hidden");
		$("#commentBox").removeClass("hidden");
	}); 

	// front end article toggle buttons above
// ------------------------------------------------------------------- //
	
	// Add comment to article and update comments display
	$("#addComment").on("click", function() {

		$("#comments").addClass("hidden");
		$("#commentBox").removeClass("hidden");
		// console.log(article._id);
		
		var comment = $("#commentText").val();

		$.post("/articles/" + article._id, {
			comment: comment
		}, function(data) {
			// console.log("data: ", data, "original comment: ", comment);
		});
		
		//console.log("*** log from the addComment onClick: ", article);
		// clear the field
		$("#commentText").val("");

		$.getJSON("/articles/", function(data) {
			// console.log("data from the initial article load: ", data);

			// the articleList is an array of the articles which 
			// comes in as data
			articleList = data;
			// article is the var for each individucal article
			article = articleList[0];
			// runs the showArticle function on each article

			articleID = article._id;

			showArticle(article);
		})
		
	});


	var commentContainer = $("<div id='commentContainer'></div>");
	commentContainer.addClass("comment-container hidden");
	// Function to show the articles in the DOM
	var showArticle = function(data) {

		// console.log("data: ", data);
		$("#link").text(data.title);
		$("#link").attr("src", data.link);
		$("#summary").text(data.summary);
		//console.log(article.summary);
		$("#navigation").empty();

		// the commentContainer is made up at the top so it doesnt make a new one 
		// every time you call the showArticle function. the goal here is to empty the
		// container every time the function is called no matter what and then if
		// theres comments they would populate -- works!

		if(data.comments) {
			// console.log("theres a comment!");
			commentContainer.removeClass("hidden");
			commentContainer.empty();

			if(data.comments == "") {
				console.log("theres nothing in here");
				$("#commentHeader").addClass("hidden");
			} else {
				$("#commentHeader").removeClass("hidden");
				for (var i = 0; i < data.comments.length; i++) {
					// for each comment, put it in a p tag
					var commentString = $("<p id='commentString'></p>").append(data.comments[i].comment);
					// console.log("commentString: ", commentString);
					// console.log("data.comments.comment: ", data.comments[i].comment)
					commentContainer.append(commentString);
					
					// $("#articleComments").append(data.comments[i].comment);
				}
			}
			$("#commentSection").append(commentContainer);
			//console.log("data comments: ", data.comments);
		} 
		
		previousArticle = currentArticle -1;

		if(previousArticle >= 0) {
			$("#navigation").append('<button id="'+previousArticle+'" class="btn small-button previous"> Previous Article </button>');
		} else {
			$('#navigation').append('<button id="'+previousArticle+'" class="btn small-button disabled previous">Previous Article</button>');
		}
		nextArticle = currentArticle +1;
		if(nextArticle < articleList.length) {
			$('#navigation').append('<button id="'+nextArticle+'" class="btn small-button pull-right next">Next Article</button>');
		} else {
			$('#navigation').append('<button id="'+nextArticle+'" class="btn small-button disabled pull-right next">Next Article</button>');
		}

	}

});


