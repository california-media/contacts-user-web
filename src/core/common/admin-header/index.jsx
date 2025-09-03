import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../imageWithBasePath";
import { all_routes } from "../../../feature-module/router/all_routes";
import { useDispatch, useSelector } from "react-redux";
import {
  setExpandMenu,
  setMiniSidebar,
  setMobileSidebar,
} from "../../data/redux/commonSlice";
import Calling from "../../../feature-module/crm/calling";
import { useAppSelector } from "../../data/redux/hooks";
import { setPhone } from "../../data/redux/slices/appCommonSlice";
import { resetSelectedContact } from "../../data/redux/slices/SelectedContactSlice";
import { resetSelectedTemplate } from "../../data/redux/slices/SelectedTemplateSlice";
import { resetProfile } from "../../data/redux/slices/ProfileSlice";
import AvatarInitialStyles from "../nameInitialStyles/AvatarInitialStyles";
import { resetContacts } from "../../data/redux/slices/ContactSlice";
import "./header.css";

const AdminHeader = () => {
  const route = all_routes;
  const location = useLocation();
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.profile);
  const mobileSidebar = useSelector((state) => state.common.mobileSidebar);
  const miniSidebar = useSelector((state) => state.common.miniSidebar);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [clientPhoneNumber, setClientPhoneNumber] = useState("");
  const phoneNumber = useAppSelector((state) => state.appCommon.phone);
  const navigate = useNavigate();
  useEffect(() => {
    setClientPhoneNumber(phoneNumber);
    phoneNumber && showDropdown();
  }, [phoneNumber]);
  const showDropdown = () => {
    setOpenDropdown(true);
  };

  const toggleMobileSidebar = () => {
    dispatch(setMobileSidebar(!mobileSidebar));
  };
  const toggleMiniSidebar = () => {
    dispatch(setMiniSidebar(!miniSidebar));
  };
  const toggleExpandMenu = () => {
    dispatch(setExpandMenu(true));
  };
  const toggleExpandMenu2 = () => {
    dispatch(setExpandMenu(false));
  };
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    dispatch(resetProfile());
    dispatch(resetSelectedContact());
    dispatch(resetSelectedTemplate());
    dispatch(resetContacts());
    navigate(route.login);
  };
  const [layoutBs, setLayoutBs] = useState(localStorage.getItem("dataTheme"));
  const isLockScreen = location.pathname === "/lock-screen";

  if (isLockScreen) {
    return null;
  }
  const LayoutDark = () => {
    localStorage.setItem("dataTheme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
    setLayoutBs("dark");
  };
  const LayoutLight = () => {
    localStorage.setItem("dataTheme", "light");
    document.documentElement.setAttribute("data-theme", "light");
    setLayoutBs("light");
  };

  return (
    <>
      <div className="header">
        <Link
          id="mobile_btn"
          className="mobile_btn"
          to="#sidebar"
          onClick={toggleMobileSidebar}
        >
          <span className="bar-icon mt-0">
            <span />
            <span />
            <span className="mb-0" />
          </span>
        </Link>
        <div className="header-user">
          <ul className="nav user-menu">
            <li className="nav-item dropdown has-arrow main-drop">
              <Link
                to={route.adminProfile}
                className={`nav-link userset  ${
                  !userProfile.profileImageURL ? "border-0 shadow-none" : ""
                }`}
              >
                {userProfile.profileImageURL ? (
                  <span className="user-info">
                    <span className="user-letter">
                      <img
                        src={userProfile.profileImageURL}
                        alt="Profile"
                        style={{ objectFit: "cover", height: "100%" }}
                      />
                    </span>
                  </span>
                ) : (
                  <AvatarInitialStyles
                    name={`${userProfile.firstname} ${userProfile.lastname}`}
                    divStyles={{ fontSize: 16, width: 50, height: 50 }}
                  />
                )}
                <span className="badge badge-success rounded-pill" />
              </Link>
            </li>
          </ul>
        </div>
        {/* /Mobile Menu */}
        <div className="mobile-user-menu d-flex justify-content-center align-items-center">
          <Link
            to={route.profile}
            style={{ marginTop: "2px" }}
            className={`nav-link userset  ${
              !userProfile.profileImageURL ? "border-0 shadow-none" : ""
            }`}
          >
            {userProfile.profileImageURL ? (
              <span className="user-info">
                <span className="user-letter">
                  <img
                    src={userProfile.profileImageURL}
                    alt="Profile"
                    style={{ objectFit: "cover", height: "100%" }}
                  />
                </span>
              </span>
            ) : (
              <AvatarInitialStyles
                name={`${userProfile.firstname} ${userProfile.lastname}`}
                divStyles={{ fontSize: 16, width: 50, height: 50 }}
              />
            )}
            <span className="badge badge-success rounded-pill" />
          </Link>
        </div>
      </div>
      <div
        className="modal fade"
        id="logoutModal"
        tabIndex="-1"
        aria-labelledby="logout"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="text-center">
                <div className="avatar avatar-xl bg-danger-light rounded-circle mb-3">
                  <i className="fa-solid fa-right-from-bracket fs-36 text-danger" />
                </div>
                <h4 className="mb-2 text-capitalize">Logout?</h4>
                <p className="mb-0">
                  Are you sure you want to logout the dfsaccount?
                </p>
                <div className="d-flex align-items-center justify-content-center mt-4">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    to={"#"}
                    data-bs-dismiss="modal"
                    className="btn btn-danger"
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    Yes, Logout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHeader;
