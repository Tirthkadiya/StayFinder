import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return alert(
        "Passwords do not match!"
      );
    }

    if (password.length < 6) {
      return alert(
        "Password must be at least 6 characters."
      );
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `http://localhost:3000/reset-password/${token}`,
        {
          password,
        }
      );

      alert(
        res.data.message ||
          "Password reset successfully!"
      );

      navigate("/login");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Invalid or expired reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0 rounded-4 p-4">
            <h2 className="text-center mb-4">
              Reset Password
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">
                  New Password
                </label>

                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">
                  Confirm Password
                </label>

                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-success btn-lg w-100"
                disabled={loading}
              >
                {loading
                  ? "Resetting..."
                  : "Reset Password"}
              </button>

              <p className="text-center mt-4 mb-0">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-decoration-none"
                >
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

export default ResetPassword;