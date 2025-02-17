export const QueueRequest = ({
    queueDetail,
    selectColor,
    color,
    handleDetailsClick,
    handleQueueStatus,
    isTextStatus,
    removeQueue,
    proceedBill,
    user // Pass the user as a prop
}) => {
    
    const personnelRequest = queueDetail.personnel_print_request.user;
    const printRequestDetails = queueDetail ? queueDetail.personnel_print_request.print_request_details : null;
    const isUrgent = queueDetail ? queueDetail.personnel_print_request.urgent === true : null;

    console.log(user.id)
    
    return {
        isUrgent,
        Name: personnelRequest ? `${personnelRequest.first_name} ${personnelRequest.last_name}` : 'N/A',
        "Time-In": queueDetail.request_date || 'N/A',
        "Type": printRequestDetails ? printRequestDetails.printing_type.printing_type_name : 'N/A',
        "Request-Type": printRequestDetails ? printRequestDetails.request_type.request_type_name : 'N/A',
        Status: isTextStatus ? (
            <span style={{ color: 'black', fontWeight: 'bold' }}>
                {queueDetail.queue_status}
            </span>
        ) : (
            <select
                value={queueDetail.queue_status}
                style={{ color: 'black' }}
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
        ...(user.id === personnelRequest?.id || user.role === "Office Head") && {
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
                <button
                    onClick={() => {
                        proceedBill(queueDetail.personnel_print_request.id, printRequestDetails.request_type.request_type_name);
                        removeQueue(queueDetail.id, queueDetail.personnel_print_request.service_type.service_type_name);
                    }}
                    className="py-[0.4rem] px-[1.5rem] bg-[#2A8400] text-white cursor-pointer rounded"
                    title="Complete"
                >
                    Complete
                </button>
            )
        },
      
    };
};
