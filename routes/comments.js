const express = require("express"),
    router = express.Router({ mergeParams: true }),
    Campground = require('../models/campground'),
    Comment = require('../models/comment'),
    middleware = require('../middleware/');


// Comments New

router.get("/new", middleware.isLoggedIn, (req, res) => {
    let id = req.params.id;
    Campground.findById(id, (err, campground) => {
        if (err || !campground) {
            console.log(err);
            req.flash("error", "Hmm, that campground wasn't found...");
            res.redirect("back");
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
});

// Comments Create 

router.post("/", middleware.isLoggedIn, (req, res) => {
    // lookup campground by id
    let id = req.params.id;
    Campground.findById(id, (err, campground) => {
        if (err || !campground) {
            console.log(err);
            req.flash("error", "Hmm, that campground wasn't found...");
            res.redirect("/campgrounds");
        } else {
            let comment = req.body.comment;
            Comment.create(comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    // get username and id from user object
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Succesfully created commment!");
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});

// Edit

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err || !foundComment) {
            console.log(err);
            req.flash("error", "Hmm, that comment wasn't found...");
            res.redirect("back");
        } else {
            res.render("comments/edit", {
                campground_id: req.params.id,
                comment: foundComment,
            });
        }
    });
});

// Update

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err || !updatedComment) {
            res.redirect("back");
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

// Delete

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

module.exports = router;