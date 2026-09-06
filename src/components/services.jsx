import React from "react";
import styled, { keyframes } from "styled-components";
import { Row, Col } from "react-bootstrap";
import ShieldIcon from "@mui/icons-material/Shield";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PaymentsIcon from "@mui/icons-material/Payments";
import LuggageIcon from "@mui/icons-material/Luggage";
import "./services.css";
import { servicesAndExplanations } from "../updateText";
// Animation for fade-in effect
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const CardService = styled.div`
  height: 100%;
  text-align: center;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: ${fadeInUp} 0.8s ease forwards;
`;

const ServiceDescription = styled.p`
  margin: 12px 0 0;
  color: #5f6b76;
  font-size: 0.95rem;
  line-height: 1.6;
`;

const CircleShape = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 15px;
  color: #fff;
  font-size: 24px;
`;

const CardText = styled.p`
  margin: 0;
  min-height: 27px;
  font-size: 18px;
  line-height: 1.35;
  color: #243447;

  span {
    font-weight: bold;
  }
`;

const Services = () => {
  const serviceIcons = [
    MedicalServicesIcon,
    HealthAndSafetyIcon,
    TrendingUpIcon,
    LocalHospitalIcon,
    ShieldIcon,
    HealthAndSafetyIcon,
    PaymentsIcon,
    LuggageIcon,
  ];

  return (
    <Row className="justify-content-center fadeinUp" id="services">
      {servicesAndExplanations.map(({ text, explanation }, index) => {
        const ServiceIcon = serviceIcons[index % serviceIcons.length];

        return (
          <Col md={4} className="py-3" key={text}>
            <CardService>
              <CircleShape className="bg-primary">
                <ServiceIcon />
              </CircleShape>
              <CardText>
                <span>{text}</span>
              </CardText>
              <ServiceDescription>{explanation}</ServiceDescription>
            </CardService>
          </Col>
        );
      })}
    </Row>
  );
};

export default Services;
