import Button from './Button.jsx'
export const UserData = ({
    userDetail,
    selectColor,
    optionColor,
    handleDetailsClick,
    isTextStatus,
    proceedBill,
    handleUserDetailsClick
}) => {


    
    return {
        Name: userDetail ? `${userDetail.first_name} ${userDetail.last_name}` : 'N/A',
        "Time-In": userDetail ? userDetail.date : "N/A",
        Position: userDetail ? userDetail.position.position_name : 'N/A',
        Department: userDetail ? userDetail.department.department_name : 'N/A',
        Details: (

            <Button
                onClick={() => handleUserDetailsClick(userDetail)}
                style="py-[0.4rem] px-[1.5rem] bg-[#f4b312] text-white cursor-pointer rounded"
                title={"View Details"}
            >
            </Button>
        ),
        Status:(
            
            <span style={ {color: userDetail.account_status === "Active" ? "green" : "red" }}>{userDetail? userDetail.account_status: "N/A"}</span>
        )
       
    };
};
