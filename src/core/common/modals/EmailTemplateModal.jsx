import { gapi } from "gapi-script";
import React, { useContext, useEffect, useRef, useState } from "react";
import Select from "react-select";
import { showToast } from "../../data/redux/slices/ToastSlice";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { sendEmail } from "../../data/redux/slices/EmailSlice";
import api from "../../axios/axiosInstance";
import { fetchContactActivities } from "../../data/redux/slices/ActivitySlice";

const EmailTemplateModal = () => {
  const [emailTemplateTitles, setEmailTemplateTitles] = useState([]);
  const [editEmailTemplateBody, setEditEmailTemplateBody] = useState("");
  const [editEmailTemplateSubject, setEditEmailTemplateSubject] = useState("");
  const [emailProvider, setEmailProvider] = useState("");
  const userProfile = useSelector((state) => state.profile);
  const selectedContact = useSelector((state) => state.selectedContact);
  const dispatch = useDispatch();
  console.log(selectedContact, "selected contact in email template modal");
const referralData  = useSelector((state) => state.referral.data);
console.log(referralData, "referralData in email template modal");

  const quillRef = useRef(null);
  console.log(userProfile, "userProfile in email modal");

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
    const finalEmailBody = editEmailTemplateBody
      .replace(/{{firstName}}/g, selectedContact.firstname || "")
      .replace(/{{lastName}}/g, selectedContact.lastname || "")
      .replace(/{{email}}/g, selectedContact.emailaddresses?.[0] || "")
      .replace(/{{designation}}/g, selectedContact.designation || "")
      .replace(/{{referralUrl}}/g, referralData.referralUrl || "");
    if (
      !selectedContact.emailaddresses[0] ||
      !editEmailTemplateSubject ||
      !editEmailTemplateBody
    ) {
      alert("Please fill all fields");
      return;
    }
    const selectedAccount = userProfile.accounts.find(
      (acc) => acc.type === emailProvider && acc.isConnected
    );

    const emailData = {
      to: selectedContact.emailaddresses[0],
      subject: editEmailTemplateSubject,
      html: finalEmailBody,
      emailProvider,
      ...(emailProvider === "google" &&
        selectedAccount && {
          fromEmail: selectedAccount.email,
          fromGoogleRefreshToken: selectedAccount.googleRefreshToken,
        }),
      ...(emailProvider === "microsoft" &&
        selectedAccount && {
          fromEmail: selectedAccount.email,
          fromMicrosoftAccessToken: selectedAccount.microsoftAccessToken,
        }),
      ...(emailProvider === "smtp" &&
        selectedAccount &&
        {
          // fromEmail: selectedAccount.smtpUser,
          // smtpHost: selectedAccount.smtpHost,
          // smtpPort: selectedAccount.smtpPort,
          // smtpPass: selectedAccount.smtpPass,
          // smtpSecure: selectedAccount.smtpSecure,
        }),
    };

    const response = await dispatch(sendEmail(emailData)).unwrap();

    if (response.status === "success") {
      const payload = {
        contact_id: selectedContact.contact_id,
        emailMessage: editEmailTemplateSubject,
      };
      const response = await api.post("/whatsapp-email-activity", payload);
      dispatch(fetchContactActivities(selectedContact.contact_id));
    }
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
  const connectedMails = userProfile?.accounts
    ?.filter((account) => account.isConnected)
    ?.map((account) => ({
      label: `${
        account.type.charAt(0).toUpperCase() + account.type.slice(1)
      } (${account.email})`,
      value: account.type,
    }));
  console.log(emailProvider, "emailProvider");
  // useEffect(() => {
  //   if (connectedMails?.length > 0) {
  //     setEmailProvider(connectedMails[0].value);
  //   }
  // }, [connectedMails]);
  useEffect(() => {
  if (connectedMails?.length > 0 && !emailProvider) {
    setEmailProvider(connectedMails[0].value);
  }
}, [connectedMails, emailProvider]);
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
                  options={connectedMails}
                  value={
                    connectedMails?.find(
                      (opt) => opt.value === emailProvider
                    ) || null
                  }
                  onChange={(selectedOption) => {
                    console.log(selectedOption, "selected mail");

                    setEmailProvider(selectedOption?.value);
                  }}
                  placeholder="Select Email Account"
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
              <label className="col-form-label ms-3">Attributes</label>
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={(e) => {
                  if (e.target.value) insertTag(e.target.value);
                  e.target.selectedIndex = 0;
                }}
              >
                <option value="">Insert Field</option>
                <option value="{{firstName}}">First Name</option>
                <option value="{{lastName}}">Last Name</option>
                <option value="{{designation}}">Designation</option>
                <option value="{{email}}">Email</option>
                <option value="{{referralUrl}}">Referral Link</option>
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
              <button className="btn btn-primary" onClick={handleSendEmail}>
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
