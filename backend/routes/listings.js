

const express = require("express");
const router = express.Router();

const multer = require("multer");
const { storage } = require("../config/cloudconfig");
const upload = multer({ storage });

const wrapAsync = require("../utils/wrapAsync");

const {
  validateListing,
  isLoggedIn,
  isOwner,
} = require("../middleware/middleware.js");

const listingController = require("../controllers/listings");

// Get All Listings
router.get(
  "/",
  wrapAsync(listingController.index)
);

// ADD THIS ROUTE HERE 👇
router.get(
  "/search",
  wrapAsync(listingController.searchListings)
);

// Get Single Listing
router.get(
  "/:id",
  wrapAsync(listingController.showListing)
);

// Create Listing
router.post(
  "/",
  isLoggedIn,
  upload.single("image"),
  validateListing,
  wrapAsync(listingController.createListing)
);

// Update Listing
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("image"),
  validateListing,
  wrapAsync(listingController.updateListing)
);

// User Listings
router.get(
  "/user/:userId",
  isLoggedIn,
  listingController.getUserListings
);

// Delete Listing
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;

