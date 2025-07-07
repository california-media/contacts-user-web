import React, { useState, useEffect, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import { gapi } from "gapi-script";
import { EmailAuthContext } from "../../../core/common/context/EmailAuthContext";
import { useDispatch, useSelector } from "react-redux";
import { profileEvents } from "../../../core/data/redux/slices/EventSlice";
import { setSelectedContact } from "../../../core/data/redux/slices/SelectedContactSlice";
import api from "../../../core/axios/axiosInstance";
import dayjs from "dayjs";
import { DatePicker, TimePicker } from "antd";
import { all_routes } from "../../router/all_routes";
import { saveContact } from "../../../core/data/redux/slices/ContactSlice";

const Calendar = () => {
  const [startDate, setDate] = useState(new Date()),
    [showCategory, setshowCategory] = useState(false),
    [showmodel, setshowmodel] = useState(false),
    [showEvents, setshowEvents] = useState(false),
    [show, setshow] = useState(false),
    [iseditdelete, setiseditdelete] = useState(false),
    [addneweventobj, setaddneweventobj] = useState(null),
    [isnewevent, setisnewevent] = useState(false),
    [event_title, setevent_title] = useState(""),
    [category_color, setcategory_color] = useState(""),
    [calenderevent, setcalenderevent] = useState(""),
    [allContacts, setAllContacts] = useState([]),
    [weekendsVisible, setweekendsVisible] = useState(true),
    [currentEvents, setscurrentEvents] = useState([]);
  const [defaultEvents, setDefaultEvents] = useState([]);
  const userProfile = useSelector((state) => state.profile);
  const events = useSelector((state) => state.event);
  const navigate = useNavigate();
  console.log(defaultEvents, "events slice in calendar");
  const dispatch = useDispatch();
  const [meetingFormData, setMeetingFormData] = useState({
    meeting_id: "",
    meetingDescription: "",
    meetingType: "",
    meetingLink: "",
    meetingTitle:"",
    meetingLocation: "",
    meetingStartDate: dayjs(),
    meetingStartTime: dayjs("00:00:00", "HH:mm:ss"),
  });
  const route = all_routes;
  useEffect(() => {
    setDefaultEvents(events);
  }, [events]);
  useEffect(() => {
    dispatch(profileEvents());
  }, []);


const meetingType = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
];
useEffect(async()=>{
try {
  const response = await api.get("/getAllContact")
  // console.log(response.data,"response from all contacts fetched");
  
  setAllContacts(response.data.data)

} catch (error) {
  console.log(error.response.data.data);
  
}

},[])
 const handleMeetingSubmit = async () => {
    // if (!userProfile.googleConnected) {
    //   return dispatch(
    //     showToast({
    //       message: "Please connect the Google account first",
    //       variant: "danger",
    //     })
    //   );
    // }

    const formDataObj = new FormData();
    // let finalMeetLink = "";

    // if (checkMeetingLink && meetingFormData.meetingLink === "") {
    //   try {
    //     console.log("generating link");

    //     finalMeetLink = await generateGoogleMeetingLink();
    //   } catch (err) {
    //     console.error("Failed to generate meeting link:", err);
    //     return;
    //   }
    // }
console.log(meetingFormData,"jghjgjhgjg");

    // formDataObj.append("contact_id", selectedContact.contact_id);

    formDataObj.append("meeting_id", meetingFormData.meeting_id);
    formDataObj.append("meetingType", meetingFormData.meetingType===""?"offline":meetingFormData.meetingType);
    formDataObj.append("meetingLocation", meetingFormData.meetingLocation);
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


  function getColor(color) {
    // Map your color hex to a class, or return a default
    // Example: if you use only a few colors, map them:
    switch (color) {
      case "#2196F3":
        return "info";
      case "#4CAF50":
        return "success";
      case "#9C27B0":
        return "purple";
      case "#FF9800":
        return "warning";
      default:
        return "primary";
    }
  }
  // const defaultEvents = [
  //   {
  //     title: "Event Name 4",
  //     start: Date.now() + 148000000,
  //     className: "bg-purple",
  //   },
  //   {
  //     title: "Test Event 1",
  //     start: Date.now(),
  //     end: Date.now(),
  //     className: "bg-success",
  //   },
  //   {
  //     title: "Test Event 2",
  //     start: Date.now() + 168000000,
  //     className: "bg-info",
  //   },
  //   {
  //     title: "Test Event 3",
  //     start: Date.now() + 338000000,
  //     className: "bg-primary",
  //   },
  // ];
  // const now = new Date();
  // const oneYearLater = new Date();
  // oneYearLater.setFullYear(now.getFullYear() + 1);
  // const fetchGoogleCalendarEvents = async () => {
  //   try {
  //     const response = await gapi.client.calendar.events.list({
  //       calendarId: "primary",
  //       timeMin: new Date().toISOString(),
  //       showDeleted: false,
  //       singleEvents: true,
  //       timeMax: oneYearLater.toISOString(),
  //       maxResults: 100,
  //       orderBy: "startTime",
  //     });
  //     console.log("All events from the google :", response.result.items);

  //     const events = response.result.items.map((event) => ({
  //       title: event.summary || "Untitled",
  //       start: event.start?.dateTime || event.start?.date,
  //       end: event.end?.dateTime || event.end?.date,
  //       className: "bg-primary",
  //       googleEvent: true,
  //     }));

  //     setDefaultEvents(events);
  //   } catch (error) {
  //     console.error("Failed to fetch events from Google Calendar", error);
  //   }
  // };
  // console.log(defaultEvents, "default events");

  // useEffect(() => {
  //   if (isGoogleSignedIn) {
  //     fetchGoogleCalendarEvents();
  //   }
  // }, [isGoogleSignedIn]);
  const handleMeetingInputChange = (name, value) => {
    setMeetingFormData({
      ...meetingFormData,
      [name]: value,
    });
  };

  useEffect(() => {
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("width-100"));
  }, []);

  const addEvent = () => {
    setshowEvents(true);
  };
  const categoryHandler = () => {
    setshowCategory(true);
  };

  const handleClose = () => {
    setisnewevent(false);
    setiseditdelete(false);
    setshow(false);
    setshowCategory(false);
    setshowEvents(false);
    setshowmodel(false);
  };

  const handleEventClick = (clickInfo) => {
    setiseditdelete(false);
    setevent_title(clickInfo.event.title);
    setcalenderevent(clickInfo.event);
  };

  const handleDateSelect = (selectInfo) => {
    setisnewevent(true);
    setaddneweventobj(selectInfo);
  };

  const onupdateModalClose = () => {
    setiseditdelete(false);
    setevent_title("");
  };

  const handleClick = () => {
    setshow(true);
  };

  const options1 = [
    { value: "Success", label: "Success" },
    { value: "Danger", label: "Danger" },
    { value: "Info", label: "Info" },
    { value: "Primary", label: "Primary" },
    { value: "Warning", label: "Warning" },
    { value: "Inverse", label: "Inverse" },
  ];

  const defaultValue = options1[0];
  // const calendarEvents = events.map((event) => ({
  //   title: event.title,
  //   start: event.start, // already in ISO format
  //   end: event.end || event.start, // fallback if no end
  //   className: "bg-primary", // or dynamic className based on event.type or color
  // }));
  const calendarEvents = events.map((event) => ({
    title: event.title,
    start: event.start,
    end: event.end || event.start,
    className: event.type === "meeting" ? "bg-primary" : "bg-secondary",
    id: event.event_id,
    extendedProps: {
      event_id: event.event_id,
      contact_id: event.contact_id,
      type: event.type,
      contact_name: event.contact_name,
      location: event.location,
      meetingType: event.meetingType,
      link: event.link,
      startTime: event.startTime,
      endTime: event.endTime,
    },
  }));
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row align-items-center w-100">
              <div className="col-lg-10 col-sm-12">
                <h3 className="page-title">Calendar</h3>
              </div>
              <div className="col-lg-2 col-sm-12 d-flex justify-content-end p-0">
                <Link
                  to="#"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#add_meeting"
                >
                  Create Event
                </Link>
              </div>
            </div>
          </div>
          <div className="row">
            {/* <div className="col-12">
              <h4 className="card-title">Drag &amp; Drop Event</h4>
              <div id="calendar-events" className="mb-3">
                <div className="calendar-events" data-class="bg-info">
                  <i className="fas fa-circle text-info" /> My Event One
                </div>
                <div className="calendar-events" data-class="bg-success">
                  <i className="fas fa-circle text-success" /> My Event Two
                </div>
                <div className="calendar-events" data-class="bg-danger">
                  <i className="fas fa-circle text-danger" /> My Event Three
                </div>
                <div className="calendar-events" data-class="bg-warning">
                  <i className="fas fa-circle text-warning" /> My Event Four
                </div>
              </div>
              <div className="checkbox  mb-3">
                <input id="drop-remove" className="me-1" type="checkbox" />
                <label htmlFor="drop-remove">Remove after drop</label>
              </div>
              <Link
                to="#"
                data-bs-toggle="modal"
                data-bs-target="#add_new_event"
                className="btn mb-3 btn-primary btn-block w-100"
              >
                <i className="fas fa-plus" /> Add Category
              </Link>
            </div> */}
            <div className="col-12">
              <div className="card bg-white">
                <div className="card-body">
                  <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    initialView="dayGridMonth"
                    editable={true}
                    height={"70vh"}
                    selectable={true}
                    events={calendarEvents}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={weekendsVisible}
                    // initialEvents={defaultEvents}
                    select={handleDateSelect}
                    // eventClick={(clickInfo) => handleEventClick(clickInfo)}
                    eventClick={async (eventInfo) => {
                      const event = eventInfo.event;
                      const props = event.extendedProps;
                      try {
                        console.log(props.contact_id, "props.contact_id");

                        const response = await api.post("/getContactById", {
                          contact_id: props.contact_id,
                        });
                        console.log(
                          response.data,
                          "response from fetch single contact"
                        );
                        dispatch(setSelectedContact(response.data.data));
                      } catch (error) {}
                      navigate("/contacts-details", {
                        state: { tab: "meeting" },
                      });
                      console.log("Clicked event:", {
                        title: event.title,
                        type: props.type,
                        eventId: props.event_id,
                        contactId: props.contact_id,
                        contactName: props.contact_name,
                        location: props.location,
                        meetingType: props.meetingType,
                        link: props.link,
                        timeRange: `${props.startTime} - ${props.endTime}`,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add Event Modal */}
      <div id="add_event" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Event</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">x</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label>
                    Event Name <span className="text-danger">*</span>
                  </label>
                  <input className="form-control" type="text" />
                </div>
                <div className="form-group">
                  <label>
                    Event Date <span className="text-danger">*</span>
                  </label>
                  <div className="cal-icon">
                    <input className="form-control " type="text" />
                  </div>
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Event Modal */}
      <div
        className="modal custom-modal fade modal-padding"
        id="add_meeting"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
               Add New Meeting
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


<Select
                    value={""}
                    className="select2"
                    options={allContacts}
                    name="allContacts"
                    onChange={(option) =>
                      handleMeetingInputChange("meetingType", option.value)
                    }
                    placeholder="Choose"
                    classNamePrefix="react-select"
                  />


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
                      {/* <div className="form-check form-switch">
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
                      </div> */}
                      {!userProfile.accounts?.some(
                        (acc) => acc.type === "google" && acc.isConnected
                      ) && (
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
      {/* Add Event Modal */}
      <div className="modal custom-modal fade none-border" id="my_event">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Event</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-hidden="true"
              ></button>
            </div>
            <div className="modal-body" />
            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-success save-event submit-btn"
              >
                Create event
              </button>
              <button
                type="button"
                className="btn btn-danger delete-event submit-btn"
                data-dismiss="modal"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Event Modal */}
      {/* Add Category Modal */}
      <div className="modal custom-modal fade" id="add_new_event">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Category</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-hidden="true"
              >
                <span aria-hidden="true">x</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label className="col-form-label">Category Name</label>
                  <input
                    className="form-control form-white"
                    placeholder="Enter name"
                    type="text"
                    name="category-name"
                  />
                </div>
                <div className="form-group mb-0  mt-3">
                  <label className="col-form-label">
                    Choose Category Color
                  </label>
                  <Select
                    className="form-white"
                    defaultValue={defaultValue}
                    options={options1}
                    placeholder="Success"
                    classNamePrefix="react-select"
                  />
                </div>
                <div className="submit-section">
                  <button
                    type="button"
                    className="btn btn-primary save-category submit-btn"
                    data-dismiss="modal"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Category Modal */}
    </>
  );
};

export default Calendar;
