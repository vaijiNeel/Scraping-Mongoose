var db = require("../models");
// Scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method. It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Routes
module.exports = function(app) {
  //home page
  app.get("/", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
      console.log("inside api call Article",dbArticle);
      var flag=false;
      if(dbArticle.length == 0) {
        flag=true;
      } else {
        flag=false;
      }
      console.log("obj empty flag in home:",flag);
      res.render("index", {articleObj: dbArticle, objEmpty: flag}); 
    });
  });

  // get saved articles
  app.get("/api/getSavedArticles", function(req, res) {
    db.Article
      .find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        console.log("inside api call Article",dbArticle);
        var flag=false;
        if(dbArticle.length == 0) {
          flag=true;
        } else {
          flag=false;
        }
      console.log("obj empty flag in saved articles:",flag);
      res.render("index", {articleObj: dbArticle, objEmpty: flag}); 
        // res.send(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
    });
  });

  // A GET route for scraping new articles
  app.get("/api/scrapeNewArticles", function(req, res) {
    // First, we grab the body of the html with request
    //"http://www.echojs.com/"
    axios.get("https://www.nytimes.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Now, we grab every h2, a, img within an article tag, and do the following:
      $(".collection article").each(function(i, element) {
        // Save an empty result object
        var result = {};
        var noImageAvail = "https://portal.meril.eu/meril/img/NoImageAvailable.png";
        var headline = $(this).children("h2").children("a").text().trim();
        var link = $(this).children("h2").children("a").attr("href");
        var byline = $(this).children(".byline").text().trim();
        var summary = $(this).children(".summary").text().trim();
        var artImage = $(this).children(".media").children(".image").children("a").children("img").attr("src");

        if(headline !== "" && summary !== "" && link !== "") {
          // Add the text and href of every link, and save them as properties of the result object
          result.headline = headline;
          result.link = link;
          result.byline = byline;
          result.summary = summary;
          if (typeof artImage === "undefined") {
            console.log("no image found.");
            result.imageURL = noImageAvail;
          } else {
            console.log("image found.");
            result.imageURL = artImage;
          }

          console.log("headline:",result.headline);
          console.log("byline:",result.byline);
          console.log("summary:",result.summary);
          console.log("link:",result.link);
          console.log("image:",result.imageURL,"\n------------------------------------------\n");

          // Create a new Article using the `result` object built from scraping
          db.Article
            .create(result)
            .then(function(dbArticle) {
              console.log("Scrape Complete");
              // console.log("inside api call Article",dbArticle);
              var flag=false;
              if(dbArticle.length == 0) {
                flag=true;
              } else {
                flag=false;
              }
              // console.log("obj empty flag in scrape articles:",flag);
              res.redirect("index", {articleObj: dbArticle, objEmpty: flag}); 
              // res.send("Scrape Complete");
            })
            .catch(function(err) {
              // res.status(status).json(err)
              console.log("err in api route scrape articles");
              res.json(err);
            }); //end catch
        } // end if
      }); // end each
    }); // end axios
  }); // end api

  // Route for getting all Articles from the db
  app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article
      .find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article
      .findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note
      .create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
}