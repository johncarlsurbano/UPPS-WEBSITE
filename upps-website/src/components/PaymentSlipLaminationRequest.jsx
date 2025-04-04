import React from 'react'
import Button from './Button.jsx'

const PaymentSlipLaminationRequest = ({
    requestDetail,
    handlePaymentSlipDetails,
    generateBill,
    handlePaidStatus
}) => {
    const personnelRequest = requestDetail.lamination_request
    const personnelRequestDetails = requestDetail.lamination_request.lamination_request_details

    const createdAt = requestDetail.updated_date;

    const [date,time]=createdAt.split("T")

    console.log(requestDetail)


  return {
    Name: personnelRequest ? `${personnelRequest.first_name} ${personnelRequest.last_name}` : "N/A",
    "Time-In": requestDetail ?  requestDetail.date : "N/A",
    "Request" : personnelRequestDetails ? personnelRequestDetails.request_type.request_type_name : "N/A",
    Type: requestDetail ? requestDetail.type : "N/A",
    Status: (
      <span
          style={{
              color: requestDetail?.paid_status === "Paid" ? "green" : "inherit", fontWeight: "bold"
          }}
      >
          {requestDetail?.paid_status || "N/A"}
      </span>
  ),
    "Status Update": requestDetail ? date: "N/A",
    Details: (
        <Button
          title={"Details"}
          style={"bg-[#17132e] text-white px-[1rem] py-[0.2rem] rounded-[5px]"}
          onClick={() => handlePaymentSlipDetails(requestDetail)}
        ></Button>
    )
  }
}

export default PaymentSlipLaminationRequest