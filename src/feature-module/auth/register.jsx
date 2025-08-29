import React, { useEffect, useRef, useState } from "react";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import api from "../../core/axios/axiosInstance";
import { FaTasks } from "react-icons/fa";
import { SlPhone } from "react-icons/sl";
import PhoneInput from "react-phone-input-2";
import Slider from "react-slick";
import { Player } from "@lottiefiles/react-lottie-player";

import loginAnimation1 from "../../style/animations/loginAnimation1.json";
import loginAnimation2 from "../../style/animations/loginAnimation2.json";
import loginAnimation3 from "../../style/animations/loginAnimation3.json";
import {
  GoogleLogin,
  GoogleOAuthProvider,
  useGoogleLogin,
} from "@react-oauth/google";

const Register = () => {
  const route = all_routes;
  const clientId =
    "308171825690-ukpu99fsh0jsojolv0j4vrhidait4s5b.apps.googleusercontent.com";
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const sliderSettings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
  };
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("email");
  // const [otp, setOtp] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [timer, setTimer] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(true);

  const [isgoogleLoading, setIsGoogleLoading] = useState(false);

  const navigate = useNavigate();
  const otpInputs = useRef([]);
  const searchParams = new URLSearchParams(window.location.search);
  const referralCode = searchParams.get("ref");

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };
  const handleOtpChange = (element, index) => {
    const value = element.value.replace(/\D/, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

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
  const handleLinkedinLogin = async () => {
    let popup = null;

    const finish = (data) => {
      console.log(`LinkedIn finish`, data);

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      if (data?.isFirstTime) {
        navigate("/registration-form", { replace: true, state: data });
      } else {
        navigate(route.dashboard);
      }
    };

    try {
      const response = await api.get("/user/linkedin/login");
      console.log(response.data, "response from linkedin login");
      if (
        response.data?.status === "success" &&
        response.data?.data?.token &&
        typeof response.data?.data?.isFirstTime !== "undefined"
      ) {
        finish(response.data.data, "direct");
        return;
      }
      if (response.data?.status === "success" && response.data?.url) {
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const messageHandler = (event) => {
          console.log(event.data, "event from LinkedIn popup");
          const data = event.data;
          if (data?.status === "success") {
            console.log(data, "data inside the if condition");

            if (data?.data?.token) {
              localStorage.setItem("token", data.data.token);
              console.log("token saved");
            }
            console.log("inside if condition");

            if (data?.data?.isFirstTime) {
              navigate("/registration-form", { replace: true, state: data });
            } else {
              navigate(route.dashboard);
            }
            popup?.close();
            window.removeEventListener("message", messageHandler);
          }
        };

        window.addEventListener("message", messageHandler);

        popup = window.open(
          response.data.url,
          "_blank",
          `width=${width},height=${height},left=${left},top=${top}`
        );
        if (!popup) {
          console.error("Popup blocked");
          window.removeEventListener("message", messageHandler);
        }
        return;
      }

      console.error("Unexpected LinkedIn login response shape:", response.data);
    } catch (err) {
      console.error("LinkedIn Sign-In initiation failed", err);
    }
  };
  const handleGoogleLogin = async () => {
    let popup = null;

    const finish = (data) => {
      console.log(`Google finish`, data);

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      if (data?.isFirstTime) {
        navigate("/registration-form", { replace: true, state: data });
      } else {
        navigate(route.dashboard);
      }
    };

    try {
      const url = referralCode
        ? `/user/google/login?ref=${referralCode}`
        : `/user/google/login`;
      const response = await api.get(url);
      console.log(response.data, "response from google login");
      if (
        response.data?.status === "success" &&
        response.data?.data?.token &&
        typeof response.data?.data?.isFirstTime !== "undefined"
      ) {
        finish(response.data.data, "direct");
        return;
      }
      if (response.data?.status === "success" && response.data?.url) {
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const messageHandler = (event) => {
          console.log(event.data, "event from Google popup");
          const data = event.data;
          if (data?.status === "success") {
            console.log(data, "data inside the if condition");

            if (data?.data?.token) {
              localStorage.setItem("token", data.data.token);
              console.log("token saved");
            }
            console.log("inside if condition");

            if (data?.data?.isFirstTime) {
              navigate("/registration-form", { replace: true, state: data });
            } else {
              navigate(route.dashboard);
            }
            popup?.close();
            window.removeEventListener("message", messageHandler);
          }
        };

        window.addEventListener("message", messageHandler);

        popup = window.open(
          response.data.url,
          "_blank",
          `width=${width},height=${height},left=${left},top=${top}`
        );
        if (!popup) {
          console.error("Popup blocked");
          window.removeEventListener("message", messageHandler);
        }
        return;
      }

      console.error("Unexpected Google login response shape:", response.data);
    } catch (err) {
      console.error("Google Sign-In initiation failed", err);
    }
  };

  // const handleGoogleLogin = async (credentialResponse) => {
  //   console.log("Google Token : ", credentialResponse.credential);

  //   try {
  //     setIsGoogleLoading(true);
  //     const response = await api.post("user/login", {
  //       googleToken: credentialResponse.credential,
  //     });
  //     console.log(response.data, "response from google");

  //     if (response.data.status === "success") {
  //       localStorage.setItem("token", response.data.data.token);
  //       setMessage(response.data.message);
  //       setIsGoogleLoading(false);
  //       if (response.data.data.isFirstTime) {
  //         navigate("/registration-form", {
  //           replace: true,
  //           state: response.data.data,
  //         });
  //       } else {
  //         navigate(route.dashboard);
  //       }
  //     }
  //   } catch (error) {
  //     setMessage(error?.response?.data?.message || "Google login failed");
  //   } finally {
  //     setIsGoogleLoading(false);
  //   }
  // };
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
      setMessage({ text: "", type: "" });
      // const payload = {
      //   password,
      //   ...(activeTab === "phone" ? { phonenumber: phoneNumber } : { email }),
      // };
       const payload = {
      password,
      ...(activeTab === "phone" 
        ? { phonenumber: phoneNumber, apiType: "web" } 
        : { email }),
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
        const endpoint = referralCode
          ? `user/signup/phoneNumber?ref=${referralCode}`
          : "user/signup/phoneNumber";
        console.log(endpoint, "endpoint for phone number");
const registerWithMobNumberPayload ={...payload,apiType:"web"}
        const res = await api.post(endpoint, registerWithMobNumberPayload);
        setMessage({ text: res.data.message, type: "success" });
        console.log(res.data, "responseaaa");
        setTimer(60);
        setResendDisabled(true);

        setShowOtpInput(true);
      } else {
        const endpoint = referralCode
          ? `user/signup/email?ref=${referralCode}`
          : "user/signup/email";
        console.log(endpoint, "endpoint for email");
        const res = await api.post(endpoint, payload);
        setMessage({ text: res.data.message, type: "success" });
        setTimer(60);
        setResendDisabled(true);
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
      const endpoint = referralCode
        ? `user/signup/phoneNumber?ref=${referralCode}`
        : "user/signup/phoneNumber";
      console.log(endpoint, "endpoint for OTP verification");
      const response = await api.post(endpoint, {
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
    <>
      <div className="container-fluid position-relative">
        {/* <div
          className="mb-4 text-start"
          style={{
            position: "absolute",
            top: "50px",
            left: "100px",
          }}
        >
          <img
            src="/assets/img/contactsLogoTransparent.png"
            alt="Logo"
            height="40"
            width="150"
          />
        </div> */}
        <div className="row p-0">
          <div className="col-md-6 px-5 bg-white ">
            <div className="mt-5">
              <img
                src="/assets/img/contactsLogoTransparent.png"
                alt="Logo"
                height="40"
                width="150"
              />
            </div>
            <div className=" d-flex flex-column justify-content-center align-items-center vh-100">
              <div
                className="w-100 position-relative"
                style={{ maxWidth: "460px" }}
              >
                <h6 className="text-muted">
                  Get started - it's free. No credit card needed.
                </h6>
                <h2 className="fw-bold mb-5">Sign Up to Connect</h2>

                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="d-flex justify-content-end mb-4">
                    <div
                      style={{
                        display: "flex",
                        width: "200px",
                        borderRadius: "30px",
                        backgroundColor: "#ccc",
                        position: "relative",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={activeTab === "phone"}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setActiveTab("phone");
                            setMessage({ text: "", type: "" });
                            setShowOtpInput(false);
                          } else {
                            setActiveTab("email");
                            setMessage({ text: "", type: "" });
                            setShowOtpInput(false);
                          }
                        }}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />

                      {/* Sliding background */}
                      <div
                        style={{
                          position: "absolute",
                          top: "2px",
                          bottom: "2px",
                          left: activeTab === "email" ? "2px" : "98px",
                          width: "100px",
                          borderRadius: "28px",
                          backgroundColor: "#0d6efd",
                          transition: "left 0.3s ease",
                          zIndex: 1,
                        }}
                      ></div>

                      {/* Email tab */}
                      <div
                        style={{
                          flex: 1,
                          zIndex: 2,
                          textAlign: "center",
                          padding: "8px 0",
                          fontWeight: "600",
                          color: activeTab === "email" ? "#fff" : "#000",
                          cursor: "pointer",
                          borderRadius: "30px",
                          userSelect: "none",
                        }}
                        onClick={() => {
                          setActiveTab("email");
                          setMessage({ text: "", type: "" });
                          setShowOtpInput(false);
                        }}
                      >
                        Email
                      </div>

                      {/* Phone tab */}
                      <div
                        style={{
                          flex: 1,
                          zIndex: 2,
                          textAlign: "center",
                          padding: "8px 0",
                          fontWeight: "600",
                          color: activeTab === "phone" ? "#fff" : "#000",
                          cursor: "pointer",
                          borderRadius: "30px",
                          userSelect: "none",
                        }}
                        onClick={() => {
                          setActiveTab("phone");
                          setMessage({ text: "", type: "" });
                          setShowOtpInput(false);
                        }}
                      >
                        Phone
                      </div>
                    </div>
                  </div>

                  {activeTab === "email" && (
                    <div className="custom-floating-label">
                      <input
                        id="email"
                        type="email"
                        value={email}
                        style={{ fontSize: 14 }}
                        placeholder="john.doe@example.com"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <label htmlFor="email">E-mail</label>
                    </div>
                  )}
                  {activeTab === "phone" && (
                    <div className="mb-4">
                      <PhoneInput
                        country={"ae"}
                        value={phoneNumber}
                        onChange={(value) => setPhoneNumber("+" + value)}
                        enableSearch
                        inputProps={{ name: "phone" }}
                        inputStyle={{ background: "#fff", fontSize: 14 }}
                      />
                    </div>
                  )}

                  <div className="pass-group">
                    <div className="custom-floating-label">
                      <input
                        id="password"
                        type={passwordVisibility.password ? "text" : "password"}
                        className="pass-input form-control"
                        value={password}
                        placeholder="*********"
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ background: "#fff", fontSize: 14 }}
                        required
                      />
                      <label htmlFor="password">Password</label>
                    </div>
                    <span
                      className={`ti toggle-passwords ${
                        passwordVisibility.password ? "ti-eye" : "ti-eye-off"
                      }`}
                      onClick={() => togglePasswordVisibility("password")}
                    ></span>
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

                  {!showOtpInput && (
                    <div className="mb-4">
                      <button
                        onClick={handleRegister}
                        type="button"
                        style={{ background: "#4f7df5", color: "#fff" }}
                        className="btn w-100"
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
                        style={{ background: "#4f7df5", color: "#fff" }}
                        className="btn w-100 mt-2"
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
                        {resendDisabled ? `Resend in ${timer}s` : "Resend OTP"}
                      </Link>
                    </div>
                  )}

                  {/* <div className="text-center my-3 position-relative divider-line">
                    <span className="bg-white px-2">or</span>
                  </div>

                  <div className=" mt-4 d-flex justify-content-center flex-row align-items-center">
                   
                    
                         
                         
                      <div
                                           onClick={handleGoogleLogin}
                                           style={{
                                             marginRight: 10,
                                             borderRadius: "50%",
                                             width: 50,
                                             height: 50,
                                             display: "flex",
                                             justifyContent: "center",
                                             alignItems: "center",
                                             border: "1px solid #dadce0",
                                             padding: "8px",
                                             marginBottom: "10px",
                                             cursor: "pointer",
                                           }}
                                         >
                                           <ImageWithBasePath
                                             src="assets/img/icons/googleLogo.png"
                                             width={30}
                                             alt=""
                                           />
                                         </div>
                                         <div
                                           onClick={handleLinkedinLogin}
                                           style={{
                                             borderRadius: "50%",
                                             width: 50,
                                             height: 50,
                                             border: "1px solid #dadce0",
                                             padding: "12px",
                                             marginBottom: "10px",
                                             display: "flex",
                                             justifyContent: "center",
                                             alignItems: "center",
                                             cursor: "pointer",
                                           }}
                                         >
                                           <ImageWithBasePath
                                             src="assets/img/icons/linkedinIcon.png"
                                             width={30}
                                             alt=""
                                           />
                                         </div>
                                             
                                             
                   

                  </div> */}
                </form>
                <div className="text-center mt-4">
                  <small>
                    Already have an account? <Link to="/login">Sign in</Link>
                  </small>
                </div>

                <p className="text-muted mt-4 small text-center">
                  By joining, you agree to our{" "}
                  <a href="https://contacts.management/terms-conditions/">
                    Terms of Use
                  </a>{" "}
                  and{" "}
                  <a href="https://contacts.management/privacy-policy/">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 p-0 overflow-hidden d-none d-md-block">
            <Slider {...sliderSettings}>
              <div>
                <Player autoplay loop src={loginAnimation1} />
              </div>
              {/* <div>
                <Player autoplay loop src={loginAnimation2} />
              </div> */}
              {/* <div>
                <Player
                  autoplay
                  loop
                  style={{ width: "600px", height: "600px", margin: "auto" }}
                  src={loginAnimation3}
                />
              </div> */}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
