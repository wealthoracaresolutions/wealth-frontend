import styled, { keyframes } from "styled-components";
import Header from "../components/header";
import backgroundVid from "../assets/backgroundVid.mp4";
import { useEffect, useState } from "react";
import HealthCenter from "../components/aboutus";
import DoctorsCarousel from "../components/doctors";
import Testimonials from "../components/tetsimonials";
import Partners from "../components/partners";
import Feedback from "../components/feedback";
import Footer from "../components/footer";
import Plans from "../components/plans";
import Loan from "../components/loan";
import observeClass, { animatedClasses } from "../aos";
import fetchData from "../fetchData";
import { developmentApiEntryPoint } from "./register";
import certificate from "../assets/Jonathan Crimson.png";
import carGift from "../assets/car-gift.jpg";
import carAward from "../assets/car-award.jpg";
import { Image, Carousel } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import { Link } from "react-router-dom";
import { faqs } from "../updateText";

const Container = styled.div`
  width: 100vw;
`;
const fade = keyframes`
from{
  opacity:0;
  
}
to{
  opacity:1;
}
`;

const Hero = styled.div`
  width: 100vw;
  height: 450px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ecf0f1; /* Light text color for contrast */
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`;

const Shade = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8); /* Semi-transparent black */
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 2rem;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-family: "Montserrat", sans-serif;

    @media (min-width: 768px) {
      font-size: 3rem;
    }
  }

  p {
    font-size: 1rem;
    margin-bottom: 2rem;

    @media (min-width: 768px) {
      font-size: 1.2rem;
    }
  }

  a {
    padding: 0.8rem 2rem;
    font-size: 1rem;
    background-color: #1abc9c; /* Teal button */
    color: #fff;
    text-decoration: none;
    border-radius: 8px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #16a085; /* Dark teal */
    }
  }
`;
const Cursor = styled.span`
  animation: ${fade} 1s ease infinite;
  color: #1abc9c;
  margin-left: 5px;
`;

const CarRewardsSection = styled.section`
  width: min(1200px, calc(100% - 32px));
  margin: 48px auto 0;
  padding: 32px 24px 40px;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(10, 21, 44, 0.98), rgba(23, 35, 74, 0.94));
  color: #f5f7fb;
  box-shadow: 0 30px 80px rgba(17, 24, 39, 0.28);

  @media (max-width: 768px) {
    width: min(100% - 20px, 1200px);
    padding: 24px 16px 28px;
    margin-top: 32px;
  }
`;

const SectionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(27, 191, 115, 0.12);
  border: 1px solid rgba(27, 191, 115, 0.4);
  color: #9ef2c8;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 700;
`;

const SectionHeading = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-top: 18px;
  margin-bottom: 24px;

  h2 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1.1;
    color: #ffffff;
  }

  p {
    margin: 0;
    max-width: 540px;
    color: rgba(255, 255, 255, 0.78);
    line-height: 1.7;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const RewardCarousel = styled(Carousel)`
  .carousel-item {
    border-radius: 22px;
    overflow: hidden;
  }

  .carousel-indicators button {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.55);
  }

  .carousel-indicators .active {
    background-color: #f5bb57;
  }

  .carousel-control-prev,
  .carousel-control-next {
    width: 8%;
  }
`;

const SlideWrap = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  min-height: 430px;
  background: rgba(255, 255, 255, 0.04);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;

const SlideImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const SlideContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 34px;
  background: linear-gradient(135deg, rgba(2, 14, 31, 0.7), rgba(14, 29, 52, 0.94));

  h3 {
    margin: 0 0 14px;
    font-size: clamp(1.8rem, 2.5vw, 2.8rem);
    line-height: 1.1;
    color: #ffffff;
  }

  p {
    margin: 0 0 18px;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.7;
    font-size: 1rem;
  }

  ul {
    margin: 0 0 20px;
    padding-left: 20px;
    color: rgba(255, 255, 255, 0.82);
    line-height: 1.8;
  }

  @media (max-width: 768px) {
    padding: 24px 20px 28px;
  }
`;

const LearnMoreLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-width: 170px;
  padding: 0.9rem 1.5rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #f5bb57, #f59e42);
  color: #121a2c;
  font-weight: 800;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 18px 30px rgba(245, 158, 66, 0.28);

  &:hover {
    transform: translateY(-2px);
    text-decoration: none;
    color: #121a2c;
  }
`;

const FAQSection = styled.section`
  width: min(960px, calc(100% - 32px));
  margin: 56px auto 64px;

  h2 {
    margin: 0 0 12px;
    color: #1f2937;
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    text-align: center;
  }

  > p {
    max-width: 680px;
    margin: 0 auto 28px;
    color: #667085;
    line-height: 1.7;
    text-align: center;
  }

  .accordion-item {
    margin-bottom: 12px;
    overflow: hidden;
    border: 1px solid #e4e7ec;
    border-radius: 10px;
    box-shadow: 0 5px 18px rgba(16, 24, 40, 0.06);
  }

  .accordion-button {
    padding: 18px 20px;
    color: #243447;
    font-weight: 700;
    background: #fff;
  }

  .accordion-button:not(.collapsed) {
    color: #147d68;
    background: #f2fbf8;
    box-shadow: none;
  }

  .accordion-body {
    padding: 0 20px 20px;
    color: #5f6b76;
    line-height: 1.7;
    background: #f2fbf8;
  }
`;

const Home = () => {
  useEffect(() => {
    animatedClasses.forEach((className) => {
      observeClass(className);
    });
    fetchData(`
      ${developmentApiEntryPoint}`,
      ()=>{},
      ()=>{}
    )
  }, []);
  const completeText =
    "Your well-being is our priority. Start your journey with us today.";
  const [char, setChar] = useState(0);
  useEffect(() => {
    setInterval(() => {
      setChar((char) => (char < completeText.length ? char + 1 : 0));
    }, 100);
  }, []);
  return (
    <Container>
      <Header />
      <Hero>
        <Video src={backgroundVid} autoPlay loop muted />
        <Shade />
        <Content>
          <h1 className="fadeinUp">Welcome to Wealthoracaresolutions</h1>
          <p>
            {completeText.substr(0, char)}
            <Cursor>|</Cursor>
          </p>
          <a href="/register">Get Started</a>
        </Content>
      </Hero>
      

      <HealthCenter />
      <Plans />
      <Loan />
      <DoctorsCarousel />
      <Image src={certificate} style={{width:"80%", display:"block", margin:"20px auto"}} fluid />
      <Partners />
      <Testimonials />
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d212145.78364952744!2d-84.6117196!3d33.818045!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f5045d6993098d%3A0x66fede2f990b630b!2sAtlanta%2C%20GA%2C%20USA!5e0!3m2!1sen!2sng!4v1734686788470!5m2!1sen!2sng"
        style={{
          border: 0,
          margin: "20px auto",
          width: "100%",
          height: "400px",
        }}
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
      <CarRewardsSection>
        <SectionBadge>Investor reward program</SectionBadge>
        <SectionHeading>
          <h2>We gift cars to our best investors.</h2>
          <p>
            Our newest policy rewards the most loyal and high-performing investors with premium cars,
            helping celebrate commitment, growth, and long-term value creation.
          </p>
        </SectionHeading>

        <RewardCarousel fade indicators={true} controls={true} interval={5000} pause="hover">
          <Carousel.Item>
            <SlideWrap>
              <SlideImage src={carGift} alt="Investor car gift" />
              <SlideContent>
                <h3>Drive home your success.</h3>
                <p>
                  Every quarter, our top investors are recognized with a meaningful gift that turns financial
                  momentum into a lifestyle upgrade.
                </p>
                <ul>
                  <li>Exceptional investors are invited into the car award pool.</li>
                  <li>Rewards are designed to honor consistency and trust.</li>
                  <li>Winners receive premium recognition and public appreciation.</li>
                </ul>
                <LearnMoreLink to="/car-awards">Learn More</LearnMoreLink>
              </SlideContent>
            </SlideWrap>
          </Carousel.Item>

          <Carousel.Item>
            <SlideWrap>
              <SlideImage src={carAward} alt="Car award for best investor" />
              <SlideContent>
                <h3>Recognition that moves with you.</h3>
                <p>
                  From top contributors to strategic partners, we reward the people who keep building the future
                  with us and help the mission grow stronger every month.
                </p>
                <ul>
                  <li>Reward tiers spotlight leadership, performance, and loyalty.</li>
                  <li>Cars are awarded to standout investors across our core programs.</li>
                  <li>Winning is more than recognition — it is a lasting celebration.</li>
                </ul>
                <LearnMoreLink to="/car-awards">Learn More</LearnMoreLink>
              </SlideContent>
            </SlideWrap>
          </Carousel.Item>
        </RewardCarousel>
      </CarRewardsSection>
      <Feedback />
      <FAQSection id="faqs">
        <h2>Frequently Asked Questions</h2>
        <p>
          Find clear answers about our services, applications, support, and eligibility.
        </p>
        <Accordion alwaysOpen>
          {faqs.map(({ q, a }, index) => (
            <Accordion.Item eventKey={String(index)} key={q}>
              <Accordion.Header>{q}</Accordion.Header>
              <Accordion.Body>{a}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </FAQSection>
      <Footer />
    </Container>
  );
};

export default Home;
