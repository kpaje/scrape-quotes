var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var PORT = 3000;
var app = express();

// Configure middleware
app.use(logger("dev"));
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(express.static("public"));

//Routes
require("./controllers/routes")(app);

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scrape-quotes", {
  useNewUrlParser: true
});

// Start the server
app.listen(PORT, function () {
  console.log("Running on http://localhost:" + PORT);
});