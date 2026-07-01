
import {
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  useParams,
  useNavigate,
  Link,
  useOutletContext,
} from "react-router-dom";
import axios from "axios";
import "../assets/rating.css";
import Booking from "./Booking";

const API_URL = "http://localhost:3000";

const ShowListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currUser } =
    useOutletContext();

  const [listing, setListing] =
    useState(null);

  const [review, setReview] =
    useState({
      rating: 5,
      comment: "",
    });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const fetchListing =
    useCallback(async () => {
      try {
        const res =
          await axios.get(
            `${API_URL}/listings/${id}`,
            {
              withCredentials: true,
            }
          );

        setListing(res.data);
      } catch (err) {
        console.log(err);
      }
    }, [id]);

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  const handleDelete =
    async () => {
      try {
        await axios.delete(
          `${API_URL}/listings/${id}`,
          {
            withCredentials: true,
          }
        );

        navigate("/listings", {
          state: {
            success:
              "Listing deleted successfully!",
          },
        });
      } catch (err) {
        console.log(err);
      }
    };

  const handleReviewChange = (e) => {
    setReview({
      ...review,
      [e.target.name]:
        e.target.name === "rating"
          ? Number(e.target.value)
          : e.target.value,
    });
  };;

  const handleReviewSubmit =
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        await axios.post(
          `${API_URL}/listings/${id}/reviews`,
          { review },
          {
            withCredentials: true,
          }
        );

        setReview({
          rating: 5,
          comment: "",
        });

        await fetchListing();
      } catch (err) {
        alert(
          err.response?.data
            ?.message ||
            "Something went wrong"
        );
      } finally {
        setIsSubmitting(false);
      }
    };

  const handleReviewDelete =
    async (reviewId) => {
      try {
        await axios.delete(
          `${API_URL}/listings/${id}/reviews/${reviewId}`,
          {
            withCredentials: true,
          }
        );

        fetchListing();
      } catch (err) {
        alert(
          "You can only delete your own review!"
        );
      }
    };

  if (!listing) {
    return (
      <div className="container text-center mt-5">
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
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="show-card card border-0">
            <h3 className="fw-bold mb-3">
              {listing.title}
            </h3>

            <img
              src={listing.image?.url}
              alt={listing.title}
              className="show-img card-img-top rounded-4 shadow-sm"
            />

            <div className="card-body px-0 mt-3">
              <p className="text-muted">
                Owned by{" "}
                <span className="fw-bold text-dark">
                  @{listing.owner?.username}
                </span>
              </p>

              <div className="mb-4">
                <p className="fw-bold">
                  Description :
                </p>

                <p className="fs-5">
                  {listing.description}
                </p>
              </div>

              <p className="fs-5 text-muted">
                <span className="fw-bold text-dark">
                  ₹
                  {listing.price?.toLocaleString(
                    "en-IN"
                  )}
                </span>{" "}
                / Night
              </p>

              <p className="text-muted">
                <i className="fa-solid fa-map-pin me-2"></i>
                {listing.location},{" "}
                {listing.country}
              </p>

              {/* BOOKING SECTION */}
              {currUser ? (
                currUser._id !==
                  listing.owner?._id && (
                  <>
                    <hr className="my-4" />

                    <Booking
                      listing={
                        listing
                      }
                    />
                  </>
                )
              ) : (
                <>
                  <hr className="my-4" />

                  <div className="alert alert-light border rounded-4 text-center">
                    <h5>
                      Want to book this
                      stay?
                    </h5>

                    <p className="text-muted">
                      Please login first.
                    </p>

                    <Link
                      to="/login"
                      className="btn btn-danger"
                    >
                      Login to Book
                    </Link>
                  </div>
                </>
              )}

              {/* OWNER BUTTONS */}
              {currUser &&
                currUser._id ===
                  listing.owner?._id && (
                  <div className="d-flex gap-3 mt-4">
                    <Link
                      to={`/listings/${id}/edit`}
                      className="btn btn-danger"
                    >
                      Edit
                    </Link>

                    <button
                      className="btn btn-dark"
                      onClick={
                        handleDelete
                      }
                    >
                      Delete
                    </button>
                  </div>
                )}
            </div>
          </div>

          <hr className="my-5" />

          {/* REVIEW FORM */}
          {currUser ? (
            <>
              <h4 className="fw-bold mb-4">
                Leave a Review
              </h4>

              <form onSubmit={handleReviewSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Rating
                  </label>

                  <fieldset className="starability-growRotate">
                    <input
                      type="radio"
                      id="no-rate"
                      className="input-no-rate"
                      name="rating"
                      value="0"
                      checked={Number(review.rating) === 0}
                      onChange={handleReviewChange}
                      aria-label="No rating."
                    />

                    <input
                      type="radio"
                      id="first-rate1"
                      name="rating"
                      value="1"
                      checked={Number(review.rating) === 1}
                      onChange={handleReviewChange}
                    />
                    <label htmlFor="first-rate1" title="Terrible">
                      1 star
                    </label>

                    <input
                      type="radio"
                      id="first-rate2"
                      name="rating"
                      value="2"
                      checked={Number(review.rating) === 2}
                      onChange={handleReviewChange}
                    />
                    <label htmlFor="first-rate2" title="Not good">
                      2 stars
                    </label>

                    <input
                      type="radio"
                      id="first-rate3"
                      name="rating"
                      value="3"
                      checked={Number(review.rating) === 3}
                      onChange={handleReviewChange}
                    />
                    <label htmlFor="first-rate3" title="Average">
                      3 stars
                    </label>

                    <input
                      type="radio"
                      id="first-rate4"
                      name="rating"
                      value="4"
                      checked={Number(review.rating) === 4}
                      onChange={handleReviewChange}
                    />
                    <label htmlFor="first-rate4" title="Very good">
                      4 stars
                    </label>

                    <input
                      type="radio"
                      id="first-rate5"
                      name="rating"
                      value="5"
                      checked={Number(review.rating) === 5}
                      onChange={handleReviewChange}
                    />
                    <label htmlFor="first-rate5" title="Amazing">
                      5 stars
                    </label>

                    <span className="starability-focus-ring"></span>
                  </fieldset>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="comment"
                    className="form-label fw-bold"
                  >
                    Comments
                  </label>

                  <textarea
                    id="comment"
                    className="form-control"
                    rows="4"
                    name="comment"
                    placeholder="Share your experience..."
                    value={review.comment}
                    onChange={handleReviewChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-outline-danger"
                >
                  {isSubmitting
                    ? "Submitting..."
                    : "Submit Review"}
                </button>
              </form>
              <hr className="my-5" />
            </>
          ) : null}

          {/* ALL REVIEWS */}
          <h4 className="fw-bold mb-4">
            All Reviews
          </h4>
          
          {listing.reviews?.length > 0 ? (
            <div className="row g-4">
              {listing.reviews.map((rev) => (
                <div
                  className="col-md-6"
                  key={rev._id}
                >
                  <div className="card shadow-sm border-0 h-100 p-3 rounded-4 bg-light">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold mb-0">
                          @{rev.author?.username || "User"}
                        </h6>

                        <p
                          className="starability-result m-0"
                          data-rating={rev.rating}
                        >
                          {rev.rating} stars
                        </p>
                      </div>

                      <p className="mt-3">
                        {rev.comment}
                      </p>

                      {currUser &&
                        currUser._id ===
                          rev.author?._id && (
                          <button
                            onClick={() =>
                              handleReviewDelete(
                                rev._id
                              )
                            }
                            className="btn btn-sm btn-dark mt-3"
                          >
                            Delete
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">
              No reviews yet. Be the first to
              leave one!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowListing;