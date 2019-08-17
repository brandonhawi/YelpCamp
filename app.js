const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    seedDb = require('./seeds'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    flash = require('connect-flash'),
    // route dependencies
    commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index'),
    methodOverride = require('method-override'),
    // port to listen to 
    port = process.env.PORT,
    IP = process.env.IP;

mongoose.connect("mongodb+srv://brandonhawi:fK6HkbaV@yelpcamp-rccyu.mongodb.net/yelpcamp?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
    }).then(() => {
        console.log("Successfully connected to mongoDB Atlas...");
    }).catch(err => {
        console.log(`ERROR: ${err.message}`);
    });
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

// Seed the database
// seedDb();

//passport config

app.use(require("express-session")({
    secret: "Sean is a great brother",
    resave: false,
    saveUninitialized: false,
}));

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



app.listen(port, IP, () => {
    console.log(`The Yelp Camp server is listening on port ${port}!`);
});