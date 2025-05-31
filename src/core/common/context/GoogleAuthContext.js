import React, { createContext, useEffect, useState } from "react";
import { gapi } from "gapi-script";

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
  }, []);

  const googleSignIn = () => gapi.auth2.getAuthInstance().signIn();
  const googleSignOut = () => gapi.auth2.getAuthInstance().signOut();

  return (
    <GoogleAuthContext.Provider
      value={{ isGoogleSignedIn, googleSignIn, googleSignOut }}
    >
      {children}
    </GoogleAuthContext.Provider>
  );
};
