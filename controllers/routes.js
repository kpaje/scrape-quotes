var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {
    // A GET route for scraping the echoJS website
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

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function (req, res) {
        db.Article.findOne({
                _id: req.params.id
            })
            .populate("note")
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
            .then(function (dbNote) {
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Article.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    note: dbNote._id
                }, {
                    new: true
                });
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });
};