var express     = require("express"),
    router      = express.Router(),
    middleware  = require("../middleware"),
    Campground  = require("../models/campgrounds");

//Get Route
router.get("/",middleware.isLoggedIn, function(req, res) {
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
router.get("/new", middleware.isLoggedIn, function(req, res) {
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
router.post("/", middleware.isLoggedIn, function(req, res) {
	//get data from form
	//add to camgprounds array
	var name = req.body.name;
  var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
	var newCampGround = {
		name: name,
    price:price,
		image: image,
		description: desc,
    author: author
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

//Edit Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
          res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  //find and update the correct campground and redirect to show page

  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    }else{
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/campgrounds");
    }else{
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
