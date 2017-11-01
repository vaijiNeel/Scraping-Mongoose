$(document).ready(function() {
	//home button event
	$(".homeBtn").unbind('click').click(function(event) {
		event.preventDefault();
		$.get("/", {
	    }).then(function() {
	        console.log("home page");
	    }).catch(function() {
	    	console.error("failed somewhere");
	    });
	});

	//nav bar saved articles button event
	$(".savedArticles").unbind('click').click(function(event) {
		event.preventDefault();
		$.get("/api/getSavedArticles" , {
	    }).then(function() {
	        console.log("get saved articles complete");
	    }).catch(function() {
	    	console.error("failed somewhere");
	    });
	});

	//scrape new articles button event
	$(".newArticles").unbind('click').click(function(event) {
	// $(".newArticles").on("click", function() {
		event.preventDefault();

		$.get("/api/scrapeNewArticles", {
	    }).then(function() {
	    	//Show the modal 
			$("#scrapeCompleteModal").modal("toggle"); 
	        console.log("save new articles complete");
	        // Reload the page to get the updated list
	        document.location.href="/";
	        // location.reload(true);
	    }).catch(function() {
	    	console.error("failed somewhere");
	    });
	});

	//save article button event
	$(".saveArtBtn").unbind('click').click(function(event) {
		event.preventDefault();
		var thisId = $(this).attr("data-id");
		$.get("/api/saveArticle" + thisId , {
	    }).then(function() {
	        console.log("save article complete");
	    }).catch(function() {
	    	console.error("failed somewhere");
	    });
	});

	//delete article button event
	$(".deleteArtBtn").unbind('click').click(function(event) {
		event.preventDefault();
		var thisId = $(this).attr("data-id");
		$.get("/api/deleteArticle" + thisId , {
	    }).then(function() {
	        console.log("delete article complete");
	    }).catch(function() {
	    	console.error("failed somewhere");
	    });
	});

	//add note button event
	$(".saveNote").unbind('click').click(function(event) {
		event.preventDefault();
		var thisId = $(this).attr("data-id");
		$.get("/api/saveNote" + thisId , {
	    }).then(function() {
	        console.log("save note complete");
	    }).catch(function() {
	    	console.error("failed somewhere");
	    });
	});
})