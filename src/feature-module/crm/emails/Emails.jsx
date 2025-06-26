import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gapi } from "gapi-script";
import DOMPurify from "dompurify";
import DefaultEditor from "react-simple-wysiwyg";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../core/data/redux/slices/ToastSlice";
import { GoogleAuthContext } from "../../../core/common/context/GoogleAuthContext";

// const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
// const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
// const SCOPES =
//   "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/calendar";
const Emails = () => {
  const [messages, setMessages] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState("INBOX");
  const [showCompose, setShowCompose] = useState(false);
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    body: "",
  });
  const userProfile = useSelector((state)=>state.profile)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const dispatch = useDispatch();

  const handleSend = () => {

    setShowCompose(false);
    setFormData({ to: "", subject: "", body: "" });
  };

  // useEffect(() => {
  //   const initClient = () => {
  //     gapi.client
  //       .init({
  //         apiKey: API_KEY,
  //         clientId: CLIENT_ID,
  //         discoveryDocs: [
  //           "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
  //           "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  //         ],
  //         scope: SCOPES,
  //       })
  //       .then(() => {
  //         gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
  //         updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  //       });
  //   };

  //   gapi.load("client:auth2", initClient);
  // }, []);

  // const updateSigninStatus = (isSignedIn) => {
  //   setIsAuthenticated(isSignedIn);
  //   if (isSignedIn) {
  //     fetchMails();
  //   }
  // };

  // const handleAuthClick = () => {
  //   gapi.auth2.getAuthInstance().signIn();
  // };

useEffect(()=>{
if (userProfile.googleConnected) {
      fetchMails();
    }
},[userProfile.googleConnected])

  const handleSignoutClick = () => {
    gapi.auth2.getAuthInstance().signOut();
  };
  const decodeEmailBody = (message) => {
    const encodedBody =
      message?.payload?.body?.data || message?.payload?.parts?.[0]?.body?.data;

    if (!encodedBody) return "";

    const decodedBody = atob(encodedBody.replace(/-/g, "+").replace(/_/g, "/"));
    return DOMPurify.sanitize(decodedBody, { ADD_ATTR: ["style"] });
  };
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

          await new Promise((resolve) => setTimeout(resolve, 10));
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

  const createMeetEvent = () => {
    const start = new Date();
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    gapi.client.calendar.events
      .insert({
        calendarId: "primary",
        conferenceDataVersion: 1,
        resource: {
          summary: "My Meeting",
          start: { dateTime: start.toISOString() },
          end: { dateTime: end.toISOString() },
          conferenceData: {
            createRequest: {
              requestId: "unique-id-" + new Date().getTime(),
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
        },
      })
      .then((res) => {
        const meetLink = res.result.conferenceData.entryPoints.find(
          (e) => e.entryPointType === "video"
        )?.uri;
      })
      .catch((err) => {
        console.error("Error creating event:", err);
      });
  };
  const sendEmail = async (e) => {
    // if (
    //   !formData.to ||
    //   !formData.subject ||
    //   !formData.body
    // ) {
    //   alert("Please fill all fields");
    //   return;
    // }
    e.preventDefault();

    const headers = [
      `To: ${formData.to}`,
      `Subject: ${formData.subject}`,
      "Content-Type: text/html; charset=utf-8",
      "",
      `<p>${formData.body}</p>`,
    ];

    const email = headers.join("\r\n");

    const base64EncodedEmail = btoa(
      new TextEncoder()
        .encode(email)
        .reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
    try {
      await gapi.client.gmail.users.messages.send({
        userId: "me",
        resource: {
          raw: base64EncodedEmail,
        },
      });
      dispatch(
        showToast({ message: "Email sent successfully", variant: "success" })
      );
      setFormData({
        to: "",
        subject: "",
        body: "",
      });
    } catch (error) {
      dispatch(showToast({ message: "Email not sent", variant: "danger" }));
      console.error("Error sending email:", error);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          {/* <iframe
            src="https://calendar.google.com/calendar/embed?src=waqar.78692@gmail.com"
            width="800"
            height="600"
            frameborder="0"
            scrolling="no"
          ></iframe> */}
          <button onClick={createMeetEvent}>Create Google Meet Link</button>
          {/* {!isSignedIn ? (
            <button onClick={signIn}>Sign in with Google</button>
          ) : (
            <>
              <button onClick={signOut}>Sign out</button>
            </>
          )} */}

          <div className="col-lg-3 col-md-12">
            <div className="compose-btn">
              <Link
                to="#"
                className="btn btn-primary btn-block w-100"
                onClick={() => setShowCompose(true)}
              >
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
                {showCompose ? (
                  <div className="compose-container">
                    <form onSubmit={sendEmail}>
                      <h3>Compose Email</h3>
                      <div className="mb-3">
                        <label>To:</label>
                        <input
                          type="email"
                          name="to"
                          className="form-control"
                          value={formData.to}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label>Subject:</label>
                        <input
                          type="text"
                          className="form-control"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label>Body:</label>
                        <DefaultEditor
                          name="body"
                          placeholder="Enter text here"
                          onChange={handleInputChange}
                          value={formData.body}
                        />
                      </div>
                      <div className="d-flex justify-content-end mt-4">
                        <button
                          className="btn btn-danger"
                          onClick={() => setShowCompose(false)}
                          style={{ marginRight: "10px" }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={sendEmail}
                        >
                          Send
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <>
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
                                      onClick={() =>
                                        setSelectedMessage(message)
                                      }
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emails;
