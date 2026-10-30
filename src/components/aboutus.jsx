import React from "react";
import styled from "styled-components";
import { Container } from "react-bootstrap";
import doctorBG from "../assets/wealthoracare-logo.png";
import { aboutText } from "../updateText";
import Services from "./services";

const PageSection = styled.section`
  overflow: hidden;
  padding: 3.5rem 0 4.5rem;
  background: #f8fafc;
`;

const AboutLayout = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: start;
  margin-top: 4rem;
  padding: clamp(2rem, 5vw, 4rem);
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 3rem;
    padding: 1.5rem;
  }
`;

const AboutIntro = styled.div`
  position: relative;
  z-index: 1;
`;

const SectionLabel = styled.p`
  margin: 0 0 0.75rem;
  color: #168f78;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: #172b4d;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.1;
`;

const AboutDescription = styled.div`
  position: relative;
  z-index: 1;
  max-width: 700px;
  color: #52606d;
  font-size: 1rem;
  line-height: 1.75;
  white-space: pre-line;
`;

const Button = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.75rem;
  padding: 0.8rem 1.35rem;
  border-radius: 8px;
  background: #168f78;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background: #11715f;
    color: #ffffff;
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid rgba(22, 143, 120, 0.35);
    outline-offset: 3px;
  }
`;

const Background = styled.img`
  position: absolute;
  right: -5rem;
  bottom: -6rem;
  z-index: 0;
  width: min(42vw, 420px);
  max-width: 70%;
  opacity: 0.08;
  pointer-events: none;
  user-select: none;

  @media (max-width: 768px) {
    right: -4rem;
    bottom: -4rem;
    width: 280px;
  }
`;

const HealthCenter = () => {
  return (
    <PageSection>
      <Container>
        <Services />
        <AboutLayout id="about">
          <Background src={doctorBG} alt="" aria-hidden="true" />
          <AboutIntro>
            <SectionLabel>WHO WE ARE</SectionLabel>
            <SectionTitle>ABOUT US</SectionTitle>
            <Button href="#services">EXPLORE OUR SERVICES</Button>
          </AboutIntro>
          <AboutDescription>
            {aboutText.replace(/^About WealthoraCare Solutions\s*/, "")}
          </AboutDescription>
        </AboutLayout>
      </Container>
    </PageSection>
  );
};

export default HealthCenter;
