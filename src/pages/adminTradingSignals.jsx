import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import Header from "../components/header";
import Footer from "../components/footer";
import NavButtons from "../components/adminnavbuttons";
import fetchData from "../fetchData";
import handleFileUpload from "../upload";
import { developmentApiEntryPoint } from "./register";

const AdminTradingSignals = () => {
  const [signals, setSignals] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", imageUrl: "" });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const token = localStorage.getItem("support_token");

  const loadSignals = () => fetchData(
    `${developmentApiEntryPoint}/trading-signals`,
    (data) => setSignals(data.result),
    (error) => setMessage({ type: "danger", text: error }),
    "GET",
    undefined,
    token
  );

  useEffect(() => { loadSignals(); }, []);

  const updateForm = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = (event) => {
    event.preventDefault();
    setSaving(true);
    fetchData(
      `${developmentApiEntryPoint}/trading-signals`,
      () => {
        setForm({ title: "", description: "", imageUrl: "" });
        setMessage({ type: "success", text: "Trading signal posted." });
        setSaving(false);
        loadSignals();
      },
      (error) => { setMessage({ type: "danger", text: error }); setSaving(false); },
      "POST",
      form,
      token
    );
  };

  const remove = (id) => {
    if (!window.confirm("Delete this trading signal?")) return;
    fetchData(
      `${developmentApiEntryPoint}/trading-signals/${id}`,
      () => loadSignals(),
      (error) => setMessage({ type: "danger", text: error }),
      "DELETE",
      undefined,
      token
    );
  };

  return (
    <Container fluid className="p-0">
      <Header />
      <Container className="py-5" style={{ marginTop: "90px" }}>
        <NavButtons />
        <h1 className="my-4">Trading signals</h1>
        {message.text && <Alert variant={message.type}>{message.text}</Alert>}
        <Card className="mb-5 shadow-sm">
          <Card.Body>
            <Card.Title>Post a new signal</Card.Title>
            <Form onSubmit={submit}>
              <Row className="g-3">
                <Col md={6}><Form.Label>Title</Form.Label><Form.Control name="title" value={form.title} onChange={updateForm} required /></Col>
                <Col md={6}><Form.Label>Trading picture</Form.Label><Form.Control type="file" accept="image/*" required onChange={(event) => handleFileUpload(event.target.files[0], "trading-signals", (imageUrl) => setForm({ ...form, imageUrl }), setUploading)} /></Col>
                <Col xs={12}><Form.Label>Signal details</Form.Label><Form.Control as="textarea" rows={3} name="description" value={form.description} onChange={updateForm} /></Col>
                <Col xs={12}><Button type="submit" disabled={uploading || saving || !form.imageUrl}>{uploading ? <><Spinner size="sm" /> Uploading...</> : saving ? "Posting..." : "Post signal"}</Button></Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
        <Row className="g-4">
          {signals.map((signal) => <Col md={6} lg={4} key={signal._id}><Card className="h-100"><Card.Img variant="top" src={signal.imageUrl} alt={signal.title} style={{ height: "200px", objectFit: "cover" }} /><Card.Body><Card.Title>{signal.title}</Card.Title><Card.Text>{signal.description}</Card.Text><small className="text-muted d-block mb-3">Posted {new Date(signal.createdAt).toLocaleString()}</small><Button variant="outline-danger" size="sm" onClick={() => remove(signal._id)}>Delete</Button></Card.Body></Card></Col>)}
        </Row>
      </Container>
      <Footer />
    </Container>
  );
};

export default AdminTradingSignals;