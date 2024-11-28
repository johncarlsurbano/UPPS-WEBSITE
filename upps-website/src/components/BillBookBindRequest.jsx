import React from 'react'
import Button from '../components/Button.jsx'

const BillBookBindRequest = ({
    requestDetail,
    handleDetailsClick,
    generateBill,
    handlePaidStatus
}) => {
    
    const personnelRequest = requestDetail.request_details.user
    const personnelRequestDetails = requestDetail.request_details.book_binding_request_details

  
    const createdAt = requestDetail.updated_date;

    const [date,time]=createdAt.split("T")




  return {
    Name: personnelRequest ? `${personnelRequest.first_name} ${personnelRequest.last_name}` : "N/A",
    "Time-In": requestDetail ?  requestDetail.date : "N/A",
    "Request Type" : personnelRequestDetails ? personnelRequestDetails.request_type.request_type_name : "N/A",
    Type: requestDetail ? requestDetail.type : "N/A",
    Status:(
        <select name="" id="" value={requestDetail.paid_status} onChange={(e) => {
            // handle updating paid_status here
            handlePaidStatus(requestDetail.id, e.target.value)
        }}>
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
        </select>
    ),
    "Status Update": requestDetail ? date: "N/A",
    Details: (
        <Button
          title={"Details"}
          style={"bg-[#17132e] text-white px-[1rem] py-[0.2rem] rounded-[5px]"}
          onClick={() => handleDetailsClick(requestDetail)}
        ></Button>
    ),
    Action: (
        <Button
          title={"Generate"}
          style={"bg-[#70c053] text-white px-[1rem] py-[0.2rem] rounded-[5px]"}
          onClick={() => generateBill(requestDetail)}
        ></Button>
    )
  }
}

export default BillBookBindRequest