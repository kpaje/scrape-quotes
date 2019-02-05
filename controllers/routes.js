var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {
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
};