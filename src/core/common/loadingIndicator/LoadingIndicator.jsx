import React from "react";
import "./loadingIndicator.css";

const LoadingIndicator = ({ size = "sm", center = false }) => {
  const spinner = (
    <div className={`custom-spinner custom-spinner-${size}`} />
  );

  if (center) {
    return <div className="custom-spinner-center">{spinner}</div>;
  }

  return spinner;
};

export default LoadingIndicator;
