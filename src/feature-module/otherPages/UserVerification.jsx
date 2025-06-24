import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { components } from "react-select";

const UserVerification = () => {
  const [searchParams] = useSearchParams();
  const verificationToken = searchParams.get("verificationToken");
  const [message, setMessage] = useState("Verifying...");

const navigate = useNavigate()

  useEffect(() => {
    const verifyUser = async () => {
      try {
        if (verificationToken) {
          const response = await axios.post(
            "https://100rjobf76.execute-api.eu-north-1.amazonaws.com/user/signup",
            { verifyToken: verificationToken }
          );
          setMessage(response.data.message || "Verification successful!");
          console.log("Signup successful:", response.data.data.token);
          localStorage.setItem("token", response.data.data.token);
          setTimeout(()=>{
            navigate("/registration-form", { replace: true,state: response.data.data });
          },2000)
        }
      } catch (error) {
        console.error("Signup failed:", error.response?.data || error.message);
        setMessage(
          error.response?.data?.message ||
            "Verification failed. Please try again."
        );
      }
    };

    verifyUser();
  }, [verificationToken]);

  return <div className="d-flex justify-content-center fs-3">{message}</div>;
};

export default UserVerification;
         