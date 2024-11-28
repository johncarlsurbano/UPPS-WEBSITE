import React, { useState } from "react";
import Button from "../components/Button";
import { Footer } from "../components/Footer";
import { HeaderLoggedIn } from "../components/HeaderLoggedIn";
import { PersonnelDashboard } from "../components/PersonnelDashboard";
import { StudentDashboard } from "../components/StudentDashboard";
import { useSelector } from "react-redux";

export const OfficeHeadPage = () => {
  // State to manage which dashboard is shown

  
  const user = useSelector((state) => state.user.value.user);
  
  const [dashboardType, setDashboardType] = useState("personnel");

  return (
    <div className="office-head-page flex- flex-col">
      <HeaderLoggedIn />
      <div className="office-head-content flex flex-col mt-[5rem] mb-[2rem]">
        <div className="flex flex-col m-auto my-0 w-full max-w-[1200px] gap-[2.5rem]">
          <h1 className="text-center text-[clamp(1.5rem,3vw,3rem)] font-bold text-navy">
            Dashboard Portal
          </h1>
          <div className="flex justify-between self-center w-full max-w-[42rem]">
            <Button
              title={"Personnel Dashboard"}
              style="text-white bg-navy rounded-[100rem] w-full max-w-[20rem] py-[1rem] text-[clamp()] text-[clamp(1.2rem,3vw,1.2rem)] font-bold"
              onClick={() => setDashboardType("personnel")}
            />
            <Button
              title={"Student Dashboard"}
              style="text-white bg-yellow rounded-[100rem] w-full max-w-[20rem] py-[1rem] text-[clamp()] text-[clamp(1.2rem,3vw,1.2rem)] font-bold"
              onClick={() => setDashboardType("student")}
            />
          </div>
        </div>
        <div className="office-head-dashboard-container">
          {/* Conditionally render the dashboard based on state */}
          {dashboardType === "personnel" && <PersonnelDashboard userRole={user.role}/>}
          {dashboardType === "student" && <StudentDashboard />}
        </div>
      </div>
      <Footer />
    </div>
  );
};
