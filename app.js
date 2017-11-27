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

var commentRoutes 		= require("./routes/comments"),
		campgroundRoutes 	= require("./routes/campgrounds"),
		authRoutes 				= require("./routes/index");

//CONFIG
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

app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(9091, 'localhost', function() {
	console.log("The Server has started on 9091");
});
