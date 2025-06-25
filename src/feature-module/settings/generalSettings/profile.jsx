import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { editProfile } from "../../../core/data/redux/slices/ProfileSlice";
import AvatarInitialStyles from "../../../core/common/nameInitialStyles/AvatarInitialStyles";

const route = all_routes;

const Profile = () => {
  const userProfile = useSelector((state) => state.profile);

  console.log(userProfile, "userProfile");

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumbers: "",
    profileImage: null,
    instagram: "",
    twitter: "",
    linkedin: "",
    facebook: "",
    telegram: "",
    designation: "",
  });

  const handleOnPhoneChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      phoneNumbers: value,
    }));
  };
  console.log(formData, "formDataa");

  useEffect(() => {
    if (userProfile) {
      setFormData({
        firstname: userProfile.firstname || "",
        lastname: userProfile.lastname || "",
        email: userProfile.email || "",
        phoneNumbers: userProfile?.phonenumbers[0] || "",
        profileImage: userProfile.profileImageURL || null,
        instagram: userProfile.instagram || "",
        twitter: userProfile.twitter || "",
        linkedin: userProfile.linkedin || "",
        facebook: userProfile.facebook || "",
        telegram: userProfile.telegram || "",
        designation: userProfile.designation || "",
      });
    }
  }, [userProfile]);
  console.log(formData.profileImage, "formData image");

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append("firstname", formData.firstname);
    data.append("lastname", formData.lastname);
    data.append("email", formData.email);
    data.append("phonenumbers", formData.phoneNumbers);
    // data.append("profileImage", formData.profileImage);
    if (formData.profileImage === null) {
  data.append("profileImage", null);
} else if (formData.profileImage instanceof File) {
  data.append("profileImage", formData.profileImage);
}
    // if (formData.profileImage instanceof File) {
    //   data.append("profileImage", formData.profileImage);
    // }
    data.append("instagram", formData.instagram);
    data.append("twitter", formData.twitter);
    data.append("linkedin", formData.linkedin);
    data.append("facebook", formData.facebook);
    data.append("telegram", formData.telegram);
    data.append("designation", formData.designation);
    console.log(Object.fromEntries(data.entries()), "formData before dispatch");

    dispatch(editProfile(data));
    setIsLoading(false);
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
                    <h4 className="fw-semibold mb-3">Personal Details</h4>
                    <form onSubmit={handleEditProfile}>
                      <div className="mb-3 d-flex justify-content-between align-items-center">
                        <div className="profile-upload">
                          {/* <div className="profile-upload-img">
                            {!formData.profileImage && (
                              <span>
                                <i className="ti ti-photo" />
                              </span>
                            )}
                            <img
                              // id="ImgPreview"
                              src={
                                formData.profileImage instanceof File
                                  ? URL.createObjectURL(formData.profileImage)
                                  : formData.profileImage
                              }
                              alt="Profile"
                              // className="preview1"
                            />
                            <button
                              type="button"
                              id="removeImage1"
                              className="profile-remove"
                            >
                              <i className="feather-x" />
                            </button>
                          </div> */}

                          <div
                            className="profile-upload-img position-relative"
                            style={{
                              border: formData.profileImage
                                ? ""
                                : "2px dashed #E8E8E8",
                            }}
                          >{console.log(formData.profileImage,"formData.profileImage")
                          }
                            {formData.profileImage && (
                              <Link
                                style={{
                                  width: 20,
                                  height: 20,
                                  top: -5,
                                  right: -5,
                                }}
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    profileImage: null,
                                  }))
                                }
                                id="removeImage1"
                                className="position-absolute p-1 bg-danger text-white d-flex justify-content-center align-items-center rounded-circle"
                              >
                                <i className="feather-x" />
                              </Link>
                            )}
                            {!formData.profileImage ? (
                              <AvatarInitialStyles
                                name={`${formData.firstname} ${formData.lastname}`}
                                divStyles={{width: 80, height: 80}}
                              />
                            ) : (
                              <img
                                src={
                                  formData.profileImage instanceof File
                                    ? URL.createObjectURL(formData.profileImage)
                                    : formData.profileImage
                                }
                                alt="Profile"
                              />
                            )}
                          </div>
                          <div className="profile-upload-content">
                            <label className="profile-upload-btn">
                              <i className="ti ti-file-broken" /> Upload Photo
                              <input
                                type="file"
                                id="imag"
                                className="input-img"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    setFormData((prev) => ({
                                      ...prev,
                                      profileImage: file,
                                    }));
                                  }
                                }}
                              />
                            </label>
                            <p>Supported file types PNG, JPG</p>
                          </div>
                        </div>
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
                                Designation{" "}
                                <span className="text-grey">
                                  <i>(job profile)</i>
                                </span>
                              </label>
                              <input
                                type="text"
                                name="designation"
                                value={formData.designation}
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
                                country={"ae"} // Default country
                                value={formData.phoneNumbers}
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
                        <div className="row mt-4">
                          <h4 className="fw-semibold mb-3">Social Profiles</h4>
                          <div className="col-md-4">
                            <div className="mb-3 row">
                              <div className="input-group">
                                <span
                                  className="input-group-text"
                                  id="basic-addon1"
                                >
                                  <img
                                    src="/assets/img/icons/instagramIcon.png"
                                    alt="Instagram"
                                    style={{ width: 20, height: 20 }}
                                  />
                                </span>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Instagram"
                                  name="instagram"
                                  value={formData.instagram}
                                  onChange={handleChange}
                                  aria-label="Instagram"
                                  aria-describedby="basic-addon1"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3 row">
                              <div className="input-group">
                                <span
                                  className="input-group-text"
                                  id="basic-addon1"
                                >
                                  <img
                                    src="/assets/img/icons/twitterIcon.png"
                                    alt="Instagram"
                                    style={{ width: 20, height: 20 }}
                                  />
                                </span>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Twitter"
                                  name="twitter"
                                  value={formData.twitter}
                                  onChange={handleChange}
                                  aria-label="Twitter"
                                  aria-describedby="basic-addon1"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3 row">
                              <div className="input-group">
                                <span
                                  className="input-group-text"
                                  id="basic-addon1"
                                >
                                  <img
                                    src="/assets/img/icons/linkedinIcon.png"
                                    alt="Instagram"
                                    style={{ width: 20, height: 20 }}
                                  />
                                </span>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Linkedin"
                                  name="linkedin"
                                  value={formData.linkedin}
                                  onChange={handleChange}
                                  aria-label="Linkedin"
                                  aria-describedby="basic-addon1"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3 row">
                              <div className="input-group">
                                <span
                                  className="input-group-text"
                                  id="basic-addon1"
                                >
                                  <img
                                    src="/assets/img/icons/facebookIcon.png"
                                    alt="Instagram"
                                    style={{ width: 20, height: 20 }}
                                  />
                                </span>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Facebook"
                                  value={formData.facebook}
                                  onChange={handleChange}
                                  name="facebook"
                                  aria-label="Facebook"
                                  aria-describedby="basic-addon1"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3 row">
                              <div className="input-group">
                                <span
                                  className="input-group-text"
                                  id="basic-addon1"
                                >
                                  <img
                                    src="/assets/img/icons/telegramIcon.png"
                                    alt="Instagram"
                                    style={{ width: 20, height: 20 }}
                                  />
                                </span>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Telegram"
                                  name="telegram"
                                  aria-label="Telegram"
                                  aria-describedby="basic-addon1"
                                />
                              </div>
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
