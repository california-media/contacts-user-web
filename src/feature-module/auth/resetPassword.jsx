import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { all_routes } from "../router/all_routes";
import api from "../../core/axios/axiosInstance";

const useQuery = () => new URLSearchParams(useLocation().search);

const ResetPassword = () => {
  const route = all_routes;
  const query = useQuery();
  const token = query.get("token");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors("");
    if (!formData.password || !formData.confirmPassword) {
      setErrors("Both fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
     const res = await api.post(`/auth/reset-password?token=${token}`, {
  password: formData.password,
  confirmPassword: formData.confirmPassword,
});

      console.log("Password reset successful:", res.data);
      navigate(route.login); // redirect to login page
    } catch (error) {
      console.error("Error resetting password:", error);
      const message =
        error?.response?.data?.message || "Something went wrong.";
      setErrors(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Token from URL:", token);
  }, [token]);

  return (
    <div className="account-content">
      <div className="d-flex flex-wrap w-100 vh-100 overflow-hidden">
        <div className="d-flex align-items-center justify-content-center flex-wrap vh-100 overflow-auto p-4 w-100 bg-backdrop">
          <form className="flex-fill" onSubmit={handleSubmit}>
            <div className="mx-auto mw-450">
              <div className="text-center mb-4">
                <ImageWithBasePath
                  src="assets/img/logo.png"
                  width={100}
                  height={100}
                />
              </div>
              <div className="mb-4">
                <h4 className="mb-2 fs-20">Reset Password</h4>
                <p>Enter your new password and confirm it below.</p>
              </div>

              {errors && (
                <div className="alert alert-danger" role="alert">
                  {errors}
                </div>
              )}

              <div className="mb-3">
                <label className="col-form-label">Password</label>
                <div className="pass-group">
                  <input
                    type={passwordVisibility.password ? "text" : "password"}
                    className="pass-input form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className={`ti toggle-passwords ${
                      passwordVisibility.password ? "ti-eye" : "ti-eye-off"
                    }`}
                    onClick={() => togglePasswordVisibility("password")}
                  ></span>
                </div>
              </div>

              <div className="mb-3">
                <label className="col-form-label">Confirm Password</label>
                <div className="pass-group">
                  <input
                    type={
                      passwordVisibility.confirmPassword ? "text" : "password"
                    }
                    className="pass-input-new form-control"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className={`ti toggle-passwords ${
                      passwordVisibility.confirmPassword
                        ? "ti-eye"
                        : "ti-eye-off"
                    }`}
                    onClick={() =>
                      togglePasswordVisibility("confirmPassword")
                    }
                  ></span>
                </div>
              </div>

              <div className="mb-3">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Change Password"}
                </button>
              </div>

              <div className="mb-3 text-center">
                <h6>
                  Return to{" "}
                  <Link to={route.login} className="text-purple link-hover">
                    Login
                  </Link>
                </h6>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
