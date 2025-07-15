const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const {isLoggedIn, isOwner,validateListing, forwardGeometry} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudinaryConfig.js");
const upload = multer({ storage });

//new route
router.route("/new").get(isLoggedIn,listingController.newListing);

//edit route
router.route("/:id/edit").get(isLoggedIn,isOwner,WrapAsync(listingController.editListing));

//update route
router.route("/:id").put(isLoggedIn,isOwner,upload.single("Listing[image]"),validateListing,forwardGeometry,WrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,WrapAsync(listingController.destroyListing))
.get(WrapAsync(listingController.showListing));  //delete route  //show route

//index route
router.route("/").get(WrapAsync(listingController.indexListing))
.post(isLoggedIn,upload.single("Listing[image]"),validateListing,forwardGeometry,WrapAsync(listingController.createListing));//create route

module.exports = router;