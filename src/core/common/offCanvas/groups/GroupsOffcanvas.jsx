import React, { useEffect, useRef, useState } from "react";
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
import api from "../../../axios/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { addTag, deleteTag } from "../../../data/redux/slices/TagSlice";
import EmojiPicker from "emoji-picker-react";

const GroupsOffcanvas = () => {
  const [show, setShow] = useState(false);
  const [newContents, setNewContents] = useState([0]);
  const [tagValue, setTagValue] = useState("");
  const [tagToBeDeleted, setTagToBeDeleted] = useState({});
  const [owner, setOwner] = useState(["Collab"]);
  const [openGroupDeleteModal, setOpenGroupDeleteModal] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState("🏷️");
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);

  const addEmoji = (emojiData) => {
    console.log(emojiData, "emojidata");

    setCurrentEmoji(emojiData.emoji);
  };

  // 🔒 Close picker on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dispatch = useDispatch();

  const handleShow = () => setShow(true);
  const addNewContent = () => {
    setNewContents([...newContents, newContents.length]);
  };
  // useEffect(() => {
  //   const fetchTags = async () => {
  //     try {
  //       const response = await api.get("getTag");
  //       console.log(response.data.data, "response.data");
  //       setAllTags(response.data.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchTags();
  // }, []);
  const { tags, loading, error } = useSelector((state) => state.tags);
  useEffect(() => {
    setAllTags(tags);
  }, [tags]);

  const handleAddTag = async (e) => {
    e.preventDefault();

    dispatch(addTag({ tag: [tagValue] }));
    setTagValue("");
  };
  const handleDeleteTag = async () => {
    try {
      await dispatch(deleteTag(tagToBeDeleted.tag_id)).unwrap();
      // Only runs if the delete was successful
      setOpenGroupDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete the tag:", error);
    }
  };
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
        {/* <form onSubmit={handleAddTag}>
          <div className="row">
            <label className="col-form-label ms-3">Groups</label>
            <div className="col-md-9">
              <div className="mb-3">
                <input
                  type="text"
                  value={tagValue}
                  onChange={(e) => {
                    setTagValue(e.target.value);
                  }}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-3">
              <button
                type="submit"
                className="btn btn-primary"
                // onClick={() => {}}
              >
                Add
              </button>
            </div>
          </div>
        </form>
        {allTags.map((tag, index) => {
          return (
            <span className="groupContainer mb-2" key={index}>
              {tag.tag}
              <MdCancel
                className="groupDeleteIconStyle"
                onClick={() => {
                  setTagToBeDeleted(tag);
                  setOpenGroupDeleteModal(true);
                }}
              />
            </span>
          );
        })} */}
        <form onSubmit={handleAddTag}>
          <div className="row">
            {/* <label className="col-form-label ms-3">Groups</label> */}
            <div className="col-md-12">
              <div className="mb-3 position-relative d-flex gap-3 align-items-center">
                <div className="flex-grow-1">
                  <input
                    type="text"
                    value={tagValue}
                    onChange={(e) => setTagValue(e.target.value)}
                    className="form-control"
                    placeholder="Add Group"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-light  "
                    ref={buttonRef}
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                  >
                    {currentEmoji}
                  </button>
                </div>

                {showEmojiPicker && (
                  <div
                    ref={pickerRef}
                    className="emoji-picker-popup"
                    style={{
                      position: "absolute",
                      zIndex: 9999,
                      top: "100%",
                      right: 0,
                    }}
                  >
                    <EmojiPicker onEmojiClick={addEmoji} />
                  </div>
                )}
                <div>
                  <button type="submit" className="btn btn-primary">
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="tags-list mt-3">
          {allTags.map((tag, index) => (
            <p className="groupContainer" key={index}>
              {tag.tag}
              <MdCancel
                className="groupDeleteIconStyle"
                onClick={() => {
                  setTagToBeDeleted(tag);
                  setOpenGroupDeleteModal(true);
                }}
              />
            </p>
          ))}
        </div>

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
                <Link
                  to="#"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                  onClick={() => setOpenGroupDeleteModal(false)}
                >
                  Cancel
                </Link>
                <Link
                  to="#"
                  onClick={handleDeleteTag}
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
