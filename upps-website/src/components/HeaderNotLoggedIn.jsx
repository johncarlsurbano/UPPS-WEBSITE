import uppsLogo from "../assets/upps-logo.png";
import { useNavigate } from "react-router-dom";


export const HeaderNotLoggedIn = ({href}) => {
  const navigate = useNavigate();

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
          <div className="header-links flex items-center gap-3">
            <a
              href=""
              className="text-[clamp(1.2rem,3vw,1.2rem)] font-bold text-navy"
            >
              Home
            </a>
            <a
              href={href}
              className="text-[clamp(1.2rem,3vw,1.2rem)] font-bold text-navy"
            >
              About Us
            </a>
            <a
              href=""
              className="text-[clamp(1.2rem,3vw,1.2rem)] font-bold text-navy"
              onClick={() => navigate("/login")}
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
