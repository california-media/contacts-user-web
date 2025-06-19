import React, { useEffect, useRef, useState } from "react";
import ImageWithBasePath from "../imageWithBasePath";
import { FaPhoneAlt, FaRegEye } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { QRCode } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import PhoneInput from "react-phone-input-2";

const ShareProfile = () => {
  const qrCodeRef = useRef();
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [userProfile, setUserProfile] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });


    const modalRef = useRef(null);

  useEffect(() => {
    if (modalRef.current && window.bootstrap?.Modal) {
      const modal = new window.bootstrap.Modal(modalRef.current);
      modal.show();
    } else {
      console.warn("Bootstrap Modal is not loaded. Check script import.");
    }
  }, []);

  const { serialNumber } = useParams();
  useEffect(() => {
    const getQrCodeValue = JSON.stringify({
      firstname: userProfile.firstname,
      lastname: userProfile.lastname,
      email: userProfile.email,
      phone:
        userProfile.phonenumbers?.length > 0
          ? userProfile?.phonenumbers[0]
          : "",
    });
    setQrCodeValue(getQrCodeValue);
  }, [userProfile]);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `https://100rjobf76.execute-api.eu-north-1.amazonaws.com/shareProfile/${serialNumber}`
        );
        setUserProfile(response.data.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [serialNumber]);

  console.log("userProfile", userProfile);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleOnPhoneChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      phone: value,
    }));
  };
  return (
    <>
      <div
        className="container"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="row w-100 justify-content-center">
          <div className="col-md-4">
            <div className="dashboardProfileContainer">
              <ImageWithBasePath
                src="assets/img/profileBanner.jpeg"
                alt="Profile Banner"
                className="profileCoverImg"
              />
              <div style={{ background: "#000", position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img
                    src={userProfile.profileImageURL}
                    alt="Profile Banner"
                    className="profileCardImg"
                    style={{ border: "1px solid white" }}
                  />
                </div>
                <div style={{ padding: 20, color: "#fff", paddingBottom: 120 }}>
                  <p className="text-center fs-4 text-capitalize">
                    {userProfile.firstname} {userProfile.lastname}{" "}
                  </p>
                  <div className="profileCardTextContainer">
                    <FaPhoneAlt />
                    <p className="profileCardText">
                      {userProfile?.phonenumbers?.length > 0
                        ? userProfile?.phonenumbers[0]
                        : "No phone Number"}
                    </p>
                  </div>
                  <div className="profileCardTextContainer">
                    <IoMdMail />
                    <p className="profileCardText">{userProfile.email}</p>
                  </div>

                  <div className="profileCardQrCodeContainer">
                    <div ref={qrCodeRef}>
                      <QRCode
                        value={qrCodeValue}
                        size={150}
                        className="profileCardQrCode"
                        bgColor="#ffffff"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="profileCardLowerIcons px-4">
                <Link
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#exchange_contact"
                  type="button"
                  className="btn btn-primary"
                >
                  Exchange Contact
                </Link>
                <Link type="button" className="btn btn-primary">
                  Save Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal custom-modal fade modal-padding"
        id="exchange_contact"
        role="dialog"
             ref={modalRef}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Share Your Details with {userProfile.firstname}
              </h5>
              <button
                type="button"
                className="btn-close position-static"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="col-form-label">
                    Name <span className="text-danger"> *</span>
                  </label>
                  <input
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    type="text"
                  />
                </div>
                <div className="mb-3">
                  <label className="col-form-label">
                    Email <span className="text-danger"> *</span>
                  </label>
                  <input
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email"
                  />
                </div>

                <label className="col-form-label">
                  Phone <span className="text-danger">*</span>
                </label>
                <PhoneInput
                  country={"ae"} // Default country
                  value={formData.phone}
                  onChange={handleOnPhoneChange}
                  enableSearch
                  name="phone"
                  inputProps={{
                    name: "phone",
                    required: true,
                    autoFocus: true,
                  }}
                />
                <div className="mt-3">
                  <input type="checkbox" id="register" className="me-2" />
                  <label htmlFor="register">Register for free</label>
                </div>
                <div className="col-lg-12 text-end modal-btn mt-4">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                    id="closeMeetingModal"
                  >
                    Cancel
                  </Link>
                  <button
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    type="button"
                    onClick={() => {}}
                  >
                    Connect
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareProfile;
