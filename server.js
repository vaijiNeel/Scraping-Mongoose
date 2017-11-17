var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var request = require("request");

// Require all models
var db = require("./models");

var port = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use body-parser for handling form submissions
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(
	process.env.MONGODB_URI || "mongodb://localhost/newsPopulator",
	{
	    useMongoClient: true
	}
  );

// Routes
// =============================================================
require("./routes/api-routes.js")(app);

//handlebars
app.engine("handlebars", exphbs({ 
  defaultLayout: "main",
  partialsDir: [
        'views/partials/'
  ] 
}));
app.set("view engine", "handlebars");

// Start the server
app.listen(port, function() {
  console.log("App listening on PORT: " + port);
});