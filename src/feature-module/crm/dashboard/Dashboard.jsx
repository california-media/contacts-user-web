import React, { useEffect, useRef, useState } from "react";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Image } from "react-bootstrap";
import { FaPhoneAlt, FaRegEye, FaTag } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { TbLocation } from "react-icons/tb";
import { MdPeople } from "react-icons/md";
import ReactApexChart from "react-apexcharts";
import { IoQrCode } from "react-icons/io5";
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

const Dashboard = () => {
  const [file, setFile] = useState();
  const [progress, setProgress] = useState(0);
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [language, setLanguage] = useState("eng");
  const [result, setResult] = useState("");
  const dispatch = useDispatch();
  const qrCodeRef = useRef();
  const userProfile = useSelector((state) => state.profile);
  const { tags, loading, error } = useSelector((state) => state.tags);
console.log("userProfile in dashboardss", userProfile);

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
  useEffect(() => {
    // const fetchProfile = async () => {
    //  try {
    //   const response = await api.get("/getUser");
    //   localStorage.setItem("userId",response.data.data.id)
    //   dispatch(setGetUser(response.data.data))
    //  } catch (error) {
    //   console.log(error.response.data,"errorrr");
    //  }
    // };
    // fetchProfile();

    dispatch(fetchProfile());
  }, []);

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

  return (
    <>
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
                    src="assets/img/profileBanner.jpeg"
                    alt="Profile Banner"
                    className="profileCoverImg"
                  />
                  <div style={{ background: "#000", position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "center"}}>
                      <img
                        src={userProfile.profileImageURL}
                        alt="Profile Banner"
                        className="profileCardImg"
                        style={{ border:"1px solid white" }}
                      />
                    </div>
                    <div
                      style={{ padding: 20, color: "#fff", paddingBottom: 120 }}
                    >
                      <p className="text-center fs-4 text-capitalize">
                        {userProfile.firstname} {userProfile.lastname}{" "}
                      </p>
                      <div className="profileCardTextContainer">
                        <FaPhoneAlt />
                        <p className="profileCardText">
                          {userProfile.phonenumbers.length > 0
                            ? userProfile.phonenumbers[0]
                            : "No phone Number"}
                        </p>
                      </div>
                      <div className="profileCardTextContainer">
                        <IoMdMail />
                        <p className="profileCardText">{userProfile.email}</p>
                      </div>

                      <div className="profileCardQrCodeContainer">
                        {/* <ImageWithBasePath
                          src="assets/img/myQr.png"
                          alt="Profile Banner"
                          className="profileCardQrCode"
                        /> */}
                        <div ref={qrCodeRef}>
                          <QRCode
                            value={qrCodeValue}
                            size={150}
                            className="profileCardQrCode"
                            bgColor="#ffffff"
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
                      <p className="profileCardText">{userProfile.whoScannedMeCount}</p>
                    </div>
                    {/* <div className="profileCardShareButton"> */}
                      {/* <TbLocation
                        color="#fff"
                        size={22}
                        className="profileCardShareIcon"
                      /> */}
                      <Link style={{width:30, marginRight:20}} to={`${route.shareProfile}/${userProfile.firstname}${userProfile.serialNumber}`} target="_blank">
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
                              {userProfile.isLoading?<LoadingIndicator/>:userProfile.contactCount}
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
                            <MdPeople color="#8280ff" size={35} />
                          </div>
                        </div>
                          <div className="d-flex align-items-center mt-2">
                            <img src="/assets/img/icons/trendingIcon.svg" className="me-2"/>
                            <p style={{color:"#39b49b",marginBottom:0}}>No change from last month
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
                              {userProfile.isLoading?<LoadingIndicator/>:tags.length}
                            </p>
                          </div>
                          <div
                            style={{
                              width: 50,
                              height: 50,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "#fef2d6",
                              borderRadius: 18,
                            }}
                          >
                            <FaTag color="#fec53d" size={25} />
                          </div>
                        </div>
                        <div className="d-flex align-items-center mt-2">
                            <img src="/assets/img/icons/trendingIcon.svg" className="me-2"/>
                            <p style={{color:"#39b49b",marginBottom:0}}>No change from last month
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
                             {userProfile.isLoading?<LoadingIndicator/>:userProfile.totalScans} 
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
                              borderRadius: 22,
                            }}
                          >
                            <IoQrCode color="#4ad991" size={30} />
                          </div>
                        </div>
                        <div className="d-flex align-items-center mt-2">
                            <img src="/assets/img/icons/trendingIcon.svg" className="me-2"/>
                            <p style={{color:"#39b49b",marginBottom:0}}>No change from last month
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
                              Templates
                            </p>
                            <p
                              style={{
                                fontSize: 26,
                                fontWeight: 500,
                                color: "#000",
                              }}
                            >
                              {userProfile.isLoading?<LoadingIndicator/>:userProfile.totalTemplates}
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
                              borderRadius: 22,
                            }}
                          >
                            <IoQrCode color="#4ad991" size={30} />
                          </div>
                        </div>
                        <div className="d-flex align-items-center mt-2">
                            <img src="/assets/img/icons/trendingIcon.svg" className="me-2"/>
                            <p style={{color:"#39b49b",marginBottom:0}}>No change from last month
                              </p>
                              </div>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="row mt-5">
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-6 fitContentHeight">
                        <Link
                          // className="dropdown-item p-0 bgWhiteOnLinkHover"
                          // data-bs-toggle="offcanvas"
                          // data-bs-target="#groups_offcanvas"
                          to={route.registrationForm}
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
                                  {tags.length}
                                </p>
                              </div>
                              <div
                                style={{
                                  width: 50,
                                  height: 50,
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  backgroundColor: "#fef2d6",
                                  borderRadius: 18,
                                }}
                              >
                                <FaTag color="#fec53d" size={25} />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="col-md-6 fitContentHeight">
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
                                  backgroundColor: "#d9f7e7",
                                  borderRadius: 22,
                                }}
                              >
                                <IoQrCode color="#4ad991" size={30} />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-6 fitContentHeight">
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
                                  {tags.length}
                                </p>
                              </div>
                              <div
                                style={{
                                  width: 50,
                                  height: 50,
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  backgroundColor: "#fef2d6",
                                  borderRadius: 18,
                                }}
                              >
                                <FaTag color="#fec53d" size={25} />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="col-md-6 fitContentHeight">
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
                                  backgroundColor: "#d9f7e7",
                                  borderRadius: 22,
                                }}
                              >
                                <IoQrCode color="#4ad991" size={30} />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">Recently Visited</h5>
                      </div>
                      <div className="card-body">
                        <div id="s-line-area" />
                        <ReactApexChart
                          options={sline}
                          series={sline.series}
                          type="area"
                          height={350}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div
                style={{
                  position: "fixed",
                  width: "100%",
                  height: "100%",
                  zIndex: 1,
                }}
              >
                <div style={{ width: "100%", height: 400 }}>
                  <Camera ref={camera} />
                </div>
                <button onClick={() => setImage(camera.current.takePhoto())}>
                  Take photo
                </button>
                <img src={image} alt="Taken photo" />
              </div> */}
          </div>
        </div>
      </div>
      <GroupsOffcanvas />
    </>
  );
};

export default Dashboard;
