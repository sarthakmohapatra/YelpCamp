var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	Campground = require("./models/campgrounds"),
	seedDB = require("./seeds"),
	passport = require("passport"),
	flash		=	require("connect-flash"),
	LocalStrategy = require("passport-local"),
	User = require("./models/user"),
	methodOverride = require("method-override"),
	Comment = require("./models/comment");

var commentRoutes 		= require("./routes/comments"),
		campgroundRoutes 	= require("./routes/campgrounds"),
		authRoutes 				= require("./routes/index");

//CONFIG
mongoose.Promise = require("bluebird");
mongoose.connect("mongodb://msarthak1614:Jinchuriki1614@@clustertest-shard-00-00-wygdv.mongodb.net:27017,clustertest-shard-00-01-wygdv.mongodb.net:27017,clustertest-shard-00-02-wygdv.mongodb.net:27017/test?ssl=true&replicaSet=ClusterTest-shard-0&authSource=admin");
app.use(bodyParser.urlencoded({
	extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//Add Seed Data
 // seedDB();

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
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(9091, function() {
	console.log("The Server has started on 9091");
});
