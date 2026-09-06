import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import fetchData from "../fetchData";
import { developmentApiEntryPoint } from "./register";

const formatDate = (date) => new Date(date).toLocaleString();

const TradingSignals = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("support_token");
    fetchData(
      `${developmentApiEntryPoint}/trading-signals`,
      (data) => {
        setSignals(data.result);
        setLoading(false);
      },
      (message) => {
        setError(message);
        setLoading(false);
      },
      "GET",
      undefined,
      token
    );
  }, []);

  return (
    <Container fluid className="p-0">
      <Header />
      <Container className="py-5" style={{ marginTop: "90px", minHeight: "70vh" }}>
        <div className="d-flex justify-content-between align-items-center mb-4 gap-3">
          <div>
            <p className="text-uppercase text-muted mb-1">Market updates</p>
            <h1>Trading signals</h1>
          </div>
          <Button as={Link} to="/dashboard" variant="outline-secondary">Back to dashboard</Button>
        </div>
        {loading && <Spinner animation="border" />}
        {error && <p className="text-danger">{error}</p>}
        {!loading && !error && signals.length === 0 && <p>No trading signals have been posted yet.</p>}
        <Row className="g-4">
          {signals.map((signal) => (
            <Col md={6} lg={4} key={signal._id}>
              <Card className="h-100 shadow-sm">
                <Card.Img variant="top" src={signal.imageUrl} alt={signal.title} style={{ height: "220px", objectFit: "cover" }} />
                <Card.Body>
                  <Card.Title>{signal.title}</Card.Title>
                  <Card.Text>{signal.description}</Card.Text>
                  <small className="text-muted">Posted {formatDate(signal.createdAt)}</small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <Footer />
    </Container>
  );
};

export default TradingSignals;