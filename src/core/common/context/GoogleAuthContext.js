import React, { createContext, useEffect, useState } from "react";
import { gapi } from "gapi-script";
import api from "../../axios/axiosInstance";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SCOPES =
  "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/calendar";

export const GoogleAuthContext = createContext();

export const GoogleAuthProvider = ({ children }) => {
  const [isGoogleSignedIn, setIsGoogleSignedIn] = useState(false);

  useEffect(() => {
    const initClient = () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
          ],
          scope: SCOPES,
        })
        .then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          setIsGoogleSignedIn(authInstance.isSignedIn.get());
          authInstance.isSignedIn.listen(setIsGoogleSignedIn);
        })
        .catch((err) => console.error("Google API init error:", err));
    };

    gapi.load("client:auth2", initClient);

    const response = api.post("connect/google");
  }, []);

  // const googleSignIn = () => gapi.auth2.getAuthInstance().signIn();
  // const googleSignOut = () => gapi.auth2.getAuthInstance().signOut();

  const googleSignIn = async () => {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn();

      const profile = user.getBasicProfile();
      const email = profile.getEmail();

      const response = await api.post("connect/google", { email });
      console.log(response.data.url, "response from google api");

      console.log("Google email sent to backend:", email);
      setIsGoogleSignedIn(true);
    } catch (error) {
      console.error("Google Sign-In failed", error);
    }
  };
  const googleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut();
    setIsGoogleSignedIn(false);
  };

  return (
    <GoogleAuthContext.Provider
      value={{ isGoogleSignedIn, googleSignIn, googleSignOut }}
    >
      {children}
    </GoogleAuthContext.Provider>
  );
};
