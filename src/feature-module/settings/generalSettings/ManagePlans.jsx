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

  // Expiry days configuration (now an array)
  const [daysBeforeExpiry, setDaysBeforeExpiry] = useState([7]);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);

  // Email template configuration
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [loadingEmailTemplate, setLoadingEmailTemplate] = useState(false);
  const [savingEmailTemplate, setSavingEmailTemplate] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchPlans();
    fetchExpiryConfiguration();
    fetchEmailTemplate();
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

  const fetchExpiryConfiguration = async () => {
    try {
      setLoadingConfig(true);
      const response = await api.get(
        "/admin/configuration/subscription-expiry"
      );
      console.log("=== FETCH EXPIRY CONFIG ===");
      console.log("Response:", response.data);
      if (response.data.status === "success") {
        const days = response.data.data.days_before_expiry || [7];
        const daysArray = Array.isArray(days) ? days : [days];
        console.log("Setting days to:", daysArray);
        setDaysBeforeExpiry(daysArray);
      }
    } catch (error) {
      console.error("Error fetching expiry configuration:", error);
      setDaysBeforeExpiry([7]);
    } finally {
      setLoadingConfig(false);
    }
  };

  const fetchEmailTemplate = async () => {
    try {
      setLoadingEmailTemplate(true);
      const response = await api.get("/admin/configuration/subscription-email");
      console.log("=== FETCH EMAIL TEMPLATE ===");
      console.log("Response:", response.data);
      if (response.data.status === "success") {
        setEmailSubject(response.data.data.subject || "");
        setEmailBody(response.data.data.body || "");
      }
    } catch (error) {
      console.error("Error fetching email template:", error);
    } finally {
      setLoadingEmailTemplate(false);
    }
  };

  const handleAddDay = () => {
    setDaysBeforeExpiry([...daysBeforeExpiry, ""]);
  };

  const handleRemoveDay = (index) => {
    if (daysBeforeExpiry.length === 1) {
      dispatch(
        showToast({
          heading: "Validation Error",
          message: "At least one day value is required",
          variant: "warning",
        })
      );
      return;
    }
    const newDays = daysBeforeExpiry.filter((_, i) => i !== index);
    setDaysBeforeExpiry(newDays);
  };

  const handleDayChange = (index, value) => {
    const newDays = [...daysBeforeExpiry];
    newDays[index] = value;
    setDaysBeforeExpiry(newDays);
  };

  const validateDaysArray = () => {
    // Check for empty values
    if (
      daysBeforeExpiry.some(
        (day) => day === "" || day === null || day === undefined
      )
    ) {
      dispatch(
        showToast({
          heading: "Validation Error",
          message: "Please fill in all day values or remove empty cells",
          variant: "warning",
        })
      );
      return false;
    }

    // Validate each value
    const validatedDays = [];
    for (const day of daysBeforeExpiry) {
      const dayValue = parseInt(day);
      if (isNaN(dayValue) || dayValue < 1 || dayValue > 90) {
        dispatch(
          showToast({
            heading: "Validation Error",
            message: "Each day value must be between 1 and 90",
            variant: "warning",
          })
        );
        return false;
      }
      validatedDays.push(dayValue);
    }

    // Check for duplicates
    const uniqueDays = [...new Set(validatedDays)];
    if (uniqueDays.length !== validatedDays.length) {
      dispatch(
        showToast({
          heading: "Validation Error",
          message: "Duplicate day values are not allowed",
          variant: "warning",
        })
      );
      return false;
    }

    return validatedDays;
  };

  const handleSaveExpiryConfiguration = async () => {
    const validatedDays = validateDaysArray();
    if (!validatedDays) return;

    try {
      setSavingConfig(true);
      const response = await api.put(
        "/admin/configuration/subscription-expiry",
        {
          days_before_expiry: validatedDays,
        }
      );

      console.log("=== SAVE EXPIRY CONFIG ===");
      console.log("Response:", response.data);
      if (response.data.status === "success") {
        // Update local state with sorted values
        setDaysBeforeExpiry(response.data.data.days_before_expiry);
        dispatch(
          showToast({
            heading: "Success",
            message:
              "Subscription expiry days configuration updated successfully",
            variant: "success",
          })
        );
      }
    } catch (error) {
      console.error("Error saving expiry configuration:", error);
      dispatch(
        showToast({
          heading: "Error",
          message:
            error.response?.data?.message || "Failed to update configuration",
          variant: "danger",
        })
      );
    } finally {
      setSavingConfig(false);
    }
  };

  const handleSaveEmailTemplate = async () => {
    if (!emailSubject || !emailSubject.trim()) {
      dispatch(
        showToast({
          heading: "Validation Error",
          message: "Email subject is required",
          variant: "warning",
        })
      );
      return;
    }

    if (!emailBody || !emailBody.trim()) {
      dispatch(
        showToast({
          heading: "Validation Error",
          message: "Email body is required",
          variant: "warning",
        })
      );
      return;
    }

    try {
      setSavingEmailTemplate(true);
      const response = await api.put(
        "/admin/configuration/subscription-email",
        {
          subject: emailSubject.trim(),
          body: emailBody.trim(),
        }
      );

      console.log("=== SAVE EMAIL TEMPLATE ===");
      console.log("Response:", response.data);
      if (response.data.status === "success") {
        dispatch(
          showToast({
            heading: "Success",
            message: "Email template updated successfully",
            variant: "success",
          })
        );
      }
    } catch (error) {
      console.error("Error saving email template:", error);
      dispatch(
        showToast({
          heading: "Error",
          message:
            error.response?.data?.message || "Failed to update email template",
          variant: "danger",
        })
      );
    } finally {
      setSavingEmailTemplate(false);
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
              {/* Subscription Expiry Alert Configuration */}
              <div className="row mb-4">
                <div className="col-xl-12 col-lg-12">
                  <div className="card">
                    <div className="card-body" style={{ padding: "2rem" }}>
                      <h5 className="fw-semibold mb-3">
                        <i className="fa fa-bell me-2"></i>
                        Subscription Expiry Alert Days Configuration
                      </h5>
                      <p className="text-muted  mb-3">
                        Configure multiple days before subscription expiry when
                        users should receive email alerts. You can add multiple
                        reminder days (e.g., 7 days, 3 days, 1 day before
                        expiry).
                      </p>

                      {loadingConfig ? (
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{ minHeight: "200px" }}
                        >
                          <Spin size="large" />
                        </div>
                      ) : (
                        <div className="row">
                          <div className="col-md-12">
                            <label className="form-label fw-medium mb-3">
                              Alert Days (1-90)
                              <span className="text-danger">*</span>
                            </label>

                            {daysBeforeExpiry.map((day, index) => (
                              <div
                                key={index}
                                className="d-flex align-items-center mb-3"
                              >
                                <div
                                  className="flex-grow-1"
                                  style={{ maxWidth: "300px" }}
                                >
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={day}
                                    onChange={(e) =>
                                      handleDayChange(index, e.target.value)
                                    }
                                    min="1"
                                    max="90"
                                    placeholder="Enter days (1-90)"
                                    disabled={loadingConfig || savingConfig}
                                  />
                                </div>
                                <button
                                  className="btn btn-outline-danger btn-sm ms-2"
                                  onClick={() => handleRemoveDay(index)}
                                  disabled={
                                    loadingConfig ||
                                    savingConfig ||
                                    daysBeforeExpiry.length === 1
                                  }
                                  title="Remove this day"
                                >
                                  <i className="fa fa-trash"></i>
                                </button>
                              </div>
                            ))}

                            <button
                              className="btn btn-outline-primary btn-sm mb-3"
                              onClick={handleAddDay}
                              disabled={loadingConfig || savingConfig}
                            >
                              <i className="fa fa-plus me-2"></i>
                              Add Another Day
                            </button>

                            <div
                              className="alert alert-info py-2 px-3 mb-3 d-flex align-items-start"
                              role="alert"
                            >
                              <i className="fa fa-info-circle me-2"></i>
                              <p>
                                Users will receive alerts on:{" "}
                                <strong>
                                  {daysBeforeExpiry
                                    .filter((d) => d !== "" && d !== null)
                                    .map((d) => `${d} day${d != 1 ? "s" : ""}`)
                                    .join(", ") || "Not set"}
                                </strong>{" "}
                                before expiry
                              </p>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <button
                              className="btn btn-primary"
                              onClick={handleSaveExpiryConfiguration}
                              disabled={loadingConfig || savingConfig}
                            >
                              {savingConfig ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2"></span>
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <i className="fa fa-save me-2"></i>
                                  Save Alert Days
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Template Configuration */}
              <div className="row mb-4">
                <div className="col-xl-12 col-lg-12">
                  <div className="card">
                    <div className="card-body" style={{ padding: "2rem" }}>
                      <h5 className="fw-semibold mb-3">
                        <i className="fa fa-envelope me-2"></i>
                        Subscription Expiry Email Template
                      </h5>
                      <p className="text-muted  mb-3">
                        Customize the message content of the email sent to users
                        when their subscription is about to expire. The email
                        will automatically include the logo, upgrade button, and
                        footer.
                      </p>
                      <div
                        className="alert alert-info py-2 px-3 mb-3 d-flex align-items-start"
                        role="alert"
                      >
                        <i className="fa fa-info-circle me-2"></i>
                        <span>
                          <strong>Available placeholders:</strong>{" "}
                          <code>{"{{userName}}"}</code>,{" "}
                          <code>{"{{planName}}"}</code>,{" "}
                          <code>{"{{expiryDate}}"}</code>,{" "}
                          <code>{"{{daysLeft}}"}</code>
                          <br />
                          <strong>Note:</strong> The email body supports HTML.
                          You can use tags like <code>&lt;p&gt;</code>,{" "}
                          <code>&lt;strong&gt;</code>,{" "}
                          <code>&lt;div class="highlight"&gt;</code>,{" "}
                          <code>&lt;div class="benefits"&gt;</code>, etc.
                        </span>
                      </div>

                      {loadingEmailTemplate ? (
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{ minHeight: "300px" }}
                        >
                          <Spin size="large" />
                        </div>
                      ) : (
                        <div className="row">
                          <div className="col-md-12 mb-3">
                            <label className="form-label fw-medium">
                              Email Subject
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={emailSubject}
                              onChange={(e) => setEmailSubject(e.target.value)}
                              placeholder="e.g., Your Subscription is Expiring Soon"
                              disabled={
                                loadingEmailTemplate || savingEmailTemplate
                              }
                            />
                          </div>

                          <div className="col-md-12 mb-3">
                            <label className="form-label fw-medium">
                              Email Message Content (HTML)
                              <span className="text-danger">*</span>
                            </label>
                            <textarea
                              className="form-control"
                              rows="15"
                              value={emailBody}
                              onChange={(e) => setEmailBody(e.target.value)}
                              placeholder={`<p>Hi {{userName}},</p>
<p>Your <strong>{{planName}}</strong> subscription is ending soon—just <strong>{{daysLeft}}</strong> day(s) left!</p>
<div class="highlight">
  <strong>Your subscription will expire on {{expiryDate}}</strong>
</div>
<p>Don't lose access to your premium features!</p>

<div class="benefits">
  <p><strong>Why Continue?</strong></p>
  <ul>
    <li>Unlimited contacts and advanced management</li>
    <li>Seamless integrations with Gmail, Outlook, iCloud & more</li>
    <li>Digital business cards and QR code sharing</li>
    <li>Advanced analytics and insights</li>
  </ul>
</div>
<p><strong>Ready to continue?</strong></p>`}
                              disabled={
                                loadingEmailTemplate || savingEmailTemplate
                              }
                              style={{
                                fontFamily: "monospace",
                                fontSize: "13px",
                              }}
                            />
                            <span className="text-muted mt-1">
                              This content will be inserted into the styled
                              email template (with logo, upgrade button, and
                              footer automatically included).
                            </span>
                          </div>

                          <div className="col-md-12">
                            <button
                              className="btn btn-primary"
                              onClick={handleSaveEmailTemplate}
                              disabled={
                                loadingEmailTemplate || savingEmailTemplate
                              }
                            >
                              {savingEmailTemplate ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2"></span>
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <i className="fa fa-save me-2"></i>
                                  Save Email Template
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
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
