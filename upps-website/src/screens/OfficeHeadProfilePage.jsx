import Button from "../components/Button";
import userProfileImage from "../assets/tutin.jpg";
import { HeaderLoggedIn } from "../components/HeaderLoggedIn";
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export const OfficeHeadProfilePage = () => {

  const user = useSelector((state) => state.user.value.user);
  const navigate = useNavigate();

  console.log(user)
  return (
    <div className="personnel-profile-page flex flex-col">
      <HeaderLoggedIn />
      <div className="personnel-profile-page-main w-full max-w-full flex flex-col relative]">
        <div className="h-[15rem] w-full max-w-full bg-[#17163A] z-0"></div>
        <div className="personnel-profile-page-content w-full max-w-[1200px] m-auto flex gap-6 z-1 relative top-[-5rem]">
          <div className="personnel-profile-page-content-left flex flex-col w-full max-w-[35%] items-center">
            <div className="user-profile-page-content flex flex-col bg-[#F8B41F] w-full text-center py-[4rem] rounded-[10px] gap-6">
              <div className="user-profile-page-image h-[10rem] w-[10rem] rounded-[100rem] self-center">
                <img
                  src={userProfileImage}
                  alt="User"
                  className="rounded-[100rem] border-white border-[4px]"
                />
              </div>
              <p className="text-white text-[clamp(1.2rem,3vw,2rem)]">
                {user.first_name} {user.last_name}
              </p>
            </div>
            <div className="user-profile-account-details w-full mt-[3rem]">
              <div className="flex items-center justify-between">
                <h1>Account Information</h1>
                <p>icon</p>
              </div>
              <div className="contant-information mt-[2rem]">
                <p className="text-[clamp(1.2rem,3vw,1.5rem)] text-[#717171]">
                  Contact Information
                </p>
                <table className="mt-[2rem]">
                  <tr>
                    <td className="font-bold">Address:</td>
                    <td className="pl-5">
                      {user.street_address}, {user.barangay}, {user.city}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">Email:</td>
                    {user.email}
                  </tr>
                </table>
              </div>
              <div className="contant-information mt-[2rem]">
                <p className="text-[clamp(1.2rem,3vw,1.5rem)] text-[#717171]">
                  Other Information
                </p>
                <table className="mt-[2rem]">
                  <tr>
                    <td className="font-bold">Position:</td>
                    <td className="pl-5">{user.role}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          <div className="personnel-profile-page-content-right w-full max-w-[65%] px-[2rem] pt-[2rem] rounded-[10px] bg-white">
            <div className="personnel-profile-page-content-right-content">
              <div className="flex flex-col justify-between items-center w-full text-center">
                <h1 className="text-navy font-bold text-[clamp(1.5rem,3vw,2.5rem)]">
                  Manage Transaction & Inventory
                </h1>
                <div className="flex flex-col items-center gap-[1.5rem] mt-[5rem] w-full max-w-[100%]">
                  <Button
                    title={"Transaction History"}
                    style={
                      "bg-navy text-white w-full max-w-[25rem] py-[1rem] font-bold text-[clamp(1.2rem,3vw,1.2rem)] rounded-[10px]"
                    }
                    onClick={() => navigate('/officehead/transactionbill/')}
                  />
                  <Button
                    title={"Manage Inventory"}
                    style={
                      "bg-yellow text-white w-full max-w-[25rem] py-[1rem] font-bold text-[clamp(1.2rem,3vw,1.2rem)] rounded-[10px]"
                    }
                    onClick={() => navigate('/officehead/inventory/')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
