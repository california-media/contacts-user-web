import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { Modal } from "react-bootstrap";
import EmojiPicker from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTag,
  deleteTag,
  editTag,
} from "../../../data/redux/slices/TagSlice";
import { showToast } from "../../../data/redux/slices/ToastSlice";

const GroupsOffcanvas = () => {
  const [tagValue, setTagValue] = useState("");
  const [currentEmoji, setCurrentEmoji] = useState("🏷️");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [tagToBeDeleted, setTagToBeDeleted] = useState(null);
  const [openGroupDeleteModal, setOpenGroupDeleteModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTagId, setEditTagId] = useState(null);

  const pickerRef = useRef(null);
  const buttonRef = useRef(null);

  const dispatch = useDispatch();
  const { tags: allTags } = useSelector((state) => state.tags);

  const addEmoji = (emojiData) => {
    setCurrentEmoji(emojiData.emoji);
  };

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetForm = () => {
    setTagValue("");
    setCurrentEmoji("🏷️");
    setIsEditMode(false);
    setEditTagId(null);
  };

  const handleAddOrUpdateTag = (e) => {
    e.preventDefault();

    if (tagValue.trim() === "") {
      return dispatch(
        showToast({ message: "Tag is empty", variant: "danger" })
      );
    }

    const tagExists = allTags.some(
      (t) =>
        t.tag.toLowerCase() === tagValue.toLowerCase() &&
        (!isEditMode || t.tag_id !== editTagId)
    );

    if (!isEditMode && tagExists) {
      return dispatch(
        showToast({ message: "Tag already present", variant: "danger" })
      );
    }

    const payload = {
      tag: tagValue,
      emoji: currentEmoji,
      ...(isEditMode && { tag_id: editTagId }),
    };

    const action = isEditMode ? editTag(payload) : addTag([payload]);

    dispatch(action)
      .unwrap()
       .then(() => {
      setTagValue("");
      setCurrentEmoji("🏷️");
      setIsEditMode(false);
      setEditTagId(null);
    })
      .catch((error) => {
       
        console.error("Tag operation failed:", error);
      });
  };





  const handleDeleteTag = () => {
    if (!tagToBeDeleted?.tag_id) return;
    dispatch(deleteTag(tagToBeDeleted.tag_id))
      .unwrap()
      .then(() => {
        setOpenGroupDeleteModal(false);
        if (editTagId === tagToBeDeleted.tag_id) {
          resetForm();
        }
      })
      .catch((error) => {
        console.error("Failed to delete tag:", error);  
      });
  };

  const handleEditTag = (tag) => {
    setTagValue(tag.tag);
    setCurrentEmoji(tag.emoji);
    setIsEditMode(true);
    setEditTagId(tag.tag_id);
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
        <form onSubmit={handleAddOrUpdateTag}>
          <div className="row">
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
                    className="btn btn-light"
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

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    {isEditMode ? "Update" : "Add"}
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="tags-list mt-3">
          {allTags.map((tag, index) => (
            <div key={index}>
              <p
                className="groupContainer d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => handleEditTag(tag)}
              >
                <div>
                  <span className="me-2">{tag.emoji}</span>
                  <span>{tag.tag}</span>
                </div>
                <MdCancel
                  className="groupDeleteIconStyle"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering edit
                    setTagToBeDeleted(tag);
                    setOpenGroupDeleteModal(true);
                  }}
                />
              </p>
            </div>
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
              <h3>Are you sure you want to delete this group?</h3>
              <p>This group will be removed from all your contacts.</p>
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

// import React, { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import { MdCancel } from "react-icons/md";
// import { Modal } from "react-bootstrap";
// import EmojiPicker from "emoji-picker-react";
// import { useDispatch, useSelector } from "react-redux";
// import { addTag, deleteTag } from "../../../data/redux/slices/TagSlice";
// import { showToast } from "../../../data/redux/slices/ToastSlice";

// const GroupsOffcanvas = () => {
//   const [tagValue, setTagValue] = useState("");
//   const [currentEmoji, setCurrentEmoji] = useState("🏷️");
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [tagToBeDeleted, setTagToBeDeleted] = useState(null);
//   const [openGroupDeleteModal, setOpenGroupDeleteModal] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editTagId, setEditTagId] = useState(null);

//   const pickerRef = useRef(null);
//   const buttonRef = useRef(null);

//   const dispatch = useDispatch();
//   const { tags: allTags } = useSelector((state) => state.tags);

//   const addEmoji = (emojiData) => {
//     setCurrentEmoji(emojiData.emoji);
//   };

//   // Close picker on outside click
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (
//         pickerRef.current &&
//         !pickerRef.current.contains(event.target) &&
//         !buttonRef.current.contains(event.target)
//       ) {
//         setShowEmojiPicker(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const resetForm = () => {
//     setTagValue("");
//     setCurrentEmoji("🏷️");
//     setIsEditMode(false);
//     setEditTagId(null);
//   };

//   const handleAddOrUpdateTag = (e) => {
//     e.preventDefault();

//     if (tagValue.trim() === "") {
//       return dispatch(showToast({ message: "Tag is empty", variant: "danger" }));
//     }

//     const tagExists = allTags.some(
//       (t) => t.tag.toLowerCase() === tagValue.toLowerCase() && (!isEditMode || t.tag_id !== editTagId)
//     );

//     if (!isEditMode && tagExists) {
//       return dispatch(showToast({ message: "Tag already present", variant: "danger" }));
//     }

//     const payload = [
//       {
//         tag: tagValue,
//         emoji: currentEmoji,
//         ...(isEditMode && { tag_id: editTagId }),
//       },
//     ];

//     dispatch(addTag(payload))
//       .unwrap()
//       .then(() => {
//         dispatch(
//           showToast({
//             message: isEditMode ? "Tag updated successfully" : "Tag added successfully",
//             variant: "success",
//           })
//         );
//         resetForm();
//       })
//       .catch((error) => {
//         dispatch(
//           showToast({
//             message: isEditMode ? "Failed to update tag" : "Failed to add tag",
//             variant: "danger",
//           })
//         );
//         console.error("Tag operation failed:", error);
//       });
//   };

//   const handleDeleteTag = () => {
//     if (!tagToBeDeleted?.tag_id) return;
//     dispatch(deleteTag(tagToBeDeleted.tag_id))
//       .unwrap()
//       .then(() => {
//         setOpenGroupDeleteModal(false);
//         dispatch(showToast({ message: "Tag deleted", variant: "success" }));
//         if (editTagId === tagToBeDeleted.tag_id) {
//           resetForm();
//         }
//       })
//       .catch((error) => {
//         console.error("Failed to delete tag:", error);
//         dispatch(showToast({ message: "Failed to delete tag", variant: "danger" }));
//       });
//   };

//   const handleEditTag = (tag) => {
//     setTagValue(tag.tag);
//     setCurrentEmoji(tag.emoji);
//     setIsEditMode(true);
//     setEditTagId(tag.tag_id);
//   };

//   return (
//     <div
//       className="offcanvas offcanvas-end offcanvas-large"
//       tabIndex={-1}
//       id="groups_offcanvas"
//     >
//       <div className="offcanvas-header border-bottom">
//         <h5 className="fw-semibold">Groups</h5>
//         <button
//           type="button"
//           className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
//           data-bs-dismiss="offcanvas"
//           aria-label="Close"
//         >
//           <i className="ti ti-x" />
//         </button>
//       </div>

//       <div className="offcanvas-body">
//         <form onSubmit={handleAddOrUpdateTag}>
//           <div className="row">
//             <div className="col-md-12">
//               <div className="mb-3 position-relative d-flex gap-3 align-items-center">
//                 <div className="flex-grow-1">
//                   <input
//                     type="text"
//                     value={tagValue}
//                     onChange={(e) => setTagValue(e.target.value)}
//                     className="form-control"
//                     placeholder="Add Group"
//                   />
//                 </div>

//                 <div>
//                   <button
//                     type="button"
//                     className="btn btn-light"
//                     ref={buttonRef}
//                     onClick={() => setShowEmojiPicker((prev) => !prev)}
//                   >
//                     {currentEmoji}
//                   </button>
//                 </div>

//                 {showEmojiPicker && (
//                   <div
//                     ref={pickerRef}
//                     className="emoji-picker-popup"
//                     style={{
//                       position: "absolute",
//                       zIndex: 9999,
//                       top: "100%",
//                       right: 0,
//                     }}
//                   >
//                     <EmojiPicker onEmojiClick={addEmoji} />
//                   </div>
//                 )}

//                 <div>
//                   <button type="submit" className="btn btn-primary">
//                     {isEditMode ? "Update" : "Add"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>

//         <div className="tags-list mt-3">
//           {allTags.map((tag, index) => (
//             <div key={index}>
//               <p
//                 className="groupContainer d-flex justify-content-between align-items-center"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => handleEditTag(tag)}
//               >
//                 <div>
//                   <span className="me-2">{tag.emoji}</span>
//                   <span>{tag.tag}</span>
//                 </div>
//                 <MdCancel
//                   className="groupDeleteIconStyle"
//                   onClick={(e) => {
//                     e.stopPropagation(); // Prevent triggering edit
//                     setTagToBeDeleted(tag);
//                     setOpenGroupDeleteModal(true);
//                   }}
//                 />
//               </p>
//             </div>
//           ))}
//         </div>

//         <Modal show={openGroupDeleteModal} onHide={() => setOpenGroupDeleteModal(false)}>
//           <div className="modal-header border-0 m-0 justify-content-end">
//             <button
//               className="btn-close"
//               onClick={() => setOpenGroupDeleteModal(false)}
//               aria-label="Close"
//             >
//               <i className="ti ti-x" />
//             </button>
//           </div>
//           <div className="modal-body">
//             <div className="success-message text-center">
//               <div className="success-popup-icon bg-danger-light">
//                 <i className="ti ti-trash-x" />
//               </div>
//               <h3>Are you sure you want to delete this group?</h3>
//               <p>This group will be removed from all your contacts.</p>
//               <div className="col-lg-12 text-center modal-btn">
//                 <Link
//                   to="#"
//                   className="btn btn-light"
//                   data-bs-dismiss="modal"
//                   onClick={() => setOpenGroupDeleteModal(false)}
//                 >
//                   Cancel
//                 </Link>
//                 <Link to="#" onClick={handleDeleteTag} className="btn btn-primary">
//                   Delete
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default GroupsOffcanvas;
