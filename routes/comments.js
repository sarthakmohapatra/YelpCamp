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
          //add username and Id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          //Save the Comment
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

//edit comment
router.get("/:comment_id/edit",checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      res.redirect("back");
    }else{
    res.render("comments/edit", {campground_id:req.params.id, comment:foundComment});
    }
  });
});

//update comment
router.put("/:comment_id",checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      res.redirect("back");
    }else{
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
});

//delete comment
router.delete("/:comment_id",checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    }else{
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
});

//check for login -- can be put anywhere
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
			return next();
	}
	res.redirect("/login");
}

//check campground ownership middleware
function checkCommentOwnership(req, res, next){
  if(req.isAuthenticated()){
    //does user own campground
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        console.log(err);
        res.redirect("back");
      }else{
        if(foundComment.author.id.equals(req.user._id)){
          next();
        }else{
          res.redirect("back");
        }
      }
    });
  }else{
    res.redirect("back");
  }
}
module.exports = router;
