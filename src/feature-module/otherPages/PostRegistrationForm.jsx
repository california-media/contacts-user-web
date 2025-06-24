import React, { useEffect } from "react";
import { Wizard, useWizard } from "react-use-wizard";
import { motion, AnimatePresence } from "framer-motion";
import "./postRegistrationForm.css";
import { useNavigate } from "react-router";

const StepWrapper = ({ children }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={children.key}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="prf-step-container"
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

const Step1 = () => {
  const { nextStep } = useWizard();

  return (
    <StepWrapper key="step1">
      <>
        <h3>Personal Details</h3>
        <input
          className="prf-input"
          type="text"
          placeholder="Full Name"
          required
        />
        <input
          className="prf-input"
          type="email"
          placeholder="Email"
          required
        />
        <input
          className="prf-input"
          type="tel"
          placeholder="Phone Number"
          required
        />
        <select className="prf-input" required>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <div className="prf-actions">
          <div />
          <button className="prf-next" onClick={nextStep}>
            Next
          </button>
        </div>
      </>
    </StepWrapper>
  );
};

const Step2 = () => {
  const { nextStep, previousStep } = useWizard();

  return (
    <StepWrapper key="step2">
      <>
        <div className="text-end cursor-pointer" onClick={nextStep}>
          Skip
        </div>
        <h3>How many employees are in your company?</h3>
        <div className="prf-grid">
          {[
            "1-4",
            "5-19",
            "20-49",
            "50-99",
            "100-249",
            "250-499",
            "500-999",
            "1000+",
          ].map((size) => (
            <label key={size} className="prf-option-btn">
              <input type="radio" name="employees" value={size} /> {size}
            </label>
          ))}
        </div>

        <h3>What is your goal using Contacts.management?</h3>
        <div className="prf-grid">
          {["For personal use", "Testing for my company", "Other"].map(
            (goal) => (
              <label key={goal} className="prf-option-btn">
                <input type="radio" name="goal" value={goal} /> {goal}
              </label>
            )
          )}
        </div>

        <div className="prf-actions">
          <button className="prf-back" onClick={previousStep}>
            Back
          </button>
          <div>
            <button className="prf-next me-2" onClick={nextStep}>
              Next
            </button>
          </div>
        </div>
      </>
    </StepWrapper>
  );
};

const Step3 = () => {
  const { nextStep, previousStep } = useWizard();

  return (
    <StepWrapper key="step3">
      <>
        <div className="text-end cursor-pointer" onClick={nextStep}>
          Skip
        </div>
        <h3>Select a category that best describes you</h3>
        <div className="prf-grid">
          {[
            "Sales",
            "Marketing",
            "IT",
            "Procurement",
            "Consultant",
            "C-Level",
            "HR",
            "Field Representative",
            "Freelancer",
            "Other",
          ].map((category) => (
            <label key={category} className="prf-option-btn">
              <input type="radio" name="category" value={category} /> {category}
            </label>
          ))}
        </div>
        <h3>What do you hope Contacts Management can help with?</h3>
        <div className="prf-grid" style={{ gridTemplateColumns: "1fr" }}>
          {[
            "Managing Sales pipelines",
            "Organizing key relationships",
            "Process automation",
            "Something else",
          ].map((item) => (
            <label key={item} className="prf-option-btn">
              <input type="checkbox" name="help" value={item} /> {item}
            </label>
          ))}
        </div>
        <div className="prf-actions">
          <button className="prf-back" onClick={previousStep}>
            Back
          </button>
          <div>
            <button className="prf-next me-2" onClick={nextStep}>
              Finish
            </button>
          </div>
        </div>
      </>
    </StepWrapper>
  );
};


const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <StepWrapper key="success">
      <>
        <h2>🎉 You're All Set!</h2>
        <p>
          Thanks for completing the onboarding. You will be redirected to the
          dashboard.
        </p>
      </>
    </StepWrapper>
  );
};

const PostRegistrationForm = () => {
  return (
    <div className="prf-container">
      <Wizard>
        <Step1 />
        <Step2 />
        <Step3 />
        <Success />
      </Wizard>
    </div>
  );
};

export default PostRegistrationForm;
