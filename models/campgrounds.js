var mongoose = require("mongoose");

//SCHEMA SETUP mongodb
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
    }
  ]
});

//Compile to Model
module.exports = mongoose.model("Campground", campgroundSchema);
