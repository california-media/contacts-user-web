import React, { useState } from "react";
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

const Dashboard = () => {
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
  return (
    <>
      <div className="page-wrapper" style={{ backgroundColor: "#fff" }}>
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <div className="dashboardProfileContainer">
                  <ImageWithBasePath
                    src="assets/img/profileBanner.jpeg"
                    alt="Profile Banner"
                    className="profileCoverImg"
                  />
                  <div style={{ background: "#000", position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <ImageWithBasePath
                        src="assets/img/profileImage.jpeg"
                        alt="Profile Banner"
                        className="profileCardImg"
                      />
                    </div>
                    <div
                      style={{ padding: 20, color: "#fff", paddingBottom: 120 }}
                    >
                      <p className="text-center fs-4">Waqar Ahmad Ansari</p>
                      <div className="profileCardTextContainer">
                        <FaPhoneAlt />
                        <p className="profileCardText">1234567890</p>
                      </div>
                      <div className="profileCardTextContainer">
                        <IoMdMail />
                        <p className="profileCardText">example@test.com</p>
                      </div>

                      <div className="profileCardQrCodeContainer">
                        <ImageWithBasePath
                          src="assets/img/myQr.png"
                          alt="Profile Banner"
                          className="profileCardQrCode"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="profileCardLowerIcons">
                    <div
                      className="profileCardTextContainer"
                      style={{ paddingLeft: 20 }}
                    >
                      <FaRegEye />
                      <p className="profileCardText">456</p>
                    </div>
                    <div className="profileCardShareButton">
                      <TbLocation
                        color="#fff"
                        size={22}
                        className="profileCardShareIcon"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-8 fitContentHeight">
                <div className="row">
                  <div className="col-md-4 fitContentHeight">
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
                              3
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
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-4 fitContentHeight">
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
                              5
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
                  <div className="col-md-4 fitContentHeight">
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
                              Scanned Cards
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
                <div className="row mt-5">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">Contacts</h5>
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
          </div>
        </div>
      </div>
      <GroupsOffcanvas />
    </>
  );
};

export default Dashboard;
