const express = require("express");
const router = express.Router({
  mergeParams: true,
});

const wrapAsync = require("../utils/wrapAsync");

const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware/middleware");

const reviewController = require(
  "../controllers/review"
);

// Create Review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(
    reviewController.createReview
  )
);

// Delete Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(
    reviewController.destroyReview
  )
);

module.exports = router;