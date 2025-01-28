import React, { useEffect, useState } from 'react'
import { IoLocationSharp } from 'react-icons/io5';
import { RiVideoOnLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import Select from "react-select";
import { ascendingandDecending, meetingType } from '../../../core/common/selectoption/selectoption';
import DeleteModal from '../../../core/common/modals/DeleteModal';
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import ImageWithBasePath from '../../../core/common/imageWithBasePath';

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

const Meetings = () => {

  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [selectedMeetingType, setSelectedMeetingType] = useState(null);
  const [hoveredMeetingIndex, setHoveredMeetingIndex] = useState(null);
  const [deleteModalText, setDeleteModalText] = useState("");
  const [indexToDelete, setIndexToDelete] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());



  useEffect(() => {
    return () => { }
  }, [])
  const handleMeetingEditClick = (meeting) => {
    setSelectedMeeting(meeting)
  }
  const handleModalDeleteBtn = (text) => {
    console.log(`Deleting ${indexToDelete} ${text}...`);
  };
  const handleInput = (event) => {
    const input = event.target.value;
    if (selectedTask) {

      setSelectedTask({
        ...selectedTask,
        title: input,
      });
    }
  }
  const handleDateChange = (date) => {
    setSelectedDate(date);
};
const onChange = (time, timeString) => {
  console.log(time, timeString);
};
const handleMeetingTypeChange = (selectedOption) => {
  setSelectedMeetingType(selectedOption ? selectedOption.value : null);
};
  return (
    <div id="meetings">
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h4 className="fw-semibold mb-0">Meetings</h4>
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
    </div>
  )
}

export default Meetings