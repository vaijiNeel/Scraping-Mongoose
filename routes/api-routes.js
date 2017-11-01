var db = require("../models");
// Scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method. It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

var newArticleModalFlag = false;

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
      console.log("obj empty flag in home api-route:",flag);
      // if (newArticleModalFlag) {

      // }
      res.render("index", {articleObj: dbArticle, objEmpty: flag}); 
    });
  });

  // get saved articles
  app.get("/api/getSavedArticles", function(req, res) {
    db.Article
      .find({savedArticle: true})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
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
      newArticleModalFlag = true;
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
              console.log("Scrape one article complete");
            })
            .catch(function(err) {
              console.log("err in api route scrape articles");
              res.json(err);
            }); //end catch
        } // end if
      }); // end each
      res.redirect("/"); //render page
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

  //save note
  app.post("/api/saveNote/:articleId", function(req, res) {
    db.Note
    .create(req.body)
    .then(function(dbNote) {
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
    res.redirect("/api/getSavedArticles"); //render page
  });

  //delete note

}