import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentUnsuccessful = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [redirecting, setRedirecting] = useState(false);

  // Get error details from URL params if available
  const errorMessage =
    searchParams.get("error") || "Payment was cancelled or failed";
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Start countdown immediately
    setTimeout(() => {
      setRedirecting(true);
      startCountdown();
    }, 2000);

    const startCountdown = () => {
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
  }, [navigate]);

  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center text-center">
      {!redirecting && (
        <div className="text-danger mb-4">
          <i className="fas fa-times-circle" style={{ fontSize: "3rem" }}></i>
        </div>
      )}

      {redirecting && (
        <div className="text-primary mb-4">
          <div className="spinner-border" role="status" />
        </div>
      )}

      <h5 className="fw-semibold text-danger">Payment Unsuccessful</h5>

      {!redirecting && (
        <div className="text-center">
          <p className="text-muted mb-3">{errorMessage}</p>
          <p className="text-muted mb-0">
            Don't worry, you can try again or choose a different payment method.
          </p>
        </div>
      )}

      {redirecting && (
        <div className="text-center">
          <p className="text-muted mb-2">Redirecting to upgrade plans...</p>
          <h3 className="fw-bold text-primary">{countdown}</h3>
        </div>
      )}
    </div>
  );
};

export default PaymentUnsuccessful;
