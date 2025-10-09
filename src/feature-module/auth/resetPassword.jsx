import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";

const ResetPassword = () => {
  const route = all_routes;
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
    newpassword:false
  });

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };
  useEffect(()=>{
console.log("reset password page");

  },[])
  return (
    <div className="account-content">
  <div className="d-flex flex-wrap w-100 vh-100 overflow-hidden account-bg-04">
    <div className="d-flex align-items-center justify-content-center flex-wrap vh-100 overflow-auto p-4 w-50 bg-backdrop">
      <form className="flex-fill">
        <div className="mx-auto mw-450">
          <div className="text-center mb-4">
            <ImageWithBasePath src="assets/img/logo.svg" className="img-fluid" alt="Logo" />
          </div>
          <div className="mb-4">
            <h4 className="mb-2 fs-20">Reset Password?</h4>
            <p>Enter New Password &amp; Confirm Password to get inside</p>
          </div>
          <div className="mb-3">
            <label className="col-form-label">Password</label>
            <div className="pass-group">
            <input
                    type={passwordVisibility.password ? "text" : "password"}
                    className="pass-input form-control"
                  />
                  <span
                    className={`ti toggle-passwords ${
                      passwordVisibility.password ? "ti-eye" : "ti-eye-off"
                    }`}
                    onClick={() => togglePasswordVisibility("password")}
                  ></span>
            </div>
          </div>
          <div className="mb-3">
            <label className="col-form-label">Confirm Password</label>
            <div className="pass-group">
              
              <input
                    type={passwordVisibility.confirmPassword ? "text" : "password"}
                    className="pass-input form-control"
                  />
                  <span
                    className={`ti toggle-passwords ${
                      passwordVisibility.confirmPassword ? "ti-eye" : "ti-eye-off"
                    }`}
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                  ></span>
            </div>
          </div>
          <div className="mb-3">
            <label className="col-form-label">New Confirm Password</label>
            <div className="pass-group">
              <input
                    type={passwordVisibility.newpassword ? "text" : "password"}
                    className="pass-input-new form-control"
                  />
                  <span
                    className={`ti toggle-passwords ${
                      passwordVisibility.newpassword ? "ti-eye" : "ti-eye-off"
                    }`}
                    onClick={() => togglePasswordVisibility("newpassword")}
                  ></span>
            </div>
          </div>
          <div className="mb-3">
         
            <Link to={route.leads} className="btn btn-primary w-100">
                  Change Password
                </Link>
          </div>
          <div className="mb-3 text-center">
            <h6>
              Return to{" "}
              <Link to={route.leads} className="text-purple link-hover">
                {" "}
                Login
              </Link>
            </h6>
          </div>
          <div className="text-center">
            <p className="fw-medium text-gray">Copyright © 2024 - CRMS</p>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

  );
};

export default ResetPassword;
