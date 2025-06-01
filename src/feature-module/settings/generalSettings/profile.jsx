// import React, { useState } from "react";
// import ImageWithBasePath from "../../../core/common/imageWithBasePath";
// import { Link } from "react-router-dom";
// import { all_routes } from "../../router/all_routes";
// import CollapseHeader from "../../../core/common/collapse-header";
// import { useDispatch, useSelector } from "react-redux";
// import api from "../../../core/axios/axiosInstance";
// import "react-phone-input-2/lib/bootstrap.css";
// import PhoneInput from "react-phone-input-2";
// import { editProfile } from "../../../core/data/redux/slices/ProfileSlice";
// const route = all_routes;
// const Profile = () => {
//   const userProfile = useSelector((state) => state.profile);

//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const [profileFirstName, setProfileFirstName] = useState(
//     userProfile.firstname
//   );
//   const [profileLastName, setProfileLastName] = useState(userProfile.lastname);
//   const [profileEmail, setProfileEmail] = useState(userProfile.email);
//   const [profilePhoneNumber, setProfilePhoneNumber] = useState(
//     userProfile?.phonenumber?.number
//   );
//   const [profileCountryCode, setProfileCountryCode] = useState(
//     userProfile?.phonenumber?.countryCode
//   );

//   const dispatch = useDispatch();

//   const handleEditProfile = async (e) => {
//     setIsLoading(true);
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("firstname", profileFirstName);
//     formData.append("lastname", profileLastName);
//     formData.append("email", profileEmail)
//     formData.append("number", profilePhoneNumber);
//     formData.append("countryCode", profileCountryCode);

//     dispatch(editProfile(formData))
//   };
//   const handlePhoneInputChange = (value, data) => {
//     const countryCode = data.dialCode;
//     const phoneNumberWithoutCountryCode = value
//       .replace(data.dialCode, "")
//       .trim();

//     setProfileCountryCode(countryCode);
//     setProfilePhoneNumber(phoneNumberWithoutCountryCode);
//   };
//   return (
//     <div className="page-wrapper">
//       <div className="content">
//         <div className="row">
//           <div className="col-md-12">
//             <div className="row">
//               <div className="col-xl-3 col-lg-12 theiaStickySidebar">
//                 {/* Settings Sidebar */}
//                 <div className="card">
//                   <div className="card-body">
//                     <div className="settings-sidebar">
//                       <h4 className="fw-semibold mb-3">Settings</h4>
//                       <div className="list-group list-group-flush settings-sidebar">
//                         <Link to={route.profile} className="fw-medium active">
//                           Profile
//                         </Link>
//                         <Link to={route.security} className="fw-medium">
//                           Security
//                         </Link>
//                         <Link to={route.emailSetup} className="fw-medium">
//                           Connected Mails
//                         </Link>
//                         <Link to={route.myScans} className="fw-medium">
//                           My Scans
//                         </Link>
//                         <Link to={route.upgradePlan} className="fw-medium">
//                           Upgrade Plan
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 {/* /Settings Sidebar */}
//               </div>
//               <div className="col-xl-9 col-lg-12">
//                 {/* Settings Info */}
//                 <div className="card">
//                   <div className="card-body">
//                     <h4 className="fw-semibold mb-3">Profile Settings</h4>
//                     <form onSubmit={handleEditProfile}>
//                       <div className="mb-3 d-flex justify-content-between align-items-center">
//                         <div className="profile-upload">
//                           <div className="profile-upload-img">
//                             <span>
//                               <i className="ti ti-photo" />
//                             </span>
//                             <img
//                               id="ImgPreview"
//                               src="assets/img/profiles/avatar-02.jpg"
//                               alt="img"
//                               className="preview1"
//                             />
//                             <button
//                               type="button"
//                               id="removeImage1"
//                               className="profile-remove"
//                             >
//                               <i className="feather-x" />
//                             </button>
//                           </div>
//                           <div className="profile-upload-content">
//                             <label className="profile-upload-btn">
//                               <i className="ti ti-file-broken" /> Upload File
//                               <input
//                                 type="file"
//                                 id="imag"
//                                 className="input-img"
//                               />
//                             </label>
//                             <p>JPG, GIF or PNG. Max size of 800K</p>
//                           </div>
//                         </div>
//                         <ImageWithBasePath
//                           src="assets/img/myQr.png"
//                           className="img-fluid"
//                           width={150}
//                           height={150}
//                           alt="Logo"
//                         />
//                       </div>
//                       <div className="border-bottom mb-3">
//                         <div className="row">
//                           <div className="col-md-4">
//                             <div className="mb-3">
//                               <label className="form-label">
//                                 First Name{" "}
//                                 <span className="text-danger">*</span>
//                               </label>
//                               <input
//                                 type="text"
//                                 value={profileFirstName}
//                                 onChange={(e) => {
//                                   setProfileFirstName(e.target.value);
//                                 }}
//                                 className="form-control"
//                               />
//                             </div>
//                           </div>
//                           <div className="col-md-4">
//                             <div className="mb-3">
//                               <label className="form-label">
//                                 Last Name <span className="text-danger">*</span>
//                               </label>
//                               <input
//                                 type="text"
//                                 value={profileLastName}
//                                 onChange={(e) => {
//                                   setProfileLastName(e.target.value);
//                                 }}
//                                 className="form-control"
//                               />
//                             </div>
//                           </div>
//                           <div className="col-md-4">
//                             <div className="mb-3">
//                               <label className="form-label">
//                                 Phone Number{" "}
//                                 <span className="text-danger">*</span>
//                               </label>
//                               <PhoneInput
//                                 // country={"ae"}
//                                 // value={""}
//                                 value={profileCountryCode + profilePhoneNumber}
//                                 inputStyle={{ display: "block" }}
//                                 onChange={handlePhoneInputChange}
//                                 enableSearch
//                                 searchPlaceholder="Search..."
//                                 // searchStyle={{ width: 280, marginLeft: 0 }}
//                               />
//                             </div>
//                           </div>
//                           <div className="col-md-4">
//                             <div className="mb-3">
//                               <label className="form-label">
//                                 Email <span className="text-danger">*</span>
//                               </label>
//                               <input
//                                 type="text"
//                                 value={profileEmail}
//                                 onChange={(e) => {
//                                   setProfileEmail(e.target.value);
//                                 }}
//                                 className="form-control"
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       {message.text && (
//                         <p
//                           className={`fw-medium ${
//                             message.type === "success"
//                               ? "text-success"
//                               : "text-danger"
//                           }`}
//                         >
//                           {message.text}
//                         </p>
//                       )}
//                       {/* <div className="row">
//                         <div className="col-md-12">
//                           <div className="mb-3">
//                             <label className="form-label">
//                               Address <span className="text-danger">*</span>
//                             </label>
//                             <input type="text" className="form-control" />
//                           </div>
//                         </div>
//                       </div> */}
//                       <div>
//                         <Link to="#" className="btn btn-light me-2">
//                           Cancel
//                         </Link>
//                         <button
//                           type="submit"
//                           className="btn btn-primary"
//                           style={{ width: 150 }}
//                         >
//                           Save Changes
//                         </button>
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//                 {/* /Settings Info */}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { editProfile } from "../../../core/data/redux/slices/ProfileSlice";

const route = all_routes;

const Profile = () => {
  const userProfile = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  console.log(userProfile, "userProfile");

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumbers: "",
  });

  const handleOnPhoneChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      phoneNumbers: value,
    }));
  };

  useEffect(() => {
    if (userProfile) {
      setFormData({
        firstname: userProfile.firstname || "",
        lastname: userProfile.lastname || "",
        email: userProfile.email || "",
        phoneNumber: userProfile?.phonenumber?.number || "",
      });
    }
  }, [userProfile]);
  console.log(userProfile, "user profile from profile");

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append("firstname", formData.firstname);
    data.append("lastname", formData.lastname);
    data.append("email", formData.email);
    data.append("numbernumbers", formData.phoneNumbers);
console.log(Object.fromEntries(data),"profile data before going to redux");

    dispatch(editProfile(data));
    setIsLoading(false);
  };

  const handlePhoneInputChange = (value, data) => {
    const code = data.dialCode;
    const number = value.replace(code, "").trim();

    setFormData((prev) => ({
      ...prev,
      countryCode: code,
      phoneNumber: number,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <div className="col-xl-3 col-lg-12 theiaStickySidebar">
                <div className="card">
                  <div className="card-body">
                    <div className="settings-sidebar">
                      <h4 className="fw-semibold mb-3">Settings</h4>
                      <div className="list-group list-group-flush settings-sidebar">
                        <Link to={route.profile} className="fw-medium active">
                          Profile
                        </Link>
                        <Link to={route.security} className="fw-medium">
                          Security
                        </Link>
                        <Link to={route.emailSetup} className="fw-medium">
                          Connected Mails
                        </Link>
                        <Link to={route.myScans} className="fw-medium">
                          My Scans
                        </Link>
                        <Link to={route.upgradePlan} className="fw-medium">
                          Upgrade Plan
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-9 col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h4 className="fw-semibold mb-3">Profile Settings</h4>
                    <form onSubmit={handleEditProfile}>
                      <div className="mb-3 d-flex justify-content-between align-items-center">
                        <div className="profile-upload">
                          <div className="profile-upload-img">
                            <span>
                              <i className="ti ti-photo" />
                            </span>
                            <img
                              id="ImgPreview"
                              src="assets/img/profiles/avatar-02.jpg"
                              alt="Profile"
                              className="preview1"
                            />
                            <button
                              type="button"
                              id="removeImage1"
                              className="profile-remove"
                            >
                              <i className="feather-x" />
                            </button>
                          </div>
                          <div className="profile-upload-content">
                            <label className="profile-upload-btn">
                              <i className="ti ti-file-broken" /> Upload File
                              <input
                                type="file"
                                id="imag"
                                className="input-img"
                              />
                            </label>
                            <p>JPG, GIF or PNG. Max size of 800K</p>
                          </div>
                        </div>

                        {/* <ImageWithBasePath
                          src="assets/img/myQr.png"
                          className="img-fluid"
                          width={150}
                          height={150}
                          alt="QR Code"
                        /> */}
                      </div>

                      <div className="border-bottom mb-3">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="mb-3">
                              <label className="form-label">
                                First Name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                className="form-control"
                              />
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="mb-3">
                              <label className="form-label">
                                Last Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                className="form-control"
                              />
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="mb-3">
                              <label className="form-label">
                                Phone Number{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <PhoneInput
                                country={"us"} // Default country
                                value={formData.phone}
                                onChange={handleOnPhoneChange}
                                enableSearch
                                inputProps={{
                                  name: "phone",
                                  required: true,
                                  autoFocus: true,
                                }}
                              />
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="mb-3">
                              <label className="form-label">
                                Email <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-control"
                              />
                            </div>
                          </div>
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

                      <div>
                        <Link to="#" className="btn btn-light me-2">
                          Cancel
                        </Link>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          style={{ width: 150 }}
                          disabled={isLoading}
                        >
                          {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {/* /Settings Info */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
