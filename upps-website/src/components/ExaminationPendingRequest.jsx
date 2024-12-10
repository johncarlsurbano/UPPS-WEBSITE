import Button from './Button.jsx'
export const ExaminationPendingRequest = ({
    requestDetail,
    selectColor,
    optionColor,
    handleDetailsClick,
    isTextStatus,
    proceedBill,
}) => {

    const examRequestDetails = requestDetail ? requestDetail.print_request_details : null;
    
    const createdAt = requestDetail.created_at;

    const [date,time]=createdAt.split("T")

    

    console.log(requestDetail)
    return {
        Name: requestDetail ? `${requestDetail.user.first_name} ${requestDetail.user.last_name}` : 'N/A',
        "Request-Date": date,
        "Request-Type": examRequestDetails ? examRequestDetails.request_type.request_type_name : 'N/A',
        Position: requestDetail ? requestDetail.user.position.position_name : 'N/A',
        Department: requestDetail ? requestDetail.user.department.department_name : 'N/A',
        Details: (

            <Button
                onClick={() => handleDetailsClick(requestDetail)}
                style="py-[0.4rem] px-[1.5rem] bg-[#f4b312] text-white cursor-pointer rounded"
                title={"View Details"}
            >
            </Button>
        ),
        Status: (
            <span style={ {color: (requestDetail.request_status) === "accepted"? "green" : "red" }}>{requestDetail? requestDetail.request_status: "N/A"}</span>
        )
       
    };
};
