import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../core/axios/axiosInstance";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [message, setMessage] = useState("Payment Successful!");
  const [subMessage, setSubMessage] = useState(
    "We're finalizing your subscription..."
  );
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [redirecting, setRedirecting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const completeSubscription = async () => {
      try {
        if (sessionId) {
          console.log("Processing session:", sessionId);
          // Complete the subscription
          const response = await api.post(
            "/user/payment/complete-subscription",
            {
              sessionId: sessionId,
            }
          );

          console.log(response.data, "response from the completion api");

          if (response.data.success) {
            setMessage("Subscription Activated!");
            setSubMessage(
              `Successfully upgraded to ${
                response.data.plan?.name || "your new plan"
              }!`
            );
          } else {
            setMessage("Payment Successful!");
            setSubMessage(
              response.data.message || "Your subscription is being processed."
            );
          }
        } else {
          // No session ID, just show success
          setMessage("Payment Successful!");
          setSubMessage("Your subscription has been activated!");
        }

        setLoading(false);

        // Start countdown after completion (successful or not)
        setTimeout(() => {
          setRedirecting(true);
          startCountdown();
        }, 2000);
      } catch (error) {
        console.error(
          "Subscription completion failed:",
          error.response?.data || error.message
        );
        setMessage("Payment Successful!");
        setSubMessage(
          "Your subscription is being processed. You'll see the changes shortly."
        );
        setLoading(false);

        // Still redirect even if completion fails
        setTimeout(() => {
          setRedirecting(true);
          startCountdown();
        }, 2000);
      }
    };

    const startCountdown = () => {
      //   setSubMessage("Redirecting to dashboard in");

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/general-settings/upgrade-plan", { replace: true });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    };

    completeSubscription();
  }, [sessionId, navigate]);

  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center text-center">
      {loading && (
        <div className="spinner-border text-success mb-4" role="status" />
      )}

      {!loading && !redirecting && (
        <div className="text-success mb-4">
          <i className="fas fa-check-circle" style={{ fontSize: "3rem" }}></i>
        </div>
      )}

      {redirecting && (
        <div className="text-primary mb-4">
          <div className="spinner-border" role="status" />
        </div>
      )}

      <h5 className="fw-semibold text-success">{message}</h5>

      {subMessage && !redirecting && (
        <p className="text-muted mb-0">{subMessage}</p>
      )}

      {redirecting && (
        <div className="text-center">
          <p className="text-muted mb-2">{subMessage}</p>
          <h3 className="fw-bold text-primary">{countdown}</h3>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
