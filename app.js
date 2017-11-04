var express = require("express");
var app = express();
var bodyParser = require("body-parser");


var campgrounds = [
	{
		name: "Salmon Creek",
		image: "https://images.thrillophilia.com/image/upload/s--EUFqILJT--/c_fill,f_auto,fl_strip_profile,h_446,q_auto,w_750/v1/images/photos/000/041/044/original/5051307177_09fce4b7ea_o_edit.jpg.jpg?1453314320"
  },
	{
		name: "Salmon Breek",
		image: "https://images.thrillophilia.com/image/upload/s--R9Rx3vff--/c_fill,f_auto,fl_strip_profile,h_446,q_auto,w_750/v1/images/photos/000/041/042/original/trek.jpg.jpg?1453314319"
  },
	{
		name: "Salmon Dreek",
		image: "https://images.thrillophilia.com/image/upload/s--44T_a9hX--/c_fill,f_auto,fl_strip_profile,h_446,q_auto,w_750/v1/images/photos/000/046/103/original/Kuari_Trek_5.jpg.jpg?1453316267"
  }
]


app.use(bodyParser.urlencoded({
	extended: true
}));

app.set("view engine", "ejs");

app.get("/", function(req, res) {
	res.render("landing");
});

app.get("/campgrounds", function(req, res) {

	res.render("campgrounds", {
		campgrounds: campgrounds
	});
});

app.get("/campgrounds/new", function(req, res) {
	res.render("new");
});

app.post("/campgrounds", function(req, res) {
	//get data from form
	//add to camgprounds array
	var name = req.body.name;
	var image = req.body.image;
	var newCampGround = {
		name: name,
		image: image
	};
	campgrounds.push(newCampGround);
	//redirect back to campgrounds Page
	res.redirect("/campgrounds");
});

app.listen(9091, 'localhost', function() {
	console.log("The Server has started on 9091");
});
