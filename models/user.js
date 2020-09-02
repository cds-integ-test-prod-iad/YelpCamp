var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	avatar: {
		type: String,
		default: "https://res.cloudinary.com/diabpe3tk/image/upload/v1598845480/avatar-1577909_1280_lojkjp.png"
	},
	avatarId: {
		type: String,
		default: "avatar-1577909_1280_lojkjp"
	},
	firstName: String,
	lastName: String,
	email: String,
	resetPasswordToken: String,	
	resetPasswordExpires: Date
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);