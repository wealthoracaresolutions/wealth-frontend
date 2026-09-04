import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
  Card,
  ProgressBar,
} from "react-bootstrap";
import styled from "styled-components";
import Header from "../components/header";
import Footer from "../components/footer";
import uploadFileToCloudinary from "../upload";
import fetchData from "../fetchData";
import { developmentApiEntryPoint } from "./register";
import { useNavigate } from "react-router-dom";
import ButtonSpinner from "../components/buttonspinner";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7ff 0%, #eaf0ff 100%);
  padding: 40px 20px;
`;

const FormCard = styled(Card)`
  border: none;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const FormSectionTitle = styled.h4`
  color: #1abc9c;
  font-weight: bold;
  margin-top: 30px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 3px solid #1abc9c;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  align-items: center;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;

  .step-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${(props) => (props.active ? "#1abc9c" : "#ddd")};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-bottom: 10px;
    transition: all 0.3s ease;
  }

  .step-label {
    font-size: 0.85rem;
    text-align: center;
    color: ${(props) => (props.active ? "#1abc9c" : "#999")};
    font-weight: ${(props) => (props.active ? "bold" : "normal")};
  }

  &:not(:last-child)::after {
    content: "";
    width: 30px;
    height: 2px;
    background: #ddd;
    margin: -30px 10px 0 10px;
  }
`;

const FileUploadArea = styled.div`
  border: 2px dashed #1abc9c;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  background: rgba(26, 188, 156, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(26, 188, 156, 0.1);
    border-color: #16a085;
  }

  input[type="file"] {
    display: none;
  }

  p {
    margin: 0;
    color: #1abc9c;
    font-weight: 500;
  }

  .file-name {
    margin-top: 10px;
    color: #28a745;
    font-size: 0.9rem;
  }
`;

const SummaryBox = styled(Card)`
  background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
  color: white;
  border: none;
  margin-top: 30px;

  .card-body {
    padding: 25px;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  .label {
    font-weight: 600;
  }

  .value {
    font-weight: bold;
    font-size: 1.1rem;
  }
`;

const ApplyLoanPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("support_token");

  const [formStep, setFormStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    loanAmount: "",
    repaymentPeriod: 12,
    phoneNumber: "",
    idType: "national_id",
    idImageUrl: "",
    utilityBillImageUrl: "",
    paymentMethod: "bank",
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
    swiftCode: "",
    walletCoinType: "",
    walletAddress: "",
  });

  const [loanSummary, setLoanSummary] = useState({
    monthlyPayment: 0,
    totalRepaymentAmount: 0,
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (formData.loanAmount && formData.repaymentPeriod) {
      calculateLoan();
    }
  }, [formData.loanAmount, formData.repaymentPeriod]);

  const calculateLoan = () => {
    const principal = parseFloat(formData.loanAmount);
    const months = parseInt(formData.repaymentPeriod);
    const interestRate = 5; // 5% per annum
    const monthlyRate = interestRate / 100 / 12;

    if (monthlyRate === 0) {
      const monthlyPayment = principal / months;
      setLoanSummary({
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalRepaymentAmount: Math.round(monthlyPayment * months * 100) / 100,
      });
    } else {
      const monthlyPayment =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
        (Math.pow(1 + monthlyRate, months) - 1);
      setLoanSummary({
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalRepaymentAmount: Math.round(monthlyPayment * months * 100) / 100,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const triggerFileInput = (field) => {
    const fileInput = document.getElementById(field);
    if (fileInput) {
      fileInput.click();
    }
  };

  const onFileSelected = (e, field, apiField) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      alert("Only image files are allowed for this upload.");
      e.target.value = "";
      return;
    }

    setUploadLoading(true);
    uploadFileToCloudinary(file, null, (url) => {
      setFormData((prev) => ({
        ...prev,
        [apiField]: url,
      }));
      setUploadLoading(false);
    }, setUploadLoading);
  };

  const validateStep = (step) => {
    const errArray = [];

    if (step === 1) {
      if (!formData.loanAmount || formData.loanAmount < 1000) {
        errArray.push("Loan amount must be at least $1,000");
      }
      if (formData.loanAmount > 1000000) {
        errArray.push("Loan amount cannot exceed $1,000,000");
      }
      if (!formData.repaymentPeriod) {
        errArray.push("Please select a repayment period");
      }
    }

    if (step === 2) {
      if (!formData.phoneNumber) {
        errArray.push("Phone number is required");
      }
      if (!formData.idType) {
        errArray.push("Please select ID type");
      }
      if (!formData.idImageUrl) {
        errArray.push("ID document is required");
      }
      if (!formData.utilityBillImageUrl) {
        errArray.push("Utility bill document is required");
      }
    }

    if (step === 3) {
      if (!formData.paymentMethod) {
        errArray.push("Please select a receiving method");
      }

      if (formData.paymentMethod === "bank") {
        if (!formData.bankName) {
          errArray.push("Bank name is required");
        }
        if (!formData.accountNumber) {
          errArray.push("Account number is required");
        }
        if (!formData.accountHolderName) {
          errArray.push("Account holder name is required");
        }
      }

      if (formData.paymentMethod === "crypto") {
        if (!formData.walletCoinType) {
          errArray.push("Please select a cryptocurrency type");
        }
        if (!formData.walletAddress) {
          errArray.push("Wallet address is required");
        }
      }
    }

    setErrors(errArray);
    return errArray.length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(formStep)) {
      setFormStep(formStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setFormStep(formStep - 1);
    setErrors([]);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      return;
    }

    setLoading(true);
    const bankDetails =
      formData.paymentMethod === "bank"
        ? {
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            accountHolderName: formData.accountHolderName,
            swiftCode: formData.swiftCode,
          }
        : null;

    const walletAddress =
      formData.paymentMethod === "crypto" && formData.walletCoinType && formData.walletAddress
        ? {
            coinType: formData.walletCoinType,
            address: formData.walletAddress,
          }
        : null;

    const loanPayload = {
      loanAmount: parseFloat(formData.loanAmount),
      repaymentPeriod: parseInt(formData.repaymentPeriod),
      applicant: {
        phoneNumber: formData.phoneNumber,
        idType: formData.idType,
        idImageUrl: formData.idImageUrl,
        utilityBillImageUrl: formData.utilityBillImageUrl,
      },
      bankDetails,
      walletAddress,
    };

    fetchData(
      `${developmentApiEntryPoint}/loans/apply`,
      (data) => {
        setLoading(false);
        setSuccessMessage("Loan application submitted successfully!");
        setTimeout(() => {
          navigate("/loan-dashboard");
        }, 2000);
      },
      (message) => {
        setLoading(false);
        setErrors([message]);
      },
      "POST",
      loanPayload,
      token
    );
  };

  return (
    <>
      <Header />
      <PageContainer>
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <FormCard>
                <Card.Body className="p-40">
                  {/* Step Indicator */}
                  <StepIndicator>
                    <Step active={formStep >= 1}>
                      <div className="step-number">1</div>
                      <div className="step-label">Loan Details</div>
                    </Step>
                    <Step active={formStep >= 2}>
                      <div className="step-number">2</div>
                      <div className="step-label">Personal Info</div>
                    </Step>
                    <Step active={formStep >= 3}>
                      <div className="step-number">3</div>
                      <div className="step-label">Payment Details</div>
                    </Step>
                  </StepIndicator>

                  {/* Error Messages */}
                  {errors.length > 0 && (
                    <Alert variant="danger" className="mb-4">
                      <ul className="mb-0">
                        {errors.map((err, idx) => (
                          <li key={idx}>{err}</li>
                        ))}
                      </ul>
                    </Alert>
                  )}

                  {/* Success Message */}
                  {successMessage && (
                    <Alert variant="success" className="mb-4">
                      {successMessage}
                    </Alert>
                  )}

                  {/* Step 1: Loan Details */}
                  {formStep === 1 && (
                    <>
                      <FormSectionTitle>Loan Details</FormSectionTitle>
                      <Form>
                        <Form.Group className="mb-4">
                          <Form.Label>
                            Loan Amount ($) <span style={{ color: "red" }}>*</span>
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="loanAmount"
                            value={formData.loanAmount}
                            onChange={handleInputChange}
                            placeholder="Enter amount between 1,000 - 1,000,000"
                            min="1000"
                            max="1000000"
                          />
                          <Form.Text className="text-muted">
                            Minimum: $1,000 | Maximum: $1,000,000
                          </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label>
                            Repayment Period (Months) <span style={{ color: "red" }}>*</span>
                          </Form.Label>
                          <Form.Select
                            name="repaymentPeriod"
                            value={formData.repaymentPeriod}
                            onChange={handleInputChange}
                          >
                            <option value="12">12 Months</option>
                            <option value="24">24 Months</option>
                            <option value="36">36 Months</option>
                            <option value="48">48 Months</option>
                            <option value="60">60 Months</option>
                          </Form.Select>
                        </Form.Group>

                        {/* Loan Summary */}
                        {formData.loanAmount && (
                          <SummaryBox>
                            <Card.Body>
                              <h5 style={{ marginBottom: "20px" }}>Loan Summary</h5>
                              <SummaryRow>
                                <span className="label">Loan Amount:</span>
                                <span className="value">
                                  ${parseFloat(formData.loanAmount).toLocaleString()}
                                </span>
                              </SummaryRow>
                              <SummaryRow>
                                <span className="label">Interest Rate:</span>
                                <span className="value">5% per annum</span>
                              </SummaryRow>
                              <SummaryRow>
                                <span className="label">Repayment Period:</span>
                                <span className="value">
                                  {formData.repaymentPeriod} months
                                </span>
                              </SummaryRow>
                              <SummaryRow>
                                <span className="label">Monthly Payment:</span>
                                <span className="value">
                                  ${loanSummary.monthlyPayment.toLocaleString()}
                                </span>
                              </SummaryRow>
                              <SummaryRow>
                                <span className="label">Total Repayment:</span>
                                <span className="value">
                                  ${loanSummary.totalRepaymentAmount.toLocaleString()}
                                </span>
                              </SummaryRow>
                            </Card.Body>
                          </SummaryBox>
                        )}
                      </Form>
                    </>
                  )}

                  {/* Step 2: Personal Information */}
                  {formStep === 2 && (
                    <>
                      <FormSectionTitle>Personal Information</FormSectionTitle>
                      <Form>
                        <Form.Group className="mb-4">
                          <Form.Label>
                            Phone Number <span style={{ color: "red" }}>*</span>
                          </Form.Label>
                          <Form.Control
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                          />
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label>
                            ID Type <span style={{ color: "red" }}>*</span>
                          </Form.Label>
                          <Form.Select
                            name="idType"
                            value={formData.idType}
                            onChange={handleInputChange}
                          >
                            <option value="national_id">National ID</option>
                            <option value="passport">Passport</option>
                            <option value="driving_license">Driving License</option>
                          </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label>
                            Upload ID Document <span style={{ color: "red" }}>*</span>
                          </Form.Label>
                          <FileUploadArea
                            onClick={() => triggerFileInput("idFile")}
                          >
                            <input
                              type="file"
                              id="idFile"
                              accept="image/*"
                              onChange={(e) =>
                                onFileSelected(e, "idFile", "idImageUrl")
                              }
                            />
                            {uploadLoading ? (
                              <div>
                                <Spinner animation="border" size="sm" />
                                <p>Uploading...</p>
                              </div>
                            ) : formData.idImageUrl ? (
                              <div className="file-name">✓ Document uploaded</div>
                            ) : (
                              <div>
                                <p>📄 Click to upload ID document</p>
                                <small>Supported: Images only</small>
                              </div>
                            )}
                          </FileUploadArea>
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label>
                            Upload Utility Bill <span style={{ color: "red" }}>*</span>
                          </Form.Label>
                          <FileUploadArea
                            onClick={() => triggerFileInput("billFile")}
                          >
                            <input
                              type="file"
                              id="billFile"
                              accept="image/*"
                              onChange={(e) =>
                                onFileSelected(e, "billFile", "utilityBillImageUrl")
                              }
                            />
                            {uploadLoading ? (
                              <div>
                                <Spinner animation="border" size="sm" />
                                <p>Uploading...</p>
                              </div>
                            ) : formData.utilityBillImageUrl ? (
                              <div className="file-name">✓ Utility bill uploaded</div>
                            ) : (
                              <div>
                                <p>📋 Click to upload utility bill</p>
                                <small>Image proof of residence required</small>
                              </div>
                            )}
                          </FileUploadArea>
                        </Form.Group>
                      </Form>
                    </>
                  )}

                  {/* Step 3: Payment Details */}
                  {formStep === 3 && (
                    <>
                      <FormSectionTitle>Payment Details</FormSectionTitle>
                      <Form>
                        <Form.Group className="mb-4">
                          <Form.Label>
                            Receive Funds Via <span style={{ color: "red" }}>*</span>
                          </Form.Label>
                          <Form.Select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleInputChange}
                          >
                            <option value="bank">Bank Transfer</option>
                            <option value="crypto">Crypto Wallet</option>
                          </Form.Select>
                        </Form.Group>

                        {formData.paymentMethod === "bank" ? (
                          <>
                            <h6 style={{ color: "#1abc9c", marginBottom: "20px" }}>
                              Bank Account Details
                            </h6>
                            <Form.Group className="mb-4">
                              <Form.Label>
                                Bank Name <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleInputChange}
                                placeholder="Enter bank name"
                              />
                            </Form.Group>

                            <Form.Group className="mb-4">
                              <Form.Label>
                                Account Number <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleInputChange}
                                placeholder="Enter account number"
                              />
                            </Form.Group>

                            <Form.Group className="mb-4">
                              <Form.Label>
                                Account Holder Name <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="accountHolderName"
                                value={formData.accountHolderName}
                                onChange={handleInputChange}
                                placeholder="Enter account holder name"
                              />
                            </Form.Group>

                            <Form.Group className="mb-4">
                              <Form.Label>SWIFT Code (Optional)</Form.Label>
                              <Form.Control
                                type="text"
                                name="swiftCode"
                                value={formData.swiftCode}
                                onChange={handleInputChange}
                                placeholder="Enter SWIFT code"
                              />
                            </Form.Group>
                          </>
                        ) : (
                          <>
                            <h6 style={{ color: "#1abc9c", marginBottom: "20px" }}>
                              Crypto Wallet Details
                            </h6>
                            <Form.Group className="mb-4">
                              <Form.Label>
                                Cryptocurrency Type <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                              <Form.Select
                                name="walletCoinType"
                                value={formData.walletCoinType}
                                onChange={handleInputChange}
                              >
                                <option value="">Select coin type</option>
                                <option value="ethereum">Ethereum</option>
                                <option value="bitcoin">Bitcoin</option>
                                <option value="usdt">USDT</option>
                                <option value="dogecoin">Dogecoin</option>
                              </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-4">
                              <Form.Label>
                                Wallet Address <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="walletAddress"
                                value={formData.walletAddress}
                                onChange={handleInputChange}
                                placeholder="Enter wallet address"
                              />
                            </Form.Group>
                          </>
                        )}
                      </Form>
                    </>
                  )}

                  {/* Navigation Buttons */}
                  <div className="d-flex justify-content-between mt-5">
                    <Button
                      variant="outline-secondary"
                      onClick={handlePreviousStep}
                      disabled={formStep === 1}
                    >
                      ← Previous
                    </Button>

                    {formStep < 3 ? (
                      <Button
                        variant="primary"
                        onClick={handleNextStep}
                        style={{
                          background: "linear-gradient(135deg, #1abc9c 0%, #16a085 100%)",
                          border: "none",
                        }}
                      >
                        Next →
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        onClick={handleSubmit}
                        disabled={loading || uploadLoading}
                      >
                        {loading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Application"
                        )}
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </FormCard>
            </Col>
          </Row>
        </Container>
      </PageContainer>
      <Footer />
    </>
  );
};

export default ApplyLoanPage;
