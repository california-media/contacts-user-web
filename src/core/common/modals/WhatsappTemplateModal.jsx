import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Select from "react-select";

const WhatsappTemplateModal = () => {
      const [editWhatsappTemplateMessage, setEditWhatsappTemplateMessage] =
        useState("");
          const [whatsppTemplateTitles, setWhatsppTemplateTitles] = useState([]);
          const selectedContact = useSelector((state) => state.selectedContact);
            const userProfile = useSelector((state) => state.profile);
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
        const dispatch = useDispatch()
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
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>

              <div className="d-flex align-items-center justify-content-end">
                {/* <div className="icon-form me-2 mb-sm-0">
                  <span className="form-icon">
                    <i className="ti ti-search" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search Template"
                    onChange={() => {}}
                  />
                </div> */}

                {/* <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (selectedContact?.phonenumbers?.length > 0) {
                      const url = `https://wa.me/${selectedContact.phonenumbers[0]}`;
                      window.open(url, "_blank");
                    } else {
                      alert("Phone number not available");
                    }
                  }}
                >
                  Go directly to WhatsApp
                </button> */}
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
                            template.whatsappTemplate_id ===
                            selectedOption.value
                        )?.whatsappTemplateMessage
                      );
                    }}
                    placeholder="Select a template"
                  />
                </div>

                <div className="mb-3">
                  <label className="col-form-label col-md-2">Message</label>
                  <div className="col-md-12">
                    <textarea
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
                    style={{background:"#25d366"}}
                    onClick={() => {
                      if (selectedContact?.phonenumbers?.length > 0) {
                        const url = `https://wa.me/${selectedContact.phonenumbers[0]}?text=${editWhatsappTemplateMessage}`;
                        window.open(url, "_blank");
                      } else {
                        alert("Phone number not available");
                      }
                    }}
                  >
                    <img src="assets/img/icons/whatsappIcon96.png" alt="whatsapp" style={{width:20}} className="me-2" />
                   Whatsapp Now
                  </button>
               </div>
              </div>
            </div>
          </div>
        </div>
  )
}

export default WhatsappTemplateModal