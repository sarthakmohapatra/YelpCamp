var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	Campground = require("./models/campgrounds"),
	seedDB = require("./seeds"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	User = require("./models/user"),
	Comment = require("./models/comment");
mongoose.Promise = require("bluebird");

mongoose.connect("mongodb://localhost/yelp_camp", {
	useMongoClient: true
});
app.use(bodyParser.urlencoded({
	extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
//Add Seed Data
seedDB();

//Passport Configuration
app.use(require("express-session")({
	secret: "novus ordo seclorum",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//custom middleware to let know currentUser state to all routes
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

//Index Route
app.get("/", function(req, res) {
	res.render("landing");
});

//Get Route
app.get("/campgrounds", function(req, res) {
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
app.get("/campgrounds/new", function(req, res) {
	res.render("campgrounds/new");
});

//selecting a particular campground
app.get("/campgrounds/:id", function(req, res) {
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
//====================================================================================
//Comment Routes
//====================================================================================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
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

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
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

//**********************************************************************************
//----------------------------------------------------------------------------------
//---------------------------AUTH ROUTES--------------------------------------------
//**********************************************************************************

//show register form
app.get("/register", function(req, res){
	res.render("register");
});

//Handle Signup Logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/campgrounds");
        });
    });
});

//Show login form
app.get("/login", function(req, res){
	res.render("login");
});

//handle login Logic
app.post("/login", passport.authenticate("local",
	{
			successRedirect: 	"/campgrounds",
			failureRedirect:	"/login"
	}));

//logout Logic
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
});

//check for login -- can be put anywhere
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
			return next();
	}
	res.redirect("/login");
}

app.listen(9091, 'localhost', function() {
	console.log("The Server has started on 9091");
});
