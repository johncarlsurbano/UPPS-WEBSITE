import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/PersonnelExaminationValidationTable.css";

export const PersonnelExaminationValidationTable = () => {
  const [personnelRequests, setPersonnelRequests] = useState([]);
  const [queueRequests, setQueueRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedQueueRequest, setSelectedQueueRequest] = useState(null);
  const [selectedReadyToClaimRequest, setSelectedReadyToClaimRequest] = useState(null);
  const [modalQueueOpen, setModalQueueOpen] = useState(false);
  const [modalReadytoClaimOpen, setModalReadytoClaimOpen] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [department, setDepartment] = useState([]);
  const [position, setPosition] = useState([])
  const [printingType, setPrintingType] = useState([])
  const [paperType, setPaperType] = useState([])
  const [readyToClaimRequest, setReadyToClaimRequest] = useState([]);
  const [displayPersonnelPrintRequest, setDisplayPersonnelPrintRequest] = useState([]);


  // Function to fetch personnel requests
  // const fetchPersonnelRequests = async () => {
  //   try {
  //     const response = await axios.get("http://127.0.0.1:8000/api/personnelprintrequest/");
  //     setPersonnelRequests(response.data);
  //   } catch (err) {
  //     setError("Error fetching personnel requests.");
  //     console.error(err);
  //   }
  // };

  // Function to fetch queue requests
  const fetchDepartment = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/department/')
      setDepartment(response.data)
    } catch (err) {
      setError("Error fetching department.");
      console.error(err);
   }
  }

  const fetchPosition = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/position/')
      setPosition(response.data)
    } catch (err) {
      setError("Error fetching department.");
      console.error(err);
   }
  }

  const fetchPrintingType = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/printingtype/')
      setPrintingType(response.data)
    } catch (err) {
      setError("Error fetching printing type.");
      console.error(err);
    }
  }
  const fetchPaperType = async () => {
    try{
      const response = await axios.get('http://127.0.0.1:8000/api/papertype/')
      setPaperType(response.data)
    } catch (err) {
      setError("Error fetching paper type.");
      console.error(err);

  }}

  const fetchPersonnelPrintRequestQueue = async () => {
    try{
      const response = await axios.get('http://127.0.0.1:8000/api/displaypersonnelrequest/')
      setDisplayPersonnelPrintRequest(response.data);

    } catch (err) {
      setError("Error fetching personnel print request queue.");
      console.error(err);
    }
  }

    // const fetchPosition = async () => {
    //   try {
    //     const response = await axios.get('')
    //   }
    // }

  const fetchQueueRequests = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/queue/");
      const filteredRequest = response.data.filter(request => request.queue_status === "Pending" || request.queue_status === "In Progress")
      setQueueRequests(filteredRequest);
    } catch (err) {
      setError("Error fetching queue requests.");
      console.error(err);
    }
  };

  const fetchReadytoClaimRequests = async () => {
    try{
      const response = await axios.get("http://127.0.0.1:8000/api/retrievereadytoclaim/")
      setReadyToClaimRequest(response.data);
    } catch (err) {
      setError("Error fetching ready to claim requests.");
      console.error(err);
    }
  }

  // Fetch pending requests
  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/requeststatus/pending/");
      setPendingRequests(response.data);
    } catch (err) {
      setError("Error fetching pending requests.");
      console.error(err);
    }
  };
  


  // Fetch all requests on mount
  useEffect(() => {
    // fetchPersonnelRequests();
    fetchDepartment();
    fetchPosition();
    fetchQueueRequests();
    fetchPendingRequests();
    fetchPrintingType();
    fetchPaperType();
    fetchReadytoClaimRequests();
    fetchPersonnelPrintRequestQueue();
  }, []);

  const handleQueueStatus = async (id, newStatus) => {
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/updatequeue/${id}/`, {
        queue_status: newStatus,
      });

      console.log(response.data)
      setDisplayPersonnelPrintRequest((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, queue_status: response.data.queue_status } : request
        )
      );

      // setQueueRequests(prevRequest => setQueueRequests(prevRequest.map(request => request.id === id ? {...request, queue_status:newStatus}
      //   :request
      //   )
      //   .filter(request => request.queue_status === "Pending" || request.queue_status === "In Progress" )
      //  ))


      // setQueueDetails(prevQueueRequests => 
      //   prevQueueRequests.map(request =>
      //     request.id === id ? { ...request, queue_status: newStatus } : request
      //   )
      //   .filter(request => request.queue_status === "pending" || request.queue_status === "In Progress")
      // );
      

      await fetchReadytoClaimRequests(); 

      setMessage("Queue status updated successfully.");
      console.log(queueRequests)

    } catch (err) {
      setError("Error updating queue status.");
      console.error(err);
    }
  };

  const handleDetailsClick = request => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  const handleQueueDetailsClick = request => {
    const requestWithDefaults = {
      ...request,
      personnel_print_request: {
        ...request.personnel_print_request,
        print_request_details: {
          ...request.personnel_print_request.print_request_details,
          printing_type: request.personnel_print_request.print_request_details?.printing_type || "N/A",
          paper_type: request.personnel_print_request.print_request_details?.paper_type || "N/A",
          quantity: request.personnel_print_request.print_request_details?.quantity || 0,
          duplex: request.personnel_print_request.print_request_details?.duplex || false,
        },
      },
    };

    setSelectedQueueRequest(requestWithDefaults);
    
    setModalQueueOpen(true);
  };
  const handleReadytoClaimRequest = request => {
    setSelectedReadyToClaimRequest(request);
    setModalReadytoClaimOpen(true);
  };
  console.log(selectedReadyToClaimRequest);
  


  console.log(selectedQueueRequest)

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRequest(null);
  };

  const handleQueueCloseModal = () => {
    setModalQueueOpen(false);
    setSelectedQueueRequest(null);
  };

  const handleReadytoClaimCloseModal = () => {
    setModalQueueOpen(false);
    setSelectedQueueRequest(null);
    setSelectedReadyToClaimRequest(null);
  }

  const handleAccept = async id => {
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/updaterequest/${id}/`, {
        request_status: "accepted",
      });

      const updatedRequest = response.data;

      console.log(updatedRequest.id)

      await axios.post('http://127.0.0.1:8000/api/queue/', {personnel_print_request: updatedRequest.id, queue_status: "Pending" })

      // if (!updatedRequest.personnel_print_request) {
      //   updatedRequest.personnel_print_request = {
      //     first_name: updatedRequest.first_name,
      //     last_name: updatedRequest.last_name,
      //     department: updatedRequest.department,
      //     position: updatedRequest.position,
      //   };
      // }

      setPendingRequests(prevPendingRequests =>
        prevPendingRequests.filter(request => request.id !== id)
      );

      

      setQueueRequests(prevQueueRequests => [...prevQueueRequests, updatedRequest]);

      setMessage("Request accepted successfully.");
      handleCloseModal();
      
      await fetchQueueRequests();
    } catch (error) {
      setError("Error updating request status.");
      console.error(error);
    }
  };

  const handleReject = async id => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/updaterequest/${id}/`, {
        request_status: "declined",
      });

      setPendingRequests(prevPendingRequests =>
        prevPendingRequests.filter(request => request.id !== id)
      );

      // Refetch the updated list
      setMessage("Request declined successfully.");
      handleCloseModal();
    } catch (error) {
      setError("Error updating request status.");
      console.error(error);
    }
  };

  const handleDeleteRequest = async (id) => {

    const response = await axios.delete(`http://127.0.0.1:8000/api/deleterequest/${id}/`)
    console.log(response.data)
    
    try {
      setMessage("Request deleted successfully")
    } catch (err) {
      setError("Error deleting request")
      console.log(err)
    }
    
  }

  useEffect(() => {
    if (error) {
      alert(error);
      setError(null); // Clear error after showing
    }
  }, [error]);

  useEffect(() => {
    if (message) {
      alert(message);
      setMessage(""); // Clear message after showing
    }
  }, [message]);

  //MAPPING
  const departmentMap = {};
  department.forEach(department => {
  departmentMap[department.id] = department.department_name; 
  });

  const positionMap = {};
  position.forEach(position => {
    positionMap[position.id] = position.position_name;
  })
  
  const printTypeMap = {};
  printingType.forEach(printingType => {
    printTypeMap[printingType.id] = printingType.printing_type_name;
  })

  const paperTypeMap = {};
  paperType.forEach(paperType => {
    paperTypeMap[paperType.id] = paperType.paper_type;
  })


  return (
    <div className="personnel-examination-validation-table">
      <div className="personnel-examination-validation-table-content">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Position</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(pendingRequests) && pendingRequests.length > 0 ? (
              pendingRequests.map(request => (
                <tr key={request.id}>
                  <td>
                    {request.first_name} {request.last_name}
                  </td>
                  <td>{departmentMap[request.department]}</td> {/* Change here */}
                  <td>{positionMap[request.position]}</td>
                  <td>
                    <button onClick={() => handleDetailsClick(request)}>
                      Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No pending requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {modalOpen && selectedRequest && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>Request Details</h2>
            <p>
              Name: {selectedRequest.first_name} {selectedRequest.last_name}
            </p>
            <p>Department: {departmentMap[selectedRequest.department]}</p>
            <p>Position: {positionMap[selectedRequest.position]}</p>
            <p>
              Printing Type: {printTypeMap[selectedRequest.print_request_details.printing_type]}
            </p>
            <p>
              Paper Type: {paperTypeMap[selectedRequest.print_request_details?.paper_type] || "N/A"}
            </p>
            <p>Quantity: {selectedRequest.print_request_details?.quantity || 0}</p>
            <p>
              Duplex: {selectedRequest.print_request_details?.duplex ? "Yes" : "No"}
            </p>
            <p>Status: {selectedRequest.request_status}</p>
            <button onClick={() => handleAccept(selectedRequest.id)}>
              Accept
            </button>
            <button onClick={() => handleReject(selectedRequest.id)}>Reject</button>
          </div>
        </div>
      )}
      {/* Queue Requests Table */}
      <div className="queue-requests-table">
        <h2>Queue Table</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Position</th>
              <th>Request Date</th>
              <th>Details</th>
              <th>Queue Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(displayPersonnelPrintRequest) && displayPersonnelPrintRequest.length > 0 ? (
              displayPersonnelPrintRequest.map(request => request.queue_status !== "Ready to Claim" &&  (
                <tr key={request.id}>
                  <td>
                    {request.personnel_print_request.first_name} {request.personnel_print_request.last_name}
                  </td>
                  <td>{departmentMap[request.personnel_print_request.department] || "Unknown"}</td>
                  <td>{positionMap[request.personnel_print_request.position]}</td>
                  <td>{request.request_date}</td>
                  <td>
                    <button onClick={() => handleQueueDetailsClick(request)}>
                      Details
                    </button>
                  </td>
                  <td>
                    <select
                      value={request.queue_status}
                      onChange={e => handleQueueStatus(request.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Ready to Claim">Ready to Claim</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No requests in the queue.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {modalQueueOpen && selectedQueueRequest && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleQueueCloseModal}>
              &times;
            </span>
            <h2>Request Details</h2>
            <p>
              Name: {selectedQueueRequest.personnel_print_request.first_name} {selectedQueueRequest.personnel_print_request.last_name}
            </p>
            <p>Department: {departmentMap[selectedQueueRequest.personnel_print_request.department]}</p>
            <p>Position: {positionMap[selectedQueueRequest.personnel_print_request.position]}</p>
            <p>
              Printing Type: {printTypeMap[selectedQueueRequest.personnel_print_request.print_request_details.printing_type] || "N/A"}
            </p>
            <p>
              Paper Type: {paperTypeMap[selectedQueueRequest.personnel_print_request.print_request_details.paper_type] || "N/A"}
            </p>
            <p>Quantity: {selectedQueueRequest.personnel_print_request.print_request_details?.quantity || 0}</p>
            <p>
              Duplex: {selectedQueueRequest.personnel_print_request.print_request_details?.duplex ? "Yes" : "No"}
            </p>
            <button onClick={handleQueueCloseModal}>Close</button>
          </div>
        </div>
      )}

<div className="queue-requests-table">
        <h2>Ready To Claim Table</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Position</th>
              <th>Request Date</th>
              <th>Details</th>
              <th>Queue Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(displayPersonnelPrintRequest) && displayPersonnelPrintRequest.length > 0 ? (
              displayPersonnelPrintRequest.map(request => request.queue_status === "Ready to Claim" &&(
                <tr key={request.id}>
                  <td>
                    {request.personnel_print_request.first_name} {request.personnel_print_request.last_name}
                  </td>
                  <td>{departmentMap[request.personnel_print_request.department] || "Unknown"}</td>
                  <td>{positionMap[request.personnel_print_request.position]}</td>
                  <td>{request.request_date}</td>
                  <td>
                    <button onClick={() => handleReadytoClaimRequest(request)}>
                      Details
                    </button>
                  </td>
                  <td>
                    <p className="text-sm">{request.queue_status}</p>
                  </td>
                  <td><button onClick={() => handleDeleteRequest(request.id)}>Delete</button></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No requests in the queue.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {modalReadytoClaimOpen && selectedReadyToClaimRequest && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleReadytoClaimCloseModal}>
              &times;
            </span>
            <h2>Request Details</h2>
            <p>
              Name: {selectedReadyToClaimRequest.personnel_print_request.first_name} {selectedReadyToClaimRequest.personnel_print_request.last_name}
            </p>
            <p>Department: {departmentMap[selectedReadyToClaimRequest.personnel_print_request.department]}</p>
            <p>Position: {positionMap[selectedReadyToClaimRequest.personnel_print_request.position]}</p>
            <p>
              Printing Type: {printTypeMap[selectedReadyToClaimRequest.personnel_print_request.print_request_details.printing_type] || "N/A"}
            </p>
            <p>
              Paper Type: {paperTypeMap[selectedReadyToClaimRequest.personnel_print_request.print_request_details.paper_type] || "N/A"}
            </p>
            <p>Quantity: {selectedReadyToClaimRequest.personnel_print_request.print_request_details?.quantity || 0}</p>
            <p>
              Duplex: {selectedReadyToClaimRequest.personnel_print_request.print_request_details?.duplex ? "Yes" : "No"}
            </p>
            <button onClick={handleReadytoClaimCloseModal}>Close</button>
          </div>
        </div>
      )}
      
      
      
    </div>
    
  );
};
