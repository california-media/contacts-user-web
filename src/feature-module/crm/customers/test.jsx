import React, { useState, useCallback, useEffect, useRef } from "react";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import { useDispatch, useSelector } from "react-redux";
import html2canvas from 'html2canvas';
import dayjs from "dayjs";
import {
    setActivityTogglePopup,
    setActivityTogglePopupTwo,
} from "../../../core/data/redux/commonSlice";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { callsData } from "../../../core/data/json/calls";
import { useDropzone } from 'react-dropzone';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Table from "../../../core/common/dataTable/index";
import CreatableSelect from 'react-select/creatable';
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { TbFileInvoice, TbInvoice } from "react-icons/tb";
import { GoProjectRoadmap } from "react-icons/go";
import dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Select from "react-select";
import { BsChatLeftQuote, BsTicketPerforated } from "react-icons/bs";
import { RxActivityLog } from "react-icons/rx";
import { AiOutlineDollar } from "react-icons/ai";
import { utils, writeFile } from "xlsx";
import {
    accountType,
    ascendingandDecending,
    companyName,
    documentType,
    duration,
    languageOptions,
    LocaleData,
    optionssymbol,
    priorityList,
    project,
    options,
    salestypelist,
    callStatus,
    socialMedia,
    taskType,
    meetingType,
    quotationStatus,
    discountType,
    countryoptions1,
    status,
    statusList,
    quotationItems,
    tagInputValues,
    discountOption,
    owner as companyEmployee,
    all_tags
} from "../../../core/common/selectoption/selectoption";
// import DatePicker from "react-datepicker";
import DefaultEditor from "react-simple-wysiwyg";
import { TagsInput } from "react-tag-input-component";
import CollapseHeader from "../../../core/common/collapse-header";
import { SelectWithImage } from "../../../core/common/selectWithImage";
import { SelectWithImage2 } from "../../../core/common/selectWithImage2";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { CiEdit, CiPlay1 } from "react-icons/ci";
import { FcApproval, FcUpload } from "react-icons/fc";
import { FaCalendarAlt, FaCheck, FaCloudDownloadAlt, FaEye, FaPhoneSlash, FaRegBell, FaTasks } from "react-icons/fa";
import { SlPeople } from "react-icons/sl";
import { IoMdAttach, IoMdDoneAll, IoMdSettings } from "react-icons/io";
import { DatePicker, TimePicker } from "antd";
import { MdAttachMoney, MdDelete, MdDownloadDone, MdDragIndicator, MdOutlineRemoveDone, MdPhoneInTalk } from "react-icons/md";
import { RiVideoOnLine } from "react-icons/ri";
import { IoLocationSharp, IoTicketOutline } from "react-icons/io5";
import { leadsData } from "../../../core/data/json/leads";
import CustomerOffcanvas from "../../../core/common/offCanvas/customer/CustomerOffcanvas";
import DeleteModal from "../../../core/common/modals/DeleteModal";
import { estimationListData } from "../../../core/data/json/estimationList";
import { HiEllipsisVertical } from "react-icons/hi2";
import { creditNotesData } from "../../../core/data/json/creditNotesData";
import { ticketsData } from "../../../core/data/json/tickets";
import TicketOffcanvas from "../../../core/common/offCanvas/ticket/TicketOffcanvas";
import { paymentsData } from "../../../core/data/json/payment-list";
const allNotes = [
    {
        photo: 'assets/img/profiles/avatar-19.jpg',
        name: 'California media',
        dateCreated: '15 Sep 2023, 12:10 pm',
        lastModified: "15 Sep 2023, 12:10 pm",
        isContacted: true,
        noteHeading: 'Important announcement',
        noteText: "A project review evaluates the success of an initiative and identifies areas for improvement. It can also evaluate a current project to determine whether it's on the right track. Or, it can determine the success of a completed project.",
        uploadedFiles: [
            {
                fileName: 'Project Specs.xls',
                fileSize: '365 kb',
                fileLogo: 'assets/img/media/media-35.jpg'
            },
            {
                fileName: 'Project.pdf',
                fileSize: '4 MB',
                fileLogo: 'assets/img/media/media-35.jpg'
            },
        ]
    },
    {
        photo: 'assets/img/profiles/avatar-19.jpg',
        name: 'California media',
        dateCreated: '15 Sep 2023, 12:12 pm',
        lastModified: "15 Sep 2023, 12:10 pm",
        isContacted: false,
        noteHeading: 'Not Important announcement',
        noteText: "A project review evaluates the success of an initiative and identifies areas for improvement. It can also evaluate a current project to determine whether it's on the right track. Or, it can determine the success of a completed project.",
        noteComments: [
            {
                commentText: 'The best way to get a project done faster is to start sooner. A goal without a timeline is just a dream.The goal you set must be challenging. At the same time, it should be realistic and attainable, not impossible to reach.',
                commentedBy: 'Aeron',
                commentTime: '17 Sep 2023, 12:10 pm',
            },
            {
                commentText: 'The best way to get a project done faster is to start sooner. A goal without a timeline is just a dream.The goal you set must be challenging. At the same time, it should be realistic and attainable, not impossible to reach.',
                commentedBy: 'Aeron',
                commentTime: '17 Sep 2023, 12:10 pm',
            },
        ],
        uploadedFiles: [
            {
                fileName: 'Project Specs.xls',
                fileSize: '365 kb',
                fileLogo: 'assets/img/media/media-35.jpg'
            },
            {
                fileName: 'Project.pdf',
                fileSize: '4 MB',
                fileLogo: 'assets/img/media/media-35.jpg'
            },
        ]
    },
]
const allTasks = [
    {
        name: 'California Media',
        photo: 'assets/img/profiles/avatar-19.jpg',
        title: 'Important Meeting',
        description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat sed culpa rem odio natus inventore eaque beatae voluptas, delectus alias omnis, totam eveniet dolore quia!',
        taskType: 'Follow Up',
        isCompleted: 'false',
        dateCreated: '16 Sep 2023, 12:10 pm',
        dueDate: '15 Sep 2024',
        dueTime: '11.40 pm',
    },
    {
        name: 'California Media',
        photo: 'assets/img/profiles/avatar-19.jpg',
        title: 'Important Meeting',
        description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat sed culpa rem odio natus inventore eaque beatae voluptas, delectus alias omnis, totam eveniet dolore quia!',
        taskType: 'Reminder',
        isCompleted: 'false',
        dateCreated: '17 Sep 2023, 12:10 pm',
        dueDate: '15 Oct 2024',
        dueTime: '11.40 pm',
    },
    {
        name: 'California Media',
        photo: 'assets/img/profiles/avatar-19.jpg',
        title: 'Important Meeting',
        description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat sed culpa rem odio natus inventore eaque beatae voluptas, delectus alias omnis, totam eveniet dolore quia!',
        taskType: 'Reminder',
        isCompleted: 'true',
        dateCreated: '18 Sep 2023, 12:10 pm',
        dueDate: '15 Oct 2024',
        dueTime: '11.40 pm',
    },
]

const allMeetings = [
    {
        title: "Important Meeting",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe explicabo cum quas quasi quo ut culpa exercitationem in! Similique, maxime!",
        startDate: '9 sep 2024',
        startTime: '12.45 pm',
        endDate: '9 sep 2024',
        endTime: '01.45 pm',
        meetingType: 'Online',
        createdOnDate: "9 sep 2024",
        createdOnTime: "01.45 pm",
        physicalLocation: "Burjuman",
    },
    {
        title: "Not Important Meeting",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe explicabo cum quas quasi quo ut culpa exercitationem in! Similique, maxime!",
        startDate: '9 sep 2024',
        startTime: '12.45 pm',
        endDate: '9 sep 2024',
        endTime: '01.45 pm',
        meetingType: 'Offline',
        createdOnDate: "9 sep 2024",
        createdOnTime: "01.45 pm",
        physicalLocation: "Burjuman",
    },
]
const ContactDetails = () => {
    const route = all_routes;
    const dispatch = useDispatch();
    const location = useLocation();
    const customerInfo = location.state?.record || location.state?.customer || {};
    const data = leadsData;
    const activityToggle = useSelector(
        (state) => state?.activityTogglePopup
    );
    const activityToggleTwo = useSelector(
        (state) => state?.activityTogglePopupTwo
    );
    const [openModal, setOpenModal] = useState(false);
    const [isEditor, setIsEditor] = useState(false);
    const [contactedToday, setContactedToday] = useState(false);
    const [isEditor2, setIsEditor2] = useState(false);
    const [sortOrder, setSortOrder] = useState("Descending");
    const [selectedTask, setSelectedTask] = useState(null);
    const [sortOrderIncompleteTask, setSortOrderIncompleteTask] = useState("Descending");
    const [sortOrderCompletedTask, setSortOrderCompletedTask] = useState("Descending");
    const [hoveredTaskCompletedIndex, setHoveredTaskCompletedIndex] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState([]);
    const [searchEmployeeInFilter, setSearchEmployeeInFilter] = useState("");
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [showPaymentViewForm, setShowPaymentViewForm] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);
    const [selectedMeetingType, setSelectedMeetingType] = useState(null);
    const [selectedCallStatus, setSelectedCallStatus] = useState([]);
    const [selectedTicketsStatus, setSelectedTicketsStatus] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState([]);
    const [selectedPaymentsStatus, setSelectedPaymentsStatus] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchQueryTickets, setSearchQueryTickets] = useState("");
    const [searchQueryPayments, setSearchQueryPayments] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [hoveredMeetingIndex, setHoveredMeetingIndex] = useState(null);

    const [indexToDelete, setIndexToDelete] = useState(null);
    const [stars, setStars] = useState({});
    const [hoveredTaskIndex, setHoveredTaskIndex] = useState(null);
    const [activeEditorIndex, setActiveEditorIndex] = useState(null);
    const [hoveredNoteIndex, setHoveredNoteIndex] = useState(null);
    const [isEditor3, setIsEditor3] = useState(false);
    const [owner, setOwner] = useState(["Collab"]);
    const [selectedDate1, setSelectedDate1] = useState(new Date());
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [deleteModalText, setDeleteModalText] = useState("");
    const [showQuotationForm, setShowQuotationForm] = useState(false);
    const [showInvoiceForm, setShowInvoiceForm] = useState(false);
    const [showCreditNotesForm, setShowCreditNotesForm] = useState(false);
    const [showQuotationViewForm, setShowQuotationViewForm] = useState(false);
    const [showInvoiceViewForm, setShowInvoiceViewForm] = useState(false);
    const [showCreditNotesViewForm, setShowCreditNotesViewForm] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [selectedCreditNotes, setSelectedCreditNotes] = useState(null);
    const [selectedQuotationProduct, setSelectedQuotationProduct] = useState(null);
    const [selectedInvoiceProduct, setSelectedInvoiceProduct] = useState(null);
    const [selectedCreditNotesProduct, setSelectedCreditNotesProduct] = useState(null);
    const [addedQuotationEntries, setAddedQuotationEntries] = useState([]);
    const [addedInvoiceEntries, setAddedInvoiceEntries] = useState([]);
    const [addedCreditNotesEntries, setAddedCreditNotesEntries] = useState([]);
    const [selectedViewQuotation, setSelectedViewQuotation] = useState(null);
    const [selectedViewInvoice, setSelectedViewInvoice] = useState(null);
    const [selectedViewCreditNotes, setSelectedViewCreditNotes] = useState(null);
    const [quotationQuantity, setQuotationQuantity] = useState(false);
    const [invoiceQuantity, setInvoiceQuantity] = useState(false);
    const [creditNotesQuantity, setCreditNotesQuantity] = useState(false);
    const [quotationQuantities, setQuotationQuantities] = useState([]);
    const [invoiceQuantities, setInvoiceQuantities] = useState([]);
    const [creditNotesQuantities, setCreditNotesQuantities] = useState([]);
    const [haveShippingAddress, setHaveShippingAddress] = useState(false);
    const [haveInvoiceShippingAddress, setHaveInvoiceShippingAddress] = useState(false);
    const [haveCreditNotesShippingAddress, setHaveCreditNotesShippingAddress] = useState(false);
    const [columnVisibility, setColumnVisibility] = useState({
        "": true,
        "Call Id": true,
        "Agent Name": true,
        "Call Type": true,
        "Call Date": true,
        "Call Duration": true,
        "Call Status": true,
        "Next FollowUp": true,
        "Recording": true,

    });
    const [quotationColumnVisibility, setQuotationColumnVisibility] = useState({
        "": true,
        "Quotation Id": true,
        "Client": true,
        "Amount": true,
        "Date": true,
        "Expiry Date": true,
        "Status": true,
    });
    const [invoiceColumnVisibility, setInvoiceColumnVisibility] = useState({
        "": true,
        "Invoice Id": true,
        "Client": true,
        "Amount": true,
        "Date": true,
        "Expiry Date": true,
        "Status": true,
    });
    const [creditNotesColumnVisibility, setCreditNotesColumnVisibility] = useState({
        "": true,
        "Credit Note Id": true,
        "Credit Note Date": true,
        "Customer": true,
        "Date": true,
        "Expiry Date": true,
        "Status": true,
        "Total Amount": true,
        "Remaining Amount": true,
    });
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
    const [paymentsColumnVisibility, setPaymentsColumnVisibility] = useState({
        "": true,
        "Transaction Id": true,
        "Invoice Id": true,
        "Client": true,
        "Amount": true,
        "Due Date": true,
        "Payment Method": true,
    });
    const [quotationProduct, setQuotationProduct] = useState(
        {
            quotationName: '',
            quotationDescription: "",
            rate: "",
            quantity: "",
            tax: "",
        }
    );
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
    const ticketsStatus = Object.values(
        ticketsData.reduce((acc, ticket) => {
            if (!acc[ticket.status]) {
                acc[ticket.status] = { value: ticket.status, label: ticket.status };
            }
            return acc;
        }, {})
    );
    const paymentMethod = Object.values(
        paymentsData.reduce((acc, payment) => {
            if (!acc[payment.paymentMethod]) {
                acc[payment.paymentMethod] = { value: payment.paymentMethod, label: payment.paymentMethod };
            }
            return acc;
        }, {})
    );
    const handleModalDeleteBtn = (text) => {
        console.log(`Deleting ${indexToDelete} ${text}...`);
    };
    const initializeStarsState = () => {
        const starsState = {};
        leadsData.forEach((item, index) => {
            starsState[index] = false;
        });
        setStars(starsState);
    };
    React.useEffect(() => {
        initializeStarsState();
    }, []);
    const handleStarToggle = (index) => {
        setStars((prevStars) => ({
            ...prevStars,
            [index]: !prevStars[index],
        }));
    };
    const filteredEmployees = companyEmployee.filter((employee) =>
        employee.value.toLowerCase().includes(searchEmployeeInFilter.toLowerCase())
    );
    const handleQuotationProductInputChange = (e) => {

        const { name, value } = e.target;

        // Update the respective field in the quotationProduct object
        setQuotationProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleQuotationQuantityChange = (index, value) => {
        const newQuantities = [...quotationQuantities];
        newQuantities[index] = value; // Update the specific quantity for the row
        setQuotationQuantities(newQuantities); // Set the updated quantities array
    };
    const handleDeleteQuotationEntry = (index) => {
        const updatedQuotationEntries = addedQuotationEntries.filter((_, i) => i !== index);
        setAddedQuotationEntries(updatedQuotationEntries);
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

    const filteredInvoiceData = estimationListData.filter((quotation) => {

        const isAnySearchColumnVisible =
            quotationColumnVisibility["Quotation Id"] ||
            quotationColumnVisibility["Client"];

        const matchesSearchQuery =
            !isAnySearchColumnVisible ||
            (quotation.estimationsId.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (quotation.client.toLowerCase().includes(searchQuery.toLowerCase()))


        // const matchesStatus =
        //   selectedCallStatus.length === 0 ||
        //   selectedCallStatus.includes(calls.callStatus.toLowerCase());


        // const matchesEmployee =
        //   selectedEmployee.length === 0 ||
        //   selectedEmployee.includes(calls.agentName.toLowerCase());



        return matchesSearchQuery
        //  && matchesStatus && matchesEmployee

    });
    const filteredCreditNotesData = creditNotesData.filter((creditNotes) => {

        const isAnySearchColumnVisible =
            creditNotesColumnVisibility["Credit Note Id"] ||
            creditNotesColumnVisibility["Client"];

        const matchesSearchQuery =
            !isAnySearchColumnVisible ||
            (creditNotes.creditNotesId.toLowerCase().includes(searchQuery.toLowerCase()))
        // ||
        // (creditNotes.client.toLowerCase().includes(searchQuery.toLowerCase()))


        // const matchesStatus =
        //   selectedCallStatus.length === 0 ||
        //   selectedCallStatus.includes(calls.callStatus.toLowerCase());


        // const matchesEmployee =
        //   selectedEmployee.length === 0 ||
        //   selectedEmployee.includes(calls.agentName.toLowerCase());



        return matchesSearchQuery
        //  && matchesStatus && matchesEmployee

    });

    const currentDateAndTime = new Date();
    const currentDate = currentDateAndTime.toLocaleDateString();
    const currentTime = currentDateAndTime.toLocaleTimeString();
    const exportPDF = () => {
        const doc = new jsPDF();

        const filteredColumns = columns.filter(
            (col) =>
                columnVisibility[col.title] &&
                col.title !== "Recording"
        );


        const headers = filteredColumns.map((col) => col.title);
        const data = filteredCallData.map((row) =>
            filteredColumns.map((col) => row[col.dataIndex] || "")
        );


        const pageWidth = doc.internal.pageSize.getWidth();
        const titleText = "Calls Report";
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


        doc.save("Call-details.pdf");
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


    const contentRef = useRef(null);
    const exportToPDF = () => {
        const input = contentRef.current;

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

    const creditNotesContentRef = useRef(null);
    const creditNotesExportToPDF = () => {
        const input = creditNotesContentRef.current;

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

    const exportExcel = () => {
        const wb = utils.book_new();


        const filteredColumns = columns.filter((col) =>
            columnVisibility[col.title] && col.title !== "Recording"
        );


        const wsData = [
            filteredColumns.map((col) => col.title),
            ...filteredCallData.map((row) =>
                filteredColumns.map((col) => row[col.dataIndex] || "")
            ),
        ];


        const ws = utils.aoa_to_sheet(wsData);


        utils.book_append_sheet(wb, ws, "Calls");


        writeFile(wb, "calls_report.xlsx");
    };
    const filteredQuotationData = estimationListData.filter((quotation) => {

        const isAnySearchColumnVisible =
            quotationColumnVisibility["Quotation Id"] ||
            quotationColumnVisibility["Client"];

        const matchesSearchQuery =
            !isAnySearchColumnVisible ||
            (quotation.estimationsId.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (quotation.client.toLowerCase().includes(searchQuery.toLowerCase()))


        // const matchesStatus =
        //   selectedCallStatus.length === 0 ||
        //   selectedCallStatus.includes(calls.callStatus.toLowerCase());


        // const matchesEmployee =
        //   selectedEmployee.length === 0 ||
        //   selectedEmployee.includes(calls.agentName.toLowerCase());



        return matchesSearchQuery
        //  && matchesStatus && matchesEmployee

    });

    const handleQuotationProductChange = (selectedProduct) => {
        setSelectedQuotationProduct(selectedProduct);
    }
    const columns = [
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
            title: "Call Id",
            dataIndex: "callId",
            key: "callId",
            sorter: (a, b) => a.callId.localeCompare(b.callId),
        },
        {
            title: "Agent Name",
            dataIndex: "agentName",
            key: "agentName",
            sorter: (a, b) => a.agentName.localeCompare(b.agentName),
        },
        {
            title: "Call Date",
            dataIndex: "callDate",
            key: "callDate",
            sorter: (a, b) => a.callDate.localeCompare(b.callDate),
        },
        {
            title: "Call Duration",
            dataIndex: "callDuration",
            key: "callDuration",
            sorter: (a, b) => a.callDuration.localeCompare(b.callDuration),
        },
        {
            title: "Call Status",
            dataIndex: "callStatus",
            key: "callStatus",
            sorter: (a, b) => a.callStatus.localeCompare(b.callStatus),
        },
        {
            title: "Next FollowUp",
            dataIndex: "nextFollowUp",
            key: "nextFollowUp",
            sorter: (a, b) => a.nextFollowUp.localeCompare(b.nextFollowUp),
        },
        {
            title: "Recording",
            dataIndex: "recordingLink",
            key: "recordingLink",
            render: (text) => (
                <div className="d-flex justify-content-center align-items-center">
                    <span style={{ color: '#00918E' }} className="me-3">
                        <FaCloudDownloadAlt />
                    </span>
                    <span style={{ color: "blue" }}>
                        <CiPlay1 />
                    </span>
                </div>
            ),
        },
    ];
    const quotationColumns = [
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
            title: "Quotation Id",
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


                                setShowQuotationForm(true);
                                setShowQuotationViewForm(false);
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
                                    setShowQuotationViewForm(true);
                                    setShowQuotationForm(true);
                                    setSelectedViewQuotation(record)
                                }}
                            >
                                <FaEye className="text-blue" /> View
                            </div>
                            <div
                                className="dropdown-item cursor-pointer"
                                data-bs-toggle="modal"
                                data-bs-target={`#delete_${deleteModalText}`}
                                onClick={() => { setDeleteModalText("quotation") }}
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
            title: "Status",
            dataIndex: "status",
            key: "status",
            sorter: (a, b) => a.status.localeCompare(b.status),
        },
    ];
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
            title: "Status",
            dataIndex: "status",
            key: "status",
            sorter: (a, b) => a.status.localeCompare(b.status),
        },
    ];
    const creditNotesColumns = [
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
            title: "Credit Note Id",
            dataIndex: "creditNotesId",
            key: "creditNotesId",
            render: (text, record) => {
                return (
                    <div className="cell-content justify-content-between">
                        <div
                            state={{ record }}
                            className="lead-name title-name fw-bold"
                            style={{ color: "#2c5cc5", cursor: 'pointer' }}
                            onClick={() => {
                                setShowCreditNotesForm(true);
                                setShowCreditNotesViewForm(false);
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
                                    setShowCreditNotesViewForm(true);
                                    setShowCreditNotesForm(true);
                                    setSelectedViewCreditNotes(record)
                                }}
                            >
                                <FaEye className="text-blue" /> View
                            </div>
                            <div
                                className="dropdown-item cursor-pointer"
                                data-bs-toggle="modal"
                                data-bs-target={`#delete_${deleteModalText}`}
                                onClick={() => { setDeleteModalText("credit note") }}
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
            title: "Customer",
            dataIndex: "customer",
            key: "customer",
            sorter: (a, b) => a.client.localeCompare(b.client),
        },
        {
            title: "Credit Note Date",
            dataIndex: "creditNotesDate",
            key: "creditNotesDate",
            sorter: (a, b) => a.date.localeCompare(b.date),
        },
        {
            title: "Total Amount",
            dataIndex: "totalAmount",
            key: "totalAmount",
            sorter: (a, b) => a.amount.localeCompare(b.amount),
        },
        {
            title: "Remaining Amount",
            dataIndex: "remainingAmount",
            key: "remainingAmount",
            sorter: (a, b) => a.amount.localeCompare(b.amount),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            sorter: (a, b) => a.status.localeCompare(b.status),
        },
    ];
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

    const visibleColumns = columns.filter(
        (column) => columnVisibility[column.title]
    );
    const visibleQuotationColumns = quotationColumns.filter(
        (column) => quotationColumnVisibility[column.title]
    );
    const visibleInvoiceColumns = invoiceColumns.filter(
        (column) => invoiceColumnVisibility[column.title]
    );
    const visibleCreditNotesColumns = creditNotesColumns.filter(
        (column) => creditNotesColumnVisibility[column.title]
    );
    const visibleTicketsColumns = ticketsColumns.filter(
        (column) => ticketsColumnVisibility[column.title]
    );
    const visiblePaymentsColumns = paymentsColumns.filter(
        (column) => paymentsColumnVisibility[column.title]
    );
    const handleToggleColumnVisibility = (columnTitle) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [columnTitle]: !prevVisibility[columnTitle],
        }));

    };
    const handleToggleTicketsColumnVisibility = (columnTitle) => {
        setTicketsColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [columnTitle]: !prevVisibility[columnTitle],
        }));
    };
    const handleTogglePaymentsColumnVisibility = (columnTitle) => {
        setPaymentsColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [columnTitle]: !prevVisibility[columnTitle],
        }));
    };

    const handleDateChange1 = (date) => {
        setSelectedDate1(date);
    };

    const [selectedDate, setSelectedDate] = useState(new Date());
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    const [selectedDate2, setSelectedDate2] = useState(new Date());
    const handleDateChange2 = (date) => {
        setSelectedDate2(date);
    };
    const [selectedDate4, setSelectedDate4] = useState(new Date());
    const handleDateChange4 = (date) => {
        setSelectedDate4(date);
    };
    const handleCustomerEditClick = (record) => {
        setSelectedCustomer(record);
    };

    const filteredCallData = callsData.filter((calls) => {

        const isAnySearchColumnVisible =
            columnVisibility["Call Id"] ||
            columnVisibility["Agent Name"];

        const matchesSearchQuery =
            !isAnySearchColumnVisible ||
            (calls.callId.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (calls.agentName.toLowerCase().includes(searchQuery.toLowerCase()))
        // (columnVisibility["Call Id"] && calls.callId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        // (columnVisibility["Agent Name"] && calls.agentName.toLowerCase().includes(searchQuery.toLowerCase()))


        const matchesStatus =
            selectedCallStatus.length === 0 ||
            selectedCallStatus.includes(calls.callStatus.toLowerCase());


        const matchesEmployee =
            selectedEmployee.length === 0 ||
            selectedEmployee.includes(calls.agentName.toLowerCase());


        return matchesSearchQuery && matchesStatus && matchesEmployee

    });
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
    const filterLeadEmployee = (leadEmployee) => {
        setSelectedEmployee((prevStatus) =>
            prevStatus.includes(leadEmployee)
                ? prevStatus.filter((employee) => employee !== leadEmployee)
                : [...prevStatus, leadEmployee]
        );
    };




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


    const ViewQuotationTableRef = useRef(null);

    useEffect(() => {
        const drake = dragula([ViewQuotationTableRef.current]);

        // Event listener for the 'drop' event
        drake.on('drop', (el, target, source, sibling) => {
            // Get the new order of rows
            const newOrder = Array.from(ViewQuotationTableRef.current.children).map((row) => {
                const rowIndex = Array.from(ViewQuotationTableRef.current.children).indexOf(row);
                return rows[rowIndex]; // Keep the same data associated with the rows
            });

            // Update the state with the new order
            setRows(newOrder);
        });

        return () => {
            drake.destroy(); // Cleanup on unmount
        };
    }, [rows]);


    const containerRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const tableRef = useRef(null);

    useEffect(() => {
        const allRefsInitialized = containerRefs.every(ref => ref.current !== null) && tableRef.current !== null;

        if (allRefsInitialized) {
            // Initialize Dragula only when all refs are available
            const drake = dragula([...containerRefs.map(ref => ref.current), tableRef.current], {
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
    }, [containerRefs, tableRef]);



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


    const paymentContainerRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const paymentTableRef = useRef(null);

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


    const creditNotesContainerRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const creditNotesTableRef = useRef(null);

    useEffect(() => {
        const allRefsInitialized = creditNotesContainerRefs.every(ref => ref.current !== null) && creditNotesTableRef.current !== null;

        if (allRefsInitialized) {
            // Initialize Dragula only when all refs are available
            const drake = dragula([...creditNotesContainerRefs.map(ref => ref.current), creditNotesTableRef.current], {
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
    }, [creditNotesContainerRefs, creditNotesTableRef]);

    const filterCallStatus = (callStatus) => {
        setSelectedCallStatus((prevStatus) =>
            prevStatus.includes(callStatus)
                ? prevStatus.filter((status) => status !== callStatus)
                : [...prevStatus, callStatus]
        );
    };
    const filterTicketsStatus = (ticketsStatus) => {
        setSelectedTicketsStatus((prevStatus) =>
            prevStatus.includes(ticketsStatus)
                ? prevStatus.filter((status) => status !== ticketsStatus)
                : [...prevStatus, ticketsStatus]
        );
    };
    const filterPaymentMethod = (paymentMethod) => {
        setSelectedPaymentMethod((prevStatus) =>
            prevStatus.includes(paymentMethod)
                ? prevStatus.filter((status) => status !== paymentMethod)
                : [...prevStatus, paymentMethod]
        );
    };
    const resetFilters = () => {
        setSelectedCallStatus([]);
        setSelectedEmployee([]);
        setSearchEmployeeInFilter('');
    };
    const resetTicketsFilters = () => {
        setSelectedTicketsStatus([]);
        setSearchQueryTickets('');
    };
    const resetPaymentsFilters = () => {
        setSelectedPaymentMethod([]);
        setSearchQueryPayments('');
    };
    dayjs.extend(customParseFormat);
    const onChange = (time, timeString) => {
        console.log(time, timeString);
    };
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
    const handleTaskEditClick = (task) => {
        setSelectedTask(task)
    }
    const handleInput = (event) => {
        const input = event.target.value;
        if (selectedTask) {

            setSelectedTask({
                ...selectedTask,
                title: input,
            });
        }
    }
    const handleNoteEditClick = (note) => {
        setSelectedNote(note)
    }
    const handleMeetingTypeChange = (selectedOption) => {
        setSelectedMeetingType(selectedOption ? selectedOption.value : null);
    };
    const handleMeetingEditClick = (meeting) => {
        setSelectedMeeting(meeting)
    }
    const onDrop = useCallback((acceptedFiles) => {
        // Handle the uploaded files here
        setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        // accept: {
        //   "text/csv": ['.csv'],
        //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ['.xlsx']
        // },
        maxSize: 5242880, // 5MB max file size
        multiple: true
    });
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
    const countries = [
        { value: "Choose", label: "Choose" },
        { value: "India", label: "India" },
        { value: "USA", label: "USA" },
        { value: "France", label: "France" },
        { value: "UAE", label: "UAE" },
    ];
    const languages = [
        { value: "Choose", label: "Choose" },
        { value: "English", label: "English" },
        { value: "Arabic", label: "Arabic" },
        { value: "Chinese", label: "Chinese" },
        { value: "Hindi", label: "Hindi" },
    ];

    const handleRadioChange = (event) => {
        setContactedToday(event.target.value === 'contactedToday');
    };
    const sortNotes = (notes) => {
        const sortedNotes = [...notes];
        const parseDate = (dateString) => {
            const [day, month, year, time, meridiem] = dateString.split(/[\s,]+/);
            const formattedDate = `${day} ${month} ${year} ${time} ${meridiem}`;
            return new Date(formattedDate).getTime();
        };
        if (sortOrder === "Ascending") {
            sortedNotes.sort((a, b) => parseDate(a.dateCreated) - parseDate(b.dateCreated));
        } else if (sortOrder === "Descending") {
            sortedNotes.sort((a, b) => parseDate(b.dateCreated) - parseDate(a.dateCreated));
        }
        return sortedNotes;
    };
    const sortIncompleteTask = (incompleteTask) => {
        const sortedIncompleteTask = [...incompleteTask];
        const parseDate = (dateString) => {
            const [day, month, year, time, meridiem] = dateString.split(/[\s,]+/);
            const formattedDate = `${day} ${month} ${year} ${time} ${meridiem}`;
            return new Date(formattedDate).getTime();
        };
        if (sortOrderIncompleteTask === "Ascending") {
            sortedIncompleteTask.sort((a, b) => parseDate(a.dateCreated) - parseDate(b.dateCreated));
        } else if (sortOrderIncompleteTask === "Descending") {
            sortedIncompleteTask.sort((a, b) => parseDate(b.dateCreated) - parseDate(a.dateCreated));
        }
        return sortedIncompleteTask;
    };
    const sortCompletedTask = (completedTask) => {
        const sortedCompletedTask = [...completedTask];
        const parseDate = (dateString) => {
            const [day, month, year, time, meridiem] = dateString.split(/[\s,]+/);
            const formattedDate = `${day} ${month} ${year} ${time} ${meridiem}`;
            return new Date(formattedDate).getTime();
        };
        if (sortOrderCompletedTask === "Ascending") {
            sortedCompletedTask.sort((a, b) => parseDate(a.dateCreated) - parseDate(b.dateCreated));
        } else if (sortOrderCompletedTask === "Descending") {
            sortedCompletedTask.sort((a, b) => parseDate(b.dateCreated) - parseDate(a.dateCreated));
        }
        return sortedCompletedTask;
    };

    const sortedNotes = sortNotes(allNotes);
    const sortedIncompleteTask = sortIncompleteTask(allTasks);
    const sortedCompletedTask = sortCompletedTask(allTasks);
    return (
        <>
            {/* Page Wrapper */}
            <div className="page-wrapper">
                <div className="content">
                    <div className="row">
                        <div className="col-md-12">
                            {/* Contact User */}
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
                                                    handleCustomerEditClick(customerInfo)
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
                            {/* /Contact User */}
                        </div>
                        {/* Contact Sidebar */}
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
                        {/* /Contact Sidebar */}
                        {/* Contact Details */}
                        <div className="col-xl-9">
                            <div className="card mb-3">
                                <div className="card-body pb-0 pt-2">
                                    <ul className="nav nav-tabs nav-tabs-bottom" role="tablist">

                                    </ul>
                                    <div className="tab-content pt-0">
                                        {/* <div className="tab-pane fade" id="customerInfo"> */}
                                        <ul className="nav nav-tabs nav-tabs-bottom" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <Link
                                                    to=""
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#notes"
                                                    className="nav-link active"
                                                >
                                                    <i className="ti ti-notes me-1" />
                                                    Notes
                                                </Link>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <Link
                                                    to=""
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#tasks"
                                                    className="nav-link"
                                                >
                                                    <FaTasks className="me-2" />
                                                    Tasks
                                                </Link>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <Link
                                                    to=""
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#meeting"
                                                    className="nav-link"
                                                >
                                                    <SlPeople className="me-2" />
                                                    Meetings
                                                </Link>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <Link
                                                    to=""
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#calls"
                                                    className="nav-link"
                                                >
                                                    <i className="ti ti-phone me-1" />
                                                    Calls
                                                </Link>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <Link
                                                    to=""
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#attachment"
                                                    className="nav-link"
                                                >
                                                    <IoMdAttach className="me-2" />
                                                    Attachment
                                                </Link>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <Link
                                                    to=""
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#activities"
                                                    className="nav-link"
                                                >
                                                    <RxActivityLog className="me-1" />
                                                    Activities
                                                </Link>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <Link
                                                    to=""
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#quotation"
                                                    className="nav-link"
                                                    onClick={() => {
                                                        setShowQuotationForm(false)
                                                        setShowQuotationViewForm(false)
                                                    }}
                                                >
                                                    <BsChatLeftQuote className="me-1" />
                                                    Quotation
                                                </Link>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <Link
                                                    to=""
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#invoice"
                                                    className="nav-link"
                                                    onClick={() => {
                                                        setShowInvoiceForm(false)
                                                        setShowInvoiceViewForm(false)
                                                    }}
                                                >
                                                    <LiaFileInvoiceDollarSolid className="me-1" />
                                                    Invoice
                                                </Link>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <Link
                                                    to=""
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#creditNotes"
                                                    className="nav-link"
                                                    onClick={() => {
                                                        setShowCreditNotesForm(false)
                                                        setShowCreditNotesViewForm(false)
                                                    }}
                                                >
                                                    <TbFileInvoice className="me-1" />
                                                    Credit Notes
                                                </Link>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <Link
                                                    to=""
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#tickets"
                                                    className="nav-link"
                                                    onClick={() => {
                                                    }}
                                                >
                                                    <BsTicketPerforated className="me-1" />
                                                    Tickets
                                                </Link>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <Link
                                                    to=""
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#payments"
                                                    className="nav-link"
                                                    onClick={() => {
                                                        setShowPaymentViewForm(false)
                                                    }}
                                                >
                                                    <AiOutlineDollar className="me-1" />
                                                    Payments
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/* Tab Content */}
                            <div className="tab-content pt-0">
                                {/* Activities */}
                                <div className="tab-pane fade" id="activities">
                                    <div className="card">
                                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                                            <h4 className="fw-semibold">Activities</h4>
                                            <div>
                                                <div className="form-sort mt-0">
                                                    <i className="ti ti-sort-ascending-2" />
                                                    <Select
                                                        // className="select"
                                                        // options={ascendingandDecending}
                                                        // placeholder="Sort By Date"
                                                        // classNamePrefix="react-select"
                                                        className="select dropdownCusWidth"
                                                        options={ascendingandDecending}
                                                        placeholder="Sort By Date"
                                                        classNamePrefix="react-select"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="badge badge-soft-purple fs-14 fw-normal shadow-none mb-3">
                                                <i className="ti ti-calendar-check me-1" />
                                                29 Aug 2023
                                            </div>
                                            <div className="card border shadow-none mb-3">
                                                <div className="card-body p-3">
                                                    <div className="d-flex">
                                                        <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-pending">
                                                            <i className="ti ti-mail-code" />
                                                        </span>
                                                        <div>
                                                            <h6 className="fw-medium mb-1">
                                                                You sent 1 Message to the contact.
                                                            </h6>
                                                            <p>10:25 pm</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card border shadow-none mb-3">
                                                <div className="card-body p-3">
                                                    <div className="d-flex">
                                                        <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-secondary-success">
                                                            <i className="ti ti-phone" />
                                                        </span>
                                                        <div>
                                                            <h6 className="fw-medium mb-1">
                                                                Denwar responded to your appointment schedule
                                                                question by call at 09:30pm.
                                                            </h6>
                                                            <p>09:25 pm</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card border shadow-none mb-3">
                                                <div className="card-body p-3">
                                                    <div className="d-flex">
                                                        <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-orange">
                                                            <i className="ti ti-notes" />
                                                        </span>
                                                        <div>
                                                            <h6 className="fw-medium mb-1">
                                                                Notes added by Antony
                                                            </h6>
                                                            <p className="mb-1">
                                                                Please accept my apologies for the
                                                                inconvenience caused. It would be much
                                                                appreciated if it's possible to reschedule to
                                                                6:00 PM, or any other day that week.
                                                            </p>
                                                            <p>10.00 pm</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="badge badge-soft-purple fs-14 fw-normal shadow-none mb-3">
                                                <i className="ti ti-calendar-check me-1" />
                                                28 Feb 2024
                                            </div>
                                            <div className="card border shadow-none mb-3">
                                                <div className="card-body p-3">
                                                    <div className="d-flex">
                                                        <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-info">
                                                            <i className="ti ti-user-pin" />
                                                        </span>
                                                        <div>
                                                            <h6 className="fw-medium mb-1 d-inline-flex align-items-center flex-wrap">
                                                                Meeting With{" "}
                                                                <span className="avatar avatar-xs mx-2">
                                                                    <ImageWithBasePath
                                                                        src="assets/img/profiles/avatar-19.jpg"
                                                                        alt="img"
                                                                    />
                                                                </span>{" "}
                                                                Abraham
                                                            </h6>
                                                            <p>Schedueled on 05:00 pm</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card border shadow-none mb-3">
                                                <div className="card-body p-3">
                                                    <div className="d-flex">
                                                        <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-secondary-success">
                                                            <i className="ti ti-notes" />
                                                        </span>
                                                        <div>
                                                            <h6 className="fw-medium mb-1">
                                                                Drain responded to your appointment schedule
                                                                question.
                                                            </h6>
                                                            <p>09:25 pm</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="badge badge-soft-purple fs-14 fw-normal shadow-none mb-3">
                                                <i className="ti ti-calendar-check me-1" />
                                                Upcoming Activity
                                            </div>
                                            <div className="card border shadow-none mb-0">
                                                <div className="card-body p-3">
                                                    <div className="d-flex">
                                                        <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-info">
                                                            <i className="ti ti-user-pin" />
                                                        </span>
                                                        <div>
                                                            <h6 className="fw-medium mb-1">
                                                                Product Meeting
                                                            </h6>
                                                            <p className="mb-1">
                                                                A product team meeting is a gathering of the
                                                                cross-functional product team — ideally
                                                                including team members from product,
                                                                engineering, marketing, and customer support.
                                                            </p>
                                                            <p>25 Jul 2023, 05:00 pm</p>
                                                            <div className="upcoming-info">
                                                                <div className="row">
                                                                    <div className="col-sm-4">
                                                                        <p>Reminder</p>
                                                                        <div className="dropdown">
                                                                            <Link
                                                                                to=""
                                                                                className="dropdown-toggle"
                                                                                data-bs-toggle="dropdown"
                                                                                aria-expanded="false"
                                                                            >
                                                                                <i className="ti ti-clock-edit me-1" />
                                                                                Reminder
                                                                                <i className="ti ti-chevron-down ms-1" />
                                                                            </Link>
                                                                            <div className="dropdown-menu dropdown-menu-right">
                                                                                <Link
                                                                                    className="dropdown-item"
                                                                                    to=""
                                                                                >
                                                                                    Remainder
                                                                                </Link>
                                                                                <Link
                                                                                    className="dropdown-item"
                                                                                    to=""
                                                                                >
                                                                                    1 hr
                                                                                </Link>
                                                                                <Link
                                                                                    className="dropdown-item"
                                                                                    to=""
                                                                                >
                                                                                    10 hr
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-4">
                                                                        <p>Task Priority</p>
                                                                        <div className="dropdown">
                                                                            <Link
                                                                                to=""
                                                                                className="dropdown-toggle"
                                                                                data-bs-toggle="dropdown"
                                                                                aria-expanded="false"
                                                                            >
                                                                                <i className="ti ti-square-rounded-filled me-1 text-danger circle" />
                                                                                High
                                                                                <i className="ti ti-chevron-down ms-1" />
                                                                            </Link>
                                                                            <div className="dropdown-menu dropdown-menu-right">
                                                                                <Link
                                                                                    className="dropdown-item"
                                                                                    to=""
                                                                                >
                                                                                    <i className="ti ti-square-rounded-filled me-1 text-danger circle" />
                                                                                    High
                                                                                </Link>
                                                                                <Link
                                                                                    className="dropdown-item"
                                                                                    to=""
                                                                                >
                                                                                    <i className="ti ti-square-rounded-filled me-1 text-success circle" />
                                                                                    Low
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-4">
                                                                        <p>Assigned to</p>
                                                                        <div className="dropdown">
                                                                            <Link
                                                                                to=""
                                                                                className="dropdown-toggle"
                                                                                data-bs-toggle="dropdown"
                                                                                aria-expanded="false"
                                                                            >
                                                                                <ImageWithBasePath
                                                                                    src="assets/img/profiles/avatar-19.jpg"
                                                                                    alt="img"
                                                                                    className="avatar-xs"
                                                                                />
                                                                                John
                                                                                <i className="ti ti-chevron-down ms-1" />
                                                                            </Link>
                                                                            <div className="dropdown-menu dropdown-menu-right">
                                                                                <Link
                                                                                    className="dropdown-item"
                                                                                    to=""
                                                                                >
                                                                                    <ImageWithBasePath
                                                                                        src="assets/img/profiles/avatar-19.jpg"
                                                                                        alt="img"
                                                                                        className="avatar-xs"
                                                                                    />
                                                                                    John
                                                                                </Link>
                                                                                <Link
                                                                                    className="dropdown-item"
                                                                                    to=""
                                                                                >
                                                                                    <ImageWithBasePath
                                                                                        src="assets/img/profiles/avatar-15.jpg"
                                                                                        alt="img"
                                                                                        className="avatar-xs"
                                                                                    />
                                                                                    Peter
                                                                                </Link>
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
                                    </div>
                                </div>
                                {/* /Activities */}
                                {/* Notes */}
                                <div className="tab-pane active show" id="notes">
                                    <div className="card">
                                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                                            <h4 className="fw-semibold">Notes</h4>
                                            <div className="d-inline-flex align-items-center">
                                                <div className="form-sort me-3 mt-0">
                                                    <i className="ti ti-sort-ascending-2" />
                                                    <Select
                                                        className="select dropdownCusWidth"
                                                        options={ascendingandDecending}
                                                        placeholder="Sort By Date"
                                                        classNamePrefix="react-select"
                                                        onChange={(selectedOption) => {
                                                            if (selectedOption) {
                                                                setSortOrder(selectedOption.value)
                                                            }
                                                            else {
                                                                setSortOrder(null)
                                                            }
                                                        }}
                                                    />
                                                </div>

                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="notes-activity">
                                                <form>
                                                    <div className="row">
                                                        <div className="mb-3 col-md-8">
                                                            <label className="col-form-label">
                                                                Note <span className="text-danger"> *</span>
                                                            </label>
                                                            <textarea
                                                                className="form-control"
                                                                rows={3}
                                                                defaultValue={''}
                                                            />
                                                        </div>
                                                        <div className="mb-3 my-auto col-md-4">
                                                            {contactedToday && <div className="row">
                                                                <div className="col-md-6">
                                                                    <div className="mb-3">
                                                                        <label className="col-form-label">Due Date</label>
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
                                                                <div className="col-md-6">
                                                                    <div className="mb-3">
                                                                        <label className="col-form-label">
                                                                            Due Time
                                                                        </label>
                                                                        <div className="icon-form">
                                                                            <span className="form-icon">
                                                                                <i className="ti ti-clock-hour-10" />
                                                                            </span>
                                                                            <TimePicker
                                                                                placeholder="Select Time"
                                                                                className="form-control datetimepicker-time"
                                                                                onChange={onChange}
                                                                                defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>}
                                                            <div className="d-flex">
                                                                <div className="form-check me-5">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="contactedOrNot"
                                                                        value="contactedToday"
                                                                        id="flexRadioDefault1"
                                                                        onChange={handleRadioChange}
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="flexRadioDefault1"
                                                                    >
                                                                        Contacted Today
                                                                    </label>
                                                                </div>
                                                                <div className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="contactedOrNot"
                                                                        value="notContacted"
                                                                        id="flexRadioDefault2"
                                                                        onChange={handleRadioChange}
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="flexRadioDefault2"
                                                                    >
                                                                        Not Contacted
                                                                    </label>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <div className="col-lg-12 modal-btn mb-4">
                                                        <button
                                                            className="btn btn-primary"
                                                            data-bs-dismiss="modal"
                                                            type="button"
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                </form>
                                                {sortedNotes.map((note, index) => {
                                                    const isActiveEditor = activeEditorIndex === index;
                                                    return (
                                                        <div className="card mb-3" key={index}>
                                                            <div className="card-body notesBorderLeft"
                                                                onMouseEnter={() => setHoveredNoteIndex(index)}
                                                                onMouseLeave={() => setHoveredNoteIndex(null)}
                                                            >
                                                                <div style={{ position: 'absolute', top: 20, right: 20 }}>
                                                                    {
                                                                        hoveredNoteIndex === index &&
                                                                        <>
                                                                            <Link to=""
                                                                                className="me-3 styleForEditBtn"
                                                                                data-bs-toggle="modal"
                                                                                data-bs-target="#add_notes"
                                                                                onClick={() => { handleNoteEditClick(note) }}
                                                                            >
                                                                                <i className="ti ti-edit text-blue" />
                                                                            </Link>
                                                                            <Link to="" className="styleForDeleteBtn"
                                                                                data-bs-toggle="modal"
                                                                                data-bs-target={`#delete_${deleteModalText}`}
                                                                                onClick={() => {
                                                                                    setDeleteModalText("note")
                                                                                    setIndexToDelete(index)
                                                                                }}
                                                                            >
                                                                                <i className="ti ti-trash text-danger" />
                                                                            </Link>
                                                                        </>
                                                                    }
                                                                </div>

                                                                {
                                                                    note.isContacted === true ? <div className="mb-3">
                                                                        <span className={`badge badge-soft-success fw-medium`}>
                                                                            <MdPhoneInTalk className="me-2" />
                                                                            Contacted
                                                                        </span>
                                                                    </div> :
                                                                        <div className="mb-3">
                                                                            <span className={`badge badge-soft-danger fw-medium`}>
                                                                                <FaPhoneSlash className="me-2" />
                                                                                Not Contacted
                                                                            </span>
                                                                        </div>
                                                                }
                                                                <p className="mb-3">
                                                                    {note.noteText}{" "}
                                                                </p>

                                                                <div>
                                                                    <p>✎  <span className="fw-medium text-black ms-2">Modified by Jessica on </span> <span>{note.lastModified}{' '}</span></p>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    )
                                                })}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* /Notes */}
                                {/* Tasks */}
                                <div className="tab-pane fade" id="tasks">
                                    <div className="card">
                                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                                            <h4 className="fw-semibold mb-0">Tasks</h4>
                                            <div className="d-inline-flex align-items-center">
                                                <div className="form-sort me-3 mt-0">
                                                    <i className="ti ti-sort-ascending-2" />
                                                    <Select
                                                        className="select dropdownCusWidth"
                                                        options={ascendingandDecending}
                                                        placeholder="Sort By Date"
                                                        classNamePrefix="react-select"
                                                        onChange={(selectedOption) => {
                                                            if (selectedOption) {
                                                                setSortOrderIncompleteTask(selectedOption.value);
                                                            } else {
                                                                setSortOrderIncompleteTask(null);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <Link
                                                    to=""
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#add_tasks"
                                                    className="link-purple fw-medium"
                                                    onClick={() => {
                                                        setSelectedTask(null)
                                                    }}
                                                >
                                                    <i className="ti ti-circle-plus me-1" />
                                                    Add New
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="card-body">

                                            <div className="notes-activity">
                                                {sortedIncompleteTask.filter(task => task.isCompleted === 'false').map((task, taskIndex) => {
                                                    return (
                                                        <div className="card mb-3" key={taskIndex}>
                                                            <div className="card-body"
                                                                onMouseEnter={() => setHoveredTaskIndex(taskIndex)}
                                                                onMouseLeave={() => setHoveredTaskIndex(null)}
                                                            >
                                                                <div className="d-flex align-items-center justify-content-between pb-2">

                                                                    {hoveredTaskIndex === taskIndex && <div style={{ position: 'absolute', top: 20, right: 20 }}>
                                                                        <Link to="" className="styleForDoneBtn me-3">
                                                                            <IoMdDoneAll />
                                                                        </Link>
                                                                        <Link to=""
                                                                            className="styleForEditBtn me-3"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#add_tasks"
                                                                            onClick={() => { handleTaskEditClick(task) }}
                                                                        >
                                                                            <i className="ti ti-edit text-blue" />
                                                                        </Link>
                                                                        <Link to="" className="styleForDeleteBtn"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target={`#delete_${deleteModalText}`}
                                                                            onClick={() => {
                                                                                setDeleteModalText("task")
                                                                                setIndexToDelete(taskIndex)
                                                                            }}
                                                                        >
                                                                            <i className="ti ti-trash text-danger" />
                                                                        </Link>
                                                                    </div>
                                                                    }
                                                                </div>
                                                                <div className="col-md-11 mb-3">
                                                                    {task.taskType == "Follow Up" ? <p className={`badge badge-soft-warning fw-medium me-2`}>
                                                                        <FaCalendarAlt className="me-2" />
                                                                        {task.taskType}
                                                                    </p> :
                                                                        <p className={`badge badge-soft-info fw-medium me-2`}>
                                                                            <FaRegBell className="me-2" />
                                                                            {task.taskType}
                                                                        </p>
                                                                    }
                                                                    <p>
                                                                        {task.description}
                                                                    </p>
                                                                </div>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p className="mb-0">✎  <span className="fw-medium text-black ms-2">Modified by Jessica on </span> <span>{task.dateCreated}{' '}</span></p>
                                                                    <p><span className="fw-medium text-black">Due date :</span> <span>{task.dateCreated}{' '}</span></p>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    )
                                                })}

                                            </div>
                                        </div>
                                    </div>
                                    {/* for completed task */}
                                    <div className="card">
                                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                                            <h4 className="fw-semibold mb-0">Completed Tasks</h4>
                                            <div className="d-inline-flex align-items-center">
                                                <div className="form-sort me-3 mt-0">
                                                    <i className="ti ti-sort-ascending-2" />
                                                    <Select
                                                        className="select dropdownCusWidth"
                                                        options={ascendingandDecending}
                                                        placeholder="Sort By Date"
                                                        classNamePrefix="react-select"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="notes-activity">
                                                {sortedCompletedTask.filter(task => task.isCompleted === 'true').map((task, taskCompletedIndex) => {
                                                    return (
                                                        <div className="card mb-3" key={taskCompletedIndex}>
                                                            <div className="card-body"
                                                                onMouseEnter={() => setHoveredTaskCompletedIndex(taskCompletedIndex)}
                                                                onMouseLeave={() => setHoveredTaskCompletedIndex(null)}
                                                            >
                                                                <div className="d-flex align-items-center justify-content-between pb-2">
                                                                    {hoveredTaskCompletedIndex === taskCompletedIndex && <div style={{ position: 'absolute', top: 20, right: 20 }}>
                                                                        <Link to="" className="styleForNotDoneBtn me-3">
                                                                            <MdOutlineRemoveDone />
                                                                        </Link>
                                                                        <Link to=""
                                                                            className="styleForEditBtn me-3"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#add_tasks"
                                                                            onClick={() => { handleTaskEditClick(task) }}
                                                                        >
                                                                            <i className="ti ti-edit text-blue" />
                                                                        </Link>
                                                                        <Link to="" className="styleForDeleteBtn"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target={`#delete_${deleteModalText}`}
                                                                            onClick={() => {
                                                                                setDeleteModalText("task")
                                                                                setIndexToDelete(taskCompletedIndex)
                                                                            }}
                                                                        >
                                                                            <i className="ti ti-trash text-danger" />
                                                                        </Link>
                                                                    </div>
                                                                    }
                                                                </div>
                                                                <div className="col-md-11 mb-3">
                                                                    {task.taskType == "Follow Up" ?
                                                                        <div className="mb-3">
                                                                            <span className={`badge badge-soft-warning fw-medium me-2`}>
                                                                                <FaCalendarAlt className="me-2" />
                                                                                {task.taskType}
                                                                            </span>
                                                                            <span className={`badge badge-soft-success fw-medium`}>
                                                                                <FaCalendarAlt className="me-2" />
                                                                                Completed
                                                                            </span>
                                                                        </div>
                                                                        :
                                                                        <div className="mb-3">
                                                                            <span className={`badge badge-soft-info fw-medium me-2`}>
                                                                                <FaRegBell className="me-2" />
                                                                                {task.taskType}
                                                                            </span>
                                                                            <span className={`badge badge-soft-success fw-medium`}>
                                                                                <MdDownloadDone className="me-2" />
                                                                                Completed
                                                                            </span>
                                                                        </div>
                                                                    }
                                                                    <p>
                                                                        {task.description}
                                                                    </p>
                                                                </div>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p className="mb-0">✎  <span className="fw-medium text-black ms-2">Modified by Jessica on </span> <span>{task.dueDate}{' '}{task.dueTime && <span>{task.dueTime}</span>}</span></p>
                                                                    <p><span className="fw-medium text-black">Due date :</span> <span>{task.dueDate}{' '}{task.dueTime && <span>{task.dueTime}</span>}</span></p>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    )
                                                })}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* /Tasks */}
                                {/* Meeting */}
                                <div className="tab-pane fade" id="meeting">
                                    <div className="card">
                                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                                            <h4 className="fw-semibold mb-0">Meeting</h4>
                                            <div className="d-inline-flex align-items-center">
                                                <div className="form-sort me-3 mt-0">
                                                    <i className="ti ti-sort-ascending-2" />
                                                    <Select
                                                        className="select dropdownCusWidth"
                                                        options={ascendingandDecending}
                                                        placeholder="Sort By Date"
                                                        classNamePrefix="react-select"
                                                    />
                                                </div>
                                                <Link
                                                    to=""
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#add_meeting"
                                                    className="link-purple fw-medium"
                                                    onClick={() => {
                                                        setSelectedMeeting(null)
                                                        setSelectedMeetingType(null)
                                                    }}
                                                >
                                                    <i className="ti ti-circle-plus me-1" />
                                                    Add New
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="notes-activity">
                                                {allMeetings.map((meeting, meetingIndex) => {
                                                    return (
                                                        <div className="card mb-3" key={meetingIndex}>
                                                            <div className="card-body"
                                                                onMouseEnter={() => setHoveredMeetingIndex(meetingIndex)}
                                                                onMouseLeave={() => setHoveredMeetingIndex(null)}
                                                            >
                                                                <div className="d-flex align-items-center justify-content-between pb-2">

                                                                    {hoveredMeetingIndex === meetingIndex && <div style={{ position: 'absolute', top: 20, right: 20 }}>
                                                                        <Link to=""
                                                                            className="me-3 styleForEditBtn"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#add_meeting"
                                                                            onClick={() => { handleMeetingEditClick(meeting) }}
                                                                        >
                                                                            <i className="ti ti-edit text-blue" />
                                                                        </Link>
                                                                        <Link to="" className="styleForDeleteBtn"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target={`#delete_${deleteModalText}`}
                                                                            onClick={() => {
                                                                                setDeleteModalText("meeting")
                                                                                setIndexToDelete(meetingIndex)
                                                                            }}
                                                                        >
                                                                            <i className="ti ti-trash text-danger" />
                                                                        </Link>
                                                                    </div>}
                                                                </div>
                                                                <div className="col-md-11 mb-3">
                                                                    {meeting.meetingType == "Online" ? <p className={`badge badge-soft-black fw-medium me-2`}>
                                                                        <RiVideoOnLine className="me-2" />
                                                                        {meeting.meetingType}
                                                                    </p> :
                                                                        <p className={`badge badge-soft-warning fw-medium me-2`}>
                                                                            <IoLocationSharp className="me-2" />
                                                                            {meeting.meetingType}
                                                                        </p>
                                                                    }
                                                                    <p className="fw-medium text-black">
                                                                        {meeting.title}
                                                                    </p>
                                                                    <p>
                                                                        {meeting.description}
                                                                    </p>
                                                                </div>


                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p className="mb-0">✎  <span className="fw-medium text-black ms-2">Created by Jessica on </span> <span>{meeting.createdOnDate}{' '}{meeting.createdOnTime && <span>{meeting.createdOnTime}</span>}</span></p>
                                                                    <p>
                                                                        <span className="fw-medium text-black">Meeting time :</span> {meeting.startDate} {meeting.startTime}
                                                                    </p>

                                                                </div>

                                                            </div>
                                                        </div>
                                                    )
                                                })}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* /Meeting */}
                                {/* Attachment */}
                                <div className="tab-pane fade" id="attachment">
                                    <div className="card">
                                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                                            <h4 className="fw-semibold mb-0">Attachment</h4>
                                        </div>
                                        <div className="card-body">
                                            <div className="uploadSectionContainer">
                                                <div
                                                    {...getRootProps()}
                                                    className={`uploadSectionInnerBox ${isDragActive ? "drag-active" : ""}`}
                                                >
                                                    <input {...getInputProps()} />
                                                    <div className="uploadSectionImageBox">
                                                        <FcUpload style={{ fontSize: 30 }} />
                                                    </div>
                                                    <div className="profile-upload d-block">
                                                        <div className="profile-upload-content">
                                                            <label className="profile-upload-btn">
                                                                <i className="ti ti-file-broken" /> Upload File
                                                            </label>
                                                            {isDragActive ? (
                                                                <p>Drop the files here ...</p>
                                                            ) : (
                                                                <p>Drag 'n' drop Excel or CSV files here, or click to select them</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="supportedFormat">
                                                        (Supported formats .csv, .xlsx; max file size 5 MB)
                                                    </p>

                                                </div>
                                            </div>
                                            {uploadedFiles.length > 0 && (
                                                <div className="uploaded-files">
                                                    <h4>Uploaded Files:</h4>
                                                    <ul>
                                                        {uploadedFiles.map((file, index) => (
                                                            <li key={index}>{file.name}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* /Attachment */}
                                {/* Calls */}
                                <div className="tab-pane fade" id="calls">
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
                                                                    placeholder="Search Calls"
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
                                                                                        Call Status
                                                                                    </Link>
                                                                                </div>
                                                                                <div
                                                                                    className="filter-set-contents accordion-collapse collapse"
                                                                                    id="Status"
                                                                                    data-bs-parent="#accordionExample"
                                                                                >
                                                                                    <div className="filter-content-list">
                                                                                        <ul>
                                                                                            {callStatus.map((callStatus, index) => {
                                                                                                return (
                                                                                                    <li
                                                                                                        key={index}

                                                                                                    >
                                                                                                        <div className="filter-checks" >
                                                                                                            <label className="checkboxs" >
                                                                                                                <input
                                                                                                                    type="checkbox"
                                                                                                                    checked={selectedCallStatus.includes(callStatus.value.toLowerCase())}
                                                                                                                    onChange={() => filterCallStatus(callStatus.value.toLowerCase())}
                                                                                                                />
                                                                                                                <span className="checkmarks" />
                                                                                                                {callStatus.value}
                                                                                                            </label>
                                                                                                        </div>
                                                                                                    </li>
                                                                                                );
                                                                                            })}

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
                                                                                        Employee
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
                                                                                                                        checked={selectedEmployee.includes(companyEmployee.value.toLowerCase())}
                                                                                                                        onChange={() => filterLeadEmployee(companyEmployee.value.toLowerCase())}
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
                                                                                    <div
                                                                                        className="status-toggle"

                                                                                    >
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
                                                            {/* <Link
                                  to=""
                                  className="btn btn-primary me-2"
                                  data-bs-toggle="offcanvas"
                                  data-bs-target="#offcanvas_add"
                                  onClick={() => {
                                    setSelectedLead(null)
                                  }}
                                >
                                  <i className="ti ti-square-rounded-plus me-2" />
                                  Add Leads
                                </Link> */}
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
                                                <div className="col-sm-8">
                                                    <div className="d-flex align-items-center flex-wrap row-gap-2 justify-content-sm-end">

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="table-responsive custom-table">
                                                <Table
                                                    dataSource={filteredCallData}
                                                    columns={visibleColumns}
                                                    rowKey={(record) => record.key}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* /Calls */}
                                {/* Quotation */}
                                <div className="tab-pane fade" id="quotation">
                                    <div className="card">
                                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                                            <h4 className="fw-semibold mb-0">Quotation</h4>
                                            <div className="d-inline-flex align-items-center">
                                                {/* <div className="form-sort me-3 mt-0">
                            <i className="ti ti-sort-ascending-2" />
                            <Select
                              className="select dropdownCusWidth"
                              options={ascendingandDecending}
                              placeholder="Sort By Date"
                              classNamePrefix="react-select"
                            />
                          </div> */}
                                                {!showQuotationViewForm &&
                                                    <div
                                                        // to=""
                                                        style={{ cursor: 'pointer' }}
                                                        // data-bs-toggle="modal"
                                                        // data-bs-target="#add_quotation"
                                                        className="link-purple fw-medium"
                                                        onClick={() => {
                                                            // setSelectedMeeting(null)
                                                            // setSelectedMeetingType(null)
                                                            setShowQuotationForm(true)
                                                            setSelectedQuotation(null)
                                                            setSelectedQuotationProduct(null)
                                                            setAddedQuotationEntries([])

                                                        }}
                                                    >
                                                        <i className="ti ti-circle-plus me-1" />
                                                        Add New
                                                    </div>
                                                }
                                                {showQuotationViewForm && <div className="dropdown me-2">
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
                                                                    onClick={exportToPDF}
                                                                >
                                                                    <i className="ti ti-file-type-pdf text-danger me-1" />
                                                                    Export as PDF
                                                                </Link>
                                                            </li>
                                                            {/* <li>
                                        <Link
                                          to="#"
                                          className="dropdown-item"
                                          onClick={exportExcel}
                                        >
                                          <i className="ti ti-file-type-xls text-green me-1" />
                                          Export as Excel{" "}
                                        </Link>
                                      </li> */}
                                                        </ul>
                                                    </div>
                                                </div>}
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            {!showQuotationForm ? <div className="table-responsive custom-table">
                                                <Table
                                                    dataSource={filteredQuotationData}
                                                    columns={visibleQuotationColumns}
                                                    rowKey={(record) => record.key}
                                                />
                                            </div>
                                                : showQuotationViewForm
                                                    ?
                                                    <>

                                                        <div ref={contentRef} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                            {/* 2x2 Grid for draggable containers */}
                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '20px', width: '100%' }}>

                                                                {/* First Container */}
                                                                <div ref={containerRefs[0]} style={{ cursor: 'grab' }}>

                                                                    <div style={{ width: 200, height: 'auto' }} className="mb-3"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBwzaOHjVPsPvedzhKqhNXT7QJ_ru2GGTkCA&s"
                                                                        alt="" crossOrigin="anonymous"
                                                                    /></div>
                                                                </div>


                                                                {/* Second Container */}
                                                                <div ref={containerRefs[1]} style={{ cursor: 'grab' }}>
                                                                    <div className="mb-3"><b>{selectedViewQuotation ? selectedViewQuotation.estimationsId : "No ID Selected"}</b></div>
                                                                    <div className="mb-3">
                                                                        <b>Ship to:</b>
                                                                        <p className="mb-0">Burjuman</p>
                                                                        <p className="mb-0">Burjuman</p>
                                                                        <p className="mb-0">Dubai, Dubai</p>
                                                                        <p className="mb-0">AE 00000</p>
                                                                    </div>
                                                                </div>
                                                                {/* Third Container */}
                                                                <div ref={containerRefs[2]} style={{ cursor: 'grab' }}>

                                                                    <div className="mb-3">
                                                                        <b>To,</b>
                                                                        <p className="mb-0">California Media</p>
                                                                        <p className="mb-0">Burjuman</p>
                                                                        <p className="mb-0">Dubai, Dubai</p>
                                                                        <p className="mb-0">AE 00000</p>
                                                                    </div>
                                                                </div>

                                                                {/* Forth Container */}
                                                                <div ref={containerRefs[3]} style={{ cursor: 'grab' }}>
                                                                    <div className="mb-3">
                                                                        <p className="mb-0"><b>Estimate Date:</b> 2024-10-17</p>
                                                                        <p className="mb-0"><b>Expiry Date:</b> 2024-10-17</p>
                                                                        <p className="mb-0"><b>Sale Agent:</b> Waqar Ansari</p>
                                                                    </div>
                                                                </div>


                                                            </div>

                                                            {/* Draggable table (full width below the grid) */}
                                                            <div>
                                                                <table ref={tableRef} className="w-100 quotation-calc-table my-3">
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
                                                            {/* <div className="col-md-6">
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
                              </div> */}
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
                                                            {haveShippingAddress && <div className="col-md-6 mb-3">
                                                                <h4>Ship to</h4>
                                                                <p className="mb-0">Burjuman</p>
                                                                <p className="mb-0">Dubai</p>
                                                                <p className="mb-0">AE, 00000</p>
                                                            </div>}
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-md-6 mb-3">
                                                                <label className="col-form-label">Estimate Date</label>
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
                                </div>
                                {/* /Quotation */}
                                {/* Invoice */}
                                <div className="tab-pane fade" id="invoice">
                                    <div className="card">
                                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                                            <h4 className="fw-semibold mb-0">Invoice</h4>
                                            <div className="d-inline-flex align-items-center">
                                                {/* <div className="form-sort me-3 mt-0">
                            <i className="ti ti-sort-ascending-2" />
                            <Select
                              className="select dropdownCusWidth"
                              options={ascendingandDecending}
                              placeholder="Sort By Date"
                              classNamePrefix="react-select"
                            />
                          </div> */}
                                                {!showInvoiceViewForm &&
                                                    <div
                                                        // to=""
                                                        style={{ cursor: 'pointer' }}
                                                        // data-bs-toggle="modal"
                                                        // data-bs-target="#add_quotation"
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
                                                    </div>
                                                }
                                                {showInvoiceViewForm && <div className="dropdown me-2">
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
                                                            {/* <li>
                                        <Link
                                          to="#"
                                          className="dropdown-item"
                                          onClick={exportExcel}
                                        >
                                          <i className="ti ti-file-type-xls text-green me-1" />
                                          Export as Excel{" "}
                                        </Link>
                                      </li> */}
                                                        </ul>
                                                    </div>
                                                </div>}
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
                                </div>
                                {/* /Invoice */}
                                {/* Credit Notes */}
                                <div className="tab-pane fade" id="creditNotes">
                                    <div className="card">
                                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                                            <h4 className="fw-semibold mb-0">Credit Notes</h4>
                                            <div className="d-inline-flex align-items-center">
                                                {!showCreditNotesViewForm &&
                                                    <div
                                                        style={{ cursor: 'pointer' }}
                                                        className="link-purple fw-medium"
                                                        onClick={() => {
                                                            setShowCreditNotesForm(true)
                                                            setSelectedCreditNotes(null)
                                                            setSelectedCreditNotesProduct(null)
                                                            setAddedCreditNotesEntries([])
                                                        }}
                                                    >
                                                        <i className="ti ti-circle-plus me-1" />
                                                        Add New
                                                    </div>
                                                }
                                                {showCreditNotesViewForm && <div className="dropdown me-2">
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
                                                                    onClick={creditNotesExportToPDF}
                                                                >
                                                                    <i className="ti ti-file-type-pdf text-danger me-1" />
                                                                    Export as PDF
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>}
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            {!showCreditNotesForm ? <div className="table-responsive custom-table">
                                                <Table
                                                    dataSource={filteredCreditNotesData}
                                                    columns={visibleCreditNotesColumns}
                                                    rowKey={(record) => record.key}
                                                />
                                            </div>
                                                : showCreditNotesViewForm
                                                    ?
                                                    <>
                                                        <div ref={creditNotesContentRef} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                            {/* 2x2 Grid for draggable containers */}
                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '20px', width: '100%' }}>
                                                                {/* First Container */}
                                                                <div ref={creditNotesContainerRefs[0]} style={{ cursor: 'grab' }}>

                                                                    <div style={{ width: 200, height: 'auto' }} className="mb-3"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBwzaOHjVPsPvedzhKqhNXT7QJ_ru2GGTkCA&s"
                                                                        alt="" crossOrigin="anonymous"
                                                                    /></div>
                                                                </div>
                                                                {/* Second Container */}
                                                                <div ref={creditNotesContainerRefs[1]} style={{ cursor: 'grab' }}>
                                                                    <div className="mb-3"><b>{selectedViewCreditNotes ? selectedViewCreditNotes.creditNotesId : "No ID Selected"}</b></div>
                                                                    <div className="mb-3">
                                                                        <b>Ship to:</b>
                                                                        <p className="mb-0">Burjuman</p>
                                                                        <p className="mb-0">Burjuman</p>
                                                                        <p className="mb-0">Dubai, Dubai</p>
                                                                        <p className="mb-0">AE 00000</p>
                                                                    </div>
                                                                </div>
                                                                {/* Third Container */}
                                                                <div ref={creditNotesContainerRefs[2]} style={{ cursor: 'grab' }}>
                                                                    <div className="mb-3">
                                                                        <b>To,</b>
                                                                        <p className="mb-0">California Media</p>
                                                                        <p className="mb-0">Burjuman</p>
                                                                        <p className="mb-0">Dubai, Dubai</p>
                                                                        <p className="mb-0">AE 00000</p>
                                                                    </div>
                                                                </div>
                                                                {/* Forth Container */}
                                                                <div ref={creditNotesContainerRefs[3]} style={{ cursor: 'grab' }}>
                                                                    <div className="mb-3">
                                                                        <p className="mb-0"><b>Date:</b> 2024-10-17</p>
                                                                        <p className="mb-0"><b>Expiry Date:</b> 2024-10-17</p>
                                                                        <p className="mb-0"><b>Sale Agent:</b> Waqar Ansari</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* Draggable table (full width below the grid) */}
                                                            <div>
                                                                <table ref={creditNotesTableRef} className="w-100 quotation-calc-table my-3">
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
                                                                        value={""}
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
                                                            {haveCreditNotesShippingAddress && <div className="col-md-6 mb-3">
                                                                <h4>Ship to</h4>
                                                                <p className="mb-0">Burjuman</p>
                                                                <p className="mb-0">Dubai</p>
                                                                <p className="mb-0">AE, 00000</p>
                                                            </div>}
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6 mb-3">
                                                                <label className="col-form-label">Date</label>
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
                                                                            value={selectedCreditNotesProduct ? selectedCreditNotesProduct.quotationName : ""}
                                                                            onChange={handleQuotationProductInputChange}
                                                                            type="text" />
                                                                    </td>
                                                                    <td style={{ width: 250 }}>
                                                                        <textarea
                                                                            className="form-control"
                                                                            rows={4}
                                                                            name="quotationDescription"
                                                                            value={selectedCreditNotesProduct ? selectedCreditNotesProduct.quotationDescription : ""}
                                                                            onChange={(e) => { }}
                                                                        />
                                                                    </td>
                                                                    <td style={{ width: 100 }}>
                                                                        <input className="form-control"
                                                                            name="quotationQuantity"
                                                                            value={creditNotesQuantity}
                                                                            onChange={(e) => { }}
                                                                            type="number" />
                                                                        <p className="text-end">Unit</p>
                                                                    </td>
                                                                    <td style={{ width: 100 }}>
                                                                        <input className="form-control"
                                                                            name="quotationRate"
                                                                            value={selectedCreditNotesProduct ? selectedCreditNotesProduct.rate : ""}
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
                                                                    <td>{quotationQuantity && selectedCreditNotesProduct ? (quotationQuantity * selectedCreditNotesProduct.rate) : ""}</td>

                                                                    <td style={{ width: 50 }}>
                                                                        <button
                                                                            className="btn btn-success"
                                                                            type="button"
                                                                            onClick={() => {
                                                                                handleAddQuotationEntry(selectedCreditNotesProduct)
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
                                                            addedCreditNotesEntries.length > 0 && (
                                                                <table className="w-100 quotation-calc-table mt-3" >
                                                                    <tbody ref={tableBodyRef}>
                                                                        {addedCreditNotesEntries.map((entry, index) => (
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
                                                                                        onChange={(e) => { }}
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
                                                                                <td>{entry ? (addedCreditNotesEntries[index].quantity * entry.rate) : ""}</td>
                                                                                <td style={{ width: 50 }}>
                                                                                    <button
                                                                                        className="btn btn-primary"
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            // handleDeleteCreditNotesEntry(index)
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
                                </div>
                                {/* /Credit Notes */}
                                {/* Tickets */}
                                <div className="tab-pane fade" id="tickets">
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

                                                                            {/* <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                          <Link
                                            to=""
                                            className="collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#owner"
                                            aria-expanded="false"
                                            aria-controls="owner"
                                          >
                                            Employee
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
                                                            checked={selectedEmployee.includes(companyEmployee.value.toLowerCase())}
                                                            onChange={() => filterLeadEmployee(companyEmployee.value.toLowerCase())}
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
                                      </div> */}
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
                                                                        {/* <li>
                                      <Link
                                        to=""
                                        className="dropdown-item"
                                        onClick={exportExcel}
                                      >
                                        <i className="ti ti-file-type-xls text-green me-1" />
                                        Export as Excel{" "}
                                      </Link>
                                    </li> */}
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
                                </div>
                                {/* /Tickets */}
                                {/* Payments */}
                                <div className="tab-pane fade" id="payments">
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
                                {/* /Payments */}
                            </div>
                            {/* /Tab Content*/}
                        </div>
                        {/* /Contact Details */}
                    </div>
                </div>
            </div>
            {/* /Page Wrapper */}
            {/* Add Edit Quotation Address */}
            <div
                className="modal custom-modal fade modal-padding"
                id="add_quotationAddress"
                role="dialog"
                aria-hidden="true"
                aria-labelledby="add_quotationAddressLabel"
                tabIndex={-1}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{selectedMeeting ? "Edit Address" : "Add new Address"}</h5>
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
                                <div className="filter-checks mb-2">
                                    <label className="checkboxs">
                                        <input
                                            type="checkbox"
                                            checked={haveShippingAddress}
                                            onChange={() => { }}
                                        />
                                        <span className="checkmarks" />
                                        Shipping Address
                                    </label>
                                </div>
                                <div className="filter-checks mb-2">
                                    <label className="checkboxs">
                                        <input
                                            type="checkbox"
                                        // checked={haveShippingAddress}
                                        // onChange={handleHaveShippingAddress}
                                        />
                                        <span className="checkmarks" />
                                        Show shipping details
                                    </label>
                                </div>
                                <div className="row">
                                    <div className={haveShippingAddress ? "col-md-6" : "col-md-12"}>
                                        <h4>Bill to</h4>
                                        <div className="mb-3">
                                            <label className="col-form-label">
                                                Street
                                            </label>
                                            <input className="form-control"
                                                name="meetingTitle"
                                                value={""}
                                                onChange={(e) => { }}
                                                type="text" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="col-form-label">
                                                City
                                            </label>
                                            <input className="form-control"
                                                name="meetingTitle"
                                                value={""}
                                                onChange={(e) => { }}
                                                type="text" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="col-form-label">
                                                State
                                            </label>
                                            <input className="form-control"
                                                name="meetingTitle"
                                                value={""}
                                                onChange={(e) => { }}
                                                type="text" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="col-form-label">
                                                Zip Code
                                            </label>
                                            <input className="form-control"
                                                name="meetingTitle"
                                                value={""}
                                                onChange={(e) => { }}
                                                type="text" />
                                        </div>
                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">Country</label>
                                            </div>
                                            <Select
                                                className="select"
                                                options={countryoptions1}
                                                classNamePrefix="react-select"
                                            />
                                        </div>
                                    </div>
                                    {haveShippingAddress && <div className="col-md-6">
                                        <h4>Ship to</h4>
                                        <div className="mb-3">
                                            <label className="col-form-label">
                                                Street
                                            </label>
                                            <input className="form-control"
                                                name="meetingTitle"
                                                value={""}
                                                onChange={(e) => { }}
                                                type="text" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="col-form-label">
                                                City
                                            </label>
                                            <input className="form-control"
                                                name="meetingTitle"
                                                value={""}
                                                onChange={(e) => { }}
                                                type="text" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="col-form-label">
                                                State
                                            </label>
                                            <input className="form-control"
                                                name="meetingTitle"
                                                value={""}
                                                onChange={(e) => { }}
                                                type="text" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="col-form-label">
                                                Zip Code
                                            </label>
                                            <input className="form-control"
                                                name="meetingTitle"
                                                value={""}
                                                onChange={(e) => { }}
                                                type="text" />
                                        </div>
                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">Country</label>
                                            </div>
                                            <Select
                                                className="select"
                                                options={countryoptions1}
                                                classNamePrefix="react-select"
                                            />
                                        </div>
                                    </div>}
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
                                        // data-bs-toggle="modal"
                                        // data-bs-target="#add_quotation"
                                        type="button"
                                    >
                                        Save changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add Edit Quotation Address */}
            {/* Create Deal */}
            <div
                className="modal custom-modal fade"
                id="create_success"
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header border-0 m-0 justify-content-end">
                            <button
                                className="btn-close"
                                data-bs-dismiss="modal"
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
                                <h3>Deal Created Successfully!!!</h3>
                                <p>View the details of deal, created</p>
                                <div className="col-lg-12 text-center modal-btn">
                                    <Link
                                        to=""
                                        className="btn btn-light"
                                        data-bs-dismiss="modal"
                                    >
                                        Cancel
                                    </Link>
                                    <Link
                                        to={route.contactDetails}
                                        data-bs-dismiss="modal"
                                        className="btn btn-primary"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Create Deal */}
            {/* Add Note */}
            <div
                className="modal custom-modal fade modal-padding"
                id="add_notes"
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add New Notes</h5>
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
                            <form action={route.contactDetails}>
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Title <span className="text-danger"> *</span>
                                    </label>
                                    <input className="form-control" type="text" />
                                </div>
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Note <span className="text-danger"> *</span>
                                    </label>
                                    <textarea
                                        className="form-control"
                                        rows={4}
                                        defaultValue={""}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Attachment <span className="text-danger"> *</span>
                                    </label>
                                    <div className="drag-attach">
                                        <input type="file" />
                                        <div className="img-upload">
                                            <i className="ti ti-file-broken" />
                                            Upload File
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="col-form-label">Uploaded Files</label>
                                    <div className="upload-file">
                                        <h6>Projectneonals teyys.xls</h6>
                                        <p>4.25 MB</p>
                                        <div className="progress">
                                            <div
                                                className="progress-bar bg-success"
                                                role="progressbar"
                                                style={{ width: "25%" }}
                                                aria-valuenow={25}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                            />
                                        </div>
                                        <p className="black-text">45%</p>
                                    </div>
                                    <div className="upload-file upload-list">
                                        <div>
                                            <h6>tes.txt</h6>
                                            <p>4.25 MB</p>
                                        </div>
                                        <Link to="" className="text-danger">
                                            <i className="ti ti-trash-x" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-lg-12 text-end modal-btn">
                                    <Link
                                        to=""
                                        className="btn btn-light"
                                        data-bs-dismiss="modal"
                                    >
                                        Cancel
                                    </Link>
                                    <button className="btn btn-primary" type="submit">
                                        Confirm
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add Note */}
            {/* Create Call Log */}
            <div
                className="modal custom-modal fade modal-padding"
                id="create_call"
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Create Call Log</h5>
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
                            <form action={route.contactDetails}>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <label className="col-form-label">
                                                Status <span className="text-danger"> *</span>
                                            </label>
                                            <Select
                                                className="select2"
                                                options={statusList}
                                                placeholder="Choose"
                                                classNamePrefix="react-select"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="col-form-label">
                                                Follow Up Date <span className="text-danger"> *</span>
                                            </label>
                                            <div className="icon-form">
                                                <span className="form-icon">
                                                    <i className="ti ti-calendar-check" />
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control datetimepicker"
                                                    placeholder=""
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="col-form-label">
                                                Note <span className="text-danger"> *</span>
                                            </label>
                                            <textarea
                                                className="form-control"
                                                rows={4}
                                                placeholder="Add text"
                                                defaultValue={""}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" /> Create a followup task
                                            </label>
                                        </div>
                                        <div className="text-end modal-btn">
                                            <Link
                                                to=""
                                                className="btn btn-light"
                                                data-bs-dismiss="modal"
                                            >
                                                Cancel
                                            </Link>
                                            <button className="btn btn-primary" type="submit">
                                                Confirm
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Create Call Log */}
            {/* Add File */}
            <div
                className="modal custom-modal fade custom-modal-two modal-padding"
                id="new_file"
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Create New File</h5>
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
                            <div className="add-info-fieldset">
                                <div className="add-details-wizard">
                                    <ul className="progress-bar-wizard">
                                        <li className="active">
                                            <span>
                                                <i className="ti ti-file" />
                                            </span>
                                            <div className="multi-step-info">
                                                <h6>Basic Info</h6>
                                            </div>
                                        </li>
                                        <li>
                                            <span>
                                                <i className="ti ti-circle-plus" />
                                            </span>
                                            <div className="multi-step-info">
                                                <h6>Add Recipient</h6>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <fieldset id="first-field-file">
                                    <form action={route.contactDetails}>
                                        <div className="contact-input-set">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="mb-3">
                                                        <label className="col-form-label">
                                                            Choose Deal <span className="text-danger">*</span>
                                                        </label>
                                                        <Select
                                                            className="select2"
                                                            options={dealsopen}
                                                            placeholder="Choose"
                                                            classNamePrefix="react-select"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="col-form-label">
                                                            Document Type{" "}
                                                            <span className="text-danger">*</span>
                                                        </label>
                                                        <Select
                                                            className="select2"
                                                            options={documentType}
                                                            placeholder="Choose"
                                                            classNamePrefix="react-select"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="col-form-label">
                                                            Owner <span className="text-danger">*</span>
                                                        </label>
                                                        <SelectWithImage2 />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="col-form-label">
                                                            Title <span className="text-danger"> *</span>
                                                        </label>
                                                        <input className="form-control" type="text" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="col-form-label">
                                                            Locale <span className="text-danger">*</span>
                                                        </label>
                                                        <Select
                                                            className="select2"
                                                            options={LocaleData}
                                                            placeholder="Choose"
                                                            classNamePrefix="react-select"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="signature-wrap">
                                                        <h4>Signature</h4>
                                                        <ul className="nav sign-item">
                                                            <li className="nav-item">
                                                                <span
                                                                    className=" mb-0"
                                                                    data-bs-toggle="tab"
                                                                    data-bs-target="#nosign"
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        className="status-radio"
                                                                        id="sign1"
                                                                        name="email"
                                                                    />
                                                                    <label htmlFor="sign1">
                                                                        <span className="sign-title">
                                                                            No Signature
                                                                        </span>
                                                                        This document does not require a signature
                                                                        before acceptance.
                                                                    </label>
                                                                </span>
                                                            </li>
                                                            <li className="nav-item">
                                                                <span
                                                                    className="active mb-0"
                                                                    data-bs-toggle="tab"
                                                                    data-bs-target="#use-esign"
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        className="status-radio"
                                                                        id="sign2"
                                                                        name="email"
                                                                        defaultChecked
                                                                    />
                                                                    <label htmlFor="sign2">
                                                                        <span className="sign-title">
                                                                            Use e-signature
                                                                        </span>
                                                                        This document require e-signature before
                                                                        acceptance.
                                                                    </label>
                                                                </span>
                                                            </li>
                                                        </ul>
                                                        <div className="tab-content">
                                                            <div
                                                                className="tab-pane show active"
                                                                id="use-esign"
                                                            >
                                                                <div className="input-block mb-0">
                                                                    <label className="col-form-label">
                                                                        Document Signers{" "}
                                                                        <span className="text-danger">*</span>
                                                                    </label>
                                                                </div>
                                                                <div className="sign-content">
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            <div className="mb-3">
                                                                                <input
                                                                                    className="form-control"
                                                                                    type="text"
                                                                                    placeholder="Enter Name"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <div className="d-flex align-items-center">
                                                                                <div className="float-none mb-3 me-3 w-100">
                                                                                    <input
                                                                                        className="form-control"
                                                                                        type="text"
                                                                                        placeholder="Email Address"
                                                                                    />
                                                                                </div>
                                                                                <div className="input-btn mb-3">
                                                                                    <Link to="" className="add-sign">
                                                                                        <i className="ti ti-circle-plus" />
                                                                                    </Link>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="input-block mb-3">
                                                        <label className="col-form-label">
                                                            Content <span className="text-danger"> *</span>
                                                        </label>
                                                        <textarea
                                                            className="form-control"
                                                            rows={3}
                                                            placeholder="Add Content"
                                                            defaultValue={""}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 text-end form-wizard-button modal-btn">
                                                    <button className="btn btn-light" type="reset">
                                                        Reset
                                                    </button>
                                                    <button
                                                        className="btn btn-primary wizard-next-btn"
                                                        type="button"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </fieldset>
                                <fieldset>
                                    <form action={route.contactDetails}>
                                        <div className="contact-input-set">
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <div className="signature-wrap">
                                                        <h4 className="mb-2">
                                                            Send the document to following signers
                                                        </h4>
                                                        <p>In order to send the document to the signers</p>
                                                        <div className="input-block mb-0">
                                                            <label className="col-form-label">
                                                                Recipients (Additional recipients)
                                                            </label>
                                                        </div>
                                                        <div className="sign-content">
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <div className="mb-3">
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            placeholder="Enter Name"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="float-none mb-3 me-3 w-100">
                                                                            <input
                                                                                className="form-control"
                                                                                type="text"
                                                                                placeholder="Email Address"
                                                                            />
                                                                        </div>
                                                                        <div className="input-btn mb-3">
                                                                            <Link to="" className="add-sign">
                                                                                <i className="ti ti-circle-plus" />
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="mb-3">
                                                        <label className="col-form-label">
                                                            Message Subject{" "}
                                                            <span className="text-danger"> *</span>
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            placeholder="Enter Subject"
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="col-form-label">
                                                            Message Text{" "}
                                                            <span className="text-danger"> *</span>
                                                        </label>
                                                        <textarea
                                                            className="form-control"
                                                            rows={3}
                                                            placeholder="Your document is ready"
                                                            defaultValue={""}
                                                        />
                                                    </div>
                                                    <button className="btn btn-light mb-3">
                                                        Send Now
                                                    </button>
                                                    <div className="send-success">
                                                        <p>
                                                            <i className="ti ti-circle-check" /> Document sent
                                                            successfully to the selected recipients
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 text-end form-wizard-button modal-btn">
                                                    <button className="btn btn-light" type="reset">
                                                        Cancel
                                                    </button>
                                                    <button
                                                        className="btn btn-primary"
                                                        type="button"
                                                        data-bs-dismiss="modal"
                                                    >
                                                        Save &amp; Next
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add File */}
            {/* Connect Account */}
            <div className="modal custom-modal fade" id="create_email" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Connect Account</h5>
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
                            <div className="mb-3">
                                <label className="col-form-label">
                                    Account type <span className="text-danger"> *</span>
                                </label>
                                <Select
                                    className="select2"
                                    options={accountType}
                                    placeholder="Choose"
                                    classNamePrefix="react-select"
                                />
                            </div>
                            <div className="mb-3">
                                <h5 className="form-title">Sync emails from</h5>
                                <div className="sync-radio">
                                    <div className="radio-item">
                                        <input
                                            type="radio"
                                            className="status-radio"
                                            id="test1"
                                            name="radio-group"
                                            defaultChecked
                                        />
                                        <label htmlFor="test1">Now</label>
                                    </div>
                                    <div className="radio-item">
                                        <input
                                            type="radio"
                                            className="status-radio"
                                            id="test2"
                                            name="radio-group"
                                        />
                                        <label htmlFor="test2">1 Month Ago</label>
                                    </div>
                                    <div className="radio-item">
                                        <input
                                            type="radio"
                                            className="status-radio"
                                            id="test3"
                                            name="radio-group"
                                        />
                                        <label htmlFor="test3">3 Month Ago</label>
                                    </div>
                                    <div className="radio-item">
                                        <input
                                            type="radio"
                                            className="status-radio"
                                            id="test4"
                                            name="radio-group"
                                        />
                                        <label htmlFor="test4">6 Month Ago</label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12 text-end modal-btn">
                                <Link to="" className="btn btn-light" data-bs-dismiss="modal">
                                    Cancel
                                </Link>
                                <button
                                    className="btn btn-primary"
                                    data-bs-target="#success_mail"
                                    data-bs-toggle="modal"
                                    data-bs-dismiss="modal"
                                >
                                    Connect Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Connect Account */}
            {/* Success Contact */}
            <div className="modal custom-modal fade" id="success_mail" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header border-0 m-0 justify-content-end">
                            <button
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="success-message text-center">
                                <div className="success-popup-icon bg-light-blue">
                                    <i className="ti ti-mail-opened" />
                                </div>
                                <h3>Email Connected Successfully!!!</h3>
                                <p>
                                    Email Account is configured with “example@example.com”. Now
                                    you can access email.
                                </p>
                                <div className="col-lg-12 text-center modal-btn">
                                    <Link to={route.contactDetails} className="btn btn-primary">
                                        Go to email
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Success Contact */}
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
                            <form action={route.contactDetails}>
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
                                                    <Link to="">Darlee Robertson</Link>
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
                                                    <Link to="">Sharon Roy</Link>
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
                                                    <Link to="">Vaughan</Link>
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
                                                    <Link to="">Jessica</Link>
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
                                                    <Link to="">Carol Thomas</Link>
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
                                                    <Link to="">Dawn Mercha</Link>
                                                </span>
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                                <div className="modal-btn text-end">
                                    <Link
                                        to=""
                                        className="btn btn-light"
                                        data-bs-dismiss="modal"
                                    >
                                        Cancel
                                    </Link>
                                    <button type="submit" className="btn btn-primary">
                                        Confirm
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Access */}
            {/* Add Compose */}
            <div className="modal custom-modal fade" id="add_compose" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add Compose</h5>
                            <button
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <div className="modal-body">
                            <form action="">
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        placeholder="To"
                                        className="form-control"
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <input
                                                type="email"
                                                placeholder="Cc"
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <input
                                                type="email"
                                                placeholder="Bcc"
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        placeholder="Subject"
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <DefaultEditor className="summernote" />
                                </div>
                                <div className="mb-3">
                                    <div className="text-center">
                                        <button className="btn btn-primary">
                                            <span>Send</span>
                                            <i className="fa-solid fa-paper-plane ms-1" />
                                        </button>
                                        <button className="btn btn-primary ms-1" type="button">
                                            <span>Draft</span>{" "}
                                            <i className="fa-regular fa-floppy-disk ms-1" />
                                        </button>
                                        <button className="btn btn-primary ms-1" type="button">
                                            <span>Delete</span>{" "}
                                            <i className="fa-regular fa-trash-can ms-1" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add Compose */}
            {/* Add or Edit Contact */}
            <CustomerOffcanvas selectedCustomer={selectedCustomer} />
            {/* /Add or Edit Contact */}
            {/* Add or Edit Offcanvas */}
            <TicketOffcanvas />
            {/* /Add or Edit Offcanvas */}
            {/* Add New Deals */}
            <div
                className="offcanvas offcanvas-end offcanvas-large"
                tabIndex={-1}
                id="offcanvas_add_2"
            >
                <div className="offcanvas-header border-bottom">
                    <h5 className="fw-semibold">Add New Deals</h5>
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
                    <form>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Deal Name <span className="text-danger">*</span>
                                    </label>
                                    <input type="text" className="form-control" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <label className="col-form-label">
                                            Pipeine <span className="text-danger">*</span>
                                        </label>
                                    </div>
                                    <Select
                                        className="select2"
                                        options={salestypelist}
                                        placeholder="Choose"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Status <span className="text-danger">*</span>
                                    </label>
                                    <Select
                                        className="select2"
                                        options={status}
                                        placeholder="Choose"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Deal Value<span className="text-danger"> *</span>
                                    </label>
                                    <input className="form-control" type="text" />
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Currency <span className="text-danger">*</span>
                                    </label>
                                    <Select
                                        className="select2"
                                        options={optionssymbol}
                                        placeholder="Choose"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Period <span className="text-danger">*</span>
                                    </label>
                                    <Select
                                        className="select2"
                                        options={duration}
                                        placeholder="Choose"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Period Value <span className="text-danger">*</span>
                                    </label>
                                    <input className="form-control" type="text" />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Contact <span className="text-danger">*</span>
                                    </label>
                                    <SelectWithImage2 />
                                </div>
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Project <span className="text-danger">*</span>
                                    </label>
                                    <Select
                                        className="select2"
                                        options={project}
                                        defaultValue={tagInputValues}
                                        isMulti
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Due Date <span className="text-danger">*</span>
                                    </label>
                                    <div className="icon-form">
                                        <span className="form-icon">
                                            <i className="ti ti-calendar-check" />
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
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Expected Closing Date <span className="text-danger">*</span>
                                    </label>
                                    <div className="icon-form">
                                        <span className="form-icon">
                                            <i className="ti ti-calendar-check" />
                                        </span>

                                        <DatePicker
                                            className="form-control datetimepicker deals-details"
                                            selected={selectedDate1}
                                            onChange={handleDateChange1}
                                            dateFormat="dd-MM-yyyy"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Assignee <span className="text-danger">*</span>
                                    </label>
                                    <SelectWithImage2 />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Follow Up Date <span className="text-danger">*</span>
                                    </label>
                                    <div className="icon-form">
                                        <span className="form-icon">
                                            <i className="ti ti-calendar-check" />
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
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Source <span className="text-danger">*</span>
                                    </label>

                                    <Select
                                        className="select2"
                                        options={socialMedia}
                                        placeholder="Choose"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Tags <span className="text-danger">*</span>
                                    </label>
                                    <TagsInput
                                        // className="input-tags form-control"
                                        value={owner}
                                        onChange={setOwner}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Priority <span className="text-danger">*</span>
                                    </label>
                                    <Select
                                        className="select2"
                                        options={priorityList}
                                        placeholder="Choose"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Description <span className="text-danger">*</span>
                                    </label>
                                    <DefaultEditor className="summernote" />
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
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => setOpenModal(true)}
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {/* /Add New Deals */}
            {/* Add Company */}
            <div
                className="offcanvas offcanvas-end offcanvas-large"
                tabIndex={-1}
                id="offcanvas_add"
            >
                <div className="offcanvas-header border-bottom">
                    <h5 className="fw-semibold">Add New Company</h5>
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
                    <form>
                        <div className="accordion" id="main_accordion">
                            {/* Basic Info */}
                            <div className="accordion-item rounded mb-3">
                                <div className="accordion-header">
                                    <Link
                                        to=""
                                        className="accordion-button accordion-custom-button bg-white rounded fw-medium text-dark"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#basic"
                                    >
                                        <span className="avatar avatar-md rounded text-dark border me-2">
                                            <i className="ti ti-user-plus fs-20" />
                                        </span>
                                        Basic Info
                                    </Link>
                                </div>
                                <div
                                    className="accordion-collapse collapse show"
                                    id="basic"
                                    data-bs-parent="#main_accordion"
                                >
                                    <div className="accordion-body border-top">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="mb-3">
                                                    <div className="profile-upload">
                                                        <div className="profile-upload-img">
                                                            <span>
                                                                <i className="ti ti-photo" />
                                                            </span>
                                                            <ImageWithBasePath
                                                                src="assets/img/profiles/avatar-20.jpg"
                                                                alt="img"
                                                                className="preview1"
                                                            />
                                                            <button type="button" className="profile-remove">
                                                                <i className="ti ti-x" />
                                                            </button>
                                                        </div>
                                                        <div className="profile-upload-content">
                                                            <label className="profile-upload-btn">
                                                                <i className="ti ti-file-broken" /> Upload File
                                                                <input type="file" className="input-img" />
                                                            </label>
                                                            <p>JPG, GIF or PNG. Max size of 800K</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="mb-3">
                                                    <label className="col-form-label">Company Name</label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="mb-3">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <label className="col-form-label">
                                                            Email <span className="text-danger">*</span>
                                                        </label>
                                                        <div className="status-toggle small-toggle-btn d-flex align-items-center">
                                                            <span className="me-2 label-text">
                                                                Email Opt Out
                                                            </span>
                                                            <input
                                                                type="checkbox"
                                                                id="user"
                                                                className="check"
                                                                defaultChecked
                                                            />
                                                            <label htmlFor="user" className="checktoggle" />
                                                        </div>
                                                    </div>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="col-form-label">
                                                        Phone 1 <span className="text-danger">*</span>
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="col-form-label">Phone 2</label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="col-form-label">
                                                        Fax <span className="text-danger">*</span>
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="col-form-label">
                                                        Website <span className="text-danger">*</span>
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="col-form-label">Ratings</label>
                                                    <div className="icon-form-end">
                                                        <span className="form-icon">
                                                            <i className="ti ti-star" />
                                                        </span>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="4.2"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="fmb-3">
                                                    <label className="col-form-label">Owner</label>
                                                    <SelectWithImage2 />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="col-form-label">Tags </label>
                                                    <input
                                                        className="input-tags form-control"
                                                        type="text"
                                                        data-role="tagsinput"
                                                        name="Label"
                                                        defaultValue="Collab"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <label className="col-form-label">Deals</label>
                                                        <Link
                                                            to=""
                                                            className="label-add"
                                                            data-bs-toggle="offcanvas"
                                                            data-bs-target="#offcanvas_add_2"
                                                        >
                                                            <i className="ti ti-square-rounded-plus" />
                                                            Add New
                                                        </Link>
                                                    </div>
                                                    <Select
                                                        className="select2"
                                                        classNamePrefix="react-select"
                                                        options={dealsopen}
                                                        placeholder="Choose"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="col-form-label">
                                                        Source <span className="text-danger">*</span>
                                                    </label>
                                                    <Select
                                                        className="select2"
                                                        classNamePrefix="react-select"
                                                        options={activities}
                                                        placeholder="Choose"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="col-form-label">
                                                        Industry <span className="text-danger">*</span>
                                                    </label>
                                                    <Select
                                                        className="select2"
                                                        classNamePrefix="react-select"
                                                        options={industries}
                                                        placeholder="Choose"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="mb-3">
                                                    <label className="col-form-label">Contacts</label>
                                                    <Select
                                                        className="select2"
                                                        options={project}
                                                        defaultValue={tagInputValues}
                                                        isMulti
                                                        classNamePrefix="react-select"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="col-form-label">
                                                        Currency <span className="text-danger">*</span>
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="col-form-label">
                                                        Language <span className="text-danger">*</span>
                                                    </label>
                                                    <Select
                                                        className="select2"
                                                        classNamePrefix="react-select"
                                                        options={languages}
                                                        placeholder="Choose"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="mb-0">
                                                    <label className="col-form-label">
                                                        Description <span className="text-danger">*</span>
                                                    </label>
                                                    <textarea
                                                        className="form-control"
                                                        rows={5}
                                                        defaultValue={""}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Basic Info */}
                            {/* Address Info */}
                            <div className="accordion-item border-top rounded mb-3">
                                <div className="accordion-header">
                                    <Link
                                        to=""
                                        className="accordion-button accordion-custom-button rounded bg-white fw-medium text-dark"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#address"
                                    >
                                        <span className="avatar avatar-md rounded text-dark border me-2">
                                            <i className="ti ti-map-pin-cog fs-20" />
                                        </span>
                                        Address Info
                                    </Link>
                                </div>
                                <div
                                    className="accordion-collapse collapse"
                                    id="address"
                                    data-bs-parent="#main_accordion"
                                >
                                    <div className="accordion-body border-top">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="mb-3">
                                                    <label className="col-form-label">
                                                        Street Address{" "}
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="col-form-label">City </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="col-form-label">
                                                        State / Province{" "}
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3 mb-md-0">
                                                    <label className="col-form-label">Country</label>
                                                    <Select
                                                        className="select2"
                                                        classNamePrefix="react-select"
                                                        options={countries}
                                                        placeholder="Choose"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-0">
                                                    <label className="col-form-label">Zipcode </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Address Info */}
                            {/* Social Profile */}
                            <div className="accordion-item border-top rounded mb-3">
                                <div className="accordion-header">
                                    <Link
                                        to=""
                                        className="accordion-button accordion-custom-button rounded bg-white fw-medium text-dark"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#social"
                                    >
                                        <span className="avatar avatar-md rounded text-dark border me-2">
                                            <i className="ti ti-social fs-20" />
                                        </span>
                                        Social Profile
                                    </Link>
                                </div>
                                <div
                                    className="accordion-collapse collapse"
                                    id="social"
                                    data-bs-parent="#main_accordion"
                                >
                                    <div className="accordion-body border-top">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="col-form-label">Facebook</label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="col-form-label">Skype </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="col-form-label">Linkedin </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="col-form-label">Twitter</label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3 mb-md-0">
                                                    <label className="col-form-label">Whatsapp</label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-0">
                                                    <label className="col-form-label">Instagram</label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Social Profile */}
                            {/* Access */}
                            <div className="accordion-item border-top rounded mb-3">
                                <div className="accordion-header">
                                    <Link
                                        to=""
                                        className="accordion-button accordion-custom-button rounded bg-white fw-medium text-dark"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#access-info"
                                    >
                                        <span className="avatar avatar-md rounded text-dark border me-2">
                                            <i className="ti ti-accessible fs-20" />
                                        </span>
                                        Access
                                    </Link>
                                </div>
                                <div
                                    className="accordion-collapse collapse"
                                    id="access-info"
                                    data-bs-parent="#main_accordion"
                                >
                                    <div className="accordion-body border-top">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="mb-3">
                                                    <label className="col-form-label">Visibility</label>
                                                    <div className="d-flex flex-wrap">
                                                        <div className="me-2">
                                                            <input
                                                                type="radio"
                                                                className="status-radio"
                                                                id="public"
                                                                name="visible"
                                                            />
                                                            <label htmlFor="public">Public</label>
                                                        </div>
                                                        <div className="me-2">
                                                            <input
                                                                type="radio"
                                                                className="status-radio"
                                                                id="private"
                                                                name="visible"
                                                            />
                                                            <label htmlFor="private">Private</label>
                                                        </div>
                                                        <div
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#access_view"
                                                        >
                                                            <input
                                                                type="radio"
                                                                className="status-radio"
                                                                id="people"
                                                                name="visible"
                                                            />
                                                            <label htmlFor="people">Select People</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-0">
                                                    <label className="col-form-label">Status</label>
                                                    <div className="d-flex flex-wrap">
                                                        <div className="me-2">
                                                            <input
                                                                type="radio"
                                                                className="status-radio"
                                                                id="active"
                                                                name="status"
                                                                defaultChecked
                                                            />
                                                            <label htmlFor="active">Active</label>
                                                        </div>
                                                        <div>
                                                            <input
                                                                type="radio"
                                                                className="status-radio"
                                                                id="inactive"
                                                                name="status"
                                                            />
                                                            <label htmlFor="inactive">Inactive</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Access */}
                        </div>
                        <div className="d-flex align-items-center justify-content-end">
                            <button
                                type="button"
                                data-bs-dismiss="offcanvas"
                                className="btn btn-light me-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#create_success"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {/* Add Company */}


            {/* Add Edit Task */}
            <div
                className="modal custom-modal fade modal-padding"
                id="add_tasks"
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{selectedTask ? "Edit Task" : "Add new Task"}</h5>
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
                                        Description <span className="text-danger"> *</span>
                                    </label>
                                    <textarea
                                        className="form-control"
                                        rows={4}
                                        name="taskDescription"
                                        defaultValue={selectedTask ? selectedTask.description : ''}
                                        onChange={handleInput}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Task Type
                                    </label>
                                    <Select
                                        className="select2"
                                        options={taskType}
                                        value={selectedTask ? selectedTask.taskType : ''}
                                        placeholder="Choose"
                                        classNamePrefix="react-select"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="col-form-label">Due Date</label>
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

                                <label className="col-form-label">
                                    Due Time {selectedTask ? selectedTask.dueDate : ""}
                                </label>
                                <div className="mb-3 icon-form">
                                    <span className="form-icon">
                                        <i className="ti ti-clock-hour-10" />
                                    </span>
                                    <TimePicker
                                        placeholder="Select Time"
                                        className="form-control datetimepicker-time"
                                        onChange={onChange}
                                        defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
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
                                    >
                                        Save changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add Edit Task */}
            {/* Add Edit Meeting */}
            <div
                className="modal custom-modal fade modal-padding"
                id="add_meeting"
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{selectedMeeting ? "Edit Meeting" : "Add new Meeting"}</h5>
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
                                    <input className="form-control" type="text" />
                                </div>

                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Description <span className="text-danger"> *</span>
                                    </label>
                                    <textarea
                                        className="form-control"
                                        rows={4}
                                        name="taskDescription"
                                        defaultValue={selectedTask ? selectedTask.description : ''}
                                        onChange={handleInput}
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="col-form-label">Start Date</label>
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
                                        <label className="col-form-label">
                                            Start Time {selectedMeeting ? selectedMeeting.startDate : ""}
                                        </label>
                                        <div className="icon-form">
                                            <span className="form-icon">
                                                <i className="ti ti-clock-hour-10" />
                                            </span>
                                            <TimePicker
                                                placeholder="Select Time"
                                                className="form-control datetimepicker-time"
                                                onChange={onChange}
                                                defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="col-form-label">End Date</label>
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
                                        <label className="col-form-label">
                                            End Time {selectedMeeting ? selectedMeeting.endDate : ""}
                                        </label>
                                        <div className="icon-form">
                                            <span className="form-icon">
                                                <i className="ti ti-clock-hour-10" />
                                            </span>
                                            <TimePicker
                                                placeholder="Select Time"
                                                className="form-control datetimepicker-time"
                                                onChange={onChange}
                                                defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Meeting Type
                                    </label>
                                    <Select
                                        className="select2"
                                        options={meetingType}
                                        value={selectedMeetingType ? meetingType.find(option => option.value === selectedMeetingType) : null}
                                        onChange={handleMeetingTypeChange}
                                        placeholder="Choose"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                                {selectedMeetingType === 'Offline' && <div className="mb-3">
                                    <label className="col-form-label">
                                        Location
                                    </label>
                                    <input className="form-control" type="text" />
                                </div>
                                }

                                {selectedMeetingType === 'Online' && <div className="d-flex align-items-center">
                                    <span style={{ background: '#dce8ff', color: '#4a8bff', padding: 8, borderRadius: 5 }} className="me-3">
                                        <ImageWithBasePath src="assets/img/customIcons/zoomIcon.png" className="iconWidth me-2">
                                        </ImageWithBasePath>
                                        <span>
                                            Add Zoom Meeting
                                        </span>
                                    </span>


                                    <span style={{ background: '#dfffec', color: '#00ac48', padding: 8, borderRadius: 5 }}>
                                        <ImageWithBasePath src="assets/img/customIcons/googleMeetIcon.png" className="iconWidth me-2">
                                        </ImageWithBasePath>
                                        <span>
                                            Add Google Meeting
                                        </span>
                                    </span>

                                </div>}



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
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add Edit Meeting */}

            {/* Delete Modal */}
            {<DeleteModal text={deleteModalText} onDelete={() => { handleModalDeleteBtn(deleteModalText) }} onCancel={() => { setDeleteModalText("") }} />}
            {/* /Delete Modal */}

        </>
    );
};

export default ContactDetails;




































functions.php






















    <? php
/**
 * RealHomes Child theme functions.
 *
 * @package realhomes-child
 */

if (!function_exists('inspiry_enqueue_child_styles')) {
    /**
     * Enqueue Styles in Child Theme.
     */
    function inspiry_enqueue_child_styles() {
        if (!is_admin()) {
            // dequeue and deregister parent default css.
            wp_dequeue_style('parent-default');
            wp_deregister_style('parent-default');

            // dequeue parent custom css.
            wp_dequeue_style('parent-custom');

            // parent default css.
            wp_enqueue_style(
                'parent-default',
                get_template_directory_uri(). '/style.css',
                array(),
                '3.12.1'
            );

            // parent custom css.
            wp_enqueue_style('parent-custom');

            // child default css.
            wp_enqueue_style(
                'child-default',
                get_stylesheet_uri(),
                array('parent-default'),
                '1.4.2',
                'all'
            );

            // child custom css.
            wp_enqueue_style(
                'child-custom',
                get_stylesheet_directory_uri(). '/css/child-custom.css',
                array('child-default'),
                '1.4.2',
                'all'
            );

            // child custom js.
            wp_enqueue_script(
                'child-custom',
                get_stylesheet_directory_uri(). '/js/child-custom.js',
                array('jquery'),
                '1.4.2',
                true
            );
        }
    }
}

add_action('wp_enqueue_scripts', 'inspiry_enqueue_child_styles', PHP_INT_MAX);


if (!function_exists('inspiry_load_translation_from_child')) {
    /**
     * Load translation files from child theme.
     */
    function inspiry_load_translation_from_child() {
        load_child_theme_textdomain('framework', get_stylesheet_directory(). '/languages');
    }

    add_action('after_setup_theme', 'inspiry_load_translation_from_child');
}
