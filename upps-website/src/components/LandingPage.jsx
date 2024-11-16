import  Header1  from "./Header1"
import '../styles/LandingPage.css';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DashboardTable } from "./Dashboard-table";
import { ReadyToClaimRequestStudent } from "./ReadyToClaimStudentRequest";
import OfficeHeadProfile from '../assets/OfficeHeadProfile.png'
import { Footer } from "./Footer";
import { useNavigate } from "react-router-dom";


export const LandingPage = ()=>{
    const navigate = useNavigate();

    return(
        <div className="landing-page">
            <Header1 onClick={() => navigate("/login")}/>
            <div clas sName="student-dashboard-details">
                <div className="student-dashboard-details-content">
                    <div className="student-dashboard-details-content-top">
                        <h1>Student <span>Dashboard</span></h1>
                    </div>
                    <div className="student-dashboard-details-content-middle">
                        <div className="student-dashboard-details-content-middle-left">
                            <a href="">Submit Printing Request</a>
                            <a href="">Submit Book Binding Request</a>
                            <a href="">Submit Lamination Request</a>
                        </div>
                        <div className="student-dashboard-details-content-middle-right">
                            <div className="student-dashboard-details-content-middle-right-content">
                                <h3>Pending Request</h3>
                                <h2>2</h2>
                            </div>
                            <div className="student-dashboard-details-content-middle-right-content">
                                <h3>Customer</h3>
                                <h2>5</h2>
                            </div>
                        </div>
                    </div>
                    <div className="student-dashboard-details-content-bottom">
                        <div className="student-dashboard-details-content-bottom-content-search">
                            <h2>Search</h2>
                            <input type="text" name="" id="" placeholder="Type your name here...."></input>
                            {/* <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" /> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className="student-dashboard-table">
                <div className="student-dashboard-table-content">
                    <DashboardTable></DashboardTable>
                </div>
            </div>
            <div className="student-ready-to-claim-request-table">
                <div className="student-ready-to-claim-request-table-content">
                    <h1>Ready To Claim <span>Student Request</span></h1>
                    <div className="student-dashboard-details-content-bottom-content-search">
                        <h2>Search</h2>
                        <input type="text" name="" id="" placeholder="Type your name here...."></input>
                        {/* <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" /> */}
                    </div>
                </div>
            </div>
            <div className="student-dashboard-table">
                <div className="student-dashboard-table-content">
                    <ReadyToClaimRequestStudent/>
                </div>
            </div>
            {/* =================================== */}
            <div className="about">
                <div className="about-content">
                    <h1>What is <span>UPPS?</span></h1>
                    <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
                </div>
            </div>
            <div className="schedule">
                <div className="schedule-content">
                    <div className="office-head">
                        <h1>UPPS - University Pringting Press System</h1>
                        <div className="card">
                            <div className="card-profile">
                                <div className="card-profile-image">
                                    <img src={OfficeHeadProfile} alt="Office Head Profile" />
                                </div>
                                <div className="card-profile-information">
                                    <h2>Mrs. Lorem Ipsum</h2>
                                    <p style={{color:"#f4b213"}}>Office Head</p>
                                </div>
                            </div>
                            <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Lorem </p>
                        </div>
                    </div>
                    <div className="weekly-time-table">
                        <h2>Weekly Timetable</h2>
                        <div className="weekly-time-table-schedule">
                            <h4>Monday<span>10:00am - 5:00pm</span></h4>
                            <h4>Tuesday<span>10:00am - 5:00pm</span></h4>
                            <h4>Wednesday<span>10:00am - 5:00pm</span></h4>
                            <h4>Thursday<span>10:00am - 5:00pm</span></h4>
                            <h4>Friday<span>10:00am - 5:00pm</span></h4>
                        </div>
                    </div>
                </div>
            </div>
            <div className="services">
                <div className="services-content">
                    <h1>Service <span>Offered</span></h1>
                    <div className="printing-services">
                        <h1>Printing</h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus voluptate reiciendis harum aperiam ratione labore magni dolor perferendis, repellendus cum impedit? Distinctio harum nesciunt corporis ipsum mollitia, quidem repellat quis explicabo ad dolor culpa debitis architecto quisquam consectetur nisi. Laudantium, asperiores ipsa. Veritatis dolor, accusamus repellat laborum beatae autem, saepe molestiae nesciunt laudantium magnam aperiam at sint. Porro voluptatum magnam quod voluptas expedita odio maxime aliquid tempore recusandae commodi quo tempora temporibus quas laboriosam tenetur consequuntur amet facilis minus, dolorum ipsa! Eveniet, dignissimos ullam hic iusto ad voluptates laborum quisquam deserunt magnam ipsam nam, molestias debitis illum quis voluptatibus? Vero.</p>
                    </div>
                    <div className="book-binding-services">
                        <h1><span>Book Binding</span></h1>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam quis quisquam maiores adipisci consequuntur natus, omnis mollitia nulla temporibus, eius repellat, minus nisi nesciunt magni atque blanditiis architecto doloremque molestias placeat in culpa? In numquam sapiente quam ipsa sit culpa, magnam sint dolores nam laboriosam. Amet, libero mollitia possimus cupiditate deserunt rerum eligendi esse enim, maxime laboriosam incidunt quod fugiat id consequatur impedit ad quas modi animi accusantium. Iusto, consequatur?</p>
                        
                    </div>
                    <div className="lamination-services">
                        <h1>Lamination</h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas placeat aperiam in atque veniam! Id reiciendis eligendi alias rem animi, consequuntur exercitationem! Corrupti soluta fugiat id sapiente autem quae eos numquam. Numquam assumenda molestias sunt velit? Quos vel, ipsum eaque enim esse dolorem illo asperiores expedita rerum optio quam voluptates explicabo. Doloribus eos, quasi inventore excepturi ipsum dicta expedita rem aliquid ea praesentium obcaecati, commodi adipisci tempore facilis eligendi similique repellat quas aperiam quam explicabo placeat atque minus? Aspernatur, delectus.</p>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}