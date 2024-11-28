import { useState, useEffect } from "react";
import { GenericTable } from "../components/GenericTable.jsx";
import { QueueRequest } from "../components/QueueRequest.jsx";
import { RequestDetailsModal } from "../components/RequestDetailsModal.jsx";
import Alert from '../components/Alert.jsx';  
import DashboardCounterBox from '../components/DashboardCounterBox.jsx';
import { useNavigate } from "react-router-dom";

import axios from 'axios';
import BillRequest from "../components/BillRequest.jsx";


export const PersonnelPrintingQueue = () => {
  const [optionColor, setOptionColor] = useState({});
  const [queueRequests, setQueueRequests] = useState([]);
  const [printingType, setPrintingType] = useState([]);
  const [readyToClaimRequest, setReadyToClaimRequest] = useState([]);
  const [selectedQueueRequest, setSelectedQueueRequest] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [removeMode, setRemoveMode] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [alertShowModal, setAlertShowModal] = useState(false);
  const [getPendingRequests, setGetPendingRequests] = useState([]);
  const [getAllRequests, setGetAllRequests] = useState([]);
  const [getBillRequest, setBillRequest] = useState([]);

  const navigate = useNavigate();


  const selectInitialColor = (status) => {
    switch (status) {
      case "Pending":
        return "#195ec2";
      case "In Progress":
        return "#f4b312";
      case "Ready to Claim":
        return "#2A8400";
      default:
        return "#195ec2";
    }
  };

  

  const removeRequestFromState = (id) => {
    setReadyToClaimRequest((prev) =>
      prev.filter((request) => request.id !== id)
    );
  };

  const toggleRemoveMode = () => {
    setRemoveMode((prev) => !prev);
    
};

console.log(removeMode)

  const proceedBill = async (queueRequest) => {
    try{
      const response = await axios.post('http://127.0.0.1:8000/api/bill/', {
        "description": "BillingRequest",
        "request": queueRequest
      })
      
      const data = response.data

      navigate("/officehead/transactionbill/")

      // setBillRequest(data);
      console.log(data)

      
      
    } catch(e){
      console.error("Error proceeding bill:", e);
    }
  }

  console.log(getBillRequest)


  const handleQueueStatus = async (id, newStatus) => {
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/updatequeue/${id}/`, {
        queue_status: newStatus,
      });


      setQueueRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, queue_status: response.data.queue_status } : request
        )
      );

      await fetchQueueRequests();
    } catch (err) {
      console.error("Error updating queue status:", err);
    }
  };

  const handleDetailsClick = (queueDetail) => {
    setSelectedQueueRequest(queueDetail);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const fetchPrintingType = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/printingtype/');
      setPrintingType(response.data);
    } catch (err) {
      console.error("Error fetching printing type:", err);
    }
  };

  const fetchQueueRequests = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/displaypersonnelqueue/print/");
      const filteredRequests = response.data.filter(
        (request) => request.queue_status !== "Ready to Claim"
      );
      const readyToClaimRequests = response.data.filter(
        (request) => request.queue_status === "Ready to Claim"
      );
      console.log(response.data)

      const initialColors = {};
      response.data.forEach((request) => {
        initialColors[request.id] = selectInitialColor(request.queue_status);
      });
      setOptionColor(initialColors);

      const mappedRequests = filteredRequests.map((queueDetail) =>
        QueueRequest({
          queueDetail,
          selectColor: selectInitialColor,
          optionColor: initialColors[queueDetail.id],
          handleDetailsClick,
          handleQueueStatus,
          isTextStatus: false,
        })
      );

      const mappedReadyToClaimRequest = readyToClaimRequests.map((queueDetail) =>
        QueueRequest({
          queueDetail,
          selectColor: selectInitialColor,
          optionColor: initialColors[queueDetail.id],
          handleDetailsClick,
          handleQueueStatus,
          isTextStatus: true,
          removeMode,
          removeRequest: removeRequestFromState,
          handleShowModal: handleShowModal,
          proceedBill,

        })
      );

      setGetAllRequests(response.data)
      setReadyToClaimRequest(mappedReadyToClaimRequest);
      setQueueRequests(mappedRequests);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShowModal = (id) => {
        setRequestToDelete(id);  // Store the id to delete in the modal
        setAlertShowModal(true);  // Show the confirmation modal
    };

    const handleConfirmDelete = async () => {
      try {
          const response = await axios.delete(`http://127.0.0.1:8000/api/deleterequest/${requestToDelete}/`);
          console.log(response.data);
          removeRequestFromState(requestToDelete);  // Update state to remove the request
          setAlertShowModal(false);  // Close the modal
          alert("Request deleted successfully");
          window.location.reload(false);
      } catch (err) {
          console.error("Error deleting request:", err);
          alert("Error deleting request");
      }
  };

  useEffect(() => {
    fetchPrintingType();
  }, [removeMode]);

  useEffect(() => {
    if (printingType.length > 0) {
      fetchQueueRequests();
    }
  }, [printingType]);

  const headers1 = ["Name", "Time-In", "Type", "Request-Type", "Status", "Details"];
  const headers2 = ["Name", "Time-In", "Request-Type", "Status", "Details" ,"Action"];


  return (
    <div className="personnel-printing-queue">
      <div className="personnel-printing-queue-main">
        <div className="personnel-student-dashboard-portal flex m-12">
          <div className="personnel-student-dashboard-portal-buttons flex mx-auto w-full max-w-[1000px] justify-evenly">
            <a
              href=""
              className="py-4 px-20 w-full max-w-[20rem] text-center rounded-full text-white font-bold text-[clamp(1rem,3vw,1.2rem)]"
              id="personnel-dashboard-button"
            >
              Personnel
            </a>
            <a
              href=""
              className="py-4 px-20 w-full max-w-[20rem] text-center rounded-full text-white font-bold text-[clamp(1rem,3vw,1.2rem)]"
              id="student-dashboard-button"
            >
              Student
            </a>
          </div>
        </div>
        <div className="office-head-personnel-dashboard flex">
          <div className="office-head-personnel-dashboard-content flex flex-col mx-auto w-full max-w-[1000px]">
            <h1>Personnel Dashboard</h1>
            <div className="dashboard-request-information flex w-full max-w-[600px] h-[80p] justify-between mt-10">
              <DashboardCounterBox
                title="Pending Request"
                count={queueRequests.filter((request) => request.Status.props.value === "Pending").length}
              />
              <DashboardCounterBox
                title="Total Customer"
                count={getAllRequests.length}
              />
              <DashboardCounterBox
                title="Ready To Claim Request"
                count={readyToClaimRequest.length}
                backgroundColor="bg-[#17153a]"
                textColor="text-white "
                countColor="text-[#f4b312]"
              />
            </div>
            <GenericTable headers={headers1} data={queueRequests}></GenericTable>
          </div>
          {showModal && selectedQueueRequest && (
            <RequestDetailsModal
              requestData={selectedQueueRequest}
              onClose={closeModal}
            />
          )}
        </div>
        <div className="office-head-personnel-dashboard-ready-to-claim flex">
            
          <div className="office-head-personnel-dashboard-ready-to-claim-content flex flex-col mx-auto w-full max-w-[1000px]">
              <h1>Ready To Claim Request</h1>
            <GenericTable headers={headers2} data={readyToClaimRequest}></GenericTable>
            {alertShowModal && (
              <Alert
                show={alertShowModal}
                handleClose={() => setAlertShowModal(false)}
                handleConfirmDelete={handleConfirmDelete}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
