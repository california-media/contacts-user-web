import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import api from "../../core/axios/axiosInstance";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import PhoneInput from "react-phone-input-2";
import Slider from "react-slick";
import { Player } from "@lottiefiles/react-lottie-player";

import loginAnimation1 from "../../style/animations/loginAnimation1.json";
import loginAnimation2 from "../../style/animations/loginAnimation2.json";
import loginAnimation3 from "../../style/animations/loginAnimation3.json";

const Login = () => {
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

  const navigate = useNavigate();
  const route = all_routes;

  const [tab, setTab] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isgoogleLoading, setIsGoogleLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(0);

  const clientId =
    "401067515093-9j7faengj216m6uc9csubrmo3men1m7p.apps.googleusercontent.com";

  useEffect(() => {
    localStorage.setItem("menuOpened", "Dashboard");
    const token = localStorage.getItem("token");
    if (token) navigate(route.dashboard);
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);
  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      const payload = tab === "email" ? { email } : { phonenumber: phone };
      await api.post("/user/resendVerificationLink", payload);

      setCanResend(false);
      setTimer(60);
    } catch (error) {
      setMessage(error?.response?.data?.message || "Failed to resend OTP");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const payload =
        tab === "email"
          ? { email, password }
          : { phonenumber: phone, password };
      console.log(payload, "payloadddd");

      const response = await api.post("user/login", payload);

      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.data.token);
        setMessage(response.data.message);
        navigate(route.dashboard);
      }
    } catch (error) {
      setMessage(error?.response?.data?.message || "Login failed");
      if (error?.response?.data?.message?.toLowerCase().includes("verify")) {
        setMessage(error?.response?.data?.message);
      } else {
        setMessage(error?.response?.data?.message || "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    console.log("Google Token : ", credentialResponse.credential);

    try {
      setIsGoogleLoading(true);
      const response = await api.post("user/login", {
        googleToken: credentialResponse.credential,
      });
      console.log(response.data, "response from google");

      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.data.token);
        setMessage(response.data.message);
        setIsGoogleLoading(false);
        if (response.data.data.isFirstTime) {
          navigate("/registration-form", {
            replace: true,
            state: response.data.data,
          });
        } else {
          navigate(route.dashboard);
        }
      }
    } catch (error) {
      setMessage(error?.response?.data?.message || "Google login failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid position-relative">
        <div className="row p-0">
          <div className="col-md-6 px-5 bg-white">
            <div className="mt-5">
              <img
                src="/assets/img/contactsLogoTransparent.png"
                alt="Logo"
                height="40"
                width="150"
              />
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center vh-100">
              <div
                className="w-100 position-relative"
                style={{ maxWidth: "460px" }}
              >
                <h6 style={{ color: "grey", fontWeight: 400 }}>
                  One powerful app to grow your network and manage every
                  contact.
                </h6>
                <h2 className="fw-bold mb-4">Sign in to your account</h2>

                <form onSubmit={handleLogin}>
                  {/* <div className="d-flex justify-content-end gap-3 mb-4">
                    <button
                      type="button"
                      className={`btn ${tab === "email" ? "" : ""}
                          `}
                      style={
                        tab === "email"
                          ? { backgroundColor: "#4f7df5", color: "#fff" }
                          : { border: "1px solid #4f7df5" }
                      }
                      onClick={() => {
                        setTab("email");
                        setPhone("");
                      }}
                    >
                      Email
                    </button>

                    <button
                      type="button"
                      className={`btn ${tab === "phone" ? "" : ""}`}
                      style={
                        tab === "phone"
                          ? { backgroundColor: "#4f7df5", color: "#fff" }
                          : { border: "1px solid #4f7df5" }
                      }
                      onClick={() => {
                        setTab("phone");
                        setEmail("");
                      }}
                    >
                      Phone
                    </button>
                  </div> */}
                  {/* <div className="d-flex justify-content-end mb-4">
                    <label
                      style={{
                        position: "relative",
                        display: "inline-block",
                        width: "100px",
                        height: "40px",
                        backgroundColor: "#ccc",
                        borderRadius: "34px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={tab === "email"}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTab("email");
                            setPhone("");
                          } else {
                            setTab("phone");
                            setEmail("");
                          }
                        }}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />

                      <span
                        style={{
                          position: "absolute",
                          top: "50%",
                          transform: "translateY(-50%)",
                          left: tab === "email" ? "16px" : "auto",
                          right: tab === "email" ? "auto" : "16px",
                          fontSize: "13px",
                          fontWeight: "bold",
                          color: "#000",
                          zIndex: 2,
                          transition: "0.3s",
                          pointerEvents: "none",
                        }}
                      >
                        {tab === "email" ? "Email" : "Phone"}
                      </span>

                      <span
                        style={{
                          position: "absolute",
                          height: "32px",
                          width: "32px",
                          top: "4px",
                          left: tab === "email" ? "60px" : "7px",
                          backgroundColor: "#4f7df5",
                          borderRadius: "50%",
                          transition: "0.3s",
                          zIndex: 1,
                        }}
                      ></span>
                    </label>
                  </div> */}

<div className="d-flex justify-content-end mb-4">
  <div
    style={{
      display: "flex",
      width: "200px",
      borderRadius: "30px",
      backgroundColor: "#e0e0e0",
      position: "relative",
    }}
  >
    <input
      type="checkbox"
      checked={tab === "email"}
      onChange={(e) => {
        if (e.target.checked) {
          setTab("email");
          setPhone("");
        } else {
          setTab("phone");
          setEmail("");
        }
      }}
      style={{ opacity: 0, width: 0, height: 0 }}
    />

    {/* Background slider */}
    <div
      style={{
        position: "absolute",
        top: "2px",
        bottom: "2px",
        left: tab === "email" ? "2px" : "98px",
        width: "100px",
        borderRadius: "28px",
        backgroundColor: "#4f7df5",
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
        fontWeight: "bold",
        color: tab === "email" ? "#fff" : "#000",
        cursor: "pointer",
        borderRadius: "30px",
      }}
      onClick={() => {
        setTab("email");
        setPhone("");
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
        fontWeight: "bold",
        color: tab === "phone" ? "#fff" : "#000",
        cursor: "pointer",
        borderRadius: "30px",
      }}
      onClick={() => {
        setTab("phone");
        setEmail("");
      }}
    >
      Phone
    </div>
  </div>
</div>


                  {tab === "email" && (
                    <div className="custom-floating-label">
                      <input
                        type="email"
                        id="email"
                        value={email}
                        placeholder="john.doe@example.com"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ fontSize: 14 }}
                        required
                      />
                      <label htmlFor="email">E-mail</label>
                    </div>
                  )}
                  {tab === "phone" && (
                    <div className="mb-4">
                      <PhoneInput
                        country={"ae"}
                        value={phone}
                        onChange={(value) => setPhone("+" + value)}
                        enableSearch
                        inputProps={{ name: "phone" }}
                        inputStyle={{ background: "#fff", fontSize: 14 }}
                      />
                    </div>
                  )}

                  <div className="pass-group">
                    <div className="custom-floating-label">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="*********"
                        style={{ fontSize: 14 }}
                        required
                      />
                      <label htmlFor="password">Password</label>
                    </div>
                    <span
                      className={`ti toggle-password ${
                        isPasswordVisible ? "ti-eye" : "ti-eye-off"
                      }`}
                      onClick={togglePasswordVisibility}
                    ></span>
                  </div>
                  {message && (
                    <div className="fw-medium mb-3">
                      {message?.toLowerCase().includes("verify") ? (
                        canResend ? (
                          <>
                            {message}{" "}
                            <span
                              onClick={handleResendOTP}
                              style={{
                                cursor: "pointer",
                                color: "#1c3c8c",
                              }}
                              className="p-0 fw-bold text-decoration-none"
                            >
                              Resend Link
                            </span>
                          </>
                        ) : (
                          <>
                            {message}{" "}
                            <span className="text-muted">
                              Resend in {timer}s
                            </span>
                          </>
                        )
                      ) : (
                        message
                      )}
                    </div>
                  )}
                  <button
                    className="btn w-100 mb-4"
                    style={{ backgroundColor: "#4f7df5", color: "#fff" }}
                    type="submit"
                  >
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <div className="text-center my-3 position-relative divider-line">
                    <span className="bg-white px-2">or</span>
                  </div>

                  {/* <button className="btn btn-outline-light border w-100 d-flex align-items-center justify-content-center gap-2">
                        <img
                          src="https://developers.google.com/identity/images/g-logo.png"
                          alt="Google"
                          style={{ height: 20 }}
                        />
                        Continue with Google
                      </button> */}
                  <div className="d-flex justify-content-center mb-3 mt-4">
                    <GoogleOAuthProvider clientId={clientId}>
                      {isgoogleLoading ? (
                        <button className="btn btn-primary" disabled>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Logging in...
                        </button>
                      ) : (
                        <GoogleLogin
                          onSuccess={handleGoogleLogin}
                          onError={() => console.log("Google Login Failed")}
                        />
                      )}
                    </GoogleOAuthProvider>
                  </div>
                </form>
                <div className="text-center mt-4">
                  <small>
                    New to Contacts Managment?{" "}
                    <Link to="/register">Create a free account</Link>
                  </small>
                </div>

                {/* <p className="text-muted mt-4 small text-center">
                      By joining, you agree to our <a href="#">Terms of Use</a> and{" "}
                      <a href="#">Privacy Policy</a>
                    </p> */}
              </div>
            </div>
          </div>

          <div className="col-md-6 p-0 overflow-hidden">



            <Slider {...sliderSettings}>
              <div>
                <Player
              autoplay
              loop
              src={loginAnimation1}
            />
              </div>
              <div>
               <Player
              autoplay
              loop
              src={loginAnimation2}
            />
              </div>
              <div>
               <Player
              autoplay
              loop
              src={loginAnimation3}
            />
              </div>
            </Slider>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
