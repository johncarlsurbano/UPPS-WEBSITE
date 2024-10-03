import '../styles/PersonnelProfile.css'
import OfficeHeadProfile from '../assets/OfficeHeadProfile.png'

export const PersonnelProfile = ()=>{
    return(
        <div className="personal-profile">
            <div className="personal-profile-header"></div>
            <div className="personal-profile-main">
                <div className="personal-profile-main-content">
                    <div className="personal-profile-main-content-left">
                        <div className="personal-profile-main-content-left-user">
                            <div className="personal-profile-main-content-left-user-profile">
                                <img src={OfficeHeadProfile} alt="" />
                            </div>
                            <p id="personal-profile-main-content-left-user-profile" className='text-white'>User S. Name</p>
                        </div>
                        <div className="personal-profile-main-content-left-account-information">
                            <p>Account information</p>
                            <h2>Contact Information</h2>
                            <table id='contact-information-table'>
                                <tr>
                                    <td>Phone:</td>
                                    <td>09551146457</td>
                                </tr>
                                <tr>
                                    <td>Address:</td>
                                    <td>Gusa, Purok 5, Emerald Street</td>
                                </tr>
                                <tr>
                                    <td>Email:</td>
                                    <td>surbano.johncarll@gmail.com</td>
                                </tr>
                            </table>
                            <hr />
                            <h2>Other Information</h2>
                            <table id="other-information-table">
                                <tr>
                                    <td>Position:</td>
                                    <td>Instructor</td>
                                </tr>
                                <tr>
                                    <td>Department:</td>
                                    <td>College of Information Technology and Computing</td>
                                </tr>
                            </table>
                        </div>
                        <div className="personal-profile-main-content-left-buttons">
                            <a href="" id="submit-request">Submit Request</a>
                            <a href="" id="dashboard">Dashboard</a>
                        </div>
                    </div>
                    <div className="personal-profile-main-content-right text-center">
                        <h1>Order <span>History</span></h1>
                        <table>
                            <tr>
                                <th>Type of Request</th>
                                <th>Date</th>
                                <th>Details</th>
                            </tr>
                            <tr>
                                <td>Printing</td>
                                <td>6/7/2024</td>
                                <td><a href="">Details</a></td>
                            </tr>
                            <tr>
                                <td>Book Binding</td>
                                <td>6/7/2024</td>
                                <td><a href="">Details</a></td>
                            </tr>
                            <tr>
                                <td>Lamination</td>
                                <td>6/7/2024</td>
                                <td><a href="">Details</a></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}