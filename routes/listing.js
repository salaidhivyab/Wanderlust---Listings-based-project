const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");

const {isLoggedIn, isAuthorizedUser, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
    .get(wrapAsync(listingController.index))//index route
    .post( //create route
        isLoggedIn, 
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)
    )

//new route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

router.route("/:id")
    .get(wrapAsync(listingController.showListing)) //show route, below new route cz it misinterprets as id
    .put( //update route
        isLoggedIn, 
        isAuthorizedUser,
        upload.single("listing[image]"),
        validateListing, 
        wrapAsync(listingController.updateListing)
    ) 
    .delete( //delete/destroy route
        isLoggedIn, 
        isAuthorizedUser, 
        wrapAsync(listingController.destroyListing)
    )

//Edit route
router.get("/:id/edit", isLoggedIn, isAuthorizedUser, wrapAsync(listingController.renderEditForm));

module.exports = router;