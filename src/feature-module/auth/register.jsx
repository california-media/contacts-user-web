// import React, { useEffect, useState } from "react";
// import ImageWithBasePath from "../../core/common/imageWithBasePath";
// import { Link, useNavigate } from "react-router-dom";
// import { all_routes } from "../router/all_routes";
// import api from "../../core/axios/axiosInstance";
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import { auth } from "../../core/utils/firebase";
// import { FaTasks } from "react-icons/fa";
// import { SlPeople, SlPhone } from "react-icons/sl";
// import PhoneInput from "react-phone-input-2";

// const Register = () => {
//   const route = all_routes;
//   const [passwordVisibility, setPasswordVisibility] = useState({
//     password: false,
//     confirmPassword: false,
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [password, setPassword] = useState("");
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const navigate = useNavigate();
//   const togglePasswordVisibility = (field) => {
//     setPasswordVisibility((prevState) => ({
//       ...prevState,
//       [field]: !prevState[field],
//     }));
//   };
//   // const handleRegister = async (e) => {
//   //   e.preventDefault();
//   //   setMessage({ text: "", type: "" });
//   //   setIsLoading(true);

//   //   try {
//   //     const response = await api.post("user/signup", { phoneNumber, password });

//   //     if (response.data.status === "success") {
//   //       setMessage({ text: response.data.message, type: "success" });
//   //       setIsLoading(false);
//   //     }
//   //   } catch (error) {
//   //     setMessage({ text: error.response.data.message, type: "error" });
//   //     setIsLoading(false);
//   //   }
//   // };
//     const sendEmailOtp = async () => {
//     try {
//       const res = await api.post("/signup/send-otp", { email });
//       setMessage({ text: res.data.message, type: "success" });
//       setShowOtpInput(true);
//     } catch (err) {
//       setMessage({ text: err.response?.data?.message || "Failed to send OTP", type: "error" });
//     }
//   };

//   const verifyEmailOtp = async () => {
//     try {
//       const res = await api.post("/signup/verify-otp", { email, otp });
//       setMessage({ text: res.data.message, type: "success" });
//     } catch (err) {
//       setMessage({ text: err.response?.data?.message || "OTP verification failed", type: "error" });
//     }
//   };

//   const sendPhoneOtp = async () => {
//     setMessage({ text: "", type: "" });
//     setIsLoading(true);
//     const isPhone = /^\+[0-9]{10,15}$/.test(phoneNumber);
//     if (!isPhone) {
//       setMessage({ text: "Invalid phone number", type: "error" });
//       setIsLoading(false);
//       return;
//     }
//     try {
//       if (!window.recaptchaVerifier) {
//         window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
//           size: "invisible",
//           callback: () => {},
//         });
//       }
//       const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
//       window.confirmationResult = confirmationResult;
//       setShowOtpInput(true);
//       setMessage({ text: "OTP sent to phone!", type: "success" });
//     } catch (err) {
//       setMessage({ text: err.message, type: "error" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const verifyPhoneOtp = async () => {
//     try {
//       await window.confirmationResult.confirm(otp);
//       setMessage({ text: "Phone number verified!", type: "success" });
//     } catch (err) {
//       setMessage({ text: "Invalid OTP", type: "error" });
//     }
//   };

//   // const handleRegister = async (e) => {
//   //   e.preventDefault();
//   //   setMessage({ text: "", type: "" });
//   //   setIsLoading(true);

//   //   const isPhone = /^\+?[0-9]{10,15}$/.test(phoneNumber);

//   //   if (isPhone) {
//   //     try {
//   //       if (!window.recaptchaVerifier) {
//   //         window.recaptchaVerifier = new RecaptchaVerifier(
//   //           auth,
//   //           "recaptcha-container",
//   //           {
//   //             size: "invisible",
//   //             callback: () => {},
//   //           }
//   //         );
//   //       }
//   //       const confirmationResult = await signInWithPhoneNumber(
//   //         auth,
//   //         phoneNumber,
//   //         window.recaptchaVerifier
//   //       );

//   //       window.confirmationResult = confirmationResult;
//   //       setMessage({ text: "OTP sent successfully!", type: "success" });
//   //     } catch (err) {
//   //       console.error(err);
//   //       setMessage({ text: err.message, type: "error" });
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   } else {
//   //     // Email path - just show "Coming soon" or skip
//   //     setMessage({
//   //       text: "Email registration is not supported yet.",
//   //       type: "error",
//   //     });
//   //     setIsLoading(false);
//   //   }
//   // };
//   return (
//     <div className="account-content">
//       <div className="container-fluid">
//         <div className="row">
//           <div id="recaptcha-container" />
//           <div className="col-md-12 p-0">
//             <div className="d-flex flex-wrap w-100 vh-100 overflow-hidden account-bg-02">
//               <div className="d-flex align-items-center justify-content-center flex-wrap vh-100 overflow-auto p-4 w-100 bg-backdrop">
//                 <form className="flex-fill">
//                   <div className="mx-auto mw-450">
//                     <div className="text-center mb-4">
//                       <ImageWithBasePath
//                         src="assets/img/logo.svg"
//                         className="img-fluid"
//                         alt="Logo"
//                       />
//                     </div>
//                     <div className="mb-4">
//                       <h4 className="mb-2 fs-20">Register</h4>
//                     </div>
//                     <div className="card mb-3">
//                       <div className="card-body pb-0">
//                         <ul
//                           className="nav nav-tabs nav-tabs-bottom"
//                           role="tablist"
//                         >
//                           <li className="nav-item" role="presentation">
//                             <Link
//                               to="#"
//                               data-bs-toggle="tab"
//                               data-bs-target="#emailRegsiter"
//                               className="nav-link active"
//                             >
//                               <FaTasks className="me-2" />
//                               Email
//                             </Link>
//                           </li>
//                           <li className="nav-item" role="presentation">
//                             <Link
//                               to="#"
//                               data-bs-toggle="tab"
//                               data-bs-target="#phoneRegister"
//                               className="nav-link"
//                             >
//                               <SlPhone className="me-2" />
//                               Phone
//                             </Link>
//                           </li>
//                         </ul>
//                       </div>
//                     </div>
//                     <div className="tab-content pt-0">
//                       <div
//                         className="tab-pane fade show active"
//                         id="emailRegsiter"
//                       >
//                         <div className="mb-3">
//                           <div className="position-relative">
//                             <span className="input-icon-addon">
//                               <i className="ti ti-user" />
//                             </span>
//                             <input
//                               type="text"
//                               value={email}
//                               onChange={(e) => setEmail(e.target.value)}
//                               required
//                               className="form-control"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                       <div className="tab-pane" id="phoneRegister">
//                         <div className="mb-3">
//                           <PhoneInput
//                             country={"ae"}
//                             value={phoneNumber}
//                             onChange={(value) => setPhoneNumber("+" + value)}
//                             enableSearch
//                             inputProps={{
//                               name: "phone",
//                               required: true,
//                               autoFocus: true,
//                             }}
//                             inputStyle={{ background: "#e9f0fd" }}
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mb-3">
//                       <label className="col-form-label">Password</label>
//                       <div className="pass-group">
//                         <input
//                           type={
//                             passwordVisibility.password ? "text" : "password"
//                           }
//                           className="pass-input form-control"
//                           value={password}
//                           onChange={(e) => setPassword(e.target.value)}
//                           required
//                         />
//                         <span
//                           className={`ti toggle-passwords ${
//                             passwordVisibility.password
//                               ? "ti-eye"
//                               : "ti-eye-off"
//                           }`}
//                           onClick={() => togglePasswordVisibility("password")}
//                         ></span>
//                       </div>
//                     </div>
//                     {showOtpInput && (
//                       <>
//                         <div className="mb-3">
//                           <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="form-control" placeholder="Enter OTP" required />
//                         </div>
//                         <div className="mb-3 d-flex gap-2">
//                           <button type="button" className="btn btn-success w-50" onClick={verifyEmailOtp}>Verify Email OTP</button>
//                           <button type="button" className="btn btn-success w-50" onClick={verifyPhoneOtp}>Verify Phone OTP</button>
//                         </div>
//                       </>
//                     )}
//                     {message.text && (
//                       <p
//                         className={`fw-medium ${
//                           message.type === "success"
//                             ? "text-success"
//                             : "text-danger"
//                         }`}
//                       >
//                         {message.text}
//                       </p>
//                     )}
//                     <div className="d-flex align-items-center justify-content-between mb-3">
//                       <div className="form-check form-check-md d-flex align-items-center">
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           defaultValue=""
//                           id="checkebox-md"
//                           defaultChecked
//                         />
//                         <label
//                           className="form-check-label"
//                           htmlFor="checkebox-md"
//                         >
//                           I agree to the{" "}
//                           <Link to="#" className="text-primary link-hover">
//                             Terms &amp; Privacy
//                           </Link>
//                         </label>
//                       </div>
//                     </div>
//                     <div className="mb-3">
//                       <button
//                         onClick={handleRegister}
//                         // to={route.login}
//                         className="btn btn-primary w-100"
//                       >
//                         {isLoading ? (
//                           <span
//                             className="spinner-border spinner-border-sm me-2"
//                             role="status"
//                             aria-hidden="true"
//                           ></span>
//                         ) : (
//                           "Sign Up"
//                         )}
//                       </button>
//                     </div>
//                     <div className="mb-3">
//                       <h6>
//                         Already have an account?{" "}
//                         <Link
//                           to={route.login}
//                           className="text-purple link-hover"
//                         >
//                           {" "}
//                           Sign In Instead
//                         </Link>
//                       </h6>
//                     </div>
//                     {/* <div className="form-set-login or-text mb-3">
//                       <h4>OR</h4>
//                     </div>
//                     <div className="d-flex align-items-center justify-content-center flex-wrap mb-3">
//                       <div className="text-center me-2 flex-fill">
//                         <Link
//                           to="#"
//                           className="br-10 p-2 px-4 btn bg-white d-flex align-items-center justify-content-center"
//                         >
//                           <ImageWithBasePath
//                             className="img-fluid  m-1"
//                             src="assets/img/icons/google-logo.svg"
//                             alt="Google"
//                           />
//                         </Link>
//                       </div>
//                     </div> */}
//                     {/* <div className="text-center">
//                       <p className="fw-medium text-gray">
//                         Copyright © 2025 - California Media
//                       </p>
//                     </div> */}
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;

import React, { useState } from "react";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import api from "../../core/axios/axiosInstance";
import { FaTasks } from "react-icons/fa";
import { SlPhone } from "react-icons/sl";
import PhoneInput from "react-phone-input-2";

const Register = () => {
  const route = all_routes;
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("email");

  const navigate = useNavigate();

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleRegister = async () => {
    setMessage({ text: "", type: "" });

    if (!password) {
      setMessage({ text: "Password is required", type: "error" });
      return;
    }

    if (activeTab === "phone") {
      const isPhone = /^\+[0-9]{10,15}$/.test(phoneNumber);
      if (!isPhone) {
        setMessage({ text: "Invalid phone number", type: "error" });
        return;
      }
    }

    if (activeTab === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setMessage({ text: "Invalid email address", type: "error" });
        return;
      }
    }

    try {
      setIsLoading(true);
      const payload = {
        password,
        ...(activeTab === "phone"
          ? { phonenumber: phoneNumber }
          : { email }),
      };
console.log(payload,"payloaddd");

      const res = await api.post("user/signup", payload);
      console.log(res.data, "resdata");
      
      setMessage({ text: res.data.message, type: "success" });

    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Registration failed",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="account-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 p-0">
            <div className="d-flex flex-wrap w-100 vh-100 overflow-hidden account-bg-02">
              <div className="d-flex align-items-center justify-content-center flex-wrap vh-100 overflow-auto p-4 w-100 bg-backdrop">
                <form className="flex-fill" onSubmit={(e) => e.preventDefault()}>
                  <div className="mx-auto mw-450">
                    <div className="text-center mb-4">
                      <ImageWithBasePath
                        src="assets/img/logo.svg"
                        className="img-fluid"
                        alt="Logo"
                      />
                    </div>

                    <div className="mb-3 d-flex justify-content-center gap-3">
                      <button
                        type="button"
                        className={`btn ${activeTab === "email" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => {
                          setActiveTab("email");
                          setMessage({ text: "", type: "" });
                        }}
                      >
                        Register with Email
                      </button>
                      <button
                        type="button"
                        className={`btn ${activeTab === "phone" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => {
                          setActiveTab("phone");
                          setMessage({ text: "", type: "" });
                        }}
                      >
                        Register with Phone
                      </button>
                    </div>

                    {activeTab === "email" && (
                      <div className="mb-3">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-control"
                          placeholder="Enter email"
                        />
                      </div>
                    )}

                    {activeTab === "phone" && (
                      <div className="mb-3">
                        <PhoneInput
                          country={"ae"}
                          value={phoneNumber}
                          onChange={(value) => setPhoneNumber("+" + value)}
                          enableSearch
                          inputProps={{ name: "phone" }}
                          inputStyle={{ background: "#e9f0fd" }}
                        />
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="col-form-label">Password</label>
                      <div className="pass-group">
                        <input
                          type={passwordVisibility.password ? "text" : "password"}
                          className="pass-input form-control"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                          className={`ti toggle-passwords ${
                            passwordVisibility.password ? "ti-eye" : "ti-eye-off"
                          }`}
                          onClick={() => togglePasswordVisibility("password")}
                        ></span>
                      </div>
                    </div>

                    {message.text && (
                      <p
                        className={`fw-medium ${
                          message.type === "success"
                            ? "text-success"
                            : "text-danger"
                        }`}
                      >
                        {message.text}
                      </p>
                    )}

                    <div className="mb-3">
                      <button
                        onClick={handleRegister}
                        type="button"
                        className="btn btn-primary w-100"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          "Sign Up"
                        )}
                      </button>
                    </div>

                    <div className="mb-3">
                      <h6>
                        Already have an account?{" "}
                        <Link
                          to={route.login}
                          className="text-purple link-hover"
                        >
                          Sign In Instead
                        </Link>
                      </h6>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;


// import React, { useState, useEffect } from "react";
// import ImageWithBasePath from "../../core/common/imageWithBasePath";
// import { Link, useNavigate } from "react-router-dom";
// import { all_routes } from "../router/all_routes";
// import api from "../../core/axios/axiosInstance";
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import { auth } from "../../core/utils/firebase";
// import { FaTasks } from "react-icons/fa";
// import { SlPhone } from "react-icons/sl";
// import PhoneInput from "react-phone-input-2";

// const Register = () => {
//   const route = all_routes;
//   const [passwordVisibility, setPasswordVisibility] = useState({
//     password: false,
//     confirmPassword: false,
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [password, setPassword] = useState("");
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [showOtpInput, setShowOtpInput] = useState(false);
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const [activeTab, setActiveTab] = useState("email");
//   const [verificationType, setVerificationType] = useState(null);
//   const navigate = useNavigate();

//   const togglePasswordVisibility = (field) => {
//     setPasswordVisibility((prevState) => ({
//       ...prevState,
//       [field]: !prevState[field],
//     }));
//   };

//   const handleSendOtp = async () => {
//     setMessage({ text: "", type: "" });

//     if (!password) {
//       setMessage({ text: "Password is required", type: "error" });
//       return;
//     }

//     if (activeTab === "phone") {
//       const isPhone = /^\+[0-9]{10,15}$/.test(phoneNumber);
//       if (!isPhone) {
//         setMessage({ text: "Invalid phone number", type: "error" });
//         return;
//       }

//       try {
//         setIsLoading(true);
//         if (!window.recaptchaVerifier) {
//           window.recaptchaVerifier = new RecaptchaVerifier(
//             auth,
//             "recaptcha-container",
//             {
//               size: "invisible",
//               callback: () => {},
//             }
//           );
//         }
//         const confirmationResult = await signInWithPhoneNumber(
//           auth,
//           phoneNumber,
//           window.recaptchaVerifier
//         );
//         window.confirmationResult = confirmationResult;
//         setShowOtpInput(true);
//         setVerificationType("phone");
//         setMessage({ text: "OTP sent to phone!", type: "success" });
//       } catch (err) {
//         setMessage({ text: err.message, type: "error" });
//       } finally {
//         setIsLoading(false);
//       }
//     } else if (activeTab === "email") {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email)) {
//         setMessage({ text: "Invalid email address", type: "error" });
//         return;
//       }

//       try {
//         setIsLoading(true);
//         const res = await api.post("user/signup/request-otp", { email });
//         setShowOtpInput(true);
//         setVerificationType("email");
//         setMessage({ text: "OTP sent to email!", type: "success" });
//       } catch (err) {
//         setMessage({
//           text: err.response?.data?.message || "Failed to send OTP",
//           type: "error",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const handleVerifyOtp = async () => {
//     setMessage({ text: "", type: "" });
//     if (!otp) {
//       setMessage({ text: "Please enter OTP", type: "error" });
//       return;
//     }

//     try {
//       setIsLoading(true);
//       if (verificationType === "phone") {
//         await window.confirmationResult.confirm(otp);
//       }

//       const payload = {
//         password,
//         ...(verificationType === "phone"
//           ? { phonenumber: phoneNumber }
//           : { email, otp }),
//       };

//       const res = await api.post("user/signup/verify", payload);
//       setMessage({
//         text: "Registration successful! Please login.",
//         type: "success",
//       });
//       setShowOtpInput(false);
//     } catch (err) {
//       setMessage({
//         text:
//           err.response?.data?.message ||
//           err.message ||
//           "OTP verification failed",
//         type: "error",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="account-content">
//       <div className="container-fluid">
//         <div className="row">
//           <div id="recaptcha-container" />
//           <div className="col-md-12 p-0">
//             <div className="d-flex flex-wrap w-100 vh-100 overflow-hidden account-bg-02">
//               <div className="d-flex align-items-center justify-content-center flex-wrap vh-100 overflow-auto p-4 w-100 bg-backdrop">
//                 <form
//                   className="flex-fill"
//                   onSubmit={(e) => e.preventDefault()}
//                 >
//                   <div className="mx-auto mw-450">
//                     <div className="text-center mb-4">
//                       <ImageWithBasePath
//                         src="assets/img/logo.svg"
//                         className="img-fluid"
//                         alt="Logo"
//                       />
//                     </div>
//                     {/* <div className="mb-4">
//                       <h4 className="mb-2 fs-20">Register</h4>
//                     </div> */}
//                     <div className="mb-3 d-flex justify-content-center gap-3">
//                       <button
//                         type="button"
//                         className={`btn ${activeTab === "email" ? "btn-primary" : "btn-outline-primary"}`}
//                         onClick={() => {
//                           setActiveTab("email");
//                           setShowOtpInput(false);
//                           setMessage({ text: "", type: "" });
//                           setOtp("");
//                         }}
//                       >
//                         Register with Email
//                       </button>
//                       <button
//                         type="button"
//                         className={`btn ${activeTab === "phone" ? "btn-primary" : "btn-outline-primary"}`}
//                         onClick={() => {
//                           setActiveTab("phone");
//                           setShowOtpInput(false);
//                           setMessage({ text: "", type: "" });
//                           setOtp("");
//                         }}
//                       >
//                         Register with Phone
//                       </button>
//                     </div>

//                     {activeTab === "email" && (
//                       <div className="mb-3">
//                         <input
//                           type="email"
//                           value={email}
//                           onChange={(e) => setEmail(e.target.value)}
//                           className="form-control"
//                           placeholder="Enter email"
//                           disabled={showOtpInput}
//                         />
//                       </div>
//                     )}

//                     {activeTab === "phone" && (
//                       <div className="mb-3">
//                         <PhoneInput
//                           country={"ae"}
//                           value={phoneNumber}
//                           onChange={(value) => setPhoneNumber("+" + value)}
//                           enableSearch
//                           inputProps={{ name: "phone" }}
//                           inputStyle={{ background: "#e9f0fd" }}
//                           disabled={showOtpInput}
//                         />
//                       </div>
//                     )}

//                     <div className="mb-3">
//                       <label className="col-form-label">Password</label>
//                       <div className="pass-group">
//                         <input
//                           type={
//                             passwordVisibility.password ? "text" : "password"
//                           }
//                           className="pass-input form-control"
//                           value={password}
//                           onChange={(e) => setPassword(e.target.value)}
//                           disabled={showOtpInput}
//                         />
//                         <span
//                           className={`ti toggle-passwords ${
//                             passwordVisibility.password
//                               ? "ti-eye"
//                               : "ti-eye-off"
//                           }`}
//                           onClick={() => togglePasswordVisibility("password")}
//                         ></span>
//                       </div>
//                     </div>

//                     {showOtpInput && (
//                       <>
//                         <div className="mb-3">
//                           <input
//                             type="text"
//                             value={otp}
//                             onChange={(e) => setOtp(e.target.value)}
//                             className="form-control"
//                             placeholder="Enter OTP"
//                             required
//                           />
//                         </div>
//                         <div className="mb-3 d-flex gap-2">
//                           <button
//                             type="button"
//                             className="btn btn-success w-100"
//                             onClick={handleVerifyOtp}
//                             disabled={isLoading}
//                           >
//                             {isLoading
//                               ? "Verifying..."
//                               : "Verify OTP & Register"}
//                           </button>
//                         </div>
//                       </>
//                     )}

//                     {message.text && (
//                       <p
//                         className={`fw-medium ${
//                           message.type === "success"
//                             ? "text-success"
//                             : "text-danger"
//                         }`}
//                       >
//                         {message.text}
//                       </p>
//                     )}

//                     {!showOtpInput && (
//                       <div className="mb-3">
//                         <button
//                           onClick={handleSendOtp}
//                           type="button"
//                           className="btn btn-primary w-100"
//                           disabled={isLoading}
//                         >
//                           {isLoading ? (
//                             <span
//                               className="spinner-border spinner-border-sm me-2"
//                               role="status"
//                               aria-hidden="true"
//                             ></span>
//                           ) : (
//                             "Sign Up"
//                           )}
//                         </button>
//                       </div>
//                     )}

//                     <div className="mb-3">
//                       <h6>
//                         Already have an account?{' '}
//                         <Link
//                           to={route.login}
//                           className="text-purple link-hover"
//                         >
//                           Sign In Instead
//                         </Link>
//                       </h6>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;
