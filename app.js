var express = require("express");
var app = express();

app.get("/", function(req, res) {
	res.send("This will be landing page soon");
});

app.listen(9091, 'localhost', function() {
	console.log("The Server has started on 9091");
})
