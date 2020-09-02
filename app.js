const 	express        = require("express"),
		app            = express(),
	    dotenv         = require("dotenv").config({ path: './VARIABLES.env' }),
		bodyParser     = require("body-parser"),
		mongoose       = require("mongoose"),
		flash          = require("connect-flash"),
		passport       = require("passport"),
		LocalStrategy  = require("passport-local"),
		methodOverride = require("method-override"),
		Campground     = require("./models/campground"),
		Comment        = require("./models/comment"),
	    Review         = require("./models/review"),
		User           = require("./models/user"),
		seedDB         = require("./seeds")
//requiring routes
const 	commentRoutes    = require("./routes/comments"),
	    reviewRoutes     = require("./routes/reviews"),
		campgroundRoutes = require("./routes/campgrounds"),
		indexRoutes      = require("./routes/index")




// seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect(process.env.DATABASE, {
// 	useNewUrlParser: true, 
// 	useUnifiedTopology: true,
// 	useCreateIndex: true
// }).then(() => {
// 	console.log("Connected to DB!");
// }).catch(err => {
// 	console.log('ERROR:', err.message);
// });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


app.use(require("express-session")({
	secret: "ZZ gets a job!",
	resave: false,
	saveUninitialized: false
}));

app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);


var port = process.env.PORT || 3002;
app.listen(port, () => {
	console.log("Listening");
});









