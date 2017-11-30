var Campground  = require("../models/campgrounds"),
    Comment     = require("../models/comment");

//all middleware goes here
var middlewareObj = {};
//check campground ownership middleware
middlewareObj.checkCampgroundOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    //does user own campground
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
        req.flash("error", "Campground not found");
        res.redirect("back");
      }else{
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        }else{
          req.flash("error", "You dont have permission to do that!")
          res.redirect("back");
        }
      }
    });
  }else{
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("back");
  }
}
//check comment ownership middleware
middlewareObj.checkCommentOwnership = function(req, res, next){
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
          req.flash("error", "You do not have permission to do that");
          res.redirect("back");
        }
      }
    });
  }else{
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("back");
  }
}

//check for login -- can be put anywhere
middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
			return next();
	}
  req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
}

module.exports = middlewareObj;
