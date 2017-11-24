var mongoose = require("mongoose"),
	  Campground = require("./models/campgrounds"),
    Comment = require("./models/comment");

function seedDB() {
	//remove all campgrounds
	Campground.remove({}, function(err) {
		if (err) {
			console.log(err);
		}else{
      console.log("removed campgrounds");
  		campgrounds.forEach(function(seed) {
  			//add a few campgrounds
  			//Harcoding creation of campground
  			Campground.create(seed, function(err, campgrounds) {
  				if (err) {
  					console.log(err);
  				} else {
  					console.log("added a campground");
            //create comment
            Comment.create({
              text : "This place is great",
              author: "Sarthak"
            },function(err, comment){
              if(err){
                console.log(err);
              }else{
                campgrounds.comments.push(comment);
                campgrounds.save();
                console.log("created new comments");
              }
            });
  				}
  			});
  		});
    }
	});
	//Data
	var campgrounds = [
		{
			name: "Salmon Creek",
			image: "https://images.thrillophilia.com/image/upload/s--EUFqILJT--/c_fill,f_auto,fl_strip_profile,h_446,q_auto,w_750/v1/images/photos/000/041/044/original/5051307177_09fce4b7ea_o_edit.jpg.jpg?1453314320",
      description : "This is sample description"
    },
		{
			name: "Granite Hill",
			image: "https://images.thrillophilia.com/image/upload/s--R9Rx3vff--/c_fill,f_auto,fl_strip_profile,h_446,q_auto,w_750/v1/images/photos/000/041/042/original/trek.jpg.jpg?1453314319",
      description : "This is sample description"
    },
		{
			name: "Salmon Dreek",
			image: "https://images.thrillophilia.com/image/upload/s--44T_a9hX--/c_fill,f_auto,fl_strip_profile,h_446,q_auto,w_750/v1/images/photos/000/046/103/original/Kuari_Trek_5.jpg.jpg?1453316267",
      description : "This is sample description"
    }
  ]
}

module.exports = seedDB;
