import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CreateLeads from "./createleads";
import AddFile from "./addfile";
import ContentAccount from "./createcontent";
import SuccessMail from "./sucessmail";
import Access from "./access";
import AddContent from "./addcontent";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import Select from "react-select";
import { all_routes } from "../../router/all_routes";
import CollapseHeader from "../../../core/common/collapse-header";
import Table from "../../../core/common/dataTable/index";
import { leadsData } from "../../../core/data/json/leads";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import DefaultEditor from "react-simple-wysiwyg";
import { Modal } from "react-bootstrap";
import { FiPlusCircle } from "react-icons/fi";
import CreatableSelect from "react-select/creatable";
import { FcUpload } from "react-icons/fc";
import { useDropzone } from "react-dropzone";
import ContactOffcanvas from "../../../core/common/offCanvas/contact/ContactOffcanvas";
import {
  FaCloudDownloadAlt,
  FaCalendarAlt,
  FaRegBell,
  FaCheck,
  FaEye,
} from "react-icons/fa";
import { SlPeople } from "react-icons/sl";
import { CiEdit, CiPlay1 } from "react-icons/ci";
import { IoLocationSharp } from "react-icons/io5";

import html2canvas from "html2canvas";
import {
  MdDelete,
  MdDownloadDone,
  MdDragHandle,
  MdDragIndicator,
  MdMail,
  MdOutlineRemoveDone,
  MdPhoneInTalk,
} from "react-icons/md";
import { FaPhoneSlash } from "react-icons/fa6";
import { RiVideoOnLine } from "react-icons/ri";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import dragula from "dragula";
import "dragula/dist/dragula.css";
import { IoMdDoneAll, IoMdAttach, IoMdSettings } from "react-icons/io";
import {
  accountType,
  ascendingandDecending,
  callStatus,
  documentType,
  LocaleData,
  statusList,
  taskType,
  owner as companyEmployee,
  all_tags,
  options,
  countryoptions1,
  quotationStatus,
  discountType,
  quotationItems,
  discountOption,
} from "../../../core/common/selectoption/selectoption";
import { SelectWithImage2 } from "../../../core/common/selectWithImage2";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TagsInput } from "react-tag-input-component";
import { FaTasks } from "react-icons/fa";
import { callsData } from "../../../core/data/json/calls";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { utils, writeFile } from "xlsx";
import DeleteModal from "../../../core/common/modals/DeleteModal";
import { estimationListData } from "../../../core/data/json/estimationList";
import { HiEllipsisVertical } from "react-icons/hi2";
import api from "../../../core/axios/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMeeting,
  deleteTask,
  saveContact,
} from "../../../core/data/redux/slices/ContactSlice";
import { addTag } from "../../../core/data/redux/slices/TagSlice";
import { showToast } from "../../../core/data/redux/slices/ToastSlice";
import { gapi } from "gapi-script";
import EmailTemplateModal from "../../../core/common/modals/EmailTemplateModal";
import WhatsappTemplateModal from "../../../core/common/modals/WhatsappTemplateModal";
import AvatarInitialStyles from "../../../core/common/nameInitialStyles/AvatarInitialStyles";
import { GoogleAuthContext } from "../../../core/common/context/GoogleAuthContext";
const route = all_routes;
const allNotes = [
  {
    photo: "assets/img/profiles/avatar-19.jpg",
    name: "California media",
    dateCreated: "15 Sep 2023, 12:10 pm",
    lastModified: "15 Sep 2023, 12:10 pm",
    isContacted: true,
    noteHeading: "Important announcement",
    noteText:
      "A project review evaluates the success of an initiative and identifies areas for improvement. It can also evaluate a current project to determine whether it's on the right track. Or, it can determine the success of a completed project.",
    uploadedFiles: [
      {
        fileName: "Project Specs.xls",
        fileSize: "365 kb",
        fileLogo: "assets/img/media/media-35.jpg",
      },
      {
        fileName: "Project.pdf",
        fileSize: "4 MB",
        fileLogo: "assets/img/media/media-35.jpg",
      },
    ],
  },
  {
    photo: "assets/img/profiles/avatar-19.jpg",
    name: "California media",
    dateCreated: "15 Sep 2023, 12:12 pm",
    lastModified: "15 Sep 2023, 12:10 pm",
    isContacted: false,
    noteHeading: "Not Important announcement",
    noteText:
      "A project review evaluates the success of an initiative and identifies areas for improvement. It can also evaluate a current project to determine whether it's on the right track. Or, it can determine the success of a completed project.",
    noteComments: [
      {
        commentText:
          "The best way to get a project done faster is to start sooner. A goal without a timeline is just a dream.The goal you set must be challenging. At the same time, it should be realistic and attainable, not impossible to reach.",
        commentedBy: "Aeron",
        commentTime: "17 Sep 2023, 12:10 pm",
      },
      {
        commentText:
          "The best way to get a project done faster is to start sooner. A goal without a timeline is just a dream.The goal you set must be challenging. At the same time, it should be realistic and attainable, not impossible to reach.",
        commentedBy: "Aeron",
        commentTime: "17 Sep 2023, 12:10 pm",
      },
    ],
    uploadedFiles: [
      {
        fileName: "Project Specs.xls",
        fileSize: "365 kb",
        fileLogo: "assets/img/media/media-35.jpg",
      },
      {
        fileName: "Project.pdf",
        fileSize: "4 MB",
        fileLogo: "assets/img/media/media-35.jpg",
      },
    ],
  },
];

const meetingType = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
];

export const initialSettings = {
  endDate: new Date("2020-08-11T12:30:00.000Z"),
  ranges: {
    "Last 30 Days": [
      new Date("2020-07-12T04:57:17.076Z"),
      new Date("2020-08-10T04:57:17.076Z"),
    ],
    "Last 7 Days": [
      new Date("2020-08-04T04:57:17.076Z"),
      new Date("2020-08-10T04:57:17.076Z"),
    ],
    "Last Month": [
      new Date("2020-06-30T18:30:00.000Z"),
      new Date("2020-07-31T18:29:59.999Z"),
    ],
    "This Month": [
      new Date("2020-07-31T18:30:00.000Z"),
      new Date("2020-08-31T18:29:59.999Z"),
    ],
    Today: [
      new Date("2020-08-10T04:57:17.076Z"),
      new Date("2020-08-10T04:57:17.076Z"),
    ],
    Yesterday: [
      new Date("2020-08-09T04:57:17.076Z"),
      new Date("2020-08-09T04:57:17.076Z"),
    ],
  },
  startDate: new Date("2020-08-04T04:57:17.076Z"), // Set "Last 7 Days" as default
  timePicker: false,
};

const ContactsDetails = () => {
  const data = leadsData;

  const [leadInfo, setLeadInfo] = useState({});

  const selectedContact = useSelector((state) => state.selectedContact);
  const { tags } = useSelector((state) => state.tags);
  console.log(selectedContact, "selected contact");

  const location = useLocation();
  const { record } = location.state || {};
console.log(leadInfo,"leadingofn");

  useEffect(() => {
    setLeadInfo(selectedContact);
  }, [selectedContact]);

  const [addcomment, setAddComment] = useState(false);
  const [activeEditorIndex, setActiveEditorIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  // const [addTag, setAddTag] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [hoveredNoteIndex, setHoveredNoteIndex] = useState(null);
  const [deleteModalText, setDeleteModalText] = useState("");
  const [hoveredTaskIndex, setHoveredTaskIndex] = useState(null);
  const [editWhatsappTemplateMessage, setEditWhatsappTemplateMessage] =
    useState("");
  const [hoveredMeetingIndex, setHoveredMeetingIndex] = useState(null);
  const [haveShippingAddress, setHaveShippingAddress] = useState(false);
  const [checkMeetingLink, setCheckMeetingLink] = useState(true);
  const [showQuotationViewForm, setShowQuotationViewForm] = useState(false);
  const [newTags, setNewTags] = useState([]);
  const [previousTags, setPreviousTags] = useState([]);
  const [quotationQuantity, setQuotationQuantity] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [selectedDropdownQuotation, setSelectedDropdownQuotation] =
    useState(false);
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [hoveredTaskCompletedIndex, setHoveredTaskCompletedIndex] =
    useState(null);
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const dispatch = useDispatch();
  const addComment = (index) => {
    if (editingIndex === index) {
      setEditingIndex(null);
    } else {
      setEditingIndex(index);
    }
  };

  const togglecomment = () => {
    setAddComment((prevState) => !prevState);
  };
  const [stars, setStars] = useState({});
  const handleQuotationQuantityChange = (index, value) => {
    const newQuantities = [...quotationQuantities];
    newQuantities[index] = value; // Update the specific quantity for the row
    setQuotationQuantities(newQuantities); // Set the updated quantities array
  };
  const initializeStarsState = () => {
    const starsState = {};
    leadsData.forEach((item, index) => {
      starsState[index] = false;
    });
    setStars(starsState);
  };
  useEffect(() => {
    const tagsArrayOfObject = tags.map((tag) => {
      return {
        value: tag.tag,
        label: `${tag.emoji} ${tag.tag}`,
        emoji: tag.emoji,
      };
    });
    setAllTags(tagsArrayOfObject);
  }, []);
  console.log(allTags, "all tagssssdf");

  const [isEditor3, setIsEditor3] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [isEditor2, setIsEditor2] = useState(false);
  const [owner, setOwner] = useState(["Collab", "Rated"]);
  const [editorContent, setEditorContent] = useState("");
  const [isActiveEditor, setIsActiveEditor] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [selectedViewQuotation, setSelectedViewQuotation] = useState(null);
  const [selectedMeetingType, setSelectedMeetingType] = useState(null);
  const [quotationFormData, setQuotationFormData] = useState({
    estimationsId: "",
    client: "",
    amount: "",
    status: "",
    date: new Date(),
    expiryDate: new Date(),
  });
  const [quotationProduct, setQuotationProduct] = useState({
    quotationName: "",
    quotationDescription: "",
    rate: "",
    quantity: "",
    tax: "",
  });
  const [rows, setRows] = useState([
    {
      id: 1,
      description: "Website Design",
      quantity: 4,
      rate: 250,
      tax: "5%",
      amount: 2000,
    },
    {
      id: 2,
      description: "App Development",
      quantity: 2,
      rate: 200,
      tax: "0%",
      amount: 5000,
    },
  ]);
  // useEffect(() => {
  //   const arrayOfObjects = tags.map((tag) => {
  //     return { value: tag.tag, label: tag.tag };
  //   });
  //   setAllTags(arrayOfObjects);
  // }, []);

  const [selectedNote, setSelectedNote] = useState(null);
  const [sortOrder, setSortOrder] = useState("Descending");
  const [sortOrderIncompleteTask, setSortOrderIncompleteTask] =
    useState("Descending");
  const [sortOrderCompletedTask, setSortOrderCompletedTask] =
    useState("Descending");
  const [searchEmployeeInFilter, setSearchEmployeeInFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCallStatus, setSelectedCallStatus] = useState([]);
  const [selectedQuotationProduct, setSelectedQuotationProduct] =
    useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [contactedToday, setContactedToday] = useState(false);
  const [quotationQuantities, setQuotationQuantities] = useState([]);
  const [addedQuotationEntries, setAddedQuotationEntries] = useState([]);
  const { isGoogleSignedIn } = useContext(GoogleAuthContext);
  const [columnVisibility, setColumnVisibility] = useState({
    "": true,
    "Call Id": true,
    "Agent Name": true,
    "Call Type": true,
    "Call Date": true,
    "Call Duration": true,
    "Call Status": true,
    "Next FollowUp": true,
    Recording: true,
  });
  const [quotationColumnVisibility, setQuotationColumnVisibility] = useState({
    "": true,
    "Quotation Id": true,
    Client: true,
    Amount: true,
    Date: true,
    "Expiry Date": true,
    Status: true,
  });
  const [selectedTask, setSelectedTask] = useState(null);

  const [taskFormData, setTaskFormData] = useState({
    task_id: "",
    taskDescription: "",
    taskTitle: "",
    taskType: null,
    dueDate: dayjs(),
    dueTime: dayjs("00:00", "HH:mm"),
  });
  const [meetingFormData, setMeetingFormData] = useState({
    meeting_id: "",
    meetingDescription: "",
    meetingType: "",
    meetingLink: "",
    meetingLocation: "",
    meetingStartDate: dayjs(),
    meetingStartTime: dayjs("00:00:00", "HH:mm:ss"),
    meetingEndDate: dayjs(),
    meetingEndTime: dayjs("00:00:00", "HH:mm:ss"),
  });

  const handleQuotationDropdownEditClick = (record) => {
    setSelectedDropdownQuotation(record);
  };
  const userProfile = useSelector((state) => state.profile);
  const handleQuotationProductInputChange = (e) => {
    const { name, value } = e.target;

    // Update the respective field in the quotationProduct object
    setQuotationProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const handleDeleteTask = () => {
    setDeleteModalText("task");
    const deleteTaskData = {
      contact_id: selectedContact.contact_id,
      task_id: selectedTask.task_id,
    };

    dispatch(deleteTask(deleteTaskData));
  };
  const handleDeleteMeeting = () => {
    setDeleteModalText("meeting");
    const deleteMeetingData = {
      contact_id: selectedContact.contact_id,
      meeting_id: selectedMeeting.meeting_id,
    };

    dispatch(deleteMeeting(deleteMeetingData));
  };
  const exportToPDF = () => {
    const input = contentRef.current;

    // Ensure the input element is present
    if (!input) {
      console.error("Content ref is not set or is null");
      return;
    }

    html2canvas(input, {
      scale: 2,
      allowTaint: true, // Allow tainted images to be drawn to canvas
      useCORS: true,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4"); // Specify orientation, unit, and format

        const imgWidth = 190; // Width of the image in mm
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        position += heightLeft;

        // Add a new page if the content is too long
        while (heightLeft >= pageHeight) {
          position = heightLeft - pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        }

        pdf.save("download.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
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

  const handleTaskInputChange = (name, value) => {
    setTaskFormData({
      ...taskFormData,
      // [name]: name === "taskType" ? value.label : value,
      [name]: value,
    });
  };
  const handleMeetingInputChange = (name, value) => {
    setMeetingFormData({
      ...meetingFormData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (selectedTask) {
      setTaskFormData({
        task_id: selectedTask.task_id,
        taskDescription: selectedTask.taskDescription,
        taskTitle: selectedTask.taskTitle,
        // taskType:
        //   taskType.find((option) => option.value === selectedTask.taskType)
        //     .value || null,
        dueDate: dayjs(selectedTask.taskDueDate),
        dueTime: dayjs(selectedTask.taskDueTime, "HH:mm"),
      });
    } else {
      // Reset form for new task
      setTaskFormData({
        task_id: "",
        taskDescription: "",
        taskTitle: "",
        taskType: null,
        dueDate: dayjs(),
        dueTime: dayjs("00:00:00", "HH:mm:ss"),
      });
    }
  }, [selectedTask]);

  useEffect(() => {
    console.log(selectedMeeting, "selected Meeting details");

    if (selectedMeeting) {
      console.log(selectedMeeting, "selectedmeeting");

      setMeetingFormData({
        meeting_id: selectedMeeting.meeting_id,
        meetingTitle: selectedMeeting.meetingTitle,
        meetingDescription: selectedMeeting.meetingDescription,
        meetingType: selectedMeeting.meetingType,
        meetingLink: selectedMeeting.meetingLink,
        meetingLocation: selectedMeeting.meetingLocation,
        meetingStartDate: dayjs(selectedMeeting.meetingStartDate),
        meetingStartTime: dayjs(selectedMeeting.meetingStartTime, "HH:mm"),
        meetingEndDate: dayjs(selectedMeeting.meetingEndDate),
        meetingEndTime: dayjs(selectedMeeting.meetingEndTime, "HH:mm"),
      });
    } else {
      // Reset form for new task
      setMeetingFormData({
        meeting_id: "",
        meetingTitle: "",
        meetingDescription: "",
        meetingType: "",
        meetingLink: "",
        meetingLocation: "",
        meetingStartDate: dayjs(),
        meetingStartTime: dayjs("00:00:00", "HH:mm:ss"),
        meetingEndDate: dayjs(),
        meetingEndTime: dayjs("00:00:00", "HH:mm:ss"),
      });
    }
  }, [selectedMeeting]);

  useEffect(() => {
    if (selectedQuotation) {
      setQuotationFormData({
        estimationsId: selectedQuotation.estimationsId,
        client: selectedQuotation.client,
        amount: selectedQuotation.amount,
        date: dayjs(selectedQuotation.date),
        expiryDate: dayjs(selectedQuotation.expiryDate),
      });
    } else {
      // Reset form for new task
      setQuotationFormData({
        estimationsId: "",
        client: "",
        amount: "",
        date: dayjs(),
        expiryDate: dayjs(),
      });
    }
  }, [selectedQuotation]);

  const handleQuotationProductChange = (selectedProduct) => {
    setSelectedQuotationProduct(selectedProduct);
  };

  const handleCreateTag = async (inputValue) => {
    console.log(inputValue, "handlecreatetagcalled");

    const newTag = {
      value: inputValue,
      emoji: "🏷️",
      label: `🏷️ ${inputValue}`,
    };
    const tagForApi = { tag: inputValue, emoji: "🏷️" };
    // Optimistically update selectedTags
    const updatedTags = [...selectedTags, newTag];

    setNewTags((prev) => [...prev, inputValue]);
    setSelectedTags(updatedTags);
    setAllTags((prev) => [...prev, newTag]);
    try {
      // First, create the tag
      await dispatch(addTag([tagForApi])).unwrap();
      setNewTags([]);
      // Then, assign the tag to the contact with updated tag list
      const formDataObj = new FormData();
      formDataObj.append(
        "tags",
        JSON.stringify(
          updatedTags.map((tag) => ({ tag: tag.value, emoji: tag.emoji }))
        )
      );
      formDataObj.append("contact_id", selectedContact.contact_id);

      dispatch(saveContact(formDataObj));
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleToggleTaskCompletion = (task) => {
    const formDataObj = new FormData();
    formDataObj.append("contact_id", selectedContact.contact_id);
    formDataObj.append("task_id", task.task_id);
    // formDataObj.append("isCompleted", task.isCompleted ? false : true);
    formDataObj.append("taskIsCompleted", (!task.taskIsCompleted).toString());
    console.log(Object.fromEntries(formDataObj), "form data to be completed");

    dispatch(saveContact(formDataObj));
  };
  const handleTaskSubmit = () => {
    const formDataObj = new FormData();

    formDataObj.append("contact_id", selectedContact.contact_id);

    formDataObj.append("task_id", taskFormData.task_id);
    formDataObj.append("taskDescription", taskFormData.taskDescription);
    formDataObj.append("taskTitle", taskFormData.taskTitle);

    formDataObj.append(
      "taskDueDate",
      taskFormData.dueDate.format("YYYY-MM-DD")
    );
    formDataObj.append("taskDueTime", taskFormData.dueTime.format("HH:mm"));

    dispatch(saveContact(formDataObj));
    setTaskFormData({
      task_id: "",
      taskDescription: "",
      taskTitle: "",
      taskType: null,
      dueDate: dayjs(),
      dueTime: dayjs("00:00", "HH:mm"),
    });
  };

  const handleMeetingSubmit = async () => {
    if (!isGoogleSignedIn) {
      return dispatch(
        showToast({
          message: "Please connect the Google account first",
          variant: "danger",
        })
      );
    }

    const formDataObj = new FormData();
    let finalMeetLink = "";

    if (checkMeetingLink && meetingFormData.meetingLink === "") {
      try {
        console.log("generating link");

        finalMeetLink = await generateGoogleMeetingLink();
      } catch (err) {
        console.error("Failed to generate meeting link:", err);
        return;
      }
    }

    formDataObj.append("contact_id", selectedContact.contact_id);

    formDataObj.append("meeting_id", meetingFormData.meeting_id);
    formDataObj.append("meetingType", meetingFormData.meetingType);
    formDataObj.append("meetingLocation", meetingFormData.meetingLocation);
    formDataObj.append("meetingLink", finalMeetLink);
    formDataObj.append(
      "meetingDescription",
      meetingFormData.meetingDescription
    );
    formDataObj.append("meetingTitle", meetingFormData.meetingTitle);

    formDataObj.append(
      "meetingStartDate",
      meetingFormData.meetingStartDate.format("YYYY-MM-DD")
    );
    formDataObj.append(
      "meetingStartTime",
      meetingFormData.meetingStartTime.format("HH:mm")
    );
    formDataObj.append(
      "meetingEndDate",
      meetingFormData.meetingEndDate.format("YYYY-MM-DD")
    );
    formDataObj.append(
      "meetingEndTime",
      meetingFormData.meetingEndTime.format("HH:mm")
    );
    console.log(
      "object before going to api:",
      Object.fromEntries(formDataObj.entries())
    );

    dispatch(saveContact(formDataObj));

    setMeetingFormData({
      meeting_id: "",
      meetingDescription: "",
      meetingTitle: "",
      meetingType: "",
      meetingStartDate: dayjs(),
      meetingStartTime: dayjs("00:00", "HH:mm"),
      meetingEndDate: dayjs(),
      meetingEndTime: dayjs("00:00", "HH:mm"),
    });
  };

  const handleHaveShippingAddress = (event) => {
    setHaveShippingAddress(event.target.checked);
  };

  const handleTaskEditClick = (task) => {
    setSelectedTask(task);
  };

  const handleNoteEditClick = (note) => {
    setSelectedNote(note);
  };
  const handleMeetingEditClick = (meeting) => {
    setSelectedMeeting(meeting);
  };
  const handleQuotationEditClick = (quotation) => {
    setSelectedQuotation(quotation);
  };

  const currentDateAndTime = new Date();
  const currentDate = currentDateAndTime.toLocaleDateString();
  const currentTime = currentDateAndTime.toLocaleTimeString();

  dayjs.extend(customParseFormat);
  const onChange = (time, timeString) => {};
  const handleRadioChange = (event) => {
    setContactedToday(event.target.value === "contactedToday");
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
  const [openModal, setOpenModal] = useState(false);

  const sortNotes = (notes) => {
    const sortedNotes = [...notes];
    const parseDate = (dateString) => {
      const [day, month, year, time, meridiem] = dateString.split(/[\s,]+/);
      const formattedDate = `${day} ${month} ${year} ${time} ${meridiem}`;
      return new Date(formattedDate).getTime();
    };
    if (sortOrder === "Ascending") {
      sortedNotes.sort(
        (a, b) => parseDate(a.dateCreated) - parseDate(b.dateCreated)
      );
    } else if (sortOrder === "Descending") {
      sortedNotes.sort(
        (a, b) => parseDate(b.dateCreated) - parseDate(a.dateCreated)
      );
    }
    return sortedNotes;
  };

  const sortIncompleteTask = (incompleteTask) => {
    const sortedIncompleteTask = [...incompleteTask];
    const parseDate = (dateString) => {
      // const [day, month, year, time, meridiem] = dateString.split(/[\s,]+/);
      // const formattedDate = `${day} ${month} ${year} ${time} ${meridiem}`;
      // return new Date(formattedDate).getTime();
      if (!dateString) return 0;
      return dayjs(dateString).isValid() ? dayjs(dateString).valueOf() : 0;
    };
    if (sortOrderIncompleteTask === "Ascending") {
      sortedIncompleteTask.sort(
        (a, b) => parseDate(a.dateCreated) - parseDate(b.dateCreated)
      );
    } else if (sortOrderIncompleteTask === "Descending") {
      sortedIncompleteTask.sort(
        (a, b) => parseDate(b.dateCreated) - parseDate(a.dateCreated)
      );
    }
    return sortedIncompleteTask;
  };
  const sortCompletedTask = (completedTask) => {
    const sortedCompletedTask = [...completedTask];
    const parseDate = (dateString) => {
      // const [day, month, year, time, meridiem] = dateString.split(/[\s,]+/);
      // const formattedDate = `${day} ${month} ${year} ${time} ${meridiem}`;
      // return new Date(formattedDate).getTime();
      if (!dateString) return 0;
      return dayjs(dateString).isValid() ? dayjs(dateString).valueOf() : 0;
    };
    if (sortOrderCompletedTask === "Ascending") {
      sortedCompletedTask.sort(
        (a, b) => parseDate(a.dateCreated) - parseDate(b.dateCreated)
      );
    } else if (sortOrderCompletedTask === "Descending") {
      sortedCompletedTask.sort(
        (a, b) => parseDate(b.dateCreated) - parseDate(a.dateCreated)
      );
    }
    return sortedCompletedTask;
  };
  const handleDeleteQuotationEntry = (index) => {
    const updatedQuotationEntries = addedQuotationEntries.filter(
      (_, i) => i !== index
    );
    setAddedQuotationEntries(updatedQuotationEntries);
  };
  console.log(meetingFormData, "meeting form data");

  const generateGoogleMeetingLink = () => {
    return new Promise((resolve, reject) => {
      const combinedStart = dayjs(meetingFormData.meetingStartDate)
        .set("hour", dayjs(meetingFormData.meetingStartTime).hour())
        .set("minute", dayjs(meetingFormData.meetingStartTime).minute())
        .set("second", 0);

      const combinedEnd = dayjs(meetingFormData.meetingEndDate)
        .set("hour", dayjs(meetingFormData.meetingEndTime).hour())
        .set("minute", dayjs(meetingFormData.meetingEndTime).minute())
        .set("second", 0);
      console.log(combinedStart, combinedEnd, "start and end date");

      gapi.client.calendar.events
        .insert({
          calendarId: "primary",
          conferenceDataVersion: 1,
          resource: {
            summary: meetingFormData.meetingTitle,
            start: { dateTime: combinedStart.toISOString() },
            end: { dateTime: combinedEnd.toISOString() },
            conferenceData: {
              createRequest: {
                requestId: "unique-id-" + new Date().getTime(),
                conferenceSolutionKey: { type: "hangoutsMeet" },
              },
            },
          },
        })
        .then((res) => {
          const meetLink = res.result.conferenceData.entryPoints.find(
            (e) => e.entryPointType === "video"
          )?.uri;
          console.log("Google Meet link:", meetLink);
          setMeetingFormData((prevData) => ({
            ...prevData,
            meetingLink: meetLink,
          }));
          resolve(meetLink);
        })
        .catch((err) => {
          reject(err);
          console.error("Error creating event:", err);
        });
    });
  };

  const sortedNotes = sortNotes(allNotes);
  const sortedIncompleteTask = sortIncompleteTask(selectedContact.tasks);
  const sortedCompletedTask = sortCompletedTask(selectedContact.tasks);
  console.log(selectedContact.meetings, "all meetings of selected contacts");
  // const leadInfo = location.state?.record || location.state?.lead || {};
  // Store leadInfo in a state variable

  // Initialize leadInfo when the component mounts or when location.state changes

  const tagsBg = [
    "badge-soft-success",
    "badge-soft-warning",
    "badge-soft-danger",
    "badge-soft-dark",
    "badge-soft-info",
  ];
  const onDrop = useCallback((acceptedFiles) => {
    // Handle the uploaded files here
    setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);
  useEffect(() => {});
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // accept: {
    //   "text/csv": ['.csv'],
    //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ['.xlsx']
    // },
    maxSize: 5242880, // 5MB max file size
    multiple: true,
  });
  // Call Table starts

  const filteredCallData = callsData.filter((calls) => {
    const isAnySearchColumnVisible =
      columnVisibility["Call Id"] || columnVisibility["Agent Name"];

    const matchesSearchQuery =
      !isAnySearchColumnVisible ||
      calls.callId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calls.agentName.toLowerCase().includes(searchQuery.toLowerCase());
    // (columnVisibility["Call Id"] && calls.callId.toLowerCase().includes(searchQuery.toLowerCase())) ||
    // (columnVisibility["Agent Name"] && calls.agentName.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus =
      selectedCallStatus.length === 0 ||
      selectedCallStatus.includes(calls.callStatus.toLowerCase());

    const matchesEmployee =
      selectedEmployee.length === 0 ||
      selectedEmployee.includes(calls.agentName.toLowerCase());

    return matchesSearchQuery && matchesStatus && matchesEmployee;
  });
  const filteredQuotationData = estimationListData.filter((quotation) => {
    const isAnySearchColumnVisible =
      quotationColumnVisibility["Quotation Id"] ||
      quotationColumnVisibility["Client"];

    const matchesSearchQuery =
      !isAnySearchColumnVisible ||
      quotation.estimationsId
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      quotation.client.toLowerCase().includes(searchQuery.toLowerCase());

    // const matchesStatus =
    //   selectedCallStatus.length === 0 ||
    //   selectedCallStatus.includes(calls.callStatus.toLowerCase());

    // const matchesEmployee =
    //   selectedEmployee.length === 0 ||
    //   selectedEmployee.includes(calls.agentName.toLowerCase());

    return matchesSearchQuery;
    //  && matchesStatus && matchesEmployee
  });
  const tableBodyRef = useRef(null);
  useEffect(() => {
    if (tableBodyRef.current) {
      const drake = dragula([tableBodyRef.current], {
        // Only allow dragging when the handle (with class .drag-handle) is clicked
        moves: (el, container, handle) =>
          handle.classList.contains("drag-handle"),
      });

      drake.on("drop", (el, target, source, sibling) => {
        const rows = Array.from(tableBodyRef.current.children);

        setAddedQuotationEntries((prevEntries) => {
          const newOrder = rows.map((row) => {
            const index = row.getAttribute("data-index");
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

  const handleUserTags = (tags) => {
    setSelectedTags(tags);

    const tagsForApi = tags.map((tag) => ({
      tag: tag.value,
      emoji: tag.emoji,
    }));
    const formDataObj = new FormData();

    formDataObj.append("tags", JSON.stringify(tagsForApi));
    formDataObj.append("contact_id", selectedContact.contact_id);

    try {
      if (newTags.length > 0) {
        dispatch(addTag(newTags));
      }
      dispatch(saveContact(formDataObj));

      // setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    const drake = dragula([ViewQuotationTableRef.current]);

    // Event listener for the 'drop' event
    drake.on("drop", (el, target, source, sibling) => {
      // Get the new order of rows
      const newOrder = Array.from(ViewQuotationTableRef.current.children).map(
        (row) => {
          const rowIndex = Array.from(
            ViewQuotationTableRef.current.children
          ).indexOf(row);
          return rows[rowIndex]; // Keep the same data associated with the rows
        }
      );

      // Update the state with the new order
      setRows(newOrder);
    });

    return () => {
      drake.destroy(); // Cleanup on unmount
    };
  }, [rows]);

  const containerRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const tableRef = useRef(null);

  useEffect(() => {
    const allRefsInitialized =
      containerRefs.every((ref) => ref.current !== null) &&
      tableRef.current !== null;

    if (allRefsInitialized) {
      // Initialize Dragula only when all refs are available
      const drake = dragula(
        [...containerRefs.map((ref) => ref.current), tableRef.current],
        {
          moves: (el, container, handle) => {
            // Allow dragging for DIVs in containerRefs and table rows
            return (
              el.tagName === "DIV" || // Allow dragging of containers
              el.tagName === "TR" // Allow dragging of table rows
            );
          },
        }
      );

      // Optional: add event listeners for drag events
      drake.on("drop", (el, target, source, sibling) => {
        console.log("Dropped:", el);
      });

      // Cleanup on component unmount
      return () => {
        drake.destroy();
      };
    }
  }, [containerRefs, tableRef]);

  const filteredEmployees = companyEmployee.filter((employee) =>
    employee.value.toLowerCase().includes(searchEmployeeInFilter.toLowerCase())
  );

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
          <span style={{ color: "#00918E" }} className="me-3">
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
              style={{ color: "#2c5cc5", cursor: "pointer" }}
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
                  setSelectedViewQuotation(record);
                }}
              >
                <FaEye className="text-blue" /> View
              </div>
              <div
                className="dropdown-item cursor-pointer"
                to="#"
                data-bs-toggle="modal"
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

  const visibleColumns = columns.filter(
    (column) => columnVisibility[column.title]
  );
  const visibleQuotationColumns = quotationColumns.filter(
    (column) => quotationColumnVisibility[column.title]
  );
  const filterCallStatus = (callStatus) => {
    setSelectedCallStatus((prevStatus) =>
      prevStatus.includes(callStatus)
        ? prevStatus.filter((status) => status !== callStatus)
        : [...prevStatus, callStatus]
    );
  };
  const resetFilters = () => {
    setSelectedCallStatus([]);
    setSelectedEmployee([]);
    setSearchEmployeeInFilter("");
  };
  const filterLeadEmployee = (leadEmployee) => {
    setSelectedEmployee((prevStatus) =>
      prevStatus.includes(leadEmployee)
        ? prevStatus.filter((employee) => employee !== leadEmployee)
        : [...prevStatus, leadEmployee]
    );
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    const filteredColumns = columns.filter(
      (col) => columnVisibility[col.title] && col.title !== "Recording"
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

  const exportExcel = () => {
    const wb = utils.book_new();

    const filteredColumns = columns.filter(
      (col) => columnVisibility[col.title] && col.title !== "Recording"
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

  const handleToggleColumnVisibility = (columnTitle) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [columnTitle]: !prevVisibility[columnTitle],
    }));
  };
  const handleMeetingTypeChange = (selectedOption) => {
    setSelectedMeetingType(selectedOption ? selectedOption.value : null);
  };

  useEffect(() => {
    if (leadInfo?.tags) {
      // Format the existing tags for CreatableSelect

      const formattedTags = leadInfo.tags.map((tag) => ({
        value: tag.tag,
        label: `${tag.emoji} ${tag.tag}`,
        emoji: tag.emoji,
      }));

      setSelectedTags(formattedTags);
      setPreviousTags(formattedTags);
    }
  }, [leadInfo]);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <>
            <div className="row">
              <div className="col-md-12">
                {/* Leads User */}
                <div className="contact-head">
                  <div className="row align-items-center">
                    <div className="col-sm-6">
                      <ul className="contact-breadcrumb">
                        <li>
                          <Link to={route.contacts}>
                            <i className="ti ti-arrow-narrow-left" />
                            Contacts
                          </Link>
                        </li>
                        <li>{leadInfo.firstname}</li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* <div className="card">
                  <div className="card-body pb-2">
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                      <div className="d-flex align-items-center mb-2">
                        <div className="avatar avatar-xxl me-3 flex-shrink-0 border p-2">
                          <h6 className="text-default fw-medium">HT</h6>
                        </div>
                        <div>
                          <h5 className="mb-1">
                            {leadInfo.lead_name}{" "}
                            <span className="star-icon">
                              <i className="fa-solid fa-star" />
                            </span>
                          </h5>
                          {leadInfo.company_name && (
                            <p className="mb-1">
                              <i className="ti ti-building me-1" />
                              {leadInfo.company_name}
                            </p>
                          )}
                          <p className="mb-0">
                            <i className="ti ti-map-pin-pin me-1" />
                            {leadInfo.company_address}
                          </p>
                        </div>
                      </div>
                      <div className="contacts-action">
                        <span className="badge badge-light">
                          <i className="ti ti-lock" />
                          Private
                        </span>
                        <div className="dropdown mb-2">
                          <Link
                            to="#"
                            className="bg-success text-white py-1 px-2"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Closed
                            <i className="ti ti-chevron-down ms-2" />
                          </Link>
                          <div className="dropdown-menu dropdown-menu-right">
                            <Link className="dropdown-item" to="#">
                              <span>Closed</span>
                            </Link>
                            <Link className="dropdown-item" to="#">
                              <span>Opened</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                {/* /Leads User */}
              </div>
              {/* Leads Sidebar */}
              <ContactOffcanvas selectedContact={selectedContact} />
              <div className="col-xl-3 theiaStickySidebar">
                <div className="card">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0 fw-semibold">Contact Information</h6>
                      <Link
                        to="#"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#contact_offcanvas"
                      >
                        <CiEdit size={20} />
                      </Link>
                    </div>
                    <div style={{ display: "flex" }}>
                      <div className="profilePic">
                        {leadInfo.contactImageURL ? (
                          <img
                            src={
                              leadInfo.contactImageURL
                                ? leadInfo.contactImageURL
                                : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlAMBEQACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAAAgUGAQQHA//EADwQAAEDAwAGBwcCBAcBAAAAAAEAAgMEBREGEiExQVETImFxgZGhBxQyQlLB0bHhI3KCwjNDYpKisvA0/8QAGgEBAAMBAQEAAAAAAAAAAAAAAAEEBQMCBv/EAC4RAAICAgAFAwMDBQEBAAAAAAABAgMEEQUSITFBEzJRImGRcYGxI0Kh0fFDFf/aAAwDAQACEQMRAD8A7igBACAEBjKAjrhe6Ghy2WXWkH+WwZP7LvVjW2dkV7Mmuvuyv1ellQ/IpYGRN4F51ir8OHxXueylPPk/aiInvNxnz0lZLt+k6o9FajjUx7RKssi2XeRpSTyyH+JLI7+ZxK6qEV2Rycm+7PPWI2tcR3L1ojZ6x19ZCcxVc7ccpCvDqrl3ij2rbI9pM36bSi6wfHM2ZvKRo/UYKrzwaZeNfodoZt0fOycoNM6WUhtdC6A/U3rt/Kp2cOnHrB7LlfEIPpNaLJTVMFTE2WnlZJG7c5hyFRlGUHqS0XozjNbi9nsvJ6BACAEAIAQAgBAa1dWwUMJlqZAxvAcSeQHFe4VysfLE8WWRrXNIp910hqazLKcmCE/Ses7vP4WtRhwh1l1Zk3Zk7Okei/yQhV0pikoBCVJApKAUqQKSgFJUgUoQe1FXVVBN0tJM6N3HG53eOK8WVQsWpI912Tre4su1h0sgri2nrdWCoOwHPUf+D2LIycGVf1Q6r/JrY+bGzpPoyzDcqBeMoAQAgBACA0Ltc4bdT68nWedjGDe4/hdqaZXS0jhffGqO2USurp66YzVDsngBuaOQW3VVGuOomLbbKyW5GqSupzEJQCkqSBSeKA9oKKrqhmnpZ5RzZGSPPcvEra4e6SPca5y9sWeslmubBl1BUeDM/ovKyaX2kj26LV/ayPka5ji17XNcN4cMELsmmto5NNPTEJUnkQlSBSUAp3KSC2aLaVGncyiubyYcgRzOO1nIHs7eCzMvCUvrr7/BpYuY4/RPt8l9BBGQsc1jKAEAIDWr6yKhpX1Exw1o3DeTyXuut2S5YniyxVx5pHPrhWy11U6ec9Y7hwaOAC3qqo1x5UYNtjslzM1SV1OYpKAQlSQNBDLUzshgYXyPOA0DevMpxguaXY9Ri5Plj3LtZtGaaka2Wsa2efiHbWN7hx7z6LHvzZz6R6I16MOEOsurLAGgAADAG4BUi7oMBAatfb6Svj1KuBkg4EjaO47wvdds63uL0c7KoWLUkULSPR2W0npoS6WkJ+I/Ew9vZ2raxctXfTLuZGTiOr6l2K+SrpTFJUgUlCBSdgQF20H0hLi211kmTup3uO//AEfhZOfi6/qw/c1MHJ/85/sXgLKNQEBg7kBR9J7l75WGCM5hhJGz5ncT9ls4dHJDmfdmNmXepPlXZfyQhKulMQlAKSpIFJQF20NtjYKT32Ro6WcdXPyt/ff5LGzrnKfIuyNfBo5Yc77ssqol8EAIAQHnPFHNE+KVgfG8Yc08QpTcXtdyJJSWmcovlvNruc1KSS0HLCeLTu/HgvpMe31a1M+evq9KxwI4ldjiKSgFKkGA9zHNexxa5pyHDYQexGk1phNrqjrOi93F4tcc7iOnZ1Jmj6hx8d6+byqPRs5fHg38a71Yb8+SYVcskbf673G2ySNP8R3UZjmf/ZXfGq9S1Ir5Nnp1tnPScbMrfMIUlAISpIFJQGGtMr2xt2F5DR3nYjelslLb0dYhY2JjY2DDWNDQOQC+Zb29n0iWlo9FBIIAQAgA7kBR/aRTgGhqRvOtG7t3Efda3DJe6P7mVxKPWMv2KSStUzBCVIMEoQKSpBYNBbp7he2RPOIar+G7kHfKfPZ4qln0+pVtd0XMK307deGdTByvnjdKdppVF9XDTA9WNmsR2n9h6rX4fDUXP5MrPnuSj8FaJWgZ4pKkgUlAKSpBmGQRTxSO3Me1x8DleZLcWj1F6kmdbbt2hfMn0hlACAEAIAQFK9pUzRT0EOdrnvf5AD+5anDF9UmZnEn0iiiFbBlCkoQKSpAhKkGA9zXB0ZLXtOWuHAo0mtMba6o7ZaaxtwtlNVt2dNG12ORxt9V8rbB12OHwfS1T54KXyUO+zdPd6uTP+YWjuGz7Lbxo8tMUYmRLmukyOJVg4CkoBSVIFJQCE89ylA6TorcRX2qPWcOmhHRyDPLcfEL5/Lp9K1/D7G7iW+pWm+6JlViyCAEAIDB3IDlmmVzFyvL+iIMEA6JhHHG8+f6L6DCp9Orr3ZgZlvqW9OyIElXCqKSpAhKkCkoBSUB072eVzDo6IpHf4Mz2juJ1v7lg8Rg/X38o2uHzXo6+GVeof0k8jz8z3HzK1YLUUjKk9ybPElejyKSpApKAUlSBChBu2a6z2mtE8I1mHZJHnY4flcb6I3R5X+TtRdKmXMjpVsudLc6cTUkgcPmafiaeRCwLaZ1S5ZI3aroWrcWbq5nQEBgnCApel2lTGRyUFrkDpXdWWZhyGjiGnif0Wnh4Tb9SxdDMy8xJclb6lCJ7FsmSKSpAhKkCkoBSUApKkgmbFdzQUskYcRrSF3oB9lVyKPUkmWse704tfc2ndVxbyOF6RyYhKkgUlAKSpApKEG1bbbV3OUx0cRfj4nE4a3vK5W3QqW5M6VUzteoo97lo5c7dCZpoQ+Mb3RHW1e9eKsymx8qfU6W4tta20RlPVT0sonpZnxPG5zDhWJQjNcsls4RnKD5osn6XTe5wtDZmQVAHEgtd5jZ6KjPh1Un0bRdhxC2K+pbPeTT6q1cR0MIPNzyfwvC4ZDzJnp8Sl4iQd00julzYWVFRqRHfHCNVvjxPiVbqxKauqXX7lW3Kts6N/gjqSkqK2dtPSROlldua39TyC7znGC5pvRxhCU3yxW2TFVodeaeAzGGOTAyWRP1neXHwVWHEKJPW9FqWDdGO9FcdkHB4HG1XimKSgFJQCkqSBSUB6wQSTNLmZwDheZSS7nuMXLsWW5M6G4VUZGNWVw9VWqfNXF/Y62rlskvuapK6HMUlSBSdiEG9ZbXLd60QRZbG3bLJj4R+VwyL40Q5mdqKJXS0jplBRQUFMynpWBkbfMnmTxKwLLJWS5pPqb1dca48sexsEZXg9kBdNEbbXOdIxpppT80WMHvG5XKs66tafVFO3Cqse10ZXqjQSta4+71lPI3hrgtP3V2PE4P3RaKkuGz/ALWeDdBrq49aWlaP53H7L2+JUrwzx/8APt+USVDoBEHB1fWvkH0RN1fU5XCfE2/ZH8neHDV/fL8Fqt1so7bF0dFAyJp3kDa7vO8rNstnY9zey/XVCtaijbIyvB0KbppouKuN9wtzAKlu2WNo/wAUc/5v1Wlg5nI1XZ2/gzszF5/rh3Ob5yMhbhjbFJUgUlAISpBetBLQKy0TTPbnNQ4DuDWrJz7nC1JfBqYNSlW2/kbS+n6C+TP3NmaHjywfUL1gz5qUvg5ZsOW5/chCVcKgpKkgw0Oe5rGAlzjgAcSm0lthLb0jqGj1rbareyHAMrhrSu5u/ZfO5FztscvHg+gx6VVWo+SUXA7ggBAGEAYQAgBACAwdyA5Xp9ZRbLkKuBmrTVZJxwY/iPHf5rf4ff6lfI+6/gw86j058y7MqpK0CiISpBgnmgOyaD0bqHRiiY8YfI0yu/qJI9CF8znWepkSf7fg+hw6+SlJ/r+TV07oukoYqxo2wO1XY+l2PvjzXbh1nLNwfk4cQr3BTXgopWyZApKkE5oVRCrvbZHjLKZvSdmtub9z4Kln28lWl5LeFXz27fg6SsI3AQAgBACAEAIAQAgBAQmmNuFy0fqog3Wkjb0sWN+s3aPPaPFWcS30roy/YrZdXqVNHGMg4I3L6c+eMEoDas1A663aloW5xM/Duxo2uPkCud9qqrlP4PdVfqzUfk7sxoYwNYAGtGAOQXye99T6ZISrgjqaaSCVuWSNLSOwr1GThJSXgicVOLi/Jyi40klBWy0s3xxuxn6hwPiF9JVYrIKS8nztlbrm4s1CV0PBa/Z9VRR1dTTSECSVoczPHG8eqzeJwbjGXhGhw+aUnH5L7lY5rggBACAEAIAQAgBACA1LnWQUNBPVVLg2KJhc7PHs7yvdcHZNRj3ZzsmoQcmcHc7WJdjGTnHJfWnzLexCVJB0b2XWbo4pbvO3bKDHBkfL8zvE7PBYnFL9tVLx1Zr8Op0na/Pb9DoCyTUAoCsaZ2Y11MKumbmpgG1oHxs5d44eKv4OR6cuSXZ/yUc3H9SPOu6OeFbiMUGSPikbJG4tewhzXDYQQoaTWmSm09o6JovpRHcmtpqwtjrAMchL2jt7Fh5WHKp80fb/AAbOLlqxcsvcWYKiXgQAgBACAEAIAQGtX1tNQUr6ismbFEwbXOPoOZXqFcrJcsVtnmc4wW5Pocj0t0mmv1RqR60VDG7McZ3uP1O7ezgvo8TEVC2+svP+jAysp3v4S7FeJVwqkrozZJb9c20zMthb1p5B8rPyeH7KvlZCor5n38HfHod8+Xx5O2U8EdNDHDA0MijaGsaNwAXy7k5Pb7s+jUVFaR6qCQQGMDkgKFpjo4adz7jQRnoTtmiaPgP1AcufJa+Dl7/pz7+DJzMXT54dinkrUM0XJByCQRtBG8KQWyx6bTUobBdA6eIbBK3429/P9e9ZuRw5S+qvo/jwaFGe49LOqLvbrnRXKPpKKpjlHEA7W943hZNlU63qS0aldsLFuL2bmQuZ0MoAQGMhADnAAkkADeUGyrXzTe2W5rmUr/fajcGwu6gPa78ZV6jh9tvWXRFK7Orr6R6s5ve75X3ufpa6XLR8ETdjGdw+63KMeFEdRX+zHuvna9zf+iLJXc4mza7dV3euZR0MevK7eTuYPqPILnbbGqPNI911ytlyxO0aO2OmsVvbTU7Q552yykbZHc+7kF8zkZEr580v+H0VFEaYcqJVcDsCAEAIDBAIwUBSNJtDy4vq7Q0ZO19ONmf5fwtXFz9fRb+TLycH++v8FGka6NzmPaWuacFrhggrXWmtoyn0emISpBiOSSJ4fFI9jxucxxBHiEcVJaZKeuqJqk0xvdIA33ps7RwnZreuw+qqTwMefjX6FmGZdHzv9SUh9ola0YmoKd54uZI5vptVd8Lh4kzuuJT8xR6P9pE2OpbI/GY/hQuFR8zPT4m/Ef8AJH1ftBu8uRBFSwA8Q0vI8Scei6x4XSu7bOUuI3Pskiv3G83K5f8A21s8rT8mthn+0bFcqoqq9kdFWy6yz3S2R5K7HLsISpIJXR/R+uv1RqUjNWFpxJO8dRv5PYPRV8jKroW5d/g70Y8739Pb5OuaPWGjsVGIKRuXu2yyu+KQ9vZ2L53IyJ3y5pf8N6iiFMdRJVcDsCAEAIAQAgBAQ970doLyNaoj6OfGBNHsd48/FWKMqyl/S+nwVrsaF3fv8lDu+h11oMvhZ75CPmi+IDtbv8srYpz6rOj6P7mXbhW19uqK28FryxwLXjYWkYIV5NNbRTfR6YhKAUqSBSgEJ7VIME7MoDattpuN1fq2+kknH1NGGj+o7Fzsvrq970e66Z2+1bLzYfZ1HGWzXuUSnf7vESG+Lt58MLJv4o30qWvuzTp4cl1te/sXungipoWwwRMjjYMNYwYACypNye31ZpxSitI9VBIIAQAgBACAEAIAQGCMoDUrrZRV7dWtpYph/raCfNe67bK3uD0c51Qn7lsr1w0Fspjc+FtRB2MlJH/LKu18Rv316lSfD6ddOhSL1ZoKBzhFLM7B+cj7ALUoyJWd0Z11Ea+zZE08LZpdRxIHYrMpaWzhGO3ouVk0Mt1YGunnqzngHtA/6rMuz7YPSSNGrBrl1bZaaHQ+w0Tg6OgZI8fNO4yeh2DwWfZnZFneX46F2GHTDql+epOMY1jQ1jQ1o3ADACqvq+pYQ6EggBACAEAID//Z"
                            }
                            className="profilePic"
                            id="profileImage"
                          />
                        ) : (
                          <AvatarInitialStyles
                            name={leadInfo.firstname + " " + leadInfo.lastname}
                          />
                        )}
                      </div>
                    </div>
                    <div className=" px-2 mb-4 d-flex flex-wrap gap-3 justify-content-start">
                      {leadInfo?.phonenumbers?.length > 0 && (
                        <a
                          href={`tel:${leadInfo?.phonenumbers[0]}`}
                          className="icon-wrapper-sm phone"
                        >
                          <img
                            src="/assets/img/icons/phoneCallIcon.png"
                            alt="Phone"
                          />
                        </a>
                      )}
                      {leadInfo?.emailaddresses?.length > 0 && (
                        <Link
                          data-bs-toggle="modal"
                          data-bs-target="#show_email_templates"
                          className="icon-wrapper-sm mail"
                        >
                          <img
                            src="/assets/img/icons/mailIcon.png"
                            alt="Mail"
                          />
                        </Link>
                      )}
                      {leadInfo?.phonenumbers?.length > 0 && (
                        <Link
                          // to={`https://wa.me/${leadInfo?.phonenumbers?.[0]}`}
                          // target="_blank"
                          data-bs-toggle="modal"
                          data-bs-target="#show_whatsapp_templates"
                          className="icon-wrapper-sm whatsapp no-filter"
                        >
                          <img
                            src="/assets/img/icons/whatsappIcon96.png"
                            alt="WhatsApp"
                          />
                        </Link>
                      )}
                      {leadInfo.instagram && (
                        <Link
                          to={leadInfo.instagram}
                          target="_blank"
                          className="icon-wrapper-sm instagram no-filter"
                        >
                          <img
                            src="/assets/img/icons/instagramIcon.png"
                            alt="Instagram"
                          />
                        </Link>
                      )}
                      {leadInfo.twitter && (
                        <Link
                          to={leadInfo.twitter}
                          target="_blank"
                          className="icon-wrapper-sm twitter no-filter"
                        >
                          <img
                            src="/assets/img/icons/twitterIcon.png"
                            alt="Twitter"
                          />
                        </Link>
                      )}
                      {leadInfo.linkedin && (
                        <Link
                          to={leadInfo.linkedin}
                          target="_blank"
                          className="icon-wrapper-sm linkedin no-filter"
                        >
                          <img
                            src="/assets/img/icons/linkedinIcon.png"
                            alt="LinkedIn"
                          />
                        </Link>
                      )}
                      {leadInfo.facebook && (
                        <Link
                          to={leadInfo.facebook}
                          target="_blank"
                          className="icon-wrapper-sm facebook no-filter"
                        >
                          <img
                            src="/assets/img/icons/facebookIcon.png"
                            alt="Facebook"
                          />
                        </Link>
                      )}
                      {leadInfo.telegram && (
                        <Link
                          to={leadInfo.telegram}
                          target="_blank"
                          className="icon-wrapper-sm telegram no-filter"
                        >
                          <img
                            src="/assets/img/icons/telegramIcon.png"
                            alt="Telegram"
                          />
                        </Link>
                      )}
                    </div>
                    <ul>
                      <div className="row mb-3 d-flex flex-column align-items-center">
                        {leadInfo.company && (
                          <div className="d-flex align-items-center mb-2">
                            <i class="fa-regular fa-building me-2"></i>

                            <span className="col-12 fw-semibold text-black">
                              {leadInfo.company}
                            </span>
                          </div>
                        )}
                        <div className="d-flex align-items-center mb-2">
                          <i class="fa-regular fa-user me-2"></i>
                          <span
                            className={`col-12 ${
                              leadInfo.company == ""
                                ? "fw-semibold text-black"
                                : ""
                            }`}
                          >
                            {leadInfo.firstname} {leadInfo.lastname}
                          </span>
                        </div>
                        {leadInfo.designation && (
                          <div className="d-flex align-items-center mb-2">
                            <i class="fa-solid fa-briefcase me-2"></i>
                            <span className="col-12 fst-italic">
                              {leadInfo.designation}
                            </span>
                          </div>
                        )}
                      </div>
                      {leadInfo?.phonenumbers?.length > 0 && (
                        <li className="row mb-3">
                          <span className="col-12 fw-semibold text-black">
                            Phone
                          </span>
                          {leadInfo?.phonenumbers?.map((number, index) => {
                            return (
                              <div
                                className="d-flex justify-content-between align-items-center"
                                key={index}
                              >
                                <span>{"+" + number}</span>
                              </div>
                            );
                          })}
                        </li>
                      )}
                      {leadInfo?.emailaddresses?.length > 0 && (
                        <li className="row mb-3">
                          <span className="col-12 fw-semibold text-black">
                            Email
                          </span>
                          {leadInfo?.emailaddresses?.map((email, index) => {
                            return (
                              <div
                                className="d-flex align-items-center justify-content-between"
                                key={index}
                              >
                                <span>{email}</span>
                                {/* <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#show_email_templates"
                                  className="link-purple fw-medium action-icon"
                                  title="Email"
                                >
                                  <MdMail />
                                </Link> */}
                              </div>
                            );
                          })}
                        </li>
                      )}

                      <li className="row mb-3">
                        <span className="col-12 fw-semibold text-black">
                          Date Created
                        </span>
                        <span className="col-12">
                          {dayjs(leadInfo.createdAt).format(
                            "DD MMM YYYY, hh:mm A"
                          )}
                        </span>
                      </li>
                    </ul>
                    {/* <h6 className="fw-semibold">Owner</h6>
                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar avatar-md me-2">
                        <img
                          src="assets/img/profiles/avatar-21.jpg"
                          alt="Image"
                        />
                      </div>
                      <p>Vaughan</p>
                    </div> */}
                    <hr />

                    <div className="mb-3">
                      <label className="col-form-label">Tags </label>
                      <CreatableSelect
                        classNamePrefix="react-select"
                        options={allTags}
                        // isLoading={isLoading}
                        value={selectedTags}
                        onChange={(newValue) => handleUserTags(newValue)}
                        onCreateOption={handleCreateTag}
                        className="js-example-placeholder-multiple select2 js-states"
                        isMulti={true}
                        placeholder="Add Tags"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* /Leads Sidebar */}
              {/* Leads Details */}
              <div className="col-xl-9">
                <div className="card mb-3">
                  <div className="card-body pb-0">
                    <ul className="nav nav-tabs nav-tabs-bottom" role="tablist">
                      {/* <li className="nav-item" role="presentation">
                        <Link
                          to="#"
                          data-bs-toggle="tab"
                          data-bs-target="#notes"
                          className="nav-link active"
                        >
                          <i className="ti ti-notes me-1" />
                          Notes
                        </Link>
                      </li> */}
                      <li className="nav-item" role="presentation">
                        <Link
                          to="#"
                          data-bs-toggle="tab"
                          data-bs-target="#tasks"
                          className="nav-link active"
                        >
                          <FaTasks className="me-2" />
                          Notes
                        </Link>
                      </li>
                      <li className="nav-item" role="presentation">
                        <Link
                          to="#"
                          data-bs-toggle="tab"
                          data-bs-target="#meeting"
                          className="nav-link"
                        >
                          <SlPeople className="me-2" />
                          Meeting
                        </Link>
                      </li>
                      {/* <li className="nav-item" role="presentation">
                        <Link
                          to="#"
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
                          to="#"
                          data-bs-toggle="tab"
                          data-bs-target="#attachment"
                          className="nav-link"
                        >
                          <IoMdAttach className="me-2" />
                          Attachment
                        </Link>
                      </li> */}
                      {/* <li className="nav-item" role="presentation">
                        <Link
                          to="#"
                          data-bs-toggle="tab"
                          data-bs-target="#email"
                          className="nav-link"
                        >
                          <i className="ti ti-mail-check me-1" />
                          Email
                        </Link>
                      </li>
                      <li className="nav-item" role="presentation">
                        <Link
                          to="#"
                          data-bs-toggle="tab"
                          data-bs-target="#whatsapp"
                          className="nav-link"
                        >
                          <i className="ti ti-message-circle-share me-1" />
                          Whatsapp
                        </Link>
                      </li> */}
                      {/* <li className="nav-item" role="presentation">
                        <Link
                          to="#"
                          data-bs-toggle="tab"
                          data-bs-target="#activities"
                          className="nav-link"
                        >
                          <i className="ti ti-alarm-minus me-1" />
                          Activities
                        </Link>
                      </li>
                      <li className="nav-item" role="presentation">
                        <Link
                          to="#"
                          data-bs-toggle="tab"
                          data-bs-target="#quotation"
                          className="nav-link"
                          onClick={() => {
                            setShowQuotationForm(false)
                            setShowQuotationViewForm(false)
                          }}
                        >
                          <i className="ti ti-alarm-minus me-1" />
                          Quotation
                        </Link>
                      </li> */}
                    </ul>
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
                                          to="#"
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
                                            to="#"
                                          >
                                            Remainder
                                          </Link>
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            1 hr
                                          </Link>
                                          <Link
                                            className="dropdown-item"
                                            to="#"
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
                                          to="#"
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
                                            to="#"
                                          >
                                            <i className="ti ti-square-rounded-filled me-1 text-danger circle" />
                                            High
                                          </Link>
                                          <Link
                                            className="dropdown-item"
                                            to="#"
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
                                          to="#"
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
                                            to="#"
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
                                            to="#"
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
                  <div className="tab-pane " id="notes">
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
                                  setSortOrder(selectedOption.value);
                                } else {
                                  setSortOrder(null);
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
                                  defaultValue={""}
                                />
                              </div>
                              <div className="mb-3 my-auto col-md-4">
                                {contactedToday && (
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="mb-3">
                                        <label className="col-form-label">
                                          Due Date
                                        </label>
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
                                            defaultOpenValue={dayjs(
                                              "00:00:00",
                                              "HH:mm:ss"
                                            )}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
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
                              <button className="btn btn-primary" type="button">
                                Save
                              </button>
                            </div>
                          </form>
                          {sortedNotes.map((note, index) => {
                            const isActiveEditor = activeEditorIndex === index;
                            return (
                              <div className="card mb-3" key={index}>
                                <div
                                  className="card-body notesBorderLeft"
                                  onMouseEnter={() =>
                                    setHoveredNoteIndex(index)
                                  }
                                  onMouseLeave={() => setHoveredNoteIndex(null)}
                                >
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: 20,
                                      right: 20,
                                    }}
                                  >
                                    {hoveredNoteIndex === index && (
                                      <>
                                        <Link
                                          to="#"
                                          className="me-3 styleForEditBtn"
                                          data-bs-toggle="modal"
                                          data-bs-target="#add_notes"
                                          onClick={() => {
                                            handleNoteEditClick(note);
                                          }}
                                        >
                                          <i className="ti ti-edit text-blue" />
                                        </Link>
                                        <Link
                                          to="#"
                                          className="styleForDeleteBtn"
                                          data-bs-toggle="modal"
                                          data-bs-target={`#delete_${deleteModalText}`}
                                          onClick={() => {
                                            setDeleteModalText("note");
                                          }}
                                        >
                                          <i className="ti ti-trash text-danger" />
                                        </Link>
                                      </>
                                    )}
                                  </div>

                                  {note.isContacted === true ? (
                                    <div className="mb-3">
                                      <span
                                        className={`badge badge-soft-success fw-medium`}
                                      >
                                        <MdPhoneInTalk className="me-2" />
                                        Contacted
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="mb-3">
                                      <span
                                        className={`badge badge-soft-danger fw-medium`}
                                      >
                                        <FaPhoneSlash className="me-2" />
                                        Not Contacted
                                      </span>
                                    </div>
                                  )}
                                  <p className="mb-3">{note.noteText} </p>

                                  <div>
                                    <p>
                                      ✎{" "}
                                      <span className="fw-medium text-black ms-2">
                                        Modified by Jessica on{" "}
                                      </span>{" "}
                                      <span>{note.lastModified} </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Notes */}
                  {/*Add Edit Tasks */}
                  <div className="tab-pane fade active show" id="tasks">
                    <div className="card" style={{ minHeight: 200 }}>
                      <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                        <h4 className="fw-semibold mb-0">Notes</h4>
                        <div className="d-inline-flex align-items-center">
                          {/* <div className="form-sort me-3 mt-0">
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
                          </div> */}
                          <Link
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#add_tasks"
                            className="link-purple fw-medium"
                            onClick={() => {
                              setSelectedTask(null);
                            }}
                          >
                            <i className="ti ti-circle-plus me-1" />
                            Add New
                          </Link>
                        </div>
                      </div>

                      <div className="card-body">
                        <div className="notes-activity">
                          {sortedIncompleteTask.length>0 ?<div>
                            {sortedIncompleteTask
                              .filter((task) => task.taskIsCompleted === false)
                              .map((task, taskIndex) => {
                                return (
                                  <div className="card mb-3" key={taskIndex}>
                                    <div
                                      className="card-body"
                                      onMouseEnter={() =>
                                        setHoveredTaskIndex(taskIndex)
                                      }
                                      onMouseLeave={() =>
                                        setHoveredTaskIndex(null)
                                      }
                                    >
                                      <div className="d-flex align-items-center justify-content-between pb-2">
                                        {hoveredTaskIndex === taskIndex && (
                                          <div
                                            style={{
                                              position: "absolute",
                                              top: 20,
                                              right: 20,
                                            }}
                                          >
                                            <Link
                                              to="#"
                                              className="styleForDoneBtn me-3"
                                              onClick={() => {
                                                handleToggleTaskCompletion(task);
                                              }}
                                            >
                                              <IoMdDoneAll />
                                            </Link>
                                            <Link
                                              to="#"
                                              className="styleForEditBtn me-3"
                                              data-bs-toggle="modal"
                                              data-bs-target="#add_tasks"
                                              onClick={() => {
                                                handleTaskEditClick(task);
                                              }}
                                            >
                                              <i className="ti ti-edit text-blue" />
                                            </Link>
                                            <Link
                                              to="#"
                                              className="styleForDeleteBtn"
                                              data-bs-toggle="modal"
                                              data-bs-target={`#delete_${deleteModalText}`}
                                              onClick={() => {
                                                setDeleteModalText("note");
                                                setSelectedTask(task);
                                              }}
                                            >
                                              <i className="ti ti-trash text-danger" />
                                            </Link>
                                          </div>
                                        )}
                                      </div>
                                      <div className="col-md-11 mb-3">
                                        {/* {task.taskType == "Follow Up" ? ( */}
  
                                        <p
                                          className={`badge badge-soft-warning fw-medium me-2`}
                                        >
                                          {/* <FaCalendarAlt className="me-2" /> */}
                                          {task.taskTitle}
                                        </p>
  
                                        <p>{task.taskDescription}</p>
                                      </div>
                                      <div className="d-flex justify-content-between align-items-center">
                                        <p className="mb-0">
                                          ✎{" "}
                                          <span className="fw-medium text-black ms-2">
                                            Last Modified on{" "}
                                          </span>{" "}
                                          {/* <span>{task.dateCreated} </span> */}
                                          <span>
                                            {dayjs(task.updatedAt).format(
                                              "DD MMM YYYY, hh:mm A"
                                            )}
                                          </span>
                                        </p>
                                        {/* <p>
                                          <span className="fw-medium text-black">
                                            Due date :
                                          </span>{" "}
                                          <span
                                            style={{
                                              color: dayjs(
                                                `${
                                                  task.taskDueDate.split("T")[0]
                                                }T${task.taskDueTime}`
                                              ).isBefore(dayjs())
                                                ? "red"
                                                : "inherit",
                                            }}
                                          >
                                            {dayjs(task.taskDueDate).format(
                                              "DD MMM YYYY"
                                            )}
                                            {", "}
                                            {dayjs(
                                              task.taskDueTime,
                                              "HH:mm"
                                            ).format("hh:mm A")}
                                          </span>
                                        </p> */}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        :
                        <div className="d-flex justify-content-center align-items-center h-100">No Notes available</div>  
                        }
                        </div>
                      </div>
                    </div>
                    {/* for completed task */}
                    <div className="card" style={{ minHeight: 200 }}>
                      <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                        <h4 className="fw-semibold mb-0">Completed Notes</h4>
                        {/* <div className="d-inline-flex align-items-center">
                          <div className="form-sort me-3 mt-0">
                            <i className="ti ti-sort-ascending-2" />
                            <Select
                              className="select dropdownCusWidth"
                              options={ascendingandDecending}
                              placeholder="Sort By Date"
                              classNamePrefix="react-select"
                            />
                          </div>
                        </div> */}
                      </div>
                      <div className="card-body">
                        <div className="notes-activity">
                          {
                            sortedCompletedTask.length>0?
                            <div>
                            {sortedCompletedTask
                              .filter((task) => task.taskIsCompleted === true)
                              .map((task, taskCompletedIndex) => {
                                return (
                                  <div
                                    className="card mb-3"
                                    key={taskCompletedIndex}
                                  >
                                    <div
                                      className="card-body"
                                      onMouseEnter={() =>
                                        setHoveredTaskCompletedIndex(
                                          taskCompletedIndex
                                        )
                                      }
                                      onMouseLeave={() =>
                                        setHoveredTaskCompletedIndex(null)
                                      }
                                    >
                                      <div className="d-flex align-items-center justify-content-between pb-2">
                                        {hoveredTaskCompletedIndex ===
                                          taskCompletedIndex && (
                                          <div
                                            style={{
                                              position: "absolute",
                                              top: 20,
                                              right: 20,
                                            }}
                                          >
                                            <Link
                                              to="#"
                                              className="styleForNotDoneBtn me-3"
                                              onClick={() => {
                                                handleToggleTaskCompletion(task);
                                              }}
                                            >
                                              <MdOutlineRemoveDone />
                                            </Link>
                                            <Link
                                              to="#"
                                              className="styleForEditBtn me-3"
                                              data-bs-toggle="modal"
                                              data-bs-target="#add_tasks"
                                              onClick={() => {
                                                handleTaskEditClick(task);
                                              }}
                                            >
                                              <i className="ti ti-edit text-blue" />
                                            </Link>
                                            <Link
                                              to="#"
                                              className="styleForDeleteBtn"
                                              data-bs-toggle="modal"
                                              data-bs-target={`#delete_${deleteModalText}`}
                                              onClick={() => {
                                                setDeleteModalText("note");
                                                setSelectedTask(task);
                                              }}
                                            >
                                              <i className="ti ti-trash text-danger" />
                                            </Link>
                                          </div>
                                        )}
                                      </div>
                                      <div className="col-md-11 mb-3">
                                        {task.taskType == "Follow Up" ? (
                                          <div className="mb-3">
                                            <span
                                              className={`badge badge-soft-warning fw-medium me-2`}
                                            >
                                              <FaCalendarAlt className="me-2" />
                                              {task.taskType}
                                            </span>
                                            <span
                                              className={`badge badge-soft-success fw-medium`}
                                            >
                                              <FaCalendarAlt className="me-2" />
                                              Completed
                                            </span>
                                          </div>
                                        ) : (
                                          <div className="mb-3">
                                            <span
                                              className={`badge badge-soft-info fw-medium me-2`}
                                            >
                                              <FaRegBell className="me-2" />
                                              {task.taskTitle}
                                            </span>
                                            <span
                                              className={`badge badge-soft-success fw-medium`}
                                            >
                                              <MdDownloadDone className="me-2" />
                                              Completed
                                            </span>
                                          </div>
                                        )}
                                        <p>{task.taskDescription}</p>
                                      </div>
                                      <div className="d-flex justify-content-between align-items-center">
                                        <p className="mb-0">
                                          ✎{" "}
                                          <span className="fw-medium text-black ms-2">
                                            Last Modified on{" "}
                                          </span>{" "}
                                          <span>
                                            {/* {task.taskDueDate}{" "}
                                            {task.taskDueTime && (
                                              <span>{task.taskDueTime}</span>
                                            )} */}
                                            <span>
                                              {dayjs(task.updatedAt).format(
                                                "DD MMM YYYY, hh:mm A"
                                              )}
                                            </span>
                                          </span>
                                        </p>
                                        {/* <p>
                                          <span className="fw-medium text-black">
                                            Due date :
                                          </span>{" "}
                                          <span>
                                            {dayjs(task.taskDueDate).format(
                                              "DD MMM YYYY"
                                            )}
                                            {", "}
                                            {dayjs(
                                              task.taskDueTime,
                                              "HH:mm"
                                            ).format("hh:mm A")}
                                          </span>
                                        </p> */}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>:
                          <div className="d-flex justify-content-center align-items-center h-100">No Notes available</div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Add Edit Tasks */}
                  {/* Meeting */}
                  <div className="tab-pane fade" id="meeting">
                    <div className="card">
                      <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                        <h4 className="fw-semibold mb-0">Meeting</h4>
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
                          <Link
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#add_meeting"
                            className="link-purple fw-medium"
                            onClick={() => {
                              setSelectedMeeting(null);
                              setSelectedMeetingType("");
                              setMeetingFormData({
                                meeting_id: "",
                                meetingDescription: "",
                                meetingType: "",
                                meetingLink: "",
                                meetingLocation: "",
                                meetingStartDate: dayjs(),
                                meetingStartTime: dayjs("00:00:00", "HH:mm:ss"),
                                meetingEndDate: dayjs(),
                                meetingEndTime: dayjs("00:00:00", "HH:mm:ss"),
                              });
                            }}
                          >
                            <i className="ti ti-circle-plus me-1" />
                            Add New
                          </Link>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="notes-activity">
                          {selectedContact.meetings.map(
                            (meeting, meetingIndex) => {
                              return (
                                <div className="card mb-3" key={meetingIndex}>
                                  <div
                                    className="card-body"
                                    onMouseEnter={() =>
                                      setHoveredMeetingIndex(meetingIndex)
                                    }
                                    onMouseLeave={() =>
                                      setHoveredMeetingIndex(null)
                                    }
                                  >
                                    <div className="d-flex align-items-center justify-content-between pb-2">
                                      {hoveredMeetingIndex === meetingIndex && (
                                        <div
                                          style={{
                                            position: "absolute",
                                            top: 20,
                                            right: 20,
                                          }}
                                        >
                                          <Link
                                            to="#"
                                            className="me-3 styleForEditBtn"
                                            data-bs-toggle="modal"
                                            data-bs-target="#add_meeting"
                                            onClick={() => {
                                              handleMeetingEditClick(meeting);
                                            }}
                                          >
                                            <i className="ti ti-edit text-blue" />
                                          </Link>
                                          <Link
                                            to="#"
                                            className="styleForDeleteBtn"
                                            data-bs-toggle="modal"
                                            data-bs-target={`#delete_${deleteModalText}`}
                                            onClick={() => {
                                              setDeleteModalText("meeting");
                                              setSelectedMeeting(meeting);
                                            }}
                                          >
                                            <i className="ti ti-trash text-danger" />
                                          </Link>
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-md-11 mb-3">
                                      {meeting.meetingType == "online" ? (
                                        <p
                                          className={`badge badge-soft-black fw-medium me-2`}
                                        >
                                          <RiVideoOnLine className="me-2" />
                                          Online
                                        </p>
                                      ) : (
                                        <p
                                          className={`badge badge-soft-warning fw-medium me-2`}
                                        >
                                          <IoLocationSharp className="me-2" />
                                          Offline
                                        </p>
                                      )}
                                      <p className="fw-medium text-black">
                                        {meeting.meetingTitle}
                                      </p>
                                      <p>{meeting.meetingDescription}</p>
                                    </div>

                                    
                                    <div className="d-flex justify-content-between">
                                      <div>
                                        {meeting.meetingType == "online" && (
                                      <div className="d-flex justify-content-end mb-2">
                                        {" "}
                                        <span className="fw-medium text-black me-1">
                                          Meeting Link :
                                        </span>{" "}
                                        <a href={meeting.meetingLink} target="_blank"> {meeting.meetingLink}</a>
                                      </div>
                                    )}
                                      </div>
                                      <div>
                                        
                                        <p className="text-end">
                                          <span className="fw-medium text-black">
                                            Meeting Starts at :
                                          </span>{" "}
                                          <span
                                            style={{
                                              color: dayjs(
                                                `${
                                                  meeting.meetingStartDate.split(
                                                    "T"
                                                  )[0]
                                                }T${meeting.meetingStartTime}`
                                              ).isBefore(dayjs())
                                                ? "red"
                                                : "inherit",
                                            }}
                                          >
                                            {dayjs(
                                              meeting.meetingStartDate
                                            ).format("DD MMM YYYY")}
                                            {", "}
                                            {dayjs(
                                              meeting.meetingStartTime,
                                              "HH:mm"
                                            ).format("hh:mm A")}
                                          </span>
                                        </p>
                                        <p className="mb-0">
                                          ✎{" "}
                                          <span className="fw-medium text-black ms-2">
                                            Last Modified on
                                          </span>{" "}
                                          <span>
                                            {dayjs(meeting.updatedAt).format(
                                              "DD MMM YYYY, hh:mm A"
                                            )}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
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
                            className={`uploadSectionInnerBox ${
                              isDragActive ? "drag-active" : ""
                            }`}
                          >
                            <input {...getInputProps()} />
                            <div className="uploadSectionImageBox">
                              <FcUpload style={{ fontSize: 30 }} />
                            </div>
                            <div className="profile-upload d-block">
                              <div className="profile-upload-content">
                                <label className="profile-upload-btn">
                                  <i className="ti ti-file-broken" /> Upload
                                  File
                                </label>
                                {isDragActive ? (
                                  <p>Drop the files here ...</p>
                                ) : (
                                  <p>
                                    Drag 'n' drop Excel or CSV files here, or
                                    click to select them
                                  </p>
                                )}
                              </div>
                            </div>
                            <p className="supportedFormat">
                              (Supported formats .csv, .xlsx; max file size 5
                              MB)
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
                                                {callStatus.map(
                                                  (callStatus, index) => {
                                                    return (
                                                      <li key={index}>
                                                        <div className="filter-checks">
                                                          <label className="checkboxs">
                                                            <input
                                                              type="checkbox"
                                                              checked={selectedCallStatus.includes(
                                                                callStatus.value.toLowerCase()
                                                              )}
                                                              onChange={() =>
                                                                filterCallStatus(
                                                                  callStatus.value.toLowerCase()
                                                                )
                                                              }
                                                            />
                                                            <span className="checkmarks" />
                                                            {callStatus.value}
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
                                              to="#"
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
                                                              checked={selectedEmployee.includes(
                                                                companyEmployee.value.toLowerCase()
                                                              )}
                                                              onChange={() =>
                                                                filterLeadEmployee(
                                                                  companyEmployee.value.toLowerCase()
                                                                )
                                                              }
                                                            />
                                                            <span className="checkmarks" />
                                                            {
                                                              companyEmployee.value
                                                            }
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
                                <div className="dropdown">
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
                                      Want to manage datatables?
                                    </h4>
                                    <p className="mb-3">
                                      Please drag and drop your column to
                                      reorder your table and enable see option
                                      as you want.
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
                                {/* <Link
                                  to="#"
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
                            <div className="d-flex align-items-center flex-wrap row-gap-2 justify-content-sm-end"></div>
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
                          {!showQuotationViewForm && (
                            <div
                              // to=""
                              style={{ cursor: "pointer" }}
                              // data-bs-toggle="modal"
                              // data-bs-target="#add_quotation"
                              className="link-purple fw-medium"
                              onClick={() => {
                                // setSelectedMeeting(null)
                                // setSelectedMeetingType(null)
                                setShowQuotationForm(true);
                                setSelectedQuotation(null);
                                setSelectedQuotationProduct(null);
                                setAddedQuotationEntries([]);
                              }}
                            >
                              <i className="ti ti-circle-plus me-1" />
                              Add New
                            </div>
                          )}
                          {showQuotationViewForm && (
                            <div className="dropdown me-2">
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
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="card-body">
                        {!showQuotationForm ? (
                          <div className="table-responsive custom-table">
                            <Table
                              dataSource={filteredQuotationData}
                              columns={visibleQuotationColumns}
                              rowKey={(record) => record.key}
                            />
                          </div>
                        ) : showQuotationViewForm ? (
                          <>
                            <div
                              ref={contentRef}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "20px",
                              }}
                            >
                              {/* 2x2 Grid for draggable containers */}
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "1fr 1fr",
                                  gridGap: "20px",
                                  width: "100%",
                                }}
                              >
                                {/* First Container */}
                                <div
                                  ref={containerRefs[0]}
                                  style={{ cursor: "grab" }}
                                >
                                  <div
                                    style={{ width: 200, height: "auto" }}
                                    className="mb-3"
                                  >
                                    <img
                                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBwzaOHjVPsPvedzhKqhNXT7QJ_ru2GGTkCA&s"
                                      alt=""
                                      crossOrigin="anonymous"
                                    />
                                  </div>
                                </div>
                                {/* Second Container */}
                                <div
                                  ref={containerRefs[1]}
                                  style={{ cursor: "grab" }}
                                >
                                  <div className="mb-3">
                                    <b>
                                      {selectedViewQuotation
                                        ? selectedViewQuotation.estimationsId
                                        : ""}
                                    </b>
                                  </div>
                                  <div className="mb-3">
                                    <b>To,</b>
                                    <p className="mb-0">California Media</p>
                                    <p className="mb-0">Burjuman</p>
                                    <p className="mb-0">Dubai, Dubai</p>
                                    <p className="mb-0">AE 00000</p>
                                  </div>
                                </div>

                                {/* Third Container */}
                                <div
                                  ref={containerRefs[2]}
                                  style={{ cursor: "grab" }}
                                >
                                  <div className="mb-3">
                                    <b>Ship to:</b>
                                    <p className="mb-0">Burjuman</p>
                                    <p className="mb-0">Burjuman</p>
                                    <p className="mb-0">Dubai, Dubai</p>
                                    <p className="mb-0">AE 00000</p>
                                  </div>
                                </div>

                                {/* Forth Container */}
                                <div
                                  ref={containerRefs[3]}
                                  style={{ cursor: "grab" }}
                                >
                                  <div className="mb-3">
                                    <p className="mb-0">
                                      <b>Estimate Date:</b> 2024-10-17
                                    </p>
                                    <p className="mb-0">
                                      <b>Expiry Date:</b> 2024-10-17
                                    </p>
                                    <p className="mb-0">
                                      <b>Sale Agent:</b> Waqar Ansari
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Draggable table (full width below the grid) */}
                              <div>
                                <table
                                  ref={tableRef}
                                  className="w-100 quotation-calc-table my-3"
                                >
                                  <thead>
                                    <tr>
                                      <th>
                                        <MdDragIndicator
                                          className="drag-handle"
                                          style={{ cursor: "grab" }}
                                        />
                                      </th>
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
                                          <MdDragIndicator
                                            className="drag-handle"
                                            style={{ cursor: "grab" }}
                                          />
                                        </td>
                                        <td style={{ width: 250 }}>
                                          {row.description}
                                        </td>
                                        <td style={{ width: 100 }}>
                                          {row.quantity}
                                        </td>
                                        <td style={{ width: 100 }}>
                                          {row.rate}
                                        </td>
                                        <td>{row.tax}</td>
                                        <td>{row.amount}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </>
                        ) : (
                          <form>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <label className="col-form-label">
                                      Company Name
                                    </label>
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
                                      onChange={(e) => { handleMeetingInputChange(e.target.name, e.target.value) }}
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
                              {haveShippingAddress && (
                                <div className="col-md-6 mb-3">
                                  <h4>Ship to</h4>
                                  <p className="mb-0">Burjuman</p>
                                  <p className="mb-0">Dubai</p>
                                  <p className="mb-0">AE, 00000</p>
                                </div>
                              )}
                            </div>

                            <div className="row">
                              <div className="col-md-6 mb-3">
                                <label className="col-form-label">
                                  Estimate Date
                                </label>
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
                                  Expiry Date
                                </label>
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
                                    <label className="col-form-label">
                                      Status
                                    </label>
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
                                    <label className="col-form-label">
                                      Sale Agent
                                    </label>
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
                                    <label className="col-form-label">
                                      Discount Type
                                    </label>
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
                                value={meetingFormData.meetingDescription}
                                onChange={(e) =>
                                  handleMeetingInputChange(
                                    e.target.name,
                                    e.target.value
                                  )
                                }
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
                                <label className="col-form-label">
                                  Select Product
                                </label>
                              </div>
                              <Select
                                className="select"
                                options={quotationItems}
                                onChange={handleQuotationProductChange}
                                classNamePrefix="react-select"
                                // This is used for searching
                                getOptionLabel={(quotationItems) =>
                                  `${quotationItems.quotationName} ${quotationItems.quotationDescription}`
                                }
                                getOptionValue={(quotationItems) =>
                                  quotationItems.id
                                }
                                // This is used for rendering the custom display
                                formatOptionLabel={(quotationItems) => (
                                  <div>
                                    <strong>
                                      {quotationItems.quotationName}
                                    </strong>{" "}
                                    - {quotationItems.rate} AED,{" "}
                                    {quotationItems.quotationDescription}
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
                                  <th>
                                    <IoMdSettings />
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td style={{ width: 250 }}>
                                    <input
                                      className="form-control"
                                      name="quotationItemName"
                                      value={
                                        selectedQuotationProduct
                                          ? selectedQuotationProduct.quotationName
                                          : ""
                                      }
                                      onChange={
                                        handleQuotationProductInputChange
                                      }
                                      type="text"
                                    />
                                  </td>
                                  <td style={{ width: 250 }}>
                                    <textarea
                                      className="form-control"
                                      rows={4}
                                      name="quotationDescription"
                                      value={
                                        selectedQuotationProduct
                                          ? selectedQuotationProduct.quotationDescription
                                          : ""
                                      }
                                      onChange={(e) => {}}
                                    />
                                  </td>
                                  <td style={{ width: 100 }}>
                                    <input
                                      className="form-control"
                                      name="quotationQuantity"
                                      value={quotationQuantity}
                                      onChange={(e) => {}}
                                      type="number"
                                    />
                                    <p className="text-end">Unit</p>
                                  </td>
                                  <td style={{ width: 100 }}>
                                    <input
                                      className="form-control"
                                      name="quotationRate"
                                      value={
                                        selectedQuotationProduct
                                          ? selectedQuotationProduct.rate
                                          : ""
                                      }
                                      onChange={(e) => {}}
                                      type="number"
                                    />
                                  </td>

                                  <td>
                                    <Select
                                      className="select"
                                      options={discountType}
                                      classNamePrefix="react-select"
                                    />
                                  </td>
                                  <td>
                                    {quotationQuantity &&
                                    selectedQuotationProduct
                                      ? quotationQuantity *
                                        selectedQuotationProduct.rate
                                      : ""}
                                  </td>

                                  <td style={{ width: 50 }}>
                                    <button
                                      className="btn btn-success"
                                      type="button"
                                      onClick={() => {
                                        handleAddQuotationEntry(
                                          selectedQuotationProduct
                                        );
                                        setSelectedQuotation(null);
                                        setSelectedQuotationProduct(null);
                                      }}
                                    >
                                      <FaCheck />
                                    </button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>

                            {addedQuotationEntries.length > 0 && (
                              <table className="w-100 quotation-calc-table mt-3">
                                <tbody ref={tableBodyRef}>
                                  {addedQuotationEntries.map((entry, index) => (
                                    <tr data-index={index}>
                                      <td style={{ width: 20 }}>
                                        <MdDragIndicator
                                          className="drag-handle"
                                          style={{ cursor: "grab" }}
                                        />
                                      </td>
                                      <td style={{ width: 250 }}>
                                        <input
                                          className="form-control"
                                          name="quotationItemName"
                                          value={entry.itemName}
                                          onChange={(e) => {}}
                                          type="text"
                                        />
                                      </td>
                                      <td style={{ width: 250 }}>
                                        <textarea
                                          className="form-control"
                                          rows={4}
                                          name="quotationDescription"
                                          value={entry.description}
                                          onChange={(e) => {}}
                                        />
                                      </td>
                                      <td style={{ width: 100 }}>
                                        <input
                                          className="form-control"
                                          name="quotationQuantity"
                                          // value={quotationQuantities[index]}
                                          value={
                                            addedQuotationEntries[index]
                                              .quantity
                                          }
                                          onChange={(e) => {
                                            handleQuotationQuantityChange(
                                              index,
                                              e.target.value
                                            );
                                          }}
                                          type="number"
                                        />
                                        <p className="text-end">Unit</p>
                                      </td>
                                      <td style={{ width: 100 }}>
                                        <input
                                          className="form-control"
                                          name="quotationRate"
                                          value={entry.rate}
                                          onChange={(e) => {}}
                                          type="number"
                                        />
                                      </td>

                                      <td>
                                        <Select
                                          className="select"
                                          options={discountType}
                                          classNamePrefix="react-select"
                                        />
                                      </td>
                                      <td>
                                        {entry
                                          ? addedQuotationEntries[index]
                                              .quantity * entry.rate
                                          : ""}
                                      </td>
                                      <td style={{ width: 50 }}>
                                        <button
                                          className="btn btn-primary"
                                          type="button"
                                          onClick={() => {
                                            handleDeleteQuotationEntry(index);
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
                              <div className="col-md-6"></div>
                              <div className="col-md-6">
                                <hr className="hr1" />
                                <p className="text-end">
                                  <b>Sub Total</b>
                                  <span
                                    style={{
                                      width: 80,
                                      display: "inline-block",
                                    }}
                                  >
                                    : 45678
                                  </span>
                                </p>
                                <hr className="hr1" />
                                <p className="text-end d-flex align-items-start justify-content-end">
                                  <b className="me-4">Discount</b>
                                  <input
                                    className="form-control w-25"
                                    name="quotationDiscount"
                                    value=""
                                    onChange={(e) => {}}
                                    type="text"
                                  />
                                  <Select
                                    className="select2 custom-radius"
                                    options={discountOption}
                                    name="taskType"
                                    value={taskType.find(
                                      (option) =>
                                        option.value === taskFormData.taskType
                                    )}
                                    onChange={(option) =>
                                      handleTaskInputChange("taskType", option)
                                    }
                                    classNamePrefix="react-select"
                                  />
                                  <span style={{ width: 80 }}>: 45678</span>
                                </p>
                                <hr className="hr1" />
                                <p className="text-end">
                                  <b>Total</b>
                                  <span
                                    style={{
                                      width: 80,
                                      display: "inline-block",
                                    }}
                                  >
                                    : 45678
                                  </span>
                                </p>
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
                        )}
                      </div>
                    </div>
                  </div>
                  {/* /Quotation */}
                </div>
                {/* /Tab Content */}
              </div>
              {/* /Leads Details */}
            </div>
          </>
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* Create Contact */}
      <div
        className="modal custom-modal fade"
        id="create_contact"
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
                  <i className="ti ti-user-plus" />
                </div>
                <h3>Contact Created Successfully!!!</h3>
                <p>View the details of contact, created</p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link to={route.dealsDetails} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Create Contact */}
      {/* Add Edit Note */}
      <div
        className="modal custom-modal fade modal-padding"
        id="add_notes"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Note</h5>
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
                  <input
                    className="form-control"
                    value={selectedNote ? selectedNote.noteHeading : ""}
                    onChange={() => {}}
                    type="text"
                  />
                </div>
                <div className="mb-3">
                  <label className="col-form-label">
                    Note <span className="text-danger"> *</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    defaultValue={selectedNote ? selectedNote.noteText : ""}
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
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Edit Note */}
      {/* Add Edit Task */}
      <div
        className="modal custom-modal fade modal-padding"
        id="add_tasks"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedTask ? "Edit Note" : "Add new Notes"}
              </h5>
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
                  <input
                    className="form-control"
                    name="taskTitle"
                    value={taskFormData.taskTitle}
                    onChange={(e) => {
                      handleTaskInputChange(e.target.name, e.target.value);
                    }}
                    type="text"
                  />
                </div>
                <div className="mb-3">
                  <label className="col-form-label">
                    Description <span className="text-danger"> *</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    name="taskDescription"
                    // defaultValue={selectedTask ? selectedTask.description : ''}
                    // onChange={handleInput}
                    value={taskFormData.taskDescription}
                    onChange={(e) =>
                      handleTaskInputChange(e.target.name, e.target.value)
                    }
                  />
                </div>
                {/* <div className="mb-3">
                  <label className="col-form-label">
                    Task Type
                  </label>
                  <Select
                    className="select2"
                    options={taskType}
                    name="taskType"
                    value={taskType.find(option => option.value === taskFormData.taskType)}
                    onChange={(option) => handleTaskInputChange("taskType", option)}
                    placeholder="Choose"
                    classNamePrefix="react-select"
                  />
                </div> */}

                {/* <div className="mb-3">
                  <label className="col-form-label">Due Date</label>
                  <div className="icon-form-end">
                    <span className="form-icon">
                      <i className="ti ti-calendar-event" />
                    </span>
                    <DatePicker
                      className="form-control datetimepicker deals-details"
                      value={taskFormData.dueDate}
                      name="taskDueDate"
                      onChange={(date) => {
                        handleTaskInputChange("dueDate", date);
                      }}
                      format="DD-MM-YYYY"
                    />
                  </div>
                </div>
                <label className="col-form-label">Due Time</label>
                <div className="mb-3 icon-form">
                  <span className="form-icon">
                    <i className="ti ti-clock-hour-10" />
                  </span>
                  <TimePicker
                    placeholder="Select Time"
                    className="form-control datetimepicker-time"
                    name="taskDueTime"
                    onChange={(time) => handleTaskInputChange("dueTime", time)}
                    value={taskFormData.dueTime}
                    defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                    format="hh:mm A"
                  />
                </div> */}

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
                    onClick={() => {
                      handleTaskSubmit();
                    }}
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
              <h5 className="modal-title">
                {selectedMeeting ? "Edit Meeting" : "Add new Meeting"}
              </h5>
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
                  <input
                    className="form-control"
                    name="meetingTitle"
                    value={meetingFormData.meetingTitle}
                    onChange={(e) => {
                      handleMeetingInputChange(e.target.name, e.target.value);
                    }}
                    type="text"
                  />
                </div>

                <div className="mb-3">
                  <label className="col-form-label">
                    Description <span className="text-danger"> *</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    name="meetingDescription"
                    value={meetingFormData.meetingDescription}
                    onChange={(e) =>
                      handleMeetingInputChange(e.target.name, e.target.value)
                    }
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
                        value={meetingFormData.meetingStartDate}
                        name="meetingStartDate"
                        onChange={(date) => {
                          handleMeetingInputChange("meetingStartDate", date);
                        }}
                        format="DD-MM-YYYY"
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="col-form-label">Start Time </label>
                    <div className="icon-form">
                      <span className="form-icon">
                        <i className="ti ti-clock-hour-10" />
                      </span>
                      <TimePicker
                        placeholder="Select Time"
                        className="form-control datetimepicker-time"
                        name="meetingStartTime"
                        onChange={(time) =>
                          handleMeetingInputChange("meetingStartTime", time)
                        }
                        value={meetingFormData.meetingStartTime}
                        defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                        format="hh:mm A"
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
                        value={meetingFormData.meetingEndDate}
                        name="meetingEndDate"
                        onChange={(date) => {
                          handleMeetingInputChange("meetingEndDate", date);
                        }}
                        format="DD-MM-YYYY"
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="col-form-label">End Time</label>
                    <div className="icon-form">
                      <span className="form-icon">
                        <i className="ti ti-clock-hour-10" />
                      </span>
                      <TimePicker
                        placeholder="Select Time"
                        className="form-control datetimepicker-time"
                        name="meetingEndTime"
                        onChange={(time) =>
                          handleMeetingInputChange("meetingEndTime", time)
                        }
                        value={meetingFormData.meetingEndTime}
                        defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                        format="hh:mm A"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="col-form-label">Meeting Type</label>
                  <Select
                    value={
                      meetingFormData?.meetingType
                        ? meetingType.find(
                            (option) =>
                              option.value === meetingFormData?.meetingType
                          )
                        : null
                    }
                    className="select2"
                    options={meetingType}
                    name="meetingType"
                    onChange={(option) =>
                      handleMeetingInputChange("meetingType", option.value)
                    }
                    placeholder="Choose"
                    classNamePrefix="react-select"
                  />
                </div>

                {meetingFormData?.meetingType === "offline" && (
                  <div className="mb-3">
                    <label className="col-form-label">Location</label>
                    <input
                      className="form-control"
                      name="meetingLocation"
                      onChange={(e) => {
                        handleMeetingInputChange(e.target.name, e.target.value);
                      }}
                      value={meetingFormData.meetingLocation}
                      type="text"
                    />
                  </div>
                )}

                {meetingFormData?.meetingType === "online" &&
                meetingFormData?.meetingLink !== "" ? (
                  <>
                    <div className="mb-3">
                      <label className="col-form-label">Meeting Link</label>
                      <input
                        className="form-control"
                        disabled
                        name="meetingLink"
                        value={meetingFormData.meetingLink}
                        onChange={(e) => {
                          handleMeetingInputChange(
                            e.target.name,
                            e.target.value
                          );
                        }}
                        type="text"
                      />
                    </div>
                  </>
                ) : (
                  ""
                )}

                {meetingFormData?.meetingType === "online" &&
                  meetingFormData?.meetingLink == "" && (
                    <div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          checked={checkMeetingLink}
                          onChange={() =>
                            setCheckMeetingLink(!checkMeetingLink)
                          }
                        />
                        <div>Generate Meeting Link</div>
                      </div>
                      {!isGoogleSignedIn && (
                        <>
                          <div className="text-danger mt-2">
                            *Generating meeting links Google Account is Required
                          </div>
                          <div className="mt-2">
                            <Link
                              to={route.emailSetup}
                              target="_blank"
                              // onClick={()=>{
                              //   document.getElementById("closeMeetingModal")?.click();
                              //   }}
                            >
                              Click here{" "}
                            </Link>
                            to connect your Google Account
                          </div>
                        </>
                      )}
                    </div>
                  )}

                <div className="col-lg-12 text-end modal-btn mt-4">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                    id="closeMeetingModal"
                  >
                    Cancel
                  </Link>
                  <button
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    type="button"
                    onClick={() => {
                      handleMeetingSubmit();
                    }}
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
              <h5 className="modal-title">
                {selectedMeeting ? "Edit Quotation" : "Add new Quotation"}
              </h5>
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
                      onChange={handleHaveShippingAddress}
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
                    Show shipping details in quotation
                  </label>
                </div>
                <div className="row">
                  <div
                    className={haveShippingAddress ? "col-md-6" : "col-md-12"}
                  >
                    <h4>Bill to</h4>
                    <div className="mb-3">
                      <label className="col-form-label">Street</label>
                      <input
                        className="form-control"
                        name="meetingTitle"
                        value={meetingFormData.meetingTitle}
                        onChange={(e) => {
                          handleMeetingInputChange(
                            e.target.name,
                            e.target.value
                          );
                        }}
                        type="text"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">City</label>
                      <input
                        className="form-control"
                        name="meetingTitle"
                        value={meetingFormData.meetingTitle}
                        onChange={(e) => {
                          handleMeetingInputChange(
                            e.target.name,
                            e.target.value
                          );
                        }}
                        type="text"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">State</label>
                      <input
                        className="form-control"
                        name="meetingTitle"
                        value={meetingFormData.meetingTitle}
                        onChange={(e) => {
                          handleMeetingInputChange(
                            e.target.name,
                            e.target.value
                          );
                        }}
                        type="text"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">Zip Code</label>
                      <input
                        className="form-control"
                        name="meetingTitle"
                        value={meetingFormData.meetingTitle}
                        onChange={(e) => {
                          handleMeetingInputChange(
                            e.target.name,
                            e.target.value
                          );
                        }}
                        type="text"
                      />
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
                  {haveShippingAddress && (
                    <div className="col-md-6">
                      <h4>Ship to</h4>
                      <div className="mb-3">
                        <label className="col-form-label">Street</label>
                        <input
                          className="form-control"
                          name="meetingTitle"
                          value={meetingFormData.meetingTitle}
                          onChange={(e) => {
                            handleMeetingInputChange(
                              e.target.name,
                              e.target.value
                            );
                          }}
                          type="text"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="col-form-label">City</label>
                        <input
                          className="form-control"
                          name="meetingTitle"
                          value={meetingFormData.meetingTitle}
                          onChange={(e) => {
                            handleMeetingInputChange(
                              e.target.name,
                              e.target.value
                            );
                          }}
                          type="text"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="col-form-label">State</label>
                        <input
                          className="form-control"
                          name="meetingTitle"
                          value={meetingFormData.meetingTitle}
                          onChange={(e) => {
                            handleMeetingInputChange(
                              e.target.name,
                              e.target.value
                            );
                          }}
                          type="text"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="col-form-label">Zip Code</label>
                        <input
                          className="form-control"
                          name="meetingTitle"
                          value={meetingFormData.meetingTitle}
                          onChange={(e) => {
                            handleMeetingInputChange(
                              e.target.name,
                              e.target.value
                            );
                          }}
                          type="text"
                        />
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
                  )}
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
      {/* Add Quotation Item */}
      <div
        className="modal custom-modal fade modal-padding"
        id="add_quotationItem"
        role="dialog"
        aria-hidden="true"
        aria-labelledby="add_quotationItemLabel"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedMeeting ? "Edit Product" : "Add new Product"}
              </h5>
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
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="col-form-label">Product Name</label>
                      <input
                        className="form-control"
                        name="meetingTitle"
                        value={meetingFormData.meetingTitle}
                        onChange={(e) => {
                          handleMeetingInputChange(
                            e.target.name,
                            e.target.value
                          );
                        }}
                        type="text"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">
                        Product Description
                      </label>
                      <textarea
                        className="form-control"
                        rows={4}
                        name="meetingDescription"
                        value={meetingFormData.meetingDescription}
                        onChange={(e) =>
                          handleMeetingInputChange(
                            e.target.name,
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">Rate - AED</label>
                      <input
                        className="form-control"
                        name="meetingTitle"
                        value={meetingFormData.meetingTitle}
                        onChange={(e) => {
                          handleMeetingInputChange(
                            e.target.name,
                            e.target.value
                          );
                        }}
                        type="text"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">Unit</label>
                      <input
                        className="form-control"
                        name="meetingTitle"
                        value={meetingFormData.meetingTitle}
                        onChange={(e) => {
                          handleMeetingInputChange(
                            e.target.name,
                            e.target.value
                          );
                        }}
                        type="text"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">Rate - AED</label>
                      <input
                        className="form-control"
                        name="meetingTitle"
                        value={meetingFormData.meetingTitle}
                        onChange={(e) => {
                          handleMeetingInputChange(
                            e.target.name,
                            e.target.value
                          );
                        }}
                        type="text"
                      />
                    </div>
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
      {/* /Add Quotation Item */}
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
              <form>
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="col-form-label">
                        Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                      />
                    </div>
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
                      <label className="col-form-label">Select Date</label>
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
                      Select Time <span className="text-danger">*</span>
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

                    <div className="mb-3">
                      <label className="col-form-label">
                        Description <span className="text-danger"> *</span>
                      </label>
                      <textarea
                        className="form-control"
                        rows={4}
                        placeholder="Add text"
                        defaultValue={""}
                      />
                    </div>

                    <div className="text-end modal-btn">
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
              <div className="d-flex justify-content-center mb-5">
                <div>
                  <div className="uploadSectionImageBox"></div>
                  <div className="profile-upload d-block">
                    <div className="profile-upload-content">
                      <div
                        className="uploadSectionInnerBox"
                        {...getRootProps()}
                      >
                        <FcUpload style={{ fontSize: 30 }} className="mb-5" />
                        <input {...getInputProps()} />
                        {isDragActive ? (
                          <p>Drop the files here ...</p>
                        ) : (
                          <p>
                            Drag 'n' drop some files here, or click to select
                            files
                          </p>
                        )}
                        <p className="supportedFormat">
                          (Supported formats .csv, .pdf, .xlsx; max file size 5
                          MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-btn text-end">
                <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <button
                  type="button"
                  data-bs-dismiss="modal"
                  className="btn btn-primary"
                >
                  Save Changes
                </button>
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
                <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
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
                  <Link to={route.companyDetails} className="btn btn-primary">
                    Go to email
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Success Contact */}
      {/* Add Tag */}

      {/* /Add Tag */}
      {/* Add Contact */}
      <div className="modal custom-modal fade" id="add_contact" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Contact</h5>
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
                  <label className="col-form-label">
                    Source <span className="text-danger">*</span>
                  </label>
                  <Select
                    className="select"
                    options={companyEmployee}
                    classNamePrefix="react-select"
                  />
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
      {/* /Add Contact */}
      {/* Add Owner */}
      <div className="modal custom-modal fade" id="owner" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Deal Owner</h5>
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
                        <input type="checkbox" defaultChecked />
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
      {/* /Add Owner */}
      {/* Deal Status */}
      <div className="modal custom-modal fade" id="deal_status" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Deal Status</h5>
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
                  <label className="col-form-label">
                    Status <span className="text-danger">*</span>
                  </label>
                  <Select
                    className="select2"
                    classNamePrefix="react-select"
                    // options={status}
                    placeholder="Choose"
                  />
                </div>
                <div className="mb-3">
                  <label className="col-form-label">
                    Reason <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={5}
                    defaultValue={""}
                  />
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
      {/* /Deal Status */}
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
          <form>
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
                      <Link to="#" onClick={() => setOpenModal(true)}>
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
                      <Link to="#" onClick={() => setOpenModal(true)}>
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
                      <Link to="#" onClick={() => setOpenModal(true)}>
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
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#create_pipeline"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* /Add New Pipeline */}
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
              <form>
                <div className="mb-3">
                  <label className="col-form-label">Stage Name *</label>
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
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add New Stage */}
      {/* Create Pipeline */}
      <div
        className="modal custom-modal fade"
        id="create_pipeline"
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
                <h3>Pipeline Created Successfully!!!</h3>
                <p>View the details of pipeline, created</p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link to={route.dealsDetails} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Create Pipeline*/}
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
              <form>
                <div className="mb-3">
                  <label className="col-form-label">Stage Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="Inpipeline"
                  />
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
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Stage */}
      {/* Delete Stage */}
      <Modal show={openModal} onHide={() => setOpenModal(false)}>
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
              <Link to={route.contactList} className="btn btn-danger">
                Yes, Delete it
              </Link>
            </div>
          </div>
        </div>
      </Modal>
      {/* /Delete Stage */}

      {/* <DeleteModal text={deleteModalText} onDelete={handleDeleteTask} />
  <DeleteModal text={deleteModalText} onDelete={handleDeleteMeeting} /> */}

      <DeleteModal
        text={deleteModalText}
        onDelete={
          deleteModalText === "task" ? handleDeleteTask : handleDeleteMeeting
        }
      />

      <EmailTemplateModal />
      <WhatsappTemplateModal />
    </>
  );
};

export default ContactsDetails;
