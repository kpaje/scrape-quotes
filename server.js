var express = require("express");
var mongoose = require("mongoose");
var PORT = process.env.PORT || 3000;
var app = express();
var logger = require("morgan");
const db = require("./models");

// Parse request body as JSON
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
require("./controllers/routes")(app)

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrape-quotes";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Listen on the port
app.listen(PORT, function () {
  console.log("Running on http://localhost:" + PORT);
});