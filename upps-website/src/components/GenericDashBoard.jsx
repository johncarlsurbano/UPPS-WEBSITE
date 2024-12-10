import { GenericTable } from "./GenericTable";
import DashboardCounterBox from "./DashboardCounterBox";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"

export const GenericDashBoard = ({
  dashboardHeader,
  dashboardData,
  readyToClaimHeader,
  readyToClaimData,
  dashboardTitle,
  readyToClaimTitle,
  pendingCount,
  totalCount,
  readyCount,
  onChange
}) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.value.user);

  const requestAccess = (navigateTo) => {

    if (!user) {
      alert("User information is missing. Please log in again.");
      return;
    }

    if (user.account_status === "Pending") {
      alert("Your account is pending. Please wait for approval by the chairman!");
      return;
    }
    if (user.account_status === "Denied") {
      alert("Your account is denied. Please contact the chairman!");
      return;
    }
    if (user.account_status === "Active") {
      navigate(navigateTo);
      return;
    } 
  };



  return (
    <>
      <div className="mt-[7rem]">
        <h1 className="text-center text-[clamp(1.5rem,3vw,2.5rem)] text-navy font-bold">
          {dashboardTitle}
        </h1>
        <div className="flex items-end justify-between w-full max-w-[100%] mt-10">
          <div className="flex flex-col w-full max-w-[20rem] gap-3">
            <h1 className="text-[clamp(1.5rem,3vw,2.5rem)] text-navy">
              Submit Request
            </h1>
            <div className="flex flex-col gap-3">
              <Button
                title={"Add Request"}
                style="text-white bg-navy rounded-[10px] w-full max-w-[15rem] py-[0.8rem] text-[clamp(1.2rem,3vw,1.2rem)]"
                onClick={() => requestAccess('/personnel/form') || (!user.role ? navigate('/student/form') : null)}
              />
            </div>
          </div>
          <div className="flex flex-col w-full max-w-[50rem] gap-[2rem]">
            <div className="flex justify-between w-full max-w-[100%]">
              <DashboardCounterBox
                title={"Pending Request"}
                count={pendingCount}
                countStyle={"text-[clamp(2rem,3vw,3rem)] font-bold text-yellow"}
                textStyle={
                  "text-[clamp(1.2rem,3vw,1.2rem)] text-black font-bold"
                }
                counterStyle={
                  "px-[2rem] py-[0.5rem] flex flex-col justify-between bg-white rounded-[10px]"
                }
              />
              <DashboardCounterBox
                title={"Total Requests"}
                count={totalCount}
                countStyle={"text-[clamp(2rem,3vw,3rem)] font-bold text-yellow"}
                textStyle={
                  "text-[clamp(1.2rem,3vw,1.2rem)] text-black font-bold"
                }
                counterStyle={
                  "px-[2rem] py-[0.5rem] flex flex-col justify-between bg-white rounded-[10px]"
                }
              />
              <DashboardCounterBox
                title={"Ready To Claim Request"}
                count={readyCount}
                countStyle={"text-[clamp(2rem,3vw,3rem)] font-bold text-yellow"}
                textStyle={
                  "text-[clamp(1.2rem,3vw,1.2rem)] text-white font-bold"
                }
                counterStyle={
                  "px-[2rem] py-[0.5rem] flex flex-col justify-between bg-navy rounded-[10px]"
                }
              />
            </div>
            <div className="flex items-center w-full max-w-[100%] justify-between">
              <p className="text-black text-[clamp(1rem,3vw,2rem)]">Search</p>
              <input
                type="text"
                className=" rounded-[100rem] pl-[1rem] py-[1rem] w-full max-w-[80%]"
                onChange={onChange}
              />
            </div>
          </div>
        </div>
        <GenericTable
          headers={dashboardHeader}
          data={dashboardData}
          thStyle={"bg-navy text-white"}
        />
      </div>
      <div>
        <h1 className="text-[clamp(1.5rem,3vw,2.5rem)] text-navy font-bold">
          {readyToClaimTitle}
        </h1>
        <GenericTable
          headers={readyToClaimHeader}
          data={readyToClaimData}
          thStyle={"bg-navy text-white"}
        />
      </div>
    </>
  );
};
