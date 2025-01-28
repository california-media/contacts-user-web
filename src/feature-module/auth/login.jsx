import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import Calling from "../crm/calling";

const Login = () => {
  const navigate = useNavigate();
  const route = all_routes;
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCallingComponent, setShowCallingComponent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };
  useEffect(() => {
    localStorage.setItem("menuOpened", "Dashboard");
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("clicked");
    navigate(route.dashboard);
    // const rawData = JSON.stringify({
    //   emailaddress: email,
    //   password: password,
    // });
    try {
      // console.log(rawData, "rawdata");
      console.log(email, password, "email and password data");

      const response = await fetch("https://ssdev.ae/test/api/login_api.php", {
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json",
        // },
        body: {
          emailaddress: email,
          password: password,
        },
      });
      console.log("response", response);

      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
      console.log(result, "result");

      // const access_token = result.data.access_token;
      // localStorage.setItem("access_token", access_token);
    } catch (error) {
      console.error("API call error:", error);
    }
  };

  //   useEffect(() => {
  //     if (isLoggedIn) {

  //       console.log("code run before login");

  // // {/* <Calling/> */}

  //       // setShowCallingComponent(true)
  //       console.log("code run after login");

  //       navigate(route.dealsDashboard);
  //     }
  //   }, [isLoggedIn, navigate, route.dealsDashboard]);

  // const handleLogin = () => {
  //   console.log("Login button clicked");

  //   setIsLoggedIn(true);
  // };

  // const handleLogin = async () => {
  //   console.log("Login button clicked");

  //   setIsLoggedIn(true);

  //   // Call the API after setting isLoggedIn to true
  //   // await callApiAfterLogin();
  //   navigate(route.leads);
  // };
  {
    console.log(email, "email");
  }
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
                        Sign In
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
