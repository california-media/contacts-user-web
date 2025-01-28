import React, { useEffect, useState } from 'react'
import Select from "react-select";
import { ascendingandDecending } from '../../../core/common/selectoption/selectoption';
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import { Link } from 'react-router-dom';
import { MdPhoneInTalk } from 'react-icons/md';
import { FaPhoneSlash } from 'react-icons/fa';
import { all_routes } from '../../router/all_routes';
import DeleteModal from '../../../core/common/modals/DeleteModal';
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
const Notes = () => {
  const route = all_routes;
  const [sortOrder, setSortOrder] = useState("Descending");
  const [contactedToday, setContactedToday] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeEditorIndex, setActiveEditorIndex] = useState(null);
  const [hoveredNoteIndex, setHoveredNoteIndex] = useState(null);
  const [deleteModalText, setDeleteModalText] = useState("");
  const [indexToDelete, setIndexToDelete] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    return () => {};
  }, []);


  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const onChange = (time, timeString) => {
    console.log(time, timeString);
  };

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
  const handleNoteEditClick = (note) => {
    setSelectedNote(note)
  }
  const handleModalDeleteBtn = (text) => {
    console.log(`Deleting ${indexToDelete} ${text}...`);
  };
  const sortedNotes = sortNotes(allNotes);
  return (
    // <div className="tab-pane active show" id="notes">
    <div id="notes">
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
      {/* Add Edit Note */}
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
      {/* /Add Edit Note */}

      {/* Delete Modal */}
      {<DeleteModal text={deleteModalText} onDelete={() => { handleModalDeleteBtn(deleteModalText) }} onCancel={() => { setDeleteModalText("") }} />}
      {/* /Delete Modal */}
    </div>
  )
}

export default Notes