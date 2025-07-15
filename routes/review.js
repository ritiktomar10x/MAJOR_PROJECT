const express = require("express");
const router = express.Router({mergeParams:true});
const WrapAsync = require("../utils/WrapAsync.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//POST review route
router.post("/",isLoggedIn,validateReview,WrapAsync(reviewController.postReview));

//Delete Review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,WrapAsync(reviewController.destroyReview));

module.exports = router;