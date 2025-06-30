import React, { createContext, useEffect, useState } from "react";
import { gapi } from "gapi-script";
import api from "../../axios/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../data/redux/slices/ProfileSlice";
import { showToast } from "../../data/redux/slices/ToastSlice";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SCOPES =
  "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/calendar";

export const EmailAuthContext = createContext();

export const EmailAuthProvider = ({ children }) => {
  const [isGoogleSignedIn, setIsGoogleSignedIn] = useState(false);
  const [isMicrosoftSignedIn, setIsMicrosoftSignedIn] = useState(false);
  const userProfile = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const googleSignIn = async () => {
    try {
      const response = await api.post("connect/google");

      if (response.data.status === "success" && response.data.url) {
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const messageHandler = (event) => {
          console.log("origin:", event.origin);
          console.log("data:", event.data);

          const data = event.data;
          if (data?.status === "success" && data.googleConnected) {
            dispatch(
              showToast({
                message: "Google account connected successfully",
                variant: "success",
              })
            );
            dispatch(fetchProfile());

            window.removeEventListener("message", messageHandler);
            popup?.close();
          }
        };
        window.addEventListener("message", messageHandler);

        const popup = window.open(
          response.data.url,
          "_blank",
          `width=${width},height=${height},left=${left},top=${top}`
        );
        if (!popup) {
          console.error("Popup blocked");
        }
      }
    } catch (error) {
      console.error("Google Sign-In initiation failed", error);
    }
  };
  const googleSignOut = async () => {
    try {
      const response = await api.post("disconnect/google");
      dispatch(fetchProfile());
      dispatch(
        showToast({ message: response.data.message, variant: "success" })
      );
    } catch (error) {
      dispatch(
        showToast({ message: error.response.data.message, variant: "danger" })
      );
    }
  };

  const microsoftSignIn = async () => {
    try {
      const response = await api.post("connect/microsoft");
      console.log(response.data,"response from microsoft connect");
      
      if (response.data.status === "success" && response.data.url) {
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const messageHandler = (event) => {
          const data = event.data;
          if (data?.status === "success" && data.microsoftConnected) {
            dispatch(
              showToast({
                message: "Microsoft account connected successfully",
                variant: "success",
              })
            );
            dispatch(fetchProfile());
            window.removeEventListener("message", messageHandler);
            popup?.close();
          }
        };

        window.addEventListener("message", messageHandler);

        const popup = window.open(
          response.data.url,
          "_blank",
          `width=${width},height=${height},left=${left},top=${top}`
        );
      }
    } catch (error) {
      console.error("Microsoft Sign-In initiation failed", error);
    }
  };

  const microsoftSignOut = async () => {
    try {
      const response = await api.post("disconnect/microsoft");

      dispatch(fetchProfile());
      dispatch(
        showToast({ message: response.data.message, variant: "success" })
      );
    } catch (error) {
      dispatch(
        showToast({ message: error.response?.data?.message, variant: "danger" })
      );
    }
  };

  return (
    <EmailAuthContext.Provider
      value={{
        isGoogleSignedIn,
        googleSignIn,
        googleSignOut,
        isMicrosoftSignedIn,
        microsoftSignIn,
        microsoftSignOut,
      }}
    >
      {children}
    </EmailAuthContext.Provider>
  );
};
