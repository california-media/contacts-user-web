import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../../../core/axios/axiosInstance";
import { all_routes } from "../../router/all_routes";
import {
  Table,
  Tag,
  Button,
  Modal as AntdModal,
  Input,
  Space,
  Tooltip,
  Popconfirm,
} from "antd";
import {
  MessageOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { showToast } from "../../../core/data/redux/slices/ToastSlice";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchTickets(pagination.current, pagination.pageSize);
    // eslint-disable-next-line
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    // Check if we need to open a specific ticket from URL parameter
    const ticketId = searchParams.get("ticketId");
    if (ticketId && tickets.length > 0) {
      const ticket = tickets.find((t) => t._id === ticketId);
      if (ticket) {
        openChatModal(ticket);
      }
    }
  }, [searchParams, tickets]);

  const fetchTickets = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const params = { page, limit };
      const response = await api.get("/help-support/get", { params });
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

  const openChatModal = async (ticket) => {
    setSelectedTicket(ticket);
    setNewMessage("");
    setChatModalVisible(true);

    // Fetch latest ticket data with messages
    try {
      const response = await api.get(`/help-support/${ticket._id}`);
      if (response.data.status === "success") {
        setSelectedTicket(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    }
  };

  const closeChatModal = () => {
    setChatModalVisible(false);
    setSelectedTicket(null);
    setNewMessage("");
  };

  const handleSendMessage = async () => {
    if (!selectedTicket || !newMessage.trim()) return;
    setSendingMessage(true);

    try {
      const response = await api.post(
        `/help-support/${selectedTicket._id}/reply`,
        {
          message: newMessage,
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

        // Add the new message to the current ticket's messages
        const newMsg = {
          _id: response.data.data.messageId,
          sender: "customer",
          content: newMessage,
          timestamp: response.data.data.timestamp,
          senderInfo: { firstname: "You" }, // Placeholder for current user
        };

        setSelectedTicket((prev) => ({
          ...prev,
          messages: [...prev.messages, newMsg],
        }));

        setNewMessage("");
        fetchTickets(pagination.current, pagination.pageSize);
      }
    } catch (error) {
      dispatch(
        showToast({
          heading: "Error",
          message: error?.response?.data?.message || "Failed to send message",
          variant: "danger",
        })
      );
    } finally {
      setSendingMessage(false);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    setDeleteLoadingId(ticketId);
    try {
      const response = await api.delete(`/help-support/${ticketId}`);
      if (response.data.status === "success") {
        dispatch(
          showToast({
            heading: "Success",
            message: "Ticket deleted successfully",
            variant: "success",
          })
        );
        fetchTickets(pagination.current, pagination.pageSize);
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

  const hasAdminReply = (ticket) => {
    // Check who sent the last message
    let lastMessageSender = null;
    if (ticket.messages && ticket.messages.length > 0) {
      const lastMessage = ticket.messages[ticket.messages.length - 1];
      lastMessageSender = lastMessage.sender;
    } else if (ticket.adminReply) {
      lastMessageSender = "admin";
    } else {
      lastMessageSender = "customer"; // Initial message
    }

    return lastMessageSender === "admin";
  };

  const getLastMessage = (ticket) => {
    if (ticket.messages && ticket.messages.length > 0) {
      const lastMsg = ticket.messages[ticket.messages.length - 1];
      return lastMsg.content.length > 50
        ? lastMsg.content.substring(0, 50) + "..."
        : lastMsg.content;
    }
    return ticket.message?.length > 50
      ? ticket.message.substring(0, 50) + "..."
      : ticket.message;
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        const replied = hasAdminReply(record);
        return replied ? (
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
      title: "Last Message",
      key: "lastMessage",
      render: (_, record) => <span>{getLastMessage(record)}</span>,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Conversation">
            <Button
              type="primary"
              icon={<MessageOutlined />}
              size="small"
              onClick={() => openChatModal(record)}
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
                  <h3 className="page-title">My Support Tickets</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to={all_routes.dashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">My Tickets</li>
                  </ul>
                </div>
                {/* <div className="col-sm-6">
                  <div className="page-btn">
                    <Link
                      to={all_routes.HelpAndSupport}
                      className="btn btn-primary"
                    >
                      Create New Ticket
                    </Link>
                  </div>
                </div> */}
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-semibold mb-0">All My Tickets</h5>
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

      {/* Chat Modal */}
      <AntdModal
        title={`Support Ticket: ${selectedTicket?.subject || "Chat"}`}
        open={chatModalVisible}
        onCancel={closeChatModal}
        footer={null}
        width={700}
        destroyOnClose
      >
        {selectedTicket && (
          <div>
            <div className="mb-3">
              <strong>Type:</strong>{" "}
              <Tag color="blue">{selectedTicket.inquiryType}</Tag>
              <strong className="ms-3">Created:</strong>{" "}
              {new Date(selectedTicket.createdAt).toLocaleDateString()}
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
                        {message.sender === "customer" ? "You" : "Support Team"}
                      </div>
                      <div>{message.content}</div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#666",
                          marginTop: "5px",
                        }}
                      >
                        {formatMessageTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
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
                      You
                    </div>
                    <div>{selectedTicket.message}</div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#666",
                        marginTop: "5px",
                      }}
                    >
                      {formatMessageTime(selectedTicket.createdAt)}
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
                      Support Team
                    </div>
                    <div>{selectedTicket.adminReply}</div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#666",
                        marginTop: "5px",
                      }}
                    >
                      {formatMessageTime(selectedTicket.lastRepliedAt)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div style={{ display: "flex", gap: "10px" }}>
              <Input.TextArea
                rows={3}
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onPressEnter={(e) => {
                  if (e.ctrlKey) {
                    handleSendMessage();
                  }
                }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={sendingMessage}
                onClick={handleSendMessage}
                style={{ height: "fit-content" }}
              >
                Send
              </Button>
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

export default MyTickets;
