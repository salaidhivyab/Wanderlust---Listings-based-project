const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exists!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    // let {title, description, image, price, country, location} = req.body; var name in input
    //let listing = req.body.listing;
    //  try {
        let url = req.file.path;
        let filename = req.file.filename;
        console.log(url,"..",filename);
        //listingSchema.validate(req.body);
        //console.log(result);//checking constrains if satisfies schema
        // if(result.error){
        //     throw(new ExpressError(400, result.error));
        // }
        // if(!req.body.listing){
        //     throw new ExpressError(400, "Send valid data for listing"); //400 cz client error
        // }
        // const newListing = new Listing(req.body.listing);
        // newListing.owner = req.user._id;
        // if (!newListing.image.url) {
        //     newListing.image.url = "https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80...";
        // }
        // await newListing.save();
        req.flash("success", "New listing created!");
        //console.log(newListing);
        res.redirect("/listings");
    // } catch(err){
    //     next(err);
    // }
    // console.log(listing);
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exists!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    if(!req.body.listing){
        throw new ExpressError(400, "Send valid data for listing"); //400 cz client error
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    console.log(deletedListing);
    res.redirect("/listings");
};