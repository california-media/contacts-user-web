import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gapi } from "gapi-script";
import DOMPurify from "dompurify";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SCOPES =
  "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send";
const Emails = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState("INBOX");
const [showCompose, setShowCompose] = useState(false);

  const [formData, setFormData] = useState({
  to: "",
  subject: "",
  body: ""
});
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleSend = () => {
  // Replace with actual send logic
  console.log("Sending email:", formData);
  setShowCompose(false);
  setFormData({ to: "", subject: "", body: "" });
};
  console.log("CLIENT_ID:", CLIENT_ID);
  console.log("API_KEY:", API_KEY);
  useEffect(() => {
    const initClient = () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
          ],
          scope: SCOPES,
        })
        .then(() => {
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    };

    gapi.load("client:auth2", initClient);
  }, []);

  const updateSigninStatus = (isSignedIn) => {
    setIsAuthenticated(isSignedIn);
    if (isSignedIn) {
      fetchMails();
    }
  };

  const handleAuthClick = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignoutClick = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  //   const decodeEmailBody = (message) => {
  //     const bodyData =
  //       message.payload.body.data || message.payload.parts?.[0]?.body?.data || "";

  //     if (!bodyData) return "No content";

  //     // Gmail returns base64url encoded strings — convert to standard base64 first
  //     const decoded = atob(bodyData.replace(/-/g, "+").replace(/_/g, "/"));
  //     return decoded;
  //   };
  const decodeEmailBody = (message) => {
    const encodedBody =
      message?.payload?.body?.data || message?.payload?.parts?.[0]?.body?.data;

    if (!encodedBody) return "";

    const decodedBody = atob(encodedBody.replace(/-/g, "+").replace(/_/g, "/"));
    return DOMPurify.sanitize(decodedBody, { ADD_ATTR: ["style"] });
  };

  //   const sendEmail = async () => {
  //     if (!to || !subject || !message) {
  //       alert("Please fill all fields");
  //       return;
  //     }

  //     const headers = [
  //       `To: ${to}`,
  //       `Subject: ${subject}`,
  //       "Content-Type: text/html; charset=utf-8",
  //       "",
  //       `<p>${message}</p>`,
  //     ];

  //     const email = headers.join("\r\n");
  //      const base64EncodedEmail = btoa(
  //     new TextEncoder().encode(email)
  //       .reduce((data, byte) => data + String.fromCharCode(byte), '')
  //   )
  //     try {
  //       await gapi.client.gmail.users.messages.send({
  //         userId: "me",
  //         resource: {
  //           raw: base64EncodedEmail,
  //         },
  //       });
  //       alert("Email sent successfully!");
  //       setTo("");
  //       setSubject("");
  //       setMessage("");
  //     } catch (error) {
  //       console.error("Error sending email:", error);
  //     }
  //   };
  const fetchMails = async (label = "INBOX") => {
    try {
      const response = await gapi.client.gmail.users.messages.list({
        userId: "me",
        labelIds: [label],
        maxResults: 10,
      });

      const messages = response.result.messages || [];
      const messageDetails = [];

      for (const msg of messages) {
        try {
          const res = await gapi.client.gmail.users.messages.get({
            userId: "me",
            id: msg.id,
          });

          const isStarred = res.result.labelIds?.includes("STARRED");
          messageDetails.push({ ...res.result, isStarred });

          await new Promise((resolve) => setTimeout(resolve, 10)); // prevent rate limits
        } catch (err) {
          console.error("Error fetching message:", err);
        }
      }

      setMessages(
        messageDetails.sort(
          (a, b) => parseInt(b.internalDate) - parseInt(a.internalDate)
        )
      );
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  //   const fetchMails = async () => {
  //     const response = await gapi.client.gmail.users.messages.list({
  //       userId: "me",
  //       labelIds: ["INBOX"],
  //       maxResults: 50,
  //     });

  //     const messages = response.result.messages;
  //     const messageDetails = [];

  //     for (const msg of messages) {
  //       try {
  //         const res = await gapi.client.gmail.users.messages.get({
  //           userId: "me",
  //           id: msg.id,
  //         });

  //         const isStarred = res.result.labelIds?.includes("STARRED");

  //         messageDetails.push({
  //           ...res.result,
  //           isStarred,
  //         });

  //         await new Promise((resolve) => setTimeout(resolve, 10));
  //       } catch (err) {
  //         console.error("Rate limit error:", err);
  //       }
  //     }

  //     setMessages(
  //       messageDetails.sort(
  //         (a, b) => parseInt(b.internalDate) - parseInt(a.internalDate)
  //       )
  //     );
  //   };
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          {!isAuthenticated ? (
            <button onClick={handleAuthClick}>Sign in with Google</button>
          ) : (
            <>
              <button onClick={handleSignoutClick}>Sign out</button>
            </>
          )}

          {/* {isAuthenticated && (
            <>
              <div style={{ margin: "20px 0" }}>
                <input
                  type="email"
                  placeholder="Recipient"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  style={{
                    marginBottom: "10px",
                    width: "100%",
                    padding: "8px",
                  }}
                />
                <input
                  type="text"
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{
                    marginBottom: "10px",
                    width: "100%",
                    padding: "8px",
                  }}
                />
                <textarea
                  placeholder="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
              <button onClick={sendEmail}>Send Email</button>
            </>
          )} */}
          <div className="col-lg-3 col-md-12">
            <div className="compose-btn">
              <Link to="#" className="btn btn-primary btn-block w-100" onClick={() => setShowCompose(true)}>
                Compose
              </Link>
            </div>
            <ul className="inbox-menu">
              <li
                style={
                  filter === "INBOX"
                    ? { backgroundColor: "rgba(33, 33, 33, 0.05)" }
                    : {}
                }
              >
                <Link
                  to="#"
                  onClick={() => {
                    setFilter("INBOX");
                    fetchMails("INBOX");
                    setShowCompose(false);
                  }}
                >
                  <i className="fas fa-download" /> Inbox{" "}
                </Link>
              </li>
              <li
                style={
                  filter === "STARRED"
                    ? { backgroundColor: "rgba(33, 33, 33, 0.05)" }
                    : {}
                }
              >
                <Link
                  to="#"
                  onClick={() => {
                    setFilter("STARRED");
                    fetchMails("STARRED");
                    setShowCompose(false);
                  }}
                >
                  <i className="far fa-star" /> Important
                </Link>
              </li>
              <li
                style={
                  filter === "SENT"
                    ? { backgroundColor: "rgba(33, 33, 33, 0.05)" }
                    : {}
                }
              >
                <Link
                  to="#"
                  onClick={() => {
                    setFilter("SENT");
                    fetchMails("SENT");
                    setShowCompose(false);
                  }}
                >
                  <i className="far fa-paper-plane" /> Sent Mail
                </Link>
              </li>
              <li
                style={
                  filter === "DRAFT"
                    ? { backgroundColor: "rgba(33, 33, 33, 0.05)" }
                    : {}
                }
              >
                <Link
                  to="#"
                  onClick={() => {
                    setFilter("DRAFT");
                    fetchMails("DRAFT");
                    setShowCompose(false);
                  }}
                >
                  <i className="far fa-file-alt" /> Drafts{" "}
                </Link>
              </li>
              <li
                style={
                  filter === "TRASH"
                    ? { backgroundColor: "rgba(33, 33, 33, 0.05)" }
                    : {}
                }
              >
                <Link
                  to="#"
                  onClick={() => {
                    setFilter("TRASH");
                    fetchMails("TRASH");
                    setShowCompose(false);
                  }}
                >
                  <i className="far fa-trash-alt" /> Trash
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-9 col-md-12">
            <div className="card">
              <div className="card-body">
                {showCompose ?
                 <div className="compose-container">
    <h3>Compose Email</h3>
    <div>
      <label>To:</label>
      <input
        type="email"
        name="to"
        value={formData.to}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label>Subject:</label>
      <input
        type="text"
        name="subject"
        value={formData.subject}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label>Body:</label>
      <textarea
        name="body"
        rows="10"
        value={formData.body}
        onChange={handleInputChange}
      />
    </div>
    <div style={{ marginTop: "10px" }}>
      <button onClick={handleSend}>Send</button>
      <button onClick={() => setShowCompose(false)} style={{ marginLeft: "10px" }}>
        Cancel
      </button>
    </div>
  </div>
                
                
                :<>
                    <div className="email-header">
                      <div className="row">
                        <div className="col-lg-9 top-action-left col-sm-12">
                          <div className="float-left">
                            <div className="btn-group dropdown-action me-1">
                              <button
                                type="button"
                                className="btn btn-white dropdown-toggle"
                                data-bs-toggle="dropdown"
                              >
                                Select <i className="fas fa-angle-down" />
                              </button>
                              <div className="dropdown-menu">
                                <Link className="dropdown-item" to="#">
                                  All
                                </Link>
                                <Link className="dropdown-item" to="#">
                                  None
                                </Link>
                                <div className="dropdown-divider" />
                                <Link className="dropdown-item" to="#">
                                  Read
                                </Link>
                                <Link className="dropdown-item" to="#">
                                  Unread
                                </Link>
                              </div>
                            </div>
                            <div className="btn-group dropdown-action me-1">
                              <button
                                type="button"
                                className="btn btn-white dropdown-toggle"
                                data-bs-toggle="dropdown"
                              >
                                Actions <i className="fas fa-angle-down" />
                              </button>
                              <div className="dropdown-menu">
                                <Link className="dropdown-item" to="#">
                                  Reply
                                </Link>
                                <Link className="dropdown-item" to="#">
                                  Forward
                                </Link>
                                <Link className="dropdown-item" to="#">
                                  Archive
                                </Link>
                                <div className="dropdown-divider" />
                                <Link className="dropdown-item" to="#">
                                  Mark As Read
                                </Link>
                                <Link className="dropdown-item" to="#">
                                  Mark As Unread
                                </Link>
                                <div className="dropdown-divider" />
                                <Link className="dropdown-item" to="#">
                                  Delete
                                </Link>
                              </div>
                            </div>
                            <div className="btn-group dropdown-action me-1">
                              <button
                                type="button"
                                className="btn btn-white dropdown-toggle"
                                data-bs-toggle="dropdown"
                              >
                                <i className="fas fa-folder" />{" "}
                                <i className="fas fa-angle-down" />
                              </button>
                              <div role="menu" className="dropdown-menu">
                                <Link className="dropdown-item" to="#">
                                  Social
                                </Link>
                                <Link className="dropdown-item" to="#">
                                  Forums
                                </Link>
                                <Link className="dropdown-item" to="#">
                                  Updates
                                </Link>
                                <div className="dropdown-divider" />
                                <Link className="dropdown-item" to="#">
                                  Spam
                                </Link>
                                <Link className="dropdown-item" to="#">
                                  Trash
                                </Link>
                                <div className="dropdown-divider" />
                                <Link className="dropdown-item" to="#">
                                  New
                                </Link>
                              </div>
                            </div>
                            <div className="btn-group dropdown-action me-1">
                              <button
                                type="button"
                                data-bs-toggle="dropdown"
                                className="btn btn-white dropdown-toggle"
                              >
                                <i className="fas fa-tags" />{" "}
                                <i className="fas fa-angle-down" />
                              </button>
                              <div role="menu" className="dropdown-menu">
                                <Link className="dropdown-item" to="#">
                                  Work
                                </Link>
                                <Link className="dropdown-item" to="#">
                                  Family
                                </Link>
                                <Link className="dropdown-item" to="#">
                                  Social
                                </Link>
                                <div className="dropdown-divider" />
                                <Link className="dropdown-item" to="#">
                                  Primary
                                </Link>
                                <Link className="dropdown-item" to="#">
                                  Promotions
                                </Link>
                                <Link className="dropdown-item" to="#">
                                  Forums
                                </Link>
                              </div>
                            </div>
                            <div className="btn-group dropdown-action mail-search">
                              <input
                                type="text"
                                placeholder="Search Messages"
                                className="form-control search-message"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 top-action-right col-sm-12">
                          <div className="text-end ">
                            <button
                              type="button"
                              title="Refresh"
                              data-toggle="tooltip"
                              className="btn btn-white d-none d-md-inline-block me-1"
                            >
                              <i className="fas fa-sync-alt" />
                            </button>
                            <div className="btn-group">
                              <Link to="#" className="btn btn-white">
                                <i className="fas fa-angle-left" />
                              </Link>
                              <Link to="#" className="btn btn-white">
                                <i className="fas fa-angle-right" />
                              </Link>
                            </div>
                          </div>
                          <div className="text-end">
                            <span className="text-muted d-none d-md-inline-block">
                              Showing 10 of 112{" "}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="email-content">
                      {!selectedMessage ? (
                        <div className="table-responsive">
                          <table className="table table-inbox table-hover">
                            <thead>
                              <tr>
                                <th colSpan={6}>
                                  <label className="checkboxs">
                                    <input type="checkbox" id="select-all" />
                                    <span className="checkmarks" />
                                  </label>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {messages.map((message, index) => {
                                const fromHeader = message.payload.headers.find(
                                  (header) => header.name === "From"
                                )?.value;
                                const subject = message.payload.headers.find(
                                  (header) => header.name === "Subject"
                                )?.value;
                                const date = message.payload.headers.find(
                                  (header) => header.name === "Date"
                                )?.value;
    
                                return (
                                  <React.Fragment key={index}>
                                    <tr
                                      className="unread clickable-row cursor-pointer"
                                      onClick={() => setSelectedMessage(message)}
                                    >
                                      <td>
                                        <label className="checkboxs">
                                          <input type="checkbox" />
                                          <span className="checkmarks" />
                                        </label>
                                      </td>
                                      <td>
                                        <span className="mail-important">
                                          <i
                                            className={
                                              message.isStarred
                                                ? "fas fa-star starred"
                                                : "far fa-star"
                                            }
                                          />
                                        </span>
                                      </td>
                                      <td className="name">
                                        {fromHeader
                                          ?.match(/(.*)<.*>/)?.[1]
                                          .trim() || fromHeader}
                                      </td>
                                      <td className="subject">{subject}</td>
                                      <td></td>
                                      <td className="mail-date">{date}</td>
                                    </tr>
    
                                    {/* Show message body if selected */}
                                    {selectedMessage?.id === message.id && (
                                      <tr>
                                        <td colSpan="6">
                                          <div
                                            dangerouslySetInnerHTML={{
                                              __html: decodeEmailBody(message),
                                            }}
                                          />
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div>
                          <button
                            className="btn btn-primary mb-2"
                            onClick={() => setSelectedMessage(null)}
                          >
                            ← Back to Inbox
                          </button>
                          <h3>
                            Subject:{" "}
                            {
                              selectedMessage.payload.headers.find(
                                (h) => h.name === "Subject"
                              )?.value
                            }
                          </h3>
                          <p>
                            From:{" "}
                            {
                              selectedMessage.payload.headers.find(
                                (h) => h.name === "From"
                              )?.value
                            }
                          </p>
                          <p>
                            Date:{" "}
                            {
                              selectedMessage.payload.headers.find(
                                (h) => h.name === "Date"
                              )?.value
                            }
                          </p>
                          <hr />
                          <div
                            dangerouslySetInnerHTML={{
                              __html: decodeEmailBody(selectedMessage),
                            }}
                          />
                        </div>
                      )}
                    </div>
                </>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emails;
