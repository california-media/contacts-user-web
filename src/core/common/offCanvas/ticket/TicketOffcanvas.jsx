import React, { useState } from 'react'
import CreatableSelect from 'react-select/creatable';
import Select from "react-select";


import { leadsData } from '../../../data/json/leads';
import DatePicker from "react-datepicker";
import DefaultEditor from "react-simple-wysiwyg";
import { Link } from 'react-router-dom';
import { Modal } from "react-bootstrap";
import { all_routes } from '../../../../feature-module/router/all_routes';
import {
    priorityList,
    project,
    tagInputValues,
    companyName,
    dealType,
    dealStage,
    all_tags,
    optionsource,
    owner as companyEmployee
} from '../../selectoption/selectoption';

const TicketOffcanvas = () => {
    const route = all_routes;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDate1, setSelectedDate1] = useState(new Date());
    const [openModal, setOpenModal] = useState(false);


    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    const handleDateChange1 = (date) => {
        setSelectedDate1(date);
    };
    const contactNames = [...new Set(leadsData.map((lead) => lead.lead_name))].map((name) => ({
        label: name,
        value: name,
    }));

    return (
        <>
            <div
                className="offcanvas offcanvas-end offcanvas-large"
                tabIndex={-1}
                id="ticket_offcanvas"
            >
                <div className="offcanvas-header border-bottom">
                    <h5 className="fw-semibold">Create New Ticket</h5>
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
                                        Subject <span className="text-danger">*</span>
                                    </label>
                                    <input type="text" className="form-control" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Name <span className="text-danger">*</span>
                                    </label>
                                    <input type="text" className="form-control" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Email <span className="text-danger">*</span>
                                    </label>
                                    <input type="text" className="form-control" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Assign to <span className="text-danger">*</span>
                                    </label>
                                    <CreatableSelect
                                        classNamePrefix="react-select"
                                        options={contactNames}

                                        className="js-example-placeholder-multiple select2 js-states"
                                        isMulti={true}
                                        placeholder="Select Contacts"
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
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Department <span className="text-danger">*</span>
                                    </label>
                                    <input type="text" className="form-control" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        CC
                                    </label>
                                    <input type="text" className="form-control" />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <label className="col-form-label">
                                        Tags
                                    </label>
                                    <CreatableSelect
                                        classNamePrefix="react-select"
                                        options={all_tags}
                                        className="js-example-placeholder-multiple select2 js-states"
                                        isMulti={true}
                                        placeholder="Select Contacts"
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
            <Modal show={openModal} onHide={() => setOpenModal(false)}>
                <div className="modal-header border-0 m-0 justify-content-end">
                    <button
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={() => setOpenModal(false)}
                    >
                        <i className="ti ti-x" />
                    </button>
                </div>
                <div className="modal-body">
                    <div className="success-message text-center">
                        <div className="success-popup-icon bg-light-blue">
                            <i className="ti ti-medal" />
                        </div>
                        <h3>Ticket Created Successfully!!!</h3>
                        <p>View the details of ticket, created</p>
                        <div className="col-lg-12 text-center modal-btn">
                            <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                                Cancel
                            </Link>
                            <Link to={route.leads} className="btn btn-primary">
                                View Details
                            </Link>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default TicketOffcanvas