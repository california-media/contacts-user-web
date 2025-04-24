import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import Calling from "../crm/calling";
import axios from "axios";
import api from "../../core/axios/axiosInstance";

const Login = () => {
  const navigate = useNavigate();
  const route = all_routes;
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showCallingComponent, setShowCallingComponent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };
  useEffect(() => {
    localStorage.setItem("menuOpened", "Dashboard");
  }, []);
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   console.log("clicked");

  //   try {

  //     console.log(email, password, "email and password data");

  //     const response = await fetch(
  //       "https://100rjobf76.execute-api.eu-north-1.amazonaws.com/user/login",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ email, password }),
  //       }
  //     );
  //     console.log(response, "response");
  //     if (!response.ok) {
  //       console.log("Network response was not ok");
  //       return;

  //     }

  //     else {
  //       const result = await response.json();
  //       console.log(result, "resulttt");
  //       navigate(route.dashboard);
  //     }
  //   } catch (error) {
  //     console.error("API call error:", error);
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({text:"",type:""})
    setIsLoading(true)

    try {
      console.log(email, password, "email and password data");

      const response = await api.post("user/login", { email, password });

      if (response.data.status === "success") {
        localStorage.setItem("token",response.data.data.token)
        console.log(response.data.data,"data");
        
        setMessage({text:response.data.message, type:"success"});
        navigate(route.dashboard);
        setIsLoading(false)
      }
    } catch (error) {
      setMessage({text:error.response.data.message, type:"error"});
      setIsLoading(false)
    }
  };

  return (
    <div className="account-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="d-flex flex-wrap w-100 vh-100 overflow-hidden account-bg-01">
              <div className="d-flex align-items-center justify-content-center flex-wrap vh-100 w-100 overflow-auto p-4 bg-backdrop">
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
                      <h4>Sign In</h4>
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">Email Address</label>
                      <div className="position-relative">
                        <span className="input-icon-addon">
                          <i className="ti ti-mail"></i>
                        </span>
                        <input
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">Password</label>
                      <div className="pass-group">
                        <input
                          type={isPasswordVisible ? "text" : "password"}
                          className="pass-input form-control"
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
                          value=""
                          id="checkebox-md"
                          defaultChecked
                        />
                        <label
                          className="form-check-label"
                          htmlFor="checkebox-md"
                        >
                          Remember Me
                        </label>
                      </div>
                      <div className="text-end">
                        <Link
                          to={route.leads}
                          className="text-primary fw-medium link-hover"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                    </div>
                    <div className="mb-3">
                      <button
                        // to={route.dealsDashboard}
                        onClick={handleLogin}
                        className="btn btn-primary w-100"
                      >
                        {isLoading ? (
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          "Sign In"
                        )}
                      </button>
                    </div>
                    <div className="mb-3">
                      <h6>
                        New on our platform?
                        <Link
                          to={route.register}
                          className="text-purple link-hover"
                        >
                          {" "}
                          Create an account
                        </Link>
                      </h6>
                    </div>
                    <div className="form-set-login or-text mb-3">
                      <h4>OR</h4>
                    </div>
                    <>
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
                      </div>
                      <div className="text-center">
                        <p className="fw-medium text-gray">
                          Copyright © 2025 - California Media
                        </p>
                      </div>
                    </>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* <div className="col-md-6">
          <ImageWithBasePath
                        src="assets/img/loginImage.jpg"
                        className="img-fluid"
                        alt="Login"
                      />
          </div> */}
        </div>
      </div>

      {/* {showCallingComponent && <Calling />} */}
    </div>
  );
};

export default Login;
