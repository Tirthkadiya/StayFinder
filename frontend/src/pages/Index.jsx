

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Index = () => {
  const [listings, setListings] = useState([]);
  const [showTax, setShowTax] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filters = [
    { icon: "fa-solid fa-border-all", label: "All" },
    { icon: "fa-solid fa-fire", label: "Trending" },
    { icon: "fa-solid fa-bed", label: "Rooms" },
    { icon: "fa-solid fa-mountain-city", label: "Iconic Cities" },
    { icon: "fa-brands fa-fort-awesome", label: "Castles" },
    { icon: "fa-solid fa-mountain-sun", label: "Mountain Views" },
    { icon: "fa-solid fa-tent", label: "Camping" },
    { icon: "fa-solid fa-person-swimming", label: "Amazing Pools" },
    { icon: "fa-solid fa-tractor", label: "Farms" },
    { icon: "fa-solid fa-snowflake", label: "Arctic" },
    { icon: "fa-solid fa-ship", label: "Boats" },
  ];

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get(
          "https://stay-finder-backend-umber.vercel.app/listings",
          {
            withCredentials: true,
          }
        );

        const data = Array.isArray(res.data)
          ? res.data
          : res.data.listings || [];

        setListings(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchListings();
  }, []);

  // Filter Logic
  let filteredListings = listings;

  if (selectedFilter !== "All") {
    filteredListings = listings.filter((listing) => {
      return (
        listing.category === selectedFilter
      );
    });
  }

  return (
    <>
      {/* Filters */}
      <div id="filters">
        {filters.map((filter) => (
          <div
            key={filter.label}
            className={`filter ${
              selectedFilter === filter.label
                ? "active-filter"
                : ""
            }`}
            onClick={() =>
              setSelectedFilter(filter.label)
            }
          >
            <i className={filter.icon}></i>
            <p>{filter.label}</p>
          </div>
        ))}

        {/* Tax Switch */}
        <div className="tax-switch">
          <div className="form-check form-switch d-flex align-items-center m-0">
            <input
              className="form-check-input"
              type="checkbox"
              checked={showTax}
              onChange={() =>
                setShowTax(!showTax)
              }
            />

            <label className="form-check-label ms-2">
              Display Taxes
            </label>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="container">
        <div className="row g-4">
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
              <div
                className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
                key={listing._id}
              >
                <div className="card listing-card shadow-sm h-100">
                  <Link
                    to={`/listings/${listing._id}`}
                    className="listing-link"
                  >
                    <img
                      src={
                        listing.image?.url ||
                        "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                      }
                      className="card-img-top"
                      alt={listing.title}
                    />
                  </Link>

                  <div className="card-body">
                    {listing.category && (
                      <span className="category-badge">
                        {listing.category}
                      </span>
                    )}

                    <h5 className="card-title mt-2">
                      {listing.title}
                    </h5>

                    <p className="location">
                      <i className="fa-solid fa-map-pin me-1"></i>
                      {listing.location},{" "}
                      {listing.country}
                    </p>

                    <p className="card-text mb-2">
                      ₹{" "}
                      {listing.price?.toLocaleString(
                        "en-IN"
                      )}{" "}
                      / Night

                      {showTax && (
                        <span className="tax-info">
                          {" "}
                          (+18% GST)
                        </span>
                      )}
                    </p>

                    <Link
                      to={`/listings/${listing._id}`}
                      className="btn btn-danger w-100"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5">
              <h4>
                No listings found for "
                {selectedFilter}"
              </h4>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Index;