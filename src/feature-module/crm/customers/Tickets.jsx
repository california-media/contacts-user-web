import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Table from "../../../core/common/dataTable/index";
import { HiEllipsisVertical } from 'react-icons/hi2';
import { FaEye } from 'react-icons/fa';
import DeleteModal from '../../../core/common/modals/DeleteModal';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ticketsData } from '../../../core/data/json/tickets';
import TicketOffcanvas from '../../../core/common/offCanvas/ticket/TicketOffcanvas';

const Tickets = () => {

  const [searchQueryTickets, setSearchQueryTickets] = useState("");
  const [selectedTicketsStatus, setSelectedTicketsStatus] = useState([]);
  const [indexToDelete, setIndexToDelete] = useState(null);
  const [stars, setStars] = useState({});
  const [deleteModalText, setDeleteModalText] = useState("");
  const [ticketsColumnVisibility, setTicketsColumnVisibility] = useState({
    "": true,
    "Ticket Id": true,
    "Subject": true,
    "Assigned to": true,
    "Created On": true,
    "Last Reply": true,
    "Priority": true,
    "Ticket Status": true,
  });


  useEffect(() => {
    return () => { }
  }, [])

  const filterTicketsStatus = (ticketsStatus) => {
    setSelectedTicketsStatus((prevStatus) =>
      prevStatus.includes(ticketsStatus)
        ? prevStatus.filter((status) => status !== ticketsStatus)
        : [...prevStatus, ticketsStatus]
    );
  };
  const handleStarToggle = (index) => {
    setStars((prevStars) => ({
      ...prevStars,
      [index]: !prevStars[index],
    }));
  };

  const currentDateAndTime = new Date();
  const currentDate = currentDateAndTime.toLocaleDateString();
  const currentTime = currentDateAndTime.toLocaleTimeString();

  const ticketsColumns = [
    {
      title: "",
      dataIndex: "",
      render: (text, record, index) => (
        <div
          className={`set-star rating-select ${stars[index] ? "filled" : ""}`}
          onClick={() => handleStarToggle(index)}
        >
          <i className="fa fa-star"></i>
        </div>
      ),
    },
    {
      title: "Ticket Id",
      dataIndex: "ticketId",
      key: "ticketId",
      render: (text, record) => {

        return (
          <div className="cell-content justify-content-between">
            <div
              state={{ record }}
              className="lead-name title-name fw-bold"
              style={{ color: "#2c5cc5", cursor: 'pointer' }}
              onClick={() => {


                // setShowQuotationForm(true);
                // setShowQuotationViewForm(false);
              }}
            >
              {text}
            </div>
            <Link
              to="#"
              className="action-icon"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <HiEllipsisVertical />
            </Link>

            <div className="dropdown-menu dropdown-menu-right">
              <div
                className="dropdown-item cursor-pointer"
                onClick={() => {
                  // When clicking "View", show the view and hide the form
                  // setShowQuotationViewForm(true);
                  // setShowQuotationForm(true);
                  // setSelectedViewQuotation(record)
                }}
              >
                <FaEye className="text-blue" /> View
              </div>
              <div
                className="dropdown-item cursor-pointer"
                data-bs-toggle="modal"
                data-bs-target={`#delete_${deleteModalText}`}
                onClick={() => { setDeleteModalText("ticket") }}
              >
                <i className="ti ti-trash text-danger"></i> Delete
              </div>
            </div>
          </div>
        );
      },
      sorter: (a, b) => a.estimationsId.localeCompare(b.estimationsId),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      sorter: (a, b) => a.amount.localeCompare(b.amount),
    },
    {
      title: "Assigned to",
      dataIndex: "assignedName",
      key: "assignedName",
      sorter: (a, b) => a.client.localeCompare(b.client),
    },
    {
      title: "Created On",
      dataIndex: "createdOn",
      key: "createdOn",
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: "Last Reply",
      dataIndex: "lastReply",
      key: "lastReply",
      sorter: (a, b) => a.expiryDate.localeCompare(b.expiryDate),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Ticket Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
  ];
  const ticketsStatus = Object.values(
    ticketsData.reduce((acc, ticket) => {
      if (!acc[ticket.status]) {
        acc[ticket.status] = { value: ticket.status, label: ticket.status };
      }
      return acc;
    }, {})
  );

  const handleModalDeleteBtn = (text) => {
    console.log(`Deleting ${indexToDelete} ${text}...`);
  };

  const filteredTicketsData = ticketsData.filter((tickets) => {
    const isAnySearchColumnVisible =
      ticketsColumnVisibility["Ticket Id"] ||
      ticketsColumnVisibility["Subject"];

    const matchesSearchQuery =
      !isAnySearchColumnVisible ||
      (tickets.ticketId.toLowerCase().includes(searchQueryTickets.toLowerCase())) ||
      (tickets.subject.toLowerCase().includes(searchQueryTickets.toLowerCase()))
    // (columnVisibility["Call Id"] && calls.callId.toLowerCase().includes(searchQuery.toLowerCase())) ||
    // (columnVisibility["Agent Name"] && calls.agentName.toLowerCase().includes(searchQuery.toLowerCase()))


    const matchesStatus =
      selectedTicketsStatus.length === 0 ||
      selectedTicketsStatus.includes(tickets.status.toLowerCase());


    // const matchesEmployee =
    //   selectedEmployee.length === 0 ||
    //   selectedEmployee.includes(calls.agentName.toLowerCase());


    return matchesSearchQuery
      && matchesStatus
    // && matchesEmployee

  });
  const visibleTicketsColumns = ticketsColumns.filter(
    (column) => ticketsColumnVisibility[column.title]
  );

  const handleToggleTicketsColumnVisibility = (columnTitle) => {
    setTicketsColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [columnTitle]: !prevVisibility[columnTitle],
    }));
  };

  const exportTicketsToPDF = () => {
    const doc = new jsPDF();

    const filteredColumns = ticketsColumns.filter(
      (col) =>
        ticketsColumnVisibility[col.title]
    );


    const headers = filteredColumns.map((col) => col.title);
    const data = filteredTicketsData.map((row) =>
      filteredColumns.map((col) => row[col.dataIndex] || "")
    );


    const pageWidth = doc.internal.pageSize.getWidth();
    const titleText = "Tickets Report";
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
    doc.save("Ticket-details.pdf");
  };

  const resetTicketsFilters = () => {
    setSelectedTicketsStatus([]);
    setSearchQueryTickets('');
  };

  return (
    <div id="tickets">
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-sm-12">
              <div className="d-flex justify-content-between">
                <div className="d-flex">
                  <div className="icon-form mb-3  me-2 mb-sm-0">
                    <span className="form-icon">
                      <i className="ti ti-search" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search Tickets"
                      value={searchQueryTickets}
                      onChange={(text) =>
                        setSearchQueryTickets(text.target.value)
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
                        <div className="accordion" id="accordionExample">
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
                                Ticket Status
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="Status"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="filter-content-list">
                                <ul>
                                  {ticketsStatus.map((ticketsStatus, index) => {
                                    return (
                                      <li
                                        key={index}

                                      >
                                        <div className="filter-checks" >
                                          <label className="checkboxs" >
                                            <input
                                              type="checkbox"
                                              checked={selectedTicketsStatus.includes(ticketsStatus.value.toLowerCase())}
                                              onChange={() => filterTicketsStatus(ticketsStatus.value.toLowerCase())}
                                            />
                                            <span className="checkmarks" />
                                            {ticketsStatus.value}
                                          </label>
                                        </div>
                                      </li>
                                    );
                                  })}

                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="filter-reset-btns">
                          <div className="row">
                            <div className="col-6">
                            </div>
                            <div className="col-6">
                              <Link to="" className="btn btn-primary" onClick={resetTicketsFilters}>
                                Reset
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown">
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
                      <h4 className="mb-2 fw-semibold">
                        Want to manage datatables?
                      </h4>
                      <p className="mb-3">
                        Please drag and drop your column to reorder your
                        table and enable see option as you want.
                      </p>
                      <div className="border-top pt-3">
                        {ticketsColumns.map((column, index) => {
                          if (
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
                              <div
                                className="status-toggle"

                              >
                                <input
                                  type="checkbox"
                                  id={column.title}
                                  className="check"
                                  defaultChecked={true}
                                  onClick={() =>
                                    handleToggleTicketsColumnVisibility(
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
                <div className="d-flex align-items-center">
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
                            onClick={exportTicketsToPDF}
                          >
                            <i className="ti ti-file-type-pdf text-danger me-1" />
                            Export as PDF
                          </Link>
                        </li>

                      </ul>
                    </div>
                  </div>
                  <Link
                    to=""
                    data-bs-toggle="offcanvas"
                    data-bs-target="#ticket_offcanvas"
                    className="link-purple fw-medium"
                    onClick={() => {
                      // setSelectedMeeting(null)
                      // setSelectedMeetingType(null)
                    }}
                  >
                    <i className="ti ti-circle-plus me-1" />
                    Add New
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-sm-8">
              <div className="d-flex align-items-center flex-wrap row-gap-2 justify-content-sm-end">
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive custom-table">
            <Table
              dataSource={filteredTicketsData}
              columns={visibleTicketsColumns}
              rowKey={(record) => record.key}
            />
          </div>
        </div>
      </div>
      {/* Add or Edit Ticket */}
      <TicketOffcanvas />
      {/* /Add or Edit Ticket */}

      {/* Delete Modal */}
      {<DeleteModal text={deleteModalText} onDelete={() => { handleModalDeleteBtn(deleteModalText) }} onCancel={() => { setDeleteModalText("") }} />}
      {/* /Delete Modal */}
    </div>
  )
}

export default Tickets