var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campgrounds"),
    Comment     = require("../models/comment");

//====================================================================================
//Comment Routes
//====================================================================================
//comments new
router.get("/new", isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			consle.log(err);
		} else {
			res.render("comments/new", {
				campground: campground
			});
		}
	});
});

//comments create
router.post("/", isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

//check for login -- can be put anywhere
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
			return next();
	}
	res.redirect("/login");
}

module.exports = router;
