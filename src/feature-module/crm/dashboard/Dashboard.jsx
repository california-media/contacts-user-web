import { useEffect, useRef, useState } from "react";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import GroupsOffcanvas from "../../../core/common/offCanvas/groups/GroupsOffcanvas";
import { all_routes } from "../../router/all_routes";
import { Link } from "react-router-dom";
import Tesseract from "tesseract.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../../core/data/redux/slices/ProfileSlice";
import { fetchTags } from "../../../core/data/redux/slices/TagSlice";
import LoadingIndicator from "../../../core/common/loadingIndicator/LoadingIndicator";
import AvatarInitialStyles from "../../../core/common/nameInitialStyles/AvatarInitialStyles";
import LoadingIndicator2 from "../../../core/common/loadingIndicator/LoadingIndicator2";
import CopyableInput from "../../../core/common/CopyableInput";
import Calendar from "../calendar/Calendar";
import { Spin } from "antd";
import api from "../../../core/axios/axiosInstance";

const Dashboard = () => {
  const [file, setFile] = useState();
  const [progress, setProgress] = useState(0);
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [language, setLanguage] = useState("eng");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [quotes, setQuotes] = useState([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [quotesLoading, setQuotesLoading] = useState(false);
  const dispatch = useDispatch();
  const qrCodeRef = useRef();
  const userProfile = useSelector((state) => state.profile);
  const { tags, error } = useSelector((state) => state.tags);
  const [copied, setCopied] = useState(false);
  const profileLink = `https://demo.contacts.management/shareProfile/${userProfile.firstname.replace(
    /\s/g,
    ""
  )}${userProfile.serialNumber}`;

  const [sline] = useState({
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    // colors: ['#4361ee'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    series: [
      {
        name: "Contacts",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],

    grid: {
      row: {
        colors: ["#f1f2f3", "transparent"],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
    },
  });
  const route = all_routes;

  // Helper function to get display name with capitalization
  const getDisplayName = () => {
    const capitalize = (str) => {
      if (!str) return "";
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    if (userProfile.firstname && userProfile.lastname) {
      return `${capitalize(userProfile.firstname)} ${capitalize(
        userProfile.lastname
      )}`;
    } else if (userProfile.firstname) {
      return capitalize(userProfile.firstname);
    } else if (userProfile.lastname) {
      return capitalize(userProfile.lastname);
    } else if (userProfile.email) {
      return userProfile.email.split("@")[0];
    } else if (userProfile.phonenumbers?.length > 0) {
      return userProfile.phonenumbers[0];
    }
    return "User";
  };

  // Get formatted today's date
  const getFormattedDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  ///already fethced it in router.jsx
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        await dispatch(fetchProfile()).unwrap();
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [dispatch]);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    // adaptiveHeight: true,
  };

  useEffect(() => {
    const getQrCodeValue = JSON.stringify({
      firstname: userProfile.firstname,
      lastname: userProfile.lastname,
      email: userProfile.email,
      phone:
        userProfile.phonenumbers.length > 0 ? userProfile.phonenumbers[0] : "",
    });
    setQrCodeValue(getQrCodeValue);
  }, [userProfile]);

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  // Fetch quotes
  useEffect(() => {
    const fetchQuotes = async () => {
      setQuotesLoading(true);
      try {
        const response = await api.get("/quote/get");
        if (response.data.quotes) {
          const quotesArray = Array.isArray(response.data.quotes)
            ? response.data.quotes
            : [];
          setQuotes(quotesArray);
        }
      } catch (error) {
        console.error("Error fetching quotes:", error);
        setQuotes([]);
      } finally {
        setQuotesLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  // Rotate quotes every 4 seconds (2 more seconds than original)
  useEffect(() => {
    if (quotes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [quotes.length]);
  const processImage = () => {
    setResult("");
    setProgress(0);
    Tesseract.recognize(file, language, {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(m.progress);
        }
      },
    }).then(({ data: { text } }) => {
      setResult(text);
    });
  };
  const whatsappShareLink = `Here is my contact: https://demo.contacts.management/shareProfile/${userProfile.firstname}${userProfile.serialNumber}`;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileLink);
      setCopied(true);
      console.log("copied");

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  {
    console.log(userProfile.qrCode, "userProfile.qrCode");
  }
  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center vh-100 w-100">
          {" "}
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="page-wrapper " style={{ height: "100%" }}>
            <div className="content " style={{ height: "100%" }}>
              <div className="container-fluid">
                {/* Quotes Section */}
                <div className="row mb-2">
                  <div className="col-md-12">
                    <div
                      style={{
                        background: "transparent",
                        borderRadius: "0",
                        padding: "8px 0",
                        minHeight: "auto",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        color: "#333",
                        boxShadow: "none",
                        position: "relative",
                        overflow: "visible",
                      }}
                    >
                      {/* Quote Ribbon */}
                      <div
                      className="mt-1"
                        style={{
                          position: "relative",
                          height: "40px",
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          marginBottom: "4px",
                          overflow: "hidden",
                        }}
                      >
                        {quotes.length > 0 && !quotesLoading && (
                          <>
                            {/* Previous quote sliding out */}
                            <div
                              key={`quote-prev-${currentQuoteIndex}`}
                              className="text-primary"
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                animation:
                                  "slideOutUp 0.6s ease-in-out forwards",
                                fontSize: "16px",
                                fontWeight: "500",
                                fontStyle: "italic",
                                textAlign: "left",
                                lineHeight: "1.4",
                                
                              }}
                            >
                              "
                              {
                                quotes[
                                  (currentQuoteIndex - 1 + quotes.length) %
                                    quotes.length
                                ]?.quoteText
                              }
                              "
                            </div>
                            {/* Current quote sliding in */}
                            <div
                              key={`quote-current-${currentQuoteIndex}`}
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                animation:
                                  "slideInUpQuote 0.6s ease-in-out forwards",
                                fontSize: "16px",
                                fontWeight: "500",
                                fontStyle: "italic",
                                textAlign: "left",
                                lineHeight: "1.4",
                               
                              }}
                              className="text-primary"
                            >
                              "
                              {quotes[currentQuoteIndex]?.quoteText ||
                                "No quotes available"}
                              "
                            </div>
                          </>
                        )}
                        {quotesLoading && (
                          <p
                            style={{
                              fontSize: "14px",
                              margin: 0,
                              color: "#999",
                            }}
                          >
                            Loading quotes...
                          </p>
                        )}
                      </div>

                      {/* Greeting */}
                      <div style={{ textAlign: "left" }}>
                        <p
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            margin: 0,
                            letterSpacing: "0.3px",
                            color: "#333",
                          }}
                        >
                          Hello, {getDisplayName()}!
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            fontWeight: "400",
                            margin: "2px 0 0 0",
                            opacity: "0.7",
                     
                          }}
                          className="text-primary"
                        >
                          {getFormattedDate()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add CSS animation */}
                <style>{`
                  @keyframes slideInUpQuote {
                    from {
                      opacity: 0;
                      transform: translateY(30px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                  @keyframes slideOutUp {
                    from {
                      opacity: 1;
                      transform: translateY(0);
                    }
                    to {
                      opacity: 0;
                      transform: translateY(-30px);
                    }
                  }
                `}</style>

                <div className="row">
                  <div className="col-md-6 mb-md-4 mb-2">
                    <div className="dashboardSmallCards h-100">
                      <div className="d-flex align-items-center">
                        {!userProfile.profileImageURL ? (
                          <div style={{ marginRight: "20px" }}>
                            <AvatarInitialStyles
                              name={`${userProfile.firstname} ${userProfile.lastname}`}
                              divStyles={{
                                width: 88,
                                height: 88,
                                borderRadius: 10,
                              }}
                            />
                          </div>
                        ) : (
                          <img
                            src={userProfile.profileImageURL}
                            alt="Profile Banner"
                            className="profileCardImg"
                            style={{
                              border: "1px solid white",
                              marginRight: "20px",
                            }}
                          />
                        )}
                        <div>
                          <div>
                            <p
                              className="line-clamp-1"
                              style={{
                                color: "#030303",
                                fontSize: "24px",
                                fontWeight: 500,
                                lineHeight: "32px",
                                marginBottom: "8px",
                                textAlign: "left",
                              }}
                            >
                              {userProfile.firstname.charAt(0).toUpperCase() +
                                userProfile.firstname.slice(1)}
                              {userProfile.lastname}
                            </p>
                          </div>
                          {userProfile?.designation && (
                            <div
                              className="d-flex align-items-center"
                              style={{ marginBottom: "8px" }}
                            >
                              <ImageWithBasePath
                                src="assets/img/icons/briefCase.png"
                                alt="Designation"
                                width={18}
                                height={18}
                                style={{ flexShrink: 0 }}
                              />
                              <p
                                className="line-clamp-1"
                                style={{
                                  color: "#777B8B",
                                  fontSize: "14px",
                                  fontWeight: 400,
                                  lineHeight: "20px",
                                  marginLeft: "8px",
                                }}
                              >
                                {userProfile.designation}
                              </p>
                            </div>
                          )}
                          <Link
                            className="d-flex align-items-center"
                            style={{ marginBottom: "8px" }}
                            to={`${route.shareProfile}/${userProfile.firstname}${userProfile.serialNumber}`}
                            target="_blank"
                          >
                            <ImageWithBasePath
                              src="assets/img/icons/shareIcon.png"
                              alt="share"
                              width={18}
                              height={18}
                              style={{ flexShrink: 0 }}
                            />
                            <p
                              style={{
                                color: "#777B8B",
                                fontSize: "14px",
                                fontWeight: 400,
                                lineHeight: "20px",
                                marginLeft: "8px",
                              }}
                            >
                              Share Profile
                            </p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <button
                    onClick={async () =>
                      await api.get("/editProfile/testingonesignal")
                    }
                  >
                    click
                  </button> */}
                  <div className="col-md-6 mb-md-4 mb-2">
                    <div className="dashboardSmallCards d-flex flex-column flex-sm-row justify-content-between align-items-center h-100">
                      <img
                        src={userProfile.qrCode}
                        alt="QR Code"
                        style={{ width: "120px", height: "120px" }}
                        className="qrCodeImg mb-3 mb-sm-0 "
                      />
                      <div className="w-100">
                        <div
                          className="d-flex align-items-center justify-content-end mb-md-0 m-auto m-md-0  mb-3 overflow-hidden"
                          style={{ maxWidth: "300px" }}
                        >
                          <CopyableInput value={profileLink} />
                        </div>

                        <div className="d-flex align-items-center justify-content-center justify-content-sm-end mt-3">
                          <p
                            style={{
                              color: "#5D606D",
                              fontSize: "14px",
                              fontWeight: 400,
                              lineHeight: "20px",
                              marginRight: "8px",
                              marginBottom: 0,
                            }}
                          >
                            Share via
                          </p>
                          {userProfile?.phonenumbers?.length > 0 && (
                            <a
                              href={`https://wa.me/?text=${whatsappShareLink}`}
                              target="_blank"
                              style={{ marginRight: "8px" }}
                            >
                              <ImageWithBasePath
                                src="assets/img/icons/whatsappWithBg.png"
                                alt="link"
                                width={48}
                                height={48}
                              />
                            </a>
                          )}
                          {userProfile.email && (
                            <a
                              href={`mailto:${userProfile.email}`}
                              className=""
                            >
                              <ImageWithBasePath
                                src="assets/img/icons/emailWithBg.png"
                                alt="link"
                                width={48}
                                height={48}
                              />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 fitContentHeight">
                    <div className="row mb-4">
                      <div className="col-md-3 mb-md-4 mb-2 fitContentHeight">
                        <Link to={route.contacts}>
                          <div className="dashboardSmallCards">
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <p
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    lineHeight: "20px",
                                    color: "#373940",
                                  }}
                                >
                                  Contacts
                                </p>
                                <p
                                  style={{
                                    fontSize: "30px",
                                    fontWeight: 700,
                                    color: "#1C3C8C",
                                    lineHeight: "38px",
                                  }}
                                >
                                  {userProfile.isLoading ? (
                                    <LoadingIndicator />
                                  ) : (
                                    userProfile.contactCount
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="d-flex align-items-center mt-2">
                              <img
                                src="/assets/img/icons/trendingIcon.svg"
                                className="me-2"
                              />
                              <p
                                style={{
                                  color: "#484A54",
                                  marginBottom: 0,
                                  fontSize: "12px",
                                  fontWeight: 400,
                                  lineHeight: "18px",
                                }}
                              >
                                No change from last month
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="col-md-3 mb-md-4 mb-2 fitContentHeight">
                        <Link
                          className="dropdown-item p-0 bgWhiteOnLinkHover"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#groups_offcanvas"
                        >
                          <div className="dashboardSmallCards">
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <p
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    lineHeight: "20px",
                                    color: "#373940",
                                  }}
                                >
                                  Groups
                                </p>
                                <p
                                  style={{
                                    fontSize: "30px",
                                    fontWeight: 700,
                                    color: "#1C3C8C",
                                    lineHeight: "38px",
                                  }}
                                >
                                  {userProfile.isLoading ? (
                                    <LoadingIndicator />
                                  ) : (
                                    tags.length
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="d-flex align-items-center mt-2">
                              <img
                                src="/assets/img/icons/trendingIcon.svg"
                                className="me-2"
                              />
                              <p
                                style={{
                                  color: "#484A54",
                                  marginBottom: 0,
                                  fontSize: "12px",
                                  fontWeight: 400,
                                  lineHeight: "18px",
                                }}
                              >
                                No change from last month
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="col-md-3 mb-md-4 mb-2 fitContentHeight">
                        <Link to={route.scans}>
                          <div className="dashboardSmallCards">
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <p
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    lineHeight: "20px",
                                    color: "#373940",
                                  }}
                                >
                                  Scans
                                </p>
                                <p
                                  style={{
                                    fontSize: "30px",
                                    fontWeight: 700,
                                    color: "#1C3C8C",
                                    lineHeight: "38px",
                                  }}
                                >
                                  {userProfile.isLoading ? (
                                    <LoadingIndicator />
                                  ) : (
                                    userProfile.totalScans
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="d-flex align-items-center mt-2">
                              <img
                                src="/assets/img/icons/trendingIcon.svg"
                                className="me-2"
                              />
                              <p
                                style={{
                                  color: "#484A54",
                                  marginBottom: 0,
                                  fontSize: "12px",
                                  fontWeight: 400,
                                  lineHeight: "18px",
                                }}
                              >
                                No change from last month
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="col-md-3 mb-md-4 mb-2 fitContentHeight">
                        <Link to={route.templates}>
                          <div className="dashboardSmallCards">
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <p
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    lineHeight: "20px",
                                    color: "#373940",
                                  }}
                                >
                                  Templates
                                </p>
                                <p
                                  style={{
                                    fontSize: "30px",
                                    fontWeight: 700,
                                    color: "#1C3C8C",
                                    lineHeight: "38px",
                                  }}
                                >
                                  {userProfile.isLoading ? (
                                    <LoadingIndicator />
                                  ) : (
                                    userProfile.totalTemplates
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="d-flex align-items-center mt-2">
                              <img
                                src="/assets/img/icons/trendingIcon.svg"
                                className="me-2"
                              />
                              <p
                                style={{
                                  color: "#484A54",
                                  marginBottom: 0,
                                  fontSize: "12px",
                                  fontWeight: 400,
                                  lineHeight: "18px",
                                }}
                              >
                                No change from last month
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 fitContentHeight">
                    <Calendar />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <GroupsOffcanvas />
        </>
      )}
    </>
  );
};

export default Dashboard;
