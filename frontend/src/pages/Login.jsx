import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ setCurrUser }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://stay-finder-backend-umber.vercel.app/login",
        credentials,
        {
          withCredentials: true,
        }
      );

      setCurrUser(res.data.user);

      navigate("/listings", {
        state: {
          success: "Welcome back to StayFinder!",
        },
      });
    } catch (err) {
      console.error("Login failed:", err);

      navigate("/login", {
        state: {
          error:
            err.response?.data?.message ||
            "Invalid username or password",
        },
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container my-5">
      <div className="row bg-white shadow rounded overflow-hidden mx-auto login-card">
        {/* Left Side */}
        <div className="col-md-6 p-0 position-relative">
          <img
            src="/images/login-banner.png"
            alt="Travel Banner"
            className="img-fluid w-100 h-100"
            style={{
              objectFit: "cover",
              minHeight: "350px",
            }}
          />

          <div className="image-overlay">
            <h2 className="hero-title">
              Welcome Back to <br />
              StayFinder
            </h2>

            <p className="hero-text">
              Sign in to manage your trips,
              view bookings,
              <br />
              and continue exploring amazing
              destinations.
            </p>

            <div className="hero-badge">
              <i className="fa-solid fa-location-dot"></i>

              <span>
                Travel smarter <br />
                Stay with confidence
              </span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="col-md-6 d-flex align-items-center">
          <div className="w-100 px-4 px-lg-5 py-5">
            <h1 className="display-5 fw-bold mb-4">
              Login
            </h1>

            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div className="mb-3">
                <label
                  htmlFor="username"
                  className="form-label fw-bold"
                >
                  Username
                </label>

                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control form-control-lg"
                  placeholder="Enter your username"
                  value={
                    credentials.username
                  }
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="form-label fw-bold"
                >
                  Password
                </label>

                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control form-control-lg"
                  placeholder="Enter your password"
                  value={
                    credentials.password
                  }
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Forgot Password */}
              <div className="text-end mb-4">
                <Link
                  to="/reset-password"
                  className="text-decoration-none"
                >
                  Reset Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="btn btn-success btn-lg w-100"
              >
                Login
              </button>

              {/* Signup */}
              <p className="mt-4 mb-0 text-center">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-decoration-none"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;