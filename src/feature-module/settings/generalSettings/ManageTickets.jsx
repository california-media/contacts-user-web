import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../../../core/axios/axiosInstance";
import { all_routes } from "../../router/all_routes";
import {
  Table,
  Tag,
  Button,
  Modal as AntdModal,
  Input,
  Select,
  Space,
  Tooltip,
  Popconfirm,
} from "antd";
import { showToast } from "../../../core/data/redux/slices/ToastSlice";
import LoadingIndicator2 from "../../../core/common/loadingIndicator/LoadingIndicator2";
import {
  EditOutlined,
  DeleteOutlined,
  MailOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined,
  UnorderedListOutlined,
  MessageOutlined,
} from "@ant-design/icons";

const ManageTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchTickets(pagination.current, pagination.pageSize, filterStatus);
    // eslint-disable-next-line
  }, [pagination.current, pagination.pageSize, filterStatus]);

  const fetchTickets = async (page = 1, limit = 10, status = "all") => {
    setLoading(true);
    try {
      let params = { page, limit };
      if (status === "open") params.adminReply = "null";
      if (status === "closed") params.adminReply = "notnull";
      const response = await api.get("/admin/help-support", { params });
      if (response.data.status === "success") {
        setTickets(response.data.data.tickets);
        setPagination({
          current: response.data.data.pagination.currentPage,
          pageSize: response.data.data.pagination.limit,
          total: response.data.data.pagination.totalTickets,
        });
      }
    } catch (error) {
      dispatch(
        showToast({
          heading: "Error",
          message: "Failed to fetch tickets",
          variant: "danger",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination({ ...pagination, total: pagination.total });
  };

  const handleFilterChange = (value) => {
    setFilterStatus(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const openReplyModal = async (ticket) => {
    setSelectedTicket(ticket);
    setReplyText("");
    setReplyModalVisible(true);

    // Fetch latest ticket data with messages
    try {
      const response = await api.get(`/admin/help-support/${ticket._id}`);
      if (response.data.status === "success") {
        setSelectedTicket(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    }
  };

  const closeReplyModal = () => {
    setReplyModalVisible(false);
    setSelectedTicket(null);
    setReplyText("");
  };

  const handleReplySubmit = async () => {
    if (!selectedTicket || !replyText.trim()) return;
    setReplyLoading(true);
    try {
      const response = await api.post(
        `/admin/help-support/${selectedTicket._id}/reply`,
        {
          message: replyText,
        }
      );
      if (response.data.status === "success") {
        dispatch(
          showToast({
            heading: "Success",
            message: "Message sent successfully",
            variant: "success",
          })
        );
        setReplyText("");
        // Refresh ticket data to show new message
        const updatedResponse = await api.get(
          `/admin/help-support/${selectedTicket._id}`
        );
        if (updatedResponse.data.status === "success") {
          setSelectedTicket(updatedResponse.data.data);
        }
        fetchTickets(pagination.current, pagination.pageSize, filterStatus);
      }
    } catch (error) {
      dispatch(
        showToast({
          heading: "Error",
          message: error?.response?.data?.message || "Failed to send reply",
          variant: "danger",
        })
      );
    } finally {
      setReplyLoading(false);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    setDeleteLoadingId(ticketId);
    try {
      const response = await api.delete(`/admin/help-support/${ticketId}`);
      if (response.data.status === "success") {
        dispatch(
          showToast({
            heading: "Success",
            message: "Ticket deleted successfully",
            variant: "success",
          })
        );
        fetchTickets(pagination.current, pagination.pageSize, filterStatus);
      }
    } catch (error) {
      dispatch(
        showToast({
          heading: "Error",
          message: error?.response?.data?.message || "Failed to delete ticket",
          variant: "danger",
        })
      );
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const columns = [
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        // Check who sent the last message
        let lastMessageSender = null;
        if (record.messages && record.messages.length > 0) {
          const lastMessage = record.messages[record.messages.length - 1];
          lastMessageSender = lastMessage.sender;
        } else if (record.adminReply) {
          lastMessageSender = "admin";
        } else {
          lastMessageSender = "customer"; // Initial message
        }

        return lastMessageSender === "admin" ? (
          <Tag color="green">
            <CheckCircleOutlined /> Replied
          </Tag>
        ) : (
          <Tag color="orange">
            <CloseCircleOutlined /> Pending
          </Tag>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span>
          {text ||
            (record.userId &&
              `${record.userId.firstname} ${record.userId.lastname}`)}
        </span>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Type",
      dataIndex: "inquiryType",
      key: "inquiryType",
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View/Reply">
            <Button
              type="primary"
               icon={<MessageOutlined />}
              size="small"
              onClick={() => openReplyModal(record)}
            >
              Chat
            </Button>
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete this ticket?"
            onConfirm={() => handleDeleteTicket(record._id)}
            okText="Yes"
            cancelText="No"
            disabled={deleteLoadingId === record._id}
          >
            <Button
              type="primary"
              danger={true}
              icon={<DeleteOutlined />}
              size="small"
              loading={deleteLoadingId === record._id}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row">
                <div className="col-sm-6">
                  <h3 className="page-title">Manage Tickets</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to={all_routes.dashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">Tickets</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-semibold mb-0">All Tickets</h5>
                  <Select
                    value={filterStatus}
                    style={{ width: 180 }}
                    onChange={handleFilterChange}
                    placeholder="Filter by status"
                    suffixIcon={<FilterOutlined />}
                  >
                    <Select.Option value="all">
                      <Space>
                        <UnorderedListOutlined />
                        All
                      </Space>
                    </Select.Option>
                    <Select.Option value="open">
                      <Space>
                        <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
                        Open Only
                      </Space>
                    </Select.Option>
                    <Select.Option value="closed">
                      <Space>
                        <CheckCircleOutlined style={{ color: "#52c41a" }} />
                        Closed Only
                      </Space>
                    </Select.Option>
                  </Select>
                </div>
                <Table
                  columns={columns}
                  dataSource={tickets}
                  rowKey="_id"
                  loading={loading}
                  pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                  }}
                  onChange={handleTableChange}
                  bordered
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AntdModal
        title={
          selectedTicket
            ? `Support Chat: ${selectedTicket.subject}`
            : "Support Chat"
        }
        open={replyModalVisible}
        onCancel={closeReplyModal}
        footer={null}
        width={700}
        destroyOnClose
      >
        {selectedTicket && (
          <div>
            <div className="mb-3">
              <div className="row">
                <div className="col-md-6">
                  <strong>From:</strong>{" "}
                  {selectedTicket.name ||
                    (selectedTicket.userId &&
                      `${selectedTicket.userId.firstname} ${selectedTicket.userId.lastname}`)}
                </div>
                <div className="col-md-6">
                  <strong>Type:</strong>{" "}
                  <Tag color="blue">{selectedTicket.inquiryType}</Tag>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div
              style={{
                height: "400px",
                overflowY: "auto",
                border: "1px solid #f0f0f0",
                padding: "15px",
                marginBottom: "15px",
                backgroundColor: "#fafafa",
              }}
            >
              {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                selectedTicket.messages.map((message, index) => (
                  <div
                    key={message._id || index}
                    style={{
                      display: "flex",
                      justifyContent:
                        message.sender === "customer"
                          ? "flex-start"
                          : "flex-end",
                      marginBottom: "15px",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "70%",
                        padding: "10px 15px",
                        borderRadius: "15px",
                        backgroundColor:
                          message.sender === "customer" ? "#e3f2fd" : "#f3e5f5",
                        border: `1px solid ${
                          message.sender === "customer" ? "#bbdefb" : "#e1bee7"
                        }`,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "12px",
                          marginBottom: "5px",
                        }}
                      >
                        {message.sender === "customer"
                          ? selectedTicket.name ||
                            (selectedTicket.userId &&
                              `${selectedTicket.userId.firstname} ${selectedTicket.userId.lastname}`) ||
                            "Customer"
                          : "Support Team"}
                      </div>
                      <div>{message.content}</div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#666",
                          marginTop: "5px",
                        }}
                      >
                        {new Date(message.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Fallback for old tickets without messages array
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginBottom: "15px",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "10px 15px",
                      borderRadius: "15px",
                      backgroundColor: "#e3f2fd",
                      border: "1px solid #bbdefb",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "12px",
                        marginBottom: "5px",
                      }}
                    >
                      {selectedTicket.name ||
                        (selectedTicket.userId &&
                          `${selectedTicket.userId.firstname} ${selectedTicket.userId.lastname}`) ||
                        "Customer"}
                    </div>
                    <div>{selectedTicket.message}</div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#666",
                        marginTop: "5px",
                      }}
                    >
                      {new Date(selectedTicket.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Legacy admin reply */}
              {selectedTicket.adminReply && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "15px",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "10px 15px",
                      borderRadius: "15px",
                      backgroundColor: "#f3e5f5",
                      border: "1px solid #e1bee7",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "12px",
                        marginBottom: "5px",
                      }}
                    >
                      Support Team (Legacy)
                    </div>
                    <div>{selectedTicket.adminReply}</div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#666",
                        marginTop: "5px",
                      }}
                    >
                      {new Date(selectedTicket.lastRepliedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div style={{ display: "flex", gap: "10px" }}>
              <Input.TextArea
                rows={3}
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onPressEnter={(e) => {
                  if (e.ctrlKey) {
                    handleReplySubmit();
                  }
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <Button
                  type="primary"
                  loading={replyLoading}
                  onClick={handleReplySubmit}
                  style={{ height: "fit-content" }}
                >
                  Send
                </Button>
                <Button
                  onClick={closeReplyModal}
                  style={{ height: "fit-content" }}
                >
                  Close
                </Button>
              </div>
            </div>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
              Press Ctrl+Enter to send
            </div>
          </div>
        )}
      </AntdModal>
    </div>
  );
};

export default ManageTickets;
