import React, { useEffect, useState } from "react";
import Table from "../../../core/common/adminDataTable/index";
import api from "../../../core/axios/axiosInstance";
import useDebounce from "../../../core/common/customHooks/useDebounce";
import "./contacts.css";
import { useNavigate } from "react-router";

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch users from API
  const fetchUsers = async (
    page = 1,
    search = "",
    limit = pagination.limit
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search.trim()) {
        params.append("search", search.trim());
      }

      const response = await api.get(`/admin/users?${params.toString()}`);
      if (response.data.status === "success") {
        setAllUsers(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  const handlePageChange = (page) => {
    fetchUsers(page, debouncedSearchQuery);
  };

  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit }));
    fetchUsers(1, debouncedSearchQuery, newLimit);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text, record) => {
        const fullName = `${record.firstname || ""} ${
          record.lastname || ""
        }`.trim();
        return (
          <span
            style={{ cursor: "pointer", color: "#2c5cc5" }}
            onClick={() => navigate(`/admin/user-details?u=${record._id}`)}
          >
            {fullName || "N/A"}
          </span>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
      render: (email) => email || "N/A",
    },
    {
      title: "Phone",
      dataIndex: "phonenumbers",
      key: "phone",
      width: 200,
      render: (phonenumbers) => {
        if (phonenumbers && phonenumbers.length > 0) {
          const phone = phonenumbers[0];
          return `${phone.countryCode || ""} ${phone.number || ""}`.trim();
        }
        return "N/A";
      },
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
      width: 150,
      render: (plan) => {
        if (!plan?.name) {
          return "No Plan";
        }
        return plan.onFreeTrial ? `${plan.name} (Free Trial)` : plan.name;
      },
    },
    {
      title: "Plan Expiry",
      dataIndex: "planExpiresAt",
      key: "planExpiresAt",
      width: 150,
      render: (planExpiresAt) => {
        if (planExpiresAt) {
          return new Date(planExpiresAt).toLocaleDateString();
        }
        return "N/A";
      },
    },
  ];

  return (
    <div className="page-wrapper">
      <div>
        <div className="row p-md-4 p-0 h-100 pt_0">
          <div className="col-md-12">
            <div className="card h-100 mb-0">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="col-sm-12">
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                      <div className="page-header mb-md-0">
                        <div className="row align-items-center">
                          <h4 className="page-title mb-0">
                            Users
                            <span className="count-title">
                              {pagination.totalUsers}
                            </span>
                          </h4>
                        </div>
                      </div>

                      <div className="d-flex flex-wrap gap-3">
                        <div className="icon-form mb-md-0">
                          <span className="form-icon">
                            <i className="ti ti-search" />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search Users by Name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body pb-0 justify-content-center">
                <div className="table-responsive custom-table">
                  <Table
                    dataSource={allUsers}
                    columns={columns}
                    rowKey={(record) => record._id || record.id}
                    isLoading={loading}
                    totalCount={pagination.totalUsers}
                    scrollX={false}
                  />
                </div>

                <div className="row align-items-center mt-3">
                  <div className="col-md-6">
                    <div className="datatable-length">
                      <label className="d-flex align-items-center">
                        Show{" "}
                        <select
                          className="form-select mx-2"
                          style={{ width: "auto" }}
                          value={pagination.limit}
                          onChange={(e) =>
                            handleLimitChange(parseInt(e.target.value))
                          }
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>{" "}
                        entries
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="datatable-paginate d-flex justify-content-end">
                      <nav>
                        <ul className="pagination">
                          <li
                            className={`page-item ${
                              !pagination.hasPrevPage ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() =>
                                handlePageChange(pagination.currentPage - 1)
                              }
                              disabled={!pagination.hasPrevPage}
                            >
                              Previous
                            </button>
                          </li>

                          {/* Page numbers */}
                          {Array.from(
                            { length: Math.min(5, pagination.totalPages) },
                            (_, i) => {
                              let pageNum;
                              if (pagination.totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (pagination.currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (
                                pagination.currentPage >=
                                pagination.totalPages - 2
                              ) {
                                pageNum = pagination.totalPages - 4 + i;
                              } else {
                                pageNum = pagination.currentPage - 2 + i;
                              }

                              return (
                                <li
                                  key={pageNum}
                                  className={`page-item ${
                                    pagination.currentPage === pageNum
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  <button
                                    className="page-link"
                                    onClick={() => handlePageChange(pageNum)}
                                  >
                                    {pageNum}
                                  </button>
                                </li>
                              );
                            }
                          )}

                          <li
                            className={`page-item ${
                              !pagination.hasNextPage ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() =>
                                handlePageChange(pagination.currentPage + 1)
                              }
                              disabled={!pagination.hasNextPage}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>

                {/* Pagination info */}
                <div className="row">
                  <div className="col-md-12">
                    <div className="text-muted small text-center mt-2">
                      Showing{" "}
                      {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
                      {Math.min(
                        pagination.currentPage * pagination.limit,
                        pagination.totalUsers
                      )}{" "}
                      of {pagination.totalUsers} entries
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
