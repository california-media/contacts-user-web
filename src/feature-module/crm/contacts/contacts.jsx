import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import Select from "react-select";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import { MdDoubleArrow } from "react-icons/md";
import "./contacts.css";
import "antd/dist/reset.css";
import {
  countryoptions1,
  languageOptions,
  optiondeals,
  optionindustry,
  options,
  optionschoose,
  optionsource,
  leadStatus,
  optionssymbol,
  owner as companyEmployee,
} from "../../../core/common/selectoption/selectoption";
import { leadsData } from "../../../core/data/json/leads";
import { MdMail } from "react-icons/md";
import { Modal } from "react-bootstrap";
import { TableData } from "../../../core/data/interface";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import CollapseHeader from "../../../core/common/collapse-header";
import { SelectWithImage2 } from "../../../core/common/selectWithImage2";
import { all_routes } from "../../router/all_routes";
import { TagsInput } from "react-tag-input-component";
import Offcanvas from "react-bootstrap/Offcanvas";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { utils, writeFile } from "xlsx";
import { Wizard, useWizard } from "react-use-wizard";
import { HiEllipsisVertical } from "react-icons/hi2";

// import { init } from 'ys-webrtc-sdk-ui';
import "ys-webrtc-sdk-ui/lib/ys-webrtc-sdk-ui.css";
import { useAppDispatch, useAppSelector } from "../../../core/data/redux/hooks";

import { setPhone } from "../../../core/data/redux/slices/appCommonSlice";
import EditCell from "../../../core/common/editCell/EditCell";
import { Pagination } from "antd";
import ContactOffcanvas from "../../../core/common/offCanvas/contact/ContactOffcanvas";
import DeleteModal from "../../../core/common/modals/DeleteModal";
import api from "../../../core/axios/axiosInstance";
import {
  deleteContact,
  fetchContacts,
  saveContact,
} from "../../../core/data/redux/slices/ContactSlice";
import { useSelector } from "react-redux";
import {
  resetSelectedContact,
  setSelectedContact,
  setSelectedContactSlice,
} from "../../../core/data/redux/slices/SelectedContactSlice";
import { fetchTags } from "../../../core/data/redux/slices/TagSlice";
import { IoMdPricetag } from "react-icons/io";

const Contacts = () => {
  const route = all_routes;
  const [adduser, setAdduser] = useState(false);
  const [addcompany, setAddCompany] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add New Contact");
  const data = leadsData;
  const [owner, setOwner] = useState(["Collab"]);
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [whatsppTemplateTitles, setWhatsppTemplateTitles] = useState([]);
  const [emailTemplateTitles, setEmailTemplateTitles] = useState([]);
  const [show3, setShow3] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContactGroup, setSelectedContactGroup] = useState([]);
  const [editWhatsappTemplateMessage, setEditWhatsappTemplateMessage] =
    useState("");
  const [editEmailTemplateBody, setEditEmailTemplateBody] = useState("");
  const [editEmailTemplateSubject, setEditEmailTemplateSubject] = useState("");
  const [selectedLeadEmployee, setSelectedLeadEmployee] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [stars, setStars] = useState({});
  const [newContents, setNewContents] = useState([0]);
  const [statusLead, setStatusLead] = useState({});
  const [deleteModalText, setDeleteModalText] = useState("");
  const [searchEmployeeInFilter, setSearchEmployeeInFilter] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");
  // const [selectedContact, setSelectedContact] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState();
  const selectedContact = useSelector((state) => state.selectedContact);
  const { tags } = useSelector((state) => state.tags);
  const [activeRecordKey, setActiveRecordKey] = useState(null);
  const [activeCell, setActiveCell] = useState(null);

  const [importModal, setImportModal] = useState(false);
  const dispatch = useAppDispatch();

  const { contacts, loading, error, totalPages, totalContacts } = useSelector(
    (state) => state.contacts
  );

  const userProfile = useSelector((state) => state.profile);

  console.log(userProfile, "userProfile in contacts from redux");

  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setLimit(newPageSize);
  };

  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date().toDateString(),
    endDate: new Date().toDateString(),
  });
  const currentDateAndTime = new Date();
  const currentDate = currentDateAndTime.toLocaleDateString();
  const currentTime = currentDateAndTime.toLocaleTimeString();
  const handleRadioSelect = (option) => {
    setSelectedOption(option); // Update the selected option
  };
  const handleRadioSelect2 = (option) => {
    setSelectedOption2(option); // Update the selected option
  };

  const handleEditClick = (rowKey, columnKey, record) => {
    dispatch(setSelectedContact(record));

    setActiveCell({ rowKey, columnKey });
  };

  const handleDeleteContact = () => {
    dispatch(deleteContact(selectedContact.contact_id));
  };
  const handleClose = () => {
    setActiveCell(null);
  };

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
    setWhatsppTemplateTitles(whatsappTitles);
  }, [userProfile]);

  const resetFilters = () => {
    setSelectedContactGroup([]);
    // setSelectedLeadEmployee([]);
    // setSearchEmployeeInFilter("");
  };
  const handleDownload = () => {
    const data = [
      [
        "Status",
        "Tags",
        "Address",
        "City",
        "State",
        "Zip code",
        "Country",
        "Source",
        "Medium",
        "Keyword",
        "Facebook (Username)",
        "Twitter (Username)",
        "LinkedIn (Username)",
        "Account name",
        "Account address",
        "Account city",
        "Account state",
        "Account country",
        "Account zip code",
        "Account phone",
        "Account industry type",
        "Account business type",
        "Account number of employees",
        "Account website",
      ],
      [
        "New",
        "Tag1;Tag2;Tag3",
        "1552 camp st",
        "San Diego",
        "CA",
        "90241",
        "USA",
        "Organic Search",
        "Blog",
        "B2B Success",
        "jane-sampleton",
        "janesampleton",
        "jane-sampleton-0b0039109",
        "Xyli (sample)",
        "160-6802 Aliquet Rd.",
        "New Haven",
        "Connecticut",
        "United States",
        "68089",
        "-3059",
        "Insurance",
        "Competitor",
        "51-200",
        "xyli.io",
      ],
      [
        "Qualified",
        "Tag4;Tag5;Tag6",
        "53 N. Stonybrook Ave.",
        "Fairmont",
        "WV",
        "26554",
        "USA",
        "Web",
        "Blog",
        "Tech",
        "mark-samples",
        "marksamples",
        "mark-samples-24",
        "Zeno (sample)",
        "93 Queen Street",
        "Lafayette",
        "Indiana",
        "United States",
        "47905",
        "-3060",
        "Banking",
        "Analyst",
        "201-500",
        "zeno.com",
      ],
      [
        "Won",
        "Tag7;Tag8;Tag9",
        "9343 Circle St.",
        "Twin Falls",
        "ID",
        "83301",
        "USA",
        "Referral",
        "Blog",
        "B2C",
        "jane-doe",
        "janedoe",
        "jane-doe-j10",
        "Monx (sample)",
        "277 Bayport St.",
        "Levittown",
        "New York",
        "United States",
        "11756",
        "-3061",
        "Consulting",
        "Partner",
        "501-1000",
        "monx.inc",
      ],
    ];

    // Convert data to CSV format
    const csvContent =
      "data:text/csv;charset=utf-8," +
      data.map((row) => row.join(",")).join("\n");

    // Create a Blob and download it as an Excel file
    const downloadLink = document.createElement("a");
    downloadLink.href = encodeURI(csvContent);
    downloadLink.download = "sample.csv";

    // Simulate a click to trigger the download
    downloadLink.click();
  };

  const Step1 = () => {
    const { previousStep, nextStep } = useWizard();

    return (
      <>
        <h2 className="uploadHeading mb-3">
          Select a way to import your contacts
        </h2>
        <p className="uploadSubHeading">
          Contacts (or 'leads') are people you engage with
        </p>
        <div className="d-flex justify-content-center">
          <div
            className={`importMenu ${
              selectedOption === "csvExcel" ? "selected" : ""
            }`}
            onClick={() => handleRadioSelect("csvExcel")}
          >
            <div className="importIcons">
              <ImageWithBasePath
                src="assets/img/customIcons/excelLogo.png"
                alt="Excel Logo"
              />
            </div>
            <p className="importType">CSV or Excel</p>
          </div>
          <div
            className={`importMenu ${
              selectedOption === "hubSpot" ? "selected" : ""
            }`}
            onClick={() => handleRadioSelect("hubSpot")}
          >
            <div className="importIcons">
              <ImageWithBasePath
                src="assets/img/customIcons/hubspotLogo.png"
                alt="Hubspot Logo"
              />
            </div>
            <p className="importType">HubSpot</p>
          </div>
        </div>
        <div className="d-flex justify-content-center mt-3">
          <div
            className={`importMenu ${
              selectedOption === "pipedrive" ? "selected" : ""
            }`}
            onClick={() => handleRadioSelect("pipedrive")}
          >
            <div className="importIcons">
              <ImageWithBasePath
                src="assets/img/customIcons/pipedriveLogo.png"
                alt="Pipedrive Logo"
              />
            </div>
            <p className="importType">Pipedrive</p>
          </div>
          <div
            className={`importMenu ${
              selectedOption === "zoho" ? "selected" : ""
            }`}
            onClick={() => handleRadioSelect("zoho")}
          >
            <div className="importIcons">
              <ImageWithBasePath
                src="assets/img/customIcons/excelLogo.png"
                alt="Zoho Logo"
              />
            </div>
            <p className="importType">Zoho</p>
          </div>
        </div>
        <div className="wizardBtnContainer">
          {selectedOption && (
            <button
              className="nextStep btn btn-primary"
              onClick={() => nextStep()}
            >
              Next
            </button>
          )}
        </div>
      </>
    );
  };
  const Step2 = () => {
    const { handleStep, previousStep, nextStep } = useWizard();

    return (
      <>
        <h2 className="uploadHeading">Tell us what your files Contains</h2>
        <div className="d-flex justify-content-center">
          <div
            className={`importMenu2 ${
              selectedOption2 === "contacts" ? "selected" : ""
            }`}
            onClick={() => handleRadioSelect2("contacts")}
          >
            <div>
              <div className="importIcons2">
                <ImageWithBasePath
                  src="assets/img/customIcons/userImport.svg"
                  alt="User Import"
                />
              </div>
              <p className="importType2">Contacts</p>
              <p className="text-center">
                My file has information about people
              </p>
            </div>
          </div>
          <div
            className={`importMenu2 ${
              selectedOption2 === "contactsAndAccounts" ? "selected" : ""
            }`}
            onClick={() => handleRadioSelect2("contactsAndAccounts")}
          >
            <div>
              <div className="importIcons2">
                <ImageWithBasePath
                  src="assets/img/customIcons/userImport.svg"
                  alt="User Import"
                />
              </div>
              <p className="importType2">Contacts and Accounts</p>
              <p className="text-center">
                My file has information about people and their companies
              </p>
            </div>
          </div>
        </div>

        <div className="wizardBtnContainer">
          <button
            className="btn btn-light me-2 previousStep"
            onClick={() => previousStep()}
          >
            Go Back
          </button>
          {selectedOption2 && (
            <button
              className="btn btn-primary nextStep"
              onClick={() => nextStep()}
            >
              Next
            </button>
          )}
        </div>
      </>
    );
  };
  const Step3 = () => {
    const { handleStep, previousStep, nextStep } = useWizard();

    return (
      <>
        {selectedOption === "csvExcel" && (
          <div>
            <h2 className="uploadHeading">Upload Your File</h2>
            <div className="uploadSectionContainer">
              <div className="uploadSectionInnerBox">
                <div className="uploadSectionImageBox">
                  <ImageWithBasePath
                    src="assets/img/customIcons/excelLogo.png"
                    className="uploadSectionImage"
                    alt="Excel Logo"
                  />
                </div>
                <div className="profile-upload d-block">
                  <div className="profile-upload-content">
                    <label className="profile-upload-btn">
                      <i className="ti ti-file-broken" /> Upload File
                      <input type="file" className="input-img" />
                    </label>
                    <p>Only Excel or CSV file</p>
                  </div>
                </div>
                <p className="supportedFormat">
                  (Supported formats .csv,.xlsx; max file size 5 MB)
                </p>
                <p className="text-muted">
                  Download a{" "}
                  <span
                    onClick={handleDownload}
                    style={{ cursor: "pointer", color: "#2c5cc5" }}
                  >
                    sample CSV
                  </span>
                </p>
              </div>
            </div>
            <div className="wizardBtnContainer">
              <button
                className="btn btn-light previousStep"
                onClick={() => previousStep()}
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  // const handleSave = () => {

  //   setPopupVisible(false);
  // };

  // const handleCancel = () => {
  //   setPopupVisible(false);
  // };

  const handleSaveField = (key, field, value) => {
    // Update the selectedContact with the new value
    const updatedContact = { ...selectedContact, [field]: value };

    // Create a FormData object
    const formDataObj = new FormData();

    // Add the updated contact fields to the FormData object
    formDataObj.append("contact_id", updatedContact.contact_id);
    formDataObj.append("emailaddresses", updatedContact.emailaddresses);
    formDataObj.append("phonenumbers", updatedContact.phonenumbers);

    // Dispatch saveContact with the updated form data
    dispatch(saveContact(formDataObj));
  };

  const handleDateRangeChange = (startDate, endDate) => {
    setSelectedDateRange({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
  };
  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  // Initial column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    "": true,
    Name: true,
    Company: true,
    Phone: true,
    Email: true,
    Groups: true,
    // "Created Date": true,
    // Owner: true,
    Action: true,
  });
  const navigate = useNavigate();
  const handleShow = () => setShow(true);
  const handleClose2 = () => setShow(false);
  const handleShow2 = () => setShow(true);
  const handleClose3 = () => setShow(false);
  const handleShow3 = () => setShow(true);
  const togglePopup = (isEditing) => {
    setModalTitle(isEditing ? "Update Contact" : "Add New Contact");
    setAdduser(!adduser);
  };
  const addcompanyPopup = () => {
    setAddCompany(!addcompany);
  };

  // const handleStarToggle = (index) => {
  //   setStars((prevStars) => ({
  //     ...prevStars,
  //     [index]: !prevStars[index],
  //   }));
  // };
  const handleStarToggle = (index, record) => {
    const formDataObj = new FormData();
    const isFavToggled = !record.isFavourite;

    // Add the updated contact fields to the FormData object
    formDataObj.append("contact_id", record.contact_id);
    formDataObj.append("isFavourite", isFavToggled);

    dispatch(saveContact(formDataObj));
  };
  const handleToggleColumnVisibility = (columnTitle) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [columnTitle]: !prevVisibility[columnTitle],
    }));
  };
  // Seach Employee in filter
  const filteredEmployees = companyEmployee.filter((employee) =>
    employee.value.toLowerCase().includes(searchEmployeeInFilter.toLowerCase())
  );

  useEffect(() => {
    setAllContacts(contacts);
  }, [contacts]);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const filters = {
      id: userId,
      page,
      limit,
      search: searchQuery,
      tag: selectedContactGroup,
    };

    dispatch(fetchContacts({ filters }));
  }, [page, limit, dispatch, searchQuery, selectedContactGroup]);

  useEffect(() => {
    const shouldHideActionAndBlank = Object.keys(columnVisibility)
      .filter((key) => key !== "" && key !== "Action")
      .every((key) => columnVisibility[key] === false);

    setColumnVisibility((prevState) => {
      // Only update the state if the values are actually different
      if (
        (shouldHideActionAndBlank && (prevState.Action || prevState[""])) ||
        (!shouldHideActionAndBlank && (!prevState.Action || !prevState[""]))
      ) {
        return {
          ...prevState,
          Action: shouldHideActionAndBlank ? false : true,
          "": shouldHideActionAndBlank ? false : true,
        };
      }
      return prevState; // No update needed
    });
  }, [columnVisibility]);

  const handlePhoneClick = (phone) => {
    dispatch(setPhone(phone));
  };

  const handleLeadEditClick = (record) => {
    dispatch(setSelectedContact(record));

    // setSelectedContact(record);
  };

  const columns = [
    {
      title: "",
      dataIndex: "isFavourite",
      width: 40,
      render: (_, record, index) => (
        <div
          className="set-star rating-select"
          onClick={() => handleStarToggle(index, record)}
          style={{ cursor: "pointer" }}
        >
          <i
            className={`fa ${
              record.isFavourite ? "fa-solid fa-star" : "fa-regular fa-star"
            }`}
            style={{ color: record.isFavourite ? "gold" : "gray" }}
          ></i>
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "firstname",
      key: "firstname",
      width: 300,
      fixed:"left",
      onCell: () => ({
        className: "hoverable-cell", // Adding a class for the cell
      }),

      render: (text, record) => {
        return (
          <div className="cell-content justify-content-between">
            {/* Lead name */}

            <Link
              to={route.contactsDetails}
              state={{ record }}
              className="lead-name title-name fw-bold "
              style={{ color: "#2c5cc5" }}
              onClick={() => dispatch(setSelectedContact(record))}
            >
              {text} {record.lastname}
            </Link>

            {/* Icons that will be shown on hover */}
            <div className="icons">
              <div className="action-icons d-flex justify-content-center">
                <a
                  //  href={`tel:${text}`}
                  onClick={() => handlePhoneClick(record.phonenumbers[0])}
                  className="action-icon me-3"
                  title="Call"
                >
                  <i className="ti ti-phone" />
                </a>

                <Link
                  // href={
                  //   record.phonenumbers?.length > 0
                  //     ? `https://wa.me/${record.phonenumbers[0]}`
                  //     : "#"
                  // }
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#show_whatsapp_templates"
                  className="link-purple fw-medium action-icon"
                  onClick={() => {
                    dispatch(setSelectedContact(record));
                  }}
                  title="WhatsApp"
                  // target="_blank"
                >
                  <i className="fa-brands fa-whatsapp me-3"></i>
                </Link>
                <Link
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#show_email_templates"
                  className="link-purple fw-medium action-icon"
                  onClick={() => {
                    dispatch(setSelectedContact(record));
                  }}
                  title="Email"
                >
                  <MdMail />
                </Link>
              </div>
            </div>
            <div>
              <Link
                to="#"
                className="action-icon "
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={() => {
                  handleLeadEditClick(record);
                }}
              >
                <HiEllipsisVertical />
              </Link>
              <div className="dropdown-menu dropdown-menu-right">
                <Link
                  className="dropdown-item"
                  to="#"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#contact_offcanvas"
                >
                  <i className="ti ti-edit text-blue" /> Edit
                </Link>
                <Link
                  className="dropdown-item"
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target={`#delete_${deleteModalText}`}
                  onClick={() => {
                    setDeleteModalText("lead");
                  }}
                >
                  <i className="ti ti-trash text-danger"></i> Delete
                </Link>
              </div>
            </div>
          </div>
        );
      },

      sorter: (a, b) => a.firstname.localeCompare(b.firstname),
    },
    // {
    //   title: "Company",
    //   dataIndex: "customer_company",
    //   width: 200,
    //   onCell: (record) => ({
    //     onMouseEnter: () => {
    //       const editIcon = document.querySelector(`.edit-icon-${record.key}`);
    //       if (editIcon) editIcon.style.visibility = "visible";
    //     },
    //     onMouseLeave: () => {
    //       const editIcon = document.querySelector(`.edit-icon-${record.key}`);
    //       if (editIcon) editIcon.style.visibility = "hidden";
    //     },
    //   }),
    //   render: (text, record) => {
    //     console.log(record,"Reddddd");

    //     return (
    //       <>
    //         <EditCell
    //           fieldName="Company Name"
    //           fieldValue={text}
    //           textColor="#2c5cc5"
    //           routeLink="#"
    //           recordKey={record.key}
    //           columnKey="customer_company"
    //           isActive={record.key === activeRecordKey}
    //           onEditClick={() => {
    //             // setActiveRecordKey(record.key);
    //             handleEditClick(record.key, "customer_company",record)
    //           }}
    //           onClose={() => setActiveRecordKey(null)}
    //           onSave={(key, value) =>
    //             handleSaveField(key, "customer_company", value)
    //           }
    //         />
    //       </>
    //     );
    //   },
    //   sorter: (a, b) => a.customer_company.localeCompare(b.customer_company),
    // },
    {
      title: "Phone",
      dataIndex: "phonenumbers",
      width: 200,
      key: "phonenumbers",
      onCell: (record) => ({
        onMouseEnter: () => {
          const editIcon = document.querySelector(`.edit-icon-${record.key}`);
          if (editIcon) editIcon.style.visibility = "visible";
        },
        onMouseLeave: () => {
          const editIcon = document.querySelector(`.edit-icon-${record.key}`);
          if (editIcon) editIcon.style.visibility = "hidden";
        },
      }),
      render: (text, record) => {
        return (
          <>
            <EditCell
              fieldName="Phone"
              fieldValue={text}
              recordKey={record.contact_id}
              columnKey="phonenumbers"
              routeLink="#"
              textColor="#2c5cc5"
              isActive={
                activeCell?.rowKey === record.contact_id &&
                activeCell?.columnKey === "phonenumbers"
              }
              onSave={(key, value) =>
                handleSaveField(key, "phonenumbers", value)
              }
              onEditClick={() =>
                handleEditClick(record.contact_id, "phonenumbers", record)
              }
              onClose={handleClose}
            />
          </>
        );
      },
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Email",
      dataIndex: "emailaddresses",
      width: 300,
      key: "emailaddresses",
      onCell: (record) => ({
        onMouseEnter: () => {
          const editIcon = document.querySelector(`.edit-icon-${record.key}`);
          if (editIcon) editIcon.style.visibility = "visible";
        },
        onMouseLeave: () => {
          const editIcon = document.querySelector(`.edit-icon-${record.key}`);
          if (editIcon) editIcon.style.visibility = "hidden";
        },
      }),
      render: (text, record) => {
        return (
          <>
            <EditCell
              fieldName="Email"
              fieldValue={text}
              recordKey={record.key}
              columnKey="emailaddresses"
              routeLink="#"
              textColor="#2c5cc5"
              isActive={
                activeCell?.rowKey === record.contact_id &&
                activeCell?.columnKey === "emailaddresses"
              }
              onSave={(key, value) => {
                handleSaveField(key, "emailaddresses", value);
              }}
              onEditClick={() =>
                handleEditClick(record.contact_id, "emailaddresses", record)
              }
              onClose={handleClose}
            />
          </>
        );
      },
      sorter: (a, b) => a.emailaddresses.localeCompare(b.emailaddresses),
    },
    {
      title: "Groups",
      dataIndex: "tags",
      render: (text, record) => {
        return (
          <div>
            {text.length > 0 && (
              <div className="d-inline-block">
                {text.map((tag, index) => {
                  return (
                    <div
                      className="py-1 px-2 d-inline-block me-2"
                      key={index}
                      style={{ background: "#dff0ff", borderRadius: 5 }}
                    >
                     <div className="d-flex align-items-center">
                        <img src="/assets/img/icons/tagIcon.svg" className="me-1" style={{color:"#264966"}}/>
                        <div style={{color:"#264966"}}>{tag}</div>
                     </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      },
      // sorter: (a, b) => a.status.localeCompare(b.status),
    },
  ];

  const handleLeadStatus = (rowKey, value) => {
    setStatusLead((prevState) => ({
      ...prevState,
      [rowKey]: value,
    }));
  };
  useEffect(() => {
    const initialStatuses = leadsData.reduce((acc, lead) => {
      acc[lead.key] = lead.status;
      return acc;
    }, {});
    setStatusLead(initialStatuses);
  }, [leadsData]);

  const getDateRanges = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const startOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    const startOfLast30Days = new Date(today);
    startOfLast30Days.setDate(today.getDate() - 30);

    const startOfLast7Days = new Date(today);
    startOfLast7Days.setDate(today.getDate() - 7);

    const ranges = {
      "Last 30 Days": [startOfLast30Days, today],
      "Last 7 Days": [startOfLast7Days, today],
      "Last Month": [startOfLastMonth, endOfLastMonth],
      "This Month": [startOfMonth, endOfMonth],
      Today: [today, today],
      Yesterday: [yesterday, yesterday],
    };

    return {
      endDate: today,
      ranges,
      startDate: startOfLast7Days,
      timePicker: false,
    };
  };

  const initialSettings = getDateRanges();

  const addNewContent = () => {
    setNewContents([...newContents, newContents.length]);
  };
  const filteredData = allContacts.filter((lead) => {
    // const leadDate = new Date(lead.created_date).toDateString();

    const isAnySearchColumnVisible =
      columnVisibility["Name"] ||
      columnVisibility["Company"] ||
      columnVisibility["Phone"] ||
      columnVisibility["Email"];

    // const matchesSearchQuery =
    //   !isAnySearchColumnVisible ||
    //   (columnVisibility["Name"] &&
    //     lead?.firstname?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    //   (columnVisibility["Company"] &&
    //     lead.customer_company
    //       .toLowerCase()
    //       .includes(searchQuery.toLowerCase())) ||
    //   (columnVisibility["Phone"] &&
    //     lead.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
    //   (columnVisibility["Email"] &&
    //     lead.emailaddresses.toLowerCase().includes(searchQuery.toLowerCase()));

    // Check if lead matches selected statuses
    // const matchesStatus =
    // selectedLeadStatus.length === 0 || // If no status is selected, show all
    // selectedLeadStatus.includes(lead.status.toLowerCase());
    // Check if lead matches selected employee
    const matchesEmployee =
      selectedLeadEmployee.length === 0 || // If no status is selected, show all
      selectedLeadEmployee.includes(lead.owner.toLowerCase());

    // Check if lead date is within the selected date range
    // const matchesDateRange =
    //   selectedDateRange.startDate || selectedDateRange.endDate || // If no date range is selected, show all
    //   console.log(selectedDateRange.endDate, "selectedDateRange.endDate");

    // (leadDate >= selectedDateRange.startDate && leadDate <= selectedDateRange.endDate);

    return matchesEmployee;
    // && matchesDateRange;
    // matchesSearchQuery &&
  });

  const filterContactGroup = (tag) => {
    setSelectedContactGroup(
      (prevStatus) =>
        prevStatus.includes(tag)
          ? prevStatus.filter((status) => status !== tag) // Remove status if unchecked
          : [...prevStatus, tag] // Add status if checked
    );
  };
  const filterLeadEmployee = (leadEmployee) => {
    setSelectedLeadEmployee((prevStatus) =>
      prevStatus.includes(leadEmployee)
        ? prevStatus.filter((employee) => employee !== leadEmployee)
        : [...prevStatus, leadEmployee]
    );
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    // Filter columns based on column visibility
    const filteredColumns = columns.filter(
      (col) =>
        columnVisibility[col.title] && // Check if the column is visible
        col.title !== "Action" // Exclude the Action column from export
    );

    // Create headers and data based on filtered columns
    const headers = filteredColumns.map((col) => col.title);
    const data = filteredData.map((row) =>
      filteredColumns.map((col) => row[col.dataIndex] || "")
    );

    const pageWidth = doc.internal.pageSize.getWidth();
    const titleText = "Contacts";
    const titleWidth = doc.getTextWidth(titleText);
    const titleX = (pageWidth - titleWidth) / 2;

    doc.setFontSize(15);
    doc.text(titleText, titleX, 20);

    doc.setFontSize(10);
    doc.text(`Exported on: ${currentDate} at ${currentTime}`, 15, 35);

    // Generate the table with the headers and data
    autoTable(doc, {
      startY: 40,
      head: [headers],
      body: data,
    });

    // Save the PDF
    doc.save("Contacts.pdf");
  };

  const exportExcel = () => {
    const wb = utils.book_new();

    // Filter out the columns that are hidden (same as for PDF export)
    const filteredColumns = columns.filter(
      (col) => columnVisibility[col.title] && col.title !== "Action"
    );

    // Prepare worksheet data (only include visible columns)
    const wsData = [
      filteredColumns.map((col) => col.title), // Column headers
      ...filteredData.map((row) =>
        filteredColumns.map((col) => row[col.dataIndex] || "")
      ),
    ];

    // Convert array of arrays to a sheet
    const ws = utils.aoa_to_sheet(wsData);

    // Append the worksheet to the workbook
    utils.book_append_sheet(wb, ws, "Calls");

    // Save the Excel file
    writeFile(wb, "Contacts.xlsx");
  };

  // Filter columns based on checkbox state
  const visibleColumns = columns.filter(
    (column) => columnVisibility[column.title]
  );

  const numberOfLeads = filteredData.length;

  return (
    <>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    {/* Search */}
                    <div className="row align-items-center">
                      <div className="col-sm-12">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="page-header mb-0">
                            <div className="row align-items-center">
                              <h4 className="page-title mb-0 ms-5">
                                Contacts
                                <span className="count-title">
                                  {totalContacts}
                                </span>
                              </h4>
                            </div>
                          </div>

                          <div className="d-flex">
                            <div className="icon-form mb-3  me-2 mb-sm-0">
                              <span className="form-icon">
                                <i className="ti ti-search" />
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search Contacts"
                                onChange={(text) =>
                                  setSearchQuery(text.target.value)
                                }
                              />
                            </div>
                            <div className="form-sorts dropdown me-2">
                              <Link
                                to="#"
                                data-bs-toggle="dropdown"
                                data-bs-auto-close="outside"
                              >
                                <i className="ti ti-filter-share" />
                                Filter
                              </Link>
                              <div className="filter-dropdown-menu dropdown-menu  dropdown-menu-md-end p-3">
                                <div className="filter-set-view">
                                  <div className="filter-set-head">
                                    <h4>
                                      <i className="ti ti-filter-share" />
                                      Filter
                                    </h4>
                                  </div>
                                  <div
                                    className="accordion"
                                    id="accordionExample"
                                  >
                                    <div className="filter-set-content">
                                      <div className="filter-set-content-head">
                                        <Link
                                          to="#"
                                          className="collapsed"
                                          data-bs-toggle="collapse"
                                          data-bs-target="#Status"
                                          aria-expanded="false"
                                          aria-controls="Status"
                                        >
                                          Groups ({tags.length})
                                        </Link>
                                      </div>
                                      <div
                                        className="filter-set-contents accordion-collapse collapse"
                                        id="Status"
                                        data-bs-parent="#accordionExample"
                                      >
                                        <div className="filter-content-list">
                                          <ul>
                                            {tags.map((tag, index) => {
                                              return (
                                                <li key={index}>
                                                  <div className="filter-checks">
                                                    <label className="checkboxs">
                                                      {/* <input
                                                          type="checkbox"
                                                          checked={selectedLeadStatus.includes(
                                                            leadStatus.value.toLowerCase()
                                                          )} // Check if status is selected
                                                          onChange={() =>
                                                            filterLeadStatus(
                                                              leadStatus.value.toLowerCase()
                                                            )
                                                          } // Call filterLeadStatus on change
                                                        /> */}
                                                      <input
                                                        type="checkbox"
                                                        checked={selectedContactGroup.includes(
                                                          tag.tag.toLowerCase()
                                                        )} // Check if status is selected
                                                        onChange={() =>
                                                          filterContactGroup(
                                                            tag.tag.toLowerCase()
                                                          )
                                                        } // Call filterLeadStatus on change
                                                      />
                                                      <span className="checkmarks" />
                                                      {tag.tag}
                                                    </label>
                                                  </div>
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>

                                    {/* <div className="filter-set-content">
                                      <div className="filter-set-content-head">
                                        <Link
                                          to="#"
                                          className="collapsed"
                                          data-bs-toggle="collapse"
                                          data-bs-target="#owner"
                                          aria-expanded="false"
                                          aria-controls="owner"
                                        >
                                          Lead Owner
                                        </Link>
                                      </div>
                                      <div
                                        className="filter-set-contents accordion-collapse collapse"
                                        id="owner"
                                        data-bs-parent="#accordionExample"
                                      >
                                        <div className="filter-content-list">
                                          <div className="mb-2 icon-form">
                                            <span className="form-icon">
                                              <i className="ti ti-search" />
                                            </span>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Search Owner"
                                              value={searchEmployeeInFilter}
                                              onChange={(e) =>
                                                setSearchEmployeeInFilter(
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                          <ul>
                                            {filteredEmployees.map(
                                              (companyEmployee, index) => {
                                                return (
                                                  <li key={index}>
                                                    <div className="filter-checks">
                                                      <label className="checkboxs">
                                                        <input
                                                          type="checkbox"
                                                          checked={selectedLeadEmployee.includes(
                                                            companyEmployee.value.toLowerCase()
                                                          )}
                                                          onChange={() =>
                                                            filterLeadEmployee(
                                                              companyEmployee.value.toLowerCase()
                                                            )
                                                          }
                                                        />
                                                        <span className="checkmarks" />
                                                        {companyEmployee.value}
                                                      </label>
                                                    </div>
                                                  </li>
                                                );
                                              }
                                            )}
                                          </ul>
                                        </div>
                                      </div>
                                    </div> */}
                                  </div>
                                  <div className="filter-reset-btns">
                                    <div className="row">
                                      <div className="col-6"></div>
                                      <div className="col-6">
                                        <Link
                                          to="#"
                                          className="btn btn-primary"
                                          onClick={resetFilters}
                                        >
                                          Reset
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="dropdown me-2">
                              <Link
                                to="#"
                                className="btn bg-soft-purple text-purple"
                                data-bs-toggle="dropdown"
                                data-bs-auto-close="outside"
                              >
                                <i className="ti ti-columns-3 me-2" />
                                Manage Columns
                              </Link>
                              <div className="dropdown-menu  dropdown-menu-md-end dropdown-md p-3">
                                <h4 className="mb-2 fw-semibold">
                                  Manage columns
                                </h4>
                                <div className="border-top pt-3">
                                  {columns.map((column, index) => {
                                    if (
                                      column.title === "Action" ||
                                      column.title === ""
                                    ) {
                                      return;
                                    }
                                    return (
                                      <div
                                        className="d-flex align-items-center justify-content-between mb-3"
                                        key={index}
                                      >
                                        <p className="mb-0 d-flex align-items-center">
                                          <i className="ti ti-grip-vertical me-2" />
                                          {column.title}
                                        </p>
                                        <div className="status-toggle">
                                          <input
                                            type="checkbox"
                                            id={column.title}
                                            className="check"
                                            defaultChecked={true}
                                            onClick={() =>
                                              handleToggleColumnVisibility(
                                                column.title
                                              )
                                            }
                                          />
                                          <label
                                            htmlFor={column.title}
                                            className="checktoggle"
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            <div className="d-flex">
                              <div className="dropdown me-2">
                                <Link
                                  to="#"
                                  className="dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                >
                                  <i className="ti ti-package-export me-2" />
                                  Import / Export
                                </Link>
                                <div className="dropdown-menu  dropdown-menu-end">
                                  <ul className="mb-0">
                                    {/* <li>
                                      <button
                                        type="button"
                                        className="dropdown-item"
                                        onClick={() => setImportModal(true)}
                                      >
                                        <i className="ti ti-file-type-pdf text-danger me-1" />
                                        Import
                                      </button>
                                    </li> */}
                                    <li>
                                      <Link
                                        to="#"
                                        className="dropdown-item"
                                        onClick={exportPDF}
                                      >
                                        <i className="ti ti-file-type-pdf text-danger me-1" />
                                        Export as PDF
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        to="#"
                                        className="dropdown-item"
                                        onClick={exportExcel}
                                      >
                                        <i className="ti ti-file-type-xls text-green me-1" />
                                        Export as Excel{" "}
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <Link
                                to="#"
                                className="btn btn-primary me-2"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#contact_offcanvas"
                                onClick={() => {
                                  // setSelectedContact(null);
                                  dispatch(resetSelectedContact());
                                }}
                              >
                                <i className="ti ti-square-rounded-plus me-2" />
                                Add Contact
                              </Link>
                              {/* <div className="view-icons">
                                <Link to={route.leads} className="active">
                                  <i className="ti ti-list-tree" />
                                </Link>
                                <Link to={route.leadsKanban}>
                                  <i className="ti ti-grid-dots" />
                                </Link>
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-8">
                        <div className="d-flex align-items-center flex-wrap row-gap-2 justify-content-sm-end"></div>
                      </div>
                    </div>
                    {/* /Search */}
                  </div>
                  <div className="card-body">
                    {/* Filter */}
                    <div className="d-flex align-items-center justify-content-end flex-wrap row-gap-2 mb-4">
                      {/* <div className="d-flex align-items-center flex-wrap row-gap-2">

                        <div className="icon-form">
                          <span className="form-icon">
                            <i className="ti ti-calendar" />
                          </span>
                          <DateRangePicker initialSettings={initialSettings}>
                            <input
                              className="form-control bookingrange"
                              type="text"
                            />
                          </DateRangePicker>
                        </div>
                      </div> */}
                      <div className="d-flex align-items-center flex-wrap row-gap-2"></div>
                    </div>
                    {/* /Filter */}
                    {/* Contact List */}
                    <div className="table-responsive custom-table">
                      <Table
                        dataSource={filteredData}
                        columns={visibleColumns}
                        rowKey={(record) => record.key}
                        loading={isLoading}
                        totalCount={totalContacts}
                        onPageChange={handlePageChange}
                      />
                    </div>
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <div className="datatable-length" />
                      </div>
                      <div className="col-md-6">
                        <div className="datatable-paginate" />
                      </div>
                    </div>
                    {/* /Contact List */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Wrapper */}
        {/* Add Edit Lead */}
        <ContactOffcanvas selectedContact={selectedContact} />
        {/* /Add Edit Lead */}

        {/* Delete Lead */}
        {<DeleteModal text={deleteModalText} onDelete={handleDeleteContact} />}
        {/* /Delete Lead */}
        {/* Create Lead */}
        <Modal show={openModal2} onHide={() => setOpenModal2(false)}>
          <div className="modal-header border-0 m-0 justify-content-end">
            <button
              className="btn-close"
              onClick={() => setOpenModal2(false)}
              aria-label="Close"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <div className="modal-body">
            <div className="success-message text-center">
              <div className="success-popup-icon bg-light-blue">
                <i className="ti ti-building" />
              </div>
              <h3>Lead Created Successfully!!!</h3>
              <p>View the details of lead, created</p>
              <div className="col-lg-12 text-center modal-btn">
                <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <Link
                  to={route.contactsDetails}
                  onClick={() => setOpenModal2(false)}
                  className="btn btn-primary"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </Modal>
        {/* /Create Lead */}
        {/* Create Company */}
        <Modal show={openModal} onHide={() => setOpenModal(false)}>
          <div className="modal-header border-0 m-0 justify-content-end">
            <button
              className="btn-close"
              onClick={() => setOpenModal(false)}
              aria-label="Close"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <div className="modal-body">
            <div className="success-message text-center">
              <div className="success-popup-icon bg-light-blue">
                <i className="ti ti-building" />
              </div>
              <h3>Company Created Successfully!!!</h3>
              <p>View the details of company, created</p>
              <div className="col-lg-12 text-center modal-btn">
                <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <Link
                  to={route.companyDetails}
                  onClick={() => setOpenModal(false)}
                  className="btn btn-primary"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </Modal>
        {/* /Create Company */}
        {/* Add New View */}
        <div className="modal custom-modal fade" id="save_view" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New View</h5>
                <button
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="col-form-label">View Name</label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="modal-btn text-end">
                    <Link
                      to="#"
                      className="btn btn-light"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <button
                      type="button"
                      data-bs-dismiss="modal"
                      className="btn btn-danger"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Add New View */}
        {/* Access */}
        <div className="modal custom-modal fade" id="access_view" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Access For</h5>
                <button
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-2 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-search" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                    />
                  </div>
                  <div className="access-wrap">
                    <ul>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-19.jpg"
                              alt=""
                            />
                            <Link to="#">Darlee Robertson</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-20.jpg"
                              alt=""
                            />
                            <Link to="#">Sharon Roy</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-21.jpg"
                              alt=""
                            />
                            <Link to="#">Vaughan</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-01.jpg"
                              alt=""
                            />
                            <Link to="#">Jessica</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-16.jpg"
                              alt=""
                            />
                            <Link to="#">Carol Thomas</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-22.jpg"
                              alt=""
                            />
                            <Link to="#">Dawn Mercha</Link>
                          </span>
                        </label>
                      </li>
                    </ul>
                  </div>
                  <div className="modal-btn text-end">
                    <Link
                      to="#"
                      className="btn btn-light"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <button
                      type="button"
                      data-bs-dismiss="modal"
                      className="btn btn-primary"
                    >
                      Confirm
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Access */}

        {/* import leads */}
        <Modal
          show={importModal}
          onHide={() => setImportModal(false)}
          fullscreen
        >
          <div className="modal-header border-0 m-0 justify-content-end">
            <button
              className="btn-close"
              onClick={() => setImportModal(false)}
              aria-label="Close"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <div className="modal-body">
            <div>
              <Wizard
                startIndex={0}
                // wrapper={<Wrapper />}
              >
                <Step1 />
                <Step2 />
                <Step3 />
              </Wizard>
            </div>
          </div>
          <div className="modal-footer"></div>
        </Modal>
        {/* import leads */}
        <div
          className="modal custom-modal fade modal-padding"
          id="show_whatsapp_templates"
          role="dialog"
          style={{ minHeight: 500 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Whatsapp Templates</h5>
                <button
                  type="button"
                  className="btn-close position-static"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>

              <div className="d-flex align-items-center justify-content-end mb-3 mt-4 me-4">
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

                <button
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
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (selectedContact?.phonenumbers?.length > 0) {
                      const url = `https://wa.me/${selectedContact.phonenumbers[0]}?text=${editWhatsappTemplateMessage}`;
                      window.open(url, "_blank");
                    } else {
                      alert("Phone number not available");
                    }
                  }}
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal custom-modal fade modal-padding"
          id="show_email_templates"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Email Templates</h5>
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
                <div className="d-flex align-items-center justify-content-end mb-3">
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      if (selectedContact.emailaddresses?.length > 0) {
                        const recipient = selectedContact.emailaddresses[0];

                        const url = `mailto:${recipient}`;

                        window.open(url);
                      } else {
                        alert("Email not available");
                      }
                    }}
                  >
                    Go directly to Email
                  </button>
                </div>

                {/* {userProfile.emailTemplates?.length > 0
                  ? userProfile.emailTemplates.map((template, index) => {
                      const emailaddress =
                        selectedContact.emailaddresses?.length > 0
                          ? selectedContact.emailaddresses[0]
                          : null;

                      const subject = encodeURIComponent(
                        "Hello from Brand Toaster"
                      );
                      const body = encodeURIComponent(
                        "Hi there,\n\nI'd like to connect with you."
                      );
                      const recipient = selectedContact.emailaddresses[0];

                      const url = `mailto:${recipient}?subject=${subject}&body=${body}`;

                      return (
                        <div
                          key={index}
                          onClick={() => {
                            if (emailaddress) {
                              window.open(url);
                            } else {
                              alert("Phone number not available");
                            }
                          }}
                          style={{
                            backgroundColor: "#f5f5f5",
                            padding: "10px",
                            borderRadius: "10px",
                            marginBottom: "10px",
                            cursor: "pointer",
                            position: "relative",
                          }}
                        >
                          <div
                            className="set-star rating-select"
                            style={{
                              position: "absolute",
                              top: "10px",
                              right: "10px",
                            }}
                          >
                            <i
                              className={`fa ${
                                template.emailTemplateIsFavourite
                                  ? "fa-solid fa-star"
                                  : ""
                              }`}
                              style={{
                                color: template.emailTemplateIsFavourite
                                  ? "gold"
                                  : "",
                              }}
                            ></i>
                          </div>
                          <p className="fw-semibold">
                            {template.emailTemplateSubject}
                          </p>
                          <p>{template.emailTemplateBody}</p>
                        </div>
                      );
                    })
                  : "No templates found"} */}
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
                      onChange={(e) =>
                        setEditEmailTemplateSubject(e.target.value)
                      }
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="col-form-label col-md-2">Body</label>
                  <div className="col-md-12">
                    <textarea
                      rows={5}
                      cols={5}
                      className="form-control"
                      name="emailTemplateMessage"
                      placeholder="Enter text here"
                      onChange={(e) => setEditEmailTemplateBody(e.target.value)}
                      value={editEmailTemplateBody}
                    />
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (selectedContact?.emailaddresses?.length > 0) {
                      const url = `mailto:${selectedContact.emailaddresses[0]}?subject=${editEmailTemplateSubject}&body=${editEmailTemplateBody}`;
                      window.open(url, "_blank");
                    } else {
                      alert("Email not available");
                    }
                  }}
                >
                  Send Mail
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default Contacts;
