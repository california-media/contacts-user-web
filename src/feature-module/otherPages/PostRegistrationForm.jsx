// import React from "react";
// import { Wizard, useWizard } from "react-use-wizard";
// import { motion, AnimatePresence } from "framer-motion";
// import "./postRegistrationForm.css"; // include your CSS here

// const StepWrapper = ({ children }) => (
//   <AnimatePresence mode="wait">
//     <motion.div
//       key={children.key}
//       initial={{ opacity: 0, x: 50 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: -50 }}
//       transition={{ duration: 0.3 }}
//       className="prf-step-container"
//     >
//       {children}
//     </motion.div>
//   </AnimatePresence>
// );

// const Step1 = () => {
//   const { nextStep } = useWizard();
//   return (
//     <StepWrapper key="step1">
//       <>
//         <h2>Personal Details</h2>
//         <input type="text" placeholder="Name" className="prf-input" />
//         <input type="email" placeholder="Email" className="prf-input" />
//         <input type="tel" placeholder="Phone Number" className="prf-input" />
//         <select className="prf-input">
//           <option value="">Select Gender</option>
//           <option value="male">Male</option>
//           <option value="female">Female</option>
//           <option value="other">Other</option>
//         </select>
//         <div className="prf-actions">
//           <div /> {/* Empty space for alignment */}
//           <button className="prf-next" onClick={nextStep}>Next</button>
//         </div>
//       </>
//     </StepWrapper>
//   );
// };

// const Step2 = () => {
//   const { previousStep, nextStep } = useWizard();
//   return (
//     <StepWrapper key="step2">
//       <>
//         <h2>2/4: Select a category that best describes you</h2>
//         <div className="prf-grid">
//           {[
//             "Sales",
//             "Marketing",
//             "IT",
//             "Procurement",
//             "Consultant",
//             "C-Level",
//             "HR",
//             "Field Representative",
//             "Freelancer",
//             "Other",
//           ].map((cat) => (
//             <button key={cat} className="prf-option-btn">{cat}</button>
//           ))}
//         </div>
//         <div className="prf-actions">
//           <button className="prf-back" onClick={previousStep}>Back</button>
//           <button className="prf-next" onClick={nextStep}>Skip</button>
//         </div>
//       </>
//     </StepWrapper>
//   );
// };

// const Step3 = () => {
//   const { previousStep, nextStep } = useWizard();
//   return (
//     <StepWrapper key="step3">
//       <>
//         <h2>3/4: What is your goal using Contacts.management?</h2>
//         <div className="prf-grid">
//           {[
//             "For personal use",
//             "Testing for my company/team",
//             "Other"
//           ].map((goal) => (
//             <button key={goal} className="prf-option-btn">{goal}</button>
//           ))}
//         </div>
//         <h2>4/4: Tell us what you hope Contacts Management can help with</h2>
//         <div className="prf-grid" style={{ gridTemplateColumns: "1fr" }}>
//           {[
//             "Managing Sales pipelines",
//             "Organizing key relationships",
//             "Process automation",
//             "Something else",
//           ].map((help) => (
//             <label key={help} style={{ marginBottom: "0.5rem", display: "block" }}>
//               <input type="checkbox" /> {help}
//             </label>
//           ))}
//         </div>
//         <div className="prf-actions">
//           <button className="prf-back" onClick={previousStep}>Back</button>
//           <button className="prf-next" onClick={nextStep}>Skip</button>
//         </div>
//       </>
//     </StepWrapper>
//   );
// };

// const Success = () => (
//   <StepWrapper key="success">
//     <>
//       <h2>🎉 You're All Set!</h2>
//       <p>Thanks for completing the onboarding. Let’s get started.</p>
//     </>
//   </StepWrapper>
// );

// const PostRegistrationForm = () => {
//   return (
//     <div className="prf-container">
//       <Wizard>
//         <Step1 />
//         <Step2 />
//         <Step3 />
//         <Success />
//       </Wizard>
//     </div>
//   );
// };

// export default PostRegistrationForm;



// import React, { useState } from "react";
// import { Wizard, useWizard } from "react-use-wizard";
// import { motion, AnimatePresence } from "framer-motion";
// import "./postRegistrationForm.css";

// const StepWrapper = ({ children }) => (
//   <AnimatePresence mode="wait">
//     <motion.div
//       key={children.key}
//       initial={{ opacity: 0, x: 50 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: -50 }}
//       transition={{ duration: 0.3 }}
//       className="prf-step-container"
//     >
//       {children}
//     </motion.div>
//   </AnimatePresence>
// );

// const Step1 = () => {
//   const { nextStep } = useWizard();

//   return (
//     <StepWrapper key="step1">
//       <>
//         <h2>Personal Information</h2>
//         <div className="mb-3">
//           <input className="prf-input" type="text" placeholder="Full Name" required />
//         </div>
//         <div className="mb-3">
//           <input className="prf-input" type="email" placeholder="Email" required />
//         </div>
//         <div className="mb-3">
//           <input className="prf-input" type="tel" placeholder="Phone Number" required />
//         </div>
//         <div className="mb-3">
//           <select className="prf-input" required>
//             <option value="">Select Gender</option>
//             <option>Male</option>
//             <option>Female</option>
//             <option>Other</option>
//           </select>
//         </div>
//         <div className="prf-actions">
//           <div />
//           <button className="prf-next" onClick={nextStep}>Next</button>
//         </div>
//       </>
//     </StepWrapper>
//   );
// };

// const Step2 = () => {
//   const { previousStep, nextStep } = useWizard();
//   return (
//     <StepWrapper key="step2">
//       <>
//         <h2>1/4: How many employees are in your company?</h2>
//         <div className="prf-grid">
//           {["1-4", "5-19", "20-49", "50-99", "100-249", "250-499", "500-999", "1000+"].map((range) => (
//             <label key={range} className="prf-option-btn">
//               <input type="radio" name="employees" value={range} /> {range}
//             </label>
//           ))}
//         </div>
//         <div className="prf-actions">
//           <button className="prf-back" onClick={previousStep}>Back</button>
//           <button className="prf-next" onClick={nextStep}>Skip</button>
//         </div>
//       </>
//     </StepWrapper>
//   );
// };

// const Step3 = () => {
//   const { previousStep, nextStep } = useWizard();
//   return (
//     <StepWrapper key="step3">
//       <>
//         <h2>2/4: Select a category that best describes you</h2>
//         <div className="prf-grid">
//           {["Sales", "Marketing", "IT", "Procurement", "Consultant", "C-Level", "HR", "Field Representative", "Freelancer", "Other"].map((role) => (
//             <label key={role} className="prf-option-btn">
//               <input type="radio" name="category" value={role} /> {role}
//             </label>
//           ))}
//         </div>
//         <div className="prf-actions">
//           <button className="prf-back" onClick={previousStep}>Back</button>
//           <button className="prf-next" onClick={nextStep}>Skip</button>
//         </div>
//       </>
//     </StepWrapper>
//   );
// };

// const Step4 = () => {
//   const { previousStep, nextStep } = useWizard();
//   return (
//     <StepWrapper key="step4">
//       <>
//         <h2>3/4: What is your goal using Contacts.management?</h2>
//         <div className="prf-grid">
//           {["For personal use", "Testing for my company/team", "Other"].map((goal) => (
//             <label key={goal} className="prf-option-btn">
//               <input type="radio" name="goal" value={goal} /> {goal}
//             </label>
//           ))}
//         </div>
//         <div className="prf-actions">
//           <button className="prf-back" onClick={previousStep}>Back</button>
//           <button className="prf-next" onClick={nextStep}>Skip</button>
//         </div>
//       </>
//     </StepWrapper>
//   );
// };

// const Step5 = () => {
//   const { previousStep, nextStep } = useWizard();
//   return (
//     <StepWrapper key="step5">
//       <>
//         <h2>4/4: What do you hope Contacts Management can help with?</h2>
//         <div className="prf-grid" style={{ gridTemplateColumns: "1fr" }}>
//           {["Managing Sales pipelines", "Organizing key relationships", "Process automation", "Something else"].map((item) => (
//             <label key={item} className="prf-option-btn">
//               <input type="checkbox" name="help" value={item} /> {item}
//             </label>
//           ))}
//         </div>
//         <div className="prf-actions">
//           <button className="prf-back" onClick={previousStep}>Back</button>
//           <button className="prf-next" onClick={nextStep}>Finish</button>
//         </div>
//       </>
//     </StepWrapper>
//   );
// };

// const Success = () => (
//   <StepWrapper key="success">
//     <>
//       <h2>🎉 You're All Set!</h2>
//       <p>Thanks for completing the onboarding. Let’s get started.</p>
//     </>
//   </StepWrapper>
// );

// const PostRegistrationForm = () => {
//   return (
//     <div className="prf-container">
//       <Wizard>
//         <Step1 />
//         <Step2 />
//         <Step3 />
//         <Step4 />
//         <Step5 />
//         <Success />
//       </Wizard>
//     </div>
//   );
// };

// export default PostRegistrationForm;
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
        <h2>Personal Details</h2>
        <input className="prf-input" type="text" placeholder="Full Name" required />
        <input className="prf-input" type="email" placeholder="Email" required />
        <input className="prf-input" type="tel" placeholder="Phone Number" required />
        <select className="prf-input" required>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <div className="prf-actions">
          <div />
          <button className="prf-next" onClick={nextStep}>Next</button>
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
      <div className="text-end cursor-pointer" onClick={nextStep}>Skip</div>
        <h2>How many employees are in your company?</h2>
        <div className="prf-grid">
          {["1-4", "5-19", "20-49", "50-99", "100-249", "250-499", "500-999", "1000+"].map((size) => (
            <label key={size} className="prf-option-btn">
              <input type="radio" name="employees" value={size} /> {size}
            </label>
          ))}
        </div>
        <div className="prf-actions">
          <button className="prf-back" onClick={previousStep}>Back</button>
          <div>
            <button className="prf-next me-2" onClick={nextStep}>Next</button>
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
      <div className="text-end cursor-pointer" onClick={nextStep}>Skip</div>
        <h2>What is your goal using Contacts.management?</h2>
        <div className="prf-grid">
          {["For personal use", "Testing for my company", "Other"].map((goal) => (
            <label key={goal} className="prf-option-btn">
              <input type="radio" name="goal" value={goal} /> {goal}
            </label>
          ))}
        </div>
        <div className="prf-actions">
          <button className="prf-back" onClick={previousStep}>Back</button>
          <div>
            <button className="prf-next me-2" onClick={nextStep}>Next</button>
          </div>
        </div>
      </>
    </StepWrapper>
  );
};

const Step4 = () => {
  const { nextStep, previousStep } = useWizard();

  return (
    <StepWrapper key="step4">
      <>
      <div className="text-end cursor-pointer" onClick={nextStep}>Skip</div>
        <h2>Select a category that best describes you</h2>
        <div className="prf-grid">
          {[
            "Sales", "Marketing", "IT", "Procurement", "Consultant",
            "C-Level", "HR", "Field Representative", "Freelancer", "Other"
          ].map((category) => (
            <label key={category} className="prf-option-btn">
              <input type="radio" name="category" value={category} /> {category}
            </label>
          ))}
        </div>
        <div className="prf-actions">
          <button className="prf-back" onClick={previousStep}>Back</button>
          <div>
            <button className="prf-next me-2" onClick={nextStep}>Next</button>
            
          </div>
        </div>
      </>
    </StepWrapper>
  );
};

const Step5 = () => {
  const { nextStep, previousStep } = useWizard();

  return (
    <StepWrapper key="step5">
      <>
        <h2>What do you hope Contacts Management can help with?</h2>
        <div className="prf-grid" style={{ gridTemplateColumns: "1fr" }}>
          {[
            "Managing Sales pipelines",
            "Organizing key relationships",
            "Process automation",
            "Something else"
          ].map((item) => (
            <label key={item} className="prf-option-btn">
              <input type="checkbox" name="help" value={item} /> {item}
            </label>
          ))}
        </div>
        <div className="prf-actions">
          <button className="prf-back" onClick={previousStep}>Back</button>
          <div>
            <button className="prf-next me-2" onClick={nextStep}>Finish</button>
          </div>
        </div>
      </>
    </StepWrapper>
  );
};

const Success = () => 
  {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard"); // 👈 replace with your actual dashboard route
    }, 3000);

    return () => clearTimeout(timer); // cleanup
  }, [navigate]);

 return( <StepWrapper key="success">
    <>
      <h2>🎉 You're All Set!</h2>
      <p>Thanks for completing the onboarding. You will be redirected to the dashboard.</p>
    </>
  </StepWrapper>)
  }


const PostRegistrationForm = () => {
  return (
    <div className="prf-container">
      <Wizard>
        <Step1 />
        <Step2 />
        <Step3 />
        <Step4 />
        <Step5 />
        <Success />
      </Wizard>
    </div>
  );
};

export default PostRegistrationForm;
