import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setThemeSettings } from "../core/data/redux/commonSlice";

import { Outlet } from "react-router";
import ThemeSettings from "../core/common/theme-settings/themeSettings";
import Header from "../core/common/header";
import Sidebar from "../core/common/sidebar";
import OneSignal from "react-onesignal";
import useOneSignalAuth from "../hooks/useOneSignalAuth";

// Global flag to track OneSignal initialization
let isOneSignalInitialized = false;

const Feature = () => {
  const dispatch = useDispatch();
  const themeOpen = useSelector((state) => state?.common?.themeSettings);
  const headerCollapse = useSelector((state) => state?.common.headerCollapse);
  const mobileSidebar = useSelector((state) => state?.common?.mobileSidebar);
  const miniSidebar = useSelector((state) => state?.common?.miniSidebar);
  const expandMenu = useSelector((state) => state?.common?.expandMenu);
  const [selectedLead, setSelectedLead] = useState(null);

  // Use OneSignal auth hook for user login/logout
  const { loginOneSignalUser, checkOneSignalStatus } = useOneSignalAuth();

  useEffect(() => {
    const initializeOneSignal = async () => {
      // Prevent multiple initializations
      if (isOneSignalInitialized) {
        console.log("OneSignal already initialized, skipping...");
        return;
      }

      try {
        console.log("Initializing OneSignal");

        await OneSignal.init({
          appId:
            process.env.REACT_APP_ONESIGNAL_APP_ID ||
            "446cfd78-6541-4716-83ff-d1e857e75ce6",
          allowLocalhostAsSecureOrigin: true,
          notifyButton: {
            enable: true,
            size: "medium",
            position: "bottom-right",
            offset: { bottom: "20px", right: "20px", left: "20px" },
            prenotify: true,
            showCredit: false,
            text: {
              "tip.state.unsubscribed": "Subscribe to notifications",
              "tip.state.subscribed": "Thanks for subscribing!",
              "tip.state.blocked": "You've blocked notifications",
              "message.prenotify": "Click to subscribe to notifications",
              "message.action.subscribed": "Thanks for subscribing!",
              "message.action.subscribing": "Subscribing...",
              "message.action.resubscribed":
                "You're subscribed to notifications",
              "message.action.unsubscribed":
                "You won't receive notifications again",
              "dialog.main.title": "Manage Site Notifications",
              "dialog.main.button.subscribe": "SUBSCRIBE",
              "dialog.main.button.unsubscribe": "UNSUBSCRIBE",
              "dialog.blocked.title": "Unblock Notifications",
              "dialog.blocked.message":
                "Follow these instructions to allow notifications:",
            },
          },
        });

        isOneSignalInitialized = true;
        console.log("OneSignal initialized successfully");

        // Check current status after initialization
        setTimeout(() => {
          checkOneSignalStatus();
        }, 1000);
      } catch (error) {
        console.error("Error initializing OneSignal:", error);
      }
    };

    initializeOneSignal();
  }, [checkOneSignalStatus]);

  return (
    <div
      className={`
      ${miniSidebar ? "mini-sidebar" : ""}
      ${expandMenu ? "expand-menu" : ""}`}
    >
      <div
        className={`main-wrapper 
        ${headerCollapse ? "header-collapse" : ""} 
        ${mobileSidebar ? "slide-nav" : ""}`}
      >
        <Header />
        <Sidebar />
        <Outlet />
        {/* <ThemeSettings/> */}
      </div>
      <div className="sidebar-overlay"></div>
      <div
        className={`sidebar-themeoverlay ${themeOpen ? "open" : ""}`}
        onClick={() => dispatch(setThemeSettings(!themeOpen))}
      ></div>
    </div>
  );
};

export default Feature;
