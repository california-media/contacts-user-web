import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, Spinner } from "react-bootstrap";
import api from "../../../core/axios/axiosInstance";
import { showToast } from "../../../core/data/redux/slices/ToastSlice";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import "./upgradePlan.css";

// Load Stripe
const stripePromise = loadStripe(
  "pk_test_51JM78KBtOBT8b78eKkjaaXWTEBvsBvmV1VYV3kaRXVgjCYNVLUPK7MNPQEpHgdihSUOtPEfG8WPsVqoHgBBsev2600RynHqIML"
);

// Checkout Form Component
const CheckoutForm = ({ clientSecret, onSuccess, onCancel, planDetails }) => {
  const fetchClientSecret = () => {
    // Return the clientSecret directly since it's passed as prop
    return Promise.resolve(clientSecret);
  };

  return (
    <div>
      <div className="mb-3">
        <h5>Complete your upgrade to {planDetails.name}</h5>
        <p className="text-muted">
          Amount: ${(planDetails.price / 100).toFixed(2)}/month
        </p>
      </div>

      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret,
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

const UpgradePlan = () => {
  const route = all_routes;
  const userProfile = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [upgradePreview, setUpgradePreview] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Fetch plans on component mount
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get("/plans/get");
      if (response.data.success) {
        setPlans(response.data.plans);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      dispatch(
        showToast({
          type: "error",
          message: "Failed to load plans",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPlan = () => {
    console.log("Current user plan:", userProfile?.plan);
    return userProfile?.plan;
  };

  const getCurrentPlanPrice = () => {
    return getCurrentPlan()?.price || 0;
  };

  const isCurrentPlan = (plan) => {
    const currentPlan = getCurrentPlan();
    return currentPlan && currentPlan._id === plan._id;
  };

  const canUpgrade = (plan) => {
    const currentPrice = getCurrentPlanPrice();
    console.log("Comparing plan prices:", plan, ">", currentPrice);
    return plan.price > currentPrice;
  };

  const isDowngrade = (plan) => {
    const currentPrice = getCurrentPlanPrice();
    return plan.price < currentPrice && plan.price > 0;
  };

  const isStarterPlan = (plan) => {
    return plan.price === 0 || plan.name.toLowerCase().includes("starter");
  };

  const fetchUpgradePreview = async (plan) => {
    try {
      const response = await api.post("/user/payment/preview-upgrade", {
        planId: plan._id,
      });

      if (response.data.success) {
        return response.data.preview;
      } else {
        throw new Error(response.data.message || "Failed to fetch preview");
      }
    } catch (error) {
      console.error("Error fetching upgrade preview:", error);
      throw error;
    }
  };

  const handleUpgrade = async (plan) => {
    try {
      setPaymentLoading(true);
      console.log("Selected plan for upgrade:", plan);
      setSelectedPlan(plan);

      // Check if user has an active subscription (not on Starter plan)
      const currentPlan = getCurrentPlan();
      const isOnStarterPlan =
        !currentPlan ||
        currentPlan.name === "Starter" ||
        currentPlan.name?.toLowerCase().includes("starter");

      console.log("Current plan:", currentPlan);
      console.log("Is on Starter plan:", isOnStarterPlan);

      if (!isOnStarterPlan) {
        // User has active subscription (not Starter) - show preview first
        console.log(
          "User has active subscription, fetching upgrade preview..."
        );

        try {
          const preview = await fetchUpgradePreview(plan);
          setUpgradePreview(preview);
          setShowConfirmationModal(true);
          setPaymentLoading(false); // Stop loading since we're showing modal
          return; // Exit here, actual upgrade happens after confirmation
        } catch (previewError) {
          console.error("Error fetching preview:", previewError);
          dispatch(
            showToast({
              type: "error",
              message:
                previewError.response?.data?.message ||
                "Failed to calculate upgrade cost",
            })
          );
          setPaymentLoading(false);
          return;
        }
      } else {
        // User is on Starter plan (no active subscription) - use checkout session
        console.log(
          "User is on Starter plan, creating new subscription via checkout..."
        );

        const response = await api.post(
          "/user/payment/create-checkout-session",
          {
            planId: plan._id,
            autoRenewal: true,
          }
        );

        if (response.data.success) {
          // Check if client secret is provided
          if (response.data.clientSecret) {
            setClientSecret(response.data.clientSecret);
            setShowPaymentModal(true);
          } else {
            // Subscription was activated immediately
            dispatch(
              showToast({
                type: "success",
                message:
                  response.data.message ||
                  `Successfully subscribed to ${plan.name}!`,
              })
            );
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          }
        } else {
          // Check if we should redirect to upgrade instead
          if (response.data.redirectToUpgrade) {
            dispatch(
              showToast({
                type: "info",
                message: "Detected active subscription. Upgrading directly...",
              })
            );
            // Retry with upgrade endpoint
            return handleUpgrade(plan);
          }

          dispatch(
            showToast({
              type: "error",
              message:
                response.data.message || "Failed to create checkout session",
            })
          );
        }
      }
    } catch (error) {
      console.error("Error handling plan upgrade:", error);

      // Check if the error suggests we should use upgrade instead
      if (error.response?.data?.redirectToUpgrade) {
        dispatch(
          showToast({
            type: "info",
            message: "Detected existing subscription. Upgrading directly...",
          })
        );
        // Retry with different approach (this prevents infinite loops)
        try {
          const response = await api.post(
            "/user/payment/upgrade-subscription",
            {
              planId: plan._id,
              autoRenewal: true,
            }
          );

          if (response.data.success) {
            dispatch(
              showToast({
                type: "success",
                message:
                  response.data.message ||
                  `Successfully upgraded to ${plan.name}!`,
              })
            );
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          }
        } catch (upgradeError) {
          console.error("Error with direct upgrade:", upgradeError);
          dispatch(
            showToast({
              type: "error",
              message:
                upgradeError.response?.data?.message ||
                "Failed to upgrade subscription",
            })
          );
        }
      } else {
        dispatch(
          showToast({
            type: "error",
            message:
              error.response?.data?.message || "Failed to process upgrade",
          })
        );
      }
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedPlan) return;

    try {
      setPaymentLoading(true);
      setShowConfirmationModal(false);

      const response = await api.post("/user/payment/upgrade-subscription", {
        planId: selectedPlan._id,
        autoRenewal: true,
      });

      if (response.data.success) {
        dispatch(
          showToast({
            type: "success",
            message:
              response.data.message ||
              `Successfully upgraded to ${selectedPlan.name}!`,
          })
        );

        // Refresh user profile to show updated plan
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        dispatch(
          showToast({
            type: "error",
            message: response.data.message || "Failed to upgrade subscription",
          })
        );
      }
    } catch (error) {
      console.error("Error confirming upgrade:", error);
      dispatch(
        showToast({
          type: "error",
          message: error.response?.data?.message || "Failed to process upgrade",
        })
      );
    } finally {
      setPaymentLoading(false);
      setUpgradePreview(null);
      setSelectedPlan(null);
    }
  };

  const handleCancelUpgrade = () => {
    setShowConfirmationModal(false);
    setUpgradePreview(null);
    setSelectedPlan(null);
    setPaymentLoading(false);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setClientSecret("");
    setSelectedPlan(null);
    // Refresh user profile to get updated plan
    // window.location.reload();
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    setClientSecret("");
    setSelectedPlan(null);
  };

  const renderPlanCard = (plan) => (
    <div key={plan._id} className="col-lg-6 mb-4">
      <div
        className={`card custom-card border ${
          isCurrentPlan(plan) ? "plan-card-current" : ""
        }`}
      >
        {isCurrentPlan(plan) && (
          <div className="ribbon ribbon-top-right">
            <span>Current Plan</span>
          </div>
        )}

        <div className="card-body pb-0">
          <div className="text-center border-bottom pb-3 mb-3">
            <span className="fw-semibold">{plan.name}</span>
            <h5 className="d-flex align-items-end justify-content-center fw-bold mt-1">
              {plan.price === 0 ? (
                "FREE"
              ) : (
                <>
                  ${(plan.price / 100).toFixed(2)}
                  <span className="fs-14 fw-medium ms-2">
                    / {plan.pricePeriod}
                  </span>
                </>
              )}
            </h5>
            <span className="text-muted">{plan.description}</span>
          </div>

          <div className="d-block">
            <div>
              {plan.features?.map((feature, index) => (
                <p
                  key={index}
                  className="d-flex fs-12 fw-medium text-dark mb-2"
                >
                  <span
                    className={`mt-1 d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded ${
                      feature.isAvailable ? "bg-success" : "bg-danger"
                    }`}
                  >
                    <i
                      className={`ti ${
                        feature.isAvailable ? "ti-check" : "ti-x"
                      }`}
                    />
                  </span>
                  {feature.text}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mb-3">
          {isCurrentPlan(plan) ? (
            <Button variant="success" disabled className="px-4">
              Current Plan
            </Button>
          ) : isStarterPlan(plan) ? (
            <Button variant="outline-secondary" disabled className="px-4">
              Basic Plan
            </Button>
          ) : isDowngrade(plan) ? (
            <Button variant="primary" disabled className="px-4">
              Upgrade
            </Button>
          ) : canUpgrade(plan) ? (
            <Button
              variant="primary"
              onClick={() => handleUpgrade(plan)}
              disabled={paymentLoading}
              className="px-4"
            >
              {paymentLoading && selectedPlan?._id === plan._id ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Loading...
                </>
              ) : (
                "Upgrade"
              )}
            </Button>
          ) : (
            <Button variant="outline-secondary" disabled className="px-4">
              Not Available
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ height: "50vh" }}
          >
            <Spinner animation="border" role="status" className="mb-3">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="text-muted">{"Loading..."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
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
                            Sync and Integration
                          </Link>
                          <Link
                            to={`${route.scans}#myScans`}
                            className="fw-medium"
                          >
                            My Scans
                          </Link>
                          <Link
                            to={route.upgradePlan}
                            className="fw-medium active"
                          >
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
                    <div className="card-body pb-0">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-semibold mb-0">Upgrade Plan</h5>
                        {getCurrentPlan() && (
                          <div className="text-end">
                            <small className="text-muted">Current Plan:</small>
                            <div className="fw-semibold text-success">
                              {getCurrentPlan().name}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="row justify-content-center">
                        {plans.map(renderPlanCard)}
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

      {/* Stripe Checkout Modal */}
      <Modal
        show={showPaymentModal}
        onHide={handlePaymentCancel}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Complete Your Upgrade</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {clientSecret && selectedPlan && (
            <CheckoutForm
              clientSecret={clientSecret}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
              planDetails={selectedPlan}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* Upgrade Confirmation Modal */}
      <Modal
        show={showConfirmationModal}
        onHide={handleCancelUpgrade}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Upgrade to {selectedPlan?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {upgradePreview && selectedPlan && (
            <div>
              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Upgrade Summary</h6>
                <div className="row">
                  <div className="col-md-6">
                    <div className="card border">
                      <div className="card-body">
                        <h6 className="card-title text-muted">Current Plan</h6>
                        <p className="mb-1 fw-semibold">
                          {upgradePreview.currentPlan.name}
                        </p>
                        <p className="mb-1 text-success">
                          ${upgradePreview.currentPlan.price.toFixed(2)}/month
                        </p>
                        <small className="text-muted">
                          Remaining value: $
                          {upgradePreview.currentPlan.remainingValue.toFixed(2)}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card border-primary">
                      <div className="card-body">
                        <h6 className="card-title text-primary">New Plan</h6>
                        <p className="mb-1 fw-semibold">
                          {upgradePreview.newPlan.name}
                        </p>
                        <p className="mb-1 text-primary">
                          ${upgradePreview.newPlan.price.toFixed(2)}/month
                        </p>
                        <small className="text-muted">
                          Pro-rated amount: $
                          {upgradePreview.newPlan.proRatedAmount.toFixed(2)}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Billing Details</h6>
                <div className="border rounded p-3 bg-light">
                  {upgradePreview.billing.immediateCharge > 0 ? (
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Immediate charge:</span>
                      <span className="fw-semibold text-primary">
                        ${upgradePreview.billing.immediateCharge.toFixed(2)}
                      </span>
                    </div>
                  ) : upgradePreview.billing.creditApplied > 0 ? (
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Credit applied:</span>
                      <span className="fw-semibold text-success">
                        ${upgradePreview.billing.creditApplied.toFixed(2)}
                      </span>
                    </div>
                  ) : null}

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Next billing date:</span>
                    <span>
                      {new Date(
                        upgradePreview.billing.nextBillingDate
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <span>Next billing amount:</span>
                    <span className="fw-semibold">
                      ${upgradePreview.billing.nextBillingAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Billing Period</h6>
                <div className="row">
                  <div className="col-6">
                    <small className="text-muted">
                      Days remaining in period:
                    </small>
                    <p className="mb-0 fw-semibold">
                      {upgradePreview.period.daysRemaining} days
                    </p>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Period used:</small>
                    <p className="mb-0 fw-semibold">
                      {upgradePreview.period.percentUsed}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="alert alert-info">
                <i className="ti ti-info-circle me-2"></i>
                <strong>What happens next?</strong>
                <ul className="mb-0 mt-2">
                  <li>Your plan will be upgraded immediately</li>
                  {upgradePreview.billing.immediateCharge > 0 && (
                    <li>
                      You'll be charged $
                      {upgradePreview.billing.immediateCharge.toFixed(2)} today
                      for the prorated amount
                    </li>
                  )}
                  <li>
                    Future billing will be $
                    {upgradePreview.billing.nextBillingAmount.toFixed(2)}/month
                  </li>
                  <li>You can cancel or change your plan anytime</li>
                </ul>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelUpgrade}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmUpgrade}
            disabled={paymentLoading}
          >
            {paymentLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              `Confirm Upgrade${
                upgradePreview && upgradePreview.billing.immediateCharge > 0
                  ? ` - $${upgradePreview.billing.immediateCharge.toFixed(2)}`
                  : ""
              }`
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* /Page Wrapper */}
    </>
  );
};

export default UpgradePlan;
