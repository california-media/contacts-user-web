import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../core/axios/axiosInstance";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const PhoneResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Optional: get phone and countryCode from state passed via navigate
  const initialPhone = location.state?.phone || "";
  const initialCountryCode = location.state?.countryCode || "";

  const [phone, setPhone] = useState(initialPhone);
  const [countryCode, setCountryCode] = useState(initialCountryCode);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Helper to extract country code from phone input's value
  // react-phone-input-2 returns full phone as string like "971501234567"
  // We'll derive country code as the prefix part

  const handlePhoneChange = (value, data) => {
    setPhone(value);
    if (data && data.dialCode) {
      setCountryCode(data.dialCode);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        phonenumber: "+" + phone,
        countryCode: "+" + countryCode,
        otp,
        password,
        confirmPassword,
        apiType: "web",
      };

      const res = await api.post("/phoneNumber/reset-password", payload);

      setMessage(res.data.message || "Password reset successfully!");
      // Optionally redirect to login page after success
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(
        error?.response?.data?.message || "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container bg-white py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mb-4 text-center">Reset Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                Phone Number <span className="text-danger">*</span>
              </label>
              <PhoneInput
                country={"ae"}
                value={phone}
                onChange={handlePhoneChange}
                enableSearch
                inputProps={{
                  name: "phone",
                  required: true,
                }}
                inputStyle={{ width: "100%" }}
                disabled // Make phone number readonly if you want (optional)
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                OTP <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                New Password <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                required
                minLength={6}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Confirm Password <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Reset Password"}
            </button>
          </form>

          {message && (
            <p className="mt-3 text-center text-info">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneResetPassword;
