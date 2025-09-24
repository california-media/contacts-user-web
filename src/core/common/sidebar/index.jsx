import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import Scrollbars from "react-custom-scrollbars-2"; // unused currently
import { SidebarData as StaticSidebarData } from "../../data/json/sidebarData";
import ImageWithBasePath from "../imageWithBasePath";
import { useDispatch, useSelector } from "react-redux";
import { setExpandMenu, setMobileSidebar } from "../../data/redux/commonSlice";
// import Calling from "../../../feature-module/crm/calling";
import { all_routes } from "../../../feature-module/router/all_routes";
import api from "../../axios/axiosInstance";
// import { resetProfile } from "../../data/redux/slices/ProfileSlice";
// import { resetSelectedContact } from "../../data/redux/slices/SelectedContactSlice";
// import { resetSelectedTemplate } from "../../data/redux/slices/SelectedTemplateSlice";
// import { resetContacts } from "../../data/redux/slices/ContactSlice";

const Sidebar = () => {
  const Location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userProfile = useSelector((state) => state.profile);
  console.log(userProfile, "userProfile in sidebar");

  const route = all_routes;
  function getRemainingDays(trialEndDate) {
    const now = new Date();
    const end = new Date(trialEndDate);

    const diff = end - now; // in ms
    if (diff <= 0) return "Trial expired";

    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + " days remaining";
  }
  // ✅ Grab tags once at top level (required for hooks)
  const { tags: allTags = [] } = useSelector((state) => state.tags);
  // const expandMenu = useSelector((state) => state.expandMenu);

  const [subOpen, setSubopen] = useState("");
  // const [subsidebar, setSubsidebar] = useState("");
  // const [showDialer, setShowDialer] = useState(false);
  // const [openDropdown, setOpenDropdown] = useState(true);
  const [isHovered, setIsHovered] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);

  // const toggleDropdown = () => setOpenDropdown((p) => !p);

  //   const handleLogout = () => {
  //     console.log("console log 1");

  //     localStorage.removeItem("userId");
  //     console.log("console log 2");
  //     localStorage.removeItem("token");
  //     console.log("console log 3");
  //     dispatch(resetProfile());
  //     console.log("console log 4");
  //     dispatch(resetSelectedContact());
  //     console.log("console log 4");
  //     dispatch(resetSelectedTemplate());
  //     console.log("console log 5");
  //     dispatch(resetContacts());
  // console.log("navigating to login route");

  // navigate(route.login);
  // console.log("navigated to login route");
  //   };

  const toggleSidebar = (title) => {
    localStorage.setItem("menuOpened", title);
    setSubopen((prev) => (prev === title ? "" : title));
  };

  // const toggleSubsidebar = (subitem) => {
  //   setSubsidebar((prev) => (prev === subitem ? "" : subitem));
  // };

  // const toggle = () => dispatch(setExpandMenu(true));
  // const toggle2 = () => dispatch(setExpandMenu(false));

  useEffect(() => {
    /* Lines 78-90 omitted */
  }, [Location.pathname]);

  // Fetch available plans to determine highest tier
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoadingPlans(true);
        const response = await api.get("/plans/get");
        if (response.data.success) {
          setAvailablePlans(response.data.plans || []);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        // Set empty array on error to avoid issues
        setAvailablePlans([]);
      } finally {
        setIsLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  const handleMouseEnter = (menuLabel) => setIsHovered(menuLabel);
  const handleMouseLeave = () => setIsHovered(null);

  /**
   * Build dynamic GROUPS section from tags while preserving the
   * rest of the statically‑defined sidebar structure.
   *
   * We DO NOT mutate the imported StaticSidebarData.
   */
  const sidebarItems = useMemo(() => {
    if (!Array.isArray(StaticSidebarData)) return [];

    // Build dynamic group submenu items from tags
    // const dynamicGroupSubmenuItems =
    //   allTags.length === 0
    //     ? StaticSidebarData.find((s) => s.label === "GROUPS")?.submenuItems ??
    //       []
    //     : allTags.map((tag) => {
    //         console.log(tag, "tagsfdfd");

    //         const tagId = tag.tag_id ?? tag.id ?? tag.slug ?? tag.name;
    //         const tagName = tag.tag ?? "Untitled Tag";
    //         const tagIcon = tag.emoji;
    //         return {
    //           label: tagName,
    //           icon: tagIcon,
    //           submenu: true,
    //           showSubRoute: false,
    //           submenuItems: [
    //             {
    //               label: tagName,
    //               // Adjust URL pattern if you prefer /contacts/tag/:id etc.
    //               link: `${route.contacts}?tag=${encodeURIComponent(tagId)}`,
    //               icon: tagIcon,
    //             },
    //           ],
    //         };
    //       });

    const dynamicGroupSubmenuItems =
      allTags.length === 0
        ? StaticSidebarData.find((s) => s.label === "GROUPS")?.submenuItems ??
          []
        : allTags.map((tag) => {
            const tagId = tag.tag_id ?? tag.id ?? tag.slug ?? tag.name;
            const tagName = tag.tag ?? "Untitled Tag";
            const tagIcon = tag.emoji ?? "🏷️";
            return {
              label: tagName,
              icon: tagIcon,
              isDynamicTag: true, // ✅ Mark it so we know it's special
            };
          });

    // Return full structure with GROUPS replaced
    return StaticSidebarData.map((section) =>
      section.label === "GROUPS"
        ? {
            ...section,
            submenuHdr: "Tags",
            submenuItems: dynamicGroupSubmenuItems,
          }
        : section
    );
  }, [allTags]);

  // Helper functions for plan logic
  const getCurrentPlan = () => {
    return userProfile?.plan;
  };

  const getMostExpensivePlan = () => {
    if (!availablePlans.length) return null;
    return availablePlans.reduce((highest, current) =>
      current.price > highest.price ? current : highest
    );
  };

  const isOnHighestTierPlan = () => {
    const currentPlan = getCurrentPlan();
    const highestPlan = getMostExpensivePlan();

    if (!currentPlan || !highestPlan) return false;

    // Compare by price since that's how tiers are determined
    return currentPlan.price >= highestPlan.price;
  };

  const isOnFreeTrial = () => {
    const currentPlan = getCurrentPlan();

    // Check if user is on Stripe subscription trial
    if (currentPlan?.isTrialing) {
      return true;
    }

    return false;
  };

  const now = new Date();
  const trialEnd = new Date(userProfile?.trialEndDate);
  const diff = trialEnd - now;
  const daysLeft = diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;

  return (
    <>
      <div className="sidebar" id="sidebar">
        <div className="sidebar-inner slimscroll d-flex justify-content-md-between flex-column">
          <div>
            <div className="d-flex ms-4 mt-4 align-items-center justify-content-between">
              <ImageWithBasePath
                src="assets/img/contactsLogoTransparent.png"
                alt="Profile"
                width={150}
              />
              <button
                className="btn btn-link p-0 me-3 d-md-none"
                style={{ lineHeight: 1 }}
                aria-label="Close sidebar"
                onClick={() => dispatch(setMobileSidebar(false))}
              >
                <img
                  src="/assets/img/icons/close.png"
                  alt="Close"
                  width={24}
                  height={24}
                />
              </button>
            </div>

            <div id="sidebar-menu" className="sidebar-menu mt-4">
              <ul>
                {sidebarItems?.map((mainLabel, index) => {
                  // console.log(mainLabel, "sidebar main label");
                  return (
                    <li className="clinicdropdown" key={index}>
                      <h6 className="submenu-hdr">{mainLabel?.label}</h6>
                      <ul>
                        {mainLabel?.submenuItems?.map((title) => {
                          // Flatten nested links for active state detection
                          const link_array = [];
                          if ("submenuItems" in title) {
                            title.submenuItems?.forEach((link) => {
                              link_array.push(link?.link);
                              if (link?.submenu && "submenuItems" in link) {
                                link.submenuItems?.forEach((item) => {
                                  link_array.push(item?.link);
                                });
                              }
                            });
                          }
                          title.links = link_array;

                          // Single submenu convenience
                          const hasSingleSubmenu =
                            title.submenuItems?.length === 1;
                          const submenuLink = hasSingleSubmenu
                            ? title.submenuItems[0]?.link
                            : "#";

                          return (
                            <li
                              className={`submenu ${
                                hasSingleSubmenu ? "single-submenu" : ""
                              }`}
                              key={title.label}
                              onClick={async (e) => {
                                if (hasSingleSubmenu) {
                                  e.stopPropagation();
                                  navigate(submenuLink);
                                  // Close sidebar on mobile after navigation
                                  if (window.innerWidth < 992) {
                                    dispatch(setMobileSidebar(false));
                                  }
                                }
                              }}
                              style={{
                                cursor: hasSingleSubmenu
                                  ? "pointer"
                                  : "default",
                              }}
                            >
                              <div
                                onMouseEnter={() =>
                                  handleMouseEnter(title.label)
                                }
                                onMouseLeave={handleMouseLeave}
                              >
                                {/* <Link
                                  to={title?.submenu ? "#" : title?.link}
                                  onClick={() => {
                                    toggleSidebar(title?.label);
                                    // Close sidebar on mobile after navigation
                                    if (!title?.submenu && window.innerWidth < 992) {
                                      dispatch(setMobileSidebar(false));
                                    }
                                  }}
                                  className={`$ {
                                    subOpen === title?.label ? "subdrop" : ""
                                  } $ {
                                    title?.links?.includes(Location.pathname)
                                      ? "active"
                                      : ""
                                  } $ {
                                    title?.submenuItems
                                      ?.map((link) => link?.link)
                                      .includes(Location.pathname) ||
                                    title?.link === Location.pathname
                                      ? "active"
                                      : ""
                                  }`}
                                >
                 
                                  {mainLabel?.label == "GROUPS" ? (
                                    <span>{title.icon}</span>
                                  ) : (
                                    <i className={title.icon}></i>
                                  )}
                                  <span>{title?.label}</span>
                                  <span
                                    className={
                                      title?.submenu ? "menu-arrow" : ""
                                    }
                                  />
                                </Link> */}
                                {title.isDynamicTag ? (
                                  <div
                                    onClick={() => {
                                      if (window.innerWidth < 992) {
                                        dispatch(setMobileSidebar(false));
                                      }
                                      navigate(route.contacts, {
                                        state: {
                                          preselectedTags: [
                                            title.label.toLowerCase(),
                                          ],
                                        },
                                      });
                                    }}
                                    className={`d-flex align-items-center`}
                                    style={{
                                      cursor: "pointer",
                                      padding: "4px",
                                    }}
                                  >
                                    <span style={{ marginRight: 8 }}>
                                      {title.icon}
                                    </span>
                                    <span>{title.label}</span>
                                  </div>
                                ) : (
                                  // <Link
                                  //   to={title?.submenu ? "#" : title?.link}
                                  //   onClick={() => toggleSidebar(title?.label)}
                                  //   className={`${
                                  //     subOpen === title?.label ? "subdrop" : ""
                                  //   } ${
                                  //     title?.links?.includes(Location.pathname)
                                  //       ? "active"
                                  //       : ""
                                  //   } ${
                                  //     title?.submenuItems
                                  //       ?.map((link) => link?.link)
                                  //       .includes(Location.pathname) ||
                                  //     title?.link === Location.pathname
                                  //       ? "active"
                                  //       : ""
                                  //   }`}
                                  // >
                                  //   <i className={title.icon}></i>
                                  //   <span>{title?.label}</span>
                                  //   <span
                                  //     className={
                                  //       title?.submenu ? "menu-arrow" : ""
                                  //     }
                                  //   />
                                  // </Link>
                                  <Link
                                    to={title?.submenu ? "#" : title?.link}
                                    onClick={() => {
                                      toggleSidebar(title?.label);
                                      // Close sidebar on mobile after navigation
                                      if (
                                        !title?.submenu &&
                                        window.innerWidth < 992
                                      ) {
                                        dispatch(setMobileSidebar(false));
                                      }
                                    }}
                                    className={`${
                                      subOpen === title?.label ? "subdrop" : ""
                                    } ${
                                      // Check for exact match with pathname+hash
                                      title?.links?.includes(
                                        Location.pathname + Location.hash
                                      )
                                        ? "active"
                                        : ""
                                    } ${
                                      // Check for submenu items with pathname+hash
                                      title?.submenuItems
                                        ?.map((link) => link?.link)
                                        .includes(
                                          Location.pathname + Location.hash
                                        ) ||
                                      title?.link ===
                                        Location.pathname + Location.hash
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    {/* <i className={title.icon}></i> */}
                                    {title.iconImg ? (
                                      <img
                                        src={title.iconImg}
                                        alt={title.label}
                                        style={{
                                          width: 15,
                                          height: 15,
                                          marginRight: 5,
                                        }}
                                      />
                                    ) : (
                                      <i className={title.icon}></i>
                                    )}
                                    <span>{title?.label}</span>
                                    <span
                                      className={
                                        title?.submenu ? "menu-arrow" : ""
                                      }
                                    />
                                  </Link>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* lower box content */}
          <div>
            <div className="sidebarTrialBox">
              <div
                className="d-flex justify-content-between"
                style={{ marginBottom: 12 }}
              >
                <ImageWithBasePath
                  src="assets/img/icons/diamond.png"
                  className="uploadSectionImage"
                  alt="Excel Logo"
                />
                {/* <ImageWithBasePath
                  src="assets/img/icons/close.png"
                  className="closeIcon"
                  alt="Excel Logo"
                /> */}
              </div>
              <div>
                {(() => {
                  const currentPlan = getCurrentPlan();
                  const showUpgradeButton =
                    !isLoadingPlans && !isOnHighestTierPlan();
                  const isTrialing = isOnFreeTrial();

                  // Show current plan with trial indication if user is on a trial
                  if (currentPlan && currentPlan.name) {
                    if (isTrialing) {
                      // User has a plan but it's in trial mode
                      return (
                        <>
                          <p className="trialHeading">
                            14 days Free Trial: {currentPlan.name}
                          </p>
                          <p className="trialDescription">
                            {diff > 0
                              ? `Trial ends in ${daysLeft} days`
                              : "Trial has expired"}
                          </p>
                          <p
                            className="upgradePlan"
                            onClick={() => navigate(route.upgradePlan)}
                            style={{ cursor: "pointer" }}
                          >
                            Upgrade Plan
                          </p>
                        </>
                      );
                    } else {
                      // User has a regular paid plan
                      return (
                        <>
                          <p className="trialHeading">
                            Current Plan: {currentPlan.name}
                          </p>
                          <p className="trialDescription">
                            {showUpgradeButton
                              ? "Upgrade to unlock more features"
                              : "You're on the highest tier plan"}
                          </p>
                          {showUpgradeButton && (
                            <p
                              className="upgradePlan"
                              onClick={() => navigate(route.upgradePlan)}
                              style={{ cursor: "pointer" }}
                            >
                              Upgrade Plan
                            </p>
                          )}
                        </>
                      );
                    }
                  } else {
                    // No current plan - check if on legacy trial or starter
                    if (isTrialing) {
                      return (
                        <>
                          <p className="trialHeading">
                            {diff > 0
                              ? `Free Trial - ${daysLeft} days left`
                              : "Free Trial Expired"}
                          </p>
                          <p className="trialDescription">
                            Upgrade to continue using premium features
                          </p>
                          <p
                            className="upgradePlan"
                            onClick={() => navigate(route.upgradePlan)}
                            style={{ cursor: "pointer" }}
                          >
                            Upgrade Plan
                          </p>
                        </>
                      );
                    } else {
                      // Regular starter/free user
                      return (
                        <>
                          <p className="trialHeading">Free Plan</p>
                          <p className="trialDescription">
                            Upgrade to unlock premium features
                          </p>
                          {showUpgradeButton && (
                            <p
                              className="upgradePlan"
                              onClick={() => navigate(route.upgradePlan)}
                              style={{ cursor: "pointer" }}
                            >
                              Upgrade Plan
                            </p>
                          )}
                        </>
                      );
                    }
                  }
                })()}
              </div>
            </div>

            {/* <div style={{ padding: 15 }}>
              <ul>
                <li
                  className="submenu single-submenu"
                  style={{ cursor: "pointer" }}
                >
                  <div>
                    <a href="/dashboard" className="customSideMenuItem">
                      <i className="ti ti-tag customSideMenuItemIcon"></i>
                      <span className="customSideMenuLabel">
                        Refer &amp; Earn
                      </span>
                      <span className="menu-arrow"></span>
                    </a>
                  </div>
                </li>
                <li
                  className="submenu single-submenu"
                  style={{ cursor: "pointer" }}
                >
                  <div>
                    <a href="/dashboard" className="customSideMenuItem">
                      <i className="ti ti-tag customSideMenuItemIcon"></i>
                      <span className="customSideMenuLabel">
                        Help &amp; support
                      </span>
                      <span className="menu-arrow"></span>
                    </a>
                  </div>
                </li>
                <li
                  className="submenu single-submenu"
                  style={{ cursor: "pointer" }}
                >
                  <div>
                    <a
                      href="/general-settings/profile"
                      className="customSideMenuItem"
                    >
                      <i className="ti ti-tag customSideMenuItemIcon"></i>
                      <span className="customSideMenuLabel">Settings</span>
                      <span className="menu-arrow"></span>
                    </a>
                  </div>
                </li>
              </ul>
            </div> */}

            <div className="mb-4" style={{ padding: 15 }}>
              <Link
                to=""
                className={`d-flex align-items-center suserset me-2 ps-2`}
                data-bs-toggle="modal"
                data-bs-target="#logoutModal"
              >
                <ImageWithBasePath
                  src="assets/img/icons/logout.png"
                  alt="Logout"
                  width={15}
                  className="me-3"
                />
                <span>Logout</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Logout Modal */}
        {/* <div
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
                    Are you sure you want to logout the account?
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
                      onClick={handleLogout}
                    >
                      Yes, Logout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      {/* *sidebar */}
    </>
  );
};

export default Sidebar;
