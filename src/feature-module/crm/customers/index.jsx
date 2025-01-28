import React, { useState, Suspense, useEffect } from "react";
import { FaTasks } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import { FcApproval } from "react-icons/fc";
import { TbFileInvoice, TbInvoice } from "react-icons/tb";
import { MdAttachMoney } from "react-icons/md";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { GoProjectRoadmap } from "react-icons/go";
import { IoTicketOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { all_tags } from "../../../core/common/selectoption/selectoption";
import CreatableSelect from 'react-select/creatable';
import CustomerOffcanvas from "../../../core/common/offCanvas/customer/CustomerOffcanvas";
import { SlPeople } from "react-icons/sl";
import { IoMdAttach } from "react-icons/io";
import { RxActivityLog } from "react-icons/rx";
import { BsChatLeftQuote, BsTicketPerforated } from "react-icons/bs";
import { AiOutlineDollar } from "react-icons/ai";


const ContactDetails = () => {
  const route = all_routes;
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("notes");
  const [openModal, setOpenModal] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(() => {
    // Load initial state from local storage
    const savedInfo = localStorage.getItem("customerInfo");
    return savedInfo ? JSON.parse(savedInfo) : {};
  });


  useEffect(() => {
    const record = location.state?.record || location.state?.customer || {};
    
    // If customerInfo is empty and there's new data, update state and local storage
    if (Object.keys(record).length > 0) {
      setCustomerInfo(record);
      localStorage.setItem("customerInfo", JSON.stringify(record));
    }
  }, [location.state, customerInfo]);


   const getInitials = (customer_name) => {
        if (customer_name) {
            const parts = customer_name.trim().split(" ");
            const firstName = parts[0] || '';
            const lastName = parts[1] || '';
            if (lastName) {
                return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
            }
            return `${firstName.charAt(0)}${firstName.charAt(1) || ''}`.toUpperCase();
        }
    };
  // Lazy load each tab component
  const Notes = React.lazy(() => import("./Notes"));
  const Tasks = React.lazy(() => import("./Tasks"));
  const Meetings = React.lazy(() => import("./Meetings"));
  const Calls = React.lazy(() => import("./Calls"));
  const Attachments = React.lazy(() => import("./Attachments"));
  const Activities = React.lazy(() => import("./Activities"));
  const Quotation = React.lazy(() => import("./Quotations"));
  const Invoice = React.lazy(() => import("./Invoice"));
  const CreditNotes = React.lazy(() => import("./CreditNotes"));
  const Tickets = React.lazy(() => import("./Tickets"));
  const Payments = React.lazy(() => import("./Payments"));



  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="contact-head">
                <div className="row align-items-center">
                  <div className="col-sm-6">
                    <ul className="contact-breadcrumb">
                      <li>
                        <Link to={route.contactList}>
                          <i className="ti ti-arrow-narrow-left" />
                          Customers
                        </Link>
                      </li>
                      <li>{customerInfo.customer_company}</li>
                    </ul>
                  </div>

                </div>
              </div>
              <div className="card">
                <div className="card-body pb-2">
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <div className="d-flex align-items-center mb-2">
                      <span
                        className="avatar avatar-lg bg-gray flex-shrink-0 me-2"
                      >
                        <span className="avatar-title text-dark">{getInitials(customerInfo.customer_company)}</span>
                      </span>
                      <div>
                        <h5 className="mb-0">{customerInfo.customer_company}{customerInfo.isVerified && <FcApproval className="ms-1" />}</h5>
                        <div className="d-flex">
                          <span className="me-1 text-dark">{customerInfo.customer_name}</span>
                          <p className="mb-0">({customerInfo.customer_occupation})</p>
                        </div>
                      </div>
                    </div>
                    <div className="contacts-action">


                      <Link to={route.leads} title="Quotation" className="btn-icon">
                        <LiaFileInvoiceDollarSolid />
                      </Link>
                      <Link to={route.leads} title="Invoice" className="btn-icon">
                        <TbInvoice />
                      </Link>
                      <Link to={route.leads} title="Payments" className="btn-icon">
                        <MdAttachMoney />
                      </Link>
                      <Link to={route.leads} title="Projects" className="btn-icon">
                        <GoProjectRoadmap />
                      </Link>
                      <Link to={route.leads} title="Ticket" className="btn-icon">
                        <IoTicketOutline />
                      </Link>
                      <Link to="" className="btn-icon rating">
                        <i className="fa-solid fa-star" />
                      </Link>
                      <Link
                        to=""
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#add_compose"
                      >
                        <i className="ti ti-mail" />
                        Send Email
                      </Link>
                      <Link
                        to=""
                        className="btn-icon"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#customer_offcanvas"
                        onClick={() => {
                          
                        }}
                      >
                        <CiEdit />
                      </Link>
                      <div className="act-dropdown">
                        <Link
                          to=""
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="ti ti-dots-vertical" />
                        </Link>
                        <div className="dropdown-menu dropdown-menu-right">
                          <Link
                            className="dropdown-item"
                            to=""
                            onClick={() => setOpenModal(true)}
                          >
                            <i className="ti ti-trash text-danger" />
                            Delete
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 theiaStickySidebar">
              <div className="card">
                <div className="card-body p-3">
                  <h6 className="mb-3 fw-semibold">Basic Information</h6>
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                        <i className="ti ti-mail" />
                      </span>
                      <p>{customerInfo.email}</p>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                        <i className="ti ti-phone" />
                      </span>
                      <p>{customerInfo.phone}</p>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                        <i className="ti ti-map-pin" />
                      </span>
                      <p>{customerInfo.location}</p>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                        <i className="ti ti-calendar-exclamation" />
                      </span>
                      <p>Created on {customerInfo.dateCreated}</p>
                    </div>
                  </div>
                  <hr />
                  <h6 className="mb-3 fw-semibold">Other Information</h6>
                  <ul>
                    <li className="row mb-3">
                      <span className="col-6">Last Modified</span>
                      <span className="col-6">27 Sep 2023, 11:45 pm</span>
                    </li>
                    <li className="row mb-3">
                      <span className="col-6">Source</span>
                      <span className="col-6">Paid Campaign</span>
                    </li>
                  </ul>
                  <hr />
                  <div className="mb-3">
                    <label className="col-form-label">Tags </label>
                    <CreatableSelect
                      classNamePrefix="react-select"
                      options={all_tags}
                      // isLoading={isLoading}
                      // onChange={(newValue) => setValue(newValue)}
                      // onCreateOption={handleCreate}
                      className="js-example-placeholder-multiple select2 js-states"
                      isMulti={true}
                      placeholder="Add Tags"
                    />
                  </div>
                  <hr />
                  <h6 className="mb-3 fw-semibold">Social Profile</h6>
                  <ul className="social-info">
                    <li>
                      <Link to="">
                        <i className="fa-brands fa-youtube" />
                      </Link>
                    </li>
                    <li>
                      <Link to="">
                        <i className="fa-brands fa-facebook-f" />
                      </Link>
                    </li>
                    <li>
                      <Link to="">
                        <i className="fa-brands fa-instagram" />
                      </Link>
                    </li>
                    <li>
                      <Link to="">
                        <i className="fa-brands fa-whatsapp" />
                      </Link>
                    </li>
                    <li>
                      <Link to="">
                        <i className="fa-brands fa-pinterest" />
                      </Link>
                    </li>
                    <li>
                      <Link to="">
                        <i className="fa-brands fa-linkedin" />
                      </Link>
                    </li>
                  </ul>
                  <hr />
                  <h6 className="mb-3 fw-semibold">Settings</h6>
                  <div className="mb-0">
                    <Link to="" className="d-block mb-3">
                      <i className="ti ti-share-2 me-1" />
                      Share Contact
                    </Link>
                    <Link to="" className="d-block mb-3">
                      <i className="ti ti-star me-1" />
                      Add to Favourite
                    </Link>
                    <Link
                      to=""
                      className="d-block mb-0"
                      // data-bs-toggle="modal"
                      // data-bs-target="#delete_contact"
                      onClick={() => setOpenModal(true)}
                    >
                      <i className="ti ti-trash-x me-1" />
                      Delete Contact
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-9">
              <div className="card mb-3">
                <div className="card-body pb-0 pt-2">

                  <ul className="nav nav-tabs nav-tabs-bottom" role="tablist">
                    <li className="nav-item" role="presentation">
                      <Link
                        to=""
                        className={`nav-link ${activeTab === "notes" ? "active" : ""}`}
                        onClick={() => setActiveTab("notes")}
                      >
                        <i className="ti ti-notes me-1" />
                        Notes
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        to=""
                        className={`nav-link ${activeTab === "tasks" ? "active" : ""}`}
                        onClick={() => setActiveTab("tasks")}
                      >
                        <FaTasks className="me-2" />
                        Tasks
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        to=""
                        className={`nav-link ${activeTab === "meetings" ? "active" : ""}`}
                        onClick={() => setActiveTab("meetings")}
                      >
                         <SlPeople className="me-2" />
                        Meetings
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        to=""
                        className={`nav-link ${activeTab === "calls" ? "active" : ""}`}
                        onClick={() => setActiveTab("calls")}
                      >
                        <i className="ti ti-phone me-1" />
                        Calls
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        to=""
                        className={`nav-link ${activeTab === "attachments" ? "active" : ""}`}
                        onClick={() => setActiveTab("attachments")}
                      >
                         <IoMdAttach className="me-2" />
                        Attachments
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        to=""
                        className={`nav-link ${activeTab === "activities" ? "active" : ""}`}
                        onClick={() => setActiveTab("activities")}
                      >
                        <RxActivityLog className="me-1" />
                        Activities
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        to=""
                        className={`nav-link ${activeTab === "quotation" ? "active" : ""}`}
                        onClick={() =>{
                          setActiveTab("quotation")
                        }}
                      >
                        <BsChatLeftQuote className="me-1" />
                        Quotation
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        to=""
                        className={`nav-link ${activeTab === "invoice" ? "active" : ""}`}
                        onClick={() => setActiveTab("invoice")}
                      >
                        <LiaFileInvoiceDollarSolid className="me-1" />
                        Invoice
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        to=""
                        className={`nav-link ${activeTab === "creditNotes" ? "active" : ""}`}
                        onClick={() => setActiveTab("creditNotes")}
                      >
                        <TbFileInvoice className="me-1" />
                        Credit Notes
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        to=""
                        className={`nav-link ${activeTab === "tickets" ? "active" : ""}`}
                        onClick={() => setActiveTab("tickets")}
                      >
                        <BsTicketPerforated className="me-1" />
                        Tickets
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        to=""
                        className={`nav-link ${activeTab === "payments" ? "active" : ""}`}
                        onClick={() => setActiveTab("payments")}
                      >
                        <AiOutlineDollar className="me-1" />
                        Payments
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="tab-content pt-0">
                <Suspense fallback={<div>Loading...</div>}>
                  {activeTab === "notes" && <Notes />}
                  {activeTab === "tasks" && <Tasks />}
                  {activeTab === "meetings" && <Meetings />}
                  {activeTab === "calls" && <Calls />}
                  {activeTab === "attachments" && <Attachments />}
                  {activeTab === "activities" && <Activities />}
                  {activeTab === "quotation" && <Quotation />}
                  {activeTab === "invoice" && <Invoice />}
                  {activeTab === "creditNotes" && <CreditNotes />}
                  {activeTab === "tickets" && <Tickets />}
                  {activeTab === "payments" && <Payments />}
                </Suspense>
              </div>
            </div>
          </div>

        </div>
        <CustomerOffcanvas selectedCustomer={selectedCustomer}/>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default ContactDetails;
