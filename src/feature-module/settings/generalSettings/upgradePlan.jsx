import React from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { all_routes } from "../../router/all_routes";
import CollapseHeader from "../../../core/common/collapse-header";

const UpgradePlan = () => {
  const route = all_routes;
  return (
    <>
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
                    <div className="card-body pb-0">
                      <h4 className="fw-semibold mb-3">Upgrade Plan</h4>
                      <div className="row justify-content-center">
                        <div className="col-lg-4 col-md-6">
                          <div className="card border">
                            <div className="card-body">
                              <div className="text-center border-bottom pb-3 mb-3">
                                <span>Basic</span>
                                <h2 className="d-flex align-items-end justify-content-center mt-1">
                                 FREE
                                  {/* <span className="fs-14 fw-medium ms-2">
                                    / month
                                  </span> */}
                                </h2>
                              </div>
                              <div className="d-block">
                                <div>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark mb-2">
                                    <span className="bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    10 Contacts
                                  </p>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark mb-2">
                                    <span className="bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    10 Leads
                                  </p>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark mb-2">
                                    <span className="bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    20 Companies
                                  </p>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark mb-2">
                                    <span className="bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    50 Compaigns
                                  </p>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark mb-2">
                                    <span className="bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    100 Projects
                                  </p>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark mb-2">
                                    <span className="bg-danger d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-x" />
                                    </span>
                                    Deals
                                  </p>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark mb-2">
                                    <span className="bg-danger d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-x" />
                                    </span>
                                    Tasks
                                  </p>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark">
                                    <span className="bg-danger d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-x" />
                                    </span>
                                    Pipelines
                                  </p>
                                </div>
                                <div className="text-center mt-3">
                                  <Link to="#" className="btn btn-primary">
                                    Choose
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="card border">
                            <div className="card-body">
                              <div className="text-center border-bottom pb-3 mb-3">
                                <span>Enterprise</span>
                                <h2 className="d-flex align-items-end justify-content-center mt-1">
                                  AED 200
                                  <span className="fs-14 fw-medium ms-2">
                                    / month
                                  </span>
                                </h2>
                              </div>
                              <div className="d-block">
                                <div>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark mb-2">
                                    <span className="bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    20 Contacts
                                  </p>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark mb-2">
                                    <span className="bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    20 Leads
                                  </p>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark mb-2">
                                    <span className="bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    50 Companies
                                  </p>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark mb-2">
                                    <span className="bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Unlimited Compaigns
                                  </p>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark mb-2">
                                    <span className="bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Unlimited Projects
                                  </p>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark mb-2">
                                    <span className="bg-danger d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-x" />
                                    </span>
                                    Deals
                                  </p>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark mb-2">
                                    <span className="bg-danger d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-x" />
                                    </span>
                                    Tasks
                                  </p>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark">
                                    <span className="bg-danger d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-x" />
                                    </span>
                                    Pipelines
                                  </p>
                                </div>
                                <div className="text-center mt-3">
                                  <Link to="#" className="btn btn-primary">
                                    Choose
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="col-lg-4 col-md-6">
                          <div className="card border">
                            <div className="card-body">
                              <div className="text-center border-bottom pb-3 mb-3">
                                <span>Enterprise</span>
                                <h2 className="d-flex align-items-end justify-content-center mt-1">
                                  $400
                                  <span className="fs-14 fw-medium ms-2">
                                    / month
                                  </span>
                                </h2>
                              </div>
                              <div className="d-block">
                                <div>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark mb-2">
                                    <span className="bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Unlimited Contacts
                                  </p>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark mb-2">
                                    <span className="bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Unlimited Leads
                                  </p>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark mb-2">
                                    <span className="bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Unlimited Companies
                                  </p>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark mb-2">
                                    <span className="bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Unlimited Compaigns
                                  </p>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark mb-2">
                                    <span className="bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Unlimited Projects
                                  </p>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark mb-2">
                                    <span className="bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Deals
                                  </p>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark mb-2">
                                    <span className="bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Tasks
                                  </p>
                                  <p className="d-flex align-items-center fs-16 fw-medium text-dark">
                                    <span className="bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Pipelines
                                  </p>
                                </div>
                                <div className="text-center mt-3">
                                  <Link to="#" className="btn btn-primary">
                                    Choose
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div> */}
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
    </>
  );
};

export default UpgradePlan;
