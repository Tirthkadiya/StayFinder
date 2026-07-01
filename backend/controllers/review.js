const Review = require("../models/review");
const Listing = require("../models/listings");

module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(
    req.params.id
  );

  if (!listing) {
    return res.status(404).json({
      message: "Listing not found",
    });
  }

  const newReview = new Review(req.body.review);

  newReview.author = req.user._id;

  await newReview.save();

  listing.reviews.push(newReview._id);

  await listing.save();

  res.status(201).json({
    success: true,
    message: "Review Added",
    review: newReview,
  });
};

module.exports.destroyReview = async (
  req,
  res
) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, {
    $pull: {
      reviews: reviewId,
    },
  });

  await Review.findByIdAndDelete(reviewId);

  res.json({
    success: true,
    message: "Review Deleted",
  });
};