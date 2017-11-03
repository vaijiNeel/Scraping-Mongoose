var db = require("../models");
// Scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method. It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Routes
module.exports = function(app) {

  //home page
  app.get("/", function(req, res) {
    db.Article.find({savedArticle: false})
    .then(function(dbArticle) {
      console.log("inside home api-route");
      var flag=false;
      if(dbArticle.length == 0) {
        flag=true;
      } else {
        flag=false;
      }
      console.log("obj empty flag in home api-route:",flag,"\n");
      res.render("index", {articleObj: dbArticle, objEmpty: flag}); 
    });
  });

  // get saved articles
  app.get("/api/getSavedArticles", function(req, res) {
    db.Article
      .find({savedArticle: true})
      .then(function(dbArticle) {
        console.log("inside saved Article api-route",dbArticle);
        var flag=false;
        if(dbArticle.length == 0) {
          flag=true;
        } else {
          flag=false;
        }
        console.log("obj empty flag in saved articles api-route:",flag);
        res.render("savedArticles", {articleObj: dbArticle, objEmpty: flag}); 
      })
      .catch(function(err) {
        res.json(err);
    });
  });

  // A GET route for scraping new articles
  app.post("/api/scrapeNewArticles", function(req, res) {
    var result=[];
    // First, we grab the body of the html with request
    axios.get("https://www.nytimes.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      // Now, we grab every h2, a, img within an article tag, and do the following:
      $(".collection article").each(function(i, element) {
        var imageURL;
        var noImageAvail = "https://portal.meril.eu/meril/img/NoImageAvailable.png";
        var headline = $(this).children("h2").children("a").text().trim();
        var link = $(this).children("h2").children("a").attr("href");
        var byline = $(this).children(".byline").text().trim();
        var summary = $(this).children(".summary").text().trim();
        var artImage = $(this).children(".media").children(".image").children("a").children("img").attr("src");

        if(headline !== "" && summary !== "" && link !== "") {
          if (typeof artImage === "undefined") {
            // console.log("no image found.");
            imageURL = noImageAvail;
          } else {
            // console.log("image found.");
            imageURL = artImage;
          }
          // Add the text and href of every link, and save them as properties of the result object
          var temp = {
            "headline": headline,
            "link": link,
            "byline": byline,
            "summary": summary,
            "imageURL": imageURL
          };
          // console.log("temp:",temp);
          result.push(temp);
        } // end if
      }); //end each
      // console.log("result array:",result);
      db.Article
      .create(result, function(err, result) {
        if(err) {
          console.log("error in create:", err);
          var len=0;
          res.json(len);
        } else {
          console.log("Scrape article complete length:", result.length);
          res.json(result.length);
        }
      });
    }); // end axios
  }); // end api

  //save article
  app.get("/api/saveArticle/:articleId", function(req, res) {
    db.Article
    .findOneAndUpdate({ _id: req.params.articleId }, {savedArticle: true})
    .then(function(dbArticle) {
      console.log("Save Complete");
    })
    .catch(function(err) {
      res.json(err);
    });
    res.redirect("/"); //render page
  });

  //delete article from saved
  app.get("/api/deleteFromSaved/:articleId", function(req, res) {
    db.Article
    .findOneAndUpdate({ _id: req.params.articleId }, {savedArticle: false})
    .then(function(dbArticle) {
      console.log("unsave Complete");
    })
    .catch(function(err) {
      res.json(err);
    });
    res.redirect("/api/getSavedArticles"); //render page
  });

  //get existing notes
  app.get("/api/getSavedNotes/:articleId", function(req, res) {
    db.Article
    .findOne({_id: req.params.articleId})
    .populate("note")
    .then(function(dbArticle) {
      console.log("dbArticle:", dbArticle);
      var noNote;
      if(dbArticle.length > 0) {
        noNote = true;
        //render modal
        res.render("partials/saveNoteModal", {existingNoteObj: dbArticle, noNoteObj: noNote}); 
      } else {
        noNote = false;
        res.render("partials/saveNoteModal", {existingNoteObj: dbArticle, noNoteObj: noNote}); 
      }
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
    // res.redirect("/api/getSavedArticles"); //render page
  });

  //add new note

  //delete note

}