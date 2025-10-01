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
  Form,
  DatePicker,
  InputNumber,
  Switch,
} from "antd";
import { showToast } from "../../../core/data/redux/slices/ToastSlice";
import LoadingIndicator2 from "../../../core/common/loadingIndicator/LoadingIndicator2";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined,
  UnorderedListOutlined,
  PercentageOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterExpiry, setFilterExpiry] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [toggleLoadingId, setToggleLoadingId] = useState(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCoupons(
      pagination.current,
      pagination.pageSize,
      filterStatus,
      filterType,
      filterExpiry
    );
    // eslint-disable-next-line
  }, [
    pagination.current,
    pagination.pageSize,
    filterStatus,
    filterType,
    filterExpiry,
  ]);

  const fetchCoupons = async (
    page = 1,
    limit = 10,
    status = "all",
    discountType = "all",
    expiry = "all"
  ) => {
    setLoading(true);
    try {
      let params = { page, limit };
      if (status === "active") params.isActive = "true";
      if (status === "inactive") params.isActive = "false";
      if (discountType !== "all") params.discountType = discountType;

      const response = await api.get("/admin/coupons", { params });
      if (response.data.success) {
        let filteredCoupons = response.data.data;

        // Apply expiry filter on frontend since API doesn't support it
        if (expiry === "expired") {
          filteredCoupons = filteredCoupons.filter(
            (coupon) => new Date(coupon.expiryDate) < new Date()
          );
        } else if (expiry === "notexpired") {
          filteredCoupons = filteredCoupons.filter(
            (coupon) => new Date(coupon.expiryDate) >= new Date()
          );
        }

        setCoupons(filteredCoupons);
        setPagination({
          current: response.data.pagination.currentPage,
          pageSize: response.data.pagination.itemsPerPage,
          total: response.data.pagination.totalItems,
        });
      }
    } catch (error) {
      dispatch(
        showToast({
          heading: "Error",
          message: error?.response?.data?.message || "Failed to fetch coupons",
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

  const handleTypeFilterChange = (value) => {
    setFilterType(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleExpiryFilterChange = (value) => {
    setFilterExpiry(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const openModal = (coupon = null) => {
    setEditingCoupon(coupon);
    setModalVisible(true);
    if (coupon) {
      form.setFieldsValue({
        ...coupon,
        expiryDate: coupon.expiryDate ? dayjs(coupon.expiryDate) : null,
      });
    } else {
      form.resetFields();
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingCoupon(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    setModalLoading(true);
    try {
      const payload = {
        ...values,
        expiryDate: values.expiryDate?.toISOString(),
        couponCode: values.couponCode?.toUpperCase(),
      };

      let response;
      if (editingCoupon) {
        response = await api.put(
          `/admin/coupons/${editingCoupon._id}`,
          payload
        );
      } else {
        response = await api.post("/admin/coupons", payload);
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
        fetchCoupons(
          pagination.current,
          pagination.pageSize,
          filterStatus,
          filterType
        );
      }
    } catch (error) {
      dispatch(
        showToast({
          heading: "Error",
          message:
            error?.response?.data?.message ||
            `Failed to ${editingCoupon ? "update" : "create"} coupon`,
          variant: "danger",
        })
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    setDeleteLoadingId(couponId);
    try {
      const response = await api.delete(`/admin/coupons/${couponId}`);
      if (response.data.success) {
        dispatch(
          showToast({
            heading: "Success",
            message: response.data.message,
            variant: "success",
          })
        );
        fetchCoupons(
          pagination.current,
          pagination.pageSize,
          filterStatus,
          filterType,
          filterExpiry
        );
      }
    } catch (error) {
      dispatch(
        showToast({
          heading: "Error",
          message: error?.response?.data?.message || "Failed to delete coupon",
          variant: "danger",
        })
      );
    } finally {
      setDeleteLoadingId(null);
    }
  };

  // const handleToggleStatus = async (couponId) => {
  //   setToggleLoadingId(couponId);
  //   try {
  //     const response = await api.patch(`/admin/coupons/${couponId}/status`);
  //     if (response.data.success) {
  //       dispatch(
  //         showToast({
  //           heading: "Success",
  //           message: response.data.message,
  //           variant: "success",
  //         })
  //       );
  //       fetchCoupons(
  //         pagination.current,
  //         pagination.pageSize,
  //         filterStatus,
  //         filterType,
  //         filterExpiry
  //       );
  //     }
  //   } catch (error) {
  //     dispatch(
  //       showToast({
  //         heading: "Error",
  //         message:
  //           error?.response?.data?.message || "Failed to toggle coupon status",
  //         variant: "danger",
  //       })
  //     );
  //   } finally {
  //     setToggleLoadingId(null);
  //   }
  // };

  const columns = [
    {
      title: "Coupon Code",
      dataIndex: "couponCode",
      key: "couponCode",
      render: (text) => <strong style={{ color: "#1890ff" }}>{text}</strong>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "discountType",
      key: "discountType",
      render: (type) => (
        <Tag
          icon={
            type === "percentage" ? <PercentageOutlined /> : <DollarOutlined />
          }
          color={type === "percentage" ? "blue" : "green"}
        >
          {type === "percentage" ? "Percentage" : "Fixed Amount"}
        </Tag>
      ),
    },
    {
      title: "Discount",
      key: "discount",
      render: (_, record) => (
        <span>
          {record.discountType === "percentage"
            ? `${record.discountValue}%`
            : `$${record.discountValue}`}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      render: (isActive) =>
        isActive ? (
          <Tag color="green">
            <CheckCircleOutlined /> Active
          </Tag>
        ) : (
          <Tag color="red">
            <CloseCircleOutlined /> Inactive
          </Tag>
        ),
    },
    {
      title: "Usage",
      key: "usage",
      render: (_, record) => (
        <span>
          {record.usageCount} / {record.maxUsage || "∞"}
        </span>
      ),
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date) => {
        const expiryDate = new Date(date);
        const isExpired = expiryDate < new Date();
        const formattedDate = expiryDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        return (
          <span
            style={{
              color: isExpired ? "#ff4d4f" : "#52c41a",
              fontWeight: "500",
            }}
          >
            {formattedDate}
            {isExpired && (
              <Tag color="red" style={{ marginLeft: 8 }}>
                Expired
              </Tag>
            )}
          </span>
        );
      },
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
          {/* <Tooltip title={record.isActive ? "Deactivate" : "Activate"}>
            <Button
              type={record.isActive ? "default" : "primary"}
              icon={
                record.isActive ? (
                  <CloseCircleOutlined />
                ) : (
                  <CheckCircleOutlined />
                )
              }
              size="small"
              onClick={() => handleToggleStatus(record._id)}
              loading={toggleLoadingId === record._id}
              disabled={toggleLoadingId === record._id}
            >
              {record.isActive ? "Deactivate" : "Activate"}
            </Button>
          </Tooltip> */}
          <Popconfirm
            title="Are you sure to delete this coupon?"
            onConfirm={() => handleDeleteCoupon(record._id)}
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
                  <h3 className="page-title">Manage Coupons</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to={all_routes.dashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">Coupons</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-semibold mb-0">All Coupons</h5>
                  <Space>
                    <Select
                      value={filterStatus}
                      style={{ width: 150 }}
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
                      <Select.Option value="active">
                        <Space>
                          <CheckCircleOutlined style={{ color: "#52c41a" }} />
                          Active Only
                        </Space>
                      </Select.Option>
                      <Select.Option value="inactive">
                        <Space>
                          <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
                          Inactive Only
                        </Space>
                      </Select.Option>
                    </Select>
                    <Select
                      value={filterType}
                      style={{ width: 150 }}
                      onChange={handleTypeFilterChange}
                      placeholder="Filter by type"
                    >
                      <Select.Option value="all">All Types</Select.Option>
                      <Select.Option value="percentage">
                        <Space>
                          <PercentageOutlined />
                          Percentage
                        </Space>
                      </Select.Option>
                      <Select.Option value="fixed">
                        <Space>
                          <DollarOutlined />
                          Fixed Amount
                        </Space>
                      </Select.Option>
                    </Select>
                    <Select
                      value={filterExpiry}
                      style={{ width: 150 }}
                      onChange={handleExpiryFilterChange}
                      placeholder="Filter by expiry"
                    >
                      <Select.Option value="all">All Coupons</Select.Option>
                      <Select.Option value="notexpired">
                        <Space>
                          <CheckCircleOutlined style={{ color: "#52c41a" }} />
                          Not Expired
                        </Space>
                      </Select.Option>
                      <Select.Option value="expired">
                        <Space>
                          <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
                          Expired
                        </Space>
                      </Select.Option>
                    </Select>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => openModal()}
                    >
                      Add Coupon
                    </Button>
                  </Space>
                </div>
                <Table
                  columns={columns}
                  dataSource={coupons}
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
        title={editingCoupon ? "Edit Coupon" : "Add New Coupon"}
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isActive: true,
            discountType: "percentage",
          }}
        >
          <Form.Item
            name="name"
            label="Coupon Name"
            rules={[{ required: true, message: "Please enter coupon name" }]}
          >
            <Input placeholder="Enter coupon name" />
          </Form.Item>

          <Form.Item
            name="couponCode"
            label="Coupon Code"
            rules={[{ required: true, message: "Please enter coupon code" }]}
          >
            <Input
              placeholder="Enter coupon code (will be converted to uppercase)"
              onChange={(e) => {
                form.setFieldsValue({
                  couponCode: e.target.value.toUpperCase(),
                });
              }}
            />
          </Form.Item>

          <div className="row">
            <div className="col-md-6">
              <Form.Item
                name="discountType"
                label="Discount Type"
                rules={[
                  { required: true, message: "Please select discount type" },
                ]}
              >
                <Select placeholder="Select discount type">
                  <Select.Option value="percentage">Percentage</Select.Option>
                  <Select.Option value="fixed">Fixed Amount</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                name="discountValue"
                label="Discount Value"
                rules={[
                  { required: true, message: "Please enter discount value" },
                  {
                    validator: (_, value) => {
                      const discountType = form.getFieldValue("discountType");
                      if (
                        discountType === "percentage" &&
                        (value < 0 || value > 100)
                      ) {
                        return Promise.reject(
                          "Percentage must be between 0 and 100"
                        );
                      }
                      if (discountType === "fixed" && value < 0) {
                        return Promise.reject(
                          "Amount must be greater than or equal to 0"
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  placeholder="Enter discount value"
                  style={{ width: "100%" }}
                  min={0}
                  max={
                    form.getFieldValue("discountType") === "percentage"
                      ? 100
                      : undefined
                  }
                />
              </Form.Item>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <Form.Item
                name="expiryDate"
                label="Expiry Date"
                rules={[
                  { required: true, message: "Please select expiry date" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                name="maxUsage"
                label="Max Usage (Leave empty for unlimited)"
              >
                <InputNumber
                  placeholder="Enter max usage"
                  style={{ width: "100%" }}
                  min={1}
                />
              </Form.Item>
            </div>
          </div>

          <Form.Item name="isActive" label="Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          <div className="d-flex justify-content-end">
            <Space>
              <Button onClick={closeModal}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={modalLoading}>
                {editingCoupon ? "Update Coupon" : "Create Coupon"}
              </Button>
            </Space>
          </div>
        </Form>
      </AntdModal>
    </div>
  );
};

export default ManageCoupons;
