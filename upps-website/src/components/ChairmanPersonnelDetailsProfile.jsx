import personnelProfile from "../assets/tutin.jpg";

export const ChairmanPersonnelDetailsProfile = ({personnelName, personnelEmail, departmentName})=>{
    return(
        <div className="personnel-view-profile-details flex  w-full justify-start px-10 items-center mb-16 h-[10rem]  ">
            <div className="personnel-view-profile-details-image flex w-full max-w-[8rem] h-[8rem] rounded-full object-cover">
              <img
                src={personnelProfile}
                alt="Personnel Profile"
                className="rounded-full border-[2px] border-[#17153a]"
              />
            </div>
            <div className="personnel-view-profile-user-details ml-8">
              <h1>{personnelName}</h1>
              <p>{personnelEmail}</p>
              <p className="font-bold">
                <span id="main-span">{`${departmentName}-Department`}</span>
              </p>
            </div>
        </div>
    )
}