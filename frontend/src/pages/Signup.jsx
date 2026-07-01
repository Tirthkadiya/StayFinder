import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// Accept the setCurrUser prop here
const Signup = ({ setCurrUser }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://stay-finder-backend-umber.vercel.app/signup', formData, {
        withCredentials: true 
      });

      // Update navbar instantly
      setCurrUser(res.data.user); 
      // Redirect and Show success message
      navigate('/listings', { state: { success: "Welcome to StayFinder!" } }); 
    } catch (err) {
      console.error("Signup failed:", err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container my-5">
      <div className="row bg-white shadow rounded overflow-hidden mx-auto login-card">
        
        {/* Left Side Image & Overlay */}
        <div className="col-md-6 p-0 position-relative">
          <img
            src="/images/signup-banner.png"
            alt="Travel Banner"
            className="img-fluid w-100 h-100"
            style={{ objectFit: 'cover', minHeight: '350px' }}
          />

          {/* Overlay Content */}
          <div className="image-overlay">
            <h2 className="hero-title">
              Find Your Perfect Stay <br />
              With StayFinder
            </h2>

            <p className="hero-text">
              Create an account to save your favorite places,
              <br />
              manage bookings, and discover amazing destinations.
            </p>

            <div className="hero-badge">
              <i className="fa-solid fa-location-dot"></i>
              <span>
                Trusted stays <br />
                wherever your journey takes you
              </span>
            </div>
          </div>
        </div>

        {/* Right Side Signup Form */}
        <div className="col-md-6 d-flex align-items-center">
          <div className="w-100 px-4 px-lg-5 py-5">
            <h1 className="display-5 fw-bold mb-4">Create Account</h1>

            <form onSubmit={handleSubmit} className="needs-validation" noValidate>
              
              <div className="mb-3">
                <label htmlFor="username" className="form-label fw-bold">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control form-control-lg"
                  placeholder="Choose a username"
                  onChange={handleChange}
                  required
                />
                <div className="valid-feedback">Looks good!</div>
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-bold">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control form-control-lg"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  required
                />
                <div className="valid-feedback">Looks good!</div>
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-bold">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control form-control-lg"
                  placeholder="Create a strong password"
                  onChange={handleChange}
                  required
                />
                <div className="valid-feedback">Password looks strong!</div>
              </div>

              <button type="submit" className="btn btn-success btn-lg w-100">
                Create Account
              </button>

              <p className="mt-4 mb-0 text-center">
                Already have an account?{' '}
                <Link to="/login" className="text-decoration-none">
                  Login
                </Link>
              </p>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;