const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/booking");

const {isLoggedIn,validateBooking,isBookingOwner} = require("../middleware/middleware");

// Create Booking
router.post(
  "/:id",
  isLoggedIn,
  validateBooking,
  bookingController.createBooking
);

// Get Logged-in User Bookings
router.get(
  "/my-bookings",
  isLoggedIn,
  bookingController.getMyBookings
);

// Get Single Booking
router.get(
  "/:bookingId",
  isLoggedIn,
  bookingController.getBooking
);

// Cancel Booking
router.put(
  "/:bookingId/cancel",
  isLoggedIn,
  isBookingOwner,
  bookingController.cancelBooking
);

// Delete Booking
router.delete(
  "/:bookingId",
  isLoggedIn,
  isBookingOwner,
  bookingController.deleteBooking
);

module.exports = router;