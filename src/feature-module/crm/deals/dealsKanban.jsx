import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import CollapseHeader from "../../../core/common/collapse-header";
import { SelectWithImage2 } from "../../../core/common/selectWithImage2";
import { Modal } from "react-bootstrap";
import DefaultEditor from "react-simple-wysiwyg";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { dealStatus, duration, options1, status, owner as companyEmployee, } from "../../../core/common/selectoption/selectoption";
import { TagsInput } from "react-tag-input-component";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
  optionssymbol,
  priorityList,
  project,
  salestypelist,
  socialMedia,
  tagInputValues,
} from "../../../core/common/selectoption/selectoption";
import dragula, { Drake } from "dragula";
import "dragula/dist/dragula.css";
import DealOffcanvas from "../../../core/common/offCanvas/deal/DealOffcanvas";
import { dealsData } from "../../../core/data/json/dealsData";
import { IoMdFolderOpen } from "react-icons/io";
import { FaSortAlphaDown, FaSortAlphaDownAlt, FaSortAmountDown } from "react-icons/fa";
const route = all_routes;
const DealsKanban = () => {
  const [owner, setOwner] = useState(["Collab"]);
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [cardColors, setCardColors] = useState("");
  const [searchEmployeeInFilter, setSearchEmployeeInFilter] = useState("");
  const [selectedContactEmployee, setSelectedContactEmployee] = useState([]);
  const [selectedContactStatus, setSelectedContactStatus] = useState([]);
  const [selectedDealEmployee, setSelectedDealEmployee] = useState([]);
  const [selectedDealStatus, setSelectedDealStatus] = useState([]);
  const [sliderValues, setSliderValues] = useState([0, 0]);
  const [maxDealValue, setMaxDealValue] = useState();
  const [minDealValue, setMinDealValue] = useState();




  const filteredEmployees = companyEmployee.filter((employee) =>
    employee.value.toLowerCase().includes(searchEmployeeInFilter.toLowerCase())
  );

  const filterDealEmployee = (leadEmployee) => {
    setSelectedDealEmployee((prevStatus) =>
      prevStatus.includes(leadEmployee)
        ? prevStatus.filter((employee) => employee !== leadEmployee)
        : [...prevStatus, leadEmployee]
    );
  };
  const resetFilters = () => {
    setSelectedDealStatus([]);
    setSelectedDealEmployee([]);
    setSearchEmployeeInFilter('');
    setSliderValues([minDealValue, maxDealValue]);
  };
  useEffect(() => {
    const maxValue = Math.max(...dealsData.map((deal) => parseInt(deal.dealValue)));
    const minValue = Math.min(...dealsData.map((deal) => parseInt(deal.dealValue)));
    setMaxDealValue(maxValue);
    setMinDealValue(minValue);
    setSliderValues([minValue, maxValue])
  }, []);
  const handleDealSliderChange = (value) => {
    setSliderValues(value);
  };
  const handleDealValueChange = (index, event) => {
    const newValue = event.target.value;
  
    // If the input is empty, allow it (set the empty string)
    if (newValue === "") {
      setSliderValues((prevValues) => {
        const updatedValues = [...prevValues];
        updatedValues[index] = ""; // Set it to empty string for now
        return updatedValues;
      });
    } else {
      // If a valid number, update the value
      setSliderValues((prevValues) => {
        const updatedValues = [...prevValues];
        updatedValues[index] = parseInt(newValue, 10); // Convert to number
        return updatedValues;
      });
    }
  };
  const statusColors = {
    "Negotiation": 'text-info',
    "Closed": 'text-danger',
    "Proposal Sent": 'text-warning',
    "Qualify To Buy": 'text-success',
  };
  const bgColors = {
    "Negotiation": 'rgb(223, 240, 255)',
    "Closed": 'rgba(193, 105, 105, 0.1)',
    "Proposal Sent": 'rgba(255, 217, 148, 0.4)',
    "Qualify To Buy": 'rgba(224, 245, 241,1)',
  };

  const route = all_routes;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const handleDateChange1 = (date) => {
    setSelectedDate1(date);
  };
  const container1Ref = useRef(null);
  const container2Ref = useRef(null);
  const container3Ref = useRef(null);
  const container4Ref = useRef(null);


  const filteredData = dealsData.filter((deal) => {

    // Check if lead matches search query
    const matchesSearchQuery =
      (deal.dealName.toLowerCase().includes(searchQuery.toLowerCase()))
      ||
      (deal.relatedContact.toLowerCase().includes(searchQuery.toLowerCase()))
      ||
      (deal.customer_company.toLowerCase().includes(searchQuery.toLowerCase()))
    //||
    // (lead.email.toLowerCase().includes(searchQuery.toLowerCase()))

    // Check if lead matches selected employee

    const matchesEmployee =
      selectedDealEmployee.length === 0 ||  // If no status is selected, show all
      selectedDealEmployee.includes(deal.owner.toLowerCase());

      const matchesDealValueRange =
      parseInt(deal.dealValue) >= sliderValues[0] &&
      parseInt(deal.dealValue) <= sliderValues[1];

    return matchesSearchQuery
      && matchesEmployee
      &&matchesDealValueRange

  }).sort((a, b) => {
    if (sortOrder === "asc") {
      return a.dealName.localeCompare(b.dealName);
    } else {
      return b.dealName.localeCompare(a.dealName);
    }
  });

  const getInitials = (deal) => {
    // Split the name into parts
    const parts = deal.trim().split(" ");
    const firstName = parts[0] || '';
    const lastName = parts[1] || '';

    // Generate initials based on the presence of a last name
    if (lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return `${firstName.charAt(0)}${firstName.charAt(1) || ''}`.toUpperCase(); // Handle single-letter first names
  };
  const groupedDeals = filteredData.reduce((acc, deal) => {
    const status = deal.dealStatus;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(deal);
    return acc;
  }, {});

  useEffect(() => {
    const containers = [
      container1Ref.current,
      container2Ref.current,
      container3Ref.current,
      container4Ref.current,
    ].filter(Boolean);
    const drake = dragula(containers);
    drake.on('drop', (el, target, source, sibling) => {
      const dealId = el.getAttribute('data-deal-id');
      const newStatus = target.getAttribute('data-status');
      const oldStatus = source.getAttribute('data-status');

      if (newStatus !== oldStatus) {
        console.log(`Deal ${dealId} moved from ${oldStatus} to ${newStatus}`);
        setCardColors(prevColors => ({
          ...prevColors,
          [dealId]: bgColors[newStatus],
        }));

      }

    });
    return () => {
      drake.destroy();
    };
  }, [groupedDeals]);

  return (
    <>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            <div className="row">
              <div className="col-md-12">

                {/* Filter */}
                <div className="d-flex justify-content-between align-items-center flex-wrap row-gap-2 mb-4">
                  <div className="page-header mb-0 ms-5">
                    <div className="row align-items-center">
                      <h4 className="page-title mb-0">
                        Deals<span className="count-title">{filteredData.length}</span>
                      </h4>
                    </div>
                  </div>
                  <div className="d-flex align-items-center flex-wrap row-gap-2">
                    <div className="icon-form mb-sm-0 me-2">
                      <span className="form-icon">
                        <i className="ti ti-search" />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search Deals"
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
                          <div className="accordion" id="accordionExample">
                            <div className="filter-set-content">
                              <div className="filter-set-content-head">
                                <Link
                                  to="#"
                                  className="collapsed"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#owner"
                                  aria-expanded="false"
                                  aria-controls="owner"
                                >
                                  Deal Owner
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
                                      onChange={(e) => setSearchEmployeeInFilter(e.target.value)}
                                    />
                                  </div>
                                  <ul>
                                    {
                                      filteredEmployees.map((companyEmployee, index) => {
                                        return (
                                          <li key={index}>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input
                                                  type="checkbox"
                                                  checked={selectedDealEmployee.includes(companyEmployee.value.toLowerCase())}
                                                  onChange={() => filterDealEmployee(companyEmployee.value.toLowerCase())}
                                                />
                                                <span className="checkmarks" />
                                                {companyEmployee.value}
                                              </label>
                                            </div>
                                          </li>
                                        )
                                      })
                                    }
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="filter-set-content">
                              <div className="filter-set-content-head">
                                <Link
                                  to="#"
                                  className="collapsed"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#Value"
                                  aria-expanded="false"
                                  aria-controls="Value"
                                >
                                  Deal Value
                                </Link>
                              </div>
                              <div
                                className="filter-set-contents accordion-collapse collapse"
                                id="Value"
                                data-bs-parent="#accordionExample"
                              >
                                <div className="filter-content-list">
                                  <div className="col-md-12">
                                    <div className="card mb-0">
                                      <div className="card-body">
                                        <Slider
                                          min={minDealValue}
                                          max={maxDealValue}
                                          step={2}
                                          value={sliderValues}
                                          onChange={handleDealSliderChange}
                                          range
                                        />
                                        <div className="d-flex justify-content-between">
                                          <div className="row mb-0">
                                            <div className="input-group input-group-sm pt-2 px-0 mb-3" style={{ width: 150 }}>
                                              <span className="input-group-text">AED</span>
                                              <input className="form-control" type="number"
                                                value={sliderValues[0]}
                                                onChange={(e) => handleDealValueChange(0, e)} />
                                            </div>
                                          </div>
                                          <div className="row mb-0">
                                            <div className="input-group input-group-sm pt-2 px-0 mb-3" style={{ width: 150 }}>
                                              <span className="input-group-text">AED</span>
                                              <input className="form-control" type="number"
                                                value={sliderValues[1]}
                                                onChange={(e) => handleDealValueChange(1, e)} />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="filter-reset-btns">
                            <div className="row">
                              <div className="col-6">
                              </div>
                              <div className="col-6">
                                <Link to="#" className="btn btn-primary" onClick={resetFilters}>
                                  Reset
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dropdown me-2 bg-white">
                      <Link
                        to="#"
                        className="dropdown-toggle"
                        data-bs-toggle="dropdown"
                      >
                        <FaSortAmountDown className="me-1" />
                        Order By
                      </Link>
                      <div className="dropdown-menu dropdown-menu-end sortBtn">
                        <ul className="mb-0">
                          <li>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => setSortOrder("asc")}
                            >
                              <FaSortAlphaDown className="me-1" />
                              Name (Ascending)
                            </button>
                          </li>
                          <li>
                            <Link
                              to="#"
                              className="dropdown-item"
                              onClick={() => setSortOrder("desc")}
                            >
                              <FaSortAlphaDownAlt className="me-1" />
                              Name (Descending)
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div>
                      <ul className="d-flex align-items-center mb-0">
                        <li>
                          <Link
                            to="#"
                            className="btn btn-primary me-2"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#deal_offcanvas"
                          >
                            <i className="ti ti-square-rounded-plus me-2" />
                            Add Deals
                          </Link>
                        </li>
                        <li>
                          <div className="view-icons me-2">
                            <Link to={route.deals}>
                              <i className="ti ti-list-tree" />
                            </Link>
                            <Link to={route.dealsKanban} className="active">
                              <i className="ti ti-grid-dots" />
                            </Link>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                </div>
                {/* /Filter */}

                {/* Deals Kanban */}
                <div className="d-flex overflow-x-auto align-items-start mb-0">
                  {dealStatus.map((statusObj, index) => {
                    const status = statusObj.value;
                    const dealsForStatus = groupedDeals[status] || [];
                    const totalDealValue = dealsForStatus.reduce((acc, deal) => {
                      return acc + (parseFloat(deal.dealValue) || 0);
                    }, 0);
                    return (
                      <div className="kanban-list-items" key={index} data-status={status}>
                        <div className="card mb-0">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h4 className="fw-semibold d-flex align-items-center mb-1">
                                  <i className={`ti ti-circle-filled fs-8 ${statusColors[status]} me-2`} />
                                  {status}
                                </h4>
                                <span className="fw-medium text-default">
                                  {dealsForStatus.length} Deals - {totalDealValue} AED
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="kanban-drag-wrap mt-4 no-scrollbar"
                          style={{
                            height: "calc(100vh - 170px)", overflow: 'scroll',
                          }}
                          ref={index === 0 ? container1Ref : index === 1 ? container2Ref : index === 2 ? container3Ref : container4Ref}
                          data-status={status}
                        >
                          {dealsForStatus.length > 0 ? (
                            dealsForStatus.map((deal, dealIndex) => (
                              <div
                                className="card kanban-card border"
                                style={{ backgroundColor: cardColors[deal.id] || bgColors[status] }}
                                key={dealIndex}
                                data-deal-id={deal.id}
                              >
                                <div className="card-body">
                                  <div className="d-block">
                                    <div className="d-flex align-items-center mb-3">
                                      <Link to={route.dealsDetails} state={{ deal }} className="avatar avatar-lg bg-gray flex-shrink-0 me-2">
                                        <span className="avatar-title text-dark">{getInitials(deal.relatedContact)}</span>
                                      </Link>
                                      <div>
                                        <h6 className="fw-medium mb-0">
                                          <Link to={route.dealsDetails} state={{ deal }}>{deal.relatedContact}</Link>
                                        </h6>
                                        <p className="text-default">{deal.customer_company}</p>
                                      </div>
                                    </div>
                                    <div className="mb-3 d-flex flex-column">
                                      <p className="text-default d-inline-flex align-items-center mb-2">
                                        <IoMdFolderOpen className="me-1 text-dark" />
                                        {deal.dealName}
                                      </p>
                                      <p className="text-default d-inline-flex align-items-center mb-2">
                                        <i className="ti ti-report-money text-dark me-1" />
                                        {deal.dealValue ? `${deal.dealValue} AED` : 'Nill'}
                                      </p>
                                      <p className="text-default d-inline-flex align-items-center mb-2">
                                        <i className="ti ti-mail text-dark me-1" />
                                        {deal.email}
                                      </p>
                                      <p className="text-default d-inline-flex align-items-center mb-2">
                                        <i className="ti ti-phone text-dark me-1" />
                                        {deal.phone}
                                      </p>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-3">
                                      <p className="text-default d-inline-flex align-items-center mb-0">
                                        <i className="ti ti-calendar-due text-dark me-1" />
                                        {deal.lastContacted}
                                      </p>
                                      <div className="icons-social d-flex align-items-center">
                                        <Link to="#" className="d-flex align-items-center justify-content-center me-1">
                                          <i className="ti ti-phone-check" />
                                        </Link>
                                        <Link to="#" className="d-flex align-items-center justify-content-center me-1">
                                          <i className="ti ti-message-circle-share" />
                                        </Link>
                                        <Link to="#" className="d-flex align-items-center justify-content-center">
                                          <i className="ti ti-mail-check" />
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-muted">No Deals</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* /Deals Kanban */}



              </div>
            </div>
          </div>
        </div>
        {/* /Page Wrapper */}
      </>
      <DealOffcanvas />

      {/* Delete Deal */}
      <div className="modal fade" id="delete_deal" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="text-center">
                <div className="avatar avatar-xl bg-danger-light rounded-circle mb-3">
                  <i className="ti ti-trash-x fs-36 text-danger" />
                </div>
                <h4 className="mb-2">Remove Deal?</h4>
                <p className="mb-0">
                  Are you sure you want to remove <br /> deal you selected.
                </p>
                <div className="d-flex align-items-center justify-content-center mt-4">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link to={route.deals} data-bs-dismiss="modal" className="btn btn-danger">
                    Yes, Delete it
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Deal */}
      {/* Create Deal */}
      <Modal show={openModal} onHide={() => setOpenModal(false)}>
        <div className="modal-header border-0 m-0 justify-content-end">
          <button
            className="btn-close"
            data-bs-dismiss="modal"
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
              <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                Cancel
              </Link>
              <Link to={route.dealsDetails} className="btn btn-primary">
                View Details
              </Link>
            </div>
          </div>
        </div>
      </Modal>
      {/* /Create Deal */}
      {/* Add New Pipeline */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_pipeline"
      >
        <div className="offcanvas-header border-bottom">
          <h4>Add New Pipeline</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="offcanvas-body">
          <form >
            <div>
              <div className="mb-3">
                <label className="col-form-label">
                  Pipeline Name <span className="text-danger">*</span>
                </label>
                <input className="form-control" type="text" />
              </div>
              <div className="mb-3">
                <div className="pipe-title d-flex align-items-center justify-content-between">
                  <h5 className="form-title">Pipeline Stages</h5>
                  <Link
                    to="#"
                    className="add-stage"
                    data-bs-toggle="modal"
                    data-bs-target="#add_stage"
                  >
                    <i className="ti ti-square-rounded-plus" />
                    Add New
                  </Link>
                </div>
                <div className="pipeline-listing">
                  <div className="pipeline-item">
                    <p>
                      <i className="ti ti-grip-vertical" /> Inpipeline
                    </p>
                    <div className="action-pipeline">
                      <Link
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#edit_stage"
                      >
                        <i className="ti ti-edit text-blue" />
                        Edit
                      </Link>
                      <Link
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#delete_stage"
                      >
                        <i className="ti ti-trash text-danger" />
                        Delete
                      </Link>
                    </div>
                  </div>
                  <div className="pipeline-item">
                    <p>
                      <i className="ti ti-grip-vertical" /> Follow Up
                    </p>
                    <div className="action-pipeline">
                      <Link
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#edit_stage"
                      >
                        <i className="ti ti-edit text-blue" />
                        Edit
                      </Link>
                      <Link
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#delete_stage"
                      >
                        <i className="ti ti-trash text-danger" />
                        Delete
                      </Link>
                    </div>
                  </div>
                  <div className="pipeline-item">
                    <p>
                      <i className="ti ti-grip-vertical" /> Schedule Service
                    </p>
                    <div className="action-pipeline">
                      <Link
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#edit_stage"
                      >
                        <i className="ti ti-edit text-blue" />
                        Edit
                      </Link>
                      <Link
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#delete_stage"
                      >
                        <i className="ti ti-trash text-danger" />
                        Delete
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <h5 className="form-title">Access</h5>
                <div className="d-flex flex-wrap access-item nav">
                  <div
                    className="radio-btn"
                    data-bs-toggle="tab"
                    data-bs-target="#all"
                  >
                    <input
                      type="radio"
                      className="status-radio"
                      id="all"
                      name="status"
                      defaultChecked
                    />
                    <label htmlFor="all">All</label>
                  </div>
                  <div
                    className="radio-btn"
                    data-bs-toggle="tab"
                    data-bs-target="#select-person"
                  >
                    <input
                      type="radio"
                      className="status-radio"
                      id="select"
                      name="status"
                    />
                    <label htmlFor="select">Select Person</label>
                  </div>
                </div>
                <div className="tab-content mb-3">
                  <div className="tab-pane fade" id="select-person">
                    <div className="access-wrapper">
                      <div className="access-view">
                        <div className="access-img">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-21.jpg"
                            alt="Image"
                          />
                          Vaughan
                        </div>
                        <Link to="#">Remove</Link>
                      </div>
                      <div className="access-view">
                        <div className="access-img">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-01.jpg"
                            alt="Image"
                          />
                          Jessica
                        </div>
                        <Link to="#">Remove</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <button
                type="button"
                data-bs-dismiss="offcanvas"
                className="btn btn-light me-2"
              >
                Cancel
              </button>
              <button type="button" className="btn btn-primary">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* /Add New Pipeline */}
      {/* Delete Stage */}
      <div className="modal fade" id="delete_stage" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="text-center">
                <div className="avatar avatar-xl bg-danger-light rounded-circle mb-3">
                  <i className="ti ti-trash-x fs-36 text-danger" />
                </div>
                <h4 className="mb-2">Remove Stage?</h4>
                <p className="mb-0">
                  Are you sure you want to remove <br /> stage you selected.
                </p>
                <div className="d-flex align-items-center justify-content-center mt-4">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link to={route.deals} data-bs-dismiss="modal" className="btn btn-danger">
                    Yes, Delete it
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Stage */}
      {/* Add New Stage */}
      <div className="modal custom-modal fade" id="add_stage" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Stage</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <form >
                <div className="mb-3">
                  <label className="col-form-label">Stage Name *</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="modal-btn text-end">
                  <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button type="button" data-bs-dismiss="modal" className="btn btn-danger">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add New Stage */}
      {/* Edit Stage */}
      <div className="modal custom-modal fade" id="edit_stage" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Stage</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <form >
                <div className="mb-3">
                  <label className="col-form-label">Stage Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="Inpipeline"
                  />
                </div>
                <div className="modal-btn text-end">
                  <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button type="button" data-bs-dismiss="modal" className="btn btn-danger">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Stage */}
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
              <form >
                <div className="mb-3">
                  <label className="col-form-label">View Name</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="modal-btn text-end">
                  <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button type="button" data-bs-dismiss="modal" className="btn btn-danger">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add New View */}
    </>
  );
};

export default DealsKanban;
