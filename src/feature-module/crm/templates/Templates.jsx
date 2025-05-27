import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { FaTasks } from "react-icons/fa";
import { IoMdDoneAll } from "react-icons/io";
import { MdMail } from "react-icons/md";
import { SlPeople } from "react-icons/sl";
import { Link } from "react-router-dom";
import DeleteModal from "../../../core/common/modals/DeleteModal";
import Table from "../../../core/common/dataTable/index";
import { HiEllipsisVertical } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTemplate,
  editProfile,
  fetchProfile,
} from "../../../core/data/redux/slices/ProfileSlice";
import WhatsappTemplateOffcanvas from "../../../core/common/offCanvas/templates/WhatsappTemplateOffcanvas";
import {
  resetSelectedTemplate,
  setSelectedTemplate,
} from "../../../core/data/redux/slices/SelectedTemplateSlice";
import EmailTemplateOffcanvas from "../../../core/common/offCanvas/templates/EmailTemplateOffcanvas";
import useDebounce from "../../../core/data/redux/hooks/useDebounce";

const Templates = () => {
  const [columnVisibility, setColumnVisibility] = useState({
    "": true,
    Title: true,
    Message: true,
  });
  const [whatsappTemplatePage, setWhatsappTemplatePage] = useState(1);
  const [whatsappTemplateLimit, setWhatsappTemplateLimit] = useState("10");
  const [searchWhatsappTemplateQuery, setSearchWhatsappTemplateQuery] =
    useState("");
  const [emailTemplatePage, setEmailTemplatePage] = useState(1);
  const [emailTemplateLimit, setEmailTemplateLimit] = useState("10");
  const [searchEmailTemplateQuery, setSearchEmailTemplateQuery] =
    useState("");
  const [showFavouriteWhatsappTemplates, setShowFavouriteWhatsappTemplates] =
    useState(false);
  const [deleteModalText, setDeleteModalText] = useState("");
  const [showFavouriteEmailTemplates, setShowFavouriteEmailTemplates] =
    useState(false);
  const dispatch = useDispatch();
    const debouncedWhatsappSearchQuery = useDebounce(searchWhatsappTemplateQuery)
    const debouncedEmailSearchQuery = useDebounce(searchEmailTemplateQuery)
  const userProfile = useSelector((state) => state.profile);
  const handleWhatsappTemplatePageChange = (
    newWhatsappPage,
    newWhatsappPageSize
  ) => {
    setWhatsappTemplatePage(newWhatsappPage);
    setWhatsappTemplateLimit(newWhatsappPageSize);
  };
  const handleEmailTemplatePageChange = (
    newEmailPage,
    newEmailPageSize
  ) => {
    setEmailTemplatePage(newEmailPage);
    setEmailTemplateLimit(newEmailPageSize);
  };
  const handleWhatsappTemplateEditClick = (record) => {
    const updatedRecord = {
      ...record,
      templateType: "whatsapp",
    };
    dispatch(setSelectedTemplate(updatedRecord));
  };

  useEffect(() => {
    const filters = {
      whatsappTemplatePage,
      whatsappTemplateLimit,
      searchWhatsappTemplates: debouncedWhatsappSearchQuery,
    };

    dispatch(fetchProfile(filters));
  }, [
    whatsappTemplatePage,
    whatsappTemplateLimit,
    debouncedWhatsappSearchQuery,
  ]);
  useEffect(() => {
    const filters = {
      emailTemplatePage,
      emailTemplateLimit,
      searchEmailTemplates: debouncedEmailSearchQuery,
    };

    dispatch(fetchProfile(filters));
  }, [
    emailTemplatePage,
    emailTemplateLimit,
    debouncedEmailSearchQuery,
  ]);
  const handleEmailTemplateEditClick = (record) => {
    const updatedRecord = {
      ...record,
      templateType: "email",
    };
    dispatch(setSelectedTemplate(updatedRecord));
  };

  const handleWhatsappStarToggle = (record) => {
    const toggleFavourite = {
      whatsappTemplateIsFavourite: !record.whatsappTemplateIsFavourite,
      whatsappTemplate_id: record.whatsappTemplate_id,
    };

    dispatch(editProfile(toggleFavourite));
  };
  const handleEmailStarToggle = (record) => {
    const toggleFavourite = {
      emailTemplateIsFavourite: !record.emailTemplateIsFavourite,
      emailTemplate_id: record.emailTemplate_id,
    };

    dispatch(editProfile(toggleFavourite));
  };
  const selectedTemplate = useSelector((state) => state.selectedTemplate);

  const handleDeleteTemplate = () => {
    const templateDataDelete = {
      templateType: `${selectedTemplate.templateType}Template`,
      ...(selectedTemplate.templateType === "whatsapp"
        ? { template_id: selectedTemplate.whatsappTemplate_id }
        : { template_id: selectedTemplate.emailTemplate_id }),
    };
    dispatch(deleteTemplate(templateDataDelete));
  };
  const whatsappTemplateColumns = [
    {
      title: "",
      dataIndex: "isFavourite",
      width: 40,
      render: (_, record, index) => (
        <div
          className="set-star rating-select"
          onClick={() => handleWhatsappStarToggle(record)}
          style={{ cursor: "pointer" }}
        >
          <i
            className={`fa ${
              record.whatsappTemplateIsFavourite
                ? "fa-solid fa-star"
                : "fa-regular fa-star"
            }`}
            style={{
              color: record.whatsappTemplateIsFavourite ? "gold" : "gray",
            }}
          ></i>
        </div>
      ),
    },
    {
      title: "Title",
      dataIndex: "whatsappTemplateTitle",
      key: "whatsappTemplateTitle",
      width: 200,
      render: (text, record) => {
        return (
          <div className="cell-content justify-content-between">
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="offcanvas"
              data-bs-target="#whatsapp_template_offcanvas"
              style={{
                padding: 5,
                maxWidth: 400,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                padding: 5,
              }}
              onClick={() => {
                handleWhatsappTemplateEditClick(record);
              }}
            >
              {text}
            </Link>

            <div>
              <Link
                to="#"
                className="action-icon "
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={() => {
                  handleWhatsappTemplateEditClick(record);
                }}
              >
                <HiEllipsisVertical />
              </Link>
              <div className="dropdown-menu dropdown-menu-right">
                <Link
                  className="dropdown-item"
                  to="#"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#whatsapp_template_offcanvas"
                >
                  <i className="ti ti-edit text-blue" /> Edit
                </Link>
                <Link
                  className="dropdown-item"
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target={`#delete_${deleteModalText}`}
                  onClick={() => {
                    setDeleteModalText("template");
                  }}
                >
                  <i className="ti ti-trash text-danger"></i> Delete
                </Link>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Message",
      dataIndex: "whatsappTemplateMessage",
      key: "whatsappTemplateMessage",

      render: (text, record) => {
        return (
          <div
            className=""
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {text}
          </div>
        );
      },
    },
  ];
  const emailTemplateColumns = [
    {
      title: "",
      dataIndex: "isFavourite",
      width: 40,
      render: (_, record, index) => (
        <div
          className="set-star rating-select"
          onClick={() => handleEmailStarToggle(record)}
          style={{ cursor: "pointer" }}
        >
          <i
            className={`fa ${
              record.emailTemplateIsFavourite
                ? "fa-solid fa-star"
                : "fa-regular fa-star"
            }`}
            style={{
              color: record.emailTemplateIsFavourite ? "gold" : "gray",
            }}
          ></i>
        </div>
      ),
    },
    {
      title: "Title",
      dataIndex: "emailTemplateTitle",
      key: "emailTemplateTitle",
      width: 200,
      // onCell: () => ({
      //   className: "hoverable-cell", // Adding a class for the cell
      // }),

      render: (text, record) => {
        return (
          <div className="cell-content justify-content-between">
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="offcanvas"
              data-bs-target="#email_template_offcanvas"
              style={{ padding: 5 }}
              onClick={() => {
                handleEmailTemplateEditClick(record);
              }}
            >
              {text}
            </Link>

            <div>
              <Link
                to="#"
                className="action-icon "
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={() => {
                  handleEmailTemplateEditClick(record);
                }}
              >
                <HiEllipsisVertical />
              </Link>
              <div className="dropdown-menu dropdown-menu-right">
                <Link
                  className="dropdown-item"
                  to="#"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#email_template_offcanvas"
                >
                  <i className="ti ti-edit text-blue" /> Edit
                </Link>
                <Link
                  className="dropdown-item"
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target={`#delete_${deleteModalText}`}
                  onClick={() => {
                    setDeleteModalText("template");
                  }}
                >
                  <i className="ti ti-trash text-danger"></i> Delete
                </Link>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Subject",
      dataIndex: "emailTemplateSubject",
      key: "emailTemplateSubject",
      width: 200,
      render: (text, record) => {
        return (
          <div
            className=""
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {text}
          </div>
        );
      },
    },
    {
      title: "Body",
      dataIndex: "emailTemplateBody",
      key: "emailTemplateBody",
      render: (text, record) => {
        return (
          <div
            className=""
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {text}
          </div>
        );
      },
    },
  ];

  const filteredWhatsappTemplateData =
    userProfile?.templates?.whatsappTemplates?.whatsappTemplatesData?.filter(
      (template) => {
        return template;
      }
    );

  const filteredEmailTemplateData =
    userProfile?.templates?.emailTemplates?.emailTemplatesData?.filter(
      (template) => {
        return template;
      }
    );
    const toggleAllFaouriteWhatsappTemplates=()=>{

    }
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="card mb-3">
              <div className="card-header">
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
                      onClick={() => {
                        setSearchEmailTemplateQuery("");
                        setSearchWhatsappTemplateQuery("");
                      }}
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
                       onClick={() => {
                        setSearchEmailTemplateQuery("");
                        setSearchWhatsappTemplateQuery("");
                      }}
                    >
                      <MdMail className="me-2" />
                      Email Templates
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="card-body pb-0">
                <div className="tab-content pt-0">
                  <div
                    className="tab-pane fade active show"
                    id="whatsappTemplates"
                    role="tabpanel"
                  >
                    <div className="row align-items-center mb-5">
                      <div className="col-sm-12">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="page-header mb-0">
                            <div className="row align-items-center">
                              <h4 className="page-title mb-0 ms-5">
                                Templates
                                <span className="count-title">
                                  {
                                    userProfile.templates?.whatsappTemplates
                                      ?.whatsappTemplatePagination
                                      ?.totalTemplates
                                  }
                                </span>
                              </h4>
                            </div>
                          </div>

                          <div className="d-flex">
                            <Link
                              to="#"
                              className="btn btn-soft-secondary me-2"
                              onClick={

                                toggleAllFaouriteWhatsappTemplates
                              }
                            >
                              <i
                                className={`fa ${
                                  showFavouriteWhatsappTemplates
                                    ? "fa-solid fa-star"
                                    : "fa-regular fa-star"
                                } me-2`}
                                style={{
                                  color: showFavouriteWhatsappTemplates
                                    ? "gold"
                                    : "gray",
                                }}
                              ></i>
                              Favourite
                            </Link>

                            <div className="icon-form mb-3  me-2 mb-sm-0">
                              <span className="form-icon">
                                <i className="ti ti-search" />
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search Template"
                                value={
                                  searchWhatsappTemplateQuery}
                                onChange={(text) =>
                                  setSearchWhatsappTemplateQuery(
                                    text.target.value
                                  )
                                }
                              />
                            </div>

                            <Link
                              to="#"
                              className="btn btn-primary me-2"
                              data-bs-toggle="offcanvas"
                              data-bs-target="#whatsapp_template_offcanvas"
                              onClick={() => {
                                // setSelectedContact(null);
                                dispatch(resetSelectedTemplate());
                              }}
                            >
                              <i className="ti ti-square-rounded-plus me-2" />
                              Add Template
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-8">
                        <div className="d-flex align-items-center flex-wrap row-gap-2 justify-content-sm-end"></div>
                      </div>
                    </div>
                    <div className="custom-table">
                      <Table
                        dataSource={filteredWhatsappTemplateData}
                        columns={whatsappTemplateColumns}
                        rowKey={(record) => record.key}
                        // loading={isLoading}
                        totalCount={
                          userProfile.templates?.whatsappTemplates
                            ?.whatsappTemplatePagination?.totalTemplates
                        }
                        onPageChange={handleWhatsappTemplatePageChange}
                      />
                    </div>
                  </div>
                  <div
                    className="tab-pane fade show"
                    id="emailTemplates"
                    role="tabpanel"
                  >
                    <div className="row align-items-center mb-5">
                      <div className="col-sm-12">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="page-header mb-0">
                            <div className="row align-items-center">
                              <h4 className="page-title mb-0 ms-5">
                                Templates
                                <span className="count-title">
                                  {
                                    userProfile.templates?.emailTemplates
                                      ?.emailTemplatePagination?.totalTemplates
                                  }
                                </span>
                              </h4>
                            </div>
                          </div>
                          <div className="d-flex">
                            <Link
                              to="#"
                              className="btn btn-soft-secondary me-2"
                              onClick={() => {}}
                            >
                              <i
                                className={`fa ${
                                  showFavouriteEmailTemplates
                                    ? "fa-solid fa-star"
                                    : "fa-regular fa-star"
                                } me-2`}
                                style={{
                                  color: showFavouriteEmailTemplates
                                    ? "gold"
                                    : "gray",
                                }}
                              ></i>
                              Favourite
                            </Link>

                            <div className="icon-form mb-3  me-2 mb-sm-0">
                              <span className="form-icon">
                                <i className="ti ti-search" />
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search Template"
                                value={searchEmailTemplateQuery}
                               onChange={(text) =>
                                  setSearchEmailTemplateQuery(
                                    text.target.value
                                  )
                                }
                              />
                            </div>

                            <Link
                              to="#"
                              className="btn btn-primary me-2"
                              data-bs-toggle="offcanvas"
                              data-bs-target="#email_template_offcanvas"
                              onClick={() => {
                                // setSelectedContact(null);
                                dispatch(resetSelectedTemplate());
                              }}
                            >
                              <i className="ti ti-square-rounded-plus me-2" />
                              Add Template
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-8">
                        <div className="d-flex align-items-center flex-wrap row-gap-2 justify-content-sm-end"></div>
                      </div>
                    </div>
                    <div className="custom-table">
                      <Table
                        dataSource={filteredEmailTemplateData}
                        columns={emailTemplateColumns}
                        rowKey={(record) => record.key}
                        // loading={isLoading}
                        totalCount={
                          userProfile.templates?.emailTemplates
                            ?.emailTemplatePagination?.totalTemplates
                        }
                        onPageChange={handleEmailTemplatePageChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <WhatsappTemplateOffcanvas />
        <EmailTemplateOffcanvas />
        {<DeleteModal text={deleteModalText} onDelete={handleDeleteTemplate} />}
      </div>
    </div>
  );
};

export default Templates;
