import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import CollapseHeader from "../../../core/common/collapse-header";
import { SlPeople } from "react-icons/sl";
import { FaTasks } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { myScans } from "../../../core/data/redux/slices/MyScansSlice";
import AvatarInitialStyles from "../../../core/common/nameInitialStyles/AvatarInitialStyles";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { saveContact } from "../../../core/data/redux/slices/ContactSlice";

const route = all_routes;
const MyScans = () => {
  const dispatch = useDispatch();
  const allScans = useSelector((state) => state.myScans);
  console.log(allScans, "allScans");

  useEffect(() => {
    dispatch(myScans());
  }, []);


const handleSaveContact =async(contact)=>{

console.log(contact,"contact to be saved");

const formData = new FormData();


// formData.append("contact_id", formData.contact_id);
    formData.append("contactImage", contact.profileImageURL);
    formData.append("firstname", contact.firstname);
    formData.append("lastname", contact.lastname);
    // formData.append("company", contact.company);
    // formData.append("designation", contact.designation);
    formData.append("emailaddresses", contact.email);
    //  formData.append("phonenumbers", contact.phonenumbers.length>0?contact.phonenumbers:"");
    formData.append("instagram", contact.instagram);
    formData.append("twitter", contact.twitter);
    formData.append("linkedin", contact.linkedin);
    formData.append("facebook", contact.facebook);
    formData.append("telegram", contact.telegram);

console.log(Object.fromEntries(formData),"before saving the contact");


    dispatch(saveContact(formData))
}

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-xl-3 col-lg-12 theiaStickySidebar">
                  {/* Settings Sidebar */}
                  <div className="card">
                    <div className="card-body">
                      <div className="settings-sidebar">
                        <h4 className="fw-semibold mb-3">Settings</h4>
                        <div className="list-group list-group-flush settings-sidebar">
                          <Link to={route.profile} className="fw-medium">
                            Profile
                          </Link>
                          <Link to={route.security} className="fw-medium">
                            Security
                          </Link>
                          <Link to={route.emailSetup} className="fw-medium">
                            Connected Mails
                          </Link>
                          <Link to={route.myScans} className="fw-medium active">
                            My Scans
                          </Link>
                          <Link to={route.upgradePlan} className="fw-medium">
                            Upgrade Plan
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Settings Sidebar */}
                </div>
                <div className="col-xl-9 col-lg-12">
                  {/* Settings Info */}
                  <div className="card">
                    <div className="card-body">
                      <h4 className="fw-semibold mb-3">My Scans</h4>
                      <div className="card mb-3">
                        <div className="card-body pb-0">
                          <ul
                            className="nav nav-tabs nav-tabs-bottom"
                            role="tablist"
                          >
                            <li className="nav-item" role="presentation">
                              <Link
                                to="#"
                                data-bs-toggle="tab"
                                data-bs-target="#myScans"
                                className="nav-link active"
                              >
                                <FaTasks className="me-2" />
                                My Scans
                              </Link>
                            </li>
                            <li className="nav-item" role="presentation">
                              <Link
                                to="#"
                                data-bs-toggle="tab"
                                data-bs-target="#scannedMe"
                                className="nav-link"
                              >
                                <SlPeople className="me-2" />
                                Scanned Me
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="tab-content pt-0">
                        <div className="tab-pane fade show active" id="myScans">
                          <div className="card">
                            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                              <h4 className="fw-semibold">My Scans</h4>
                              <div></div>
                            </div>
                            {allScans
                                  .filter((scan) => scan.iScanned === true).length>0?<div className="row mt-5 px-5">
                             
                                {allScans
                                  .filter((scan) => scan.iScanned === true)
                                  .map((scan) => {
                                    const phone = `+${scan?.phonenumbers[0]}`;
                                    
                                    const phoneNumber =
                                    parsePhoneNumberFromString(phone);
                                    console.log(scan,"gfasjgdaj");
                                    const country =
                                      phoneNumber?.country?.toLowerCase();
                                    return (
                                      <div
                                        className="col-md-3 mb-3"
                                        key={scan.id}
                                      >
                                        <div className="card">
                                          <div className="card-body">
                                            {/* {scan.profileImageURL ? (
                                            <AvatarInitialStyles
                                              name={`${scan.firstname} ${scan.lastname}`}
                                            />
                                          ) : (
                                            <img
                                              src={scan.profileImageURL}
                                              alt="Profile Image"
                                              className="rounded-circle mb-2"
                                              style={{
                                                width: "80px",
                                                height: "80px",
                                                objectFit: "cover",
                                              }}
                                            />
                                          )} */}
                                            <h5 className="fw-bold">
                                              <div className="d-flex align-items-center">
                                                {" "}
                                                <span className="text-capitalize">
                                                  {scan.firstname} {scan.lastname}
                                                </span>
                                              </div>
                                            </h5>
                                            <h6 className="text-lowercase">
                                              <div className="d-flex align-items-center">
                                                <i class="fa-regular fa-envelope me-2"></i>
                                                <a href={`mailto:${scan.email}`}>
                                                  {" "}
                                                  {scan.email}
                                                </a>
                                              </div>
                                            </h6>
                                            {/* <h6 className="text-lowercase">
                                            <div className="d-flex align-items-center">
                                            <img src="/assets/img/icons/uaeFlag.png" width={15} className="me-1"/>
                                             <a href={`tel:+${scan.phonenumbers[0]}`}>+ {scan.phonenumbers[0]}</a>
                                            </div>
                                          </h6> */}
  
                                            <h6 className="text-lowercase">
                                              <div className="d-flex align-items-center">
                                                {country && (
                                                  <img
                                                    src={`https://flagcdn.com/24x18/${country}.png`}
                                                    width={15}
                                                    className="me-1"
                                                    alt={country}
                                                  />
                                                )}
                                                <a
                                                  href={`tel:+${scan.phonenumbers[0]}`}
                                                >
                                                  +{scan.phonenumbers[0]}
                                                </a>
                                              </div>
                                            </h6>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                              
                            </div>:
                            <div className="fw-bold d-flex justify-content-center align-items-center" style={{height:100}}>No Scans</div>
                            }
                          </div>
                        </div>
                        <div className="tab-pane " id="scannedMe">
                          <div className="card">
                            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                              <h4 className="fw-semibold">Scanned Me</h4>
                              <div className="d-inline-flex align-items-center"></div>
                            </div>
                            {allScans
                                  .filter((scan) => scan.iScanned === false).length>0?<div className="row mt-5">
                              {allScans
                                .filter((scan) => scan.iScanned === false)
                                .map((scan) => {
                                  console.log(scan,"scansfhds");
                                  
                                  const phone = `+${scan.phonenumbers[0]}`;
                                  const phoneNumber =
                                    parsePhoneNumberFromString(phone);
                                  const country =
                                    phoneNumber?.country?.toLowerCase();
                                  return (
                                    <div
                                      className="col-md-3 mb-3"
                                      key={scan.id}
                                    >
                                      <div className="card">
                                        <div className="card-body overflow-x-auto no-scrollbar">
                                          {/* {scan.profileImageURL ? (
                                          <AvatarInitialStyles
                                            name={`${scan.firstname} ${scan.lastname}`}
                                          />
                                        ) : (
                                          <img
                                            src={scan.profileImageURL}
                                            alt="Profile Image"
                                            className="rounded-circle mb-2"
                                            style={{
                                              width: "80px",
                                              height: "80px",
                                              objectFit: "cover",
                                            }}
                                          />
                                        )} */}
                                          <h5 className="fw-bold d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                              <span className="text-capitalize">
                                                {scan.firstname} {scan.lastname}
                                              </span>
                                            </div>
                                            <button className="btn btn-sm btn-primary d-inline" onClick={()=>{handleSaveContact(scan)}}>
                                      <i class="fa-solid fa-floppy-disk me-2 text-light"></i>{" "}
                                     Save
                                    </button>
                                          </h5>
                                          <h6 className="text-lowercase">
                                            <div className="d-flex align-items-center">
                                              <i class="fa-regular fa-envelope me-2"></i>
                                              <a href={`mailto:${scan.email}`}>
                                                {" "}
                                                {scan.email}
                                              </a>
                                            </div>
                                          </h6>
                                          {scan.phonenumbers.length>0 &&<h6 className="text-lowercase">
                                            <div className="d-flex align-items-center">
                                              {country && (
                                                <img
                                                  src={`https://flagcdn.com/24x18/${country}.png`}
                                                  width={15}
                                                  className="me-1"
                                                  alt={country}
                                                />
                                              )}
                                              <a
                                                href={`tel:+${scan.phonenumbers[0]}`}
                                              >
                                                +{scan.phonenumbers[0]}
                                              </a>
                                            </div>
                                          </h6>}
                                           
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}

                              
                              {/* {allScans
                                .filter((scan) => scan.iScanned === true)
                                .map((scan) => (
                                  <div className="col-md-4 mb-3" key={scan.id}>
                                    <div className="card">
                                      <div className="card-body text-center">
                                        <img
                                          src={scan.profileImageURL}
                                          alt="Profile"
                                          className="rounded-circle mb-2"
                                          style={{
                                            width: "80px",
                                            height: "80px",
                                            objectFit: "cover",
                                          }}
                                        />
                                        <h5 className="card-title text-lowercase">
                                          {scan.email}
                                        </h5>
                           
                                      </div>
                                    </div>
                                  </div>
                                ))} */}
                            </div>:
                            <div className="fw-bold d-flex justify-content-center align-items-center" style={{height:100}}>No Scans</div>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Settings Info */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* Delete Account */}
      <div
        className="modal custom-modal fade"
        id="delete_account"
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
                <div className="success-popup-icon">
                  <i className="ti ti-trash-x" />
                </div>
                <h3>Delete Account</h3>
                <p className="del-info">Are you sure want to delete?</p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link to={route.security} className="btn btn-danger">
                    Yes, Delete it
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Account */}
    </div>
  );
};

export default MyScans;
