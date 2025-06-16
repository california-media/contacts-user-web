import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import api from "../../core/axios/axiosInstance";
import { RecaptchaVerifier,signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../core/utils/firebase";

const Register = () => {
  const route = all_routes;
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();
  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };
  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   setMessage({ text: "", type: "" });
  //   setIsLoading(true);

  //   try {
  //     const response = await api.post("user/signup", { userInput, password });

  //     if (response.data.status === "success") {
  //       setMessage({ text: response.data.message, type: "success" });
  //       setIsLoading(false);
  //     }
  //   } catch (error) {
  //     setMessage({ text: error.response.data.message, type: "error" });
  //     setIsLoading(false);
  //   }
  // };


  const handleRegister = async (e) => {
  e.preventDefault();
  setMessage({ text: "", type: "" });
  setIsLoading(true);

  const isPhone = /^\+?[0-9]{10,15}$/.test(userInput); // Simple phone validation

  if (isPhone) {
    // Phone number path - use Firebase OTP
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
          callback: () => {},
        });
      }

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        userInput,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmationResult;
      setMessage({ text: "OTP sent successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setMessage({ text: err.message, type: "error" });
    } finally {
      setIsLoading(false);
    }

  } else {
    // Email path - just show "Coming soon" or skip
    setMessage({ text: "Email registration is not supported yet.", type: "error" });
    setIsLoading(false);
  }
};


  //   useEffect(() => {
  //   window.recaptchaVerifier = new RecaptchaVerifier(
  //     auth,
  //     "recaptcha-container",
  //     {
  //       size: "invisible",
  //       callback: (response) => {},
  //       "expired-callback": () => {
  //         // Token expired, maybe notify user or reinit
  //       },
  //     }
  //   );

  //   return () => {
  //     if (window.recaptchaVerifier) {
  //       window.recaptchaVerifier.clear();
  //       delete window.recaptchaVerifier;
  //     }
  //   };
  // }, []);
  return (
    <div className="account-content">
      <div className="container-fluid">
        <div className="row">
          <div id="recaptcha-container" />
          <div className="col-md-12 p-0">
            <div className="d-flex flex-wrap w-100 vh-100 overflow-hidden account-bg-02">
              <div className="d-flex align-items-center justify-content-center flex-wrap vh-100 overflow-auto p-4 w-100 bg-backdrop">
                <form className="flex-fill">
                  <div className="mx-auto mw-450">
                    <div className="text-center mb-4">
                      <ImageWithBasePath
                        src="assets/img/logo.svg"
                        className="img-fluid"
                        alt="Logo"
                      />
                    </div>
                    <div className="mb-4">
                      <h4 className="mb-2 fs-20">Register</h4>
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">Email / Phone number</label>
                      <div className="position-relative">
                        <span className="input-icon-addon">
                          <i className="ti ti-user" />
                        </span>
                        <input
                          type="text"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          required
                          className="form-control"
                        />
                      </div>
                    </div>
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
                          required
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
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="form-check form-check-md d-flex align-items-center">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue=""
                          id="checkebox-md"
                          defaultChecked
                        />
                        <label
                          className="form-check-label"
                          htmlFor="checkebox-md"
                        >
                          I agree to the{" "}
                          <Link to="#" className="text-primary link-hover">
                            Terms &amp; Privacy
                          </Link>
                        </label>
                      </div>
                    </div>
                    <div className="mb-3">
                      <button
                        onClick={handleRegister}
                        // to={route.login}
                        className="btn btn-primary w-100"
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
                    <div className="mb-3">
                      <h6>
                        Already have an account?{" "}
                        <Link
                          to={route.login}
                          className="text-purple link-hover"
                        >
                          {" "}
                          Sign In Instead
                        </Link>
                      </h6>
                    </div>
                    {/* <div className="form-set-login or-text mb-3">
                      <h4>OR</h4>
                    </div>
                    <div className="d-flex align-items-center justify-content-center flex-wrap mb-3">
                      <div className="text-center me-2 flex-fill">
                        <Link
                          to="#"
                          className="br-10 p-2 px-4 btn bg-white d-flex align-items-center justify-content-center"
                        >
                          <ImageWithBasePath
                            className="img-fluid  m-1"
                            src="assets/img/icons/google-logo.svg"
                            alt="Google"
                          />
                        </Link>
                      </div>
                    </div> */}
                    {/* <div className="text-center">
                      <p className="fw-medium text-gray">
                        Copyright © 2025 - California Media
                      </p>
                    </div> */}
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
