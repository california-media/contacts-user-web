import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
  options,
  optionssymbol,
  optionschoose,
  optionsource,
  optionindustry,
} from "../../selectoption/selectoption";
import { SelectWithImage2 } from "../../selectWithImage2";
import { TagsInput } from "react-tag-input-component";
import CreatableSelect from "react-select/creatable";
import api from "../../../axios/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { saveContact } from "../../../data/redux/slices/ContactSlice";
import PhoneInput from "react-phone-input-2";
import { addTag } from "../../../data/redux/slices/TagSlice";
import { showToast } from "../../../data/redux/slices/ToastSlice";
import { EmailAuthContext } from "../../context/EmailAuthContext";
import { all_routes } from "../../../../feature-module/router/all_routes";
import { gapi } from "gapi-script";

const LeadOffcanvas = ({ selectedContact }) => {
  const [show, setShow] = useState(false);
  const [newContents, setNewContents] = useState([0]);
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [owner, setOwner] = useState(["Collab"]);
  const [openModal2, setOpenModal2] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [previousTags, setPreviousTags] = useState([]);
  const [removedTags, setRemovedTags] = useState([]);
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  // const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newTags, setNewTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [checkSendMailToContact, setCheckSendMailToContact] = useState(false);

  console.log(selectedContact, "gfhgfhh");

  const [formData, setFormData] = useState({
    contact_id: "",
    contactImageURL: "",
    firstName: "",
    lastName: "",
    company: "",
    designation: "",
    email: [],
    phone: "",
    tags: [],
    instagram: "",
    twitter: "",
    linkedin: "",
    facebook: "",
    telegram: "",
  });
  const { tags, loading, error } = useSelector((state) => state.tags);
  const userProfile = useSelector((state) => state.profile);
  console.log(userProfile, "userProfile");
  const dispatch = useDispatch();
  const offcanvasRef = useRef(null);
  const route = all_routes;
  const fileInputRef = useRef(null);

  const handleOnPhoneChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      phone: value,
    }));
  };

  const handleShow = () => setShow(true);
  const addNewContent = () => {
    setNewContents([...newContents, newContents.length]);
  };
  const sendEmail = async () => {
        console.log("console log 1")
    if (!formData.email) {
      alert("Email is required");
      return;
    }
    console.log("console log 2")
    const editEmailTemplateSubject = `${userProfile.firstname} - My Digital Business Card`;
    const editEmailTemplateBody = `<div style="font-family: Arial, sans-serif; color: #333;">
      <p>Hello,</p>
      <p>It was nice to meet you. Here are my contact details:</p>

      <ul style="line-height: 1.6;">
        <li><strong>Email:</strong> ${userProfile.email}</li>
        <li><strong>Phone:</strong> ${userProfile.phonenumbers[0]}</li>
        <li><strong>More Information:</strong> <a href="https://app.contacts.management/shareProfile/${userProfile.firstname}${userProfile.serialNumber}">My Digital Business Card →</a></li>
      </ul>

      <p>Best regards,</p>
      <p>
        <strong>${userProfile.firstname} ${userProfile.lastname}</strong><br/>
        ${userProfile.designation?`${userProfile.designation}<br/>`:""}
        ${userProfile.company?`${userProfile.company}`:""}
      </p>
    </div>
  `;
    console.log("console log 3")
    const headers = [
      `To: ${formData.email}`,
      `Subject: ${editEmailTemplateSubject}`,
      "Content-Type: text/html; charset=utf-8",
      "",
      `<p>${editEmailTemplateBody}</p>`,
    ];
    console.log("console log 4")
    const email = headers.join("\r\n");

    const base64EncodedEmail = btoa(
      new TextEncoder()
        .encode(email)
        .reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
        console.log("console log 5")
    try {
          console.log("console log 6")
      await gapi.client.gmail.users.messages.send({
        userId: "me",
        resource: {
          raw: base64EncodedEmail,
        },
      });
          console.log("console log 7")
      // document.getElementById("closeEmailTemplateModal")?.click();
      dispatch(
        showToast({ message: "Email Sent Successfully", variant: "success" })
      );
      // setTo("");
      // setSubject("");
      // setMessage("");
    } catch (error) {
      dispatch(
        showToast({
          message: !userProfile.googleConnected
            ? "Please Login to send Mail"
            : "Error Sending Mail",
          variant: "danger",
        })
      );
      console.error("Error sending email:", error?.result?.error?.message);
    }
  };

  const handleContact = async () => {
    setIsLoading(true);

    const formDataObj = new FormData();
console.log(formData.email,"emaillsdfsd");

    formDataObj.append("contact_id", formData.contact_id); 
    formDataObj.append("contactImage", formData.contactImageURL);
    formDataObj.append("firstname", formData.firstName);
    formDataObj.append("lastname", formData.lastName);
    formDataObj.append("company", formData.company);
    formDataObj.append("designation", formData.designation);
    formDataObj.append("emailaddresses", formData.email);
 if (selectedContact.contact_id == null) {
  formDataObj.append(
    "tags",
    JSON.stringify(
      selectedTags.map((tag) => ({ tag: tag.value, emoji: tag.emoji }))
    )
  );
}
    formDataObj.append("phonenumber", formData.phone);
    formDataObj.append("instagram", formData.instagram);
    formDataObj.append("twitter", formData.twitter);
    formDataObj.append("linkedin", formData.linkedin);
    formDataObj.append("facebook", formData.facebook);
    formDataObj.append("telegram", formData.telegram);
    try {
      if (newTags.length > 0) {
        await dispatch(addTag(newTags)).unwrap();
      }
      console.log(Object.fromEntries(formDataObj), "formdatabeforegoing");

      await dispatch(saveContact(formDataObj)).unwrap();
      document.getElementById("closeContactOffcanvas")?.click();

      if(checkSendMailToContact){
        sendEmail();
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // useEffect(() => {
  //   const tagMap = tags.map((tag) => ({
  //     value: tag.tag,
  //     label: tag.tag,
  //   }));
  //   setAllTags(tagMap);
  // }, [tags]);
  useEffect(() => {
    const filteredTags = tags.filter(
      (tag) => tag.tag_id && tag.tag && tag.emoji
    );
    const tagMap = filteredTags.map((tag) => ({
      value: tag.tag,
      label: `${tag.emoji} ${tag.tag}`,
      emoji: tag.emoji,
    }));
    setAllTags(tagMap);
  }, [tags]);

  const handleCreateTag = async (inputValue) => {
    setNewTags([...newTags, { tag: inputValue, emoji: "🏷️" }]);
    setSelectedTags([
      ...selectedTags,
      { value: inputValue, label: `🏷️ ${inputValue}`, emoji: "🏷️" },
    ]);
  };

  useEffect(() => {
    if (selectedContact?.tags) {
      const formattedTags = selectedContact.tags.map((tag) => ({
        value: tag.tag,
        label: `${tag.emoji} ${tag.tag}`,
      }));
      setSelectedTags(formattedTags);
      setPreviousTags(formattedTags);
    }
  }, [selectedContact]);

  const handleUserTags = (tags) => {
    setSelectedTags(tags);

    const tagsForApi = tags.map((tag) => tag.value);

    const removedTagsFilter = previousTags
      .filter((prevTag) => !tags.some((tag) => tag.value === prevTag.value))
      .map((tag) => tag.value);
    setRemovedTags(removedTagsFilter);
  };

  useEffect(() => {
    if (selectedContact) {
      setFormData({
        contact_id: selectedContact.contact_id || 0,
        contactImageURL: selectedContact.contactImageURL || null,
        firstName: selectedContact.firstname || "",
        lastName: selectedContact.lastname || "",
        email: selectedContact.emailaddresses || "",
        designation: selectedContact.designation || "",
        company: selectedContact.company || "",
        phone: selectedContact.phonenumbers?.[0] || "",
        tags: selectedContact.tags || [],
        instagram: selectedContact.instagram || "",
        twitter: selectedContact.twitter || "",
        linkedin: selectedContact.linkedin || "",
        facebook: selectedContact.facebook || "",
        telegram: selectedContact.telegram || "",
        
      });
    }
    setCheckSendMailToContact(false)
  }, [selectedContact, dispatch]);

  useEffect(() => {
    const offcanvasElement = document.getElementById("contact_offcanvas");

    const handleOffcanvasHide = () => {
      // setFormData({
      //   firstName: "",
      //   lastName: "",
      //   email: "",
      //   phone: "",
      // });
      // setSelectedTags([]);
      // setPreviousTags([]);
    };

    offcanvasElement.addEventListener(
      "hidden.bs.offcanvas",
      handleOffcanvasHide
    );

    return () => {
      offcanvasElement.removeEventListener(
        "hidden.bs.offcanvas",
        handleOffcanvasHide
      );
    };
  }, []);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    // if (file) {
    //   // setSelectedImage(file);
    //   formData.contactImageURL(file)
    // }
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        contactImageURL: file,
      }));
    }
  };


  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="contact_offcanvas"
      ref={offcanvasRef}
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">
          {selectedContact.contact_id == null
            ? "Add New Contact"
            : "Update Contact"}
        </h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          id="closeContactOffcanvas"
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleContact}>
          <div className="row">
            <div className="col-md-12 d-flex justify-content-center">
              <div className="profilePic">
                {/* <img
                  src="https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                  className="profilePic cursor-pointer"
                  id="profileImage"
                  onClick={handleImageClick}
                /> */}
                <img
                  src={
                    formData.contactImageURL instanceof File
                      ? URL.createObjectURL(formData.contactImageURL)
                      : formData.contactImageURL
                      ? formData.contactImageURL
                      : "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                  }
                  className="profilePic cursor-pointer"
                  id="profileImage"
                  onClick={handleImageClick}
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
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  First Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  name="lastName"
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
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
            <div className="col-md-12">
              <div className="mb-3">
                <label className="col-form-label">Email</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            {newContents.map((index) => (
              <div className="col-md-12" key={index}>
                <div className="add-product-new">
                  <div className="row align-items-end">
                    <div className="col-md-12 d-flex align-items-center">
                      <div className=" w-100 mb-3">
                        <label className="col-form-label">
                          Phone <span className="text-danger">*</span>
                        </label>
                        <PhoneInput
                          country={"ae"} // Default country
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
                  </div>
                </div>
              </div>
            ))}

            <div className="col-md-12">
              <div className="mb-3">
                <label className="col-form-label">Tags </label>

                <CreatableSelect
                  classNamePrefix="react-select"
                  options={allTags}
                  // isLoading={isLoading}
                  value={selectedTags}
                  onChange={(newValue) => handleUserTags(newValue)}
                  onCreateOption={handleCreateTag}
                  className="js-example-placeholder-multiple select2 js-states"
                  isMulti={true}
                  placeholder="Add Tags"
                />
              </div>
            </div>
            {/* {selectedContact.contact_id == null && (
              <div className="col-md-12">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={checkSendMailToContact}
                    onChange={() =>
                      setCheckSendMailToContact(!checkSendMailToContact)
                    }
                  />
                  <div>Send mail to contact</div>
                </div>
                {!userProfile.googleConnected && checkSendMailToContact && (
                  <>
                    <div className="text-danger mt-2">
                      *For sending mail Google Account is Required
                    </div>
                    <div className="mt-2">
                      <Link
                        to={route.emailSetup}
                        target="_blank"
                        // onClick={()=>{
                        //   document.getElementById("closeMeetingModal")?.click();
                        //   }}
                      >
                        Click here{" "}
                      </Link>
                      to connect your Google Account
                    </div>
                  </>
                )}
              </div>
            )} */}
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
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
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
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
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
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      aria-label="Linkedin"
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
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
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
                      name="telegram"
                      value={formData.telegram}
                      onChange={handleChange}
                      aria-label="Telegram"
                      aria-describedby="basic-addon1"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="text-center my-3">
            <button
              type="button"
              className="btn btn-outline-primary rounded-pill px-4 d-inline-flex align-items-center gap-2 show-more-btn"
              onClick={() => setShowSocialLinks(!showSocialLinks)}
            >
              {showSocialLinks ? "Hide Social Links" : "Show More"}
            </button>
          </div>

          <div className="d-flex align-items-center justify-content-end">
            <button
              type="button"
              data-bs-dismiss="offcanvas"
              className="btn btn-light me-2"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleContact}
            >
              {isLoading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : selectedContact.contact_id == null ? (
                "Create"
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadOffcanvas;
