import React from "react";
import styled from "styled-components";
import Header from "../components/header";
import Footer from "../components/footer";
import carGift from "../assets/car-gift.jpg";
import carAward from "../assets/car-award.jpg";
import { Link } from "react-router-dom";

const PageWrap = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #eff4ff 0%, #f7f9ff 100%);
`;

const Hero = styled.section`
  position: relative;
  overflow: hidden;
  padding: 140px 24px 72px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(31, 56, 117, 0.9));
`;

const HeroGlow = styled.div`
  position: absolute;
  inset: 0 auto auto 56%;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  background: rgba(245, 187, 87, 0.18);
  filter: blur(18px);
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 28px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const HeroText = styled.div`
  color: #ffffff;

  span {
    display: inline-block;
    margin-bottom: 14px;
    padding: 8px 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 0.74rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 700;
    color: #dfe9ff;
  }

  h1 {
    margin: 0 0 16px;
    font-size: clamp(2.6rem, 5vw, 4.5rem);
    line-height: 1.05;
    font-weight: 800;
  }

  p {
    max-width: 600px;
    margin: 0;
    color: rgba(255, 255, 255, 0.82);
    font-size: 1.07rem;
    line-height: 1.8;
  }
`;

const HeroImage = styled.img`
  width: 100%;
  max-height: 480px;
  object-fit: cover;
  border-radius: 26px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.38);
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 24px 64px;
`;

const InsightGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  margin-top: 18px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.article`
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(32, 58, 120, 0.08);
  border-radius: 22px;
  padding: 22px 20px;
  box-shadow: 0 16px 40px rgba(31, 41, 55, 0.06);

  h3 {
    margin: 0 0 12px;
    font-size: 1.2rem;
    color: #11213f;
  }

  p {
    margin: 0;
    line-height: 1.8;
    color: #455571;
  }
`;

const FeatureSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 26px;
  margin-top: 42px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  border-radius: 24px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid rgba(31, 41, 55, 0.08);
  box-shadow: 0 18px 35px rgba(15, 23, 42, 0.06);
`;

const FeatureImage = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
`;

const FeatureContent = styled.div`
  padding: 26px 22px 30px;

  h3 {
    margin: 0 0 12px;
    font-size: 1.7rem;
    color: #111827;
  }

  p {
    margin: 0;
    color: #4b5b73;
    line-height: 1.8;
  }
`;

const CTA = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 36px;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 210px;
  padding: 1rem 1.8rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #355efc, #5c82ff);
  color: #ffffff;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 18px 35px rgba(53, 94, 252, 0.25);

  &:hover {
    text-decoration: none;
    color: #ffffff;
    transform: translateY(-2px);
  }
`;

const CarRewardsPage = () => {
  return (
    <PageWrap>
      <Header />

      <Hero>
        <HeroGlow />
        <HeroContent>
          <HeroText>
            <span>Car reward initiative</span>
            <h1>Rewarding the growth behind the vision.</h1>
            <p>
              At HealthSupport, our best investors don’t just receive returns — they become part of a
              tradition of excellence. Through our new policy, standout investors are celebrated with premium
              car gifts that reflect the strength of their trust and contribution.
            </p>
          </HeroText>

          <HeroImage src={carGift} alt="Investor receives a gift car" />
        </HeroContent>
      </Hero>

      <Main>
        <InsightGrid>
          <InfoCard>
            <h3>Who qualifies?</h3>
            <p>
              Investors who show exceptional consistency, commitment, and long-term value through our key
              products and contribution programs are considered for recognition each cycle.
            </p>
          </InfoCard>

          <InfoCard>
            <h3>How winners are chosen</h3>
            <p>
              Performance, loyalty, and sustained participation are reviewed by our team to ensure the reward goes
              to the people truly moving the mission forward.
            </p>
          </InfoCard>

          <InfoCard>
            <h3>What makes it special</h3>
            <p>
              This is more than a perk — it is a public appreciation of trust, growth, and partnership. We believe
              the best investors deserve to be celebrated in a lasting way.
            </p>
          </InfoCard>
        </InsightGrid>

        <FeatureSection>
          <FeatureCard>
            <FeatureImage src={carAward} alt="Car award ceremony" />
            <FeatureContent>
              <h3>Built for loyalty</h3>
              <p>
                We designed this reward program to reinforce the relationship between our company and the investors
                who help shape our future. By recognizing performance and consistency, we create stronger momentum
                and deeper confidence across the network.
              </p>
            </FeatureContent>
          </FeatureCard>

          <FeatureCard>
            <FeatureImage src={carGift} alt="Premium investor car gift" />
            <FeatureContent>
              <h3>Celebrating achievement</h3>
              <p>
                Our top performers are not only rewarded financially — they are also honored with premium recognition
                that symbolizes impact, discipline, and partnership. The result is a memorable moment that reflects
                their contribution to the brand's long-term journey.
              </p>
            </FeatureContent>
          </FeatureCard>
        </FeatureSection>

        <CTA>
          <CTAButton to="/home">Back to Home</CTAButton>
        </CTA>
      </Main>

      <Footer />
    </PageWrap>
  );
};

export default CarRewardsPage;
