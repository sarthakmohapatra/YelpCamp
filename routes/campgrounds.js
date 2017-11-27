var express     = require("express"),
    router      =  express.Router(),
    Campground  = require("../models/campgrounds");

//Get Route
router.get("/", function(req, res) {
	//Get all campgrounds from DB
	Campground.find({}, function(err, campgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {
				campgrounds: 	campgrounds,
				currentUser:	req.user
			});
		}
	});
});

//Adding form page to get new campground
router.get("/new", function(req, res) {
	res.render("campgrounds/new");
});

//selecting a particular campground
router.get("/:id", function(req, res) {
	//find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			//render show template with that campground
			res.render("campgrounds/show", {
				campground: foundCampground
			});
		}
	});
});

//adding new campground and redirecting back to all campgrounds page
router.post("/", function(req, res) {
	//get data from form
	//add to camgprounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampGround = {
		name: name,
		image: image,
		description: desc
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

module.exports = router;
