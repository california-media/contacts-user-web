import React, { useEffect, useState } from "react";
import "./referAndEarn.css";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import CopyableInput from "../../../core/common/CopyableInput";
import dayjs from "dayjs";
import api from "../../../core/axios/axiosInstance";
import { fetchReferralData } from "../../../core/data/redux/slices/ReferralSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import EmailTemplateModal from "../../../core/common/modals/EmailTemplateModal";

const ReferAndEarn = () => {
  const dispatch = useDispatch();
  const referralData = useSelector((state) => state.referral.data);
  const referralLoading = useSelector((state) => state.referral.loading);
  const referralError = useSelector((state) => state.referral.error);
  const referralLink = referralData.referralUrl;

  console.log("Referral Data:", referralData);

  useEffect(() => {
    dispatch(fetchReferralData());
  }, [dispatch]);

  if (referralLoading) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-2">Loading referral data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (referralError) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error!</h4>
            <p>Failed to load referral data: {referralError}</p>
            <button
              className="btn btn-outline-danger"
              onClick={() => dispatch(fetchReferralData())}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="dashboardSmallCards">
          <h2 className="text-xl font-semibold mb-2">
            Refer a Friend and Get $10 Credit
          </h2>
          <p className="text-gray-600 mb-4">
            Earn a $10 credit when your friend becomes a member. They'll also
            receive a $10 discount on their initial membership fee.{" "}
            <a href="#" className="text-indigo-600 underline">
              Learn more
            </a>
          </p>

          <div className="d-flex align-items-center">
            <CopyableInput value={referralLink} />

            <div
              title="Share"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 35,
                height: 35,
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                marginLeft: 10,
                cursor: "pointer",
                padding: "5px 8px",
              }}
            >
              <ImageWithBasePath
                src="assets/img/icons/shareIcon.png"
                width={18}
              />
            </div>
            <Link
              title="Email"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#show_email_templates"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 35,
                height: 35,
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                marginLeft: 10,
                cursor: "pointer",
                padding: "5px 8px",
              }}
              // onClick={() => {
              //   window.location.href =
              //     "mailto:?subject=Join%20me%20on%20contacts.management&body=Here%20is%20my%20referral%20link:%20" +
              //     referralLink;
              // }}
            >
              <ImageWithBasePath
                src="assets/img/icons/emailIcon.png"
                width={18}
              />
            </Link>
          </div>
        </div>

        <div className="dashboardSmallCards mt-5 mb-5">
          <h3 className="text-lg font-semibold mb-4">
            Total credit earned: $
            {(
              referralData.creditBalance ||
              referralData.totalEarned ||
              0
            ).toFixed(2)}
          </h3>
          <div className="mb-2 text-sm text-gray-600">
            {referralData.verifiedReferralCount || 0} verified referrals out of{" "}
            {referralData.referralCount || 0} total referrals
          </div>
          <div className="w-100 overflow-x-auto border-b mb-4">
            <table className="w-100">
              <thead style={{ borderBottom: "1px solid #e2e8f0" }}>
                <tr className="text-gray-500 text-sm border-b">
                  <th className="pb-3">Referred friend</th>
                  <th className="pb-3">Verification Status</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {referralData.referrals?.length > 0 ? (
                  referralData.referrals.map((referral, index) => (
                    <tr key={index}>
                      <td className="py-3">
                        {referral.firstname} {referral.lastname} (
                        {referral.email
                          ? referral.email
                          : referral.phonenumbers &&
                            referral.phonenumbers.length > 0
                          ? `+${referral.phonenumbers[0].countryCode} ${referral.phonenumbers[0].number}`
                          : "N/A"}
                        )
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            referral.isVerified ||
                            referral.verificationStatus === "Verified"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {referral.verificationStatus ||
                            (referral.isVerified ? "Verified" : "Not Verified")}
                        </span>
                      </td>
                      <td className="py-3">
                        {referral.isVerified ? "Completed" : "Pending"}
                      </td>
                      <td className="py-3">
                        {dayjs(referral.signupDate).format(
                          "MMMM D, YYYY h:mm A"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-gray-600">
                      <div className="flex flex-col items-center">
                        <img
                          src="assets/img/icons/noReferral.svg"
                          alt="No Referrals"
                          className="h-16 mb-2 opacity-50"
                          style={{
                            width: "150px",
                            height: "150px",
                            marginTop: "30px",
                          }}
                        />
                        <p className="fw-bold">No Referrals Yet!</p>
                        <p className="text-gray-500 text-sm mt-1 mb-3 max-w-md">
                          It looks like you haven't referred anyone yet. Get
                          started now to earn $10 credits! <br />
                          Just share your unique link with friends who would
                          love Mindvalley.
                        </p>
                        <div className="w-full max-w-md">
                          <CopyableInput value={referralLink} />
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-gray-500 text-xs mt-4">
          As the referrer, you will receive a $10 credit to your account for
          each new member you have referred who becomes an annual paying member
          and has verified their account. The referee must stay a paying member
          past the 15-day refund period and complete email verification. This
          credit will be automatically applied in the next billing cycle. You
          can view the{" "}
          <a href="#" className="text-indigo-600 underline">
            Terms & Conditions here
          </a>
          .
        </p>
      </div>
      <EmailTemplateModal />
    </div>
  );
};
export default ReferAndEarn;
