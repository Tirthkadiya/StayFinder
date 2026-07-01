const Booking = require("../models/booking");
const Listing = require("../models/listings");

// =======================
// Create Booking
// =======================
module.exports.createBooking = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Prevent booking own listing
    if (
      listing.owner &&
      listing.owner.equals(req.user._id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot book your own listing.",
      });
    }

    const {
      checkIn,
      checkOut,
      guests,
    } = req.body;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const nights =
      (checkOutDate - checkInDate) /
      (1000 * 60 * 60 * 24);

    if (nights <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Check-out date must be after check-in date.",
      });
    }

    // Check for overlapping bookings
    const existingBooking =
      await Booking.findOne({
        listing: listing._id,
        status: {
          $ne: "Cancelled",
        },
        checkIn: {
          $lt: checkOutDate,
        },
        checkOut: {
          $gt: checkInDate,
        },
      });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message:
          "This listing is already booked for these dates.",
      });
    }

    const totalPrice =
      listing.price * nights;

    const booking =
      await Booking.create({
        listing: listing._id,
        user: req.user._id,
        checkIn,
        checkOut,
        guests,
        totalPrice,
        status: "Confirmed",
      });

    const populatedBooking =
      await Booking.findById(
        booking._id
      )
        .populate("listing")
        .populate(
          "user",
          "username email"
        );

    res.status(201).json({
      success: true,
      message:
        "Booking created successfully.",
      booking: populatedBooking,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message:
        "Failed to create booking.",
    });
  }
};

// =======================
// Get My Bookings
// =======================
module.exports.getMyBookings =
  async (req, res) => {
    try {
      const bookings =
        await Booking.find({
          user: req.user._id,
        })
          .populate("listing")
          .populate(
            "user",
            "username email"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        bookings,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message:
          "Failed to fetch bookings.",
      });
    }
  };

// =======================
// Get Single Booking
// =======================
module.exports.getBooking =
  async (req, res) => {
    try {
      const booking =
        await Booking.findById(
          req.params.bookingId
        )
          .populate("listing")
          .populate(
            "user",
            "username email"
          );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message:
            "Booking not found.",
        });
      }

      res.status(200).json({
        success: true,
        booking,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message:
          "Failed to fetch booking.",
      });
    }
  };

// =======================
// Cancel Booking
// =======================
module.exports.cancelBooking =
  async (req, res) => {
    try {
      const booking =
        await Booking.findById(
          req.params.bookingId
        );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message:
            "Booking not found.",
        });
      }

      if (
        !booking.user.equals(
          req.user._id
        )
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Unauthorized action.",
        });
      }

      booking.status =
        "Cancelled";

      await booking.save();

      res.status(200).json({
        success: true,
        message:
          "Booking cancelled successfully.",
        booking,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message:
          "Failed to cancel booking.",
      });
    }
  };

// =======================
// Delete Booking
// =======================
module.exports.deleteBooking =
  async (req, res) => {
    try {
      const booking =
        await Booking.findById(
          req.params.bookingId
        );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message:
            "Booking not found.",
        });
      }

      if (
        !booking.user.equals(
          req.user._id
        )
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Unauthorized action.",
        });
      }

      await Booking.findByIdAndDelete(
        req.params.bookingId
      );

      res.status(200).json({
        success: true,
        message:
          "Booking deleted successfully.",
        });
    } catch (err) {
      res.status(500).json({
        success: false,
        message:
          "Failed to delete booking.",
      });
    }
  };