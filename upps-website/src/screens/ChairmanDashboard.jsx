import { GenericTable } from "../components/GenericTable";
import   DashboardCounterBox from "../components/DashboardCounterBox";
import React, { useState, useEffect } from "react";
import axios from "axios";
import  {ExaminationPendingRequest}  from "../components/ExaminationPendingRequest";
import {PersonnelViewDetails} from "../components/PersonnelViewDetails";
import emailjs from '@emailjs/browser'



export const ChairmanDashboard = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showModal, setShowModal] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

 
  // const sendEmail = (data) => {
  //   emailjs.send('service_v7sw8zn', 'template_89mrv74', data, '_tUgqkQ9Hr-AuMFf-')
  //     .then((result) => {
  //       console.log('Email successfully sent!', result.text);
  //     })
  //     .catch((error) => {
  //       console.error('Error sending email:', error);
  //     });
  // };
  
  const handleDetailsClick = (queueDetail) => {
    setSelectedRequest(queueDetail);
    setShowModal(true);
  };


  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/requeststatus/pending/");
      const data = response.data

      const mappedData = data.map((requestDetail) =>
        ExaminationPendingRequest({
            requestDetail,
            handleDetailsClick,
        })
    );

      setPendingRequests(mappedData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = async (id, e) => {
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/updaterequest/${id}/`, {
        request_status: "accepted",
      });
    

      const updatedRequest = response.data;

      alert('Request Accepted!')

      // const emailData = {
      //   first_name: updatedRequest.name, // Replace with the appropriate data fields
      //   email: updatedRequest.email, // Replace with the appropriate data fields
      //   message: 'Your request has been accepted',
      // };

      // emailData.email = updatedRequest.email.trim();
      // emailData.first_name = updatedRequest.first_name.trim();
      
      // sendEmail(emailData)
      // // console.log('Email data:', emailData);

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

      
     
      setShowModal(false)
    } catch (error) {
      
      console.error(error);
    }
  }

  const handleReject = async (id) => {
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/updaterequest/${id}/`, {
        request_status: "declined",
      });

      const updatedData = response.data;
      
      setPendingRequests(prevPendingRequests =>
        prevPendingRequests.filter(request => request.id!== id)
      );

    }catch (e) {
      console.error(e);
    }
  } 
  
  console.log(pendingRequests)

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const personnelAccountHeaders = [
    "Name",
    "Time-In",
    "Position",
    "Department",
    "Details",
  ];
  const personnelAccountData = [
    {
      Name: "John Doe",
      "Time-In": "12: PM",
      Position: "Instructor",
      Department: "IT",
      Details: (
        <a href="" id="details-button">
          View Details
        </a>
      ),
    },
  ];

  const personnelExaminationRequestHeaders = [
    "Name",
    "Request-Date",
    "Request-Type",
    "Position",
    "Department",
    "Details",
  ];
  

  return (
    <>
      <div className="chairman-dashboard flex flex-col ">
        <div className="chairman-dashboard-content flex flex-col  mx-auto">
          <div className="personnel-account-dashboard-chairman flex flex-col w-full max-w-[fit-content]  self-start">
            <h1>Personnel Account Dashboard</h1>
            <div className="flex  w-full max-w-[500px] justify-between mt-16">
              <DashboardCounterBox
                title="Pending Requests"
                count={pendingRequests.length}
              />
              <DashboardCounterBox
                title="Personnel Accounts"
                count={4}
              />
            </div>
            <GenericTable
              headers={personnelAccountHeaders}
              data={personnelAccountData}
            ></GenericTable>
          </div>
          {showModal && selectedRequest && (
            <PersonnelViewDetails
              request={selectedRequest}
              onClose={closeModal}
              handleAccept={(e) => {
                handleAccept(selectedRequest.id,e)
              }}
              handleReject={() => handleReject(selectedRequest.id)}
            />
          )}
          
          <div className="personnel-examination-request-dashboard-chairman flex flex-col mx-auto w-full max-w-[fit-content] ">
            <h1>Personnel Examination Request Dashboard</h1>
            <GenericTable
              headers={personnelExaminationRequestHeaders}
              data={pendingRequests}
            ></GenericTable>
          </div>
        </div>
      </div>
    </>
  );
};
