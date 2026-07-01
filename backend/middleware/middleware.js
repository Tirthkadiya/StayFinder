const Listing = require("../models/listings.js");
const Review = require("../models/review.js");
const Booking = require("../models/booking.js");

const { listingSchema,reviewSchema,bookingSchema} = require("../schema");


// 


module.exports.isLoggedIn = (req,res,next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      message:
        "You must be logged in first",
    });
  }

  next();
};


// 


module.exports.validateListing = (req,res,next) => {
  console.log("Validating body:", req.body);
  const { error } =
    listingSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details
        .map((e) => e.message)
        .join(","),
    });
  }

  next();
};


// 


module.exports.validateReview = (req,res,next) => {
  const { error } =
    reviewSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details
        .map((e) => e.message)
        .join(","),
    });
  }

  next();
};


// 


module.exports.validateBooking = (
  req,
  res,
  next
) => {
  const {
    checkIn,
    checkOut,
  } = req.body;

  if (!checkIn || !checkOut) {
    return res.status(400).json({
      success: false,
      message:
        "Check-in and Check-out are required.",
    });
  }

  next();
};


// 


module.exports.isOwner = async (req,res,next) => {
  const { id } = req.params;

  const listing =
    await Listing.findById(id);

  if (!listing) {
    return res.status(404).json({
      message: "Listing not found",
    });
  }

  if (
    !listing.owner.equals(req.user._id)
  ) {
    return res.status(403).json({
      message:
        "You are not the owner",
    });
  }

  next();
};

// 

module.exports.isReviewAuthor =async (req, res, next) => {
  const { reviewId } = req.params;

    const review =
      await Review.findById(reviewId);

    if (
      !review.author.equals(req.user._id)
    ) {
      return res.status(403).json({
        message:
          "You are not the author",
      });
    }

    next();
  };


// 

module.exports.isBookingOwner =
  async (req, res, next) => {
    const booking =
      await Booking.findById(
        req.params.bookingId
      );

    if (!booking) {
      return res.status(404).json({
        message:
          "Booking not found",
      });
    }

    if (
      !booking.user.equals(
        req.user._id
      )
    ) {
      return res.status(403).json({
        message:
          "You are not authorized",
      });
    }

    next();
  };
