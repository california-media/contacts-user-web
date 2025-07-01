import React, { useEffect, useRef, useState } from "react";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Image } from "react-bootstrap";
import { FaPhoneAlt, FaRegCopy, FaRegEye, FaTag } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { TbLocation } from "react-icons/tb";
import { MdPeople } from "react-icons/md";
import ReactApexChart from "react-apexcharts";
import { IoCalendar, IoClipboard, IoQrCode } from "react-icons/io5";
import GroupsOffcanvas from "../../../core/common/offCanvas/groups/GroupsOffcanvas";
import { all_routes } from "../../router/all_routes";
import { Link } from "react-router-dom";
import { Camera } from "react-camera-pro";
import Tesseract from "tesseract.js";
import api from "../../../core/axios/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../../core/data/redux/slices/ProfileSlice";
import { fetchTags } from "../../../core/data/redux/slices/TagSlice";
import { QRCode } from "antd";
import LoadingIndicator from "../../../core/common/loadingIndicator/LoadingIndicator";
import AvatarInitialStyles from "../../../core/common/nameInitialStyles/AvatarInitialStyles";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LoadingIndicator2 from "../../../core/common/loadingIndicator/LoadingIndicator2";

const Dashboard = () => {
  const [file, setFile] = useState();
  const [progress, setProgress] = useState(0);
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [language, setLanguage] = useState("eng");
  const [result, setResult] = useState("");
  const[isLoading,setIsLoading] = useState(false)
  const dispatch = useDispatch();
  const qrCodeRef = useRef();
  const userProfile = useSelector((state) => state.profile);
  const { tags, error } = useSelector((state) => state.tags);
  console.log("userProfile in dashboardss", userProfile);
  const [copied, setCopied] = useState(false);
  const profileLink = `https://contacts-user-web.vercel.app/shareProfile/${userProfile.firstname}${userProfile.serialNumber}`;
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
        colors: ["#f1f2f3", "transparent"], // takes an array which will be repeated on columns
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
  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  // useEffect(() => {
  //   dispatch(fetchProfile());
  // }, []);
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
  const whatsappShareLink = `Here is my contact: https://contacts-user-web.vercel.app/${userProfile.firstname}${userProfile.serialNumber}`;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <>
      {isLoading?
          <div className="d-flex justify-content-center align-items-center vh-100 w-100"> <LoadingIndicator2/></div>: <>
        <div className="page-wrapper" style={{ backgroundColor: "#fff" }}>
          <div className="content">
            <div className="container-fluid">
            
             <div className="row">
                <div className="col-md-3">
                  <div className="App">
                    {result !== "" && (
                      <div style={{ marginTop: 20, fontSize: 24, color: "teal" }}>
                        Result: {result}
                      </div>
                    )}
                  </div>
  
                  <div className="dashboardProfileContainer">
                    <ImageWithBasePath
                      src="assets/img/Banner1.png"
                      alt="Profile Banner"
                      className="profileCoverImg"
                    />
                    <div style={{ background: "#fff", position: "relative" }}>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        {!userProfile.profileImageURL ? (
                          <div className="profileCardImg">
                            <AvatarInitialStyles
                              name={`${userProfile.firstname} ${userProfile.lastname}`}
                            />
                          </div>
                        ) : (
                          <img
                            src={userProfile.profileImageURL}
                            alt="Profile Banner"
                            className="profileCardImg"
                            style={{ border: "1px solid white" }}
                          />
                        )}
                      </div>
                      <div
                        style={{ padding: 20, color: "#fff", paddingBottom: 120 }}
                      >
                        <p className="text-center text-dark fs-4 text-capitalize mb-0">
                          {userProfile.firstname} {userProfile.lastname}{" "}
                        </p>
                        {console.log(
                          userProfile.phonenumbers,
                          "userProfilenumber"
                        )}
                        <p className="text-center text-dark fs-6">
                          <i>{userProfile.designation} </i>
                        </p>
                        {userProfile.phonenumbers.length > 0 ? (
                          <div className="profileCardTextContainer">
                            <FaPhoneAlt color="#000" />
                            <p className="profileCardText">
                              {userProfile.phonenumbers[0]}
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                        <div className="profileCardTextContainer">
                          <IoMdMail color="#000" />
                          <p className="profileCardText">{userProfile.email}</p>
                        </div>
  
                        <div className="profileCardQrCodeContainer">
                          {/* <ImageWithBasePath
                            src="assets/img/myQr.png"
                            alt="Profile Banner"
                            className="profileCardQrCode"
                          /> */}
                          <div ref={qrCodeRef}>
                            {/* <QRCode
                              value={qrCodeValue}
                              size={150}
                              className="profileCardQrCode"
                              bgColor="#ffffff"
                            /> */}
                            <img
                              src={userProfile.qrCode}
                              alt="Profile Banner"
                              className="profileCardQrCode"
                              style={{
                                width: 150,
                                height: 150,
                                borderRadius: 10,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="profileCardLowerIcons">
                      <div
                        className="profileCardTextContainer"
                        style={{ paddingLeft: 20 }}
                      >
                        <FaRegEye />
                        <p className="profileCardText">
                          {userProfile.shareProfileCount}
                        </p>
                      </div>
                      {/* <div className="profileCardShareButton"> */}
                      {/* <TbLocation
                          color="#fff"
                          size={22}
                          className="profileCardShareIcon"
                        /> */}
                      <Link
                        style={{ width: 30, marginRight: 20 }}
                        to={`${route.shareProfile}/${userProfile.firstname}${userProfile.serialNumber}`}
                        target="_blank"
                      >
                        <ImageWithBasePath
                          src="assets/img/icons/shareIcon.png"
                          className="img-fluid"
                          alt="Logo"
                        />
                      </Link>
                      {/* </div> */}
                    </div>
                  </div>
                </div>
                <div className="col-md-9 fitContentHeight">
                  <div className="row">
                    <div className="col-md-3 fitContentHeight">
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
                                  fontSize: 20,
                                  marginBottom: 10,
                                  color: "#000",
                                }}
                              >
                                Contacts
                              </p>
                              <p
                                style={{
                                  fontSize: 26,
                                  fontWeight: 500,
                                  color: "#000",
                                }}
                              >
                                {userProfile.isLoading ? (
                                  <LoadingIndicator />
                                ) : (
                                  userProfile.contactCount
                                )}
                              </p>
                            </div>
                            <div
                              style={{
                                width: 70,
                                height: 70,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#e4e4ff",
                                borderRadius: 22,
                              }}
                            >
                              <MdPeople color="#8280ff" size={30} />
                            </div>
                          </div>
                          <div className="d-flex align-items-center mt-2">
                            <img
                              src="/assets/img/icons/trendingIcon.svg"
                              className="me-2"
                            />
                            <p style={{ color: "#39b49b", marginBottom: 0 }}>
                              No change from last month
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="col-md-3 fitContentHeight">
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
                                  fontSize: 20,
                                  marginBottom: 10,
                                  color: "#000",
                                }}
                              >
                                Groups
                              </p>
                              <p
                                style={{
                                  fontSize: 26,
                                  fontWeight: 500,
                                  color: "#000",
                                }}
                              >
                                {userProfile.isLoading ? (
                                  <LoadingIndicator />
                                ) : (
                                  tags.length
                                )}
                              </p>
                            </div>
                            <div
                              style={{
                                width: 70,
                                height: 70,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#fef2d6",
                                borderRadius: 18,
                              }}
                            >
                              <FaTag color="#fec53d" size={30} />
                            </div>
                          </div>
                          <div className="d-flex align-items-center mt-2">
                            <img
                              src="/assets/img/icons/trendingIcon.svg"
                              className="me-2"
                            />
                            <p style={{ color: "#39b49b", marginBottom: 0 }}>
                              No change from last month
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="col-md-3 fitContentHeight">
                      <Link to={route.myScans}>
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
                                  fontSize: 20,
                                  marginBottom: 10,
                                  color: "#000",
                                }}
                              >
                                Scans
                              </p>
                              <p
                                style={{
                                  fontSize: 26,
                                  fontWeight: 500,
                                  color: "#000",
                                }}
                              >
                                {userProfile.isLoading ? (
                                  <LoadingIndicator />
                                ) : (
                                  userProfile.totalScans
                                )}
                              </p>
                            </div>
                            <div
                              style={{
                                width: 70,
                                height: 70,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "rgba(0,0,0,0.1)",
                                borderRadius: 22,
                              }}
                            >
                              <IoQrCode color="#000" size={30} />
                            </div>
                          </div>
                          <div className="d-flex align-items-center mt-2">
                            <img
                              src="/assets/img/icons/trendingIcon.svg"
                              className="me-2"
                            />
                            <p style={{ color: "#39b49b", marginBottom: 0 }}>
                              No change from last month
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="col-md-3 fitContentHeight">
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
                                  fontSize: 20,
                                  marginBottom: 10,
                                  color: "#000",
                                }}
                              >
                                Templates
                              </p>
                              <p
                                style={{
                                  fontSize: 26,
                                  fontWeight: 500,
                                  color: "#000",
                                }}
                              >
                                {userProfile.isLoading ? (
                                  <LoadingIndicator />
                                ) : (
                                  userProfile.totalTemplates
                                )}
                              </p>
                            </div>
                            <div
                              style={{
                                width: 70,
                                height: 70,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#d9f7e7",
                                justifyContent:"center",
                                alignItems:"center",
                                borderRadius: 22,
                              }}
                            >
                              <IoClipboard color="#4ad991" size={30} />
                              {/* <i class="fa-solid fa-clipboard" fontSize="300"></i> */}
                            </div>
                          </div>
                          <div className="d-flex align-items-center mt-2">
                            <img
                              src="/assets/img/icons/trendingIcon.svg"
                              className="me-2"
                            />
                            <p style={{ color: "#39b49b", marginBottom: 0 }}>
                              No change from last month
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div className="row mt-5">
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="row">
                            <div className="col-md-12 mb-4 fitContentHeight">
                              <div>
                                <div className="dashboardSmallCards">
                                  <div>
                                    <p
                                      style={{
                                        fontSize: 20,
                                        marginBottom: 10,
                                        color: "#000",
                                      }}
                                    >
                                      Profile Link
                                    </p>
                                    <div className="position-relative">
                                      <div className="input-group">
                                        <input
                                          className="form-control"
                                          value={profileLink}
                                          readOnly
                                        />
                                        <button
                                          className="btn btn-primary"
                                          onClick={handleCopy}
                                        >
                                          <FaRegCopy />
                                        </button>
                                      </div>
                                      {copied && (
                                        <span
                                          className="ms-2 text-success"
                                          style={{
                                            position: "absolute",
                                            bottom: -30,
                                            right: 0,
                                          }}
                                        >
                                          Copied!
                                        </span>
                                      )}
                                    </div>
  
                                    <div className="my-3">
                                      <p>Share via</p>
                                    </div>
  
                                    <div className="d-flex">
                                      {userProfile?.phonenumbers?.length > 0 && (
                                        <a
                                          href={`https://wa.me/?text=${whatsappShareLink}`}
                                          target="_blank"
                                          className="icon-wrapper-sm whatsapp no-filter me-3"
                                        >
                                          <img
                                            src="/assets/img/icons/whatsappIcon96.png"
                                            alt="WhatsApp"
                                          />
                                        </a>
                                      )}
                                      {userProfile.email && (
                                        <a
                                          href={`mailto:${userProfile.email}`}
                                          className="icon-wrapper-sm mail me-3"
                                        >
                                          <img
                                            src="/assets/img/icons/mailIcon.png"
                                            alt="Mail"
                                          />
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12 fitContentHeight">
                              <Link to="/registration-form">
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
                                          fontSize: 20,
                                          marginBottom: 10,
                                          color: "#000",
                                        }}
                                      >
                                        Meetings
                                      </p>
                                      <p
                                        style={{
                                          fontSize: 26,
                                          fontWeight: 500,
                                          color: "#000",
                                        }}
                                      >
                                        50
                                      </p>
                                    </div>
                                    <div
                                      style={{
                                        width: 70,
                                        height: 70,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "rgba(34, 73, 170,0.15)",
                                        borderRadius: 22,
                                      }}
                                    >
                                      <IoCalendar color="#2249aa" size={30} />
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
  
                          <div
                            className="mb-4 fitContentHeight d-flex h-100 flex-grow-1"
                            style={{ minHeight: "300px" }}
                          >
                            <div className="w-100 h-100">
                              <div
                                className="dashboardSmallCards w-100 h-100"
                                style={{
                                  overflow: "hidden",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                }}
                              >
                                <Slider {...settings}>
                                
                                  <div style={{ textAlign: "center" }}>
                                    <img
                                      src="/assets/img/slider1.png"
                                      alt="Slide 1"
                                      style={{
                                        width: "100%",
                                        maxHeight: "400px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  </div>
  
                                  <div style={{ textAlign: "center" }}>
                                    <img
                                      src="/assets/img/slider2.png"
                                      alt="Slide 2"
                                      style={{
                                        width: "100%",
                                        maxHeight: "400px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  </div>
  
                                  <div style={{ textAlign: "center" }}>
                                    <iframe  width="100%" height="300" src="https://www.youtube.com/embed/6uCYnGMpo7A?si=QfeTbCZ4U1RO0Uot" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loop></iframe>
                                  </div>
                                </Slider>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <GroupsOffcanvas />
      </>}
    </>
  );
};

export default Dashboard;
