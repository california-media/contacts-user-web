import React from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import CollapseHeader from "../../../core/common/collapse-header";
import { SlPeople } from "react-icons/sl";
import { FaTasks } from "react-icons/fa";
const route = all_routes;
const MyScans = () => {
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
                      <h4 className="fw-semibold mb-3">My Scans</h4>
                      <div className="card mb-3">
                        <div className="card-body pb-0">
                          <ul
                            className="nav nav-tabs nav-tabs-bottom"
                            role="tablist"
                          >
                            <li className="nav-item" role="presentation">
                              <Link
                                to="#"
                                data-bs-toggle="tab"
                                data-bs-target="#myScans"
                                className="nav-link active"
                              >
                                <FaTasks className="me-2" />
                                My Scans
                              </Link>
                            </li>
                            <li className="nav-item" role="presentation">
                              <Link
                                to="#"
                                data-bs-toggle="tab"
                                data-bs-target="#scannedMe"
                                className="nav-link"
                              >
                                <SlPeople className="me-2" />
                                Scanned Me
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="tab-content pt-0">
                        <div className="tab-pane fade show active" id="myScans">
                          <div className="card">
                            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                              <h4 className="fw-semibold">My Scans</h4>
                              <div></div>
                            </div>
                          </div>
                        </div>
                        <div className="tab-pane " id="scannedMe">
                          <div className="card">
                            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                              <h4 className="fw-semibold">Scanned Me</h4>
                              <div className="d-inline-flex align-items-center"></div>
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
      {/* Delete Account */}
      <div
        className="modal custom-modal fade"
        id="delete_account"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 m-0 justify-content-end">
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <div className="success-message text-center">
                <div className="success-popup-icon">
                  <i className="ti ti-trash-x" />
                </div>
                <h3>Delete Account</h3>
                <p className="del-info">Are you sure want to delete?</p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link to={route.security} className="btn btn-danger">
                    Yes, Delete it
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Account */}
    </div>
  );
};

export default MyScans;
