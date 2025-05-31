import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import CollapseHeader from "../../../core/common/collapse-header";
import { SlPeople } from "react-icons/sl";
import { FaTasks } from "react-icons/fa";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { GoogleAuthContext } from "../../../core/common/context/GoogleAuthContext";
const route = all_routes;
const EmailSetup = () => {
  const { isGoogleSignedIn, googleSignIn, googleSignOut } = useContext(GoogleAuthContext);
  console.log(isGoogleSignedIn, googleSignIn, googleSignOut,"isGoogleSignedIn, googleSignIn, googleSignOut");
  
  const handleGoogleToggle = () => {
    if (isGoogleSignedIn) {
      googleSignOut();
    } else {
      
      googleSignIn();
    }
  };

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-xl-3 col-lg-12 theiaStickySidebar">
                  {/* Settings Sidebar */}
                  <div className="card">
                    <div className="card-body">
                      <div className="settings-sidebar">
                        <h4 className="fw-semibold mb-3">Settings</h4>
                        <div className="list-group list-group-flush settings-sidebar">
                          <Link to={route.profile} className="fw-medium">
                            Profile
                          </Link>
                          <Link to={route.security} className="fw-medium">
                            Security
                          </Link>
                          <Link to={route.emailSetup} className="fw-medium">
                            Connected Mails
                          </Link>
                          <Link to={route.myScans} className="fw-medium">
                            My Scans
                          </Link>
                          <Link to={route.upgradePlan} className="fw-medium">
                            Upgrade Plan
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Settings Sidebar */}
                </div>
                <div className="col-xl-9 col-lg-12">
                  {/* Settings Info */}
                  <div className="card">
                    <div className="card-body">
                      <h4 className="fw-semibold mb-3">Connected Emails</h4>
                      <div className="card mb-3">
                        <div className="row">
                          <div className="col-md-4 col-sm-6">
                            <div className="card border mb-3">
                              <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                  <ImageWithBasePath
                                    src="assets/img/icons/googleLogo.png"
                                    width={50}
                                    alt="Icon"
                                  />
                                  <div className="connect-btn">
                                    <Link
                                      to="#"
                                      className="badge badge-soft-success"
                                    >
                                      {isGoogleSignedIn
                                        ? "Connected"
                                        : "Not Connected"}
                                    </Link>
                                  </div>
                                </div>

                                <div className="d-flex align-items-center justify-content-between">
                                  <p className="mb-0">Google Account</p>
                                  <div className="form-check form-switch">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      role="switch"
                                      checked={isGoogleSignedIn}
                                      onChange={handleGoogleToggle}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4 col-sm-6">
                            <div className="card border mb-3">
                              <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                  <ImageWithBasePath
                                    src="assets/img/icons/microsoftLogo.png"
                                    width={50}
                                    alt="Icon"
                                  />
                                  <div className="connect-btn">
                                    <Link
                                      to="#"
                                      className="badge border bg-white text-default"
                                    >
                                      Connect
                                    </Link>
                                  </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                  <p className="mb-0">Microsoft</p>
                                  <div className="form-check form-switch">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      role="switch"
                                      // defaultChecked
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Settings Info */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
    </div>
  );
};

export default EmailSetup;
