import React, { useEffect, useRef, useState } from "react";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import api from "../../core/axios/axiosInstance";
import { FaTasks } from "react-icons/fa";
import { SlPhone } from "react-icons/sl";
import PhoneInput from "react-phone-input-2";

const Register = () => {
  const route = all_routes;
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("email");
  // const [otp, setOtp] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [timer, setTimer] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(true);

  const navigate = useNavigate();
  const otpInputs = useRef([]);

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };
  const handleOtpChange = (element, index) => {
    const value = element.value.replace(/\D/, ""); // Only digits
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if available
    if (index < 5 && otpInputs.current[index + 1]) {
      otpInputs.current[index + 1].focus();
    }
  };
  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      handleVerifyOtp(otp.join(""));
    }
  }, [otp]);
  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        otpInputs.current[index - 1].focus();
      }
    }
  };
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = async () => {
    try {
      // setIsLoading(true);
      setMessage({ text: "", type: "" });
      const payload = {
        password,
        ...(activeTab === "phone" ? { phonenumber: phoneNumber } : { email }),
      };
      const res = await api.post(
        activeTab === "phone" ? "user/signup/phoneNumber" : "user/signup/email",
        payload
      );
      setMessage({ text: "OTP resent successfully", type: "success" });
      setTimer(60);
      setResendDisabled(true);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to resend OTP",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!password) {
      setMessage({ text: "Password is required", type: "error" });
      return;
    }

    if (activeTab === "phone") {
      const isPhone = /^\+[0-9]{10,15}$/.test(phoneNumber);
      if (!isPhone) {
        setMessage({ text: "Invalid phone number", type: "error" });
        return;
      }
    }

    if (activeTab === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setMessage({ text: "Invalid email address", type: "error" });
        return;
      }
    }

    try {
      setIsLoading(true);
      const payload = {
        password,
        ...(activeTab === "phone" ? { phonenumber: phoneNumber } : { email }),
      };

      if (activeTab === "phone") {
        const res = await api.post("user/signup/phoneNumber", payload);
        setMessage({ text: res.data.message, type: "success" });
        console.log(res.data, "responseaaa");
        setTimer(60);
        setResendDisabled(true);

        // Show OTP input
        setShowOtpInput(true);
        // setSignupSuccessData(res.data); // Store any useful info like userId or tempToken
      } else {
        const res = await api.post("user/signup/email", payload);
        setMessage({ text: res.data.message, type: "success" });
        setTimer(60);
        setResendDisabled(true);
        // Show OTP input
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Registration failed",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleVerifyOtp = async (finalOtp) => {
    if (!otp) {
      setMessage({ text: "Please enter OTP", type: "error" });
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.post("user/signup/phoneNumber", {
        phonenumber: phoneNumber,
        password,
        otp: finalOtp,
      });
      if (response.data.data.token) {
        localStorage.setItem("token", response.data.data.token);
        navigate("/registration-form", {
          replace: true,
          state: response.data.data,
        });
      }
      setMessage({ text: response.data.message, type: "success" });
      // navigate(route.login);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "OTP verification failed",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="account-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 p-0">
            <div className="d-flex flex-wrap w-100 vh-100 overflow-hidden account-bg-02">
              <div className="d-flex align-items-center justify-content-center flex-wrap vh-100 overflow-auto p-4 w-100 bg-backdrop">
                <form
                  className="flex-fill"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="mx-auto mw-450">
                    <div className="text-center mb-4">
                      <ImageWithBasePath
                        src="assets/img/logo.svg"
                        className="img-fluid"
                        alt="Logo"
                      />
                    </div>

                    <div className="mb-3 d-flex justify-content-center gap-3">
                      <button
                        type="button"
                        className={`btn ${
                          activeTab === "email"
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => {
                          setActiveTab("email");
                          setMessage({ text: "", type: "" });
                          setShowOtpInput(false);
                        }}
                      >
                        Register with Email
                      </button>
                      <button
                        type="button"
                        className={`btn ${
                          activeTab === "phone"
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => {
                          setActiveTab("phone");
                          setMessage({ text: "", type: "" });
                        }}
                      >
                        Register with Phone
                      </button>
                    </div>

                    {activeTab === "email" && (
                      <div className="mb-3">
                        <div className="position-relative">
                          <span className="input-icon-addon">
                            <i className="ti ti-mail"></i>
                          </span>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            placeholder="Enter email"
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === "phone" && (
                      <div className="mb-3">
                        <PhoneInput
                          country={"ae"}
                          value={phoneNumber}
                          onChange={(value) => setPhoneNumber("+" + value)}
                          enableSearch
                          inputProps={{ name: "phone" }}
                          inputStyle={{ background: "#e9f0fd" }}
                        />
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="col-form-label">Password</label>
                      <div className="pass-group">
                        <input
                          type={
                            passwordVisibility.password ? "text" : "password"
                          }
                          className="pass-input form-control"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                          className={`ti toggle-passwords ${
                            passwordVisibility.password
                              ? "ti-eye"
                              : "ti-eye-off"
                          }`}
                          onClick={() => togglePasswordVisibility("password")}
                        ></span>
                      </div>
                    </div>
                    {showOtpInput && (
                      <div
                        className="d-flex justify-content-between mb-3"
                        style={{ gap: "10px" }}
                      >
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            type="text"
                            maxLength="1"
                            className="form-control text-center"
                            style={{
                              width: "40px",
                              fontSize: "18px",
                              fontWeight: "bold",
                            }}
                            value={digit}
                            onChange={(e) => handleOtpChange(e.target, index)}
                            onKeyDown={(e) => handleOtpKeyDown(e, index)}
                            ref={(el) => (otpInputs.current[index] = el)}
                          />
                        ))}
                      </div>
                    )}
                    {message.text && (
                      <p
                        className={`fw-medium ${
                          message.type === "success"
                            ? "text-success"
                            : "text-danger"
                        }`}
                      >
                        {message.text}
                      </p>
                    )}
                    <p>
                      By signing up, you agree to our{" "}
                      <Link to="" className="fw-bold">
                        Terms of Use{" "}
                      </Link>
                      and{" "}
                      <Link to="" className="fw-bold">
                        Privacy Policy
                      </Link>
                    </p>
                    {!showOtpInput && (
                      <div className="mb-3">
                        <button
                          onClick={handleRegister}
                          type="button"
                          className="btn btn-primary w-100"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            "Sign Up"
                          )}
                        </button>
                      </div>
                    )}
                    {showOtpInput && (
                      <div className="mb-3">
                        <button
                          onClick={handleVerifyOtp}
                          type="button"
                          className="btn btn-primary w-100 mt-2"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            "Verify OTP"
                          )}
                        </button>
                      </div>
                    )}
                    {showOtpInput && (
                      <div className="mb-3 d-flex align-items-center justify-content-between">
                        <Link
                          to=""
                          onClick={(e) => {
                            e.preventDefault();
                            if (!resendDisabled) {
                              handleResendOtp();
                            }
                          }}
                          type="button"
                          className="text-primary text-decoration-underline fw-bold p-0"
                          disabled={resendDisabled}
                        >
                          {resendDisabled
                            ? `Resend in ${timer}s`
                            : "Resend OTP"}
                        </Link>
                      </div>
                    )}

                    <div className="mb-3">
                      <h6>
                        Already have an account?{" "}
                        <Link
                          to={route.login}
                          className="text-purple link-hover"
                        >
                          Sign In
                        </Link>
                      </h6>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
