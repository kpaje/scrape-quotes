var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var PORT = 3000;
var app = express();

// Configure body parsing for AJAX requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

//Routes
require("./controllers/routes")(app);

// Connect to the Mongo DB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/scrape-quotes",
  {
    useCreateIndex: true,
    useNewUrlParser: true
  }
);

// Start the server
app.listen(PORT, function () {
  console.log("Running on http://localhost:" + PORT);
});