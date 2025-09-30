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

const Dashboard = () => {
  const [file, setFile] = useState();
  const [progress, setProgress] = useState(0);
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [language, setLanguage] = useState("eng");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const qrCodeRef = useRef();
  const userProfile = useSelector((state) => state.profile);
  const { tags, error } = useSelector((state) => state.tags);
  console.log("userProfile in dashboardss", userProfile);
  const [copied, setCopied] = useState(false);
  const profileLink = `https://app.contacts.management/shareProfile/${userProfile.firstname.replace(
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
  const whatsappShareLink = `Here is my contact: https://app.contacts.management/shareProfile/${userProfile.firstname}${userProfile.serialNumber}`;
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
          <div
            className="page-wrapper overflow-auto"
            style={{ height: "calc(100vh - 50px)" }}
          >
            <div className="content overflow-auto">
              <div className="container-fluid">
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
                              style={{
                                color: "#030303",
                                fontSize: "24px",
                                fontWeight: 500,
                                lineHeight: "32px",
                                marginBottom: "8px",
                              }}
                            >
                              {userProfile.firstname} {userProfile.lastname}
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

                  <div className="col-md-6 mb-md-4 mb-2">
                    <div className="dashboardSmallCards d-flex flex-row justify-content-between h-100">
                      <img
                        src={userProfile.qrCode}
                        alt="QR Code"
                        className="qrCodeImg"
                        // style={{
                        //   border: "1px solid white",
                        //   marginRight: "20px",
                        // }}
                      />
                      <div>
                        <div className="d-flex align-items-center justify-content-end mb-md-0 mb-3">
                          <CopyableInput value={profileLink} width={350} />
                        </div>
                        <div className="d-flex align-items-center justify-content-end mt-3">
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
