import React from 'react';
import axios from 'axios';
import Button from '../components/Button';

export const QueueRequest = ({
    queueDetail,
    selectColor,
    optionColor,
    handleDetailsClick,
    handleQueueStatus,
    isTextStatus,
    removeRequest,
    removeMode,
    handleShowModal,  // Add handleShowModal as a prop
    proceedBill
}) => {
    const personnelRequest = queueDetail.personnel_print_request;
    const printRequestDetails = personnelRequest ? personnelRequest.print_request_details : null;

    const handleRemoveClick = (id) => {
        handleShowModal(id);  // Trigger the modal with the request id
    };

    return {
        Name: personnelRequest ? `${personnelRequest.first_name} ${personnelRequest.last_name}` : 'N/A',
        "Time-In": queueDetail.request_date || 'N/A',
        "Request-Type": printRequestDetails ? printRequestDetails.printing_type.printing_type_name : 'N/A',
        Status: isTextStatus ? (
            <span style={{ color: optionColor, fontWeight: 'bold' }}>
                {queueDetail.queue_status}
            </span>
        ) : (
            <select
                value={queueDetail.queue_status}
                style={{ color: optionColor }}
                className="dashboard-table-options font-bold"
                onChange={(e) => {
                    selectColor(e.target.value, queueDetail.id);
                    handleQueueStatus(queueDetail.id, e.target.value);
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
                onClick={() => handleDetailsClick(queueDetail)}
                className="text-blue-600 cursor-pointer"
                style={{ fontSize: "1rem", textAlign: "center" }}
            >
                Details
            </a>
        ),
        Action: (
            <Button
                onClick={() => proceedBill(queueDetail.personnel_print_request.id)}
                style="py-[0.4rem] px-[1.5rem] bg-[#2A8400] text-white cursor-pointer rounded"
                title={"Complete"}
            >
            </Button>
        )
    };
};
