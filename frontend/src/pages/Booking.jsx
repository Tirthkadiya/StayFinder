import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Booking({ listing }) {

  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const getNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const checkInDate  = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const diffMs       = checkOutDate - checkInDate;         // difference in milliseconds
    const diffDays     = diffMs / (1000 * 60 * 60 * 24);    // convert ms → days
    return Math.max(0, Math.floor(diffDays));
  };

  const nights     = getNights();
  const totalPrice = listing?.pricePerNight ? nights * listing.pricePerNight : null;


  const handleChange = (e) => {
    const { name, value } = e.target;
    // Spread the old values and overwrite only the field that changed
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Returns an error message string, or null if everything is valid
  const validate = () => {
    const { checkIn, checkOut, guests } = formData;

    if (!checkIn || !checkOut)
      return "Please select both check-in and check-out dates.";

    if (new Date(checkIn) < new Date(today))
      return "Check-in date cannot be in the past.";

    if (new Date(checkOut) <= new Date(checkIn))
      return "Check-out must be after check-in.";

    if (guests < 1)
      return "At least 1 guest is required.";

    if (listing?.maxGuests && guests > listing.maxGuests)
      return `Max ${listing.maxGuests} guests allowed for this listing.`;

    return null; // no errors
  };

  // "Confirm Booking"
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const error = validate();
    if (error) {
      Swal.fire({ icon: "warning", title: "Check Your Details", text: error });
      return; 
    }

    //  user to confirm
    const result = await Swal.fire({
      icon: "question",
      title: "Confirm Your Booking?",
      html: `
        <p><b>${nights} night${nights !== 1 ? "s" : ""}</b></p>
        <p>Check-in : ${formData.checkIn}</p>
        <p>Check-out: ${formData.checkOut}</p>
        <p>Guests   : ${formData.guests}</p>
        ${totalPrice ? `<p><b>Total: ₹${totalPrice.toLocaleString()}</b></p>` : ""}
      `,
      showCancelButton: true,
      confirmButtonText: "Yes, Book It!",
      confirmButtonColor: "#dc3545",
    });

    if (!result.isConfirmed) return; // user clicked Cancel

    setLoading(true); 
    try {
      await axios.post(
        `http://localhost:3000/booking/${listing._id}`,
        formData,
        { withCredentials: true } 
      );

      // Success!
      Swal.fire({
        icon: "success",
        title: "Booking Confirmed! 🎉",
        text: `Your ${nights}-night stay has been booked.`,
      });

      // Reset form after booking
      setFormData({ checkIn: "", checkOut: "", guests: 1 });

    } catch (err) {
      
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: err.response?.data?.message || "Something went wrong. Try again.",
      });
    } finally {
      setLoading(false); 
    }
  };

  
  return (
    <div className="card shadow p-4 mt-4">

      {/* Header */}
      <h4 className="mb-1">Book This Stay</h4>
      {listing?.pricePerNight && (
        <p className="text-muted mb-3">
          ₹{listing.pricePerNight.toLocaleString()} / night
        </p>
      )}

      
      <form onSubmit={handleSubmit} noValidate>

        {/* Check-in & Check-out side by side */}
        <div className="row g-2 mb-3">
          <div className="col-6">
            <label className="form-label fw-semibold">Check In</label>
            <input
              type="date"
              name="checkIn"
              className="form-control"
              value={formData.checkIn}
              min={today}              
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-6">
            <label className="form-label fw-semibold">Check Out</label>
            <input
              type="date"
              name="checkOut"
              className="form-control"
              value={formData.checkOut}
              min={formData.checkIn || today}  
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Guests */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Guests</label>
          <input
            type="number"
            name="guests"
            className="form-control"
            min="1"
            max={listing?.maxGuests || 20}
            value={formData.guests}
            onChange={handleChange}
          />
          {/* Show max guests hint only if the listing has a limit */}
          {listing?.maxGuests && (
            <div className="form-text">Max {listing.maxGuests} guests allowed.</div>
          )}
        </div>

        {/* Live price summary — only visible once both dates are picked */}
        {nights > 0 && (
          <div className="alert alert-light border mb-3 py-2 px-3">
            <div className="d-flex justify-content-between">
              <span>{nights} night{nights !== 1 ? "s" : ""}</span>
              {totalPrice && <strong>₹{totalPrice.toLocaleString()}</strong>}
            </div>
          </div>
        )}

        
        <button
          type="submit"
          className="btn btn-danger w-100"
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />
              Booking...
            </>
          ) : (
            "Confirm Booking"
          )}
        </button>

      </form>
    </div>
  );
}

export default Booking;