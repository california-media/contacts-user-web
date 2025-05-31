import React, { useEffect, useRef, useState } from "react";
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
  // const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newTags, setNewTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [formData, setFormData] = useState({
    contact_id: "",
    contactImageURL: "",
    firstName: "",
    lastName: "",
    company:"",
    designation:"",
    email: [],
    phone: "",
    tags: [],
  });
  const { tags, loading, error } = useSelector((state) => state.tags);

  const dispatch = useDispatch();
  const offcanvasRef = useRef(null);

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

  const handleContact = async () => {
    setIsLoading(true);

    const formDataObj = new FormData();

    formDataObj.append("contact_id", formData.contact_id);
    formDataObj.append("contactImage", formData.contactImageURL);
    formDataObj.append("firstname", formData.firstName);
    formDataObj.append("lastname", formData.lastName);
    formDataObj.append("company", formData.company);
    formDataObj.append("designation", formData.designation);
    formDataObj.append("emailaddresses", formData.email);
    formDataObj.append(
      "tags",
      JSON.stringify(selectedTags.map((tag) => tag.value))
    );
    formDataObj.append("phonenumbers", formData.phone);

    try {
      if (newTags.length > 0) {
        await dispatch(addTag({ tag: newTags })).unwrap();
      }
      await dispatch(saveContact(formDataObj)).unwrap();
      document.getElementById("closeContactOffcanvas")?.click();
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
  useEffect(() => {
    const tagMap = tags.map((tag) => ({
      value: tag.tag,
      label: tag.tag,
    }));
    setAllTags(tagMap);
  }, [tags]);
  const handleCreateTag = async (inputValue) => {
    setNewTags([...newTags, inputValue]);
    setSelectedTags([
      ...selectedTags,
      { value: inputValue, label: inputValue },
    ]);
  };

  useEffect(() => {
    if (selectedContact?.tags) {
      const formattedTags = selectedContact.tags.map((tag) => ({
        value: tag,
        label: tag,
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
        phone: selectedContact.phonenumbers?.[0] || "",
        tags: selectedContact.tags || [],
      });
    }
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
