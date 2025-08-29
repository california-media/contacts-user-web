import React, { useState } from "react";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import PhoneInput from "react-phone-input-2";
import "./helpAndSupport.css";

const HelpAndSupport = () => {
  const [activeType, setActiveType] = useState("General");
  const [attachment, setAttachment] = useState(null);
  const [phone, setPhone] = useState("");

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted successfully!");
  };

  const socialMedia = [
    {
      name: "Instagram",
      icon: "assets/img/icons/instagramIcon.png",
      link: "https://www.instagram.com/californiamedia/",
    },
    {
      name: "LinkedIn",
      icon: "assets/img/icons/linkedinIcon.png",
      link: "https://ae.linkedin.com/company/california-media-llc",
    },
    {
      name: "Facebook",
      icon: "assets/img/icons/facebookIcon.png",
      link: "https://www.facebook.com/californiamediauae/",
    },
    {
      name: "Twitter",
      icon: "assets/img/icons/twitterIcon.png",
      link: "https://x.com/californiamedia",
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="text-center mb-4">
          <h1 className="help-heading">You Have Questions, We Have Answers</h1>
          <p className="help-description">
            Discover experiences you won’t find anywhere else — thoughtfully
            designed to immerse you <span className="line-break" /> in the heart
            of the destination. Soulful stories waiting to be lived.
          </p>
        </div>
        <div className="help-support-wrapper">

          <div className="help-right-section">
            {/* <h2>Tell Us What You Need</h2>
            <p>
              Our team is ready to assist you with every detail, big or small.
            </p> */}

            <form className="help-form" onSubmit={handleSubmit}>
              <div className="d-sm-flex">
                <div className="custom-floating-label me-2" style={{ flex: 1 }}>
                  <input
                    type="text"
                    id="name"
                    placeholder="John Doe"
                    name="name"
                    required
                  />
                  <label htmlFor="name">Name</label>
                </div>
                <div className="custom-floating-label" style={{ flex: 1 }}>
                  <input
                    type="text"
                    id="subject"
                    placeholder="I have a question about ..."
                    name="subject"
                    required
                  />
                  <label htmlFor="subject">Subject</label>
                </div>
              </div>
              <div className="d-sm-flex">
                <div className="custom-floating-label me-2" style={{ flex: 1 }}>
                  <input
                    type="email"
                    id="email"
                    placeholder="john.doe@example.com"
                    name="email"
                    required
                  />
                  <label htmlFor="email">Email</label>
                </div>
                <div className="mb-4" style={{ flex: 1 }}>
                  <PhoneInput
                    country={"ae"}
                    value={phone}
                    onChange={(value) => setPhone("+" + value)}
                    enableSearch
                    inputProps={{ name: "phone" }}
                    inputStyle={{ background: "#fff", fontSize: 14 }}
                  />
                </div>
              </div>

              <div className="help-inquiry">
                <label style={{ fontWeight: "bold" }}>Type of Inquiry</label>
                <div className="help-tag-group">
                  {[
                    "General",
                    "Billing & Subscription",
                    "Support",
                    "Bug Report",
                    "Others",
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`help-tag-button ${
                        activeType === tag ? "active" : ""
                      }`}
                      onClick={() => setActiveType(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                className="help-textarea"
                placeholder="Message"
                rows={4}
                required
              ></textarea>

              <div className="help-attachment-wrapper">
                <label htmlFor="fileUpload" className="help-attachment-btn">
                  Attach File
                </label>
                <input
                  id="fileUpload"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                {attachment && (
                  <span className="help-file-name">{attachment.name}</span>
                )}
              </div>

              <div className="help-checkbox">
                <input type="checkbox" id="updates" />
                <label htmlFor="updates" className="ms-2">
                  I'd like to receive exclusive offers & updates
                </label>
              </div>

              <button type="submit" className="help-submit-btn">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupport;
