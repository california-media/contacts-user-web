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
                          <Link to={route.emailSetup} className="fw-medium">
                            Connected Mails
                          </Link>
                          <Link to={route.myScans} className="fw-medium">
                            My Scans
                          </Link>
                          <Link to={route.upgradePlan} className="fw-medium active">
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
                        <div className="col-lg-3 col-md-6 mb-4">
                          <div className="card custom-card border">
                            <div className="card-body">
                              <div className="text-center border-bottom pb-3 mb-3">
                                <span>Starter</span>
                                <h4 className="d-flex align-items-end justify-content-center fw-bold mt-1">
                                  FREE
                                  {/* <span className="fs-14 fw-medium ms-2">
                                    / month
                                  </span> */}
                                </h4>
                                <span>
                                  Perfect for Individual users trying out
                                  digital Networking
                                </span>
                              </div>
                              <div className="d-block">
                                <div>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className="mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    1 Digital Card
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className="mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Profile Short URL
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className="mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Unlimited QR Scans
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className="mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Reminders + Notes + Calendar Integration
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className="mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Scan up to 10 business cards/month
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className="mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    QR Sharing + Link Sharing
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className="mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Email & Whatsapp
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className="mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Limited Template Access
                                  </p>
                                  {/* <p className="d-flex align-items-center fs-16 fw-medium text-dark mb-2">
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
                                  </p> */}
                                </div>
                              </div>
                            </div>
                            <div className="text-center mb-3">
                              <Link to="#" className="btn btn-primary">
                                Choose
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-4">
                          <div className="card custom-card border">
                            <div className="card-body">
                              <div className="text-center border-bottom pb-3 mb-3">
                                <span>Pro</span>
                                <h4 className="d-flex align-items-end justify-content-center fw-bold mt-1">
                                  AED 9.99
                                  <span className="fs-14 fw-medium ms-2">
                                    / month
                                  </span>
                                </h4>
                                <span>
                                  Best for Professional who Network daily.
                                </span>
                              </div>
                              <div className="d-block">
                                <div>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className="mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Everything in starter
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className="mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    5 Digital Cards
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className="mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Unlimited Contacts
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className="mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    AI Template Suggestions (Email/WhatsApp)
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className="mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Unlimited Scan business cards/month
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className="mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Contact Requests & Tagging
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className="mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Reminders + Notes + Calendar Integration
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className="mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Export CSV/VCF
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className="mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Priority support
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="text-center mb-3">
                              <Link to="#" className="btn btn-primary">
                                Choose
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-4">
                          <div className="card custom-card border">
                            <div className="card-body">
                              <div className="text-center border-bottom pb-3 mb-3">
                                <span>Business</span>
                                <h4 className="d-flex align-items-end justify-content-center fw-bold mt-1">
                                  AED 49.99
                                  <span className="fs-14 fw-medium ms-2">
                                    / month
                                  </span>
                                </h4>
                                <span>For Large Teams & Corporates</span>
                              </div>
                              <div className="d-block">
                                <div>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className="mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Everything in Pro
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className="mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Advance Integrations ( Zapier, CRM, APP)
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className="mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Data Compliance (GDPR / ISO)
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className="mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    SLA / UPTIME GUARANTEE
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className="mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Account Manager
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="text-center mb-3">
                              <Link to="#" className="btn btn-primary">
                                Choose
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-4">
                          <div className="card custom-card border">
                            <div className="card-body">
                              <div className="text-center border-bottom pb-3 mb-3">
                                <span>Enterprise</span>
                                <h4 className="d-flex align-items-end justify-content-center fw-bold mt-1">
                                  Custom Pricing
                                </h4>
                                <span>
                                  For Large Teams, Event Organizers & Corporate
                                </span>
                              </div>
                              <div className="d-block">
                                <div>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className=" mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    White-Label Solution
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className=" mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Advance Integrations ( Zapier, CRM, APP)
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className=" mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Dedicated Account
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className=" mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    NFC Card Integration & Bulk Orders
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className=" mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Data Compliance (GDPR / ISO)
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className=" mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    SLA / UPTIME GUARANTEE
                                  </p>
                                  <p className="d-flex fs-14 fw-medium text-dark mb-2">
                                    <span className=" mt-1 bg-success d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded">
                                      <i className="ti ti-check" />
                                    </span>
                                    Dedicated Account Manager
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="text-center mb-3">
                              <Link to="#" className="btn btn-primary">
                                Choose
                              </Link>
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
    </>
  );
};

export default UpgradePlan;
