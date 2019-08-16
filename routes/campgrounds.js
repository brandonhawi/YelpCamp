const express = require("express"),
    router = express.Router(),
    Campground = require('../models/campground'),
    middleware = require('../middleware/');

// Index 

router.get('/', (req, res) => {
    req.user
    // Get all campgrounds from db
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds });
        }
    })
});

// Create 

router.post('/', middleware.isLoggedIn, (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let price = req.body.price;
    let author = {
        id: req.user._id,
        username: req.user.username,
    }
    let newCampground = {
        name: name,
        image: image,
        price: price,
        description: desc,
        author: author,
    };
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

// New

router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// Show 

router.get('/:id', (req, res) => {
    let id = req.params.id;
    Campground.findById(id).populate("comments").exec((err, foundCampground) => {
        if (err || !foundCampground) {
            console.log(err);
            req.flash("error", "Hmm, that campground wasn't found...");
            return res.redirect('/campgrounds')
        } else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

// Edit

router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err || !foundCampground) {
            console.log(err);
            req.flash("error", "Hmm, that campground wasn't found...");
            return res.redirect("back");
        }
        res.render('campgrounds/edit', { campground: foundCampground });
    });
});

// Update

router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err || !updatedCampground) {
            console.log(err);
            req.flash("error", "Hmm, that campground wasn't found...");
            res.redirect("/campgrounds");
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
    // redirect to show page
});

// Delete

router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err || !foundCampground) {
            console.log(err);
            req.flash("error", "Hmm, that campground wasn't found...");
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;