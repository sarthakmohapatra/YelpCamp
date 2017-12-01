var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campgrounds"),
    middleware  = require("../middleware"),
    Comment     = require("../models/comment");

//====================================================================================
//Comment Routes
//====================================================================================
//comments new
router.get("/new", middleware.isLoggedIn, function(req, res) {
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
router.post("/", middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
          req.flash("error", "something went wrong!")
					console.log(err);
				} else {
          //add username and Id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          //Save the Comment
					campground.comments.push(comment);
					campground.save();
          req.flash("success", "successfully added comment!")
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

//edit comment
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      res.redirect("back");
    }else{
    res.render("comments/edit", {campground_id:req.params.id, comment:foundComment});
    }
  });
});

//update comment
router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      res.redirect("back");
    }else{
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
});

//delete comment
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    }else{
      req.flash("success", "comment deleted!")
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
});

module.exports = router;