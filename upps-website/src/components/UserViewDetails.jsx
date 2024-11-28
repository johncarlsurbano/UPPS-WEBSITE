import Button from "./Button.jsx";
import { ChairmanPersonnelDetailsProfile } from "./ChairmanPersonnelDetailsProfile.jsx";
import { ChairmanPersonnelRequestDetails } from "./ChairmanPersonnelRequestDetails.jsx";

export const UserViewDetails = ({ request, onClose, handleAcceptUser, handleDeniedUser }) => {
  const printDetails = request ? request.print_request_details : null;

  const openFile = (request) => {
    window.open(request.pdf, "_blank"); 
  }

  return (
    <div className=" flex flex-col fixed inset-0 bg-black bg-opacity-50 justify-center items-center z-50">
      <div
        className="personel-view-details-main flex flex-col bg-[#ffff] mx-auto w-full max-w-[500px] h-[400px]"
        style={{ boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.25)" }}
      >
        <div className="flex justify-between mx-8">
          <div></div>
        <h1 className="self-center mt-6 ml-8">
          View <span id="main-span">Personnel</span> Request
        </h1>
        <button
          className=" text-4xl text-black hover:text-red-600 mt-3  px-2.5 text-center"
          onClick={onClose}
        >
          &times;
        </button>
        </div>
        

        <div className="personnel-view-details-content flex flex-col mt-10 pl-16 pr-16 h-[100%] ">
          <ChairmanPersonnelDetailsProfile
            personnelName={`${request?.first_name || 'N/A'} ${request?.last_name || 'N/A'}`}
            personnelEmail={request?.email || 'N/A'}
            departmentName={request?.department?.department_name || 'N/A'}
            style={'flex-col text-center'}
          />
          <div className="personnel-request-details w-full max-w-[100%]">
            <div className="personel-view-details-buttons w-full max-w-[22rem] flex text-center justify-between">
              <Button
                title="Accept"
                style="bg-[#2a8400] w-full max-w-[10rem] text-white py-[0.5rem] rounded-[100rem]"
                onClick={ () => {handleAcceptUser(request.id)}}
              />
              <Button
                title="Decline"
                onClick={() => {handleDeniedUser(request.id)}}
                style="bg-[#ee4444] w-full max-w-[10rem] text-white py-[0.5rem] rounded-[100rem]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
