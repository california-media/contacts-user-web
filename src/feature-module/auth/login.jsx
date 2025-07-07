import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import api from "../../core/axios/axiosInstance";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import PhoneInput from "react-phone-input-2";
import Slider from "react-slick";

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
      {/* <div className="account-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="d-flex flex-wrap w-100 vh-100 overflow-hidden account-bg-01">
                <div className="d-flex align-items-center justify-content-center flex-wrap vh-100 w-100 overflow-auto p-4 bg-backdrop">
                  <form className="flex-fill" onSubmit={handleLogin}>
                    <div className="mx-auto mw-450">
                      <div className="text-center mb-4">
                        <ImageWithBasePath
                          src="assets/img/logo.svg"
                          className="img-fluid"
                          alt="Logo"
                        />
                      </div>
                      <div className="d-flex justify-content-center gap-3 mb-3">
                        <button
                          type="button"
                          className={`btn ${
                            tab === "email"
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                          onClick={() => {
                            setTab("email");
                            setPhone("");
                          }}
                        >
                          Login with Email
                        </button>
                        <button
                          type="button"
                          className={`btn ${
                            tab === "phone"
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                          onClick={() => {
                            setTab("phone");
                            setEmail("");
                          }}
                        >
                          Login with Phone
                        </button>
                      </div>
                      {tab === "email" && (
                        <div className="mb-3">
                          <div className="position-relative">
                            <span className="input-icon-addon">
                              <i className="ti ti-mail"></i>
                            </span>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Enter Email Address"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      )}
                      {tab === "phone" && (
                        <div className="mb-3">
                          <div className="position-relative">
                            <span className="input-icon-addon">
                              <i className="ti ti-phone"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              required
                              placeholder="Enter phone number"
                            />

                            <PhoneInput
                              country={"ae"}
                              value={phone}
                              onChange={(value) => setPhone("+" + value)}
                              enableSearch
                              inputProps={{ name: "phone" }}
                              inputStyle={{ background: "#e9f0fd" }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="mb-3">
                        <label>Password</label>
                        <div className="pass-group">
                          <input
                            type={isPasswordVisible ? "text" : "password"}
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <span
                            className={`ti toggle-password ${
                              isPasswordVisible ? "ti-eye" : "ti-eye-off"
                            }`}
                            onClick={togglePasswordVisibility}
                          ></span>
                        </div>
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
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="form-check d-flex align-items-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="rememberMe"
                            defaultChecked
                          />
                          <label
                            className="form-check-label ms-2"
                            htmlFor="rememberMe"
                          >
                            Remember Me
                          </label>
                        </div>
                        <Link
                          to={route.leads}
                          className="text-primary fw-medium link-hover"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                      <div className="mb-3">
                        <button className="btn btn-primary w-100" type="submit">
                          {isLoading ? (
                            <span className="spinner-border spinner-border-sm me-2"></span>
                          ) : (
                            "Sign In"
                          )}
                        </button>
                      </div>
                      <div className="mb-3 text-center">
                        <h6>
                          New on our platform?
                          <Link
                            to={route.register}
                            className="text-purple ms-1 link-hover"
                          >
                            Create an account
                          </Link>
                        </h6>
                      </div>
                      <div className="form-set-login or-text mb-3 text-center">
                        <h4>OR</h4>
                      </div>
                      <div className="d-flex justify-content-center mb-3">
                        <GoogleOAuthProvider clientId={clientId}>
                          <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={() => console.log("Google Login Failed")}
                          />
                        </GoogleOAuthProvider>
                      </div>
                      <div className="d-flex justify-content-center mb-3">
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
                      <div className="text-center">
                        <p className="fw-medium text-gray">
                          © 2025 - California Media
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="position-relative">
        <div
          className="mb-4 text-start"
          style={{
            position: "absolute",
            top: "50px",
            left: "100px",
            // width: "100px",
            // height: "100px",
          }}
        >
          <img src="/assets/img/contactsLogoTransparent.png" alt="Logo" height="40" width="150"/>
        </div>
        <div className="d-flex vh-100">
          <div className="col-md-6 d-flex flex-column justify-content-center align-items-center px-5 bg-white">
            <div
              className="w-100 position-relative"
              style={{ maxWidth: "460px" }}
            >
              <h6 className="text-muted">
                One powerful app to grow your network and manage every contact.
              </h6>
              <h2 className="fw-bold mb-4">Sign in to your account</h2>

              <form onSubmit={handleLogin}>
                <div className="d-flex justify-content-center gap-3 mb-4">
                  <button
                    type="button"
                    className={`btn ${
                      tab === "email" ? "btn-primary" : "btn-outline-primary"
                    }`}
                    onClick={() => {
                      setTab("email");
                      setPhone("");
                    }}
                  >
                    Login with Email
                  </button>
                  <button
                    type="button"
                    className={`btn ${
                      tab === "phone" ? "btn-primary" : "btn-outline-primary"
                    }`}
                    onClick={() => {
                      setTab("phone");
                      setEmail("");
                    }}
                  >
                    Login with Phone
                  </button>
                </div>

                {tab === "email" && (
                  <div className="custom-floating-label">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      name="email"
                              onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <label htmlFor="email">E-mail</label>
                  </div>
                )}
                {tab === "phone" && (
                  // <div className="custom-floating-label">
                  //   <input type="email" id="email" name="email" required />
                  //   <label htmlFor="email">Phone Number</label>
                  // </div>
                  <div className="mb-4">
                    <PhoneInput
                      country={"ae"}
                      value={phone}
                      onChange={(value) => setPhone("+" + value)}
                      enableSearch
                      inputProps={{ name: "phone" }}
                      inputStyle={{ background: "#fff" }}
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
                      style={{ background: "#fff" }}
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
                          <span className="text-muted">Resend in {timer}s</span>
                        </>
                      )
                    ) : (
                      message
                    )}
                  </div>
                )}
                <button className="btn btn-primary w-100 mb-4" type="submit">
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
                  Don't have an account? <Link to="/register">Sign Up</Link>
                </small>
              </div>

              {/* <p className="text-muted mt-4 small text-center">
                By joining, you agree to our <a href="#">Terms of Use</a> and{" "}
                <a href="#">Privacy Policy</a>
              </p> */}
            </div>
          </div>

          <div className="col-md-6 p-0 overflow-hidden">
            <Slider {...sliderSettings}>
              <div>
                <img
                  src="/assets/img/postRegistration1.avif"
                  alt="Slide 1"
                  className="img-fluid vh-100 w-100 object-fit-cover"
                />
              </div>
              <div>
                <img
                  src="/assets/img/postRegistration2.avif"
                  alt="Slide 2"
                  className="img-fluid vh-100 w-100 object-fit-cover"
                />
              </div>
              <div>
                <img
                  src="/assets/img/postRegistration3.avif"
                  alt="Slide 3"
                  className="img-fluid vh-100 w-100 object-fit-cover"
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
