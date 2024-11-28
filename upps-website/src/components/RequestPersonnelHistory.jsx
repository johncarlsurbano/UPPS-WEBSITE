export const RequestPersonnelHistory = (requestDetail, handleDetailsClick) => {
    const printRequestDetails = requestDetail.print_request_details

    const createdAt = requestDetail.created_at;

    const [date,time]=createdAt.split("T")

    return {
        "Type of Request": printRequestDetails.request_type.request_type_name|| 'N/A',
        "Date": date || 'N/A',
        "Details": (
            <a
                id="details-button"
                onClick={() => handleDetailsClick(requestDetail)}
                className="text-blue-600 cursor-pointer"
                style={{ fontSize: "1rem", textAlign: "center" }}
            >
                Details
            </a>
        ),
    };
};
