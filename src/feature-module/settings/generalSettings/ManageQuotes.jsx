import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../../../core/axios/axiosInstance";
import { all_routes } from "../../router/all_routes";
import {
  Table,
  Button,
  Modal as AntdModal,
  Input,
  Space,
  Tooltip,
  Popconfirm,
  Form,
} from "antd";
import { showToast } from "../../../core/data/redux/slices/ToastSlice";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const ManageQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchQuotes(pagination.current, pagination.pageSize);
    // eslint-disable-next-line
  }, [pagination.current, pagination.pageSize]);

  const fetchQuotes = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const params = { page, limit };
      const response = await api.get("/admin/quote/get", { params });

      if (response.data.quotes) {
        const quotesArray = Array.isArray(response.data.quotes)
          ? response.data.quotes
          : [];

        setQuotes(quotesArray);
        setPagination({
          current: page,
          pageSize: limit,
          total: quotesArray.length,
        });
      }
    } catch (error) {
      dispatch(
        showToast({
          heading: "Error",
          message: error?.response?.data?.message || "Failed to fetch quotes",
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

  const openModal = (quote = null) => {
    setEditingQuote(quote);
    setModalVisible(true);
    if (quote) {
      form.setFieldsValue({
        quoteText: quote.quoteText,
      });
    } else {
      form.resetFields();
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingQuote(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    setModalLoading(true);
    try {
      let response;

      if (editingQuote) {
        response = await api.put("/admin/quote/edit", {
          quote_id: editingQuote.quote_id,
          newText: values.quoteText,
        });
      } else {
        response = await api.post("/admin/quote/add", {
          quotes: [values.quoteText],
        });
      }

      if (response.data.success) {
        dispatch(
          showToast({
            heading: "Success",
            message: response.data.message,
            variant: "success",
          })
        );
        closeModal();
        fetchQuotes(pagination.current, pagination.pageSize);
      }
    } catch (error) {
      dispatch(
        showToast({
          heading: "Error",
          message:
            error?.response?.data?.message ||
            `Failed to ${editingQuote ? "update" : "create"} quote`,
          variant: "danger",
        })
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteQuote = async (quoteId) => {
    setDeleteLoadingId(quoteId);
    try {
      const response = await api.delete("/admin/quote/delete", {
        data: { quote_id: quoteId },
      });

      if (response.data.success) {
        dispatch(
          showToast({
            heading: "Success",
            message: response.data.message,
            variant: "success",
          })
        );
        fetchQuotes(pagination.current, pagination.pageSize);
      }
    } catch (error) {
      dispatch(
        showToast({
          heading: "Error",
          message: error?.response?.data?.message || "Failed to delete quote",
          variant: "danger",
        })
      );
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const columns = [
    {
      title: "Quote Text",
      dataIndex: "quoteText",
      key: "quoteText",
      render: (text) => <span style={{ color: "#333" }}>{text}</span>,
      width: "70%",
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => {
        return new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
      width: "15%",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => openModal(record)}
            >
              Edit
            </Button>
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete this quote?"
            onConfirm={() => handleDeleteQuote(record.quote_id)}
            okText="Yes"
            cancelText="No"
            disabled={deleteLoadingId === record.quote_id}
          >
            <Button
              type="primary"
              danger={true}
              icon={<DeleteOutlined />}
              size="small"
              loading={deleteLoadingId === record.quote_id}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: "15%",
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
                  <h3 className="page-title">Manage Quotes</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to={all_routes.dashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">Quotes</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-semibold mb-0">All Quotes</h5>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => openModal()}
                  >
                    Add Quote
                  </Button>
                </div>
                <Table
                  columns={columns}
                  dataSource={quotes}
                  rowKey="quote_id"
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
        title={editingQuote ? "Edit Quote" : "Add New Quote"}
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="quoteText"
            label="Quote Text"
            rules={[
              { required: true, message: "Please enter quote text" },
              {
                min: 10,
                message: "Quote must be at least 10 characters long",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Enter quote text"
              rows={4}
              maxLength={500}
            />
          </Form.Item>

          <div className="d-flex justify-content-end">
            <Space>
              <Button onClick={closeModal}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={modalLoading}>
                {editingQuote ? "Update Quote" : "Create Quote"}
              </Button>
            </Space>
          </div>
        </Form>
      </AntdModal>
    </div>
  );
};

export default ManageQuotes;
