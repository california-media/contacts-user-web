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

  const openReplyModal = (ticket) => {
    setSelectedTicket(ticket);
    setReplyText("");
    setReplyModalVisible(true);
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
          adminReply: replyText,
        }
      );
      if (response.data.status === "success") {
        dispatch(
          showToast({
            heading: "Success",
            message: "Reply sent successfully",
            variant: "success",
          })
        );
        closeReplyModal();
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
      dataIndex: "adminReply",
      key: "status",
      render: (adminReply) =>
        adminReply ? (
          <Tag color="red">
            <CloseCircleOutlined /> Closed
          </Tag>
        ) : (
          <Tag color="green">
            <CheckCircleOutlined /> Open
          </Tag>
        ),
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
          {!record.adminReply && (
            <Tooltip title="Reply">
              <Button
                type="primary"
                icon={<MailOutlined />}
                size="small"
                onClick={() => openReplyModal(record)}
              >
                Reply
              </Button>
            </Tooltip>
          )}
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
            ? `Reply to Ticket: ${selectedTicket.subject}`
            : "Reply"
        }
        open={replyModalVisible}
        onCancel={closeReplyModal}
        onOk={handleReplySubmit}
        okText="Send Reply"
        confirmLoading={replyLoading}
        destroyOnClose
        footer={
          selectedTicket && !selectedTicket.adminReply
            ? [
                <Button key="cancel" onClick={closeReplyModal}>
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  loading={replyLoading}
                  onClick={handleReplySubmit}
                >
                  Send Reply
                </Button>,
              ]
            : null
        }
      >
        {selectedTicket && (
          <>
            <div className="mb-2">
              <strong>From:</strong>{" "}
              {selectedTicket.name ||
                (selectedTicket.userId &&
                  `${selectedTicket.userId.firstname} ${selectedTicket.userId.lastname}`)}
            </div>
            <div className="mb-2">
              <strong>Type:</strong> {selectedTicket.inquiryType}
            </div>
            <div className="mb-2">
              <strong>Message:</strong>
              <div
                style={{ background: "#f7f7f7", padding: 8, borderRadius: 4 }}
              >
                {selectedTicket.message}
              </div>
            </div>
            {!selectedTicket.adminReply && (
              <Input.TextArea
                rows={4}
                placeholder="Write your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            )}
            {selectedTicket.adminReply && (
              <div className="mt-3">
                <strong>Admin Reply:</strong>
                <div
                  style={{ background: "#e6ffe6", padding: 8, borderRadius: 4 }}
                >
                  {selectedTicket.adminReply}
                </div>
              </div>
            )}
          </>
        )}
      </AntdModal>
    </div>
  );
};

export default ManageTickets;
