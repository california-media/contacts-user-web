import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editProfile } from "../../../data/redux/slices/ProfileSlice";
import DefaultEditor from "react-simple-wysiwyg";

const EmailTemplateOffcanvas = () => {
  const [formData, setFormData] = useState({
    emailTemplate_id: "",
    emailTemplateTitle: "",
    emailTemplateSubject: "",
    emailTemplateBody: "",
  });

  const dispatch = useDispatch();

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAddEmailTemplate = async (e) => {
    e.preventDefault();
    await dispatch(editProfile(formData)).unwrap();
    document.getElementById("closeEmailTemplateOffcanvas")?.click();
    if (selectedTemplate.emailTemplate_id == "") {
      setFormData({
        emailTemplate_id: "",
        emailTemplateTitle: "",
        emailTemplateSubject: "",
        emailTemplateBody: "",
      });
    }
  };
  const selectedTemplate = useSelector((state) => state.selectedTemplate);

  useEffect(() => {
    if (selectedTemplate) {
      setFormData({
        emailTemplate_id: selectedTemplate.emailTemplate_id
          ? selectedTemplate.emailTemplate_id
          : "",
        emailTemplateTitle: selectedTemplate.emailTemplateTitle
          ? selectedTemplate.emailTemplateTitle
          : "",
        emailTemplateSubject: selectedTemplate.emailTemplateSubject
          ? selectedTemplate.emailTemplateSubject
          : "",
        emailTemplateBody: selectedTemplate.emailTemplateBody
          ? selectedTemplate.emailTemplateBody
          : "",
      });
    }
  }, [selectedTemplate]);

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="email_template_offcanvas"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">
          {selectedTemplate.emailTemplate_id !== ""
            ? "Edit Template"
            : "Add Template"}
        </h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          id="closeEmailTemplateOffcanvas"
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleAddEmailTemplate}>
          <div className="row">
            <div className="col-12">
              <div className="mb-3">
                <label className="col-form-label ms-3">Title</label>
                <input
                  type="text"
                  value={formData.emailTemplateTitle}
                  name="emailTemplateTitle"
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-12">
              <div className="mb-3">
                <label className="col-form-label ms-3">Subject</label>
                <input
                  type="text"
                  value={formData.emailTemplateSubject}
                  name="emailTemplateSubject"
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-12">
              <div className="mb-3">
                <label className="col-form-label ms-3">Body</label>
                <DefaultEditor
                  name="emailTemplateBody"
                  placeholder="Enter text here"
                  value={formData.emailTemplateBody}
                  onChange={(e) => {
                    handleInputChange(e.target.name, e.target.value);
                  }}
                  style={{ minHeight: "300px" }}
                />
                {/* <textarea
                      rows={5}
                      cols={5}
                      className="form-control"
                       name="emailTemplateBody"
                      placeholder="Enter text here"
                        onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                      value={formData.emailTemplateBody}
                    /> */}
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
              {selectedTemplate?.emailTemplate_id == "" ? "Create" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailTemplateOffcanvas;
