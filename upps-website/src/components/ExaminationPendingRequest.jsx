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

    


    return {
        Name: requestDetail ? `${requestDetail.first_name} ${requestDetail.last_name}` : 'N/A',
        "Request-Date": date,
        "Request-Type": examRequestDetails ? examRequestDetails.printing_type.printing_type_name : 'N/A',
        Position: requestDetail ? requestDetail.position.position_name : 'N/A',
        Department: requestDetail ? requestDetail.department.department_name : 'N/A',
        Details: (

            <Button
                onClick={() => handleDetailsClick(requestDetail)}
                style="py-[0.4rem] px-[1.5rem] bg-[#f4b312] text-white cursor-pointer rounded"
                title={"View Details"}
            >
            </Button>
        ),
       
    };
};
