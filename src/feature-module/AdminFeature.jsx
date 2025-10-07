import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setThemeSettings } from "../core/data/redux/commonSlice";

import { Outlet } from "react-router";
import ThemeSettings from "../core/common/theme-settings/themeSettings";
import Header from "../core/common/header";
import Sidebar from "../core/common/sidebar";
import AdminSidebar from "../core/common/admin-sidebar";
import AdminHeader from "../core/common/admin-header";
import OneSignal from "react-onesignal";

const AdminFeature = () => {
  const dispatch = useDispatch();
  const themeOpen = useSelector((state) => state?.common?.themeSettings);
  const headerCollapse = useSelector(
    (state) => state?.common.headerCollapse
  );
  const mobileSidebar = useSelector(
    (state) => state?.common?.mobileSidebar
  );
  const miniSidebar = useSelector((state) => state?.common?.miniSidebar);
  const expandMenu = useSelector((state) => state?.common?.expandMenu);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    const initializeOneSignal = async () => {
      // Check if OneSignal is already initialized

      try {
        console.log("Initializing OneSignal");

        await OneSignal.init({
          appId: process.env.REACT_APP_ONESIGNAL_APP_ID || "446cfd78-6541-4716-83ff-d1e857e75ce6",
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

        console.log("OneSignal initialized successfully");
      } catch (error) {
        console.error("Error initializing OneSignal:", error);
      }
    };

    initializeOneSignal();
  }, []);

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
        <AdminHeader />
        <AdminSidebar />
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

export default AdminFeature;
