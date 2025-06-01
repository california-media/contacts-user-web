import { gapi } from "gapi-script";
import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { showToast } from "../../data/redux/slices/ToastSlice";
import DefaultEditor from "react-simple-wysiwyg";
import { useDispatch, useSelector } from "react-redux";
import { GoogleAuthContext } from "../context/GoogleAuthContext";

const EmailTemplateModal = () => {
  const [emailTemplateTitles, setEmailTemplateTitles] = useState([]);
  const [editEmailTemplateBody, setEditEmailTemplateBody] = useState("");
  const [editEmailTemplateSubject, setEditEmailTemplateSubject] = useState("");
  const userProfile = useSelector((state) => state.profile);
  const selectedContact = useSelector((state) => state.selectedContact);
  const dispatch = useDispatch();
  const {isGoogleSignedIn} = useContext(GoogleAuthContext)

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

  const sendEmail = async () => {
    if (
      !selectedContact.emailaddresses[0] ||
      !editEmailTemplateSubject ||
      !editEmailTemplateBody
    ) {
      alert("Please fill all fields");
      return;
    }

    const headers = [
      `To: ${selectedContact.emailaddresses[0]}`,
      `Subject: ${editEmailTemplateSubject}`,
      "Content-Type: text/html; charset=utf-8",
      "",
      `<p>${editEmailTemplateBody}</p>`,
    ];

    const email = headers.join("\r\n");

    const base64EncodedEmail = btoa(
      new TextEncoder()
        .encode(email)
        .reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
    try {
      await gapi.client.gmail.users.messages.send({
        userId: "me",
        resource: {
          raw: base64EncodedEmail,
        },
      });
      document.getElementById("closeEmailTemplateModal")?.click();
      dispatch(
        showToast({ message: "Email Sent Successfully", variant: "success" })
      );
      // setTo("");
      // setSubject("");
      // setMessage("");
    } catch (error) {
      dispatch(
        showToast({ message: !isGoogleSignedIn?"Please Login to send Mail":"Error Sending Mail", variant: "danger" })
      );
      console.error("Error sending email:", error?.result?.error?.message);
    }
  };
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
              <label className="col-form-label col-md-2">Body</label>
              <div className="col-md-12">
                <DefaultEditor
                  className="form-control"
                  value={editEmailTemplateBody}
                  onChange={(e) => setEditEmailTemplateBody(e.target.value)}
                  name="emailTemplateMessage"
                  placeholder="Enter text here"
                />
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <button className="btn btn-primary" onClick={sendEmail}>
                Send Mail
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateModal;
