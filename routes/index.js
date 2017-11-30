var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user");

//Index Route
router.get("/", function(req, res) {
	res.render("landing");
});

//**********************************************************************************
//----------------------------------------------------------------------------------
//---------------------------AUTH ROUTES--------------------------------------------
//**********************************************************************************

//show register form
router.get("/register", function(req, res){
	res.render("register");
});

//Handle Signup Logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
          req.flash("error", err.message);
          return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username)
            res.redirect("/campgrounds");
        });
    });
});

//Show login form
router.get("/login", function(req, res){
	res.render("login");
});

//handle login Logic
router.post("/login", passport.authenticate("local",
	{
			successRedirect: 	"/campgrounds",
			failureRedirect:	"/login"
	}));

//logout Logic
router.get("/logout", function(req, res){
	req.logout();
  req.flash("success", "You have been successfully logged out!");
	res.redirect("/");
});
module.exports = router;
