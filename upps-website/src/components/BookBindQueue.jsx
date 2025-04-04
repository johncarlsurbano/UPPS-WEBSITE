import React from 'react'
import Button from './Button'

export const BookBindQueue = ({

    requestDetail,
    selectColor,
    optionColor,
    handleBookBindDetailsClick,
    handleBookBindQueueStatus,
    isTextStatus,
    removeRequest,
    removeMode,
    handleShowModal,  // Add handleShowModal as a prop
    proceedBookBindBill,
    removeQueue,
    user
}) => {
    

    const bookbindRequest = requestDetail?.book_bind_personnel_request;
    const personnelRequest = bookbindRequest?.user;
    const printRequestDetails=  bookbindRequest?. book_binding_request_details 

    

  
;
 

  return{
        Name: personnelRequest ? `${personnelRequest.first_name} ${personnelRequest.last_name}` : 'N/A',
        "Time-In": requestDetail ? requestDetail.request_date : "N/A" ,
        "Type": bookbindRequest ? bookbindRequest.service_type.service_type_name : 'N/A',
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
                    handleBookBindQueueStatus(requestDetail.id, e.target.value);
                }}
                
            >
                <option value="Pending" style={{ color: "#195ec2" }} className="font-bold">Pending</option>
                <option value="In Progress" style={{ color: "#f4b312" }} className="font-bold">In Progress</option>
                <option value="Ready to Claim" style={{ color: "#2A8400" }} className="font-bold">Ready To Claim</option>
            </select>
        ),
        ...(user.id === personnelRequest?.id || user.role === "Office Head") && {
            Details: (  
                <a
                    id="details-button"
                    onClick={() => handleBookBindDetailsClick(requestDetail)}
                    className="text-blue-600 cursor-pointer"
                    style={{ fontSize: "1rem", textAlign: "center" }}
                >
                    Details
                </a>
            ),
            Action: (
                <Button
                    onClick={() => {
                        proceedBookBindBill(requestDetail.book_bind_personnel_request.id)
                        removeQueue(requestDetail.id, requestDetail.book_bind_personnel_request.service_type.service_type_name)
                    }}
                    style="py-[0.4rem] px-[1.5rem] bg-[#2A8400] text-white cursor-pointer rounded"
                    title={"Complete"}
                    
                >
                </Button>
            )
        },
        
        
    }
}
