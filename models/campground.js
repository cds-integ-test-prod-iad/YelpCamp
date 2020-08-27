const mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	imageId: String,
	description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	likes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	]
});


module.exports = mongoose.model("Campground", campgroundSchema);