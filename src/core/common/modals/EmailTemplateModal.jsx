import { gapi } from "gapi-script";
import React, { useContext, useEffect, useRef, useState } from "react";
import Select from "react-select";
import { showToast } from "../../data/redux/slices/ToastSlice";
import DefaultEditor from "react-simple-wysiwyg";
import { useDispatch, useSelector } from "react-redux";
import { GoogleAuthContext } from "../context/GoogleAuthContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EmailTemplateModal = () => {
  const [emailTemplateTitles, setEmailTemplateTitles] = useState([]);
  const [editEmailTemplateBody, setEditEmailTemplateBody] = useState("");
  const [editEmailTemplateSubject, setEditEmailTemplateSubject] = useState("");
  const userProfile = useSelector((state) => state.profile);
  const selectedContact = useSelector((state) => state.selectedContact);
  const dispatch = useDispatch();
  const { isGoogleSignedIn } = useContext(GoogleAuthContext);
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
    const editor = quillRef.current?.getEditor(); // get Quill instance
    if (editor) {
      const range = editor.getSelection(); // current cursor location
      if (range) {
        editor.insertText(range.index, tag);
        editor.setSelection(range.index + tag.length); // move cursor
      }
    }
  };
  const sendEmail = async () => {
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

    const headers = [
      `To: ${selectedContact.emailaddresses[0]}`,
      `Subject: ${editEmailTemplateSubject}`,
      "Content-Type: text/html; charset=utf-8",
      "",
      `<p>${finalEmailBody}</p>`,
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
        showToast({
          message: !isGoogleSignedIn
            ? "Please Login to send Mail"
            : "Error Sending Mail",
          variant: "danger",
        })
      );
      console.error("Error sending email:", error?.result?.error?.message);
    }
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
