const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

//reviews
//post review route
router.post("/",isLoggedIn, validateReview,  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success", "New review created!");
    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);
}))

//delete review route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(async(req, res, err) => {
    let {id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});//to pull remove review from list

    let review = await Review.findByIdAndDelete(reviewId);//calls middleware of listing to delete review
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
}));


module.exports = router;