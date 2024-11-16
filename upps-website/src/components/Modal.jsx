import React from 'react'

export const Modal = () => {
  return (
    <div>
         {modalOpen && selectedQueueRequests && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>Request Details</h2>
            <p>
              Name: {selectedQueueRequests.personnel_print_request.first_name} {selectedQueueRequests.personnel_print_request.last_name}
            </p>
            <p>Department: {selectedQueueRequests.personnel_print_request.department}</p>
            <p>Position: {selectedQueueRequests.personnel_print_request.position}</p>
            <p>
              Printing Type:{" "}
              {selectedQueueRequests.personnel_print_request.print_request_details.printing_type.printing_type_name}
            </p>
            <p>
              Paper Type:{" "}
              {selectedQueueRequests.personnel_print_request.print_request_details.paper_type.paper_type}
            </p>
            <p>Quantity: {selectedQueueRequests.personnel_print_request.print_request_details.quantity}</p>
            <p>
              Duplex:{" "}
              {selectedQueueRequests.personnel_print_request.print_request_details.duplex ? "Yes" : "No"}
            </p>
            <button onClick={handleCloseModal}>Close</button>

          </div>
        </div>
      )}
    </div>
  )
}
