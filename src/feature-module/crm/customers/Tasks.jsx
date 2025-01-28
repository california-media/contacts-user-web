import React, { useEffect, useState } from 'react'
import Select from "react-select";
import { ascendingandDecending, taskType } from '../../../core/common/selectoption/selectoption';
import { Link } from 'react-router-dom';
import { IoMdDoneAll } from 'react-icons/io';
import { FaCalendarAlt, FaRegBell } from 'react-icons/fa';
import { MdDownloadDone, MdOutlineRemoveDone } from 'react-icons/md';
import DeleteModal from '../../../core/common/modals/DeleteModal';
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";


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
const Tasks = () => {

  const [sortOrderIncompleteTask, setSortOrderIncompleteTask] = useState("Descending");
  const [selectedTask, setSelectedTask] = useState(null);
  const [hoveredTaskIndex, setHoveredTaskIndex] = useState(null);
  const [deleteModalText, setDeleteModalText] = useState("");
  const [indexToDelete, setIndexToDelete] = useState(null);
  const [sortOrderCompletedTask, setSortOrderCompletedTask] = useState("Descending");
  const [hoveredTaskCompletedIndex, setHoveredTaskCompletedIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());


  useEffect(() => {
    return () => {};
  }, []);


  const onChange = (time, timeString) => {
    console.log(time, timeString);
};
    const handleDateChange = (date) => {
        setSelectedDate(date);
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
  const handleTaskEditClick = (task) => {
    setSelectedTask(task)
  }
  const handleModalDeleteBtn = (text) => {
    console.log(`Deleting ${indexToDelete} ${text}...`);
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

  const sortedIncompleteTask = sortIncompleteTask(allTasks);
  const sortedCompletedTask = sortCompletedTask(allTasks);




  return (
    // <div className="tab-pane fade" id="tasks">
    <div id="tasks">
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

      {/* Delete Modal */}
      {<DeleteModal text={deleteModalText} onDelete={() => { handleModalDeleteBtn(deleteModalText) }} onCancel={() => { setDeleteModalText("") }} />}
      {/* /Delete Modal */}
    </div>
  )
}

export default Tasks