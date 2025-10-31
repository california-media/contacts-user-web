import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../../../core/axios/axiosInstance";
import { all_routes } from "../../router/all_routes";
import PlanModal from "./PlanModal";
import LoadingIndicator2 from "../../../core/common/loadingIndicator/LoadingIndicator2";
import { showToast } from "../../../core/data/redux/slices/ToastSlice";
import { Spin, Modal } from "antd";

const ManagePlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState(null);
  const [modalType, setModalType] = useState("add"); // 'add' or 'edit'
  const [planToDelete, setPlanToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/plans");
      if (response.data.success) {
        const sorted = (response.data.data || [])
          .slice()
          .sort((a, b) => (a.price ?? 0) - (b.price ?? 0)); // ascending by price (cents)
        setPlans(sorted);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      dispatch(
        showToast({
          heading: "Error",
          message: "Failed to fetch plans",
          variant: "danger",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = () => {
    setEditingPlan(null);
    setModalType("add");
    setIsPlanModalOpen(true);
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setModalType("edit");
    setIsPlanModalOpen(true);
  };

  const handleDeletePlan = (plan) => {
    setPlanToDelete(plan);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePlan = async () => {
    if (!planToDelete) return;

    try {
      setIsDeleting(true);
      const response = await api.delete(`/admin/plans/${planToDelete._id}`);
      if (response.data.success) {
        setPlans(plans.filter((plan) => plan._id !== planToDelete._id));
        dispatch(
          showToast({
            heading: "Success",
            message: "Plan deleted successfully",
            variant: "success",
          })
        );
        setIsDeleteModalOpen(false);
        setPlanToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
      dispatch(
        showToast({
          heading: "Error",
          message: "Failed to delete plan",
          variant: "danger",
        })
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (planId) => {
    try {
      const response = await api.patch(`/admin/plans/${planId}/status`);
      if (response.data.success) {
        setPlans(
          plans.map((plan) =>
            plan._id === planId ? { ...plan, isActive: !plan.isActive } : plan
          )
        );
        dispatch(
          showToast({
            heading: "Success",
            message: "Plan status updated successfully",
            variant: "success",
          })
        );
      }
    } catch (error) {
      console.error("Error toggling plan status:", error);
      dispatch(
        showToast({
          heading: "Error",
          message: "Failed to update plan status",
          variant: "danger",
        })
      );
    }
  };

  const handleModalSuccess = () => {
    setEditingPlan(null);
    setIsPlanModalOpen(false);
    fetchPlans(); // Refresh the list
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 w-100">
        {" "}
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="page-header">
                <div className="row">
                  <div className="col-sm-6">
                    <h3 className="page-title">Manage Plans</h3>
                    <ul className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link to={all_routes.dashboard}>Dashboard</Link>
                      </li>
                      <li className="breadcrumb-item active">Plans</li>
                    </ul>
                  </div>
                  <div className="col-sm-6 text-end">
                    <button className="btn btn-primary" onClick={handleAddPlan}>
                      <i className="fa fa-plus me-2"></i> Add New Plan
                    </button>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-xl-12 col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="fw-semibold mb-3">Available Plans</h5>
                      <div className="row justify-content-center">
                        {plans.map((plan) => (
                          <div key={plan._id} className="col-lg-6 mb-4">
                            <div
                              className={`card custom-card border  ${
                                !plan.isActive ? "opacity-75" : ""
                              }`}
                            >
                              {!plan.isActive && (
                                <div className="card-header bg-secondary text-secondary text-center">
                                  Inactive
                                </div>
                              )}
                              <div className="card-body pb-0">
                                <div className="text-center border-bottom pb-3 mb-3">
                                  <span className="fw-bold">{plan.name}</span>
                                  <h5 className="d-flex align-items-end justify-content-center fw-bold mt-1">
                                    {plan.price !== undefined &&
                                    plan.price !== null &&
                                    plan.price !== 0
                                      ? "$" + (plan.price / 100).toFixed(2) // convert cents → decimal with 2 places
                                      : "Free"}
                                    {plan.price !== 0 &&
                                      plan.pricePeriod !== "custom" &&
                                      plan.pricePeriod && (
                                        <span className="fs-14 fw-medium ms-2">
                                          / {plan.pricePeriod}
                                        </span>
                                      )}
                                  </h5>

                                  <span>{plan.description}</span>
                                </div>
                                <div className="d-block">
                                  {plan.features &&
                                    plan.features.map((feature, index) => (
                                      <p
                                        key={index}
                                        className="d-flex fs-12 fw-medium text-dark mb-2 align-items-center"
                                      >
                                        <span
                                          className={`${
                                            feature.isAvailable
                                              ? "bg-success"
                                              : "bg-danger"
                                          } d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded`}
                                        >
                                          <i
                                            className={`ti ti-${
                                              feature.isAvailable
                                                ? "check"
                                                : "x"
                                            }`}
                                          />
                                        </span>
                                        {feature.text}
                                      </p>
                                    ))}
                                </div>
                              </div>
                              <div className="text-center mb-3">
                                <button
                                  className="btn btn-primary me-2"
                                  onClick={() => handleEditPlan(plan)}
                                >
                                  <i className="fa fa-edit me-1"></i> Edit
                                </button>
                                {plan.name === "Starter" ||
                                plan.name === "Pro" ? null : (
                                  <button
                                    className="btn btn-secondary me-2"
                                    onClick={() => handleToggleStatus(plan._id)}
                                  >
                                    <i
                                      className={`fa fa-${
                                        plan.isActive ? "times" : "check"
                                      } me-1`}
                                    ></i>
                                    {plan.isActive ? "Deactivate" : "Activate"}
                                  </button>
                                )}
                                {plan.name === "Starter" ||
                                plan.name === "Pro" ? (
                                  <button
                                    className="btn btn-danger"
                                    disabled
                                    title={`Cannot delete ${plan.name} plan - this is a protected plan`}
                                  >
                                    <i className="fa fa-trash me-1"></i> Delete
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-danger"
                                    onClick={() => handleDeletePlan(plan)}
                                  >
                                    <i className="fa fa-trash me-1"></i> Delete
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Modal */}
      <PlanModal
        open={isPlanModalOpen}
        onCancel={() => setIsPlanModalOpen(false)}
        onSuccess={handleModalSuccess}
        plan={editingPlan}
        type={modalType}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={[
          <button
            key="cancel"
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </button>,
          <button
            key="delete"
            type="button"
            className="btn btn-danger"
            onClick={confirmDeletePlan}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Deleting...
              </>
            ) : (
              <>
                <i className="fa fa-trash me-1"></i>
                Delete Plan
              </>
            )}
          </button>,
        ]}
        centered
      >
        <div className="text-center mb-3">
          <i className="fa fa-exclamation-triangle text-warning fs-1 mb-3"></i>
          <h6>Are you sure you want to delete this plan?</h6>
          {planToDelete && (
            <p className="text-muted mb-0">
              Plan: <strong>{planToDelete.name}</strong>
            </p>
          )}
          <p className="text-danger small mt-2">
            This action cannot be undone.
          </p>
        </div>
      </Modal>
    </>
  );
};

export default ManagePlans;
