
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";

const API_URL = "https://stay-finder-backend-umber.vercel.app";

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [listings, setListings] = useState([]);
  
  const [loading, setLoading] = useState(!!query);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_URL}/listings/search`, {
          params: { q: query },
          withCredentials: true,
        });

        setListings(res.data || []);
      } catch (err) {
        console.error("Search Error:", err);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    if (query.trim()) {
      fetchResults();
    } else {
      setListings([]);
      setLoading(false); // Ensure loading stops if the query is cleared
    }
  }, [query]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h5>Searching...</h5>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h4 className="mb-4">
        Search Results{" "}
        {query && (
          <>
            for "<strong>{query}</strong>"
          </>
        )}
      </h4>

      {listings.length > 0 ? (
        <div className="row">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="col-lg-4 col-md-6 col-sm-12 mb-4"
            >
              <Link
                to={`/listings/${listing._id}`}
                className="text-decoration-none text-dark"
              >
                <div className="card listing-card h-100 border-0 shadow-sm">
                  <img
                    src={
                      listing.image?.url ||
                      listing.image ||
                      "https://via.placeholder.com/500x300?text=No+Image"
                    }
                    alt={listing.title}
                    className="card-img-top"
                    style={{
                      height: "280px",
                      objectFit: "cover",
                      borderRadius: "1rem 1rem 0 0",
                    }}
                  />

                  <div className="card-body">
                    <h5 className="fw-bold">{listing.title}</h5>

                    <p className="text-muted mb-2">
                      {listing.location}, {listing.country}
                    </p>

                    <p className="fw-semibold mb-0">
                      ₹ {listing.price?.toLocaleString("en-IN")} / Night
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <h5 className="text-muted">
            {query.trim() 
              ? `No destinations found matching "${query}"`
              : "Please enter a search term to find destinations."}
          </h5>

          <Link to="/listings" className="btn btn-danger mt-3">
            Back to Explore
          </Link>
        </div>
      )}
    </div>
  );
}

export default Search;