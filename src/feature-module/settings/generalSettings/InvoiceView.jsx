import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Button,
  Space,
  Spin,
  Alert,
  Divider,
  Row,
  Col,
  Tag,
  Table,
} from "antd";
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { all_routes } from "../../router/all_routes";
import "./InvoiceView.scss";
import api from "../../../core/axios/axiosInstance";

const { Title, Text, Paragraph } = Typography;

const InvoiceView = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoiceDetails();
  }, [invoiceId]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/user/payment/invoice/${invoiceId}`);
      console.log("Invoice response:", response.data);
      if (response.data.success) {
        setInvoice(response.data.data);
      } else {
        setError(response.data.message || "Failed to load invoice");
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
      setError("Failed to load invoice details");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency = "usd") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "open":
        return <ExclamationCircleOutlined style={{ color: "#fa8c16" }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "green";
      case "open":
        return "orange";
      case "upcoming":
        return "blue";
      case "void":
        return "red";
      case "draft":
        return "gray";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Invoice paid";
      case "open":
        return "Invoice outstanding";
      case "upcoming":
        return "Upcoming invoice";
      case "void":
        return "Invoice void";
      case "draft":
        return "Draft invoice";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="invoice-view-container">
        <div className="loading-container">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="invoice-view-container">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button
              size="small"
              onClick={() => navigate(all_routes.biilingInfo)}
            >
              Back to Billing
            </Button>
          }
        />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="invoice-view-container">
        <Alert
          message="Invoice not found"
          description="The requested invoice could not be found."
          type="warning"
          showIcon
          action={
            <Button
              size="small"
              onClick={() => navigate(all_routes.biilingInfo)}
            >
              Back to Billing
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <div className="invoice-view-container">
                <div className="invoice-header">
                  <Space>
                    <Button
                      type="text"
                      icon={<ArrowLeftOutlined />}
                      onClick={() => navigate(all_routes.biilingInfo)}
                    >
                      Back to Billing
                    </Button>
                  </Space>
                </div>

                <div className="invoice-content">
                  <Card className="invoice-card">
                    {/* Company Header */}
                    <div className="company-header">
                      <Row justify="space-between" align="top">
                        <Col>
                          <Title level={4} className="company-name">
                            {invoice.company?.name || "California Media INC"}
                          </Title>
                          {invoice.company?.mode && (
                            <Tag color="orange" className="test-mode-tag">
                              {invoice.company.mode}
                            </Tag>
                          )}
                        </Col>
                        <Col>
                          <Space direction="vertical" align="end">
                            {invoice.pdfUrl && (
                              <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                onClick={() =>
                                  window.open(invoice.pdfUrl, "_blank")
                                }
                              >
                                Download invoice
                              </Button>
                            )}
                          </Space>
                        </Col>
                      </Row>
                    </div>

                    <Divider />

                    {/* Invoice Status */}
                    <div className="invoice-status-section">
                      <div className="status-icon-container">
                        <div className="invoice-icon">
                          <svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="16"
                              rx="2"
                              stroke="#d9d9d9"
                              strokeWidth="2"
                            />
                            <line
                              x1="7"
                              y1="8"
                              x2="17"
                              y2="8"
                              stroke="#d9d9d9"
                              strokeWidth="2"
                            />
                            <line
                              x1="7"
                              y1="12"
                              x2="17"
                              y2="12"
                              stroke="#d9d9d9"
                              strokeWidth="2"
                            />
                            <line
                              x1="7"
                              y1="16"
                              x2="13"
                              y2="16"
                              stroke="#d9d9d9"
                              strokeWidth="2"
                            />
                            {invoice.status === "paid" && (
                              <circle cx="18" cy="6" r="4" fill="#52c41a" />
                            )}
                            {invoice.status === "paid" && (
                              <path
                                d="16 6l1 1 2-2"
                                stroke="white"
                                strokeWidth="2"
                                fill="none"
                              />
                            )}
                          </svg>
                        </div>
                      </div>

                      <div className="status-info">
                        <Title level={3} className="status-title">
                          {getStatusText(invoice.status)}
                        </Title>
                        <Title level={1} className="invoice-amount">
                          {formatCurrency(invoice.amount, invoice.currency)}
                        </Title>
                       
                      </div>
                    </div>

                    <Divider />

                    {/* Invoice Details */}
                    <div className="invoice-details">
                      <Row gutter={[32, 16]}>
                        <Col span={12}>
                          <div className="detail-group">
                            <Text strong>Invoice number</Text>
                            <div>{invoice.number || "N/A"}</div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="detail-group">
                            <Text strong>Payment date</Text>
                            <div>
                              {invoice.paidAt
                                ? new Date(invoice.paidAt).toLocaleDateString()
                                : "Not paid"}
                            </div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="detail-group">
                            <Text strong>Payment method</Text>
                            <div>
                              {invoice.paymentMethod
                                ? `${invoice.paymentMethod.brand?.toUpperCase()} •••• ${
                                    invoice.paymentMethod.last4
                                  }`
                                : "N/A"}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    {/* Line Items Table */}
                    {/* {invoice.lineItems && invoice.lineItems.length > 0 && (
                      <>
                        <Divider />
                        <div className="line-items-section">
                          <Title level={4}>Items</Title>
                          <div className="line-items">
                            {invoice.lineItems.map((item, index) => (
                              <div key={item.id || index} className="line-item">
                                <Row justify="space-between" align="middle">
                                  <Col span={18}>
                                    <div>
                                      <Text strong>{item.description}</Text>
                                      {item.period && (
                                        <div style={{ marginTop: 4 }}>
                                          <Text
                                            type="secondary"
                                            style={{ fontSize: "12px" }}
                                          >
                                            {new Date(
                                              item.period.start
                                            ).toLocaleDateString()}{" "}
                                            -{" "}
                                            {new Date(
                                              item.period.end
                                            ).toLocaleDateString()}
                                          </Text>
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col span={6} style={{ textAlign: "right" }}>
                                    <Text strong>
                                      {formatCurrency(
                                        item.amount,
                                        invoice.currency
                                      )}
                                    </Text>
                                  </Col>
                                </Row>
                              </div>
                            ))}
                          </div>

                          <div className="invoice-totals">
                            <Row justify="space-between" className="total-row">
                              <Col>
                                <Text>Subtotal</Text>
                              </Col>
                              <Col>
                                <Text>
                                  {formatCurrency(
                                    invoice.subtotal,
                                    invoice.currency
                                  )}
                                </Text>
                              </Col>
                            </Row>

                            {invoice.tax > 0 && (
                              <Row
                                justify="space-between"
                                className="total-row"
                              >
                                <Col>
                                  <Text>Tax</Text>
                                </Col>
                                <Col>
                                  <Text>
                                    {formatCurrency(
                                      invoice.tax,
                                      invoice.currency
                                    )}
                                  </Text>
                                </Col>
                              </Row>
                            )}

                            <Row
                              justify="space-between"
                              className="total-row final-total"
                            >
                              <Col>
                                <Text strong>Total</Text>
                              </Col>
                              <Col>
                                <Text strong>
                                  {formatCurrency(
                                    invoice.amount,
                                    invoice.currency
                                  )}
                                </Text>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </>
                    )} */}
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
