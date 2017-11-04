var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", {
	useMongoClient: true
});

//SCHEMA SETUP mongodb
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
  description: String
});

//Compile to Model
var Campground = mongoose.model("Campground", campgroundSchema);

//Harcoding creation of campground

// Campground.create({
// 	name: "Granite Hill",
// 	image: "https://images.thrillophilia.com/image/upload/s--R9Rx3vff--/c_fill,f_auto,fl_strip_profile,h_446,q_auto,w_750/v1/images/photos/000/041/042/original/trek.jpg.jpg?1453314319",
//   description:"An amazing spot to laze around and enjoy nature"
// }, function(err, campground) {
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		console.log("Newly Created Campground : ");
// 		console.log(campground);
// 	}
// });

app.use(bodyParser.urlencoded({
	extended: true
}));

app.set("view engine", "ejs");

// var campgrounds = [
// 	{
// 		name: "Salmon Creek",
// 		image: "https://images.thrillophilia.com/image/upload/s--EUFqILJT--/c_fill,f_auto,fl_strip_profile,h_446,q_auto,w_750/v1/images/photos/000/041/044/original/5051307177_09fce4b7ea_o_edit.jpg.jpg?1453314320"
//   },
// 	{
// 		name: "Granite Hill",
// 		image: "https://images.thrillophilia.com/image/upload/s--R9Rx3vff--/c_fill,f_auto,fl_strip_profile,h_446,q_auto,w_750/v1/images/photos/000/041/042/original/trek.jpg.jpg?1453314319"
//   },
// 	{
// 		name: "Salmon Dreek",
// 		image: "https://images.thrillophilia.com/image/upload/s--44T_a9hX--/c_fill,f_auto,fl_strip_profile,h_446,q_auto,w_750/v1/images/photos/000/046/103/original/Kuari_Trek_5.jpg.jpg?1453316267"
//   }
// ]

app.get("/", function(req, res) {
	res.render("landing");
});

app.get("/campgrounds", function(req, res) {
	//Get all campgrounds from DB
	Campground.find({}, function(err, campgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render("index", {
				campgrounds: campgrounds
			});
		}
	});
});

//Adding form page to get new campground
app.get("/campgrounds/new", function(req, res) {
	res.render("new");
});

//selecting a particular campground
app.get("/campgrounds/:id", function(req, res) {
	//find the campground with provided id
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      console.log(err);
    }else{
      //render show template with that campground
      res.render("show", {campground:foundCampground});
    }
  });
	// //render show template with that ID
	// res.render("show");
});

//adding new campground and redirecting back to all campgrounds page
app.post("/campgrounds", function(req, res) {
	//get data from form
	//add to camgprounds array
	var name = req.body.name;
	var image = req.body.image;
  var desc = req.body.description;
	var newCampGround = {
		name: name,
		image: image,
    description:desc
	};
	//create a new campground and save to DB
	Campground.create(newCampGround, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			//redirect back to campgrounds Page
			res.redirect("/campgrounds");
		}
	});
});

app.listen(9091, 'localhost', function() {
	console.log("The Server has started on 9091");
});
