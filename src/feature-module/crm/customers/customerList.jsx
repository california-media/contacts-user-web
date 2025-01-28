import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import {
  companyName,
  duration,
  initialSettings,
  optionssymbol,
  priorityList,
  project,
  salestypelist,
  socialMedia,
  contactStatus,
  status,
  tagInputValues,
  owner as companyEmployee,
  all_tags,
} from "../../../core/common/selectoption/selectoption";
import Select from "react-select";
import { Link } from "react-router-dom";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { contactData } from "../../../core/data/json/contactData";
import Table from "../../../core/common/dataTable/index";
import { Modal } from "react-bootstrap";
import { TableData } from "../../../core/data/interface";
import CreatableSelect from 'react-select/creatable';
import { useDispatch, useSelector } from "react-redux";
import { HiEllipsisVertical } from "react-icons/hi2";
import "./customer.css"
import {
  setActivityTogglePopup,
  setActivityTogglePopupTwo,
  setAddTogglePopupTwo,
} from "../../../core/data/redux/commonSlice";
import { TagsInput } from "react-tag-input-component";
import { all_routes } from "../../router/all_routes";
import DatePicker from "react-datepicker";
import DefaultEditor from "react-simple-wysiwyg";
import CollapseHeader from "../../../core/common/collapse-header";
import { SelectWithImage } from "../../../core/common/selectWithImage";
import { SelectWithImage2 } from "../../../core/common/selectWithImage2";
import { MdDoubleArrow } from "react-icons/md";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { utils, writeFile } from "xlsx";
import EditCell from "../../../core/common/editCell/EditCell";
import AvatarInitialStyles from "../../../core/common/nameInitialStyles/AvatarInitialStyles";
import { CiEdit } from "react-icons/ci";
import CustomerOffcanvas from "../../../core/common/offCanvas/customer/CustomerOffcanvas";
import { setPhone } from "../../../core/data/redux/slices/appCommonSlice";
import DeleteModal from "../../../core/common/modals/DeleteModal";
const ContactList = () => {
  const route = all_routes;
  const [owner, setOwner] = useState(["Collab"]);
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeRecordKey, setActiveRecordKey] = useState(null);
  const [statusContact, setStatusContact] = useState({});
  const [activeCell, setActiveCell] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredRecord, setHoveredRecord] = useState(null);
  const [deleteModalText, setDeleteModalText] = useState("");
  const [searchEmployeeInFilter, setSearchEmployeeInFilter] = useState("");
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const handleDateChange1 = (date) => {
    setSelectedDate1(date);
  };
  const dispatch = useDispatch();
  const activityToggle = useSelector((state) => state?.activityTogglePopup);
  const activityToggleTwo = useSelector(
    (state) => state?.activityTogglePopupTwo
  );
  const addTogglePopupTwo = useSelector((state) => state?.addTogglePopupTwo);
  const handleEditClick = (rowKey, columnKey) => {
    setActiveCell({ rowKey, columnKey });
  };
  const handleClose = () => {
    setActiveCell(null);
  };
  const handleSaveField = (key, field, value) => {
    // Update the record data here. For example:
    // const updatedData = tableData.map((item) =>
    //   item.key === key ? { ...item, [field]: value } : item
    // );
    // setTableData(updatedData);
  };
  const handleCustomerEditClick = (record) => {
    setSelectedCustomer(record);
  };
  const currentDateAndTime = new Date();
  const currentDate = currentDateAndTime.toLocaleDateString();
  const currentTime = currentDateAndTime.toLocaleTimeString();
  const handleContactStatus = (rowKey, value) => {
    setStatusContact((prevState) => ({
      ...prevState,
      [rowKey]: value,
    }));
  };
  useEffect(() => {
    const initialStatuses = contactData.reduce((acc, lead) => {
      acc[lead.key] = lead.status;
      return acc;
    }, {});
    setStatusContact(initialStatuses);
  }, [contactData]);
  const dealsopen = [
    { value: "choose", label: "Choose" },
    { value: "collins", label: "Collins" },
    { value: "konopelski", label: "Konopelski" },
    { value: "adams", label: "Adams" },
    { value: "schumm", label: "Schumm" },
    { value: "wisozk", label: "Wisozk" },
  ];
  const activities = [
    { value: "choose", label: "Choose" },
    { value: "phoneCalls", label: "Phone Calls" },
    { value: "socialMedia", label: "Social Media" },
    { value: "referralSites", label: "Referral Sites" },
    { value: "webAnalytics", label: "Web Analytics" },
    { value: "previousPurchases", label: "Previous Purchases" },
  ];
  const industries = [
    { value: "choose", label: "Choose" },
    { value: "Retail Industry", label: "Retail Industry" },
    { value: "Banking", label: "Banking" },
    { value: "Hotels", label: "Hotels" },
    { value: "Financial Services", label: "Financial Services" },
    { value: "Insurance", label: "Insurance" },
  ];
  const contactPersonsWithDetails = [
    { name: "Collins Robertson", contact_number: "1234567890", contact_mail: 'abc@google.com', date_created: '15 Sept 2024', occupation: 'General Manager', company_name: 'Google' },
    { name: "Konopelski", contact_number: "1234567890", contact_mail: 'abc@google.com', date_created: '15 Sept 2024', occupation: 'Care Taker', company_name: 'Meta' },
    { name: "Adams", contact_number: "1234567890", contact_mail: 'abc@google.com', date_created: '15 Sept 2024', occupation: 'Network Engineer', company_name: 'Netflix' },
    { name: "Schumm", contact_number: "1234567890", contact_mail: 'abc@google.com', date_created: '15 Sept 2024', occupation: 'Developer', company_name: 'Microsoft' },
    { name: "Wisozk", contact_number: "1234567890", contact_mail: 'abc@google.com', date_created: '15 Sept 2024', occupation: 'Sales Executive', company_name: 'Oracle' },
  ];
  const languages = [
    { value: "Choose", label: "Choose" },
    { value: "English", label: "English" },
    { value: "Arabic", label: "Arabic" },
    { value: "Chinese", label: "Chinese" },
    { value: "Hindi", label: "Hindi" },
  ];
  const countries = [
    { value: "Choose", label: "Choose" },
    { value: "India", label: "India" },
    { value: "USA", label: "USA" },
    { value: "France", label: "France" },
    { value: "UAE", label: "UAE" },
  ];
  const [stars, setStars] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContactStatus, setSelectedContactStatus] = useState([]);
  const [selectedContactEmployee, setSelectedContactEmployee] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({
    "": true,
    Name: true,
    Phone: true,
    Company: true,
    Email: true,
    'Contact Status': true,
    // Location: true,
    // Contact: true,
    Tag: true,
    Owner: true,
    Action: true,
  });
  const all_companies = [
    ...new Set(
      contactData
        .map((contact) => contact.customer_company)
        .filter((company) => company !== "") // Filter out empty companies
    )
  ].map((company) => ({ label: company, value: company }));

  const exportPDF = () => {
    const doc = new jsPDF();

    const filteredColumns = columns.filter(
      (col) =>
        columnVisibility[col.title] &&
        col.title !== "Action" &&
        col.title !== "Contact"
    );

    const headers = filteredColumns.map((col) => col.title);
    const data = filteredContactData.map((row) =>
      filteredColumns.map((col) => row[col.dataIndex] || "")
    );

    const pageWidth = doc.internal.pageSize.getWidth();
    const titleText = "Contacts Report";
    const titleWidth = doc.getTextWidth(titleText);
    const titleX = (pageWidth - titleWidth) / 2;

    doc.setFontSize(15);
    doc.text(titleText, titleX, 20);

    doc.setFontSize(10);
    doc.text(`Exported on: ${currentDate} at ${currentTime}`, 15, 35);


    autoTable(doc, {
      startY: 40,
      head: [headers],
      body: data,
    });

    doc.save("Contacts_report.pdf");
  };

  const exportExcel = () => {
    const wb = utils.book_new();
    const filteredColumns = columns.filter(
      (col) => columnVisibility[col.title]
        && col.title !== "Action"
        && col.title !== "Contact"
    );
    const wsData = [
      [`Exported on: ${currentDate} at ${currentTime}`],
      [],
      filteredColumns.map((col) => col.title),
      ...filteredContactData.map((row) =>
        filteredColumns.map((col) => row[col.dataIndex] || "")
      ),
    ];

    const ws = utils.aoa_to_sheet(wsData);

    utils.book_append_sheet(wb, ws, "Contacts");


    writeFile(wb, "Contacts_report.xlsx");
  };

  //   const contactPersons = [...new Set(contactPersonsWithDetails.map((contactPerson) => contactPerson.name))]

  // console.log(contactPersonsWithDetails.length,"no of contacts contacts")

  const columns = [
    {
      title: "",
      dataIndex: "",
      render: (text, record, index) => (
        <div
          className={`set-star rating-select ${stars[index] ? "filled" : ""}`}
          onClick={() => handleStarToggle(index)}
          key={index}
        >
          <i className="fa fa-star"></i>
        </div>
      ),
    },

    {
      title: "Company",
      dataIndex: "customer_company",
      width: 200,
      onCell: () => ({
        className: "hoverable-cell",
      }),
      render: (text, record) => {
        return (
          <div className="d-flex justify-content-between">
            <Link className="customer-name" to={route.contactDetails} state={{ record }} style={{ color: '#2c5cc5', fontWeight: 700 }}>
              {text}
            </Link>
            <div>
              <Link
                to=""
                className="action-icon"
                data-bs-toggle="dropdown"
                aria-expanded="true"
              >
                <HiEllipsisVertical />
              </Link>
              <div className="icons">
                <div className="action-icons d-flex justify-content-center">
                  <a
                    //  href={`tel:${text}`}
                    onClick={() => {dispatch(setPhone(record.phone))}}
                    className="action-icon me-3"
                    title="Call"
                  >
                    <i className="ti ti-phone" />
                  </a>

                  <a
                    href={""}
                    className="action-icon"
                    title="WhatsApp"
                  >
                    <i className="ti ti-mail me-1" />
                  </a>
                </div>
              </div>
              <div
                className="dropdown-menu dropdown-menu-right"
                style={{
                  position: "absolute",
                  inset: "0px auto auto 0px",
                  margin: "0px",
                  transform: "translate3d(-99.3333px, 35.3333px, 0px)",
                }}
                data-popper-placement="bottom-start"
              >
                <Link
                  className="dropdown-item edit-popup"
                  to=""
                  data-bs-toggle="offcanvas"
                  data-bs-target="#customer_offcanvas"
                  onClick={() => {
                    handleCustomerEditClick(record)
                  }}
                >
                  <i className="ti ti-edit text-blue"></i> Edit
                </Link>
                <Link
                  className="dropdown-item"
                  to=""
                  data-bs-toggle="modal"
                  data-bs-target={`#delete_${deleteModalText}`}
                  onClick={() => { setDeleteModalText("customer") }}
                >
                  <i className="ti ti-trash text-danger"></i> Delete
                </Link>
              </div>
            </div>
          </div>
        )
      },

      sorter: (a, b) => a.customer_company.localeCompare(b.customer_company),
    },
    {
      title: "Name",
      dataIndex: "customer_name",
      render: (text, record, index) => (

        <div className="d-flex align-items-center justify-content-between avatar-wrap">
          <div className="group-avatar">

            {contactPersonsWithDetails.map((contactPerson, index) => {
              return (
                <span
                  className="avatar cus-avatar position-relative"
                  key={index}
                  onMouseEnter={() => {
                    setHoveredIndex(index);
                    setHoveredRecord(record.id);
                  }}
                  onMouseLeave={() => {
                    setHoveredIndex(null);
                    setHoveredRecord(null);
                  }}
                >
                  <Link
                    to=""
                    data-bs-toggle="tooltip"
                    data-bs-placement="right"
                    aria-label="Member 1"
                    data-bs-original-title="Member 1"
                  >
                    <AvatarInitialStyles name={contactPerson.name} />
                  </Link>
                  {hoveredIndex === index && hoveredRecord === record.id && (
                    <div className="avatarHoverCard">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <div className="d-flex">
                            <p className="mb-0 me-1" style={{ lineHeight: "24px" }}>
                              {contactPerson.name}
                            </p>
                            <p className="mb-0 text-muted" style={{ lineHeight: "24px" }}>
                              ({contactPerson.company_name})
                            </p>
                          </div>
                          <p className="mb-0 text-muted" style={{ lineHeight: '24px' }}>{contactPerson.occupation}</p>
                        </div>

                        <div className="action-icons-contact-card d-flex justify-content-center">
                          <a
                            //  href={`tel:${text}`}
                            data-bs-toggle="offcanvas"
                            data-bs-target="#customer_offcanvas"
                            onClick={() => { handleCustomerEditClick(record) }}
                            className="action-icon me-3"
                            title="Edit"
                            style={{ color: '#2a2a33', fontWeight: 600 }}
                          >
                            <CiEdit />
                          </a>
                          <a
                            //  href={`tel:${text}`}
                            onClick={() => { }}
                            className="action-icon me-3"
                            title="Call"
                          >
                            <i className="ti ti-phone" />
                          </a>

                          <a
                            href={""}
                            className="action-icon"
                            title="WhatsApp"
                          >
                            <i className="ti ti-message-circle-share me-3" />
                          </a>
                          <a
                            href={""}
                            className="action-icon"
                            title="WhatsApp"
                          >
                            <i className="ti ti-mail me-1" />
                          </a>
                        </div>
                      </div>
                      <div className="borderTopBottom">
                        <p className="contactSince">
                          Contact since {contactPerson.date_created}
                        </p>
                      </div>
                    </div>
                  )}
                </span>
              )
            })}
            {/* <span className="count d-block">
            <Link to="">+9 Members</Link>
          </span> */}
          </div>
          <Link to="" className="">
            <i data-feather="star" className="feather-16" />
          </Link>
        </div>
      ),
      sorter: (a, b) => a.customer_name.localeCompare(b.customer_name),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (text, record) => {
        return (
          <>
            <EditCell
              fieldName="Phone"
              fieldValue={text}
              recordKey={record.key}
              columnKey="phone"
              routeLink=""
              textColor="#2c5cc5"
              isActive={
                activeCell?.rowKey === record.key &&
                activeCell?.columnKey === "phone"
              }
              onSave={(key, value) => handleSaveField(key, "phone", value)}
              onEditClick={() => handleEditClick(record.key, "phone")}
              onClose={handleClose}
            />

          </>
        );
      },
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },

    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => {
        return (
          <>

            <EditCell
              fieldName="Email"
              fieldValue={text}
              recordKey={record.key}
              columnKey="email"
              routeLink=""
              textColor="#2c5cc5"
              isActive={
                activeCell?.rowKey === record.key &&
                activeCell?.columnKey === "email"
              }
              onSave={(key, value) => handleSaveField(key, "email", value)}
              onEditClick={() => handleEditClick(record.key, "email")}
              onClose={handleClose}
            />

          </>
        );
      },
      sorter: (a, b) => a.email.localeCompare(b.email),
    },

    {
      title: "Tag",
      dataIndex: "customer_tag",
      render: (text, record) => {
        return (
          <>
            <EditCell
              fieldName="Tag"
              fieldValue={text}
              recordKey={record.key}
              columnKey="customer_tag"
              routeLink=""
              textColor="#2c5cc5"
              isActive={
                activeCell?.rowKey === record.key &&
                activeCell?.columnKey === "customer_tag"
              }
              onSave={(key, value) => handleSaveField(key, "customer_tag", value)}
              onEditClick={() => handleEditClick(record.key, "customer_tag")}
              onClose={handleClose}
            />
          </>
        );
      },
      sorter: (a, b) => a.customer_tag.localeCompare(b.customer_tag),
    },
    {
      title: "Owner",
      dataIndex: "owner",
      render: (text, record) => (
        <>
          <EditCell
            fieldName="Owner"
            fieldValue={text}
            recordKey={record.key}
            columnKey="owner"
            isActive={
              activeCell?.rowKey === record.key &&
              activeCell?.columnKey === "owner"
            }
            onSave={(key, value) => handleSaveField(key, "owner", value)}
            onEditClick={() => handleEditClick(record.key, "owner")}
            onClose={handleClose}
          />
        </>
      ),
      sorter: (a, b) => a.owner.localeCompare(b.owner),
    },
    {
      title: "Contact Status",
      dataIndex: "status",
      render: (text, record) => (
        <div>
          <div className="dropdown d-inline-block">
            <Link
              to=""
              className="py-1 border-0"
              style={{
                boxShadow: "none",
                fontSize: "12px",
                padding: "4px 8px 4px 4px",
                color:
                  statusContact[record.key] === "Active"
                    ? "#00795b"
                    : statusContact[record.key] === "dummy"
                      ? "#264966"
                      : statusContact[record.key] === "dummy2"
                        ? "#d58c08"
                        : statusContact[record.key] === "Inactive"
                          ? "#ff1616c7"
                          : "#000000c7",
                backgroundColor:
                  statusContact[record.key] === "Active"
                    ? "#e0f5f1"
                    : statusContact[record.key] === "dummy3"
                      ? "#dff0ff"
                      : statusContact[record.key] === "dummy4"
                        ? "#ffd9947a"
                        : statusContact[record.key] === "Inactive"
                          ? "#c169692b"
                          : "#62626273",
              }}
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <MdDoubleArrow />
              {statusContact[record.key] || "Select Status"}
            </Link>
            <div className="dropdown-menu dropdown-menu-right">
              {contactStatus.map((contactStatus, index) => (
                <Link
                  className="dropdown-item"
                  to=""
                  key={index}
                  onClick={() => handleContactStatus(record.key, contactStatus.value)}
                >
                  {contactStatus.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
  ];
  const resetFilters = () => {
    setSelectedContactStatus([]);
    setSelectedContactEmployee([]);
    setSearchEmployeeInFilter("");
  };

  const visibleColumns = columns.filter(
    (column) => columnVisibility[column.title]
  );
  const initializeStarsState = () => {
    const starsState = {};
    contactData.forEach((item, index) => {
      starsState[index] = false;
    });
    setStars(starsState);
  };

  // Call initializeStarsState once when the component mounts
  React.useEffect(() => {
    initializeStarsState();
  }, []);
  const data = contactData;
  const handleStarToggle = (index) => {
    setStars((prevStars) => ({
      ...prevStars,
      [index]: !prevStars[index],
    }));
  };
  const filteredContactData = contactData.filter((contact) => {
    const isAnySearchColumnVisible =
      columnVisibility["Name"] ||
      columnVisibility["Phone"] ||
      columnVisibility["Email"];


    const matchesSearchQuery =
      !isAnySearchColumnVisible ||
      (columnVisibility["Name"] &&
        contact.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (columnVisibility["Phone"] &&
        contact.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (columnVisibility["Email"] &&
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()));


    const matchesStatus =
      selectedContactStatus.length === 0 ||
      selectedContactStatus.includes(contact.status.toLowerCase());

    const matchesEmployee =
      selectedContactEmployee.length === 0 ||
      selectedContactEmployee.includes(contact.owner.toLowerCase());

    return matchesSearchQuery && matchesStatus && matchesEmployee;
  });
  const handleToggleColumnVisibility = (columnTitle) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [columnTitle]: !prevVisibility[columnTitle],
    }));
  };
  const filterContactEmployee = (contactEmployee) => {
    setSelectedContactEmployee((prevStatus) =>
      prevStatus.includes(contactEmployee)
        ? prevStatus.filter((employee) => employee !== contactEmployee)
        : [...prevStatus, contactEmployee]
    );
  };

  const filteredEmployees = companyEmployee.filter((employee) =>
    employee.value.toLowerCase().includes(searchEmployeeInFilter.toLowerCase())
  );
  const filterContactStatus = (contactStatus) => {
    setSelectedContactStatus(
      (prevStatus) =>
        prevStatus.includes(contactStatus)
          ? prevStatus.filter((status) => status !== contactStatus)
          : [...prevStatus, contactStatus]
    );
  };
  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">

              <div className="card ">
                <div className="card-header">
                  {/* Search */}
                  <div className="row align-items-center">
                    <div className="col-sm-12">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="page-header mb-0 ms-5">
                          <div className="row align-items-center">
                            <h4 className="page-title mb-0">
                              Customers<span className="count-title">{filteredContactData.length}</span>
                            </h4>
                          </div>
                        </div>
                        <div className="d-flex">
                          <div className="d-flex">
                            <div className="icon-form mb-3  me-2 mb-sm-0">
                              <span className="form-icon">
                                <i className="ti ti-search" />
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search Customers"
                                onChange={(text) =>
                                  setSearchQuery(text.target.value)
                                }
                              />
                            </div>
                            <div className="form-sorts dropdown me-2">
                              <Link
                                to=""
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
                                          to=""
                                          className="collapsed"
                                          data-bs-toggle="collapse"
                                          data-bs-target="#Status"
                                          aria-expanded="false"
                                          aria-controls="Status"
                                        >
                                          Contact Status
                                        </Link>
                                      </div>
                                      <div
                                        className="filter-set-contents accordion-collapse collapse"
                                        id="Status"
                                        data-bs-parent="#accordionExample"
                                      >
                                        <div className="filter-content-list">
                                          <ul>
                                            {contactStatus.map(
                                              (contactStatus, index) => {
                                                return (
                                                  <li key={index}>
                                                    <div className="filter-checks">
                                                      <label className="checkboxs">
                                                        <input
                                                          type="checkbox"
                                                          checked={selectedContactStatus.includes(
                                                            contactStatus.value.toLowerCase()
                                                          )} // Check if status is selected
                                                          onChange={() =>
                                                            filterContactStatus(
                                                              contactStatus.value.toLowerCase()
                                                            )
                                                          }
                                                        />
                                                        <span className="checkmarks" />
                                                        {contactStatus.value}
                                                      </label>
                                                    </div>
                                                  </li>
                                                );
                                              }
                                            )}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="filter-set-content">
                                      <div className="filter-set-content-head">
                                        <Link
                                          to=""
                                          className="collapsed"
                                          data-bs-toggle="collapse"
                                          data-bs-target="#owner"
                                          aria-expanded="false"
                                          aria-controls="owner"
                                        >
                                          Contact Owner
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
                                                          checked={selectedContactEmployee.includes(
                                                            companyEmployee.value.toLowerCase()
                                                          )}
                                                          onChange={() =>
                                                            filterContactEmployee(
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
                                    </div>
                                  </div>
                                  <div className="filter-reset-btns">
                                    <div className="row">
                                      <div className="col-6"></div>
                                      <div className="col-6">
                                        <Link
                                          to=""
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
                                to=""
                                className="btn bg-soft-purple text-purple"
                                data-bs-toggle="dropdown"
                                data-bs-auto-close="outside"
                              >
                                <i className="ti ti-columns-3 me-2" />
                                Manage Columns
                              </Link>
                              <div className="dropdown-menu  dropdown-menu-md-end dropdown-md p-3">
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
                          </div>
                          <div className="d-flex">
                            <div className="dropdown me-2">
                              <Link
                                to=""
                                className="dropdown-toggle"
                                data-bs-toggle="dropdown"
                              >
                                <i className="ti ti-package-export me-2" />
                                Export
                              </Link>
                              <div className="dropdown-menu  dropdown-menu-end">
                                <ul className="mb-0">
                                  <li>
                                    <Link
                                      to=""
                                      className="dropdown-item"
                                      onClick={exportPDF}
                                    >
                                      <i className="ti ti-file-type-pdf text-danger me-1" />
                                      Export as PDF
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      to=""
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
                              to=""
                              className="btn btn-primary me-2"
                              data-bs-toggle="offcanvas"
                              data-bs-target="#customer_offcanvas"
                              onClick={() => {
                                setSelectedCustomer(null);
                              }}
                            >
                              <i className="ti ti-square-rounded-plus me-2" />
                              Add Customer
                            </Link>
                            <div className="view-icons">
                              <Link to={route.leads} className="active">
                                <i className="ti ti-list-tree" />
                              </Link>
                              <Link to={route.contactGrid}>
                                <i className="ti ti-grid-dots" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Search */}
                </div>

                <div className="card-body">

                  {/* Contact List */}
                  <div className="table-responsive custom-table">
                    <Table
                      dataSource={filteredContactData}
                      columns={visibleColumns}
                      rowKey={(record) => record.key}
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
      {/* Add Contact */}

      <CustomerOffcanvas  selectedCustomer={selectedCustomer}/>
      {/* Delete Modal */}
      {<DeleteModal text={deleteModalText} />}
      {/* /Delete Modal */}
      {/* Create Deal */}
      <Modal show={openModal} onHide={() => setOpenModal(false)}>
        <div className="modal-header border-0 m-0 justify-content-end">
          <button
            className="btn-close"
            aria-label="Close"
            onClick={() => setOpenModal(false)}
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="modal-body">
          <div className="success-message text-center">
            <div className="success-popup-icon bg-light-blue">
              <i className="ti ti-medal" />
            </div>
            <h3>Deal Created Successfully!!!</h3>
            <p>View the details of deal, created</p>
            <div className="col-lg-12 text-center modal-btn">
              <Link
                to=""
                className="btn btn-light"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </Link>
              <Link to={route.contactDetails} className="btn btn-primary">
                View Details
              </Link>
            </div>
          </div>
        </div>
      </Modal>
      {/* /Create Deal */}
      {/* Create Contact */}
      <Modal show={openModal2} onHide={() => setOpenModal2(false)}>
        <div className="modal-header border-0 m-0 justify-content-end">
          <button
            className="btn-close"
            aria-label="Close"
            onClick={() => setOpenModal2(false)}
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="modal-body">
          <div className="success-message text-center">
            <div className="success-popup-icon bg-light-blue">
              <i className="ti ti-user-plus" />
            </div>
            <h3>Contact Created Successfully!!!</h3>
            <p>View the details of contact, created</p>
            <div className="col-lg-12 text-center modal-btn">
              <Link
                to=""
                className="btn btn-light"
                onClick={() => setOpenModal2(false)}
              >
                Cancel
              </Link>
              <Link to={route.contactDetails} className="btn btn-primary">
                View Details
              </Link>
            </div>
          </div>
        </div>
      </Modal>
      {/* /Create Contact */}
      {/* Access */}
      <div className="modal fade" id="access_view" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Access For</h5>
              <button
                className="btn-close custom-btn-close border p-1 me-0 text-dark"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form>
              <div className="modal-body">
                <div className="icon-form mb-3">
                  <span className="form-icon">
                    <i className="ti ti-search" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                  />
                </div>
                <div className="access-wrap mb-0">
                  <ul>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <img src="assets/img/profiles/avatar-19.jpg" alt="" />
                          <Link to="">Darlee Robertson</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <img src="assets/img/profiles/avatar-20.jpg" alt="" />
                          <Link to="">Sharon Roy</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <img src="assets/img/profiles/avatar-21.jpg" alt="" />
                          <Link to="">Vaughan</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <img src="assets/img/profiles/avatar-01.jpg" alt="" />
                          <Link to="">Jessica</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <img src="assets/img/profiles/avatar-16.jpg" alt="" />
                          <Link to="">Carol Thomas</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <img src="assets/img/profiles/avatar-22.jpg" alt="" />
                          <Link to="">Dawn Mercha</Link>
                        </span>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="modal-footer">
                <div className="d-flex align-items-center justify-content-end m-0">
                  <button
                    type="button"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    data-bs-dismiss="modal"
                    type="button"
                    className="btn btn-primary"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Access */}
    </div>
  );
};

export default ContactList;
