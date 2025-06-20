// import React from 'react'
// import { useWizard, Wizard } from 'react-use-wizard'

// const PostRegistrationForm = () => {




// const Step1 = () => {
//   const { handleStep, previousStep, nextStep } = useWizard();

//   // Attach an optional handler
//   handleStep(() => {
//     alert('Going to step 2');
//   });

//   return (
//     <>
//       <button onClick={() => previousStep()}>Previous ⏮️</button>
//       <button onClick={() => nextStep()}>Next ⏭</button>
//     </>
//   );
// };
// const Step2 = () => {
//   const { handleStep, previousStep, nextStep } = useWizard();

//   // Attach an optional handler
//   handleStep(() => {
//     alert('Going to step 2');
//   });

//   return (
//     <>
//       <button onClick={() => previousStep()}>Previous ⏮️</button>
//       <button onClick={() => nextStep()}>Next ⏭</button>
//     </>
//   );
// };
// const Step3 = () => {
//   const { handleStep, previousStep, nextStep } = useWizard();

//   // Attach an optional handler
//   handleStep(() => {
//     alert('Going to step 2');
//   });

//   return (
//     <>
//       <button onClick={() => previousStep()}>Previous ⏮️</button>
//       <button onClick={() => nextStep()}>Next ⏭</button>
//     </>
//   );
// };

//   return (
//      <>
//      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem voluptatibus, magnam ipsam, minus libero dolore quasi adipisci iure ratione illum deleniti! In sunt animi iusto perspiciatis officia! Vitae, sint blanditiis nam id a corporis eligendi consectetur ratione mollitia eius distinctio necessitatibus ex excepturi ipsa optio cupiditate, nemo hic sunt quos? Libero recusandae mollitia, totam sit nam earum eaque, pariatur cumque placeat dolore distinctio nulla culpa officiis! Necessitatibus eveniet architecto in suscipit ullam cum qui possimus quaerat. Quisquam minima doloribus magnam tenetur ducimus veniam animi illo nobis autem delectus voluptatum aliquid id eos, officia similique eum expedita temporibus sapiente? Recusandae ea ducimus reiciendis cum! Velit magnam quibusdam, officia facere excepturi non reprehenderit suscipit quisquam dolor ut. Laudantium minus architecto ex ut quibusdam nisi earum perferendis possimus. Non repudiandae placeat nulla quo perspiciatis? Consectetur officiis ab dicta molestiae voluptatibus nam placeat corporis sint asperiores adipisci? Facilis, molestias? Error vero in nostrum aspernatur ullam impedit repellendus molestias, facilis totam repudiandae quaerat atque nulla saepe? Assumenda eaque dicta ut dignissimos autem a saepe reiciendis. Quam iure nesciunt reiciendis aut porro adipisci alias explicabo, architecto maxime quo quisquam laborum deserunt blanditiis ab, laboriosam eos sunt! Illum repudiandae facere autem repellendus cupiditate praesentium qui quae sint.
//          <Wizard>
//         <Step1 />
//         <Step2 />
//         <Step3 />
//       </Wizard>
//      </>
//   )
// }

// export default PostRegistrationForm
// import React from "react";
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
//     >
//       {children}
//     </motion.div>
//   </AnimatePresence>
// );

// const Step1 = () => {
//   const { nextStep } = useWizard();
//   return (
//     <StepWrapper key="step1">
//       <div className="prf-step-container">
//         <h2>What’s your industry?</h2>
//         <div className="prf-grid">
//           {[
//             "Agency",
//             "Real Estate",
//             "Software / Technology",
//             "Financial Services",
//             "Building & Construction",
//             "Consulting",
//             "Media",
//             "Something else",
//           ].map((item) => (
//             <button className="prf-option-btn" key={item}>{item}</button>
//           ))}
//         </div>
//         <div className="prf-actions">
//           <button className="prf-next" onClick={nextStep}>Next</button>
//         </div>
//       </div>
//     </StepWrapper>
//   );
// };

// const Step2 = () => {
//   const { previousStep, nextStep } = useWizard();
//   return (
//     <StepWrapper key="step2">
//       <div className="prf-step-container">
//         <h2>Tell us about your company</h2>
//         <input placeholder="Company Name" className="prf-input" />
//         <h4>How big is your company?</h4>
//         <div className="prf-grid">
//           {["Solo", "2–5", "6–20", "21–100", "101+"].map((size) => (
//             <button className="prf-option-btn" key={size}>{size}</button>
//           ))}
//         </div>
//         <div className="prf-actions">
//           <button className="prf-back" onClick={previousStep}>Back</button>
//           <button className="prf-next" onClick={nextStep}>Next</button>
//         </div>
//       </div>
//     </StepWrapper>
//   );
// };

// const Step3 = () => {
//   const { previousStep, nextStep } = useWizard();
//   return (
//     <StepWrapper key="step3">
//       <div className="prf-step-container">
//         <h2>Is this your first CRM?</h2>
//         <div className="prf-grid">
//           <button className="prf-option-btn">Yes, first CRM</button>
//           <button className="prf-option-btn">No, we’re migrating</button>
//         </div>
//         <div className="prf-actions">
//           <button className="prf-back" onClick={previousStep}>Back</button>
//           <button className="prf-next" onClick={nextStep}>Next</button>
//         </div>
//       </div>
//     </StepWrapper>
//   );
// };

// const Step4 = () => {
//   const { previousStep, nextStep } = useWizard();
//   return (
//     <StepWrapper key="step4">
//       <div className="prf-step-container">
//         <h2>Who will be using the CRM?</h2>
//         <div className="prf-grid">
//           <button className="prf-option-btn">Just Me</button>
//           <button className="prf-option-btn">My Team</button>
//         </div>
//         <div className="prf-actions">
//           <button className="prf-back" onClick={previousStep}>Back</button>
//           <button className="prf-next" onClick={nextStep}>Finish</button>
//         </div>
//       </div>
//     </StepWrapper>
//   );
// };

// const Success = () => {
//   return (
//     <StepWrapper key="success">
//       <div className="prf-step-container">
//         <h2>🎉 You're All Set!</h2>
//         <p>Thanks for completing the onboarding. Let’s get started.</p>
//       </div>
//     </StepWrapper>
//   );
// };

// const PostRegistrationForm = () => {
//   return (
//     <div className="prf-container">
//       <Wizard>
//         <Step1 />
//         <Step2 />
//         <Step3 />
//         <Step4 />
//         <Success />
//       </Wizard>
//     </div>
//   );
// };

// export default PostRegistrationForm;
import React from 'react'

const PostRegistrationForm = () => {
  return (
    <div>PostRegistrationForm</div>
  )
}

export default PostRegistrationForm