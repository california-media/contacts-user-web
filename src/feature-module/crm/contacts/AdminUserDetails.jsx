import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { CiEdit } from "react-icons/ci";
import UserOffcanvas from "../../../core/common/offCanvas/admin-user/UserOffcanvas";
import AvatarInitialStyles from "../../../core/common/nameInitialStyles/AvatarInitialStyles";
import api from "../../../core/axios/axiosInstance";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import LoadingIndicator2 from "../../../core/common/loadingIndicator/LoadingIndicator2";

dayjs.extend(isToday);
dayjs.extend(localizedFormat);

const AdminUserDetails = () => {
  const location = useLocation();
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);
  // Get user ID from query parameters
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("u");

  // Fetch user details
  const fetchUserDetails = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await api.get(`/admin/users/${userId}`);
      if (response.data.status === "success") {
        setUserInfo(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "50vh" }}
          >
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      {/* User Sidebar */}
      <UserOffcanvas
        selectedUser={userInfo}
        setUserInfo={setUserInfo}
        loading={loading}
        setLoading={setLoading}
      />
      {/* Page Wrapper */}
      <div className="page-wrapper">
        {loading ? (
          <LoadingIndicator2 />
        ) : (
          <div className="content">
            <div className="row">
              <div className="col-md-12">
                {/* User Header */}
                <div className="contact-head">
                  <div className="row align-items-center">
                    <div className="col-sm-6">
                      <ul className="contact-breadcrumb">
                        <li>
                          <Link to="/admin/users">
                            <i className="ti ti-arrow-narrow-left" />
                            Users
                          </Link>
                        </li>
                        <li>
                          {userInfo?.firstname || userInfo?.email || "No info"}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 theiaStickySidebar">
                <div className="card">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0 fw-semibold">User Information</h6>
                      <Link
                        to="#"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#user_offcanvas"
                      >
                        <CiEdit size={20} />
                      </Link>
                    </div>
                    <div style={{ display: "flex" }}>
                      <div className="profilePic">
                        {userInfo?.profileImageURL ? (
                          <img
                            src={userInfo?.profileImageURL}
                            className="profilePic"
                            id="profileImage"
                            alt="Profile"
                          />
                        ) : (
                          <AvatarInitialStyles
                            name={`${userInfo?.firstname || ""} ${
                              userInfo?.lastname || ""
                            }`}
                          />
                        )}
                      </div>
                    </div>

                    <div className="px-2 mb-4 d-flex flex-wrap gap-3 justify-content-start">
                      <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip id="tooltip-phone">
                            {userInfo?.phonenumbers?.length
                              ? "Call User"
                              : "Phone number not available"}
                          </Tooltip>
                        }
                      >
                        <span>
                          <a
                            href={
                              userInfo?.phonenumbers?.[0]
                                ? `tel:${userInfo?.phonenumbers[0].countryCode}${userInfo?.phonenumbers[0].number}`
                                : undefined
                            }
                            className={`icon-wrapper-sm phone ${
                              !userInfo?.phonenumbers?.length
                                ? "disabled-icon"
                                : ""
                            }`}
                            onClick={(e) => {
                              if (!userInfo?.phonenumbers?.length)
                                e.preventDefault();
                            }}
                          >
                            <img
                              src="/assets/img/icons/phoneCallIcon.png"
                              alt="Phone"
                            />
                          </a>
                        </span>
                      </OverlayTrigger>

                      <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip id="tooltip-email">
                            {userInfo?.email
                              ? "Send Email"
                              : "Email not available"}
                          </Tooltip>
                        }
                      >
                        <span>
                          <Link
                            to="#"
                            className={`icon-wrapper-sm mail ${
                              !userInfo?.email ? "disabled-icon" : ""
                            }`}
                            onClick={(e) => {
                              if (!userInfo?.email) e.preventDefault();
                            }}
                          >
                            <img
                              src="/assets/img/icons/mailIcon.png"
                              alt="Mail"
                            />
                          </Link>
                        </span>
                      </OverlayTrigger>

                      {/* Social Media Icons */}
                      {[
                        "instagram",
                        "twitter",
                        "linkedin",
                        "facebook",
                        "telegram",
                      ].map((platform) => {
                        const platformLabel =
                          platform.charAt(0).toUpperCase() + platform.slice(1);
                        const isActive = !!userInfo?.[platform];
                        const tooltipText = isActive
                          ? `Open ${platformLabel}`
                          : `Search on ${platformLabel}`;
                        const fullName = `${userInfo?.firstname || ""} ${
                          userInfo?.lastname || ""
                        }`.trim();

                        const searchUrls = {
                          instagram: `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(
                            fullName
                          )}`,
                          twitter: `https://twitter.com/search?q=${encodeURIComponent(
                            fullName
                          )}`,
                          linkedin: `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(
                            fullName
                          )}`,
                          facebook: `https://www.facebook.com/search/top?q=${encodeURIComponent(
                            fullName
                          )}`,
                          telegram: `https://t.me/s/${encodeURIComponent(
                            fullName.replace(/\s+/g, "_")
                          )}`,
                        };

                        const handleSocialClick = () => {
                          if (isActive) {
                            window.open(userInfo[platform], "_blank");
                          } else if (fullName) {
                            window.open(searchUrls[platform], "_blank");
                          }
                        };

                        return (
                          <OverlayTrigger
                            key={platform}
                            placement="bottom"
                            overlay={
                              <Tooltip id={`tooltip-${platform}`}>
                                {tooltipText}
                              </Tooltip>
                            }
                          >
                            <span>
                              <div
                                className={`icon-wrapper-sm ${platform} no-filter ${
                                  !isActive ? "disabled-icon" : ""
                                }`}
                                onClick={handleSocialClick}
                                style={{ cursor: "pointer" }}
                              >
                                <span className="icon-stack">
                                  <img
                                    src={`/assets/img/icons/${platform}Icon.png`}
                                    alt={platformLabel}
                                    className="main-icon"
                                  />
                                  <img
                                    src="/assets/img/icons/searchIcon.png"
                                    alt="Search"
                                    className="search-icon"
                                  />
                                </span>
                              </div>
                            </span>
                          </OverlayTrigger>
                        );
                      })}
                    </div>

                    <ul>
                      <div className="row mb-3 d-flex flex-column align-items-center">
                        {userInfo?.userInfo?.companyName && (
                          <div className="d-flex align-items-center mb-2">
                            <i className="fa-regular fa-building me-2"></i>
                            <span className="col-12 fw-semibold text-black">
                              {userInfo?.userInfo?.companyName}
                            </span>
                          </div>
                        )}
                        <div className="d-flex align-items-center mb-2">
                          <i className="fa-regular fa-user me-2"></i>
                          <span
                            className={`col-12 ${
                              !userInfo?.userInfo?.companyName
                                ? "fw-semibold text-black"
                                : ""
                            }`}
                          >
                            {userInfo?.firstname} {userInfo?.lastname}
                          </span>
                        </div>
                        {userInfo?.designation && (
                          <div className="d-flex align-items-center mb-2">
                            <i className="fa-solid fa-briefcase me-2"></i>
                            <span className="col-12 fst-italic">
                              {userInfo?.designation}
                            </span>
                          </div>
                        )}
                      </div>

                      {userInfo?.phonenumbers?.length > 0 && (
                        <li className="row mb-3">
                          <span className="col-12 fw-semibold text-black">
                            Phone
                          </span>
                          {userInfo?.phonenumbers?.map((phoneObj, index) => (
                            <div
                              className="d-flex justify-content-between align-items-center"
                              key={index}
                            >
                              <span>
                                +{phoneObj.countryCode} {phoneObj.number}
                              </span>
                            </div>
                          ))}
                        </li>
                      )}

                      {userInfo?.email && (
                        <li className="row mb-3">
                          <span className="col-12 fw-semibold text-black">
                            Email
                          </span>
                          <div className="d-flex align-items-center justify-content-between">
                            <span>{userInfo?.email}</span>
                          </div>
                        </li>
                      )}

                      <li className="row mb-3">
                        <span className="col-12 fw-semibold text-black">
                          Plan
                        </span>
                        <span className="col-12">
                          {userInfo?.plan?.name +
                            (userInfo.onFreeTrial
                              ? " (14 days Free Trial)"
                              : "") || "N/A"}
                        </span>
                      </li>
                      {userInfo?.planActivatedAt && (
                        <li className="row mb-3">
                          <span className="col-12 fw-semibold text-black">
                            Plan Activated At
                          </span>
                          <span className="col-12">
                            {dayjs(userInfo?.planActivatedAt).format(
                              "DD MMM YYYY"
                            )}
                          </span>
                        </li>
                      )}
                      {userInfo?.planExpiresAt && (
                        <li className="row mb-3">
                          <span className="col-12 fw-semibold text-black">
                            Plan Expires At
                          </span>
                          <span className="col-12">
                            {dayjs(userInfo?.planExpiresAt).format(
                              "DD MMM YYYY"
                            )}
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* User Details */}
              <div className="col-xl-9">
                <div className="card mb-3">
                  <div className="card-body pb-0">
                    <ul className="nav nav-tabs nav-tabs-bottom" role="tablist">
                      <li className="nav-item" role="presentation">
                        <Link
                          to="#"
                          data-bs-toggle="tab"
                          data-bs-target="#user-info"
                          className="nav-link active"
                        >
                          <i className="ti ti-user me-1" />
                          User Info
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="tab-content pt-0">
                  <div className="tab-pane fade active show" id="user-info">
                    <div className="card">
                      <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                        <h4 className="fw-semibold">User Information</h4>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label fw-semibold">
                                Role
                              </label>
                              <p className="form-control-static">
                                {userInfo?.role?.charAt(0).toUpperCase() +
                                  userInfo?.role?.slice(1) || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label fw-semibold">
                                Signup Method
                              </label>
                              <p className="form-control-static">
                                {userInfo?.signupMethod
                                  ?.charAt(0)
                                  .toUpperCase() +
                                  userInfo?.signupMethod?.slice(1) || "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label fw-semibold">
                                Is Verified
                              </label>
                              <p className="form-control-static">
                                <span
                                  className={`badge ${
                                    userInfo?.isVerified
                                      ? "bg-success"
                                      : "bg-warning"
                                  }`}
                                >
                                  {userInfo?.isVerified
                                    ? "Verified"
                                    : "Not Verified"}
                                </span>
                              </p>
                            </div>
                          </div>
                          {userInfo?.referralCode && (
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label fw-semibold">
                                  Referral Code
                                </label>
                                <p className="form-control-static">
                                  {userInfo?.referralCode}
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label fw-semibold">
                                Credit Balance
                              </label>
                              <p className="form-control-static">
                                ${userInfo?.creditBalance || 0}
                              </p>
                            </div>
                          </div>
                          {userInfo?.userInfo?.goals && (
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label fw-semibold">
                                  Goals
                                </label>
                                <p className="form-control-static">
                                  {userInfo?.userInfo?.goals}
                                </p>
                              </div>
                            </div>
                          )}
                          {userInfo?.userInfo?.helps &&
                            userInfo.userInfo.helps.length > 0 && (
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label fw-semibold">
                                    Areas of Help
                                  </label>
                                  <p className="form-control-static">
                                    {userInfo.userInfo.helps.join(", ")}
                                  </p>
                                </div>
                              </div>
                            )}

                          {userInfo?.userInfo?.categories && (
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label fw-semibold">
                                  Categories
                                </label>
                                <p className="form-control-static">
                                  {userInfo?.userInfo?.categories}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminUserDetails;
