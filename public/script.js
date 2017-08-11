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
	$("#commentHeader").addClass("hidden");
	$("#deleteComment").addClass("hidden");

	// scrape the articles into the articles div on click of the button in the jumbo
	$("#scrapeArticles").on("click",function() {
		// scrape the website upon the website loading
		$.getJSON("/scrape", function() {

		});
	})

	// load the articles into the articles div on click of the button in the jumbo

	// its getting pushed to the front end which means the error in populating is
	// here. either here in this function or in the showArticle or in the html!!!
	$("#getArticles").on("click",function() {
		$.getJSON("/articles", function(data) {
			console.log(data);
			articleList = data;
			article = articleList[0];
			showArticle(article); 
			$("#commentBox").removeClass("hidden");
		})
	})
	
	// button to show the comment field
	$("#commentBox").on("click", function() {
		$("#comments").removeClass("hidden");
		$("#commentBox").addClass("hidden");
	});

	// add button inside the comment field
	$("#addComment").on("click", function() {
		$("#comments").addClass("hidden");
		$("#commentBox").removeClass("hidden");
	});

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

	// Add comment to article and update comments display
	$("#addComment").on("click", function() {
		if($("#commentText").val() != "") {
			var comment = $("#commentText").val();
			$.post("/addcomment/" + articleID, {comment: comment}, function(e) {
				e.preventDefault();
			});
			$("#commentText").val("");
			showComments(articleID);
		}
	});

	// Delete comment from article and update comments display
	$("#deleteComment").on("click", function(){
		commentId = this.id;
		// console.log("comment id "+ commentId);
		$.ajax({
			method: "GET",
			url:"/deletecomment/" + commentId
		}).done(function(data){
		})
		// showComments(articleID);
	});	

	// Function to show the articles in the DOM
	var showArticle = function(article) {
		console.log("article: " + article);
		$("#link").text(article.title);
		$("#link").attr("src", article.link);
		$("#summary").text(article.summary);
		//console.log(article.summary);
		$("#navigation").empty();
		
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

		articleID = article._id;
		// showComments(articleID);
	}

	// Function to build comments display for article
	var showComments = function(articleID) {
		console.log("article id: " + articleID);
		$("#comments").removeClass("hidden");
		$("#deleteComment").removeClass("hidden");
		$("#commentHeader").removeClass("hidden");
		$("#articleComments").empty();

		$.getJSON('comments/:'+ articleID, function(data, docs){
			console.log("data: " + data);
			console.log("docs: " + docs);
			console.log("data: " + articleID);
			for(var i = 0; i < data.length; i++){
				// $("#").text(data)
				var commentText = commentText + '<div class="well"><span id="' + data[i].articleID + '" class="glyphicon glyphicon-remove text-danger deletecomment"></span> ' + data[i].comment + '</div>';
				// console.log(commentText);
			}
			//console.log(data[i].comment);
			//$("#articleComments").append(commentText);
		});
	}


});



