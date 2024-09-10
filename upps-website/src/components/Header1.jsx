import "../styles/Header1.css";
import logo from "../assets/upps-website-logo.png"

const Header1 = ({onClick}) => {
  return (
    <div className="header">
      <div className="navbar1 bg-uppsyellow">
        <div className="navbar1-content bg-uppsdarkblue"></div>
      </div>
      <div className="navbar2">
        <div className="navbar2-content">
          <div className="navbar2-content-logo">
            <img src={logo} alt="" />
          </div>
          <div className="navbar2-content-links1">
            <a href="">Home</a>
            <a href="">About Us</a>
            <a href="">Services</a>
          </div>
          <div className="navbar2-content-links2">
            <a className="bg-uppsyellow text-white" id="navbar2-button" href="">Dashboard</a>
            <a id="navbar2-button-login" href="" onClick={onClick}>Login</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header1;
