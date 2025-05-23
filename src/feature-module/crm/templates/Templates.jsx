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
import { fetchProfile } from "../../../core/data/redux/slices/ProfileSlice";
import WhatsappTemplateOffcanvas from "../../../core/common/offCanvas/templates/WhatsappTemplateOffcanvas";
import { resetSelectedTemplate, setSelectedTemplate } from "../../../core/data/redux/slices/SelectedTemplateSlice";

const Templates = () => {
  const [columnVisibility, setColumnVisibility] = useState({
    "": true,
    Title: true,
    Message: true,
  });
const dispatch = useDispatch();
const userProfile = useSelector((state)=>state.profile)



const handleWhatsappTemplateEditClick = (record) => {
  const updatedRecord = {
    ...record,
templateType: "whatsapp",
  }
dispatch(setSelectedTemplate(updatedRecord))

}


  const columns = [
    {
      title: "",
      dataIndex: "isFavourite",
      width: 40,
      render: (_, record, index) => (
        <div
          className="set-star rating-select"
          // onClick={() => handleStarToggle(index, record)}
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
      title: "Title",
      dataIndex: "whatsappTemplateTitle",
      key: "whatsappTemplateTitle",
      width: 200,
      // onCell: () => ({
      //   className: "hoverable-cell", // Adding a class for the cell
      // }),

      render: (text, record) => {

        return (
          <div className="cell-content justify-content-between">
            <div className="d-inline-block" style={{ padding: 5 }}>
              {text}
            </div>

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
                  // data-bs-target={`#delete_${deleteModalText}`}
                  onClick={() => {
                    // setDeleteModalText("lead");
                  }}
                >
                  <i className="ti ti-trash text-danger"></i> Delete
                </Link>
              </div>
            </div>
          </div>
        );
      },

      sorter: (a, b) => a.whatsappTemplateTitle.localeCompare(b.whatsappTemplateTitle),
    },
    {
      title: "Message",
      dataIndex: "whatsappTemplateMessage",
      key: "whatsappTemplateMessage",
      render: (text, record) => {
        return <div className="d-inline-block">{text}</div>;
      },
    },
  ];
  const visibleColumns = columns.filter(
    (column) => columnVisibility[column.title]
  );


  const filteredData = userProfile?.whatsappTemplates?.filter((template) => {
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

    // Check if lead date is within the selected date range
    // const matchesDateRange =
    //   selectedDateRange.startDate || selectedDateRange.endDate || // If no date range is selected, show all
    //   console.log(selectedDateRange.endDate, "selectedDateRange.endDate");

    // (leadDate >= selectedDateRange.startDate && leadDate <= selectedDateRange.endDate);

    // return matchesEmployee;
    // && matchesDateRange;
    // matchesSearchQuery &&
    return template;
  });
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
                                <span className="count-title">123</span>
                                {/* <span className="count-title">{totalContacts}</span> */}
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
                                placeholder="Search Template"
                                // onChange={(text) =>
                                //   setSearchQuery(text.target.value)
                                // }
                              />
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
                                              // handleToggleColumnVisibility(
                                              //   column.title
                                              // )
                                              {}
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
                    <div className="table-responsive custom-table">
                      <Table
                        dataSource={filteredData}
                        columns={visibleColumns}
                        rowKey={(record) => record.key}
                        // loading={isLoading}
                        // totalCount={totalContacts}
                        // onPageChange={handlePageChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <WhatsappTemplateOffcanvas/>
      </div>
    </div>
  );
};

export default Templates;
