
$(document.ready(function() {
// Grab the articles as a json
$.getJSON("/articles", function(data) {
  var i = Math.floor((Math.random() * 30) + 1)
  let quote = "<p data-id='" + data[i]._id + "'>" + data[i].title + "</p>";

  $("#articles").append(quote);
  
  for (let x = 0; x < quote.length; x++) {
    
    setInterval(function() {
      $("#articles").fadeOut(3500);
      $("#articles").hide();
      $("#articles").empty();
      
      var i = Math.floor((Math.random() * data.length) + 1)
      let quote = "<p data-id='" + data[i]._id + "'>" + data[i].title + "</p>";
      
      $("#articles").fadeIn(4500);
      $("#articles").append(quote);
      $("#articles").fadeOut(3500);

    }, 9000);
  }
});


}))