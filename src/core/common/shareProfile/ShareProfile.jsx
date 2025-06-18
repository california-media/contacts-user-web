import React, { useEffect, useRef, useState } from "react";
import ImageWithBasePath from "../imageWithBasePath";
import { FaPhoneAlt, FaRegEye } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { QRCode } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";

const ShareProfile = () => {
  const qrCodeRef = useRef();
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [userProfile,setUserProfile] = useState({});
//   const userProfile = useSelector((state) => state.profile);

  const { serialNumber } = useParams();
  console.log("Serial number: ", serialNumber);
  
  useEffect(() => {
    const getQrCodeValue = JSON.stringify({
      firstname: userProfile.firstname,
      lastname: userProfile.lastname,
      email: userProfile.email,
      phone:
        userProfile.phonenumbers?.length > 0 ? userProfile?.phonenumbers[0] : "",
    });
    setQrCodeValue(getQrCodeValue);
  }, [userProfile]);
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `https://100rjobf76.execute-api.eu-north-1.amazonaws.com/shareProfile/${serialNumber}`
      );
      setUserProfile(response.data);
      console.log(response.data, "response from share");
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  fetchProfile();
}, [serialNumber]);
  return (
    <div className="container" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="row w-100 justify-content-center">
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
        <div style={{ padding: 20, color: "#fff", paddingBottom: 120 }}>
          <p className="text-center fs-4 text-capitalize">
            {userProfile.firstname} {userProfile.lastname}{" "}
          </p>
          <div className="profileCardTextContainer">
            <FaPhoneAlt />
            <p className="profileCardText">
              {userProfile?.phonenumbers?.length > 0
                ? userProfile?.phonenumbers[0]
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
        <div className="profileCardTextContainer" style={{ paddingLeft: 20 }}>
          <FaRegEye />
          <p className="profileCardText">456</p>
        </div>
        {/* <div className="profileCardShareButton"> */}
        {/* <TbLocation
                        color="#fff"
                        size={22}
                        className="profileCardShareIcon"
                      /> */}
        {/* <Link style={{width:50, marginRight:20}} to={`${route.shareProfile}`} target="_blank">
                        <ImageWithBasePath 
                        src="assets/img/icons/shareIcon.png"
                          className="img-fluid"
                          alt="Logo"
                          
                        />
                      </Link> */}
        {/* </div> */}
      </div>
    </div>
            </div>
        </div>
    </div>
  );
};

export default ShareProfile;
