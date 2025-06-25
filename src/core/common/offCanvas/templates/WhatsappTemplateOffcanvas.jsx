import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editProfile } from "../../../data/redux/slices/ProfileSlice";
import { Button, Toast } from "react-bootstrap";
import { showToast } from "../../../data/redux/slices/ToastSlice";

const WhatsappTemplateOffcanvas = () => {
  const [formData, setFormData] = useState({
    whatsappTemplate_id: "",
    whatsappTemplateTitle: "",
    whatsappTemplateMessage: "",
  });

  const attributeRef = useRef(null);
  const dispatch = useDispatch();
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAddWhatsappTemplate = async (e) => {
    e.preventDefault();
    const result = await dispatch(editProfile(formData)).unwrap();

    if (result?.status == "success") {
      setShowSuccessToast(true);
      dispatch(
        showToast({ message: "Contact saved successfully", variant: "success" })
      );
    }

    document.getElementById("closeWhatsappTemplateOffcanvas")?.click();

    if (selectedTemplate.whatsappTemplate_id == "") {
      setFormData({
        whatsappTemplate_id: "",
        whatsappTemplateTitle: "",
        whatsappTemplateMessage: "",
      });
    }
  };
  const selectedTemplate = useSelector((state) => state.selectedTemplate);
 const insertTag = (tag) => {
  const textarea = attributeRef.current;
  if (textarea) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = formData.whatsappTemplateMessage;
    const newValue =
      value.substring(0, start) + tag + value.substring(end, value.length);
    handleInputChange("whatsappTemplateMessage", newValue);

    // Move cursor after inserted tag
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + tag.length;
    }, 0);
  }
};
  useEffect(() => {
    if (selectedTemplate) {
      setFormData({
        whatsappTemplate_id: selectedTemplate.whatsappTemplate_id
          ? selectedTemplate.whatsappTemplate_id
          : "",
        whatsappTemplateTitle: selectedTemplate.whatsappTemplateTitle
          ? selectedTemplate.whatsappTemplateTitle
          : "",
        whatsappTemplateMessage: selectedTemplate.whatsappTemplateMessage
          ? selectedTemplate.whatsappTemplateMessage
          : "",
      });
    }
  }, [selectedTemplate]);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSuccessToast(false);
    }, 6000);
    return () => clearTimeout(timeoutId);
  }, [showSuccessToast]);
  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="whatsapp_template_offcanvas"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">
          {selectedTemplate.whatsappTemplate_id !== ""
            ? "Edit Template"
            : "Add Template"}
        </h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          id="closeWhatsappTemplateOffcanvas"
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleAddWhatsappTemplate}>
          <div className="row">
            <div className="col-12">
              <div className="mb-3">
                <label className="col-form-label ms-3">Title</label>
                <input
                  type="text"
                  value={formData.whatsappTemplateTitle}
                  name="whatsappTemplateTitle"
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                  className="form-control"
                />
              </div>
            </div>
            {/* <div className="col-12">
              <div className="mb-3">
                <label className="col-form-label ms-3">Message</label>
                <input
                  type="text"
                  value={formData.whatsappTemplateMessage}
                  name="whatsappTemplateMessage"
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                  className="form-control"
                />
              </div>
            </div> */}
            <div className="col-12 mb-3">
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={(e) => {
                  if (e.target.value) insertTag(e.target.value);
                  e.target.selectedIndex = 0; // reset dropdown
                }}
              >
                <option value="">Insert Tag</option>
                <option value="{{firstName}}">First Name</option>
                <option value="{{lastName}}">Last Name</option>
                <option value="{{designation}}">Designation</option>
                <option value="{{email}}">Email</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="col-form-label col-md-2">Message</label>
              <div className="col-md-12">
                <textarea
                  rows={5}
                  ref={attributeRef}
                  cols={5}
                  className="form-control"
                  name="whatsappTemplateMessage"
                  placeholder="Enter text here"
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                  value={formData.whatsappTemplateMessage}
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
            <button type="submit" className="btn btn-primary">
              {selectedTemplate?.whatsappTemplate_id == ""
                ? "Create"
                : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WhatsappTemplateOffcanvas;
