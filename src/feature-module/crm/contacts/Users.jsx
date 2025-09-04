import React, { useEffect, useState } from "react";
import Table from "../../../core/common/adminDataTable/index";
import api from "../../../core/axios/axiosInstance";
import useDebounce from "../../../core/common/customHooks/useDebounce";
import "./contacts.css";
import { useNavigate } from "react-router";

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
  
  const debouncedSearchQuery = useDebounce(searchQuery);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/users");
      if (response.data.status === "success") {
        setAllUsers(response.data.data);
        setTotalUsers(response.data.count);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = allUsers.filter((user) => {
    if (!debouncedSearchQuery) return true;

    const fullName = `${user.firstname || ""} ${user.lastname || ""}`
      .trim()
      .toLowerCase();
    return fullName.includes(debouncedSearchQuery.toLowerCase());
  });

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
      render: (plan) => plan || "N/A",
    },
    {
      title: "Plan Expiry",
      dataIndex: "planExpiry",
      key: "planExpiry",
      width: 150,
      render: (planExpiry) => {
        if (planExpiry) {
          return new Date(planExpiry).toLocaleDateString();
        }
        return "N/A";
      },
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content mb-0">
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
                              {filteredUsers.length}
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
                    dataSource={filteredUsers}
                    columns={columns}
                    rowKey={(record) => record._id || record.id}
                    isLoading={loading}
                    totalCount={filteredUsers.length}
                    scrollX={false}
                  />
                </div>

                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="datatable-length" />
                  </div>
                  <div className="col-md-6">
                    <div className="datatable-paginate" />
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
