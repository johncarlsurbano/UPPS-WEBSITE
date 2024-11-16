import React, { useState, useEffect } from "react";
import "../styles/PersonnelExaminationValidationTable.css";

export const PersonnelExaminationValidationTable = () => {
  const [personnelData, setPersonnelData] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch personnel print request data from the Django API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/personnelprintrequest/") 
      .then((response) => response.json())
      .then((data) => setPersonnelData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleDetailsClick = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  return (
    <div className="personnel-examination-validation-table">
      <div className="personnel-examination-validation-table-content">
        <div className="personnel-examination-validation-table-content-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Position</th>
                <th>Printing Type</th>
                <th>Quantity</th>
                <th>Duplex</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {personnelData.map((item, index) => (
                <tr key={index}>
                  <td>{`${item.first_name} ${item.last_name}`}</td>
                  <td>{item.department}</td>
                  <td>{item.position}</td>
                  <td>{item.print_request_details.printing_type.printing_type_name}</td>
                  <td>{item.print_request_details.quantity}</td>
                  <td>{item.print_request_details.duplex ? "Yes" : "No"}</td>
                  <td>
                    <button onClick={() => handleDetailsClick(item)}>
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedRequest && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>Request Details</h2>
            <p>
              <strong>Name:</strong> {selectedRequest.first_name} {selectedRequest.last_name}
            </p>
            <p>
              <strong>Department:</strong> {selectedRequest.department}
            </p>
            <p>
              <strong>Position:</strong> {selectedRequest.position}
            </p>
            <p>
              <strong>Printing Type:</strong> {selectedRequest.print_request_details.printing_type.printing_type_name}
            </p>
            <p>
              <strong>Quantity:</strong> {selectedRequest.print_request_details.quantity}
            </p>
            <p>
              <strong>Duplex:</strong> {selectedRequest.print_request_details.duplex ? "Yes" : "No"}
            </p>
            <p>
              <strong>Paper Type:</strong> {selectedRequest.print_request_details.paper_type.paper_type}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
