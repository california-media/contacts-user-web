import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import api from "../../core/axios/axiosInstance";
import {
  GoogleLogin,
  GoogleOAuthProvider,
  useGoogleLogin,
} from "@react-oauth/google";
import PhoneInput from "react-phone-input-2";
import Slider from "react-slick";
import { Player } from "@lottiefiles/react-lottie-player";

import loginAnimation1 from "../../style/animations/loginAnimation1.json";
import loginAnimation2 from "../../style/animations/loginAnimation2.json";
import loginAnimation3 from "../../style/animations/loginAnimation3.json";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import "react-phone-input-2/lib/style.css"; // already done ✅
import { fetchProfile } from "../../core/data/redux/slices/ProfileSlice";
import { useDispatch, useSelector } from "react-redux";

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
  const searchParams = new URLSearchParams(window.location.search);
  const referralCode = searchParams.get("ref");
  const clientId =
    "308171825690-ukpu99fsh0jsojolv0j4vrhidait4s5b.apps.googleusercontent.com";

  const {
    id,
    role,
    error: fetchUserError,
  } = useSelector((state) => state.profile); ////if id  = "" then it is default user

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Checking user authentication status", fetchUserError);
    if (token && !fetchUserError) navigate(route.dashboard);
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };
  const dispatch = useDispatch();

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

        // Store OneSignal External ID if provided by backend
        if (response.data.data.oneSignalExternalId) {
          localStorage.setItem(
            "oneSignalExternalId",
            response.data.data.oneSignalExternalId
          );
          console.log(
            "OneSignal External ID stored:",
            response.data.data.oneSignalExternalId
          );
        }

        setMessage(response.data.message);
        // fetch data before navigating
        await dispatch(fetchProfile());
        response.data.data.role === "superadmin"
          ? navigate(route.adminDashboard)
          : navigate(route.dashboard);
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
  const GoogleLoginButton = () => {
    const login = useGoogleLogin({
      onSuccess: (tokenResponse) => handleGoogleLogin(tokenResponse),
      onError: () => console.log("Google Login Failed"),
    });

    return (
      <button
        onClick={() => login()}
        className="btn"
        style={{
          border: "1px solid #dadce0",
          borderRadius: "50%",
          padding: "15px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <ImageWithBasePath
          src="assets/img/icons/googleLogo.png"
          width={20}
          height={20}
        />
      </button>
    );
  };
  // const GoogleLoginButton = ({ onSuccess }) => {
  //   const login = useGoogleLogin({
  //     onSuccess,
  //     onError: (err) => console.log("Google Login Failed", err),
  //   });

  //   return (
  //     <button
  //       onClick={() => login()}
  //       className="d-flex align-items-center justify-content-center"
  //       style={{
  //         width: 40,
  //         height: 40,
  //         borderRadius: "50%",
  //         border: "1px solid #dadce0",
  //         background: "#fff",
  //         cursor: "pointer",
  //       }}
  //     >
  //       <img
  //         src="https://developers.google.com/identity/images/g-logo.png"
  //         alt="Google"
  //         width={18}
  //         height={18}
  //       />
  //     </button>
  //   );
  // };
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
      const url = referralCode
        ? `/user/linkedin/login?ref=${referralCode}`
        : `/user/linkedin/login`;
      console.log("url for linkedin login", url);

      const response = await api.get(url);
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
      console.log("url for google login", url);
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

  return (
    <>
      <div className="container-fluid position-relative">
        <div className="row p-0">
          <div className="col-md-6 px-5 bg-white">
            <div className="pt-5">
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
                  {/* <div className="d-flex justify-content-center mb-3 mt-4">
                    <GoogleOAuthProvider clientId={clientId}>
                      {isgoogleLoading ? (
                        <button
                          className="btn"
                          style={{ background: "#4f7df5", color: "#fff" }}
                          disabled
                        >
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
                  <div className="d-flex justify-content-center">
                    <Link
                      onClick={handleLinkedinLogin}
                      className="d-inline-flex align-items-center p-2"
                      style={{ border: "1px solid #dadce0", borderRadius: 5 }}
                    >
                      <div className="me-2">
                        <ImageWithBasePath
                          src="assets/img/icons/linkedinIcon.png"
                          alt="link"
                          width={18}
                          height={18}
                        />
                      </div>
                      <p className="mb-0">Sign in with Linkedin</p>
                    </Link>
                  </div> */}
                </form>
                <div className="text-center mt-4">
                  <small>
                    New to Contacts Managment?{" "}
                    <Link to="/register">Create a free account</Link>
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 login-slider d-none d-md-block">
            <Slider {...sliderSettings}>
              <div>
                <Player
                  className="lottie-player"
                  autoplay
                  loop
                  src={loginAnimation1}
                />
              </div>
              {/* <div>
                <Player className="lottie-player" autoplay loop src={loginAnimation2} />
              </div> */}
              {/* <div>
                <Player style={{ width: "500px", height:"500px", margin: "auto" }} autoplay loop src={loginAnimation3} />
              </div> */}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
