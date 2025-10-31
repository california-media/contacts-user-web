import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../core/axios/axiosInstance";

import { Player } from "@lottiefiles/react-lottie-player";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import loginAnimation1 from "../../style/animations/loginAnimation1.json";

const ForgotPassword = () => {
  const { method } = useParams(); // 'email' or 'phone'
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
 const navigate = useNavigate();
  // Handle submit
const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let endpoint = "";
      let payload = {};

      if (method === "email") {
        endpoint = "/email/forgot-password";
        payload = { email: value };
      } else if (method === "phone") {
        endpoint = "/phoneNumber/forgot-password";
        payload = { phonenumber: "+" + value };

        const res = await api.post(endpoint, payload);
        setMessage(res.data.message || "OTP sent successfully");

        // Navigate to OTP reset page with phone & country code
        // You may want to extract country code from phone input
        // Assuming value includes country code e.g. "971501234567"
        const countryCode = value.slice(0, value.length - 9); // or parse dynamically
        navigate("/phone-reset-password", {
          state: {
            phone: value,
            countryCode,
          },
        });

        setLoading(false);
        return; // exit after navigation
      } else {
        throw new Error("Invalid method.");
      }

      const res = await api.post(endpoint, payload);
      setMessage(res.data.message || "Reset link sent successfully");
    } catch (error) {
      setMessage(
        error?.response?.data?.message || "Failed to send reset request"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fallback for invalid route param
  if (method !== "email" && method !== "phone") {
    return <p className="text-center mt-5">Invalid password reset method.</p>;
  }

  return (
    <div className="container-fluid min-vh-100 p-0 bg-white d-flex align-items-center justify-content-center">
      <div className="row h-100 m-0">
        {/* Left Side - Form */}
        <div className="col-md-6 d-flex bg-white align-items-center justify-content-center px-5">
          <div style={{ maxWidth: "400px", width: "100%" }}>
            <h2 className="mb-4 fw-bold text-center">Forgot Password</h2>
            <form onSubmit={handleForgotPassword}>
              {method === "email" ? (
                <div className="mb-3">
                  <label className="form-label">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>
              ) : (
                <div className="mb-3">
                  <label className="form-label">
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <PhoneInput
                    country={"ae"}
                    value={value}
                    onChange={setValue}
                    enableSearch
                    inputProps={{
                      name: "phone",
                      required: true,
                    }}
                    inputStyle={{ width: "100%" }}
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Send Reset Link"}
              </button>
            </form>

            {message && (
              <p className="mt-3 text-info text-center">{message}</p>
            )}

           <div className="mt-3 text-center">
  <span>Back to </span>
  <Link to="/login" className="text-primary text-decoration-underline">
    Login
  </Link>
</div>
          </div>
        </div>

        {/* Right Side - Animation */}
        <div
          className="col-md-6 d-none d-md-flex bg-light p-0"
          style={{ minHeight: "100vh" }}
        >
          <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            <Player
              autoplay
              loop
              src={loginAnimation1}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
