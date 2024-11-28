import React from 'react'
import Button from './Button'

export const StudentLaminationQueue = ({
    
    requestDetail,
    selectColor,
    optionColor,
    handleLaminationDetailsClick,
    handleLaminationQueueStatus,
    isTextStatus,
    removeRequest,
    removeMode,
    handleShowModal,  // Add handleShowModal as a prop
    proceedBill,
    removeQueue,
    confirmPaymentStatusChange
}) => {
    
    
    const personnelRequest = requestDetail?.lamination_student_request;
    const printRequestDetails=  personnelRequest?.lamination_request.lamination_request_details 


    

  
;
 

  return{
        "Student ID": personnelRequest? personnelRequest.lamination_request.student_id : "N/A",
        Name: personnelRequest ? `${personnelRequest.lamination_request.first_name} ${personnelRequest.lamination_request.last_name}` : 'N/A',
        "Time-In": requestDetail ? requestDetail.request_date : "N/A" ,
        "Type": personnelRequest ? personnelRequest.lamination_request.service_type.service_type_name : 'N/A',
        "Request-Type": printRequestDetails ? printRequestDetails.request_type.request_type_name : 'N/A',
        Status: isTextStatus ? (
            <span style={{ color: optionColor, fontWeight: 'bold' }}>
                {requestDetail.queue_status}
            </span>
        ) : (
            <select
                value={requestDetail.queue_status}
                style={{ color: optionColor }}
                className="dashboard-table-options font-bold"
                onChange={(e) => {
                    selectColor(e.target.value, requestDetail.id);
                    handleLaminationQueueStatus(requestDetail.id, e.target.value);
                }}
                
            >
                <option value="Pending" style={{ color: "#195ec2" }} className="font-bold">Pending</option>
                <option value="In Progress" style={{ color: "#f4b312" }} className="font-bold">In Progress</option>
                <option value="Ready to Claim" style={{ color: "#2A8400" }} className="font-bold">Ready To Claim</option>
            </select>
        ),
        Details: (  
            <a
                id="details-button"
                onClick={() => handleLaminationDetailsClick(requestDetail)}
                className="text-blue-600 cursor-pointer"
                style={{ fontSize: "1rem", textAlign: "center" }}
            >
                Details
            </a>
        ),
        Action: (
            <Button
                onClick={() => {
                    // proceedBill(requestDetail.personnel_print_request.id, personnelRequest.service_type.service_type_name )
                    removeQueue(requestDetail.id, personnelRequest.lamination_request.service_type.service_type_name)

                }}
                style="py-[0.4rem] px-[1.5rem] bg-[#2A8400] text-white cursor-pointer rounded"
                title={"Complete"}
                
            >
            </Button>
        ),
        "Payment Status": (
            <Button
                onClick={() =>
                    confirmPaymentStatusChange(
                        requestDetail.lamination_student_request.id,
                        requestDetail.lamination_student_request.paid_status === "Paid" ? "Unpaid" : "Paid"
                    )
                }
                style={`py-[0.4rem] px-[1.5rem] ${
                    requestDetail.lamination_student_request.paid_status === "Paid" ? "bg-[#2A8400]" : "bg-[#FF0000]"
                } text-white cursor-pointer rounded`}
                title={requestDetail.lamination_student_request.paid_status === "Paid" ? "Paid" : "Unpaid"}
            />
        )
        
    }
}
