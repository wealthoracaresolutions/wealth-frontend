import React from "react";
import styled from "styled-components";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const LoanSection = styled.section`
  padding: 80px 20px;
  background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
  color: white;
  margin: 60px 0;
`;

const SectionTitle = styled.h5`
  font-size: 2.5rem;
   

  margin-bottom: 15px;
  text-align: center;
  font-family: "Montserrat", sans-serif;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 50px;
  opacity: 0.95;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const LoanCard = styled(Card)`
  border: none;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: white !important;
  color: #333 !important;
  height: 100%;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  .card-body {
    padding: 30px;
  }
`;

const CardIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #1abc9c;
`;

const CardTitle = styled.h5`
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
  font-size: 1.3rem;
`;

const CardText = styled.p`
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;
  color: #666;

  li {
    padding: 10px 0;
    padding-left: 25px;
    position: relative;
    font-size: 0.95rem;

    &:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #1abc9c;
      font-weight: bold;
      font-size: 1.2rem;
    }
  }
`;

const ApplyButton = styled(Link)`
  background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
  color: white !important;
  padding: 12px 30px !important;
  border-radius: 25px;
  text-decoration: none !important;
  font-weight: 600;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: inline-block;
  margin-top: 15px;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(26, 188, 156, 0.4);
  }
`;

const StatsSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 40px 20px;
  border-radius: 12px;
  margin-top: 50px;
  backdrop-filter: blur(10px);
`;

const StatItem = styled.div`
  text-align: center;
  margin: 20px;

  h4 {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 10px;
  }

  p {
    font-size: 1rem;
    opacity: 0.9;
  }
`;

const Loan = () => {
  const loanFeatures = [
    "Quick approval process",
    "Flexible repayment terms",
    "Competitive interest rates",
    "Minimal documentation",
    "Secure transactions",
    "24/7 customer support",
  ];

  const requirements = [
    {
      icon: "📱",
      title: "Phone Verification",
      description: "Verify your phone number for quick contact and updates",
    },
    {
      icon: "🆔",
      title: "ID Verification",
      description: "Upload a valid ID document (National ID, Passport, or Driving License)",
    },
    {
      icon: "📄",
      title: "Utility Bill",
      description: "Proof of residence - upload a recent utility bill",
    },
    {
      icon: "🏦",
      title: "Bank Details",
      description: "Provide bank account details or wallet address for disbursement",
    },
  ];

  return (
    <LoanSection>
      <Container>
        <SectionTitle>Quick Personal Loans</SectionTitle>
        <SectionSubtitle>
          Get approved for a loan in minutes with minimal hassle
        </SectionSubtitle>

        {/* Requirements Section */}
        <Row className="mb-5">
          {requirements.map((req, idx) => (
            <Col md={6} lg={3} key={idx} className="mb-4">
              <LoanCard>
                <Card.Body className="text-center">
                  <CardIcon>{req.icon}</CardIcon>
                  <CardTitle>{req.title}</CardTitle>
                  <CardText>{req.description}</CardText>
                </Card.Body>
              </LoanCard>
            </Col>
          ))}
        </Row>

        {/* Features & Stats Row */}
        <Row className="mt-5">
          <Col lg={6} className="mb-4">
            <LoanCard>
              <Card.Body>
                <h4 style={{ color: "#1abc9c", marginBottom: "20px" }}>
                  Why Choose Our Loans?
                </h4>
                <FeatureList>
                  {loanFeatures.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </FeatureList>
                <ApplyButton to="/apply-loan">
                  Apply Now for a Loan
                </ApplyButton>
              </Card.Body>
            </LoanCard>
          </Col>

          <Col lg={6} className="mb-4">
            <StatsSection>
              <h4 style={{ marginBottom: "30px" }}>Loan Details</h4>
              <Row>
                <Col xs={6} className="mb-3">
                  <StatItem>
                    <h4>5%</h4>
                    <p>Annual Interest Rate</p>
                  </StatItem>
                </Col>
                <Col xs={6} className="mb-3">
                  <StatItem>
                    <h4>12-60</h4>
                    <p>Months Repayment Term</p>
                  </StatItem>
                </Col>
                <Col xs={6}>
                  <StatItem>
                    <h4>$1M+</h4>
                    <p>Maximum Loan Amount</p>
                  </StatItem>
                </Col>
                <Col xs={6}>
                  <StatItem>
                    <h4>24hrs</h4>
                    <p>Approval Time</p>
                  </StatItem>
                </Col>
              </Row>
            </StatsSection>
          </Col>
        </Row>

        {/* CTA Section */}
        <Row className="mt-5 text-center">
          <Col>
            <h3 style={{ marginBottom: "30px" }}>Ready to Get Started?</h3>
            <ApplyButton to="/apply-loan" style={{ fontSize: "1.1rem", padding: "15px 40px" }}>
              Apply for a Loan Today
            </ApplyButton>
          </Col>
        </Row>
      </Container>
    </LoanSection>
  );
};

export default Loan;
