import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import api from "../../core/axios/axiosInstance";

// Load Stripe
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51JM78KBtOBT8b78eKkjaaXWTEBvsBvmV1VYV3kaRXVgjCYNVLUPK7MNPQEpHgdihSUOtPEfG8WPsVqoHgBBsev2600RynHqIML"
);

const EmbeddedCheckoutPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get session ID from URL params
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!sessionId) {
        console.error("No session ID found in URL");
        navigate("/general-settings/upgrade-plan", { replace: true });
        return;
      }

      try {
        console.log("Fetching session details for:", sessionId);
        const response = await api.get(
          `/user/payment/checkout-session/${sessionId}`
        );

        if (response.data.success) {
          console.log("Successfully retrieved session details:", response.data);
          setSessionData(response.data);
        } else {
          throw new Error(
            response.data.message || "Failed to retrieve session details"
          );
        }
      } catch (error) {
        console.error("Failed to retrieve session details:", error);
        setError(error.message);
        navigate("/general-settings/upgrade-plan", { replace: true });
        return;
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId, navigate]);

  const options = {
    clientSecret: sessionData?.clientSecret,
    onComplete: () => {
      // Redirect to success page with session ID
      navigate(`/payment-success?session_id=${sessionId}`, { replace: true });
    },
  };

  if (loading || !sessionData?.clientSecret) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5>Loading Payment Form...</h5>
          <p className="text-muted">
            {loading
              ? "Retrieving checkout session..."
              : "Preparing payment form..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="text-danger mb-4">
            <i
              className="fas fa-exclamation-triangle"
              style={{ fontSize: "3rem" }}
            ></i>
          </div>
          <h5 className="text-danger">Payment Session Error</h5>
          <p className="text-muted mb-3">{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/general-settings/upgrade-plan")}
          >
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid min-vh-100 py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-6">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              {/* First Purchase Notice */}
              {sessionData?.isFirstPurchase && (
                <div className="alert alert-info mb-4" role="alert">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-info-circle me-2"></i>
                    <div>
                      <strong>First Purchase Notice</strong>
                      <br />
                      <small>
                        Credits cannot be used on your first purchase. You'll be
                        able to use credits for future transactions.
                      </small>
                    </div>
                  </div>
                </div>
              )}

              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={options}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate("/general-settings/upgrade-plan")}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Plans
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbeddedCheckoutPage;
