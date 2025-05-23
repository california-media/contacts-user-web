import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editProfile } from "../../../data/redux/slices/ProfileSlice";

const WhatsappTemplateOffcanvas = () => {
  const [formData, setFormData] = useState({
    whatsappTemplate_id: "",
    whatsappTemplateTitle: "",
    whatsappTemplateMessage: "",
  });

  const dispatch = useDispatch();

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAddWhatsappTemplate = async (e) => {
    e.preventDefault();
    dispatch(editProfile(formData));
    setFormData({
      whatsappTemplate_id: "",
      whatsappTemplateTitle: "",
      whatsappTemplateMessage: "",
    });
  };
  const selectedTemplate = useSelector((state) => state.selectedTemplate);
  console.log(formData, "formData in offcanvas");

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
  console.log(selectedTemplate, "selectedTemplateselectedTemplate");

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
            <div className="col-12">
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
