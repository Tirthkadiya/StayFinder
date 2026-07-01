import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Profile = ({ currUser }) => {
  const [myListings, setMyListings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currUser) {
      setIsLoading(false);
      return;
    }

    const userId = currUser._id;

    const fetchData = async () => {
      try {
        // Fetch User Listings
        const listingsRes = await axios.get(
          `http://localhost:3000/listings/user/${userId}`,
          {
            withCredentials: true,
          }
        );

        setMyListings(listingsRes.data);

        // Fetch User Bookings
        const bookingsRes = await axios.get(
          "http://localhost:3000/bookings/my-bookings",
          {
            withCredentials: true,
          }
        );

        setMyBookings(bookingsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currUser]);

  if (!currUser) {
    return (
      <div className="container mt-5 text-center">
        <h3>You must be logged in to view this page.</h3>

        <Link to="/login" className="btn btn-danger mt-3">
          Log In
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div
          className="spinner-border text-danger"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      {/* Profile Header */}
      <div className="row align-items-center mb-4">
        <div className="col-auto">
          <i
            className="fa-regular fa-circle-user"
            style={{
              fontSize: "4rem",
              color: "#fe424d",
            }}
          ></i>
        </div>

        <div className="col">
          <h2 className="fw-bold">
            Hi, {currUser.username}!
          </h2>

          <p className="text-muted">
            Manage your listings and bookings.
          </p>
        </div>
      </div>

      <hr />

      {/* MY LISTINGS */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">
          My Listings
        </h4>

        <Link
          to="/listings/new"
          className="btn btn-danger btn-sm"
        >
          Add New
        </Link>
      </div>

      {myListings.length === 0 ? (
        <div className="alert alert-light border text-center py-5">
          <h5>
            You haven't created any listings yet.
          </h5>

          <Link
            to="/listings/new"
            className="btn btn-outline-dark mt-3"
          >
            Create Listing
          </Link>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {myListings.map((listing) => (
            <div
              className="col"
              key={listing._id}
            >
              <div className="card h-100 shadow-sm">
                <img
                  src={
                    listing.image?.url ||
                    "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                  }
                  className="card-img-top"
                  alt={listing.title}
                />

                <div className="card-body">
                  <h5 className="fw-bold">
                    {listing.title}
                  </h5>

                  <p className="text-muted">
                    <i className="fa-solid fa-map-pin me-1"></i>
                    {listing.location},{" "}
                    {listing.country}
                  </p>

                  <p className="fw-bold">
                    ₹
                    {listing.price?.toLocaleString(
                      "en-IN"
                    )}{" "}
                    / Night
                  </p>
                </div>

                <div className="card-footer bg-white">
                  <div className="d-flex justify-content-between">
                    <Link
                      to={`/listings/${listing._id}`}
                      className="btn btn-outline-dark btn-sm"
                    >
                      View
                    </Link>

                    <Link
                      to={`/listings/${listing._id}/edit`}
                      className="btn btn-outline-danger btn-sm"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <hr className="my-5" />

      {/* MY BOOKINGS */}
      <h4 className="fw-bold mb-4">
        My Bookings
      </h4>

      {myBookings.length === 0 ? (
        <div className="alert alert-light border text-center py-5">
          <h5>No bookings yet.</h5>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {myBookings.map((booking) => (
            <div
              className="col"
              key={booking._id}
            >
              <div className="card h-100 shadow-sm">
                <img
                  src={
                    booking.listing?.image?.url ||
                    "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                  }
                  className="card-img-top"
                  alt={
                    booking.listing?.title
                  }
                />

                <div className="card-body">
                  <h5 className="fw-bold">
                    {
                      booking.listing?.title
                    }
                  </h5>

                  <p className="text-muted">
                    <i className="fa-solid fa-map-pin me-1"></i>
                    {
                      booking.listing
                        ?.location
                    }
                    ,{" "}
                    {
                      booking.listing
                        ?.country
                    }
                  </p>

                  <p>
                    <strong>
                      Check In:
                    </strong>{" "}
                    {new Date(
                      booking.checkIn
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>
                      Check Out:
                    </strong>{" "}
                    {new Date(
                      booking.checkOut
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>
                      Guests:
                    </strong>{" "}
                    {booking.guests}
                  </p>

                  <p className="fw-bold text-danger">
                    ₹
                    {booking.totalPrice?.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  <p>
                    Status:{" "}
                    <span className="badge bg-success">
                      {booking.status}
                    </span>
                  </p>
                </div>

                <div className="card-footer bg-white">
                  <Link
                    to={`/listings/${booking.listing?._id}`}
                    className="btn btn-danger w-100"
                  >
                    View Listing
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;