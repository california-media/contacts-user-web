import { gapi } from "gapi-script";
import React, { useContext, useEffect, useRef, useState } from "react";
import Select from "react-select";
import { showToast } from "../../data/redux/slices/ToastSlice";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { sendEmail } from "../../data/redux/slices/EmailSlice";

const EmailTemplateModal = () => {
  const [emailTemplateTitles, setEmailTemplateTitles] = useState([]);
  const [editEmailTemplateBody, setEditEmailTemplateBody] = useState("");
  const [editEmailTemplateSubject, setEditEmailTemplateSubject] = useState("");
  const [emailProvider, setEmailProvider] = useState("");
  const userProfile = useSelector((state) => state.profile);
  const selectedContact = useSelector((state) => state.selectedContact);
  const dispatch = useDispatch();

  const quillRef = useRef(null);

  useEffect(() => {
    const emailTitles =
      userProfile?.templates?.emailTemplates?.emailTemplatesData?.map(
        (template) => {
          return {
            label: template.emailTemplateTitle,
            value: template.emailTemplate_id,
          };
        }
      );
    setEmailTemplateTitles(emailTitles);
  }, [userProfile]);
  const insertTag = (tag) => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const range = editor.getSelection();
      if (range) {
        editor.insertText(range.index, tag);
        editor.setSelection(range.index + tag.length);
      }
    }
  };
  const handleSendEmail = async () => {
    if (!userProfile.googleConnected || !userProfile.googleEmail) {
      dispatch(
        showToast({
          message: "Please connect your Google account before sending emails.",
          variant: "danger",
        })
      );
      return;
    }
    const finalEmailBody = editEmailTemplateBody
      .replace(/{{firstName}}/g, selectedContact.firstname || "")
      .replace(/{{lastName}}/g, selectedContact.lastname || "")
      .replace(/{{email}}/g, selectedContact.emailaddresses?.[0] || "")
      .replace(/{{designation}}/g, selectedContact.designation || "");
    if (
      !selectedContact.emailaddresses[0] ||
      !editEmailTemplateSubject ||
      !editEmailTemplateBody
    ) {
      alert("Please fill all fields");
      return;
    }

    const emailData = {
      to: selectedContact.emailaddresses[0],
      subject: editEmailTemplateSubject,
      html: finalEmailBody,
      ...(emailProvider === "google" && {
        fromEmail: userProfile.googleEmail,
        fromGoogleRefreshToken: userProfile.googleRefreshToken,
      }),
      ...(emailProvider === "microsoft" && {
        fromEmail: userProfile.microsoftEmail,
        fromMicrosoftAccessToken: userProfile.microsoftAccessToken,
      }),
    };
    console.log(userProfile, "userprofilee");

    dispatch(sendEmail(emailData));
    document.getElementById("closeEmailTemplateModal")?.click();
  };
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
  ];
  return (
    <div
      className="modal custom-modal fade modal-padding"
      id="show_email_templates"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Send Email</h5>
            <button
              type="button"
              className="btn-close position-static"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="closeEmailTemplateModal"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <Select
                classNamePrefix="react-select"
                options={emailTemplateTitles}
                onChange={(selectedOption) => {
                  console.log("Selected option:", selectedOption);

                  setEditEmailTemplateBody(
                    userProfile?.templates?.emailTemplates?.emailTemplatesData.find(
                      (template) =>
                        template.emailTemplate_id === selectedOption.value
                    )?.emailTemplateBody
                  );
                  setEditEmailTemplateSubject(
                    userProfile?.templates?.emailTemplates?.emailTemplatesData.find(
                      (template) =>
                        template.emailTemplate_id === selectedOption.value
                    )?.emailTemplateSubject
                  );
                }}
                placeholder="Select a template"
              />
            </div>
            <div className="col-12">
              <div className="mb-3">
                <label className="col-form-label ms-3">From</label>
                <Select
                  classNamePrefix="react-select"
                  options={emailTemplateTitles}
                  onChange={(selectedOption) => {
                    console.log("Selected option:", selectedOption);

                    setEditEmailTemplateBody(
                      userProfile?.templates?.emailTemplates?.emailTemplatesData.find(
                        (template) =>
                          template.emailTemplate_id === selectedOption.value
                      )?.emailTemplateBody
                    );
                    setEditEmailTemplateSubject(
                      userProfile?.templates?.emailTemplates?.emailTemplatesData.find(
                        (template) =>
                          template.emailTemplate_id === selectedOption.value
                      )?.emailTemplateSubject
                    );
                  }}
                  placeholder="Select a template"
                />
              </div>

            </div>
            <div className="col-12">
              <div className="mb-3">
                <label className="col-form-label ms-3">Subject</label>
                <input
                  type="text"
                  value={editEmailTemplateSubject}
                  name="emailTemplateSubject"
                  onChange={(e) => setEditEmailTemplateSubject(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="col-form-label ms-3">Attribute</label>
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={(e) => {
                  if (e.target.value) insertTag(e.target.value);
                  e.target.selectedIndex = 0;
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
              <label className="col-form-label col-md-2 ms-3">Body</label>
              <div className="col-md-12">
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={editEmailTemplateBody}
                  onChange={setEditEmailTemplateBody}
                  name="emailTemplateMessage"
                  className="form-control my-quill"
                  placeholder="Enter text here"
                  modules={modules}
                  formats={formats}
                  style={{ height: "300px" }}
                />
              </div>
            </div>
            <div className="d-flex justify-content-end">
              {/* <button className="btn btn-primary" onClick={handleSendEmail}>
                Send Mail
              </button> */}
              <div className="btn-group my-1">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleSendEmail()}
                  disabled={!emailProvider} // optional: disable if no provider
                >
                  Send Mail
                  {emailProvider
                    ? ` (${
                        emailProvider.charAt(0).toUpperCase() +
                        emailProvider.slice(1)
                      })`
                    : ""}
                </button>
                <button
                  type="button"
                  className="btn btn-primary dropdown-toggle dropdown-toggle-split me-2"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="visually-hidden">Toggle Dropdown</span>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setEmailProvider("google")}
                    >
                      Google
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setEmailProvider("microsoft")}
                    >
                      Microsoft
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setEmailProvider("smtp")}
                    >
                      SMTP
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateModal;
