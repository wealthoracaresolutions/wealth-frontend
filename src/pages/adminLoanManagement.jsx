import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Modal,
  Form,
  Alert,
  Tabs,
  Tab,
  Spinner,
} from "react-bootstrap";
import styled from "styled-components";
import Header from "../components/header";
import Footer from "../components/footer";
import fetchData from "../fetchData";
import { developmentApiEntryPoint } from "./register";
import { useNavigate } from "react-router-dom";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7ff 0%, #eaf0ff 100%);
  padding: 40px 20px;
`;

const StatsCard = styled(Card)`
  border: none;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  border-left: 5px solid ${(props) => props.color || "#1abc9c"};

  .card-body {
    padding: 25px;
  }

  .stat-label {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 10px;
    font-weight: 500;
    text-transform: uppercase;
  }

  .stat-value {
    font-size: 1.8rem;
    font-weight: bold;
    color: #333;
  }
`;

const TableWrapper = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  margin-bottom: 30px;

  table {
    margin-bottom: 0;

    tbody tr:hover {
      background-color: #f9f9f9;
    }

    td {
      vertical-align: middle;
    }
  }
`;

const ActionButton = styled(Button)`
  padding: 5px 10px !important;
  font-size: 0.85rem !important;
  margin-right: 5px !important;
`;

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "warning";
    case "approved":
      return "info";
    case "disbursed":
      return "success";
    case "repaid":
      return "dark";
    case "rejected":
      return "danger";
    default:
      return "secondary";
  }
};

const getDocumentUrl = (url) =>
  typeof url === "string" && url.startsWith("https://res.cloudinary.com/")
    ? url
    : null;

const DocumentPreview = ({ url, alt }) => {
  const documentUrl = getDocumentUrl(url);
  return documentUrl ? (
    <a
      href={documentUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-block",
        background: "#f5f7fb",
        border: "1px solid #dfe7f1",
        borderRadius: "10px",
        padding: "6px",
        boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
      }}
    >
      <img
        src={documentUrl}
        alt={alt}
        style={{
          display: "block",
          width: "220px",
          maxWidth: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "8px",
          border: "1px solid #e6edf7",
          backgroundColor: "#eef3fb",
        }}
      />
    </a>
  ) : (
    <span style={{ color: "#7a7a7a", fontStyle: "italic" }}>Unavailable</span>
  );
};

const AdminLoanManagement = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("support_token");

  const [activeTab, setActiveTab] = useState("all");
  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDisburseModal, setShowDisburseModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [reviewData, setReviewData] = useState({
    action: "approve",
    comments: "",
    creditScore: "",
    disbursalMethod: "bank_transfer",
  });

  const [disburseData, setDisburseData] = useState({
    transactionId: "",
  });

  const [emailData, setEmailData] = useState({
    subject: "Update on your loan application",
    message: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchLoans();
      fetchStats();
    }
  }, [token, navigate]);

  const fetchLoans = () => {
    setLoading(true);
    const url =
      activeTab === "all"
        ? `${developmentApiEntryPoint}/loans/admin/all`
        : `${developmentApiEntryPoint}/loans/admin/status/${activeTab}`;

    fetchData(
      url,
      (data) => {
        setLoans(data.result || []);
        setLoading(false);
      },
      (message) => {
        console.error(message);
        setLoading(false);
      },
      "GET",
      null,
      token
    );
  };

  const fetchStats = () => {
    fetchData(
      `${developmentApiEntryPoint}/loans/admin/stats`,
      (data) => {
        setStats(data.result || {});
      },
      (message) => {
        console.error(message);
      },
      "GET",
      null,
      token
    );
  };

  const handleShowReviewModal = (loan) => {
    setSelectedLoan(loan);
    setReviewData({
      action: "approve",
      comments: "",
      creditScore: "",
      disbursalMethod: "bank_transfer",
    });
    setShowReviewModal(true);
  };

  const handleShowDisburseModal = (loan) => {
    setSelectedLoan(loan);
    setDisburseData({ transactionId: "" });
    setShowDisburseModal(true);
  };

  const handleShowDetailsModal = (loan) => {
    setSelectedLoan(loan);
    setShowDetailsModal(true);
  };

  const handleShowEmailModal = (loan) => {
    setSelectedLoan(loan);
    setEmailData({
      subject: `Update on your loan application (${loan.status || "pending"})`,
      message: "",
    });
    setShowEmailModal(true);
  };

  const handleSendApplicantEmail = () => {
    if (!selectedLoan) {
      alert("Please select a loan applicant first.");
      return;
    }

    if (!emailData.subject.trim() || !emailData.message.trim()) {
      alert("Please provide both a subject and a message before sending.");
      return;
    }

    setActionLoading(true);
    fetchData(
      `${developmentApiEntryPoint}/loans/admin/send-email/${selectedLoan._id}`,
      (data) => {
        setActionLoading(false);
        alert("Applicant email sent successfully!");
        setShowEmailModal(false);
      },
      (message) => {
        setActionLoading(false);
        alert("Error: " + message);
      },
      "POST",
      emailData,
      token
    );
  };

  const handleReviewLoan = () => {
    if (!reviewData.comments) {
      alert("Please add review comments");
      return;
    }

    if (reviewData.action === "approve" && !reviewData.creditScore) {
      alert("Please enter a credit score");
      return;
    }

    setActionLoading(true);
    const url =
      reviewData.action === "approve"
        ? `${developmentApiEntryPoint}/loans/admin/approve/${selectedLoan._id}`
        : `${developmentApiEntryPoint}/loans/admin/reject/${selectedLoan._id}`;

    const payload =
      reviewData.action === "approve"
        ? {
            comments: reviewData.comments,
            creditScore: parseInt(reviewData.creditScore),
            disbursalMethod: reviewData.disbursalMethod,
          }
        : {
            comments: reviewData.comments,
          };

    fetchData(
      url,
      (data) => {
        setActionLoading(false);
        alert(
          `Loan ${reviewData.action === "approve" ? "approved" : "rejected"} successfully!`
        );
        setShowReviewModal(false);
        fetchLoans();
        fetchStats();
      },
      (message) => {
        setActionLoading(false);
        alert("Error: " + message);
      },
      "POST",
      payload,
      token
    );
  };

  const handleDisburseLoan = () => {
    if (!disburseData.transactionId) {
      alert("Please enter transaction ID");
      return;
    }

    setActionLoading(true);
    fetchData(
      `${developmentApiEntryPoint}/loans/admin/disburse/${selectedLoan._id}`,
      (data) => {
        setActionLoading(false);
        alert("Loan disbursed successfully!");
        setShowDisburseModal(false);
        fetchLoans();
        fetchStats();
      },
      (message) => {
        setActionLoading(false);
        alert("Error: " + message);
      },
      "POST",
      disburseData,
      token
    );
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <Header />
      <PageContainer>
        <Container>
          <Row className="mb-4">
            <Col>
              <h2 style={{ color: "#333", fontWeight: "bold" }}>
                🏦 Loan Management Dashboard
              </h2>
            </Col>
          </Row>

          {/* Statistics Cards */}
          <Row className="mb-4">
            <Col md={6} lg={3}>
              <StatsCard color="#1abc9c">
                <Card.Body>
                  <div className="stat-label">Total Loans</div>
                  <div className="stat-value">{stats.totalLoans || 0}</div>
                </Card.Body>
              </StatsCard>
            </Col>
            <Col md={6} lg={3}>
              <StatsCard color="#f39c12">
                <Card.Body>
                  <div className="stat-label">Pending Review</div>
                  <div className="stat-value">{stats.pendingLoans || 0}</div>
                </Card.Body>
              </StatsCard>
            </Col>
            <Col md={6} lg={3}>
              <StatsCard color="#1abc9c">
                <Card.Body>
                  <div className="stat-label">Disbursed</div>
                  <div className="stat-value">{stats.disbursedLoans || 0}</div>
                </Card.Body>
              </StatsCard>
            </Col>
            <Col md={6} lg={3}>
              <StatsCard color="#27ae60">
                <Card.Body>
                  <div className="stat-label">Total Amount</div>
                  <div className="stat-value" style={{ fontSize: "1.3rem" }}>
                    ${((stats.totalLoanAmount || 0)).toLocaleString()}
                  </div>
                </Card.Body>
              </StatsCard>
            </Col>
          </Row>

          {/* Loans Table */}
          <Tabs
            activeKey={activeTab}
            onSelect={handleTabChange}
            className="mb-3"
          >
            <Tab eventKey="all" title={`All Loans (${stats.totalLoans || 0})`}>
              {loading ? (
                <div className="text-center" style={{ padding: "50px" }}>
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : loans.length === 0 ? (
                <Alert variant="info">No loans found</Alert>
              ) : (
                <TableWrapper>
                  <Table striped hover>
                    <thead>
                      <tr style={{ backgroundColor: "#1abc9c", color: "white" }}>
                        <th>Loan ID</th>
                        <th>Applicant</th>
                        <th>Phone</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Applied Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loans.map((loan) => (
                        <tr key={loan._id}>
                          <td>
                            <strong>
                              {loan._id.slice(-6).toUpperCase()}
                            </strong>
                          </td>
                          <td>{loan.userId?.name || "N/A"}</td>
                          <td>{loan.applicant.phoneNumber}</td>
                          <td>${loan.loanAmount.toLocaleString()}</td>
                          <td>
                            <Badge bg={getStatusColor(loan.status)}>
                              {loan.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td>
                            {new Date(loan.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <ActionButton
                              variant="info"
                              size="sm"
                              onClick={() => handleShowDetailsModal(loan)}
                            >
                              Details
                            </ActionButton>
                            {loan.status === "pending" && (
                              <ActionButton
                                variant="warning"
                                size="sm"
                                onClick={() => handleShowReviewModal(loan)}
                              >
                                Review
                              </ActionButton>
                            )}
                            {loan.status === "approved" && (
                              <ActionButton
                                variant="success"
                                size="sm"
                                onClick={() => handleShowDisburseModal(loan)}
                              >
                                Disburse
                              </ActionButton>
                            )}
                            <ActionButton
                              variant="primary"
                              size="sm"
                              onClick={() => handleShowEmailModal(loan)}
                            >
                              Email
                            </ActionButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </TableWrapper>
              )}
            </Tab>

            <Tab
              eventKey="pending"
              title={`Pending (${stats.pendingLoans || 0})`}
            >
              {loading ? (
                <div className="text-center" style={{ padding: "50px" }}>
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : loans.length === 0 ? (
                <Alert variant="info">No pending loans</Alert>
              ) : (
                <TableWrapper>
                  <Table striped hover>
                    <thead>
                      <tr style={{ backgroundColor: "#1abc9c", color: "white" }}>
                        <th>Loan ID</th>
                        <th>Applicant</th>
                        <th>Amount</th>
                        <th>Applied Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loans.map((loan) => (
                        <tr key={loan._id}>
                          <td>
                            <strong>
                              {loan._id.slice(-6).toUpperCase()}
                            </strong>
                          </td>
                          <td>{loan.userId?.name || "N/A"}</td>
                          <td>${loan.loanAmount.toLocaleString()}</td>
                          <td>
                            {new Date(loan.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <ActionButton
                              variant="info"
                              size="sm"
                              onClick={() => handleShowDetailsModal(loan)}
                            >
                              Details
                            </ActionButton>
                            <ActionButton
                              variant="warning"
                              size="sm"
                              onClick={() => handleShowReviewModal(loan)}
                            >
                              Review
                            </ActionButton>
                            <ActionButton
                              variant="primary"
                              size="sm"
                              onClick={() => handleShowEmailModal(loan)}
                            >
                              Email
                            </ActionButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </TableWrapper>
              )}
            </Tab>

            <Tab
              eventKey="approved"
              title={`Approved (${stats.approvedLoans || 0})`}
            >
              {loading ? (
                <div className="text-center" style={{ padding: "50px" }}>
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : loans.length === 0 ? (
                <Alert variant="info">No approved loans</Alert>
              ) : (
                <TableWrapper>
                  <Table striped hover>
                    <thead>
                      <tr style={{ backgroundColor: "#1abc9c", color: "white" }}>
                        <th>Loan ID</th>
                        <th>Applicant</th>
                        <th>Amount</th>
                        <th>Approved Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loans.map((loan) => (
                        <tr key={loan._id}>
                          <td>
                            <strong>
                              {loan._id.slice(-6).toUpperCase()}
                            </strong>
                          </td>
                          <td>{loan.userId?.name || "N/A"}</td>
                          <td>${loan.loanAmount.toLocaleString()}</td>
                          <td>
                            {loan.adminReview?.reviewDate
                              ? new Date(
                                  loan.adminReview.reviewDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td>
                            <ActionButton
                              variant="info"
                              size="sm"
                              onClick={() => handleShowDetailsModal(loan)}
                            >
                              Details
                            </ActionButton>
                            <ActionButton
                              variant="success"
                              size="sm"
                              onClick={() => handleShowDisburseModal(loan)}
                            >
                              Disburse
                            </ActionButton>
                            <ActionButton
                              variant="primary"
                              size="sm"
                              onClick={() => handleShowEmailModal(loan)}
                            >
                              Email
                            </ActionButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </TableWrapper>
              )}
            </Tab>

            <Tab
              eventKey="disbursed"
              title={`Disbursed (${stats.disbursedLoans || 0})`}
            >
              {loading ? (
                <div className="text-center" style={{ padding: "50px" }}>
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : loans.length === 0 ? (
                <Alert variant="info">No disbursed loans</Alert>
              ) : (
                <TableWrapper>
                  <Table striped hover>
                    <thead>
                      <tr style={{ backgroundColor: "#1abc9c", color: "white" }}>
                        <th>Loan ID</th>
                        <th>Applicant</th>
                        <th>Amount</th>
                        <th>Disbursed Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loans.map((loan) => (
                        <tr key={loan._id}>
                          <td>
                            <strong>
                              {loan._id.slice(-6).toUpperCase()}
                            </strong>
                          </td>
                          <td>{loan.userId?.name || "N/A"}</td>
                          <td>${loan.loanAmount.toLocaleString()}</td>
                          <td>
                            {loan.disbursalDetails?.disbursalDate
                              ? new Date(
                                  loan.disbursalDetails.disbursalDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td>
                            <ActionButton
                              variant="info"
                              size="sm"
                              onClick={() => handleShowDetailsModal(loan)}
                            >
                              Details
                            </ActionButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </TableWrapper>
              )}
            </Tab>
          </Tabs>
        </Container>
      </PageContainer>

      {/* Review Modal */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>📋 Review Loan Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLoan && (
            <>
              <Alert variant="info">
                <strong>Loan Amount:</strong> ${" "}
                {selectedLoan.loanAmount.toLocaleString()}
              </Alert>

              <h6 style={{ color: "#1abc9c", marginBottom: "15px" }}>
                Applicant Receiving Details
              </h6>
              {selectedLoan.bankDetails ? (
                <Table striped size="sm">
                  <tbody>
                    <tr><td><strong>Method:</strong></td><td>Bank</td></tr>
                    <tr><td><strong>Bank Name:</strong></td><td>{selectedLoan.bankDetails?.bankName || "N/A"}</td></tr>
                    <tr><td><strong>Account Holder:</strong></td><td>{selectedLoan.bankDetails?.accountHolderName || "N/A"}</td></tr>
                    <tr><td><strong>Account Number:</strong></td><td>{selectedLoan.bankDetails?.accountNumber || "N/A"}</td></tr>
                  </tbody>
                </Table>
              ) : selectedLoan.walletAddress ? (
                <Table striped size="sm">
                  <tbody>
                    <tr><td><strong>Method:</strong></td><td>Crypto</td></tr>
                    <tr><td><strong>Coin:</strong></td><td>{selectedLoan.walletAddress?.coinType || "N/A"}</td></tr>
                    <tr><td><strong>Wallet Address:</strong></td><td>{selectedLoan.walletAddress?.address || "N/A"}</td></tr>
                  </tbody>
                </Table>
              ) : (
                <Alert variant="warning">No bank or crypto receiving details were provided.</Alert>
              )}

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Action</Form.Label>
                  <Form.Select
                    value={reviewData.action}
                    onChange={(e) =>
                      setReviewData({
                        ...reviewData,
                        action: e.target.value,
                      })
                    }
                  >
                    <option value="approve">Approve</option>
                    <option value="reject">Reject</option>
                  </Form.Select>
                </Form.Group>

                {reviewData.action === "approve" && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Credit Score</Form.Label>
                      <Form.Control
                        type="number"
                        value={reviewData.creditScore}
                        onChange={(e) =>
                          setReviewData({
                            ...reviewData,
                            creditScore: e.target.value,
                          })
                        }
                        placeholder="Enter credit score (0-1000)"
                        min="0"
                        max="1000"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Admin Disbursal Method</Form.Label>
                      <Form.Select
                        value={reviewData.disbursalMethod}
                        onChange={(e) =>
                          setReviewData({
                            ...reviewData,
                            disbursalMethod: e.target.value,
                          })
                        }
                      >
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="wallet_transfer">Wallet Transfer</option>
                        <option value="cash">Cash</option>
                      </Form.Select>
                    </Form.Group>
                  </>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Review Comments</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={reviewData.comments}
                    onChange={(e) =>
                      setReviewData({
                        ...reviewData,
                        comments: e.target.value,
                      })
                    }
                    placeholder="Enter your review comments"
                  />
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowReviewModal(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            variant={reviewData.action === "approve" ? "success" : "danger"}
            onClick={handleReviewLoan}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              `${reviewData.action === "approve" ? "Approve" : "Reject"} Loan`
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Disburse Modal */}
      <Modal
        show={showDisburseModal}
        onHide={() => setShowDisburseModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>💰 Disburse Loan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLoan && (
            <>
              <Alert variant="success">
                <strong>Loan Amount:</strong> ${" "}
                {selectedLoan.loanAmount.toLocaleString()}
              </Alert>

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Transaction ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={disburseData.transactionId}
                    onChange={(e) =>
                      setDisburseData({
                        ...disburseData,
                        transactionId: e.target.value,
                      })
                    }
                    placeholder="Enter transaction reference number"
                  />
                  <Form.Text className="text-muted">
                    This ID will be recorded for verification purposes
                  </Form.Text>
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDisburseModal(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleDisburseLoan}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Disbursing...
              </>
            ) : (
              "Disburse Loan"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Email Modal */}
      <Modal
        show={showEmailModal}
        onHide={() => setShowEmailModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>✉️ Send Email to Loan Applicant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLoan && (
            <>
              <Alert variant="info">
                Sending to: <strong>{selectedLoan.userId?.name || "Applicant"}</strong> ({selectedLoan.userId?.email || "No email"})
              </Alert>

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    value={emailData.subject}
                    onChange={(e) =>
                      setEmailData({ ...emailData, subject: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    value={emailData.message}
                    onChange={(e) =>
                      setEmailData({ ...emailData, message: e.target.value })
                    }
                    placeholder="Write the message to send to the applicant..."
                  />
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowEmailModal(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSendApplicantEmail}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Sending...
              </>
            ) : (
              "Send Email"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>📄 Loan Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLoan && (
            <>
              <h6 style={{ color: "#1abc9c", marginBottom: "15px" }}>
                Loan Information
              </h6>
              <Table striped size="sm">
                <tbody>
                  <tr>
                    <td>
                      <strong>Loan Amount:</strong>
                    </td>
                    <td>${selectedLoan.loanAmount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Status:</strong>
                    </td>
                    <td>
                      <Badge bg={getStatusColor(selectedLoan.status)}>
                        {selectedLoan.status.toUpperCase()}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Monthly Payment:</strong>
                    </td>
                    <td>${selectedLoan.monthlyPayment.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Repayment Period:</strong>
                    </td>
                    <td>{selectedLoan.repaymentPeriod} months</td>
                  </tr>
                </tbody>
              </Table>

              <h6
                style={{
                  color: "#1abc9c",
                  marginBottom: "15px",
                  marginTop: "20px",
                }}
              >
                Applicant Information
              </h6>
              <Table striped size="sm">
                <tbody>
                  <tr>
                    <td>
                      <strong>Phone:</strong>
                    </td>
                    <td>{selectedLoan.applicant.phoneNumber}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>ID Type:</strong>
                    </td>
                    <td>
                      {selectedLoan.applicant.idType
                        .replace("_", " ")
                        .toUpperCase()}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>ID Document:</strong>
                    </td>
                    <td>
                      <DocumentPreview
                        url={selectedLoan.applicant.idImageUrl}
                        alt="Applicant ID document"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Utility Bill:</strong>
                    </td>
                    <td>
                      <DocumentPreview
                        url={selectedLoan.applicant.utilityBillImageUrl}
                        alt="Applicant utility bill"
                      />
                    </td>
                  </tr>
                </tbody>
              </Table>

              {selectedLoan.bankDetails ? (
                <>
                  <h6
                    style={{
                      color: "#1abc9c",
                      marginBottom: "15px",
                      marginTop: "20px",
                    }}
                  >
                    Bank Details
                  </h6>
                  <Table striped size="sm">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Bank Name:</strong>
                        </td>
                        <td>{selectedLoan.bankDetails?.bankName || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Account Holder:</strong>
                        </td>
                        <td>{selectedLoan.bankDetails?.accountHolderName || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Account Number:</strong>
                        </td>
                        <td>{selectedLoan.bankDetails?.accountNumber || "N/A"}</td>
                      </tr>
                    </tbody>
                  </Table>
                </>
              ) : selectedLoan.walletAddress ? (
                <>
                  <h6
                    style={{
                      color: "#1abc9c",
                      marginBottom: "15px",
                      marginTop: "20px",
                    }}
                  >
                    Crypto Wallet Details
                  </h6>
                  <Table striped size="sm">
                    <tbody>
                      <tr>
                        <td><strong>Coin:</strong></td>
                        <td>{selectedLoan.walletAddress?.coinType || "N/A"}</td>
                      </tr>
                      <tr>
                        <td><strong>Wallet Address:</strong></td>
                        <td>{selectedLoan.walletAddress?.address || "N/A"}</td>
                      </tr>
                    </tbody>
                  </Table>
                </>
              ) : (
                <Alert variant="warning">No bank or crypto details provided</Alert>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>

      <Footer />
    </>
  );
};

export default AdminLoanManagement;
