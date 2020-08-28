const Campground = require("../models/campground"),
	  Comment = require("../models/comment"),
	  Review = require("../models/review");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, (err, foundCampground) => {
			if(err){
				req.flash("error", "Campground not found.");
				res.redirect("back");
			} else {
				if(!foundCampground){
					req.flash("error", "Item not found");
					return res.redirect("back");
				}
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't own that campground!");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to login to do that!")
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if(err){
				req.flash("error", "Comment not found.");
				res.redirect("back");
			} else {
				if(!foundComment){
					req.flash("error", "Item not found");
					return res.redirect("back");
				}
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't own that comment!");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to login to do that!")
		res.redirect("back");
	}
}

middlewareObj.checkReviewOwnership = function(req, res, next) {
	if(req.isAuthenticated()){
		Review.findById(req.params.review_id, (err, foundReview) => {
			if(err || !foundReview) {
				req.flash("error", err.message);
				return res.redirect("back");
			} else {
				if(foundReview.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't own that review!");
					return res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "Please login first!");
		return res.redirect("back");
	}
}

middlewareObj.checkReviewExistence = function(req, res, next) {
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id).populate("reviews").exec((err, foundCampground) => {
			if(err || !foundCampground) {
				req.flash("error", "Campgound not found.");
				return res.redirect("back");
			} else {
				let foundUserReview = foundCampground.reviews.some((review) => {
					return review.author.id.equals(req.user._id);
				});
				if(foundUserReview) {
					req.flash("error", "You have already reviewed this campground!");
					return res.redirect(`/campground/${foundCampground._id}`);
				}
				next();
			}
		});
	} else {
		req.flash("error", "Please login first!");
		return res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Login First!");
	res.redirect("/login");
}

middlewareObj.calculateAverageRating = function (reviews) {
	if(reviews.length === 0) {
		return 0;
	}
	let sum = 0;
	reviews.forEach(element => {
		sum += element.rating;
	});
	return sum / reviews.length;
}

module.exports = middlewareObj;