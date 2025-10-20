import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import api from "../../axios/axiosInstance";
import { fetchContactActivities } from "../../data/redux/slices/ActivitySlice";

const WhatsappTemplateModal = () => {
  const [editWhatsappTemplateMessage, setEditWhatsappTemplateMessage] =
    useState("");
  const [whatsppTemplateTitles, setWhatsppTemplateTitles] = useState([]);
  const selectedContact = useSelector((state) => state.selectedContact);
  const userProfile = useSelector((state) => state.profile);

  const textareaRef = useRef(null);
  useEffect(() => {
    const whatsappTitles =
      userProfile?.templates?.whatsappTemplates?.whatsappTemplatesData?.map(
        (template) => {
          return {
            label: template.whatsappTemplateTitle,
            value: template.whatsappTemplate_id,
          };
        }
      );
    setWhatsppTemplateTitles(whatsappTitles);
  }, [userProfile]);
  const dispatch = useDispatch();
  const insertTag = (tag) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const text = editWhatsappTemplateMessage;

    const newText = text.substring(0, startPos) + tag + text.substring(endPos);

    setEditWhatsappTemplateMessage(newText);

    // Set cursor position immediately (may not work perfectly without delay)
    textarea.selectionStart = textarea.selectionEnd = startPos + tag.length;
    textarea.focus();
  };

  const handleSendWhatsappActivity = async () => {
    if (selectedContact?.phonenumbers?.length > 0) {
      const finalWhatsappTemplateMessage = editWhatsappTemplateMessage
        .replace(/{{firstName}}/g, selectedContact.firstname || "")
        .replace(/{{lastName}}/g, selectedContact.lastname || "")
        .replace(/{{email}}/g, selectedContact.emailaddresses?.[0] || "")
        .replace(/{{designation}}/g, selectedContact.designation || "");

      const payload = {
        contact_id: selectedContact.contact_id,
        whatsappMessage: finalWhatsappTemplateMessage,
      };
      console.log(payload, "payload for whatsapp activity");

      const response = await api.post("/whatsapp-email-call-activity", payload);
      dispatch(fetchContactActivities(selectedContact.contact_id));
      console.log(
        response.data,
        "response after activity api after sending whatsapp"
      );

      const url = `https://wa.me/${selectedContact.phonenumbers[0]}?text=${finalWhatsappTemplateMessage}`;
      window.open(url, "_blank");
      document.getElementById("closeWhatsappTemplateModal")?.click();
    } else {
      alert("Phone number not available");
    }
  };

  return (
    <div
      className="modal custom-modal fade modal-padding"
      id="show_whatsapp_templates"
      role="dialog"
      // style={{ minHeight: 500 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Send Whatsapp</h5>
            <button
              type="button"
              className="btn-close position-static"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="closeWhatsappTemplateModal"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className="modal-body">
            <div className="mb-3">
              <Select
                classNamePrefix="react-select"
                options={whatsppTemplateTitles}
                onChange={(selectedOption) => {
                  setEditWhatsappTemplateMessage(
                    userProfile?.templates?.whatsappTemplates?.whatsappTemplatesData.find(
                      (template) =>
                        template.whatsappTemplate_id === selectedOption.value
                    )?.whatsappTemplateMessage
                  );
                }}
                placeholder="Select a template"
              />
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
              </select>
            </div>
            <div className="mb-3">
              <label className="col-form-label col-md-2">Message</label>
              <div className="col-md-12">
                <textarea
                  ref={textareaRef}
                  rows={5}
                  cols={5}
                  className="form-control"
                  name="whatsappTemplateMessage"
                  placeholder="Enter text here"
                  onChange={(e) =>
                    setEditWhatsappTemplateMessage(e.target.value)
                  }
                  value={editWhatsappTemplateMessage}
                />
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <button
                className="btn text-white"
                style={{ background: "#25d366" }}
                onClick={handleSendWhatsappActivity}
              >
                <img
                  src="assets/img/icons/whatsappIcon96.png"
                  alt="whatsapp"
                  style={{ width: 20 }}
                  className="me-2"
                />
                Whatsapp Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsappTemplateModal;
