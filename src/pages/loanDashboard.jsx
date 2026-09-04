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
  ProgressBar,
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
    font-size: 1.25rem;
    font-weight: 500;
    color: #333;
  }
`;

const LoanCard = styled(Card)`
  border: none;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  .card-header {
    background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
    color: white;
    border: none;
    padding: 20px;
  }

  .card-body {
    padding: 25px;
  }
`;

const StatusBadge = styled(Badge)`
  padding: 8px 12px;
  font-size: 0.85rem;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  .label {
    font-weight: 600;
    color: #666;
  }

  .value {
    color: #333;
    font-weight: 500;
  }
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

const LoanDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("support_token");

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amountPaid: "",
    paymentMethod: "bank",
    transactionId: "",
    bankDetails: { bankName: "" },
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchUserLoans();
    }
  }, [token, navigate]);

  const fetchUserLoans = () => {
    setLoading(true);
    fetchData(
      `${developmentApiEntryPoint}/loans/my-loans`,
      (data) => {
        setLoans(
          (data.result || []).map((loan) => ({
            ...loan,
            repaymentDetails: {
              amountRepaid: 0,
              remainingBalance: 0,
              paymentHistory: [],
              ...(loan.repaymentDetails || {}),
            },
          }))
        );
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

  const handleShowPaymentModal = (loan) => {
    if (loan.status !== "disbursed") {
      alert("Only disbursed loans can be paid");
      return;
    }
    setSelectedLoan(loan);
    setShowPaymentModal(true);
  };

  const handleShowDetailsModal = (loan) => {
    setSelectedLoan(loan);
    setShowDetailsModal(true);
  };

  const handleMakePayment = () => {
    const errors = [];
    if (!paymentData.amountPaid || parseFloat(paymentData.amountPaid) <= 0) {
      errors.push("Please enter a valid payment amount");
    }
    if (
      parseFloat(paymentData.amountPaid) >
      selectedLoan.repaymentDetails.remainingBalance
    ) {
      errors.push(
        `Payment cannot exceed remaining balance of $${selectedLoan.repaymentDetails.remainingBalance}`
      );
    }
    if (!paymentData.transactionId) {
      errors.push("Transaction ID is required");
    }
    if (paymentData.paymentMethod === "bank" && !paymentData.bankDetails.bankName) {
      errors.push("Bank name is required for bank payments");
    }

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    setPaymentLoading(true);
    fetchData(
      `${developmentApiEntryPoint}/loans/payment/${selectedLoan._id}`,
      (data) => {
        setPaymentLoading(false);
        alert("Payment recorded successfully!");
        setShowPaymentModal(false);
        setPaymentData({
          amountPaid: "",
          paymentMethod: "bank",
          transactionId: "",
          bankDetails: { bankName: "" },
        });
        fetchUserLoans();
      },
      (message) => {
        setPaymentLoading(false);
        alert("Error: " + message);
      },
      "POST",
      paymentData,
      token
    );
  };

  const getStats = () => {
    const stats = {
      totalLoans: loans.length,
      activeLoans: loans.filter((l) => l.status === "disbursed").length,
      totalBorrowed: loans.reduce((sum, l) => sum + l.loanAmount, 0),
      totalRepaid: loans.reduce((sum, l) => sum + l.repaymentDetails.amountRepaid, 0),
    };
    return stats;
  };

  const stats = getStats();

  return (
    <>
      <Header />
      <PageContainer>
        <Container>
          <Row className="mb-4">
            <Col>
              <h5 style={{ color: "#333", fontWeight: "bold" }}>
                📊 My Loans Dashboard
              </h5>
            </Col>
          </Row>

          {/* Statistics Cards */}
          <Row className="mb-4">
            <Col md={6} lg={3}>
              <StatsCard color="#1abc9c">
                <Card.Body>
                  <div className="stat-label">Total Loans</div>
                  <div className="stat-value">{stats.totalLoans}</div>
                </Card.Body>
              </StatsCard>
            </Col>
            <Col md={6} lg={3}>
              <StatsCard color="#1abc9c">
                <Card.Body>
                  <div className="stat-label">Active Loans</div>
                  <div className="stat-value">{stats.activeLoans}</div>
                </Card.Body>
              </StatsCard>
            </Col>
            <Col md={6} lg={3}>
              <StatsCard color="#f39c12">
                <Card.Body>
                  <div className="stat-label">Total Borrowed</div>
                  <div className="stat-value">
                    ${stats.totalBorrowed.toLocaleString()}
                  </div>
                </Card.Body>
              </StatsCard>
            </Col>
            <Col md={6} lg={3}>
              <StatsCard color="#27ae60">
                <Card.Body>
                  <div className="stat-label">Total Repaid</div>
                  <div className="stat-value">
                    ${stats.totalRepaid.toLocaleString()}
                  </div>
                </Card.Body>
              </StatsCard>
            </Col>
          </Row>

          {/* Apply for Loan Button */}
          <Row className="mb-4">
            <Col>
              <Button
                href="/apply-loan"
                style={{
                  background: "linear-gradient(135deg, #1abc9c 0%, #16a085 100%)",
                  border: "none",
                  padding: "12px 30px",
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
              >
                ➕ Apply for New Loan
              </Button>
            </Col>
          </Row>

          {/* Loans List */}
          {loading ? (
            <div className="text-center" style={{ padding: "50px" }}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : loans.length === 0 ? (
            <Card style={{ textAlign: "center", padding: "50px", border: "none" }}>
              <Card.Body>
                <h5>No loans yet</h5>
                <p className="text-muted">
                  You haven't applied for any loans yet. Click the button above to start!
                </p>
              </Card.Body>
            </Card>
          ) : (
            <Row>
              {loans.map((loan) => (
                <Col lg={6} key={loan._id} className="mb-4">
                  <LoanCard>
                    <Card.Header>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <h5 className="mb-0">
                          Loan #{loan._id.slice(-6).toUpperCase()}
                        </h5>
                        <StatusBadge bg={getStatusColor(loan.status)}>
                          {loan.status.toUpperCase()}
                        </StatusBadge>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <DetailRow>
                        <span className="label">Loan Amount:</span>
                        <span className="value">
                          ${loan.loanAmount.toLocaleString()}
                        </span>
                      </DetailRow>
                      <DetailRow>
                        <span className="label">Interest Rate:</span>
                        <span className="value">{loan.interestRate}% p.a.</span>
                      </DetailRow>
                      <DetailRow>
                        <span className="label">Monthly Payment:</span>
                        <span className="value">
                          ${loan.monthlyPayment.toLocaleString()}
                        </span>
                      </DetailRow>
                      <DetailRow>
                        <span className="label">Repayment Period:</span>
                        <span className="value">{loan.repaymentPeriod} months</span>
                      </DetailRow>
                      <DetailRow>
                        <span className="label">Total Repayment:</span>
                        <span className="value">
                          ${loan.totalRepaymentAmount.toLocaleString()}
                        </span>
                      </DetailRow>

                      {loan.status === "disbursed" && (
                        <>
                          <DetailRow>
                            <span className="label">Amount Paid:</span>
                            <span className="value">
                              ${loan.repaymentDetails.amountRepaid.toLocaleString()}
                            </span>
                          </DetailRow>
                          <DetailRow>
                            <span className="label">Remaining Balance:</span>
                            <span className="value" style={{ color: "#e74c3c" }}>
                              $
                              {loan.repaymentDetails.remainingBalance.toLocaleString()}
                            </span>
                          </DetailRow>
                          <div style={{ marginTop: "15px" }}>
                            <small className="text-muted">Repayment Progress</small>
                            <ProgressBar
                              now={
                                (loan.repaymentDetails.amountRepaid /
                                  loan.totalRepaymentAmount) *
                                100
                              }
                              style={{ height: "20px", marginTop: "8px" }}
                              label={`${Math.round(
                                (loan.repaymentDetails.amountRepaid /
                                  loan.totalRepaymentAmount) *
                                  100
                              )}%`}
                            />
                          </div>
                        </>
                      )}

                      <DetailRow style={{ marginTop: "15px" }}>
                        <span className="label">Applied:</span>
                        <span className="value">
                          {new Date(loan.createdAt).toLocaleDateString()}
                        </span>
                      </DetailRow>

                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "20px",
                        }}
                      >
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleShowDetailsModal(loan)}
                          style={{ flex: 1 }}
                        >
                          📋 Details
                        </Button>
                        {loan.status === "disbursed" && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleShowPaymentModal(loan)}
                            style={{ flex: 1 }}
                          >
                            💳 Make Payment
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </LoanCard>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </PageContainer>

      {/* Payment Modal */}
      <Modal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>💳 Make Loan Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLoan && (
            <>
              <Alert variant="info">
                <strong>Remaining Balance:</strong> $
                {selectedLoan.repaymentDetails.remainingBalance.toLocaleString()}
              </Alert>

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Amount ($</Form.Label>
                  <Form.Control
                    type="number"
                    value={paymentData.amountPaid}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        amountPaid: e.target.value,
                      })
                    }
                    placeholder="Enter amount to pay"
                    max={selectedLoan.repaymentDetails.remainingBalance}
                  />
                  <Form.Text className="text-muted">
                    Monthly payment: ${selectedLoan.monthlyPayment.toLocaleString()}
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Select
                    value={paymentData.paymentMethod}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        paymentMethod: e.target.value,
                      })
                    }
                  >
                    <option value="bank">Bank</option>
                    <option value="crypto">Crypto</option>
                    <option value="cash">Cash Payment</option>
                  </Form.Select>
                </Form.Group>

                {paymentData.paymentMethod === "bank" && (
                  <Form.Group className="mb-3">
                    <Form.Label>Bank Name</Form.Label>
                    <Form.Control
                      value={paymentData.bankDetails.bankName}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          bankDetails: { bankName: e.target.value },
                        })
                      }
                      placeholder="Enter bank name"
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Transaction ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={paymentData.transactionId}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        transactionId: e.target.value,
                      })
                    }
                    placeholder="Enter transaction reference number"
                  />
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPaymentModal(false)}
            disabled={paymentLoading}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleMakePayment}
            disabled={paymentLoading}
          >
            {paymentLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              "Confirm Payment"
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
                Applicant Information
              </h6>
              <DetailRow>
                <span className="label">Phone Number:</span>
                <span className="value">
                  {selectedLoan.applicant.phoneNumber}
                </span>
              </DetailRow>
              <DetailRow>
                <span className="label">ID Type:</span>
                <span className="value">
                  {selectedLoan.applicant.idType.replace("_", " ").toUpperCase()}
                </span>
              </DetailRow>

              {selectedLoan.bankDetails && (
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
                  <DetailRow>
                    <span className="label">Bank Name:</span>
                    <span className="value">
                      {selectedLoan.bankDetails?.bankName || "N/A"}
                    </span>
                  </DetailRow>
                  <DetailRow>
                    <span className="label">Account Holder:</span>
                    <span className="value">
                      {selectedLoan.bankDetails?.accountHolderName || "N/A"}
                    </span>
                  </DetailRow>
                  <DetailRow>
                    <span className="label">Account Number:</span>
                    <span className="value">
                      {selectedLoan.bankDetails?.accountNumber || "N/A"}
                    </span>
                  </DetailRow>
                </>
              )}

              {selectedLoan.status === "disbursed" && (
                <>
                  <h6
                    style={{
                      color: "#1abc9c",
                      marginBottom: "15px",
                      marginTop: "20px",
                    }}
                  >
                    Payment History
                  </h6>
                  {selectedLoan.repaymentDetails.paymentHistory.length > 0 ? (
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Method</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedLoan.repaymentDetails.paymentHistory.map(
                          (payment, idx) => (
                            <tr key={idx}>
                              <td>
                                {new Date(payment.paymentDate).toLocaleDateString()}
                              </td>
                              <td>${payment.amountPaid.toLocaleString()}</td>
                              <td>{payment.paymentMethod}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </Table>
                  ) : (
                    <p className="text-muted">No payments made yet</p>
                  )}
                </>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>

      <Footer />
    </>
  );
};

export default LoanDashboard;
