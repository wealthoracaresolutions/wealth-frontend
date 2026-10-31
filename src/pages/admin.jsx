// AdminPage.js
import React, { useEffect,useState} from "react";
import Footer from "../components/footer";
import {
  Container,
  Navbar,
  Nav,
  NavDropdown,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import NavButtons from "../components/adminnavbuttons";
import { HighLight } from "./login";
import fetchData from "../fetchData";
import { developmentApiEntryPoint } from "./register";
import { useDispatch, useSelector } from "react-redux";
import { selectAppStats, setAppStats } from "../state/slices/appSlice";
import Header from "../components/header";
import { Link } from "react-router-dom";


const AdminPage = () => {
  const dispatch= useDispatch()
  const  appStats= useSelector(selectAppStats)
  const [temporaryAppStats, setTemporaryStats]=useState({allUsers:[],allInvestments:[],allWithdrawals:[],})
  const [notifications, setNotifications] = useState([])
  const [hasFetched,setHasFetched]= useState(false)

  
  console.log({appStats})
  useEffect(()=>{
    const token = localStorage.getItem("support_token");
    const loadNotifications = () => {
      fetchData(
        `${developmentApiEntryPoint}/users/notifications`,
        (data) => setNotifications(data.result),
        (message) => console.error("Could not load admin notifications:", message),
        "GET",
        undefined,
        token
      );
    };

    fetchData(
      `${developmentApiEntryPoint}/admin/getstats`,
      (data)=>{
        dispatch(setAppStats(data.result))
        console.log(data.result)
        setTemporaryStats(data.result)
        setHasFetched(true)
      },
      (message)=>{
        alert(message)
        window.location.reload()
      }
    )
    loadNotifications();
    const notificationRefresh = window.setInterval(loadNotifications, 30000);
    return () => window.clearInterval(notificationRefresh);
  },[])
  const {allUsers,allInvestments,allWithdrawals}=temporaryAppStats
const pendingRequests=[...allInvestments.filter(x=>x.status==="pending"),...allWithdrawals.filter(x=>x.status==="pending")]
  const stats = [
    { title: "Total Users", value:hasFetched? allUsers.length:"Fetching" },
    { title: "Total Investments", value:hasFetched?allInvestments.length:"Fetching" },
    { title: "Pending Requests", value:hasFetched?pendingRequests.length:"Fetching" },
  ];

  return (
    <Container fluid className="p-0">
      {/* Top Bar */}
    <Header/>

      {/* Navbar */}
      

      {/* Content */}
      <Container className="my-5">
        <h4 className="text-center mb-4">Quick Links:</h4>
        <NavButtons />

        <Row className="cardContent mt-5">
          {stats.map((stat) => {
            return (
              <Col xl={4}>
                <Card>
                  <Card.Header className="text-center">
                    {stat.title}
                  </Card.Header>
                  <Card.Body className="bg-success text-white d-flex justify-content-between align-items-center p-4">
                    <div>
                      <h3 id="totalUsers">{stat.value}</h3>
                    </div>
                    <div>
                      <span>7%</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}

          {/* Repeat similar card structure for other stats */}
        </Row>

        <Card className="mt-4 shadow-sm border-0">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Notifications</h5>
            <span>{notifications.filter((notification) => notification.registrationId).length} pending registrations</span>
          </Card.Header>
          <Card.Body>
            {notifications.length ? notifications.map((notification) => (
              <div
                key={notification._id || notification.createdAt}
                className="border-bottom py-3"
              >
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <strong>{notification.title}</strong>
                  <small className="text-muted">
                    {new Date(notification.createdAt).toLocaleString()}
                  </small>
                </div>
                <p className="mb-2 mt-1">{notification.message}</p>
                {notification.registrationId && (
                  <Button as={Link} to="/admin/users" size="sm" variant="success">
                    Review registrations
                  </Button>
                )}
              </div>
            )) : <p className="text-muted mb-0">No new notifications.</p>}
          </Card.Body>
        </Card>
        
      </Container>
      <Footer />
    </Container>
  );
};
export default AdminPage;
