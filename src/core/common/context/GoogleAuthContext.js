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

export const GoogleAuthContext = createContext();

export const GoogleAuthProvider = ({ children }) => {
  const [isGoogleSignedIn, setIsGoogleSignedIn] = useState(false);
  const userProfile = useSelector((state) => state.profile);
  console.log(userProfile, "userProfile");

  const dispatch = useDispatch();
  // useEffect(() => {
  //   const initClient = () => {
  //     gapi.client
  //       .init({
  //         apiKey: API_KEY,
  //         clientId: CLIENT_ID,
  //         discoveryDocs: [
  //           "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
  //           "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  //         ],
  //         scope: SCOPES,
  //       })
  //       .then(() => {
  //         const authInstance = gapi.auth2.getAuthInstance();
  //         setIsGoogleSignedIn(authInstance.isSignedIn.get());
  //         authInstance.isSignedIn.listen(setIsGoogleSignedIn);
  //       })
  //       .catch((err) => console.error("Google API init error:", err));
  //   };

  //   gapi.load("client:auth2", initClient);

  //   const response = api.post("connect/google");
  // }, []);

  // const googleSignIn = () => gapi.auth2.getAuthInstance().signIn();
  // const googleSignOut = () => gapi.auth2.getAuthInstance().signOut();

  //   const googleSignIn = async () => {
  //     // try {
  //     //   const authInstance = gapi.auth2.getAuthInstance();
  //     //   const user = await authInstance.signIn();

  //     //   const profile = user.getBasicProfile();
  //     //   const email = profile.getEmail();

  //     //   const response = await api.post("connect/google", { email });
  //     //   console.log(response.data.url, "response from google api");

  //     //   console.log("Google email sent to backend:", email);
  //     //   setIsGoogleSignedIn(true);
  //     // } catch (error) {
  //     //   console.error("Google Sign-In failed", error);
  //     // }
  // const response = await api.post("connect/google");
  // console.log(response, "response");
  // if(response.data.status=="success"){
  //   window.open(response.data.url, "_blank", "noopener,noreferrer");
  // }

  //   };
  // const googleSignIn = async () => {
  //   try {
  //     const response = await api.post("connect/google");
  //     console.log(response, "response");

  //     if (response.data.status === "success" && response.data.url) {
  //       const width = 500;
  //       const height = 600;
  //       const left = window.screenX + (window.outerWidth - width) / 2;
  //       const top = window.screenY + (window.outerHeight - height) / 2;

  //       const popup = window.open(
  //         response.data.url,
  //         "_blank",
  //         `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`
  //       );

  //       // if (!popup) {
  //       //   console.error("Popup blocked. Please allow popups for this site.");
  //       //   return;
  //       // }

  //       const messageHandler = (event) => {
  //         // Optionally restrict origin: if (event.origin !== 'https://your-backend.com') return;

  //         const data = event.data;

  //         if (data?.status === "success" && data.googleConnected) {
  //           console.log("✅ Google connected:", data);

  //           // Now use the tokens/data as needed
  //           console.log("Google Email:", data.googleEmail);
  //           console.log("Access Token:", data.googleAccessToken);
  //           console.log("Refresh Token:", data.googleRefreshToken);

  //           // Example: save to localStorage or Redux
  //           // dispatch(setGoogleUser(data)); or setState(data)

  //           setIsGoogleSignedIn(true);
  //           window.removeEventListener("message", messageHandler);
  //           popup.close();
  //         }
  //       };

  //       window.addEventListener("message", messageHandler);
  //     }
  //   } catch (error) {
  //     console.error("Google Sign-In initiation failed", error);
  //   }
  // };

  const googleSignIn = async () => {
    try {
      const response = await api.post("connect/google");
      console.log(response.data, "jhgashgas");

      if (response.data.status === "success" && response.data.url) {
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const messageHandler = (event) => {
          console.log("console log 1");

          console.log("origin:", event.origin);
          console.log("data:", event.data);

          const data = event.data;
          console.log("console log 2");
          if (data?.status === "success" && data.googleConnected) {
            dispatch(
              showToast({
                message: "Google account connected successfully",
                variant: "success",
              })
            );
            // setIsGoogleSignedIn(true);
            dispatch(fetchProfile());
            console.log("Google connected:", data);

            window.removeEventListener("message", messageHandler);
            popup?.close();
          }
        };
        console.log("console log 3");
        window.addEventListener("message", messageHandler);

        const popup = window.open(
          response.data.url,
          "_blank",
          `width=${width},height=${height},left=${left},top=${top}`
        );
        console.log("console log 4");
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
      console.log(response.data, "response from signout google");
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

  return (

      <GoogleAuthContext.Provider
        value={{ isGoogleSignedIn, googleSignIn, googleSignOut }}
      >
        {children}
      </GoogleAuthContext.Provider>
   
  );
};
