import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { FaTasks } from "react-icons/fa";
import { IoMdDoneAll } from "react-icons/io";
import { MdMail } from "react-icons/md";
import { SlPeople } from "react-icons/sl";
import { Link } from "react-router-dom";
import DeleteModal from "../../../core/common/modals/DeleteModal";

const Templates = () => {
  const whatsappTemplates = [
    {
      template_id: "682c2114107a00a2e310d338",
      templateTitle: "title4ww",
      templateDescription: "description 4",
    },
  ];
  const [whatsappTemplateFormData, setWhatsappTemplateFormData] = useState({
    template_id: "",
    templateDescription: "",
    templateTitle: "",
  });
  const [selectedWhatsappTemplate, setSelectedWhatsappTemplate] =
    useState(null);
  const [hoveredWhatsappTemplateIndex, setHoveredWhatsappTemplateIndex] =
    useState(null);
  const [deleteModalText, setDeleteModalText] = useState("");
  const handleWhatsappTemplateEditClick = (template) => {
    setSelectedWhatsappTemplate(template);
  };
  const handleDeleteWhatsappTemplate = (template) => {
    setDeleteModalText("template");
  };
  const handleWhatsappTemplateInputChange = (name, value) => {
    setWhatsappTemplateFormData({
      ...whatsappTemplateFormData,
      [name]: value,
    });
  };
 const handleWhatsappTemplateSubmit = () => {
    // const formDataObj = new FormData();

    // // formDataObj.append("contact_id", selectedContact.contact_id);

    // formDataObj.append("task_id", taskFormData.task_id); 
    // formDataObj.append("taskDescription", taskFormData.taskDescription);
    // formDataObj.append("taskTitle", taskFormData.taskTitle);

    // formDataObj.append(
    //   "taskDueDate",
    //   taskFormData.dueDate.format("YYYY-MM-DD")
    // );
    // formDataObj.append("taskDueTime", taskFormData.dueTime.format("HH:mm"));

    // dispatch(saveContact(formDataObj));
  };



  useEffect(() => {
    if (selectedWhatsappTemplate) {
      setWhatsappTemplateFormData({
        template_id: selectedWhatsappTemplate.template_id,
        templateDescription: selectedWhatsappTemplate.templateDescription,
        templateTitle: selectedWhatsappTemplate.templateTitle,
      });
    } else {
      // Reset form for new task
      setWhatsappTemplateFormData({
        template_id: "",
        templateDescription: "",
        templateTitle: "",
      });
    }
  }, [selectedWhatsappTemplate]);
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="card mb-3">
              <div className="card-body pb-0">
                <ul
                  className="nav nav-tabs nav-tabs-bottom mb-2"
                  role="tablist"
                >
                  <li className="nav-item" role="presentation">
                    <Link
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#whatsappTemplates"
                      className="nav-link active"
                    >
                      <i className="fa-brands fa-whatsapp me-2"></i>
                      Whatsapp Templates
                    </Link>
                  </li>
                  <li className="nav-item" role="presentation">
                    <Link
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#emailTemplates"
                      className="nav-link"
                    >
                      <MdMail className="me-2" />
                      Email Templates
                    </Link>
                  </li>
                </ul>
                <div className="tab-content pt-0">
                  <div
                    className="tab-pane fade active show"
                    id="whatsappTemplates"
                    role="tabpanel"
                  >
                    <div className="card">
                      <div className="card-header d-flex align-items-center justify-content-end flex-wrap row-gap-3">
                        {/* <h4 className="fw-semibold mb-0">Whatsapp Templates</h4> */}
                        <div className="d-inline-flex align-items-center">
                          <Link
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#add_whatsapp_template"
                            className="link-purple fw-medium"
                            onClick={() => {
                              setSelectedWhatsappTemplate(null);
                            }}
                          >
                            <i className="ti ti-circle-plus me-1" />
                            Add New
                          </Link>
                        </div>
                      </div>

                      <div className="card-body">
                        <div className="notes-activity">
                          {whatsappTemplates.map(
                            (whatsappTemplate, whatsappTemplateIndex) => {
                              return (
                                <div
                                  className="card mb-3"
                                  key={whatsappTemplateIndex}
                                >
                                  <div
                                    className="card-body"
                                    onMouseEnter={() =>
                                      setHoveredWhatsappTemplateIndex(
                                        whatsappTemplateIndex
                                      )
                                    }
                                    onMouseLeave={() =>
                                      setHoveredWhatsappTemplateIndex(null)
                                    }
                                  >
                                    <div className="d-flex align-items-center justify-content-between pb-2">
                                      {hoveredWhatsappTemplateIndex ===
                                        whatsappTemplateIndex && (
                                        <div
                                          style={{
                                            position: "absolute",
                                            top: 20,
                                            right: 20,
                                          }}
                                        >
                                          <Link
                                            to="#"
                                            className="styleForEditBtn me-3"
                                            data-bs-toggle="modal"
                                            data-bs-target="#add_whatsapp_template"
                                            onClick={() => {
                                              handleWhatsappTemplateEditClick(
                                                whatsappTemplate
                                              );
                                            }}
                                          >
                                            <i className="ti ti-edit text-blue" />
                                          </Link>
                                          <Link
                                            to="#"
                                            className="styleForDeleteBtn"
                                            data-bs-toggle="modal"
                                            data-bs-target={`#delete_${deleteModalText}`}
                                            onClick={() => {
                                              setSelectedWhatsappTemplate(
                                                whatsappTemplate
                                              );
                                              setDeleteModalText("template");
                                            }}
                                          >
                                            <i className="ti ti-trash text-danger" />
                                          </Link>
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-md-11 mb-3">
                                      <p
                                        className={`badge badge-soft-warning fw-medium me-2`}
                                      >
                                        {whatsappTemplate.templateTitle}
                                      </p>

                                      <p>{whatsappTemplate.templateDescription}</p>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                      <p className="mb-0">
                                        ✎{" "}
                                        <span className="fw-medium text-black ms-2">
                                          Last Modified on{" "}
                                        </span>{" "}
                                      </p>
                                     
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DeleteModal
          text={deleteModalText}
          onDelete={handleDeleteWhatsappTemplate}
        />
        <div
          className="modal custom-modal fade modal-padding"
          id="add_whatsapp_template"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedWhatsappTemplate
                    ? "Edit Template"
                    : "Add new Template"}
                </h5>
                <button
                  type="button"
                  className="btn-close position-static"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="col-form-label">
                      Title <span className="text-danger"> *</span>
                    </label>
                    <input
                      className="form-control"
                      name="templateTitle"
                      value={whatsappTemplateFormData.templateTitle}
                      onChange={(e) => {
                        handleWhatsappTemplateInputChange(
                          e.target.name,
                          e.target.value
                        );
                      }}
                      type="text"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="col-form-label">
                      Description <span className="text-danger"> *</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows={4}
                      name="whatsappTemplateDescription"
                      value={whatsappTemplateFormData.templateDescription}
                      onChange={(e) =>
                        handleWhatsappTemplateInputChange(
                          e.target.name,
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="col-lg-12 text-end modal-btn">
                    <Link
                      to="#"
                      className="btn btn-light"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <button
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      type="button"
                      onClick={() => {
                        handleWhatsappTemplateSubmit();
                      }}
                    >
                      Save changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates;
