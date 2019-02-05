// var express = require("express");
// var logger = require("morgan");
// var mongoose = require("mongoose");
// var PORT = process.env.PORT || 3000;
// var app = express();

// // Configure middleware
// app.use(logger("dev"));
// app.use(express.urlencoded({
//   extended: true
// }));
// app.use(express.json());
// app.use(express.static("public"));

// //Routes
// require("./controllers/routes")(app);

// // Connect to the Mongo DB
// mongoose.connect(
//   process.env.MONGODB_URI || "mongodb://localhost/scrape-quotes",
//   {
//     useCreateIndex: true,
//     useNewUrlParser: true
//   }
// );

// // Start the server
// app.listen(PORT, function () {
//   console.log("Running on http://localhost:" + PORT);
// });


// Require our dependencies
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// Set up our port to be either the host's designated port, or 3000
var PORT = process.env.PORT || 3000;

// Instantiate our Express App
var app = express();

// Require our routes
var routes = require("./controllers/routes")(app);

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect Handlebars to our Express app
// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

// Have every request go through our route middleware
app.use(routes);

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrape-quotes";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

// Listen on the port
app.listen(PORT, function() {
  console.log("Listening on port: " + PORT);
});
