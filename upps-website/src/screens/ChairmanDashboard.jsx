import { GenericTable } from "../components/GenericTable";
import   DashboardCounterBox from "../components/DashboardCounterBox";
import React, { useState, useEffect } from "react";
import axios from "axios";
import  {ExaminationPendingRequest}  from "../components/ExaminationPendingRequest";
import {PersonnelViewDetails} from "../components/PersonnelViewDetails";
import emailjs from '@emailjs/browser'
import { HeaderLoggedIn } from "../components/HeaderLoggedIn";
import { UserData } from "../components/UserData.jsx";
import { useSelector } from "react-redux";
import { UserViewDetails} from "../components/UserViewDetails"
import { Footer } from "../components/Footer.jsx"
import Button from "../components/Button"
import { Spinner } from "../components/Spinner"
import Swal from 'sweetalert2'
export const ChairmanDashboard = () => {

  const [pendingRequests, setPendingRequests] = useState([]);
  const [showModal, setShowModal] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [user, setUser] = useState([]);
  const account = useSelector((state) => state.user.value.user);

  const [userDetailsModal, setUserDetailsModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const [historyUser, setHistoryUser] = useState([])
  const [historyRequest, setHistoryRequest] = useState([])
  const [loading, setLoading] = useState(false)

  const handleUserDetailsClick = (queueDetail) => {
    setSelectedUser(queueDetail);
    setUserDetailsModal(true);
    // console.log(queueDetail)
  }

  const closeModalUser = () => {
    setUserDetailsModal(false);
    setSelectedUser(null);
  }

  
  const handleDetailsClick = (queueDetail) => {
    setSelectedRequest(queueDetail);
    setShowModal(true);
  };

  // const handleUserDetalisClick = (userDetail) => {
  //   setSelectedUser(userDetail);
  //   setShowModal(true);
  // }


  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const fetchUserAccount = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/getuser/");
      const data = response.data;

      

      const filteredRequests = data.filter(
        (user) => user.department && user.department.department_name === account.department.department_name && user.role === "Personnel" && user.account_status === "Pending")
      
      const filteredAccountHistory = data.filter((user) => user.department && user.department.department_name === account.department.department_name && user.role === "Personnel")

      const mappedData = filteredRequests.map((userDetail) => 
        UserData({
          userDetail, // Pass userDetail properly
          handleUserDetailsClick
        })
      );

      const historyMappedData = filteredAccountHistory.map((userDetail) => 
        UserData({
          userDetail, // Pass userDetail properly
          handleUserDetailsClick
        })
      );

      setHistoryUser(historyMappedData);
      setUser(mappedData);

    } catch (err) {
      console.error(err);
    }
  }
  

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/displaypersonnelrequest");
      const data = response.data
      


     
      const filteredExamination = data.filter((request) =>  request.user.department.department_name === account.department.department_name && request.print_request_details.request_type.request_type_name === "Examination" && request.request_status === 'pending')
      const filteredHistoryExam = data.filter((request) =>  request.user.department.department_name === account.department.department_name && request.print_request_details.request_type.request_type_name === "Examination" &&request.print_request_details.request_type.request_type_name && request.request_status === "accepted" || request.request_status === "declined")

      console.log(filteredHistoryExam)

      const mappedData = filteredExamination.map((requestDetail) =>
        ExaminationPendingRequest({
            requestDetail,
            handleDetailsClick,
        })
    );

    console.log(filteredExamination)
      const mappedHistoryExam = filteredHistoryExam.map((requestDetail) =>
        ExaminationPendingRequest({
            requestDetail,
            handleDetailsClick,
        })
    );

      setHistoryRequest(mappedHistoryExam)
      setPendingRequests(mappedData);
    } catch (err) {
      console.error(err);
    }
  };
  const handleAccept = async (id, e) => {
    setLoading(true)
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/updaterequest/${id}/`, {
        request_status: "accepted",
      });
    

      const updatedRequest = response.data;

      Swal.fire({
        title: "Accepted!",
        text: "You have accepted the request",
        icon: "success"
      });


      await axios.post('http://127.0.0.1:8000/api/queue/', {personnel_print_request: updatedRequest.id, queue_status: "Pending" })


      setPendingRequests(prevPendingRequests =>
        prevPendingRequests.filter(request => request.id !== id)
      );

      setShowModal(false)

      
      await fetchPendingRequests();
      
    } catch (error) {
      console.error(error);
    }
      finally {
      setLoading(false); // Stop loading
    }
    
  }

  

  const handleReject = async (id) => {
    setLoading(true)
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/updaterequest/${id}/`, {
        request_status: "declined",
      });

      const updatedData = response.data;

      Swal.fire({
        title: "Rejected",
        text: "You have rejected the request",
        icon: "success"
      });

      setShowModal(false)
      
      setPendingRequests(prevPendingRequests =>
        prevPendingRequests.filter(request => request.id!== id)
      );

    }catch (e) {
      console.error(e);
    }
    finally {
      setLoading(false); // Stop loading
    }
  } 

  const handleAcceptUser = async (id) => {
    setLoading(true)
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/updateuser/status/${id}`, {
         account_status: "Active"
      })
    
      Swal.fire({
        title: "Active",
        text: "You have set the User to Active",
        icon: "success"
      });

      setUserDetailsModal(false)
      setSelectedUser(null)

    } catch (e) {
      console.error(e);
    }
    finally {
      setLoading(false); // Stop loading
    }
  }

  const handleDeniedUser = async (id) => {
    setLoading(true)
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/updateuser/status/${id}`, {
         account_status: "Denied"
      })

      Swal.fire({
        title: "Denied",
        text: "You have set the User to Denied",
        icon: "success"
      });


      setUserDetailsModal(false)
      setSelectedUser(null)

    } catch (e) {
      console.error(e);
    }
    finally {
      setLoading(false); // Stop loading
    }
  }
  

  useEffect(() => {
    // Call functions initially
    fetchUserAccount();
    fetchPendingRequests();
  
    // Set intervals for periodic fetching
    const userAccountInterval = setInterval(fetchUserAccount, 3000);
    const pendingRequestsInterval = setInterval(fetchPendingRequests, 3000);
  
    // Cleanup intervals on component unmount
    return () => {
      clearInterval(userAccountInterval);
      clearInterval(pendingRequestsInterval);
    };
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
  
  const personnelExaminationRequestHistoryHeaders = [
    "Name",
    "Request-Date",
    "Request-Type",
    "Position",
    "Department",
    "Details",
    "Status"
  ];

  const personnelExaminationRequestHistoryData = [
    {
      Name: "John Carl",
      "Request-Date": "11/23/2023 2:00PM",
      "Request-Type": "Examination",
      Position: "Instructor",
      Department: "CITC",
      Details: (
        <a href="" id="details-button">
          View Details
        </a>
      ),
    },
  ];

  
  const personnelAccountHistoryHeader = [
      "Name",
      "Time-In",
      "Position",
      "Department",
      "Details",
      "Status",
    ];

  const personnelAccountHistoryData = [
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
      Status: "Accepted",
    },
  ];
  
  return (
    <>
    {loading && (
    <div className="fixed inset-0 bg-[#808080] bg-opacity-50 z-50 flex items-center justify-center">
      <Spinner />
    </div>
  )}
    <HeaderLoggedIn />
      <div className="chairman-dashboard flex flex-col ">
        <div className="chairman-dashboard-content flex flex-col  mx-auto">
        {userDetailsModal && selectedUser && (
            <UserViewDetails
              request={selectedUser}
              onClose={closeModalUser}
              handleAcceptUser={handleAcceptUser
              }
              handleDeniedUser={handleDeniedUser}
            />
          )}
          <div className="personnel-account-dashboard-chairman flex flex-col w-full self-start">
          
            <h1 className="mt-5">Personnel Account Dashboard</h1>
            <div className="flex  w-full max-w-[500px] justify-between mt-16">
              <DashboardCounterBox
                title="Personnel Accounts"
                count={user.length}
              />
            </div>
            <GenericTable
              headers={personnelAccountHeaders}
              data={user}
              thStyle={"bg-uppsdarkblue text-white"}
            ></GenericTable>
            <div className="flex flex-col">
              <h1 className="text-navy text-[clamp(1.5rem,3vw,3rem)] font-bold mt-[5rem]">
                Personnel Account History Dashboard
              </h1>
              <div className="flex  w-full max-w-[500px] justify-between mt-16">
              <DashboardCounterBox
                title="Total Personnel Accounts"
                count={historyUser.length}
               />
              </div>
              <GenericTable
                headers={personnelAccountHistoryHeader}
                data={historyUser}
                thStyle={"bg-uppsdarkblue text-white"}
              />
            </div>
          </div>
          
          {showModal && selectedRequest && (
            <PersonnelViewDetails
              request={selectedRequest}
              onClose={closeModal}
              handleAccept={(e) => {
                handleAccept(selectedRequest.id, e)
              }}
              handleReject={() => handleReject(selectedRequest.id)}
            />
          )}
           
          <div className="personnel-examination-request-dashboard-chairman flex flex-col mx-auto w-full   ">
            <h1>Personnel Examination Request Dashboard</h1>
            <div className="flex  w-full max-w-[500px] justify-between mt-16">
              <DashboardCounterBox
                title="Pending Requests"
                count={pendingRequests.length}
              />
            </div>
            <GenericTable
              headers={personnelExaminationRequestHeaders}
              data={pendingRequests}
              thStyle={"bg-uppsdarkblue text-white"}
            ></GenericTable>
          </div>
          <div>
              <h1 className="text-navy text-[clamp(1.5rem,3vw,3rem)] font-bold mt-[5rem]">
                Personnel Examination Request History Dashboard
              </h1>
              <div className="flex  w-full max-w-[500px] justify-between mt-16">
              <DashboardCounterBox
                title="Total Examination Requests"
                count={historyRequest.length}
              />
            </div>
              <GenericTable
                headers={personnelExaminationRequestHistoryHeaders}
                data={historyRequest}
                thStyle={"bg-uppsdarkblue text-white"}
              ></GenericTable>
            </div>
            
            
        </div>
        <Footer />
      </div>
    </>
  );
};
