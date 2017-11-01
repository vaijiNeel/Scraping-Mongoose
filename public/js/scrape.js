$(document).ready(function() {

	// //nav bar saved articles button event
	// $(".savedArticles").unbind('click').click(function(event) {
	// 	event.preventDefault();
	// 	$.get("/api/getSavedArticles" , {
	//     }).then(function() {
	//         console.log("get saved articles complete");
	//     }).catch(function() {
	//     	console.error("saved articles failed somewhere");
	//     });
	// });

	//scrape new articles button event
	// $(".newArticles").unbind('click').click(function(event) {
	// // $(".newArticles").on("click", function() {
	// 	event.preventDefault();
	// 	$.ajax({
	// 	    method: "POST",
	// 	    url: "/api/scrapeNewArticles/" 
	// 	})
	// 	.done(function() {
	//         console.log("save new articles complete");
	//         // Reload the page to get the updated list
	//         // document.location.href="/";
	//         location.reload(true);
	//         //Show the modal 
	// 		$("#scrapeCompleteModal").modal("toggle"); 
	//     }).catch(function() {
	//     	console.error("new articles failed somewhere");
	//     });
	// });

	//save article button event
	$(".saveArtBtn").unbind('click').click(function(event) {
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

	// //delete article button event
	$(".deleteSavedBtn").unbind('click').click(function(event) {
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

	//add note button event
	$(".saveNote").unbind('click').click(function(event) {
		event.preventDefault();
		var thisId = $(this).attr("data-id");
		$.ajax({
		    method: "POST",
		    url: "/api/saveNote" + thisId,
		})
		.done(function() {
			console.log("save note complete");
		    // document.location.href="/api/getSavedArticles";
		    location.reload(true);
	    })
	 	.catch(function() {
	    	console.error("failed somewhere");
	    });
	});
})