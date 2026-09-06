import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Footer from "../components/footer";

import { selectIsLogged, selectUserDetails } from "../state/slices/userSlice";
import { useSelector } from "react-redux";
import {
  Container,
  Navbar,
  Nav,
  Dropdown,
  Card,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import "./styles.css";
import responsive from "../responsive";
import fetchData from "../fetchData";
import { developmentApiEntryPoint } from "./register";
import Header from "../components/header";
export const logOut=(nav)=>{
window.localStorage.removeItem("support_token");
nav("/")
}
const ContentCon = styled.div`
  margin-top: 100px;
  ${responsive("tablet", { margint_top: "50px" })};
`;

const QuickLinksContainer = styled.div`
  margin-top: 40px;
  margin-bottom: 40px;
`;

const QuickLinksTitle = styled.h3`
  color: #1c1c1c;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

const QuickLinkButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  margin: 8px;
  background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
  color: white !important;
  text-decoration: none !important;
  border-radius: 8px;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 12px rgba(26, 188, 156, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(26, 188, 156, 0.4);
    color: white !important;
    text-decoration: none !important;
  }

  i {
    margin-right: 8px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
`;

const Dashboard = () => {
  const navigate = useNavigate()
  const [stats,setStats]= useState({})
  const [latestSignal, setLatestSignal] = useState(null)
  console.log(stats)
  const userIsLogged= useSelector(selectIsLogged);
  const userDetails=useSelector(selectUserDetails);
  useEffect(()=>{
    const token=localStorage.getItem("support_token")
    if(!token||!userIsLogged){
      navigate("/");
    }
    else{
      fetchData(
        `${developmentApiEntryPoint}/users/getstats`,
        (data)=>{
          setStats(data.result)
        },
        (message)=>{
          console.log(message)
          alert("An error occured")
          navigate("/")
        },
        "POST",
        {},
        token

      )
      fetchData(
        `${developmentApiEntryPoint}/trading-signals`,
        (data) => setLatestSignal(data.result[0] || null),
        (message) => console.log(message),
        "GET",
        undefined,
        token
      )
    }
    
  },[])
  console.log(userDetails)
  return (
    <Container fluid>
      {/* Navbar Start */}
     <Header/>
      <hr
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          position: "relative",
          top: "100px",
        }}
      />

      {/* Account Details Section */}
      <Container className="cardContent">
        <ContentCon>
          <h2 className="text-center mb-4">Account Details</h2>
          <Row>
            {[
              {
                title: "Balance",
                id: "balance",
                value: userDetails.balance.toFixed(2),
                percentage: "45%",
              },
              {
                title: "Last Deposit",
                id: "lastDeposit",
                value: userDetails.lastDeposit||0,
                percentage: "45%",
              },
              {
                title: "Active Deposits",
                id: "activedeposit",
                value: userDetails.activeDeposit.length,
                percentage: "45%",
              },
              {
                title: "Total Earnings",
                id: "earnings",
                value: userDetails.earnings.toFixed(2),
                percentage: "55%",
              },
              {
                title: "Referral Bonus",
                id: "ref",
                value: userDetails.referrallBonus||0,
                percentage: "7%",
              },
              {
                title: "Last Withdrawal",
                id: "lastWithdrawal",
                value:userDetails.lastWithdrawal||0 ,
                percentage: "7%",
              },
              {
                title: "Pending Withdrawal",
                id: "pendingWithdrawal",
                value: userDetails.pendingWithdrawal||0,
                percentage: "7%",
              },
            ].map((card, index) => (
              <Col xl={4} key={index} className="mb-4">
                <Card className="card-default">
                  <Card.Header>
                    <h2>{card.title}</h2>
                  </Card.Header>
                  <Card.Body>
                    <div className="bg-primary d-flex justify-content-between flex-wrap p-5 text-white align-items-lg-end">
                      <div className="d-flex flex-column">
                        <span className="h3 text-white" id={card.id}>
                          {card.title==="Active Deposits"?card.value:`$${card.value}`}
                        </span>
                      </div>
                      <div>
                        <span>{card.percentage}</span>
                        <i className="mdi mdi-arrow-up-bold"></i>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </ContentCon>
      </Container>

      {/* Total Stats Section */}
      <Container className="cardContent cardContent2">
        <h2 className="text-center mb-4">Total Stats</h2>
        <Row>
          {[
            {
              title: "Total Deposits",
              id: "totalDeposit",
              value: stats.totalDeposit||0,
              color: "bg-success",
            },
            {
              title: "Total Withdrawals",
              id: "totalWithdrawal",
              value: stats.totalWithrawal||0,
              color: "bg-success",
            },
          ].map((card, index) => (
            <Col xl={4} key={index} className="mb-4">
              <Card className="card-default">
                <Card.Header>
                  <h2 className="text-center">{card.title}</h2>
                </Card.Header>
                <Card.Body>
                  <div
                    className={`${card.color} d-flex justify-content-between flex-wrap p-5 text-white align-items-lg-end`}
                  >
                    <div className="d-flex flex-column">
                      <span className="h3 text-white" id={card.id}>
                        ${card.value}
                      </span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Quick Links Section */}
      <Container className="cardContent">
        <Card className="mb-4 shadow-sm border-0">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
              <div>
                <p className="text-uppercase text-muted mb-1">Market updates</p>
                <h3 className="mb-1">Latest trading signal</h3>
              </div>
              <Button as={Link} to="/trading-signals" variant="success">More trading signals</Button>
            </div>
            {latestSignal ? (
              <Row className="align-items-center g-3">
                <Col md={4}><img src={latestSignal.imageUrl} alt={latestSignal.title} className="img-fluid rounded" style={{ maxHeight: "220px", width: "100%", objectFit: "cover" }} /></Col>
                <Col md={8}><h4>{latestSignal.title}</h4><p className="text-muted">{latestSignal.description}</p><small className="text-muted">Posted {new Date(latestSignal.createdAt).toLocaleString()}</small></Col>
              </Row>
            ) : <p className="text-muted mb-0">No trading signals have been posted yet.</p>}
          </Card.Body>
        </Card>
        <QuickLinksContainer>
          <QuickLinksTitle>Quick Links - Manage Your Accounts</QuickLinksTitle>
          <ButtonGroup>
            <QuickLinkButton to="/invest">
              <i className="bi bi-graph-up"></i> Invest
            </QuickLinkButton>
            <QuickLinkButton to="/withdraw">
              <i className="bi bi-cash-out"></i> Withdraw
            </QuickLinkButton>
            <QuickLinkButton to="/loan-dashboard">
              <i className="bi bi-bank"></i> My Loans
            </QuickLinkButton>
            <QuickLinkButton to="/healthinsurance">
              <i className="bi bi-heart-pulse"></i> Health Insurance
            </QuickLinkButton>
            <QuickLinkButton to="/medicalsupport">
              <i className="bi bi-hospital"></i> Medical Support
            </QuickLinkButton>
            <QuickLinkButton to="/covid19benefits">
              <i className="bi bi-shield-check"></i> COVID-19 Benefits
            </QuickLinkButton>
            <QuickLinkButton to="/travelandexpense">
              <i className="bi bi-airplane"></i> Travel & Expense
            </QuickLinkButton>
            <QuickLinkButton to="/cashcontribution">
              <i className="bi bi-piggy-bank"></i> Cash Contribution
            </QuickLinkButton>
          </ButtonGroup>
        </QuickLinksContainer>
      </Container>

      <Footer style={{ width: "100vw" }} />
    </Container>
  );
};

export default Dashboard;
