import React, { useEffect, useState } from "react";
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

const LeadOffcanvas = ({ selectedContact }) => {
  const [show, setShow] = useState(false);
  const [newContents, setNewContents] = useState([0]);
  const [owner, setOwner] = useState(["Collab"]);
  const [openModal2, setOpenModal2] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [previousTags, setPreviousTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [newTags, setNewTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [formData, setFormData] = useState({
    contact_id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const handleShow = () => setShow(true);
  const addNewContent = () => {
    setNewContents([...newContents, newContents.length]);
  };
  const handleContact = async () => {
    setIsLoading(true)
    // 1️⃣ Create a FormData instance
    const formDataObj = new FormData();

    // 2️⃣ Append data to it (key-value pairs)

    formDataObj.append("contact_id", formData.contact_id);
    formDataObj.append("firstname", formData.firstName);
    formDataObj.append("lastname", formData.lastName);
    formDataObj.append("email", formData.email);
    // formData.append("phone", "123456789");

    const tagsForApi = selectedTags.map((tag) => tag.value);

    const removedTags = previousTags
      .filter(
        (prevTag) => !selectedTags.some((tag) => tag.value === prevTag.value)
      )
      .map((tag) => tag.value);
    console.log(tagsForApi, "tags for api");
    console.log(removedTags, "removed tags");

    console.log(tagsForApi, "tags to be sent to api");

    try {
      //parallel api calling
      const [contactResponse, tagResponse, addTagResponse] = await Promise.all([
        api.post("/addEditContact", formDataObj, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
        api.post("/assignedContactTag/assign-tag", {
          tagNames: tagsForApi,
          contactId: formData.contact_id,
        }),
        newTags.length > 0
          ? api.post("/addTag", {
              tag: newTags,
            })
          : Promise.resolve(null),
        removedTags.length > 0
          ? api.post("/addTag", {
              tagNames: removedTags,
              contactId: formData.contact_id,
            })
          : Promise.resolve(null),
      ]);
      setIsLoading(false)
      console.log("Response from addEditContact:", contactResponse.data);
      console.log("Response from addTags:", tagResponse.data);
      console.log("Response from addTags:", addTagResponse.data);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false)

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
    const fetchAllTags = async () => {
      try {
        const response = await api.get("/getTag");
        const allTagsFetched = response.data.data.map((tag) => ({
          value: tag.tag,
          label: tag.tag,
        }));
        console.log(response.data, "response from get tag api");

        setAllTags(allTagsFetched);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchAllTags();
  }, []);
  const handleCreateTag = async (inputValue) => {
    // try {
    //   const response = await api.post("/addTag", { tag: inputValue });

    //   const newTag = response.data;

    //   setAllTags((prev) => [...prev, { label: inputValue, value: inputValue }]);
    // } catch (error) {
    //   console.error("Error creating tag:", error);
    //   alert("Failed to create tag");
    // }
    setNewTags([...newTags, inputValue]);
    setSelectedTags([
      ...selectedTags,
      { value: inputValue, label: inputValue },
    ]);
  };
  useEffect(() => {
    if (selectedContact?.tags) {
      // Format the existing tags for CreatableSelect
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
  };

  useEffect(() => {
    if (selectedContact) {
      setFormData({
        contact_id: selectedContact.contact_id || 0,
        firstName: selectedContact.firstname || "",
        lastName: selectedContact.lastname || "",
        email: selectedContact.emailaddresses || "",
        phone: selectedContact.phone || "",
      });
    }
  }, [selectedContact]);

  useEffect(() => {
    // Attach event listener to offcanvas hide
    const offcanvasElement = document.getElementById("contact_offcanvas");

    const handleOffcanvasHide = () => {
      console.log("Offcanvas hidden, clearing contact data...");

      // Clear form data
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      });

      // Clear tags
      setSelectedTags([]);
      setPreviousTags([]);
    };

    // Listen for the Bootstrap event
    offcanvasElement.addEventListener(
      "hidden.bs.offcanvas",
      handleOffcanvasHide
    );

    // Clean up the event listener on unmount
    return () => {
      offcanvasElement.removeEventListener(
        "hidden.bs.offcanvas",
        handleOffcanvasHide
      );
    };
  }, []);

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="contact_offcanvas"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">
          {selectedContact ? "Update Contact" : "Add New Contact"}
        </h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleContact}>
          <div className="row">
            <div className="col-md-12 d-flex justify-content-center">
              <div className="profilePic"></div>
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

            {/* <div className="col-md-12">
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="col-form-label">Company Name</label>
                </div>
                <Select
                  className="select"
                  options={options}
                  classNamePrefix="react-select"
                />
              </div>
            </div> */}

            {newContents.map((index) => (
              <div className="col-md-12" key={index}>
                <div className="add-product-new">
                  <div className="row align-items-end">
                    <div className="col-md-4 d-flex align-items-center">
                      <div className=" w-100 mb-3">
                        <label className="col-form-label">
                          Phone <span className="text-danger">*</span>
                        </label>
                        <Select
                          className="select"
                          options={optionschoose}
                          classNamePrefix="react-select"
                        />
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className=" mb-3">
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={
                            selectedContact ? selectedContact.phone : ""
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* <div className="col-md-12">
              <Link
                onClick={addNewContent}
                to="#"
                className="add-new add-new-phone mb-3 d-block"
              >
                <i className="ti ti-square-rounded-plus me-2" />
                Add New
              </Link>
            </div> */}

            <div className="col-md-12">
              <div className="mb-3">
                <label className="col-form-label">Tags </label>
                {/* <TagsInput
                  // className="input-tags form-control"
                  value={owner}
                  onChange={setOwner}
                /> */}

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
            {/* <div className="col-md-12">
              <div className="mb-3">
                <label className="col-form-label">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea className="form-control" rows={5} defaultValue={""} />
              </div>
            </div> */}
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

{isLoading ?<div class="spinner-border spinner-border-sm" role="status">
  <span class="sr-only">Loading...</span>
</div>:


              selectedContact ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadOffcanvas;
