import { useEffect, useRef, useState } from "react";

import GroupsOffcanvas from "../../../core/common/offCanvas/groups/GroupsOffcanvas";
import { all_routes } from "../../router/all_routes";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import LoadingIndicator from "../../../core/common/loadingIndicator/LoadingIndicator";
import LoadingIndicator2 from "../../../core/common/loadingIndicator/LoadingIndicator2";

import api from "../../../core/axios/axiosInstance";

const AdminDashboard = () => {
  const userProfile = useSelector((state) => state.profile);
  const { tags, error } = useSelector((state) => state.tags);
  const [isLoading, setIsLoading] = useState(false);
  const [totalUserCount, setTotalUserCount] = useState(0);

  // fetch total users count (excluding superadmin)
  useEffect(() => {
    let mounted = true;
    const fetchCount = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/admin/users/count");
        if (mounted && res && res.data && res.data.data) {
          setTotalUserCount(res.data.data.totalUsers || 0);
        }
      } catch (err) {
        console.error("Failed to fetch users count", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchCount();

    return () => {
      mounted = false;
    };
  }, []);

  const route = all_routes;

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center vh-100 w-100">
          {" "}
          <LoadingIndicator2 />
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
                  <div className="col-md-12 fitContentHeight">
                    <div className="row mb-4">
                      <div className="col-md-3 mb-md-4 mb-2 fitContentHeight">
                        <Link to={route.users}>
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
                                  Total Users
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
                                    totalUserCount
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
                      {/* <div className="col-md-3 mb-md-4 mb-2 fitContentHeight">
                        <Link to={route.users}>
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
                                  Acive Users
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
                                    formatActiveUserCount()
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
                      </div> */}
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

                      {/* <div className="col-md-3 mb-md-4 mb-2 fitContentHeight">
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
                      </div> */}
                    </div>
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

export default AdminDashboard;
