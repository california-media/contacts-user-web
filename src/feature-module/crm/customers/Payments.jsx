import React, { useEffect, useRef, useState } from 'react'
import { MdDragIndicator } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Table from "../../../core/common/dataTable/index";
import { paymentsData } from '../../../core/data/json/payment-list';
import { HiEllipsisVertical } from 'react-icons/hi2';
import { FaEye } from 'react-icons/fa';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from 'html2canvas';
import dragula from 'dragula';
import 'dragula/dist/dragula.css';

const Payments = () => {

  const [showPaymentViewForm, setShowPaymentViewForm] = useState(null);
  const [searchQueryPayments, setSearchQueryPayments] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState([]);
  const [indexToDelete, setIndexToDelete] = useState(null);
  const [selectedViewInvoice, setSelectedViewInvoice] = useState(null);

  const [stars, setStars] = useState({});
  const [paymentsColumnVisibility, setPaymentsColumnVisibility] = useState({
    "": true,
    "Transaction Id": true,
    "Invoice Id": true,
    "Client": true,
    "Amount": true,
    "Due Date": true,
    "Payment Method": true,
});
  const [rows, setRows] = useState([
    { id: 1, description: 'Website Design', quantity: 4, rate: 250, tax: '5%', amount: 2000 },
    { id: 2, description: 'App Development', quantity: 2, rate: 200, tax: '0%', amount: 5000 },
  ]);

  const currentDateAndTime = new Date();
  const currentDate = currentDateAndTime.toLocaleDateString();
  const currentTime = currentDateAndTime.toLocaleTimeString();

  const paymentMethod = Object.values(
    paymentsData.reduce((acc, payment) => {
      if (!acc[payment.paymentMethod]) {
        acc[payment.paymentMethod] = { value: payment.paymentMethod, label: payment.paymentMethod };
      }
      return acc;
    }, {})
  );
  const filterPaymentMethod = (paymentMethod) => {
    setSelectedPaymentMethod((prevStatus) =>
      prevStatus.includes(paymentMethod)
        ? prevStatus.filter((status) => status !== paymentMethod)
        : [...prevStatus, paymentMethod]
    );
  };
  const resetPaymentsFilters = () => {
    setSelectedPaymentMethod([]);
    setSearchQueryPayments('');
  };
  const paymentsColumns = [
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
      title: "Transaction Id",
      dataIndex: "transactionId",
      key: "transactionId",
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
                  setShowPaymentViewForm(true);
                  // setShowQuotationForm(true);
                  // setSelectedViewQuotation(record)
                }}
              >
                <FaEye className="text-blue" /> View
              </div>
              {/* <div
          className="dropdown-item cursor-pointer"
          data-bs-toggle="modal"
          data-bs-target={`#delete_${deleteModalText}`}
          onClick={() => { setDeleteModalText("ticket") }}
        >
          <i className="ti ti-trash text-danger"></i> Delete
        </div> */}
            </div>
          </div>
        );
      },
      sorter: (a, b) => a.estimationsId.localeCompare(b.estimationsId),
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
      sorter: (a, b) => a.amount.localeCompare(b.amount),
    },
    {
      title: "Invoice Id",
      dataIndex: "invoiceId",
      key: "invoiceId",
      sorter: (a, b) => a.client.localeCompare(b.client),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      sorter: (a, b) => a.expiryDate.localeCompare(b.expiryDate),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
  ];

  const handleTogglePaymentsColumnVisibility = (columnTitle) => {
    setPaymentsColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [columnTitle]: !prevVisibility[columnTitle],
    }));
  };
  const exportPaymentsToPDF = () => {
    const doc = new jsPDF();

    const filteredColumns = paymentsColumns.filter(
      (col) =>
        paymentsColumnVisibility[col.title]
    );


    const headers = filteredColumns.map((col) => col.title);
    const data = filteredPaymentsData.map((row) =>
      filteredColumns.map((col) => row[col.dataIndex] || "")
    );


    const pageWidth = doc.internal.pageSize.getWidth();
    const titleText = "Payments Report";
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
    doc.save("Payment-details.pdf");
  };

  const filteredPaymentsData = paymentsData.filter((payments) => {
    const isAnySearchColumnVisible =
      paymentsColumnVisibility["Transaction Id"] ||
      paymentsColumnVisibility["Client"] ||
      paymentsColumnVisibility["Invoice Id"];

    const matchesSearchQuery =
      !isAnySearchColumnVisible ||
      (payments.transactionId.toLowerCase().includes(searchQueryPayments.toLowerCase())) ||
      (payments.client.toLowerCase().includes(searchQueryPayments.toLowerCase())) ||
      (payments.invoiceId.toLowerCase().includes(searchQueryPayments.toLowerCase()))
    // (columnVisibility["Call Id"] && calls.callId.toLowerCase().includes(searchQuery.toLowerCase())) ||
    // (columnVisibility["Agent Name"] && calls.agentName.toLowerCase().includes(searchQuery.toLowerCase()))


    const matchesPaymentMethod =
      selectedPaymentMethod.length === 0 ||
      selectedPaymentMethod.includes(payments.paymentMethod.toLowerCase());


    // const matchesEmployee =
    //   selectedEmployee.length === 0 ||
    //   selectedEmployee.includes(calls.agentName.toLowerCase());


    return matchesSearchQuery
      && matchesPaymentMethod
    // && matchesEmployee

  });
  const visiblePaymentsColumns = paymentsColumns.filter(
    (column) => paymentsColumnVisibility[column.title]
  );

  const paymentContentRef = useRef(null);
  const paymentViewExportToPDF = () => {
    const input = paymentContentRef.current;

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

  const paymentContainerRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const paymentTableRef = useRef(null);
  useEffect(() => {
    return () => { }
  }, [])

  useEffect(() => {
    const allRefsInitialized = paymentContainerRefs.every(ref => ref.current !== null) && paymentTableRef.current !== null;

    if (allRefsInitialized) {
      // Initialize Dragula only when all refs are available
      const drake = dragula([...paymentContainerRefs.map(ref => ref.current), paymentTableRef.current], {
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
  }, [paymentContainerRefs, paymentTableRef]);

  const handleStarToggle = (index) => {
    setStars((prevStars) => ({
      ...prevStars,
      [index]: !prevStars[index],
    }));
  };
  return (
    <div id="payments">
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-sm-12">
              {!showPaymentViewForm ? <div className="d-flex justify-content-between">
                <div className="d-flex">
                  <div className="icon-form mb-3  me-2 mb-sm-0">
                    <span className="form-icon">
                      <i className="ti ti-search" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search Payments"
                      value={searchQueryPayments}
                      onChange={(text) =>
                        setSearchQueryPayments(text.target.value)
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
                                Payment Method
                              </Link>
                            </div>
                            <div
                              className="filter-set-contents accordion-collapse collapse"
                              id="Status"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="filter-content-list">
                                <ul>
                                  {paymentMethod.map((paymentMethod, index) => {
                                    return (
                                      <li
                                        key={index}

                                      >
                                        <div className="filter-checks" >
                                          <label className="checkboxs" >
                                            <input
                                              type="checkbox"
                                              checked={selectedPaymentMethod.includes(paymentMethod.value.toLowerCase())}
                                              onChange={() => filterPaymentMethod(paymentMethod.value.toLowerCase())}
                                            />
                                            <span className="checkmarks" />
                                            {paymentMethod.value}
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
                              <Link to="" className="btn btn-primary" onClick={resetPaymentsFilters}>
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
                        {paymentsColumns.map((column, index) => {
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
                                    handleTogglePaymentsColumnVisibility(
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
                            onClick={exportPaymentsToPDF}
                          >
                            <i className="ti ti-file-type-pdf text-danger me-1" />
                            Export as PDF
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
                :
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
                            onClick={paymentViewExportToPDF}
                          >
                            <i className="ti ti-file-type-pdf text-danger me-1" />
                            Export as PDF
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

              }
            </div>
            <div className="col-sm-8">
              <div className="d-flex align-items-center flex-wrap row-gap-2 justify-content-sm-end">
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive custom-table">
            {!showPaymentViewForm ? <Table
              dataSource={filteredPaymentsData}
              columns={visiblePaymentsColumns}
              rowKey={(record) => record.key}
            />

              :

              <>
                <div className="p-5">
                  <div ref={paymentContentRef} style={{ display: 'flex', flexDirection: 'column', }}>
                    {/* 2x2 Grid for draggable containers */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '20px', width: '100%' }}>
                      {/* First Container */}
                      <div ref={paymentContainerRefs[0]} style={{ cursor: 'grab' }}>
                        <div style={{ width: 200, height: 'auto' }} className="mb-3"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBwzaOHjVPsPvedzhKqhNXT7QJ_ru2GGTkCA&s"
                          alt="" crossOrigin="anonymous"
                        /></div>
                      </div>
                      {/* Second Container */}
                      <div ref={paymentContainerRefs[1]} style={{ cursor: 'grab' }}>
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
                      <div ref={paymentContainerRefs[2]} style={{ cursor: 'grab' }}>

                        <div className="mb-3">
                          <b>To,</b>
                          <p className="mb-0">California Media</p>
                          <p className="mb-0">Burjuman</p>
                          <p className="mb-0">Dubai, Dubai</p>
                          <p className="mb-0">AE 00000</p>
                        </div>
                      </div>

                      {/* Forth Container */}
                      <div ref={paymentContainerRefs[3]} style={{ cursor: 'grab' }}>
                        <div className="mb-3">
                          <p className="mb-0"><b>Invoice Date:</b> 2024-10-17</p>
                          <p className="mb-0"><b>Expiry Date:</b> 2024-10-17</p>
                          <p className="mb-0"><b>Sale Agent:</b> Waqar Ansari</p>
                        </div>
                      </div>
                    </div>

                    {/* Draggable table (full width below the grid) */}
                    <div>
                      <table ref={paymentTableRef} className="w-100 quotation-calc-table my-3">
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
                </div>
              </>

            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payments