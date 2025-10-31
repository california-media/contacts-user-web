import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import { useSelector, useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { showToast } from "../../../core/data/redux/slices/ToastSlice";
import {
  Card,
  Row,
  Col,
  Spin,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  Typography,
  Tag,
  Space,
  Divider,
  Alert,
  Badge,
  Tooltip,
  Table,
  Statistic,
  message,
} from "antd";
import {
  CreditCardOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
  StarFilled,
  WalletOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  DownloadOutlined,
  HistoryOutlined,
  DollarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

import "./upgradePlan.css";
import api from "../../../core/axios/axiosInstance";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Load Stripe
const stripePromise = loadStripe(
  "pk_test_51JM78KBtOBT8b78eKkjaaXWTEBvsBvmV1VYV3kaRXVgjCYNVLUPK7MNPQEpHgdihSUOtPEfG8WPsVqoHgBBsev2600RynHqIML"
);

const BillingInfo = () => {
  const route = all_routes;
  const navigate = useNavigate();
  const userProfile = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creditBalance, setCreditBalance] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loadingCredits, setLoadingCredits] = useState(false);
  const [addPaymentModalVisible, setAddPaymentModalVisible] = useState(false);
  const [editPaymentModalVisible, setEditPaymentModalVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  const [cardElement, setCardElement] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [form] = Form.useForm();
  const [billingHistory, setBillingHistory] = useState([]);
  const [loadingBillingHistory, setLoadingBillingHistory] = useState(false);
  const [billingHistorySummary, setBillingHistorySummary] = useState({
    totalInvoices: 0,
    totalPaid: 0,
    totalOutstanding: 0,
    currency: "usd",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `Total ${total} items`,
  });

  // Initialize Stripe
  useEffect(() => {
    const initializeStripe = async () => {
      const stripeInstance = await stripePromise;
      setStripe(stripeInstance);

      if (stripeInstance) {
        const elementsInstance = stripeInstance.elements();
        setElements(elementsInstance);
      }
    };
    initializeStripe();
  }, []);

  // Initialize card element when modal opens
  useEffect(() => {
    if (addPaymentModalVisible && elements && !cardElement) {
      try {
        const cardElementInstance = elements.create("card", {
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
          },
          hidePostalCode: true,
        });

        // Check if element container exists before mounting
        const cardContainer = document.getElementById("card-element");
        if (cardContainer && !cardContainer.hasChildNodes()) {
          cardElementInstance.mount("#card-element");
          setCardElement(cardElementInstance);
        }
      } catch (error) {
        console.error("Error creating Stripe card element:", error);
      }
    }

    // Cleanup when modal closes
    if (!addPaymentModalVisible && cardElement) {
      try {
        cardElement.unmount();
        setCardElement(null);
      } catch (error) {
        console.error("Error unmounting card element:", error);
        setCardElement(null);
      }
    }
  }, [addPaymentModalVisible, elements]);

  // Fetch billing data on component mount
  useEffect(() => {
    fetchBillingData();
  }, []);

  // Cleanup card element on component unmount
  useEffect(() => {
    return () => {
      if (cardElement) {
        try {
          cardElement.unmount();
        } catch (error) {
          console.error("Error unmounting card element on cleanup:", error);
        }
        setCardElement(null);
      }
    };
  }, [cardElement]);

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchPaymentStatus(),
        fetchPaymentMethods(),
        fetchCreditBalance(),
        fetchBillingHistory(),
      ]);
    } catch (error) {
      console.error("Error fetching billing data:", error);
      dispatch(
        showToast({
          message: "Failed to load billing information",
          variant: "danger",
          heading: "Error",
        })
      );
    }
    setLoading(false);
  };

  const fetchPaymentStatus = async () => {
    try {
      const response = await api.get("/user/payment/status");
      if (response.data.success) {
        setPaymentStatus(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching payment status:", error);
    }
  };
  // Add this helper function after formatCurrency
  const formatBillingPeriod = (duration) => {
    if (!duration) return "month"; // fallback

    // Handle different duration formats
    const durationMap = {
      monthly: "month",
      yearly: "year",
      annual: "year",
      weekly: "week",
      daily: "day",
      1: "month", // if duration is just a number
      12: "year",
    };

    return durationMap[duration.toLowerCase()] || duration;
  };
  const fetchPaymentMethods = async () => {
    try {
      const response = await api.get("/user/payment/payment-methods");
      if (response.data.success) {
        setPaymentMethods(response.data.paymentMethods);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  const fetchCreditBalance = async () => {
    setLoadingCredits(true);
    try {
      const response = await api.get("/user/payment/credit-balance");
      if (response.data.success) {
        setCreditBalance(response.data.creditBalance);
      }
    } catch (error) {
      console.error("Error fetching credit balance:", error);
    }
    setLoadingCredits(false);
  };

  const fetchBillingHistory = async () => {
    setLoadingBillingHistory(true);
    try {
      const response = await api.get("/user/payment/billing-history");
      if (response.data.success) {
        setBillingHistory(response.data.data.history);
        setBillingHistorySummary(response.data.data.summary);
      }
    } catch (error) {
      console.error("Error fetching billing history:", error);
      dispatch(
        showToast({
          message: "Failed to load billing history",
          variant: "warning",
          heading: "Warning",
        })
      );
    }
    setLoadingBillingHistory(false);
  };

  const handleTableChange = (paginationConfig, filters, sorter) => {
    setPagination({
      ...pagination,
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
    });
  };

  const handleAddPaymentMethod = async () => {
    if (!stripe || !cardElement) {
      dispatch(
        showToast({
          message: "Payment system not ready. Please try again.",
          variant: "warning",
          heading: "Warning",
        })
      );
      return;
    }

    setProcessingPayment(true);
    try {
      // Create payment method with Stripe
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: userProfile?.name || "",
          email: userProfile?.email || "",
        },
      });

      if (error) {
        dispatch(
          showToast({
            message: error.message,
            variant: "danger",
            heading: "Payment Error",
          })
        );
        setProcessingPayment(false);
        return;
      }

      // Add payment method to backend
      const response = await api.post("/user/payment/add-payment-method", {
        paymentMethodId: paymentMethod.id,
        setAsDefault: paymentMethods.length === 0, // Set as default if it's the first one
      });

      if (response.data.success) {
        dispatch(
          showToast({
            message: "Payment method added successfully",
            variant: "success",
            heading: "Success",
          })
        );
        setAddPaymentModalVisible(false);
        fetchPaymentMethods();
      } else {
        dispatch(
          showToast({
            message: response.data.message || "Failed to add payment method",
            variant: "danger",
            heading: "Error",
          })
        );
      }
    } catch (error) {
      console.error("Error adding payment method:", error);
      dispatch(
        showToast({
          message:
            error.response?.data?.message || "Failed to add payment method",
          variant: "danger",
          heading: "Error",
        })
      );
    }
    setProcessingPayment(false);
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId) => {
    try {
      const response = await api.post(
        "/user/payment/set-default-payment-method",
        {
          paymentMethodId,
        }
      );

      if (response.data.success) {
        dispatch(
          showToast({
            message: "Default payment method updated",
            variant: "success",
            heading: "Success",
          })
        );
        fetchPaymentMethods();
      }
    } catch (error) {
      console.error("Error setting default payment method:", error);
      dispatch(
        showToast({
          message: "Failed to update default payment method",
          variant: "danger",
          heading: "Error",
        })
      );
    }
  };

  const handleUpdatePaymentMethod = async (values) => {
    try {
      const response = await api.put("/user/payment/update-payment-method", {
        paymentMethodId: selectedPaymentMethod.id,
        billingDetails: {
          name: values.name,
          email: values.email,
          address: {
            line1: values.address_line1,
            line2: values.address_line2,
            city: values.city,
            state: values.state,
            postal_code: values.postal_code,
            country: values.country,
          },
        },
      });

      if (response.data.success) {
        dispatch(
          showToast({
            message: "Payment method updated successfully",
            variant: "success",
            heading: "Success",
          })
        );
        setEditPaymentModalVisible(false);
        fetchPaymentMethods();
      }
    } catch (error) {
      console.error("Error updating payment method:", error);
      dispatch(
        showToast({
          message: "Failed to update payment method",
          variant: "danger",
          heading: "Error",
        })
      );
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId) => {
    try {
      const response = await api.delete(
        `/user/payment/delete-payment-method/${paymentMethodId}`
      );

      if (response.data.success) {
        dispatch(
          showToast({
            message: "Payment method deleted successfully",
            variant: "success",
            heading: "Success",
          })
        );
        fetchPaymentMethods();
      }
    } catch (error) {
      console.error("Error deleting payment method:", error);
      dispatch(
        showToast({
          message: "Failed to delete payment method",
          variant: "danger",
          heading: "Error",
        })
      );
    }
  };

  const getCardBrandIcon = (brand) => {
    const brandIcons = {
      visa: "💳",
      mastercard: "💳",
      amex: "💳",
      discover: "💳",
      diners: "💳",
      jcb: "💳",
      unionpay: "💳",
    };
    return brandIcons[brand] || "💳";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      paid: "green",
      open: "orange",
      upcoming: "blue",
      void: "red",
      draft: "gray",
      past_due: "orange",
    };
    return statusColors[status] || "default";
  };

  const getStatusText = (status) => {
    const statusTexts = {
      paid: "Paid",
      open: "Outstanding",
      upcoming: "Upcoming",
      void: "Void",
      draft: "Draft",
      past_due: "Past Due",
    };
    return (
      statusTexts[status] || status.charAt(0).toUpperCase() + status.slice(1)
    );
  };

  const billingHistoryColumns = [
    {
      title: "Invoice",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text, record) => (
        <div>
          <Text strong={record.status === "upcoming"}>{text}</Text>
          {record.invoiceNumber && (
            <div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Invoice #{record.invoiceNumber}
              </Text>
            </div>
          )}
          {/* {record.periodStart && record.periodEnd && (
            <div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Billing Period:{" "}
                {new Date(record.periodStart).toLocaleDateString()} -{" "}
                {new Date(record.periodEnd).toLocaleDateString()}
              </Text>
            </div>
          )} */}
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120,
      render: (date) => <Text>{new Date(date).toLocaleDateString()}</Text>,
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      defaultSortOrder: "descend",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 100,
      render: (amount, record) => (
        <Text
          strong
          style={{
            color:
              record.status === "upcoming"
                ? "#1890ff"
                : record.status === "paid"
                ? "#52c41a"
                : record.status === "open"
                ? "#fa8c16"
                : "#000",
          }}
        >
          {formatCurrency(amount)}
        </Text>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status, record) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
      filters: [
        { text: "Paid", value: "paid" },
        { text: "Outstanding", value: "open" },
        { text: "Upcoming", value: "upcoming" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space size="small">
          {record.hostedUrl && (
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/general-settings/invoice/${record.id}`)}
              title="View Invoice"
            />
          )}
          {record.pdfUrl && (
            <Button
              type="link"
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => window.open(record.pdfUrl, "_blank")}
              title="Download PDF"
            />
          )}
        </Space>
      ),
    },
  ];

  const renderPaymentMethodCard = (method) => (
    <Card
      key={method.id}
      className="payment-method-card"
      style={{
        marginBottom: "16px",
        border: method.isDefault ? "2px solid #52c41a" : "1px solid #d9d9d9",
      }}
    >
      <Row align="middle" justify="space-between">
        <Col span={16}>
          <Space size="middle">
            <div className="card-icon">
              {getCardBrandIcon(method.card.brand)}
            </div>
            <div>
              <Text strong>
                {method.card.brand.toUpperCase()} •••• {method.card.last4}{" "}
                {method.isDefault && (
                  <Tag color="green" className="ml-4 mb-2">
                    <StarFilled /> Default
                  </Tag>
                )}
              </Text>
              <br />
              <Text type="secondary">
                Expires {method.card.exp_month.toString().padStart(2, "0")}/
                {method.card.exp_year}
              </Text>
            </div>
          </Space>
        </Col>
        <Col span={8} className="text-end">
          <Space>
            {!method.isDefault && (
              <Button
                type="link"
                icon={<StarOutlined />}
                onClick={() => handleSetDefaultPaymentMethod(method.id)}
              >
                Set Default
              </Button>
            )}
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedPaymentMethod(method);
                // Pre-populate form with existing billing details if available
                if (method.billing_details) {
                  form.setFieldsValue({
                    name: method.billing_details.name || "",
                    email: method.billing_details.email || "",
                    address_line1: method.billing_details.address?.line1 || "",
                    address_line2: method.billing_details.address?.line2 || "",
                    city: method.billing_details.address?.city || "",
                    state: method.billing_details.address?.state || "",
                    postal_code:
                      method.billing_details.address?.postal_code || "",
                    country: method.billing_details.address?.country || "US",
                  });
                }
                setEditPaymentModalVisible(true);
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete Payment Method"
              description="Are you sure you want to delete this payment method?"
              onConfirm={() => handleDeletePaymentMethod(method.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        </Col>
      </Row>
    </Card>
  );

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-xl-3 col-lg-12 theiaStickySidebar">
                  <div className="card">
                    <div className="card-body">
                      <div className="settings-sidebar">
                        <h4 className="fw-semibold mb-3">Settings</h4>
                        <div className="list-group list-group-flush settings-sidebar">
                          <Link to={route.profile} className="fw-medium">
                            Profile
                          </Link>
                          <Link to={route.security} className="fw-medium">
                            Security
                          </Link>
                          <Link to={route.emailSetup} className="fw-medium">
                            Sync and Integration
                          </Link>
                          <Link
                            to={`${route.scans}#myScans`}
                            className="fw-medium"
                          >
                            My Scans
                          </Link>
                          <Link to={route.upgradePlan} className="fw-medium ">
                            Upgrade Plan
                          </Link>
                          <Link
                            to={route.biilingInfo}
                            className="fw-medium active"
                          >
                            Billing Info
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-9 col-lg-12">
                  {/* Settings Info */}
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <Title level={3}>
                            <CreditCardOutlined /> Billing Information
                          </Title>

                          {loading ? (
                            <div className="text-center p-4">
                              <Spin size="large" />
                            </div>
                          ) : (
                            <div>
                              <Card
                                className="mb-4"
                                style={{ background: "#f8f9fa" }}
                              >
                                <Row align="top" justify="space-between">
                                  <Col>
                                    <Space
                                      style={{
                                        alignItems: "flex-start",
                                        gap: "17px",
                                      }}
                                    >
                                      <WalletOutlined
                                        style={{
                                          fontSize: "24px",
                                          color: "#1890ff",
                                          marginTop: "7px",
                                        }}
                                      />
                                      <div>
                                        <Title level={4} className="mb-0">
                                          Available Credits
                                        </Title>
                                        <Text type="secondary">
                                          Your current credit balance
                                        </Text>
                                      </div>
                                    </Space>
                                  </Col>
                                  <Col>
                                    <div className="text-right">
                                      {loadingCredits ? (
                                        <Spin />
                                      ) : (
                                        <Title
                                          level={2}
                                          className="mb-0"
                                          style={{ color: "#52c41a" }}
                                        >
                                          {formatCurrency(creditBalance / 100)}
                                        </Title>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </Card>

                              {/* Current Plan Section */}
                              {paymentStatus && paymentStatus.plan && (
                                <Card className="mb-4">
                                  <Title level={4}>Current Plan</Title>
                                  <Row align="middle" justify="space-between">
                                    <Col>
                                      <div>
                                        <Title level={5} className="mb-1">
                                          {paymentStatus.plan.name}
                                        </Title>
                                        <Text type="secondary">
                                          {paymentStatus.plan.price > 0
                                            ? `${formatCurrency(
                                                paymentStatus.plan.price / 100
                                              )} / ${formatBillingPeriod(
                                                paymentStatus.plan.duration
                                              )}`
                                            : "Free"}
                                        </Text>
                                        {paymentStatus.subscription && (
                                          <div className="mt-2">
                                            <Badge
                                              status={
                                                paymentStatus.subscription
                                                  .status === "active"
                                                  ? "success"
                                                  : "warning"
                                              }
                                              text={`Status: ${paymentStatus.subscription.status}`}
                                            />
                                            <br />
                                            <Text type="secondary">
                                              Next billing:{" "}
                                              {new Date(
                                                paymentStatus.subscription.currentPeriodEnd
                                              ).toLocaleDateString()}
                                            </Text>
                                            <br />
                                            <Text type="secondary">
                                              Auto-renewal:{" "}
                                              {paymentStatus.subscription
                                                .cancelAtPeriodEnd
                                                ? "Disabled"
                                                : "Enabled"}
                                            </Text>
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col>
                                      <Link to={route.upgradePlan}>
                                        <Button type="primary">
                                          Change Plan
                                        </Button>
                                      </Link>
                                    </Col>
                                  </Row>
                                </Card>
                              )}

                              {/* Payment Methods Section */}
                              <Card className="mb-4">
                                <Row
                                  align="middle"
                                  justify="space-between"
                                  className="mb-3"
                                >
                                  <Col>
                                    <Title level={4} className="mb-0">
                                      Payment Methods
                                    </Title>
                                  </Col>
                                  <Col>
                                    <Button
                                      type="primary"
                                      icon={<PlusOutlined />}
                                      onClick={() =>
                                        setAddPaymentModalVisible(true)
                                      }
                                    >
                                      Add Payment Method
                                    </Button>
                                  </Col>
                                </Row>

                                {paymentMethods.length === 0 ? (
                                  <Alert
                                    message="No Payment Methods"
                                    description="You haven't added any payment methods yet. Add one to manage your subscriptions."
                                    type="info"
                                    showIcon
                                    className="mb-3"
                                  />
                                ) : (
                                  <div>
                                    {paymentMethods.map(
                                      renderPaymentMethodCard
                                    )}
                                  </div>
                                )}
                              </Card>

                              {/* Billing History Section */}
                              <Card>
                                <div className="mb-4">
                                  <Row align="middle" justify="space-between">
                                    <Col>
                                      <Title level={4} className="mb-0">
                                        <HistoryOutlined className="mr-2" />
                                        <span
                                          style={{ marginLeft: "19px" }}
                                          className="ml-2"
                                        >
                                          Billing History
                                        </span>
                                      </Title>
                                    </Col>
                                    <Col>
                                      <Button
                                        type="text"
                                        onClick={fetchBillingHistory}
                                        loading={loadingBillingHistory}
                                        icon={<HistoryOutlined />}
                                      >
                                        Refresh
                                      </Button>
                                    </Col>
                                  </Row>
                                </div>

                                {/* Summary Statistics */}
                                <div className="mb-4">
                                  <Row gutter={16}>
                                    <Col xs={36} sm={12}>
                                      <Card
                                        size="small"
                                        className="text-center"
                                      >
                                        <Statistic
                                          title="Total Invoices"
                                          value={
                                            billingHistorySummary.totalInvoices
                                          }
                                          prefix={<FileTextOutlined />}
                                        />
                                      </Card>
                                    </Col>
                                    <Col xs={36} sm={12}>
                                      <Card
                                        size="small"
                                        className="text-center"
                                      >
                                        <Statistic
                                          title="Total Paid"
                                          value={
                                            billingHistorySummary.totalPaid
                                          }
                                          precision={2}
                                          prefix={<DollarOutlined />}
                                          valueStyle={{ color: "#52c41a" }}
                                        />
                                      </Card>
                                    </Col>
                                    {/* <Col xs={24} sm={8}>
                                      <Card
                                        size="small"
                                        className="text-center"
                                      >
                                        <Statistic
                                          title="Outstanding"
                                          value={
                                            billingHistorySummary.totalOutstanding
                                          }
                                          precision={2}
                                          prefix={<DollarOutlined />}
                                          valueStyle={{
                                            color:
                                              billingHistorySummary.totalOutstanding >
                                              0
                                                ? "#fa8c16"
                                                : "#52c41a",
                                          }}
                                        />
                                      </Card>
                                    </Col> */}
                                  </Row>
                                </div>

                                {/* Billing History Table */}
                                {loadingBillingHistory ? (
                                  <div className="text-center p-4">
                                    <Spin size="large" />
                                    <div className="mt-2">
                                      <Text type="secondary">
                                        Loading billing history...
                                      </Text>
                                    </div>
                                  </div>
                                ) : billingHistory.length === 0 ? (
                                  <Alert
                                    message="No Billing History"
                                    description="You don't have any billing history yet. Your invoices and subscription changes will appear here once you start using our services."
                                    type="info"
                                    showIcon
                                    className="mb-3"
                                  />
                                ) : (
                                  <Table
                                    className="billing-history-table"
                                    columns={billingHistoryColumns}
                                    dataSource={billingHistory}
                                    rowKey="id"
                                    pagination={pagination}
                                    onChange={handleTableChange}
                                    scroll={{ x: 800 }}
                                    size="small"
                                    rowClassName={(record) => {
                                      if (record.status === "upcoming")
                                        return "billing-upcoming-row";
                                      if (record.status === "open")
                                        return "billing-outstanding-row";
                                      return "";
                                    }}
                                  />
                                )}
                              </Card>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Add Payment Method Modal */}
                      <Modal
                        title="Add Payment Method"
                        visible={addPaymentModalVisible}
                        onCancel={() => {
                          setAddPaymentModalVisible(false);
                        }}
                        footer={[
                          <Button
                            key="cancel"
                            onClick={() => {
                              setAddPaymentModalVisible(false);
                            }}
                          >
                            Cancel
                          </Button>,
                          <Button
                            key="submit"
                            type="primary"
                            loading={processingPayment}
                            onClick={handleAddPaymentMethod}
                            disabled={!cardElement}
                          >
                            Add Payment Method
                          </Button>,
                        ]}
                      >
                        <Alert
                          message="Test Mode"
                          description="Use test card 4242 4242 4242 4242 with any future expiry date and CVC."
                          type="info"
                          showIcon
                          className="mb-3"
                        />
                        <div
                          id="card-element"
                          style={{
                            padding: "12px",
                            border: "1px solid #d9d9d9",
                            borderRadius: "6px",
                            minHeight: "40px",
                            backgroundColor: "#fff",
                          }}
                        >
                          {/* Stripe Elements will be mounted here */}
                        </div>
                      </Modal>

                      {/* Edit Payment Method Modal */}
                      <Modal
                        title="Edit Payment Method"
                        visible={editPaymentModalVisible}
                        onCancel={() => {
                          setEditPaymentModalVisible(false);
                          form.resetFields();
                        }}
                        footer={null}
                      >
                        <Form
                          form={form}
                          onFinish={handleUpdatePaymentMethod}
                          layout="vertical"
                        >
                          <Form.Item
                            name="name"
                            label="Cardholder Name"
                            rules={[
                              {
                                required: true,
                                message: "Please enter cardholder name",
                              },
                            ]}
                          >
                            <Input placeholder="John Doe" />
                          </Form.Item>

                          <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                              { required: true, message: "Please enter email" },
                              {
                                type: "email",
                                message: "Please enter valid email",
                              },
                            ]}
                          >
                            <Input placeholder="john@example.com" />
                          </Form.Item>

                          <Divider>Billing Address</Divider>

                          <Form.Item
                            name="address_line1"
                            label="Address Line 1"
                            rules={[
                              {
                                required: true,
                                message: "Please enter address",
                              },
                            ]}
                          >
                            <Input placeholder="123 Main St" />
                          </Form.Item>

                          <Form.Item
                            name="address_line2"
                            label="Address Line 2"
                          >
                            <Input placeholder="Apt 4B" />
                          </Form.Item>

                          <Row gutter={16}>
                            <Col span={12}>
                              <Form.Item
                                name="city"
                                label="City"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please enter city",
                                  },
                                ]}
                              >
                                <Input placeholder="New York" />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                name="state"
                                label="State"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please enter state",
                                  },
                                ]}
                              >
                                <Input placeholder="NY" />
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row gutter={16}>
                            <Col span={12}>
                              <Form.Item
                                name="postal_code"
                                label="Postal Code"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please enter postal code",
                                  },
                                ]}
                              >
                                <Input placeholder="10001" />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                name="country"
                                label="Country"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please select country",
                                  },
                                ]}
                              >
                                <Select placeholder="Select country">
                                  <Option value="US">United States</Option>
                                  <Option value="CA">Canada</Option>
                                  <Option value="GB">United Kingdom</Option>
                                  <Option value="AU">Australia</Option>
                                  {/* Add more countries as needed */}
                                </Select>
                              </Form.Item>
                            </Col>
                          </Row>

                          <div className="text-right">
                            <Space>
                              <Button
                                onClick={() => {
                                  setEditPaymentModalVisible(false);
                                  form.resetFields();
                                }}
                              >
                                Cancel
                              </Button>
                              <Button type="primary" htmlType="submit">
                                Update Payment Method
                              </Button>
                            </Space>
                          </div>
                        </Form>
                      </Modal>
                    </div>
                  </div>
                  {/* /Settings Info */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingInfo;
