var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = process.env.PORT || 3001;
var app = express();

// Parse request body as JSON
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrape-quotes";
var MONGODB_URI = process.env.MONGODB_URI;
// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

// Routes
app.get("/scrape", function (req, res) {
  axios.get("https://patrickmn.com/life/call-of-duty-war-quotes/").then(function (response) {
      var $ = cheerio.load(response.data);
      $("blockquote").each(function (i, element) {
          var result = {};
          result.title = $(this)
              .text();
          result.link = $(this)
              .children("p")
              .children("em")
              .text();

          db.Article.create(result)
              .then(function (dbArticle) {
                  console.log(dbArticle);
              })
              .catch(function (err) {
                  console.log(err);
              });
      });

      res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  db.Article.find({})
      .then(function (dbArticle) {
          res.json(dbArticle);
      })
      .catch(function (err) {
          res.json(err);
      });
});


// Listen on the port
app.listen(PORT, function () {
  console.log("Running on http://localhost:" + PORT);
});