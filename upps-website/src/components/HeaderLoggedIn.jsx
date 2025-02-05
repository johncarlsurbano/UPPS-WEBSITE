import uppsLogo from "../assets/upps-logo.png";
import userProfileImage from "../assets/tutin.png"
import ProfileDropDown from "./ProfileDropDown.jsx"
import { PiWechatLogoFill } from "react-icons/pi";
import { IoNotificationsSharp } from "react-icons/io5";
import { FaFilter } from "react-icons/fa6";
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux";


export const HeaderLoggedIn = ({href}) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.value.user);

  

  const homeNavigation = (role) => {
    switch (role) {
      case "Personnel":
        navigate("/personnel/dashboard")
        break;

      case "Office Head":
        navigate("/officehead/dashboard")
        break;

      case "Chairman":
        navigate("/personnel/dashboard")
        break;

      default:
        console.log("Walay Role")
    }
    
  }

  console.log(user)

  return (
    <div
      className="header-logged-in flex flex-col pt-[1rem] bg-[#17163A] sticky top-0 z-10"
      style={{ boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className="header-logged-in-top h-[2.5rem] w-full max-w-[100%] bg-[#F8B41F] shadow-lg overflow-visible z-50"
        style={{ boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.5)" }}
      ></div>                                                     
      <div className="header-logged-in-bottom bg-white flex ">
        <div className="header-logged-in-bottom-content flex justify-between m-auto my-0 w-full max-w-[1200px] items-center py-3">
          <div className="h-[3.5rem] w-full max-w-[15rem]">
            <img src={uppsLogo} alt="" />
            
          </div>
          <div className="header-links flex items-center gap-3 w-full max-w-[40rem] justify-end" >
            <a href="#" className="text-[clamp(1.2rem,3vw,1.2rem)] font-bold cursor-pointer" onClick={(e) => {
              e.preventDefault();
              homeNavigation(user?.role)
            }}>
              Home
            </a>
            <a href={href} className="text-[clamp(1.2rem,3vw,1.2rem)] font-bold">
              About Us
            </a>


            {/* <IoChatbubbleEllipsesOutline style={{fontSize: '25px'}} /> */}
{/* 
            <a href=""><IoNotificationsSharp style={{fontSize: '25px', color: "#17163A"}} /></a> */}
            <div className="h-[3rem] w-full max-w-[3rem] rounded-full">
              {/* <img
                src={userProfileImage}
                alt=""
                className="rounded-full border-[#17163A] border-[2px]"
              /> */}
              <ProfileDropDown />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
