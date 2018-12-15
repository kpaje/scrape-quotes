var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");
var PORT = 3000;
var app = express();

// Configure middleware
app.use(logger("dev"));
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrape-quotes";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
});

// ========
//  ROUTES
// ========

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
  axios.get("http://www.echojs.com/").then(function (response) {
    var $ = cheerio.load(response.data);
    $("article h2").each(function (i, element) {
      var result = {};

      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

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

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  db.Article.find().populate({
      _id: mongojs.ObjectId(req.params.id)
    }, {
      $set: {
        note: true,
      }
    },
    function (error, edited) {
      if (error) {
        console.log(error);
      } else {
        res.json(edited);
      }
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Article.update({
      _id: mongojs.ObjectId(req.params.id)
    }, {
      $set: {
        note: true,
      }
    },
    function (error, edited) {
      if (error) {
        console.log(error);
      } else {
        res.json(edited);
      }
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on http://localhost:" + PORT + "!");
});