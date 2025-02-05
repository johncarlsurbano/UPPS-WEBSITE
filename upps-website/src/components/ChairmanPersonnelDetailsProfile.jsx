import personnelProfile from "../assets/tutin.png";

export const ChairmanPersonnelDetailsProfile = ({personnelName, personnelEmail, departmentName, style})=>{
    return(
        <div className={`personnel-view-profile-details gap-[2rem] flex w-full justify-center items-center mb-3 h-[fit-content] ${style} `}>
            <div className="personnel-view-profile-details-image flex w-full max-w-[8rem] h-[8rem] rounded-full object-cover">
              <img
                src={personnelProfile}
                alt="Personnel Profile"
                className="rounded-full border-[2px] border-[#17153a]"
              />
            </div>
            <div className="personnel-view-profile-user-details w-full max-w-[100%]">
              <h1>{personnelName}</h1>
              <p>{personnelEmail}</p>
              <p className="font-bold">
                <span id="main-span">{`${departmentName}-Department`}</span>
              </p>
            </div>
        </div>
    )
} 