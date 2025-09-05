import React, { useRef, useState, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import { useDispatch } from "react-redux";
import { showToast } from "../../../data/redux/slices/ToastSlice";

import api from "../../../../core/axios/axiosInstance";

const UserOffcanvas = ({ selectedUser, setUserInfo, loading, setLoading }) => {
  const [originalData, setOriginalData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    designation: "",
    linkedin: "",
    instagram: "",
    telegram: "",
    twitter: "",
    facebook: "",
    companyName: "",
    goals: "",
    categories: "",
    employeeCount: "",
    helps: [],
    profileImage: null,
  });

  // Initialize form data when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      const phoneNumber = selectedUser.phonenumbers?.[0]
        ? `+${selectedUser.phonenumbers[0].countryCode}${selectedUser.phonenumbers[0].number}`
        : "";

      const initialData = {
        firstname: selectedUser.firstname || "",
        lastname: selectedUser.lastname || "",
        email: selectedUser.email || "",
        phonenumber: phoneNumber,
        designation: selectedUser.designation || "",
        linkedin: selectedUser.linkedin || "",
        instagram: selectedUser.instagram || "",
        telegram: selectedUser.telegram || "",
        twitter: selectedUser.twitter || "",
        facebook: selectedUser.facebook || "",
        gender: selectedUser.gender || "", // NEW: Add gender
        companyName: selectedUser.userInfo?.companyName || "",
        goals: selectedUser.userInfo?.goals || "", // This will now be radio, but keep as string
        categories: selectedUser.userInfo?.categories || "", // This will now be radio, but keep as string
        employeeCount: selectedUser.userInfo?.employeeCount || "",
        helps: selectedUser.userInfo?.helps || [],
        profileImage: null,
      };

      setFormData(initialData);
      // Store original data for comparison
      setOriginalData({ ...initialData });
    }
  }, [selectedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOnPhoneChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      phonenumber: value,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        profileImage: file,
      }));
    }
  };

  const handleHelpsChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      helps: checked
        ? [...prevData.helps, value]
        : prevData.helps.filter((help) => help !== value),
    }));
  };

  const getChangedData = () => {
    const changedData = {};

    // Compare each field with original data
    Object.keys(formData).forEach((key) => {
      if (key === "profileImage") {
        // Always include profile image if it's been changed (not null)
        if (formData[key]) {
          changedData[key] = formData[key];
        }
      } else if (key === "helps") {
        // Compare arrays - only include if they're different
        const originalHelps = originalData[key] || [];
        const currentHelps = formData[key] || [];

        // Check if arrays are different (order doesn't matter)
        const areArraysEqual =
          originalHelps.length === currentHelps.length &&
          originalHelps.every((item) => currentHelps.includes(item)) &&
          currentHelps.every((item) => originalHelps.includes(item));

        if (!areArraysEqual) {
          changedData[key] = currentHelps;
        }
      } else {
        // Compare strings and other values
        if (formData[key] !== originalData[key]) {
          changedData[key] = formData[key];
        }
      }
    });

    return changedData;
  };

  const handleUpdateUser = async () => {
    if (!selectedUser?.id) {
      return;
    }

    const changedData = getChangedData();

    // If no changes, show message and return
    if (Object.keys(changedData).length === 0) {
      dispatch(
        showToast({
          message: "No changes detected",
          variant: "info",
        })
      );
      return;
    }

    setLoading(true);
    setIsSubmitting(true);
    const formDataObj = new FormData();

    // Only append changed fields
    Object.keys(changedData).forEach((key) => {
      if (key === "helps") {
        formDataObj.append("helps", JSON.stringify(changedData.helps));
      } else if (key === "profileImage" && changedData.profileImage) {
        formDataObj.append("profileImage", changedData.profileImage);
      } else if (changedData[key] !== null && changedData[key] !== undefined) {
        formDataObj.append(key, changedData[key]);
      }
    });

    try {
      const response = await api.put(
        `/admin/users/${selectedUser.id}`,
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        // Update the user info in parent component
        setUserInfo(response.data.data);

        // Close the offcanvas
        document.getElementById("closeUserOffcanvas")?.click();

        // Show success toast
        dispatch(
          showToast({
            message: "User updated successfully!",
            variant: "success",
          })
        );

        // Reset original data to new values
        const phoneNumber = response.data.data.phonenumbers?.[0]
          ? `+${response.data.data.phonenumbers[0].countryCode}${response.data.data.phonenumbers[0].number}`
          : "";

        const newOriginalData = {
          firstname: response.data.data.firstname || "",
          lastname: response.data.data.lastname || "",
          email: response.data.data.email || "",
          phonenumber: phoneNumber,
          designation: response.data.data.designation || "",
          linkedin: response.data.data.linkedin || "",
          instagram: response.data.data.instagram || "",
          telegram: response.data.data.telegram || "",
          twitter: response.data.data.twitter || "",
          facebook: response.data.data.facebook || "",
          gender: response.data.data.gender || "", // NEW: Add gender
          companyName: response.data.data.userInfo?.companyName || "",
          goals: response.data.data.userInfo?.goals || "",
          categories: response.data.data.userInfo?.categories || "",
          employeeCount: response.data.data.userInfo?.employeeCount || "",
          helps: response.data.data.userInfo?.helps || [],
          profileImage: null,
        };
        setOriginalData(newOriginalData);
      }
    } catch (error) {
      console.error("Error updating user:", error);

      // Show error toast
      const errorMessage =
        error.response?.data?.message ||
        "Error updating user. Please try again.";
      dispatch(
        showToast({
          message: errorMessage,
          variant: "danger",
        })
      );
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // Check if email can be edited
  const canEditEmail = !["email", "google", "linkedin"].includes(
    selectedUser?.signupMethod
  );

  // Check if phone can be edited
  const canEditPhone = selectedUser?.signupMethod !== "phoneNumber";

  const helpOptions = [
    "Managing Sales pipelines",
    "Organizing key relationships",
    "Process automation",
    "Something else",
  ];


  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="user_offcanvas"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">Edit User Profile</h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          id="closeUserOffcanvas"
        >
          <i className="ti ti-x" />
        </button>
      </div>

      <div className="offcanvas-body">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateUser();
          }}
        >
          <div className="row">
            {/* Profile Image */}
            <div className="col-md-12 d-flex justify-content-center mb-4">
              <div className="profilePic">
                <img
                  src={
                    formData.profileImage
                      ? URL.createObjectURL(formData.profileImage)
                      : selectedUser?.profileImageURL ||
                        "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                  }
                  className="profilePic cursor-pointer"
                  onClick={handleImageClick}
                  alt="Profile"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {/* First Name */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  First Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>

            {/* Last Name */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            {/* Email */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Email{" "}
                  {!canEditEmail && (
                    <span className="text-muted">(Read Only)</span>
                  )}
                </label>
                {canEditEmail ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        Email cannot be changed for accounts signed up with
                        Email, Google, or LinkedIn
                      </Tooltip>
                    }
                  >
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      className="form-control"
                      disabled
                    />
                  </OverlayTrigger>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Phone{" "}
                  {!canEditPhone && (
                    <span className="text-muted">(Read Only)</span>
                  )}
                </label>
                {canEditPhone ? (
                  <PhoneInput
                    country={"ae"}
                    value={formData.phonenumber}
                    onChange={handleOnPhoneChange}
                    enableSearch
                    inputProps={{
                      name: "phone",
                      autoFocus: false,
                    }}
                  />
                ) : (
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        Phone number cannot be changed for accounts signed up
                        with phone number
                      </Tooltip>
                    }
                  >
                    <div>
                      <PhoneInput
                        country={"ae"}
                        value={formData.phonenumber}
                        disabled
                        inputProps={{
                          name: "phone",
                          autoFocus: false,
                        }}
                      />
                    </div>
                  </OverlayTrigger>
                )}
              </div>
            </div>

            {/* Designation */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            {/* Company Name */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Gender</label>
                <div className="d-flex gap-4">
                  {["Male", "Female", "Other"].map((genderOption) => (
                    <div key={genderOption} className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id={`gender-${genderOption}`}
                        name="gender"
                        value={genderOption}
                        checked={formData.gender === genderOption}
                        onChange={handleChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`gender-${genderOption}`}
                      >
                        {genderOption}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Goals Radio */}
            <div className="col-md-12">
              <div className="mb-3">
                <label className="col-form-label">Goals</label>
                <div className="row">
                  {["For personal use", "Testing for my company", "Other"].map(
                    (goalOption) => (
                      <div key={goalOption} className="col-md-4 mb-2">
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            id={`goal-${goalOption}`}
                            name="goals"
                            value={goalOption}
                            checked={formData.goals === goalOption}
                            onChange={handleChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`goal-${goalOption}`}
                          >
                            {goalOption}
                          </label>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Categories Radio */}
            <div className="col-md-12">
              <div className="mb-3">
                <label className="col-form-label">Categories</label>
                <div className="row">
                  {[
                    "Sales",
                    "Marketing",
                    "IT",
                    "Procurement",
                    "Consultant",
                    "C-Level",
                    "HR",
                    "Field Representative",
                    "Freelancer",
                    "Other",
                  ].map((categoryOption) => (
                    <div key={categoryOption} className="col-md-4 mb-2">
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          id={`category-${categoryOption}`}
                          name="categories"
                          value={categoryOption}
                          checked={formData.categories === categoryOption}
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`category-${categoryOption}`}
                        >
                          {categoryOption}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Employee Count */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Employee Count</label>
                <select
                  name="employeeCount"
                  value={formData.employeeCount}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select Employee Count</option>
                  <option value="1-4">1-4</option>
                  <option value="5-19">5-19</option>
                  <option value="20-49">20-49</option>
                  <option value="50-99">50-99</option>
                  <option value="100-249">100-249</option>
                  <option value="250-499">250-499</option>
                  <option value="500-999">500-999</option>
                  <option value="1000+">1000+</option>
                </select>
              </div>
            </div>

            {/* Helps */}
            <div className="col-md-12">
              <div className="mb-3">
                <label className="col-form-label">Areas of Help</label>
                <div className="row">
                  {helpOptions.map((help) => (
                    <div key={help} className="col-md-4 mb-2">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`help-${help}`}
                          value={help}
                          checked={formData.helps.includes(help)}
                          onChange={handleHelpsChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`help-${help}`}
                        >
                          {help}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="col-md-12">
              <h6 className="mb-3">Social Links</h6>
            </div>

            {/* LinkedIn */}
            <div className="col-md-6">
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <img
                      src="/assets/img/icons/linkedinIcon.png"
                      alt="LinkedIn"
                      style={{ width: 20, height: 20 }}
                    />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="LinkedIn"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Instagram */}
            <div className="col-md-6">
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">
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
                  />
                </div>
              </div>
            </div>

            {/* Twitter */}
            <div className="col-md-6">
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <img
                      src="/assets/img/icons/twitterIcon.png"
                      alt="Twitter"
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
                  />
                </div>
              </div>
            </div>

            {/* Facebook */}
            <div className="col-md-6">
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <img
                      src="/assets/img/icons/facebookIcon.png"
                      alt="Facebook"
                      style={{ width: 20, height: 20 }}
                    />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Facebook"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Telegram */}
            <div className="col-md-12">
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <img
                      src="/assets/img/icons/telegramIcon.png"
                      alt="Telegram"
                      style={{ width: 20, height: 20 }}
                    />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Telegram"
                    name="telegram"
                    value={formData.telegram}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex align-items-center justify-content-end mt-4">
            <button
              type="button"
              data-bs-dismiss="offcanvas"
              className="btn btn-light me-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              data-bs-dismiss="offcanvas"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              ) : null}
              {isSubmitting ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserOffcanvas;
