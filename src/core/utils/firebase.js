"use client";
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyBdzJKoYXeWuV0dba_nsw4tX4gcpfw0V84",
  authDomain: "contacts-45418.firebaseapp.com",
  projectId: "contacts-45418",
  storageBucket: "contacts-45418.firebasestorage.app",
  messagingSenderId: "154389834856",
  appId: "1:154389834856:web:f1ba67b0591c79a9b71fdd"
};
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];
  const auth = getAuth(app);
// const app = initializeApp(firebaseConfig);
// export { app };
export { app, auth };