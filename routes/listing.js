const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isAuthorizedUser, validateListing} = require("../middleware.js");

//Index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//new route
router.get("/new", isLoggedIn, wrapAsync((req, res) => {
    res.render("listings/new.ejs");
}));

//show route (crud read)
//below new route cz js misinterpret as id
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exists!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

//create route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    // let {title, description, image, price, country, location} = req.body; var name in input
    //let listing = req.body.listing;
    //  try {
        listingSchema.validate(req.body);
        //console.log(result);//checking constrains if satisfies schema
        // if(result.error){
        //     throw(new ExpressError(400, result.error));
        // }
        if(!req.body.listing){
            throw new ExpressError(400, "Send valid data for listing"); //400 cz client error
        }
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        if (!newListing.image.url) {
            newListing.image.url = "https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80...";
        }
        await newListing.save();
        req.flash("success", "New listing created!");
        console.log(newListing);
        res.redirect("/listings");
    // } catch(err){
    //     next(err);
    // }
    // console.log(listing);
}));

//Edit route
router.get("/:id/edit", isLoggedIn, isAuthorizedUser, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exists!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

//update route
router.put("/:id", isLoggedIn, isAuthorizedUser, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    if(!req.body.listing){
        throw new ExpressError(400, "Send valid data for listing"); //400 cz client error
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id", isLoggedIn, isAuthorizedUser, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports = router;