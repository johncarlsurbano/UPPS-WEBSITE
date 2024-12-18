import React from 'react'

const PersonnelRequestDetails = () => {
  return (
    <div className="personel-view-details flex flex-col ">
      <div
        className="personel-view-details-main flex flex-col bg-[#ffff] mx-auto w-full max-w-[800px] h-[600px]"
        style={{ boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.25)" }}
      >
        <h1 className="self-center">
          View <span id="main-span">Personnel</span> Requesta
        </h1>
        <div className="personnel-view-details-content flex flex-col mt-16 pl-16 pr-16 h-[100%]">
          <div className="personnel-view-profile-details flex  w-full max-w-[29rem] justify-between items-center mb-16 h-[10rem]">
            <div className="personnel-view-profile-details-image flex w-full max-w-[8rem] h-[8rem] rounded-full object-cover">
              <img
                src={personnelProfile}
                alt="Personnel Profile"
                className="rounded-full border-[2px] border-[#17153a]"
              />
            </div>
            <div className="personnel-view-profile-user-details">
              <h1>Christine Marie Beto</h1> 
              <p>christine.beto@ustp.edu.ph</p>
              <p className="font-bold">
                <span id="main-span">IT-Department</span>
              </p>
            </div>
          </div>
          <div className="personnel-request-details w-full max-w-[100%]">
            <p className="text-[clamp(1rem,3vw,1.7rem)]">Request Details</p>
            <div className="personnel-request-details-content ml-10 mt-3 mb-10">
              <div className="flex flex-col">
                <p>Examination</p>
                <div className="flex  justify-between items-center">
                  <div className="flex">
                    <p className="text-[clamp(1rem,3vw,1rem)]">Back to Back,</p>
                    <p className="text-[clamp(1rem,3vw,1rem)]">20 Pages,</p>
                    <p className="text-[clamp(1rem,3vw,1rem)]">Short</p>
                  </div>
                  <a href="" id="view-file-button">
                    View File
                  </a>
                </div>
              </div>
              <a href="View File"></a>
            </div>
            <div className="personel-view-details-buttons w-full max-w-[22rem] flex text-center justify-between">
              <a href="" className="accept-button">
                Accept
              </a>
              <a href="" className="decline-button">
                Decline
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonnelRequestDetails