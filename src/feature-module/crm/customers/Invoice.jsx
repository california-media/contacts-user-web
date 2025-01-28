import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import Table from "../../../core/common/dataTable/index";
import { MdDelete, MdDragIndicator } from 'react-icons/md';
import Select from "react-select";
import { options, quotationStatus, owner as companyEmployee, discountType, quotationItems, discountOption } from '../../../core/common/selectoption/selectoption';
import { DatePicker, TimePicker } from "antd";
import dragula from 'dragula';
import 'dragula/dist/dragula.css';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { estimationListData } from "../../../core/data/json/estimationList";
import { IoMdSettings } from 'react-icons/io';
import { FaCheck, FaEye } from 'react-icons/fa';
import { HiEllipsisVertical } from 'react-icons/hi2';
import DeleteModal from '../../../core/common/modals/DeleteModal';

const Invoice = () => {

  const [showInvoiceViewForm, setShowInvoiceViewForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedInvoiceProduct, setSelectedInvoiceProduct] = useState(null);
  const [addedInvoiceEntries, setAddedInvoiceEntries] = useState([]);
  const [haveInvoiceShippingAddress, setHaveInvoiceShippingAddress] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedViewInvoice, setSelectedViewInvoice] = useState(null);
  const [selectedQuotationProduct, setSelectedQuotationProduct] = useState(null);
  const [selectedInvoicesStatus, setSelectedInvoicesStatus] = useState([]);
  const [stars, setStars] = useState({});
  const [deleteModalText, setDeleteModalText] = useState("");
  const [quotationQuantity, setQuotationQuantity] = useState(false);
  const [addedQuotationEntries, setAddedQuotationEntries] = useState([]);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [quotationQuantities, setQuotationQuantities] = useState([]);
  const [indexToDelete, setIndexToDelete] = useState(null);

  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoiceColumnVisibility, setInvoiceColumnVisibility] = useState({
    "": true,
    "Invoice Id": true,
    "Client": true,
    "Amount": true,
    "Date": true,
    "Expiry Date": true,
    "Invoice Status": true,
  });
  const [rows, setRows] = useState([
    { id: 1, description: 'Website Design', quantity: 4, rate: 250, tax: '5%', amount: 2000 },
    { id: 2, description: 'App Development', quantity: 2, rate: 200, tax: '0%', amount: 5000 },
  ]);
  const [quotationFormData, setQuotationFormData] = useState(
    {
      estimationsId: '',
      client: "",
      amount: "",
      status: "",
      date: new Date(),
      expiryDate: new Date(),
    }
  );

  const [quotationProduct, setQuotationProduct] = useState(
    {
      quotationName: '',
      quotationDescription: "",
      rate: "",
      quantity: "",
      tax: "",
    }
  );



  const currentDateAndTime = new Date();
  const currentDate = currentDateAndTime.toLocaleDateString();
  const currentTime = currentDateAndTime.toLocaleTimeString();


  const exportInvoicesToPDF = () => {
    const doc = new jsPDF();

    const filteredColumns = invoiceColumns.filter(
      (col) =>
        invoiceColumnVisibility[col.title]
    );


    const headers = filteredColumns.map((col) => col.title);
    const data = filteredInvoiceData.map((row) =>
      filteredColumns.map((col) => row[col.dataIndex] || "")
    );


    const pageWidth = doc.internal.pageSize.getWidth();
    const titleText = "Invoice Report";
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
    doc.save("Invoice-data.pdf");
  };
  const handleToggleInvoicesColumnVisibility = (columnTitle) => {
    setInvoiceColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [columnTitle]: !prevVisibility[columnTitle],
    }));
  };
  useEffect(() => {
    return () => { }
  }, [])
  const tableBodyRef = useRef(null);
  useEffect(() => {
    if (tableBodyRef.current) {
      const drake = dragula([tableBodyRef.current], {
        // Only allow dragging when the handle (with class .drag-handle) is clicked
        moves: (el, container, handle) => handle.classList.contains('drag-handle'),
      });

      drake.on('drop', (el, target, source, sibling) => {
        const rows = Array.from(tableBodyRef.current.children);

        setAddedQuotationEntries((prevEntries) => {
          const newOrder = rows.map((row) => {
            const index = row.getAttribute('data-index');
            return prevEntries[Number(index)];
          });
          return newOrder;
        });

        drake.cancel(true); // Force Dragula to reset after drag and drop
      });

      return () => {
        drake.destroy(); // Clean up dragula instance
      };
    }
  }, [addedQuotationEntries, setAddedQuotationEntries]);

  const handleStarToggle = (index) => {
    setStars((prevStars) => ({
      ...prevStars,
      [index]: !prevStars[index],
    }));
  };
  const handleDeleteQuotationEntry = (index) => {
    const updatedQuotationEntries = addedQuotationEntries.filter((_, i) => i !== index);
    setAddedQuotationEntries(updatedQuotationEntries);
  };
  const handleQuotationQuantityChange = (index, value) => {
    const newQuantities = [...quotationQuantities];
    newQuantities[index] = value; // Update the specific quantity for the row
    setQuotationQuantities(newQuantities); // Set the updated quantities array
  };
  const handleModalDeleteBtn = (text) => {
    console.log(`Deleting ${indexToDelete} ${text}...`);
  };
  const handleAddQuotationEntry = () => {
    if (selectedQuotationProduct) {
      // Create a new entry
      const newEntry = {
        itemName: selectedQuotationProduct.quotationName,
        description: selectedQuotationProduct.quotationDescription,
        quantity: quotationQuantity,
        rate: selectedQuotationProduct.rate,
        amount: quotationQuantity * selectedQuotationProduct.rate,
        // tax: "Some Tax", // You can adjust how you get tax data
      };

      // Add new entry to the addedEntries array
      setAddedQuotationEntries((prevEntries) => [...prevEntries, newEntry]);

      // Clear the input fields
      setQuotationQuantity(0);
      setSelectedQuotationProduct(null);
    }
  };
  const filterInvoicesStatus = (invoicesStatus) => {
    setSelectedInvoicesStatus((prevStatus) =>
      prevStatus.includes(invoicesStatus)
        ? prevStatus.filter((status) => status !== invoicesStatus)
        : [...prevStatus, invoicesStatus]
    );
  };
  const invoiceColumns = [
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
      title: "Invoice Id",
      dataIndex: "estimationsId",
      key: "estimationsId",
      render: (text, record) => {

        return (
          <div className="cell-content justify-content-between">
            <div
              state={{ record }}
              className="lead-name title-name fw-bold"
              style={{ color: "#2c5cc5", cursor: 'pointer' }}
              onClick={() => {
                setShowInvoiceForm(true);
                setShowInvoiceViewForm(false);
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
                  setShowInvoiceViewForm(true);
                  setShowInvoiceForm(true);
                  setSelectedViewInvoice(record)
                }}
              >
                <FaEye className="text-blue" /> View
              </div>
              <div
                className="dropdown-item cursor-pointer"
                data-bs-toggle="modal"
                data-bs-target={`#delete_${deleteModalText}`}
                onClick={() => { setDeleteModalText("invoice") }}
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
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount.localeCompare(b.amount),
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
      sorter: (a, b) => a.client.localeCompare(b.client),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      sorter: (a, b) => a.expiryDate.localeCompare(b.expiryDate),
    },
    {
      title: "Invoice Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
  ];


  const invoiceContainerRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const invoiceTableRef = useRef(null);

  useEffect(() => {
    const allRefsInitialized = invoiceContainerRefs.every(ref => ref.current !== null) && invoiceTableRef.current !== null;

    if (allRefsInitialized) {
      // Initialize Dragula only when all refs are available
      const drake = dragula([...invoiceContainerRefs.map(ref => ref.current), invoiceTableRef.current], {
        moves: (el, container, handle) => {
          // Allow dragging for DIVs in containerRefs and table rows
          return (
            el.tagName === 'DIV' || // Allow dragging of containers
            el.tagName === 'TR' // Allow dragging of table rows
          );
        },
      });

      // Optional: add event listeners for drag events
      drake.on('drop', (el, target, source, sibling) => {
        console.log('Dropped:', el);
      });

      // Cleanup on component unmount
      return () => {
        drake.destroy();
      };
    }
  }, [invoiceContainerRefs, invoiceTableRef]);

  const invoiceContentRef = useRef(null);
  const invoiceExportToPDF = () => {
    const input = invoiceContentRef.current;

    // Ensure the input element is present
    if (!input) {
      console.error("Content ref is not set or is null");
      return;
    }

    html2canvas(input, {
      scale: 2,
      allowTaint: true,  // Allow tainted images to be drawn to canvas
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // Specify orientation, unit, and format

      const imgWidth = 190; // Width of the image in mm
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      position += heightLeft;

      // Add a new page if the content is too long
      while (heightLeft >= pageHeight) {
        position = heightLeft - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      }

      pdf.save('download.pdf');
    }).catch((error) => {
      console.error("Error generating PDF:", error);
    });
  };

  const filteredInvoiceData = estimationListData.filter((invoice) => {

    const isAnySearchColumnVisible =
      invoiceColumnVisibility["Invoice Id"] ||
      invoiceColumnVisibility["Client"];

    const matchesSearchQuery =
      !isAnySearchColumnVisible ||
      (invoice.estimationsId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (invoice.client.toLowerCase().includes(searchQuery.toLowerCase()))


    const matchesStatus =
      selectedInvoicesStatus.length === 0 ||
      selectedInvoicesStatus.includes(invoice.status.toLowerCase());


    // const matchesEmployee =
    //   selectedEmployee.length === 0 ||
    //   selectedEmployee.includes(calls.agentName.toLowerCase());



    return matchesSearchQuery
     && matchesStatus 
    // && matchesEmployee

  });

  const visibleInvoiceColumns = invoiceColumns.filter(
    (column) => invoiceColumnVisibility[column.title]
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const handleQuotationProductChange = (selectedProduct) => {
    setSelectedQuotationProduct(selectedProduct);
  }

  const handleQuotationProductInputChange = (e) => {
    const { name, value } = e.target;
    // Update the respective field in the quotationProduct object
    setQuotationProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };
  const invoicesStatus = Object.values(
    estimationListData.reduce((acc, invoice) => {
      if (!acc[invoice.status]) {
        acc[invoice.status] = { value: invoice.status, label: invoice.status };
      }
      return acc;
    }, {})
  );

  const resetFilters = () => {
    setSelectedInvoicesStatus([]);
    setSearchQuery('');
  }

  return (
    <div id="invoice">
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center justify-content-end">
            {!showInvoiceViewForm && !showInvoiceForm && <div className="col-sm-12">
              <div className="d-flex justify-content-between">
                <div className="d-flex">
                  <div className="icon-form mb-3  me-2 mb-sm-0">
                    <span className="form-icon">
                      <i className="ti ti-search" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search Invoice"
                      value={searchQuery}
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
                                Invoice Status
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="Status"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="filter-content-list">
                                <ul>
                                  {invoicesStatus.map((invoicesStatus, index) => {
                                    return (
                                      <li
                                        key={index}
                                      >
                                        <div className="filter-checks" >
                                          <label className="checkboxs" >
                                            <input
                                              type="checkbox"
                                              checked={selectedInvoicesStatus.includes(invoicesStatus.value.toLowerCase())}
                                              onChange={() => filterInvoicesStatus(invoicesStatus.value.toLowerCase())}
                                            />
                                            <span className="checkmarks" />
                                            {invoicesStatus.value}
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
                              <Link to="" className="btn btn-primary" onClick={resetFilters}>
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
                        {invoiceColumns.map((column, index) => {
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
                                    handleToggleInvoicesColumnVisibility(
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
                            onClick={exportInvoicesToPDF}
                          >
                            <i className="ti ti-file-type-pdf text-danger me-1" />
                            Export as PDF
                          </Link>
                        </li>

                      </ul>
                    </div>
                  </div>
                  <Link
                    className="link-purple fw-medium"
                    onClick={() => {
                      // setSelectedMeeting(null)
                      // setSelectedMeetingType(null)
                      setShowInvoiceForm(true)
                      setSelectedInvoice(null)
                      setSelectedInvoiceProduct(null)
                      setAddedInvoiceEntries([])
                    }}
                  >
                    <i className="ti ti-circle-plus me-1" />
                    Add New
                  </Link>
                </div>
              </div>
            </div>
            }
            {
              showInvoiceForm && !showInvoiceViewForm && <h4 className="fw-semibold mb-0">Invoice</h4>
            }
            {
              showInvoiceViewForm && <div className="dropdown me-2" style={{ width: 'auto' }}>
                <Link
                  to="#"
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
                        to="#"
                        className="dropdown-item"
                        onClick={invoiceExportToPDF}
                      >
                        <i className="ti ti-file-type-pdf text-danger me-1" />
                        Export as PDF
                      </Link>
                    </li>

                  </ul>
                </div>
              </div>
            }
          </div>
        </div>




        <div className="card-body">
          {!showInvoiceForm ? <div className="table-responsive custom-table">
            <Table
              dataSource={filteredInvoiceData}
              columns={visibleInvoiceColumns}
              rowKey={(record) => record.key}
            />
          </div>
            : showInvoiceViewForm
              ?
              <>
                <div ref={invoiceContentRef} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* 2x2 Grid for draggable containers */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '20px', width: '100%' }}>
                    {/* First Container */}
                    <div ref={invoiceContainerRefs[0]} style={{ cursor: 'grab' }}>
                      <div style={{ width: 200, height: 'auto' }} className="mb-3"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBwzaOHjVPsPvedzhKqhNXT7QJ_ru2GGTkCA&s"
                        alt="" crossOrigin="anonymous"
                      /></div>
                    </div>
                    {/* Second Container */}
                    <div ref={invoiceContainerRefs[1]} style={{ cursor: 'grab' }}>
                      <div className="mb-3"><b>{selectedViewInvoice ? selectedViewInvoice.estimationsId : "No ID Selected"}</b></div>
                      <div className="mb-3">
                        <b>Ship to:</b>
                        <p className="mb-0">Burjuman</p>
                        <p className="mb-0">Burjuman</p>
                        <p className="mb-0">Dubai, Dubai</p>
                        <p className="mb-0">AE 00000</p>
                      </div>
                    </div>
                    {/* Third Container */}
                    <div ref={invoiceContainerRefs[2]} style={{ cursor: 'grab' }}>

                      <div className="mb-3">
                        <b>To,</b>
                        <p className="mb-0">California Media</p>
                        <p className="mb-0">Burjuman</p>
                        <p className="mb-0">Dubai, Dubai</p>
                        <p className="mb-0">AE 00000</p>
                      </div>
                    </div>

                    {/* Forth Container */}
                    <div ref={invoiceContainerRefs[3]} style={{ cursor: 'grab' }}>
                      <div className="mb-3">
                        <p className="mb-0"><b>Invoice Date:</b> 2024-10-17</p>
                        <p className="mb-0"><b>Expiry Date:</b> 2024-10-17</p>
                        <p className="mb-0"><b>Sale Agent:</b> Waqar Ansari</p>
                      </div>
                    </div>
                  </div>

                  {/* Draggable table (full width below the grid) */}
                  <div>
                    <table ref={invoiceTableRef} className="w-100 quotation-calc-table my-3">
                      <thead>
                        <tr>
                          <th><MdDragIndicator className="drag-handle" style={{ cursor: 'grab' }} /></th>
                          <th>Item</th>
                          <th>Quantity</th>
                          <th>Rate</th>
                          <th>Tax</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row) => (
                          <tr key={row.id}>
                            <td style={{ width: 20 }}>
                              <MdDragIndicator className="drag-handle" style={{ cursor: 'grab' }} />
                            </td>
                            <td style={{ width: 250 }}>{row.description}</td>
                            <td style={{ width: 100 }}>{row.quantity}</td>
                            <td style={{ width: 100 }}>{row.rate}</td>
                            <td>{row.tax}</td>
                            <td>{row.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>


                <div className="text-end col-md-4 offset-8">
                  <hr className="hr1" />
                  <b className="me-5">Sub Total :</b>
                  <span>2000 AED</span>
                  <hr className="hr1" />
                  <b className="me-5">Total :</b>
                  <span>2000 AED</span>
                </div>

                <div className="mt-5">
                  <p>
                    <b className="me-3">Note :</b>
                    <span>Note added for the customer</span>
                  </p>
                  <p>
                    <b className="me-3">Terms & Conditions :</b>
                    <span>Terms and Conditions added for the customer</span>
                  </p>
                </div>
              </>


              :
              <form>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="col-form-label">Company Name</label>
                      </div>
                      <Select
                        className="select"
                        options={options}

                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="col-form-label">
                        Project
                      </label>
                      <input className="form-control"
                        name="meetingTitle"
                        value={quotationFormData.client}
                        onChange={(e) => { }}
                        type="text" />
                    </div>
                  </div>
                </div>
                <Link
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#add_quotationAddress"
                  data-bs-dismiss="modal"
                  className="link-purple fw-medium mb-2 d-block"
                // onClick={() => {
                //   setSelectedMeeting(null)
                //   setSelectedMeetingType(null)
                // }}
                >
                  <i className="ti ti-circle-plus me-1" />
                  Add Billing Address
                </Link>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h4>Bill to</h4>
                    <p className="mb-0">Burjuman</p>
                    <p className="mb-0">Dubai</p>
                    <p className="mb-0">AE, 00000</p>
                  </div>
                  {haveInvoiceShippingAddress && <div className="col-md-6 mb-3">
                    <h4>Ship to</h4>
                    <p className="mb-0">Burjuman</p>
                    <p className="mb-0">Dubai</p>
                    <p className="mb-0">AE, 00000</p>
                  </div>}
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="col-form-label">Invoice Date</label>
                    <div className="icon-form-end">
                      <span className="form-icon">
                        <i className="ti ti-calendar-event" />
                      </span>
                      <DatePicker
                        className="form-control datetimepicker deals-details"
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="dd-MM-yyyy"
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="col-form-label">Expiry Date</label>
                    <div className="icon-form-end">
                      <span className="form-icon">
                        <i className="ti ti-calendar-event" />
                      </span>
                      <DatePicker
                        className="form-control datetimepicker deals-details"
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="dd-MM-yyyy"
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="col-form-label">Status</label>
                      </div>
                      <Select
                        className="select"
                        options={quotationStatus}
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="col-form-label">Sale Agent</label>
                      </div>
                      <Select
                        className="select"
                        options={companyEmployee}
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="col-form-label">Discount Type</label>
                      </div>
                      <Select
                        className="select"
                        options={discountType}
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="col-form-label">
                    Admin Note
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    name="meetingDescription"
                    value="Admin Note"
                    onChange={(e) => { }}
                  />
                </div>
                <Link
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#add_quotationItem"
                  data-bs-dismiss="modal"
                  className="link-purple fw-medium mb-2 d-inline-block"
                >
                  <i className="ti ti-circle-plus me-1" />
                  Add New Product
                </Link>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="col-form-label">Select Product</label>
                  </div>
                  <Select
                    className="select"
                    options={quotationItems}
                    onChange={handleQuotationProductChange}
                    classNamePrefix="react-select"
                    // This is used for searching
                    getOptionLabel={(quotationItems) => `${quotationItems.quotationName} ${quotationItems.quotationDescription}`}
                    getOptionValue={(quotationItems) => quotationItems.id}
                    // This is used for rendering the custom display
                    formatOptionLabel={(quotationItems) => (
                      <div>
                        <strong>{quotationItems.quotationName}</strong>{' '}
                        - {quotationItems.rate} AED, {quotationItems.quotationDescription}
                      </div>
                    )}
                  />
                </div>
                <table className="w-100 quotation-calc-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Rate</th>
                      <th>Tax</th>
                      <th>Amount</th>
                      <th><IoMdSettings /></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ width: 250 }}>
                        <input className="form-control"
                          name="quotationItemName"
                          value={selectedQuotationProduct ? selectedQuotationProduct.quotationName : ""}
                          onChange={handleQuotationProductInputChange}
                          type="text" />
                      </td>
                      <td style={{ width: 250 }}>
                        <textarea
                          className="form-control"
                          rows={4}
                          name="quotationDescription"
                          value={selectedQuotationProduct ? selectedQuotationProduct.quotationDescription : ""}
                          onChange={(e) => { }}
                        />
                      </td>
                      <td style={{ width: 100 }}>
                        <input className="form-control"
                          name="quotationQuantity"
                          value={quotationQuantity}
                          onChange={(e) => { }}
                          type="number" />
                        <p className="text-end">Unit</p>
                      </td>
                      <td style={{ width: 100 }}>
                        <input className="form-control"
                          name="quotationRate"
                          value={selectedQuotationProduct ? selectedQuotationProduct.rate : ""}
                          onChange={(e) => { }}
                          type="number" />
                      </td>

                      <td>
                        <Select
                          className="select"
                          options={discountType}
                          classNamePrefix="react-select"
                        />
                      </td>
                      <td>{quotationQuantity && selectedQuotationProduct ? (quotationQuantity * selectedQuotationProduct.rate) : ""}</td>

                      <td style={{ width: 50 }}>
                        <button
                          className="btn btn-success"
                          type="button"
                          onClick={() => {
                            handleAddQuotationEntry(selectedQuotationProduct)
                            setSelectedQuotation(null)
                            setSelectedQuotationProduct(null)
                          }}
                        >
                          <FaCheck />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {
                  addedQuotationEntries.length > 0 && (
                    <table className="w-100 quotation-calc-table mt-3" >
                      <tbody ref={tableBodyRef}>
                        {addedQuotationEntries.map((entry, index) => (
                          <tr data-index={index}>
                            <td style={{ width: 20 }}>

                              <MdDragIndicator className="drag-handle" style={{ cursor: 'grab' }} />
                            </td>
                            <td style={{ width: 250 }}>
                              <input className="form-control"
                                name="quotationItemName"
                                value={entry.itemName}
                                onChange={(e) => { }}
                                type="text" />
                            </td>
                            <td style={{ width: 250 }}>
                              <textarea
                                className="form-control"
                                rows={4}
                                name="quotationDescription"
                                value={entry.description}
                                onChange={(e) => { }}
                              />
                            </td>
                            <td style={{ width: 100 }}>
                              <input className="form-control"
                                name="quotationQuantity"
                                // value={quotationQuantities[index]}
                                value={addedQuotationEntries[index].quantity}
                                onChange={(e) => { handleQuotationQuantityChange(index, e.target.value) }}
                                type="number" />
                              <p className="text-end">Unit</p>
                            </td>
                            <td style={{ width: 100 }}>
                              <input className="form-control"
                                name="quotationRate"
                                value={entry.rate}
                                onChange={(e) => { }}
                                type="number" />
                            </td>

                            <td>
                              <Select
                                className="select"
                                options={discountType}
                                classNamePrefix="react-select"
                              />
                            </td>
                            <td>{entry ? (addedQuotationEntries[index].quantity * entry.rate) : ""}</td>
                            <td style={{ width: 50 }}>
                              <button
                                className="btn btn-primary"
                                type="button"
                                onClick={() => {
                                  handleDeleteQuotationEntry(index)
                                }}
                              >
                                <MdDelete />
                              </button>
                            </td>
                          </tr>

                        ))}
                      </tbody>
                    </table>
                  )}

                <div className="row">
                  <div className="col-md-6">
                  </div>
                  <div className="col-md-6">
                    <hr className="hr1" />
                    <p className="text-end"><b>Sub Total</b><span style={{ width: 80, display: "inline-block" }}>: 45678</span></p>
                    <hr className="hr1" />
                    <p className="text-end d-flex align-items-start justify-content-end">
                      <b className="me-4">Discount</b>
                      <input className="form-control w-25"
                        name="quotationDiscount"
                        value=""
                        onChange={(e) => { }}
                        type="text" />
                      <Select
                        className="select2 custom-radius"
                        options={discountOption}
                        name="taskType"
                        value={""}
                        onChange={(option) => { }}
                        classNamePrefix="react-select"
                      />
                      <span style={{ width: 80 }}>: 45678</span>
                    </p>
                    <hr className="hr1" />
                    <p className="text-end"><b>Total</b><span style={{ width: 80, display: "inline-block" }}>: 45678</span></p>
                  </div>
                </div>
                <div className="col-lg-12 text-end modal-btn mt-4">
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
                  >
                    Save changes
                  </button>
                </div>
              </form>
          }
        </div>
      </div>
      {/* Delete Modal */}
      {<DeleteModal text={deleteModalText} onDelete={() => { handleModalDeleteBtn(deleteModalText) }} onCancel={() => { setDeleteModalText("") }} />}
      {/* /Delete Modal */}
    </div>
  )
}

export default Invoice