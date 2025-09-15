// components/admin/PlanModal.js
import React, { useState, useEffect } from "react";
import { Modal } from "bootstrap";
import ReactDOM from "react-dom";
import api from "../../../core/axios/axiosInstance";
import { showToast } from "../../../core/data/redux/slices/ToastSlice";
import { useDispatch } from "react-redux";

const PlanModal = ({ onSuccess, plan, type }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    pricePeriod: "month",
    description: "",
    shortDescription: "",
    features: [],
    isPopular: false,
    isActive: true,
  });

  const [newFeature, setNewFeature] = useState({
    text: "",
    isAvailable: true,
    isHighlighted: false,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (type === "edit" && plan) {
      setFormData({
        name: plan.name || "",
        price: plan.price ? (plan.price / 100).toFixed(2) : "",
        pricePeriod: plan.pricePeriod || "month",
        description: plan.description || "",
        shortDescription: plan.shortDescription || "",
        features: plan.features || [],
        isPopular: plan.isPopular || false,
        isActive: plan.isActive !== undefined ? plan.isActive : true,
      });
    } else {
      // Reset form for add
      setFormData({
        name: "",
        price: 0,
        pricePeriod: "month",
        description: "",
        shortDescription: "",
        features: [],
        isPopular: false,
        isActive: true,
      });
    }
  }, [plan, type]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFeatureChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewFeature((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addFeature = () => {
    if (newFeature.text.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, { ...newFeature }],
      }));
      setNewFeature({ text: "", isAvailable: true, isHighlighted: false });
    }
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // convert price to cents before sending
      const payload = {
        ...formData,
        price: Math.round(parseFloat(formData.price) * 100), // 9.99 → 999
      };
      console.log(payload);

      if (type === "add") {
        await api.post("/admin/plans", payload);
        dispatch(
          showToast({
            heading: "Success",
            message: "Plan created successfully!",
            variant: "success",
          })
        );
      } else {
        await api.put(`/admin/plans/${plan._id}`, payload);
        dispatch(
          showToast({
            heading: "Success",
            message: "Plan updated successfully!",
            variant: "success",
          })
        );
      }

      // ✅ Properly close modal (removes backdrop too)
      const modalEl = document.getElementById("plan_modal");
      const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
      modal.hide();

      onSuccess();
    } catch (error) {
      console.error("Error saving plan:", error);
      dispatch(
        showToast({
          heading: "Error",
          message: error.response?.data?.message || "Failed to save plan",
          variant: "danger",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Modal */}
      <div className="modal fade " id="plan_modal">
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {type === "add" ? "Add New Plan" : "Edit Plan"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                disabled={loading}
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div
                className="modal-body "
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                <div className="row gy-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Plan Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={
                          loading ||
                          (type === "edit" &&
                            (plan?.name === "Starter" || plan?.name === "Pro"))
                        }
                        title={
                          type === "edit" &&
                          (plan?.name === "Starter" || plan?.name === "Pro")
                            ? `Cannot edit the name of ${plan?.name} plan - this is a protected plan`
                            : ""
                        }
                      />
                      {type === "edit" &&
                        (plan?.name === "Starter" || plan?.name === "Pro") && (
                          <small className="text-muted">
                            Note: The name of {plan?.name} plan cannot be
                            modified as it's a protected plan.
                          </small>
                        )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Price *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        placeholder="e.g., 9.99"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Price Period</label>
                      <select
                        className="form-control"
                        name="pricePeriod"
                        value={formData.pricePeriod}
                        onChange={handleInputChange}
                        disabled={loading}
                      >
                        <option value="month">Monthly</option>
                        <option value="year">Yearly</option>
                        <option value="lifetime">Lifetime</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea
                        required
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="2"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Features Section */}
                  <div className="col-md-12 mt-3">
                    <div className="card">
                      <div className="card-header">
                        <h6 className="mb-0">Features</h6>
                      </div>
                      <div className="card-body">
                        <div className="row align-items-end mb-3">
                          {/* Feature Text */}
                          <div className="col-md-7">
                            <label className="form-label">Feature Text</label>
                            <div className="d-flex align-items-baseline gap-3">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter feature description"
                                name="text"
                                value={newFeature.text}
                                onChange={handleFeatureChange}
                                disabled={loading}
                              />
                              <div className="form-check form-switch d-flex align-items-start mt-2">
                                <input
                                  type="checkbox"
                                  className="form-check-input me-2 "
                                  name="isAvailable"
                                  checked={newFeature.isAvailable}
                                  onChange={handleFeatureChange}
                                  disabled={loading}
                                  id="featureAvailable"
                                />
                                <label
                                  className="form-check-label mb-0"
                                  htmlFor="featureAvailable"
                                >
                                  Available
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Checkbox */}

                          {/* Add Button */}
                          <div className="col-2 ms-auto">
                            <button
                              type="button"
                              className="btn btn-primary w-100"
                              onClick={addFeature}
                              disabled={loading || !newFeature.text.trim()}
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        <div className="features-list">
                          {formData.features.map((feature, index) => (
                            <div
                              key={index}
                              className="d-flex align-items-center mb-2 p-2 border rounded"
                            >
                              <span
                                className={`me-2 ${
                                  feature.isAvailable
                                    ? "text-success"
                                    : "text-danger"
                                }`}
                              >
                                <i
                                  className={`fa fa-${
                                    feature.isAvailable ? "check" : "times"
                                  }`}
                                />
                              </span>
                              <span className="flex-grow-1">
                                {feature.text}
                              </span>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => removeFeature(index)}
                                disabled={loading}
                              >
                                <i className="fa fa-trash" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Popular Plan Toggle */}
                  <div className="col-md-6 mt-3">
                    <div className="form-check form-switch">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="isPopular"
                        checked={formData.isPopular}
                        onChange={handleInputChange}
                        disabled={loading}
                        role="switch"
                      />
                      <label className="form-check-label">
                        Mark as Popular Plan
                      </label>
                    </div>
                  </div>

                  {/* Active Status Toggle */}
                  <div className="col-md-6 mt-3">
                    <div className="form-check form-switch">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        disabled={
                          loading ||
                          (type === "edit" &&
                            (plan?.name === "Starter" || plan?.name === "Pro"))
                        }
                        role="switch"
                      />
                      <label className="form-check-label">Active Plan</label>
                    </div>
                    {type === "edit" &&
                      (plan?.name === "Starter" || plan?.name === "Pro") && (
                        <small className="text-muted">
                          Note: The active status of {plan?.name} plan cannot be
                          modified as it's a protected plan.
                        </small>
                      )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={loading}
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  // data-bs-dismiss="modal"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      {type === "add" ? "Creating..." : "Updating..."}
                    </>
                  ) : type === "add" ? (
                    "Create Plan"
                  ) : (
                    "Update Plan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanModal;
