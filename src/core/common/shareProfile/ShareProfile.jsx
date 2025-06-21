import React, { useEffect, useRef, useState } from "react";
import ImageWithBasePath from "../imageWithBasePath";
import { FaPhoneAlt, FaRegEye } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { QRCode } from "antd";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import AvatarInitialStyles from "../nameInitialStyles/AvatarInitialStyles";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const ShareProfile = () => {
  const qrCodeRef = useRef();
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [userProfile, setUserProfile] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
  });
  console.log(userProfile, "userProfile from ShareProfile");

  const modalRef = useRef(null);

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
  const handleSaveContact = () => {
    if (!userProfile.firstname && !userProfile.lastname) return;

    const vCardData = `
BEGIN:VCARD
VERSION:3.0
N:${userProfile.lastname};${userProfile.firstname}
FN:${userProfile.firstname} ${userProfile.lastname}
EMAIL:${userProfile.email || ""}
TEL:${userProfile.phonenumbers?.[0] || ""}
END:VCARD
  `.trim();

    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${userProfile.firstname || "contact"}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
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
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.click();
    }
  }, []);
  const handleExchangeSubmit = async (e) => {
    e.preventDefault();

    if (isChecked) {
      const payload = {
        password: formData.password,
        ...(formData.email
          ? { email: formData.email }
          : { phonenumber: formData.phone }),
      };

      const response = await axios.post(
        "https://100rjobf76.execute-api.eu-north-1.amazonaws.com/user/signup",
        payload
      );
      console.log(response.data, "response.data from register API");
    }

    const formDataToSend = {
      // "ScannerID" : "6855292146730e89660d6c12",
      UserID: userProfile._id,
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      phonenumber: formData.phone,
    };
    const response = await axios.post(
      "https://100rjobf76.execute-api.eu-north-1.amazonaws.com/scan",
      formDataToSend
    );
    console.log(response.data, "response.data from scan API");
  };
  return (
    <>
      <div
        className="container my-auto"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="row w-100 justify-content-center">
          <div className="col-md-5">
            <div className="dashboardProfileContainer">
              <ImageWithBasePath
                src="assets/img/profileBanner.jpeg"
                alt="Profile Banner"
                className="profileCoverImg"
              />
              <div style={{ background: "#000", position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {/* <img
                    src={userProfile.profileImageURL}
                    alt="Profile Banner"
                    className="profileCardImg"
                    style={{ border: "1px solid white" }}
                  /> */}
                  {userProfile.profileImageURL ? (
                    <div className="profileCardImg">
                      <AvatarInitialStyles
                        name={`${userProfile.firstname} ${userProfile.lastname}`}
                      />
                    </div>
                  ) : (
                    <img
                      src={userProfile.profileImageURL}
                      alt="Profile Banner"
                      className="profileCardImg"
                      style={{ border: "1px solid white" }}
                    />
                  )}
                </div>
                <div style={{ padding: 20, color: "#fff", paddingBottom: 120 }}>
                  <p className="text-center fs-4 text-capitalize mb-0">
                    {userProfile.firstname} {userProfile.lastname}{" "}
                  </p>
                  {userProfile.designation && (
                    <p className="text-center fs-6">
                      <i>{userProfile.designation}</i>
                    </p>
                  )}
                  {userProfile?.phonenumbers?.length > 0 && (
                    <div className="profileCardTextContainer">
                      <FaPhoneAlt />
                      <p className="profileCardText">
                        {userProfile?.phonenumbers?.length > 0
                          ? userProfile?.phonenumbers[0]
                          : "No phone Number"}
                      </p>
                    </div>
                  )}
                  {userProfile.email && (
                    <div className="profileCardTextContainer">
                      <IoMdMail />
                      <p className="profileCardText">{userProfile.email}</p>
                    </div>
                  )}

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

              <div className="profileCardLowerIcons px-4 d-flex flex-wrap gap-3 justify-content-start">
                {userProfile?.phonenumbers?.length > 0 && (
                  <OverlayTrigger
                    placement="bottom"
                      overlay={
                        <Tooltip id="tooltip-bottom">Phone Number</Tooltip>
                      }
                  >
                    <a
                      href={`tel:${userProfile.phonenumbers[0]}`}
                      className="icon-wrapper phone"
                    >
                      <img
                        src="/assets/img/icons/phoneCallIcon.png"
                        alt="Phone"
                      />
                    </a>
                  </OverlayTrigger>
                )}
                {userProfile.email && (
                   <OverlayTrigger
                    placement="bottom"
                      overlay={
                        <Tooltip id="tooltip-bottom">Email</Tooltip>
                      }
                  >
                  <a
                    href={`mailto:${userProfile.email}`}
                    className="icon-wrapper mail"
                  >
                    <img src="/assets/img/icons/mailIcon.png" alt="Mail" />
                  </a>
                  </OverlayTrigger>
                )}
                {userProfile?.phonenumbers?.length > 0 && (
                   <OverlayTrigger
                    placement="bottom"
                      overlay={
                        <Tooltip id="tooltip-bottom">Whatsapp</Tooltip>
                      }
                  >
                  <a
                    href={`https://wa.me/${userProfile?.phonenumbers?.[0]}`}
                    target="_blank"
                    className="icon-wrapper whatsapp no-filter"
                  >
                    <img
                      src="/assets/img/icons/whatsappIcon96.png"
                      alt="WhatsApp"
                    />
                  </a>
                  </OverlayTrigger>
                )}
                {userProfile.instagram && (
                   <OverlayTrigger
                    placement="bottom"
                      overlay={
                        <Tooltip id="tooltip-bottom">Instagram</Tooltip>
                      }
                  >
                  <a
                    href={userProfile.instagram}
                    target="_blank"
                    className="icon-wrapper instagram no-filter"
                  >
                    <img
                      src="/assets/img/icons/instagramIcon.png"
                      alt="Instagram"
                    />
                  </a>
                  </OverlayTrigger>
                )}
                {userProfile.twitter && (
                   <OverlayTrigger
                    placement="bottom"
                      overlay={
                        <Tooltip id="tooltip-bottom">Twitter</Tooltip>
                      }
                  >
                  <a
                    href={userProfile.twitter}
                    target="_blank"
                    className="icon-wrapper twitter no-filter"
                  >
                    <img
                      src="/assets/img/icons/twitterIcon.png"
                      alt="Twitter"
                    />
                  </a>
                  </OverlayTrigger>
                )}
                {userProfile.linkedin && (
                   <OverlayTrigger
                    placement="bottom"
                      overlay={
                        <Tooltip id="tooltip-bottom">Linkedin</Tooltip>
                      }
                  >
                  <a
                    href={userProfile.linkedin}
                    target="_blank"
                    className="icon-wrapper linkedin no-filter"
                  >
                    <img
                      src="/assets/img/icons/linkedinIcon.png"
                      alt="LinkedIn"
                    />
                  </a>
                  </OverlayTrigger>
                )}
                {userProfile.facebook && (
                   <OverlayTrigger
                    placement="bottom"
                      overlay={
                        <Tooltip id="tooltip-bottom">Facebook</Tooltip>
                      }
                  >
                  <a
                    href={userProfile.facebook}
                    target="_blank"
                    className="icon-wrapper facebook no-filter"
                  >
                    <img
                      src="/assets/img/icons/facebookIcon.png"
                      alt="Facebook"
                    />
                  </a>
                  </OverlayTrigger>
                )}
                {userProfile.telegram && (
                   <OverlayTrigger
                    placement="bottom"
                      overlay={
                        <Tooltip id="tooltip-bottom">Telegram</Tooltip>
                      }
                  >
                  <a
                    href={userProfile.telegram}
                    target="_blank"
                    className="icon-wrapper telegram no-filter"
                  >
                    <img
                      src="/assets/img/icons/telegramIcon.png"
                      alt="Telegram"
                    />
                  </a>
                  </OverlayTrigger>
                )}
              </div>

            </div>
            <div className="d-flex justify-content-between mt-5">
              <Link
                to="#"
                data-bs-toggle="modal"
                data-bs-target="#exchange_contact"
                type="button"
                className="btn btn-primary"
                ref={modalRef}
              >
                Connect
              </Link>
              <Link
                type="button"
                className="btn btn-primary"
                onClick={handleSaveContact}
              >
                <img
                  src="/assets/img/icons/downloadIcon.png"
                  style={{ width: 20 }}
                  alt=""
                />
                <span className="ms-2">Save Contact</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal custom-modal fade modal-padding"
        id="exchange_contact"
        role="dialog"
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
              <form onSubmit={handleExchangeSubmit}>
                <div className="d-flex justify-content-between gap-2">
                  <div className="mb-3 w-100">
                    <label className="col-form-label">
                      First Name <span className="text-danger"> *</span>
                    </label>
                    <input
                      className="form-control"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleInputChange}
                      type="text"
                    />
                  </div>
                  <div className="mb-3 w-100">
                    <label className="col-form-label">
                      Last Name <span className="text-danger"> *</span>
                    </label>
                    <input
                      className="form-control"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleInputChange}
                      type="text"
                    />
                  </div>
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

                <div className="mb-3">
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
                </div>

                {showSocialLinks && (
                  <>
                    <div className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">
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
                          aria-label="Instagram"
                          aria-describedby="basic-addon1"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">
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
                          aria-label="Twitter"
                          aria-describedby="basic-addon1"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">
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
                          aria-label=" Linkedin"
                          aria-describedby="basic-addon1"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">
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
                          aria-label="Facebook"
                          aria-describedby="basic-addon1"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">
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
                          aria-label="Telegram"
                          aria-describedby="basic-addon1"
                        />
                      </div>
                    </div>
                  </>
                )}

                {isChecked && (
                  <div className="mb-3">
                    <label className="col-form-label">
                      Password <span className="text-danger"> *</span>
                    </label>
                    <input
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      type="password"
                    />
                  </div>
                )}

                <div className="mt-3">
                  <input
                    type="checkbox"
                    id="register"
                    className="me-2"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                  <label htmlFor="register">Register for free</label>
                </div>
                {statusMessage.text && (
                  <div
                    className={`mt-3 fw-bold ${
                      statusMessage.type === "success"
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {statusMessage.text}
                  </div>
                )}
                <div className="text-center my-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary rounded-pill px-4 d-inline-flex align-items-center gap-2 show-more-btn"
                    onClick={() => setShowSocialLinks(!showSocialLinks)}
                  >
                    {showSocialLinks ? "Hide Social Links" : "Show More"}
                  </button>
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
                    type="submit"
                    onClick={handleExchangeSubmit}
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
