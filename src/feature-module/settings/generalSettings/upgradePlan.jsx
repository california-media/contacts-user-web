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
  const dispatch = useDispatch();
  const [processingComplete, setProcessingComplete] = useState(false);

  const fetchClientSecret = () => {
    // Return the clientSecret directly since it's passed as prop
    return Promise.resolve(clientSecret);
  };

  const handleComplete = async (result) => {
    if (processingComplete) return; // Prevent double processing
    setProcessingComplete(true);

    try {
      console.log("Checkout completed:", result);

      // The result contains the session information
      // if (result && result.session) {
      //   // Complete the subscription using the session ID
      //   const response = await api.post("/user/payment/complete-subscription", {
      //     sessionId: result.session.id,
      //   });

      //   if (response.data.success) {
      //     dispatch(
      //       showToast({
      //         type: "success",
      //         message:
      //           response.data.message ||
      //           `Successfully upgraded to ${planDetails.name}!`,
      //       })
      //     );
      //     onSuccess();
      //   } else {
      //     dispatch(
      //       showToast({
      //         type: "error",
      //         message:
      //           response.data.message || "Failed to complete subscription",
      //       })
      //     );
      //   }
      // } else {
      //   dispatch(
      //     showToast({
      //       type: "error",
      //       message: "Payment session information not available",
      //     })
      //   );
      // }
    } catch (error) {
      console.error("Error completing subscription:", error);
      dispatch(
        showToast({
          type: "error",
          message:
            error.response?.data?.message || "Failed to complete subscription",
        })
      );
    } finally {
      setProcessingComplete(false);
    }
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
          onComplete: handleComplete,
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={processingComplete}
        >
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
    return plan.price > currentPrice;
  };

  const isDowngrade = (plan) => {
    const currentPrice = getCurrentPlanPrice();
    return plan.price < currentPrice && plan.price > 0;
  };

  const isStarterPlan = (plan) => {
    return plan.price === 0 || plan.name.toLowerCase().includes("starter");
  };

  const handleUpgrade = async (plan) => {
    try {
      setPaymentLoading(true);
      console.log("Selected plan for upgrade:", plan);
      setSelectedPlan(plan);

      // Create checkout session
      const response = await api.post("/user/payment/create-checkout-session", {
        planId: plan._id,
        autoRenewal: true,
      });

      if (response.data.success) {
        // Check if client secret is provided
        if (response.data.clientSecret) {
          setClientSecret(response.data.clientSecret);
          setShowPaymentModal(true);
        } else {
          // Subscription was activated immediately (shouldn't happen with checkout sessions)
          dispatch(
            showToast({
              type: "success",
              message:
                response.data.message ||
                `Successfully upgraded to ${plan.name}!`,
            })
          );
          // Refresh the page to show updated plan
          // window.location.reload();
        }
      } else {
        dispatch(
          showToast({
            type: "error",
            message:
              response.data.message || "Failed to create checkout session",
          })
        );
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      dispatch(
        showToast({
          type: "error",
          message:
            error.response?.data?.message || "Failed to initiate upgrade",
        })
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setClientSecret("");
    setSelectedPlan(null);
    // Refresh user profile to get updated plan
    window.location.reload();
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
            <Button variant="outline-secondary" disabled className="px-4">
              Downgrade Not Available
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
            className="d-flex justify-content-center align-items-center"
            style={{ height: "50vh" }}
          >
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
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

      {/* /Page Wrapper */}
    </>
  );
};

export default UpgradePlan;
