import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
  options,
  optionssymbol,
  optionschoose,
  optionsource,
  optionindustry,
} from "../../selectoption/selectoption";
import { SelectWithImage2 } from "../../selectWithImage2";
import { TagsInput } from "react-tag-input-component";
import { MdCancel } from "react-icons/md";
import DeleteGroupModal from "../../modals/DeleteGroupModal";
import { Modal } from "react-bootstrap";

const GroupsOffcanvas = () => {
  const [show, setShow] = useState(false);
  const [newContents, setNewContents] = useState([0]);
  const [owner, setOwner] = useState(["Collab"]);
  const [openGroupDeleteModal, setOpenGroupDeleteModal] = useState(false);

  const handleShow = () => setShow(true);
  const addNewContent = () => {
    setNewContents([...newContents, newContents.length]);
  };
  useEffect(() => {
    console.log("groups off canvas on");
    return () => {
      console.log("groups off canvas off");
    };
  });
  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="groups_offcanvas"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">Groups</h5>
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
            <label className="col-form-label ms-3">Groups</label>
            <div className="col-md-9">
              <div className="mb-3">
                <input
                  type="text"
                  value={"abc"}
                  onChange={() => {}}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {}}
              >
                Add
              </button>
            </div>
          </div>
        </form>

        {
          <>
            <span className="groupContainer">
              website
              <MdCancel
                className="groupDeleteIconStyle"
                onClick={() => {
                  setOpenGroupDeleteModal(true);
                }}
              />
            </span>
            <span className="groupContainer"  onClick={() => {
                  setOpenGroupDeleteModal(true);
                }}>
              supplier
              <MdCancel className="groupDeleteIconStyle" onClick={() => {}} />
            </span>
          </>
        }
        <Modal
          show={openGroupDeleteModal}
          onHide={() => setOpenGroupDeleteModal(false)}
        >
          <div className="modal-header border-0 m-0 justify-content-end">
            <button
              className="btn-close"
              onClick={() => setOpenGroupDeleteModal(false)}
              aria-label="Close"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <div className="modal-body">
            <div className="success-message text-center">
              <div className="success-popup-icon bg-danger-light">
                <i className="ti ti-trash-x" />
              </div>
              <h3>Are you sure, you want to delete the group</h3>
              <p>This group will be removed from all your contacts</p>
              <div className="col-lg-12 text-center modal-btn">
                <Link to="#" className="btn btn-light" data-bs-dismiss="modal" onClick={() => setOpenGroupDeleteModal(false)}>
                  Cancel
                </Link>
                <Link
                  to="#"
                  onClick={() => setOpenGroupDeleteModal(false)}
                  className="btn btn-primary"
                >
                  Delete
                </Link>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default GroupsOffcanvas;
