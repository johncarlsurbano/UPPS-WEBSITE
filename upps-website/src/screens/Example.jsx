import  Button  from "../components/Button";
import { ChairmanPersonnelDetailsProfile } from "../components/ChairmanPersonnelDetailsProfile";
import { ChairmanPersonnelRequestDetails } from "../components/ChairmanPersonnelRequestDetails";
export const Example = () => {
  return (
    <div className="personel-view-details flex flex-col">
      <div
        className="personel-view-details-main flex flex-col bg-[#ffff] mx-auto w-full max-w-[800px] h-[600px]"
        style={{ boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.25)" }}
      >
        <h1 className="self-center">
          View <span id="main-span">Personnel</span> Request
        </h1>
        <div className="personnel-view-details-content flex flex-col mt-16 pl-16 pr-16 h-[100%]">
          <ChairmanPersonnelDetailsProfile personnelName={"Christine Marie Beto"} personnelEmail={"christinemarie.beto@gmail.com"} departmentName={"IT"}></ChairmanPersonnelDetailsProfile>
          <div className="personnel-request-details w-full max-w-[100%]">
            <p className="text-[clamp(1rem,3vw,1.7rem)]">Request Details</p>
            <ChairmanPersonnelRequestDetails requestType={"Examination"} duplex={"Back-to-back"} noPages={2} paperSize={"Short"}></ChairmanPersonnelRequestDetails>
            <div className="personel-view-details-buttons w-full max-w-[22rem] flex text-center justify-between">
              <Button buttonName={"Accept"} style={"bg-[#2a8400] w-full max-w-[10rem] text-white py-[0.5rem] rounded-[100rem]"}></Button>
              <Button buttonName={"Decline"} style={"bg-[#ee4444] w-full max-w-[10rem] text-white py-[0.5rem] rounded-[100rem]"}></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
