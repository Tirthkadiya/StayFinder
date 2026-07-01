
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Navbar = ({ currUser }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) return;
    navigate(
      `/listings/search?q=${encodeURIComponent(query)}`
    );
    setSearch("");
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/logout", {}, { withCredentials: true });
      
      navigate("/listings", { 
        state: { success: "You have been logged out successfully!" } 
      });
      
      window.location.reload(); 
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="navbar navbar-expand-md border-bottom sticky-top bg-white">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand" to="/listings">
          <img
            src="/images/StayFinder.png"
            alt="StayFinder Logo"
            className="navbar-logo"
            style={{ height: "45px" }}
          />
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Explore */}
          <div className="navbar-nav">
            <Link className="nav-link fw-bold" to="/listings">
              Explore
            </Link>
          </div>

          {/* Search */}
          <form
            className="search-form mx-auto"
            onSubmit={handleSearch}
          >
            <input
              type="search"
              className="form-control search-inp"
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              type="submit"
              className="btn btn-danger search-btn"
            >
              <span className="ms-1">Search</span>
            </button>
          </form>

          {/* Right Side */}
          <div className="navbar-nav align-items-center">
            {!currUser ? (
              <>
                <Link className="nav-link fw-bold" to="/signup">
                  Sign Up
                </Link>

                <Link className="nav-link fw-bold" to="/login">
                  Log In
                </Link>
              </>
            ) : (
              <>
                <Link className="nav-link fw-bold" to="/listings/new">
                  Add Listing
                </Link>

                <span className="nav-link fw-bold" style={{ cursor: "pointer" }}      onClick={handleLogout}>
                  Log Out
                </span>

                <Link
                  className="nav-link d-flex align-items-center"
                  to="/profile"
                  >
                  <i className="profile-icon fa-regular fa-circle-user fs-4" style={{ color: "red" }}></i>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
