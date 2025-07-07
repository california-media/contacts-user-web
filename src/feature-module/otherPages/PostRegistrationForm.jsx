import React, { useEffect, useState } from "react";
import { Wizard, useWizard } from "react-use-wizard";
import { motion, AnimatePresence } from "framer-motion";
import "./postRegistrationForm.css";
import { useLocation, useNavigate } from "react-router";
import api from "../../core/axios/axiosInstance";
import PhoneInput from "react-phone-input-2";
import LoadingIndicator from "../../core/common/loadingIndicator/LoadingIndicator";
const stepImages = [
  process.env.PUBLIC_URL + "/assets/img/postRegistration1.avif",
  process.env.PUBLIC_URL + "/assets/img/postRegistration2.avif",
  process.env.PUBLIC_URL + "/assets/img/postRegistration3.avif",
  process.env.PUBLIC_URL + "/assets/img/postRegistration4.avif",
];
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

const Step1 = ({ formData, setFormData, passedData,setMessage,message, setIsLoading, isLoading}) => {
  const { nextStep } = useWizard();
  const handleOnPhoneChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      phonenumber: value,
    }));
  };

  const isFirstNameFilled = formData.firstname.trim() !== "";
  const isEmailFilled = formData.email.trim() !== "";
  const isPhoneFilled = formData.phonenumber.trim() !== "";
const canProceed =
  (
    passedData?.registeredWith === "google"
      ? isPhoneFilled
      : passedData?.registeredWith === "email"
      ? isPhoneFilled && isFirstNameFilled
      : passedData?.registeredWith === "phoneNumber"
      ? isEmailFilled && isFirstNameFilled
      : false
  );

  return (
    <StepWrapper key="step1">
      <>
       <div className="mb-5"><img src="/assets/img/logo.svg" /></div>
        <h3>Personal Details</h3>
          {passedData?.registeredWith != "google" && 
        <div className="d-flex gap-3">
          <input
            className="prf-input"
            type="text"
            placeholder="First Name *"
            name="firstname"
            value={formData.firstname}
            onChange={(e) =>
              setFormData({ ...formData, firstname: e.target.value })
            }
            required
          />
          <input
            className="prf-input"
            type="text"
            placeholder="Last Name"
            name="lastname"
            value={formData.lastname}
            onChange={(e) =>
              setFormData({ ...formData, lastname: e.target.value })
            }
            required
          />
        </div>
        }
        <input
          className="prf-input"
          type="text"
          placeholder="Company"
          name="companyName"
          value={formData.companyName}
          onChange={(e) =>
            setFormData({ ...formData, companyName: e.target.value })
          }
          required
        />
        <input
          className="prf-input"
          type="text"
          placeholder="Job Title"
          name="designation"
          value={formData.designation}
          onChange={(e) =>
            setFormData({ ...formData, designation: e.target.value })
          }
          required
        />
        {console.log(passedData, "passed dtata")}

        {passedData?.registeredWith != "email" && passedData?.registeredWith != "google" ? (
          <input
            className="prf-input"
            type="email"
            placeholder="Email *"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        ) : (
          <div className="mb-4">
            <PhoneInput
              country={"ae"}
              value={formData.phonenumber}
              onChange={handleOnPhoneChange}
              placeholder="Phone Number *"
              enableSearch
              inputProps={{
                name: "phone",
                required: true,
                autoFocus: true,
              }}
            />
          </div>
        )}
        <div className="prf-grid">
          {["Male", "Female", "Other"].map((userGender) => (
            <label
              key={userGender}
              className={`prf-option-btn${
                formData.gender === userGender ? " selected" : ""
              }`}
            >
              <input
                type="radio"
                name="gender"
                value={userGender}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, gender: userGender }))
                }
              />{" "}
              {userGender}
            </label>
          ))}
        </div>
        <p className="text-danger">{message}</p>
        <div className="prf-actions">
          <div />
          <button
            className="prf-next"
            onClick={async () => {
              setIsLoading(true)
    try {
      const payload ={
         "phonenumber":formData.phonenumber,
         "email":formData.email,
      }
      console.log(payload,"payload checking duplicate");
      
      const response = await api.post("/check-duplicate-user",payload);
      nextStep()
setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      setMessage(error.response.data.message)
      console.error("Network Error:", error);
    }
  }}
            disabled={!canProceed || isLoading}
            style={{
              opacity: canProceed ? 1 : 0.5,
              pointerEvents: canProceed ? "auto" : "none",
            }}
          >
            {isLoading?
            <LoadingIndicator/>
            :"Next"}
          </button>
        </div>
      </>
    </StepWrapper>
  );
};

const Step2 = ({ formData, setFormData }) => {
  const { nextStep, previousStep } = useWizard();

  return (
    <StepWrapper key="step2">
      <>
       <div className="mb-5"><img src="/assets/img/logo.svg" /></div>
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
            <label
              key={size}
              className={`prf-option-btn${
                formData.employeeCount === size ? " selected" : ""
              }`}
            >
              <input
                type="radio"
                name="employees"
                value={size}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, employeeCount: size }))
                }
              />{" "}
              {size}
            </label>
          ))}
        </div>

        <h3>What is your goal using Contacts.management?</h3>
        <div className="prf-grid">
          {["For personal use", "Testing for my company", "Other"].map(
            (goal) => (
              <label
                key={goal}
                className={`prf-option-btn${
                  formData.goals === goal ? " selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="goal"
                  value={goal}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, goals: goal }))
                  }
                />{" "}
                {goal}
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

const Step3 = ({ formData, setFormData, navigate }) => {
  const { nextStep, previousStep } = useWizard();
  const handleFinalSubmit = async () => {
    nextStep();
    await handleSubmit({ formData });
  };
  return (
    <StepWrapper key="step3">
      <>
 <div className="mb-5"><img src="/assets/img/logo.svg" /></div>
 <div className="text-end cursor-pointer" onClick={() => handleFinalSubmit()}>
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
            <label
              key={category}
              className={`prf-option-btn${
                formData.categories === category ? " selected" : ""
              }`}
            >
              <input
                type="radio"
                name="category"
                value={category}
                checked={formData.categories === category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    categories: e.target.value,
                  }))
                }
              />{" "}
              {category}
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
            <label
              key={item}
              className={`prf-option-btn${
                formData.helps.includes(item) ? " selected" : ""
              }`}
            >
              <input
                type="checkbox"
                name="help"
                value={item}
                checked={formData.helps.includes(item)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setFormData((prev) => {
                    const updatedHelps = checked
                      ? [...prev.helps, item]
                      : prev.helps.filter((val) => val !== item);
                    return { ...prev, helps: updatedHelps };
                  });
                }}
              />{" "}
              {item}
            </label>
          ))}
        </div>
        <div className="prf-actions">
          <button className="prf-back" onClick={previousStep}>
            Back
          </button>
          <div>
            <button
              className="prf-next me-2"
              onClick={() => handleFinalSubmit()}
            >
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
      <div className="text-center">
        <h2>🎉 You're All Set!</h2>
        <div className="d-flex align-items-center justify-content-center">
          <div class="spinner-border spinner-border-sm" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <div className="ms-3">We are setting your profile</div>
        </div>
        {/* <p>
          Thanks for completing the onboarding. You will be redirected to the
          dashboard.
        </p> */}
      </div>
    </StepWrapper>
  );
};

const handleSubmit = async ({ formData }) => {
  console.log("Submitting form data:", formData);

  try {
    const result = await api.post("/user-info/onboarding-submit", formData);
    console.log(result, "result from api");

    console.log(result.data, " Submission successful");
  } catch (error) {
    console.error("Submission error:", error);
  }
};

const PostRegistrationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedData = location.state;

  console.log("Received data from previous route:", passedData);
  const [currentStep, setCurrentStep] = useState(0);
const [message,setMessage] = useState("")
const [isLoading,setIsLoading] = useState(false)

  const handleStepChange = (step) => setCurrentStep(step);
  const [formData, setFormData] = useState({
    helps: [],
    goals: "",
    categories: "",
    employeeCount: "",
    companyName: "",
    firstname: "",
    lastname: "",
    gender: "",
    email: "",
    phonenumber: "",
    designation: "",
  });
  console.log("Form Data:", formData);

  return (
    <div className="prf-flex-container">
      
      <div className="prf-left">
        <div>
          <Wizard onStepChange={handleStepChange}>
            <Step1
              formData={formData}
              passedData={passedData}
              setFormData={setFormData}
              setMessage={setMessage}
              message={message}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
            <Step2 formData={formData} setFormData={setFormData} />
            <Step3
              formData={formData}
              setFormData={setFormData}
              navigate={navigate}
            />
            <Success />
          </Wizard>
        </div>
      </div>
  
      <div className="prf-right">
        <img
          src={stepImages[currentStep]}
          alt={`Step ${currentStep + 1}`}
          className="prf-step-image"
        />
      </div>
    </div>
  );
};

export default PostRegistrationForm;
