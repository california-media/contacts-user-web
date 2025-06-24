import React, { useEffect, useState } from "react";
import { Wizard, useWizard } from "react-use-wizard";
import { motion, AnimatePresence } from "framer-motion";
import "./postRegistrationForm.css";
import { useLocation, useNavigate } from "react-router";
import api from "../../core/axios/axiosInstance";
import PhoneInput from "react-phone-input-2";

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

const Step1 = ({ formData, setFormData,passedData }) => {
  const { nextStep } = useWizard();
  const handleOnPhoneChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      phone: value,
    }));
  };
  return (
    <StepWrapper key="step1">
      <>
        <h3>Personal Details</h3>
        <div className="d-flex gap-3">
          <input
            className="prf-input"
            type="text"
            placeholder="First Name"
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
        <input
          className="prf-input"
          type="text"
          placeholder="Company"
          name="companyName"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          required
        />
        {console.log("Passed Data:", passedData)}
        
       {passedData?.registeredWith =="email"? <input
          className="prf-input"
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />:
        <div className="mb-4">
          <PhoneInput
            country={"ae"} // Default country
            value={formData.phone}
            onChange={handleOnPhoneChange}
            enableSearch
            inputProps={{
              name: "phone",
              required: true,
              autoFocus: true,
            }}
          />
        </div>}
        <select
          className="prf-input"
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          required
        >
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

const Step2 = ({ formData, setFormData }) => {
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
              <label key={goal} className="prf-option-btn">
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

const Step3 = ({ formData, setFormData,navigate }) => {
  const { nextStep, previousStep } = useWizard();

  return (
    <StepWrapper key="step3">
      <>
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
            <label key={item} className="prf-option-btn">
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
            <button className="prf-next me-2" onClick={()=>handleSubmit({formData, navigate})}>
              Finish
            </button>
          </div>
        </div>
      </>
    </StepWrapper>
  );
};

// const Success = () => {
  
//   const navigate = useNavigate();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigate("/dashboard");
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [navigate]);

//   return (
//     <StepWrapper key="success">
//       <>
//         <h2>🎉 You're All Set!</h2>
//         <p>
//           Thanks for completing the onboarding. You will be redirected to the
//           dashboard.
//         </p>
//       </>
//     </StepWrapper>
//   );
// };

const handleSubmit = async ({formData, navigate}) => {

  console.log("Submitting form data:", formData);
  
  try {
    const result = await api.post("/user-info/onboarding-submit", formData);
     navigate("/dashboard");
    console.log(result.data," Submission successful");
  } catch (error) {
    console.error("Submission error:", error);
  }
};

const PostRegistrationForm = () => {
const navigate = useNavigate();
const location = useLocation();
  const passedData = location.state;

  console.log("Received data from previous route:", passedData);

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
    phone: "",
  });
  console.log("Form Data:", formData);

  return (
    <div className="prf-container">
      <Wizard>
        <Step1 formData={formData} passedData={passedData} setFormData={setFormData} />
        <Step2 formData={formData} setFormData={setFormData} />
        <Step3 formData={formData} setFormData={setFormData} navigate={navigate}/>
        {/* <Success formData={formData} /> */}
      </Wizard>
    </div>
  );
};

export default PostRegistrationForm;
