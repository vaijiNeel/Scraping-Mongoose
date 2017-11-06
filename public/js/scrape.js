$(document).ready(function() {

	//nav bar go to saved articles page button event
	$(".savedArticles").on("click", function(event) {
		event.preventDefault();
		$.get("/api/getSavedArticles", {
	    }).then(function() {
	        console.log("get saved articles complete");
	        document.location.href="/api/getSavedArticles";
		    // location.reload(true);	        
	    }).catch(function() {
	    	console.error("saved articles failed somewhere");
	    });
	});

	//nav bar scrape new articles button event
	$(".newArticles").on("click", function(event) {
		event.preventDefault();
		$.ajax({
		    method: "POST",
		    url: "/api/scrapeNewArticles/" 
		})
		.done(function(data) {
	        console.log("save new articles complete");
	        console.log("new articles in callback function:", data);
	        //Show the modal 
	        $("#modalScrapeComplt").text(`Added ${data} new articles.`);
			$("#scrapeCompleteModal").modal("toggle"); 
			$(".okButton").on("click", function(event) {
				event.preventDefault();
				// Reload the page to get the updated list
				document.location.href="/";
			});
	    }).catch(function() {
	    	console.error("new articles failed somewhere");
	    });
	});

	//save article (for each article) button event
	$(".saveArtBtn").on("click", function(event) {
		event.preventDefault();
		var thisId = $(this).attr("data-id");
		$.ajax({
		    method: "GET",
		    url: "/api/saveArticle/" + thisId,
		})
		.done(function() {
		    // document.location.href="/";
		    location.reload(true);
	    })
	 	.catch(function() {
	    	console.error("failed somewhere");
	    });
	});

	// delete article (in save article page for each article) button event
	$(".deleteSavedBtn").on("click", function(event) {
		event.preventDefault();
		var thisId = $(this).attr("data-id");
		$.ajax({
		    method: "GET",
		    url: "/api/deleteFromSaved/" + thisId,
		})
		.done(function() {
		    // document.location.href="/api/getSavedArticles";
		    location.reload(true);
	    })
	 	.catch(function() {
	    	console.error("failed somewhere");
	    });
	});

	//add note (in saved article page for each article saved) button event
	$(".addNotesBtn").on("click", function(event) {
		event.preventDefault();
		var thisId = $(this).attr("data-id");
		$.ajax({
		    method: "GET",
		    url: "/api/getSavedNotes/" + thisId,
		})
		.done(function() {
			console.log("get saved note complete");
			$("#addNotesModal").modal("toggle"); 

			//click save note
			$(".saveNoteBtn").on("click", function(event) {
				$.ajax({
				    method: "GET",
				    url: "/api/addNote/" + thisId,
				})
				.done(function() {
					console.log("add new note complete");
				})
			});

			//click delete note
			$(".deleteExistingNote").on("click", function(event) {
				
			});
	    })
	 	.catch(function() {
	    	console.error("failed somewhere");
	    });
	});
})