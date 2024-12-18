import { GenericDashBoard } from "./GenericDashBoard.jsx";
import { useState, useEffect} from "react";
import Button from "./Button.jsx";
import axios from "axios"
import {QueueRequest} from "./QueueRequest.jsx"
import { BookBindQueue } from "./BookBindQueue.jsx";
import { RequestDetailsModal } from "./RequestDetailsModal.jsx";
import { PersonnelBookBindDetails } from "./PersonnelBookBindDetails.jsx"
import { PersonnelLaminationDetails } from "./PersonnelLaminationDetails.jsx"
import { LaminationQueue } from "./LaminationQueue.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { data } from "autoprefixer";
import Swal from 'sweetalert2'

export const PersonnelDashboard = ({userRole}) => {
  
  const [dashboardType, setDashboardType] = useState(1);
  const [queueRequest, setQueueRequests] = useState([])
  const [queueReadytoClaimRequest, setQueueReadytoClaimRequest] = useState([])
  const [queue, setQueue] = useState([])
  const [showModal, setShowModal] = useState(null)
  const [selectedQueueRequest, setSelectedQueueRequest] = useState(null)
  const [loading, setLoading] = useState(false);

  // BOOKBINDING HOOKS
  const [bookBindRequest, setBookBindRequest] = useState([])
  const [readyToClaimBBRequest, setReadyToClaimBBRequest] = useState([])
  const [selectedBookBindRequest, setSelectedBookBindRequest] = useState(null)
  const [bbShowModal, setBBShowModal] = useState(false)

  // LAMINATION HOOKS
  const [laminationRequest, setLaminationRequest] = useState([])
  const [readyToClaimLamRequest, setReadyToClaimLamRequest] = useState([])
  const [selectedLaminationRequest, setSelectedLaminationRequest] = useState(null)
  const [lamShowModal, setLamShowModal] = useState(false)
  


  const user = useSelector((state) => state.user.value.user);
  const navigate = useNavigate()
  

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );
  

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

  const handleBookBindDetailsClick = (requestDetail) => {
    setBBShowModal(true);
    setSelectedBookBindRequest(requestDetail);
  }

  const  handleLaminationDetailsClick = (requestDetail) => {
    setLamShowModal(true);
    setSelectedLaminationRequest(requestDetail);
  }
 

  const handleDetailsClick = (queueDetail) => {
    setSelectedQueueRequest(queueDetail);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setBBShowModal(false); 
    setLamShowModal(false)
  };

  const handleQueueStatus = async (id, newStatus) => {
    setLoading(true)
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
    finally {
      setLoading(false);  // Reset loading to false when the request is finished
    }
  };

  const handleRemoveClick = (id) => {
    setQueueRequests((prev) => prev.filter((request) => request.id !== id));
    setQueueReadytoClaimRequest((prev) => prev.filter((request) => request.id !== id));
};

  const proceedBill = async (queueRequest,requesttype) => {
    try{
      if (requesttype === "Examination"){
        const response = await axios.post('http://127.0.0.1:8000/api/bill/', {
          "type": "Billing",
          "request": queueRequest
        })
        const data = response.data
        console.log(data)
        Swal.fire({
          title: "Success!",
          text: "Request Completed!",
          icon: "success"
        });
      } 
      else {
        const response = await axios.post('http://127.0.0.1:8000/api/bill/', {
          "type": "JobOrderA",
          "request": queueRequest
          }
        )
        const data = response.data
        console.log(data)
        Swal.fire({
          title: "Success!",
          text: "Request Completed!",
          icon: "success"
        });
      }
      fetchQueueRequests()
      


      // navigate("/officehead/transactionbill/")

      // setBillRequest(data);
   
      
      
    } catch(e){
      console.error("Error proceeding bill:", e);
    }


  }

  // const proceedJobOrder = async (queueRequest) => {
  //   try{
  //     const response = await axios.post('http://127.0.0.1:8000/api/joborder/', {
  //       "description": "BillingRequest",
  //       "request": queueRequest
  //     })
      
  //     const data = response.data

  //     // navigate("/officehead/transactionbill/")

  //     // setBillRequest(data);
  //     console.log(data)

      
      
  //   } catch(e){
  //     console.error("Error proceeding bill:", e);
  //   }
  //   console.log(queueRequest)
  // }
  const removeQueue = async (id) => {
    try{
      const response = await axios.delete(`http://127.0.0.1:8000/api/deleterequest/${id}/`)
      const data = response.data

      fetchQueueRequests()
      console.log(data)
    } catch(e){
      console.error("Error Delete queue requests:", e);
    }
  }


  const fetchQueueRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/displaypersonnelqueue/print/")
      const data = response.data

      setQueue(data)
      console.log(data)
      const filteredRequests = data.filter(
        (request) => request.queue_status === "Pending" || request.queue_status === "In Progress"
      );

      const filteredReadyToClaimRequests = data.filter((request) => request.queue_status === "Ready to Claim")

      const mappedData = filteredRequests.map((queueDetail) => QueueRequest({
        queueDetail,
        isTextStatus: user.role !== "Office Head",
        handleDetailsClick,
        handleQueueStatus,
        selectColor: selectInitialColor,
        closeModal,
        color: 'black'
      }))

      const mappedReadyToClaimData = filteredReadyToClaimRequests.map((queueDetail) => QueueRequest({
        queueDetail,
        isTextStatus: user.role !== "Office Head",
        handleDetailsClick,
        handleQueueStatus,
        selectColor: selectInitialColor,
        proceedBill,
        // proceedJobOrder,
        closeModal,
        handleRemoveClick,
        removeQueue
      }))

      setQueueRequests(mappedData)
      setQueueReadytoClaimRequest(mappedReadyToClaimData)


    }catch (e) {
      console.error("Error fetching queue requests:", e);
    }
    finally {
      setLoading(false);  // Reset loading to false when the request is finished
    }
  }
  
  useEffect(() => {
    fetchQueueRequests()

    const interval = setInterval(fetchQueueRequests, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [])


  // BOOKBINDING REQUEST
  const proceedBookBindBill = async (requestDetail) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/bill/',{
        "type": "JobOrderA",
        "book_bind_request": requestDetail
      })

      const data = response.data

      console.log(data)
      
      Swal.fire({
        title: "Success!",
        text: "Request Completed!",
        icon: "success"
      });

      fetchBookBind()
      

    } catch (error) {
      console.error(error)
    }
  }

  const handleBookBindQueueStatus = async (id, newStatus) => {
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/personnel/updatequeue/bookbind/${id}/`,{
        queue_status: newStatus,
      })

      setBookBindRequest((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, queue_status: response.data.queue_status } : request
        )
      );

      await fetchBookBind();
      console.log("Update Successfull")
    }catch (e) {
      console.error(e)
    }
  }

  const fetchBookBind = async () => {
    
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/getpersonnel/queue/bookbind");
      const data = response.data
    
      console.log(data)
      // console.log(data)
      const filteredRequests = data.filter(
        (request) => request.queue_status === "Pending" || request.queue_status === "In Progress"
      );
    

      const filteredReadyToClaimRequests = data.filter((request) => request.queue_status === "Ready to Claim")

      const mappedBookBindRequest = filteredRequests.map((requestDetail) => BookBindQueue({
        requestDetail,
        handleBookBindQueueStatus,
        selectColor: selectInitialColor,
        handleBookBindDetailsClick,
        isTextStatus: user.role !== "Office Head",
          }
        )
      )

      const mappedReadyToClaimBBRequest = filteredReadyToClaimRequests.map((requestDetail) => BookBindQueue({
        requestDetail,
        handleBookBindQueueStatus,
        selectColor: selectInitialColor,
        handleBookBindDetailsClick,
        proceedBookBindBill,
        isTextStatus: user.role !== "Office Head",
        removeQueue
          }
        )
      )

      
      setReadyToClaimBBRequest(mappedReadyToClaimBBRequest)
      setBookBindRequest(mappedBookBindRequest)

      
    

    } catch (error) {
      console.log(error)
    }
    
  }

  useEffect(() => {
    fetchBookBind()

    const interval = setInterval(fetchBookBind, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  },[])

  // console.log(queueRequest)

   // LAMINATION REQUEST

   const proceedLaminationBill = async (requestDetail) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/bill/',{
        "type": "JobOrderA",
        "lamination_request": requestDetail
      })
      const data = response.data

      console.log(data)
      
      Swal.fire({
        title: "Success!",
        text: "Request Completed!",
        icon: "success"
      });

      fetchLamination()

    } catch (error) {
      console.error(error)
    }
  }

   const handleLaminationQueueStatus = async (id, newStatus) => {
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/personnel/updatequeue/lamination/${id}/`,{
        queue_status: newStatus,
      })

      setLaminationRequest((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, queue_status: response.data.queue_status } : request
        )
      );

      await fetchLamination();
      console.log("Update Successfull")
    }catch (e) {
      console.error(e)
    }
  }

   const fetchLamination = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/getpersonnel/queue/lamination")
      const data = response.data

      const filteredRequests = data.filter(
        (request) => request.queue_status === "Pending" || request.queue_status === "In Progress"
      );
    

      const filteredReadyToClaimRequests = data.filter((request) => request.queue_status === "Ready to Claim")

      const mappedLaminationRequest = filteredRequests.map((requestDetail) => LaminationQueue({
        requestDetail,
        handleLaminationQueueStatus,
        selectColor: selectInitialColor,
        handleLaminationDetailsClick,
        isTextStatus: user.role !== "Office Head",
      }))

      const readyToClaimMappedLaminationRequest = filteredReadyToClaimRequests.map((requestDetail) => LaminationQueue({
        requestDetail,
        handleLaminationQueueStatus,
        selectColor: selectInitialColor,
        handleLaminationDetailsClick,
        proceedLaminationBill,
        isTextStatus: user.role !== "Office Head",
        removeQueue
      }))


      setLaminationRequest(mappedLaminationRequest)
      setReadyToClaimLamRequest(readyToClaimMappedLaminationRequest)
      
      
    } catch (error) {
      console.error(error)
    }
   }

   useEffect(() => {
    fetchLamination()

    const interval = setInterval(fetchLamination, 3000);


    return () => clearInterval(interval);
  }, [])

  const printDashboard = () => {  
    return (
      
      <GenericDashBoard
        dashboardHeader={[
          "Name",
          "Time-In",
          "Type",
          "Request-Type",
          "Status",
          "Details",
        ]}
        dashboardData={queueRequest}
        readyToClaimHeader={[
          "Name",
          "Time-In",
          "Type",
          "Request-Type",
          "Status",
          "Details",
         ...(user.role === "Office Head" ? ["Action"] : [])
        ]}
        readyToClaimData={queueReadytoClaimRequest}
        dashboardTitle="Personnel Printing Dashboard"
        readyToClaimTitle="Ready To Claim Personnel Printing Request"
        pendingCount={queueRequest.filter((request) => request.Status.props.children !== "Ready to Claim").length || queueRequest.filter((request) => request.Status.props.value !== "Ready to Claim").length}
        totalCount={queue.length}
        readyCount={queueReadytoClaimRequest.filter((request) => request.Status.props.children === "Ready to Claim").length || queueReadytoClaimRequest.filter((request) => request.Status.props.value === "Ready to Claim").length}
      />
      
    );
  };

 

  const bookBindingDashboard = () => {
    return (

        <GenericDashBoard
          dashboardHeader={[
            "Name",
            "Time-In",
            "Type",
            "Request-Type",
            "Status",
            "Details",
          ]}
          dashboardData={bookBindRequest}
          readyToClaimHeader={[
            "Name",
            "Time-In",
            "Type",
            "Request-Type",
            "Status",
            "Details",
            ...(user.role === "Office Head" ? ["Action"] : [])
          ]}
          readyToClaimData={readyToClaimBBRequest}
          dashboardTitle="Personnel Book Binding Dashboard"
          readyToClaimTitle="Ready To Claim Personnel Book Binding Request"
          pendingCount={bookBindRequest.filter((request) => request.Status.props.children !== "Ready to Claim").length || queueRequest.filter((request) => request.Status.props.value !== "Ready to Claim").length}
          totalCount={bookBindRequest.length}
          readyCount={bookBindRequest.filter((request) => request.Status.props.children === "Ready to Claim").length || queueReadytoClaimRequest.filter((request) => request.Status.props.value === "Ready to Claim").length}
        />
        )
        
  };

  const laminationDashboard = () => {
    return (
      <GenericDashBoard
        dashboardHeader={[
          "Name",
          "Time-In",
          "Type",
          "Request-Type",
          "Status",
          "Details",
        ]}
        dashboardData={laminationRequest}
        readyToClaimHeader={[
          "Name",
          "Time-In",
          "Type",
          "Request-Type",
          "Status",
          "Details",
          ...(user.role === "Office Head" ? ["Action"] : [])
        ]}
        readyToClaimData={readyToClaimLamRequest}
        dashboardTitle="Personnel Lamination Dashboard"
        readyToClaimTitle="Ready To Claim Personnel Lamination Request"
        pendingCount={laminationRequest.filter((request) => request.Status.props.children !== "Ready to Claim").length || queueRequest.filter((request) => request.Status.props.value !== "Ready to Claim").length}
        totalCount={laminationRequest.length}
        readyCount={laminationRequest.filter((request) => request.Status.props.children === "Ready to Claim").length || queueReadytoClaimRequest.filter((request) => request.Status.props.value === "Ready to Claim").length}
      />
    );
  };

  return (
    <div className="personnel-dashboard flex flex-col">
      <div className="personnel-dashboard-content flex flex-col w-full max-w-[1200px] m-auto my-0">
        <h1 className="text-center mt-[5rem] text-[clamp(1.5rem,3vw,2.5rem)] text-navy font-bold">
          Personnel Dashboard
        </h1>
        <div className="flex justify-center gap-3 mt-20 w-full max-w-[100%]">
          <Button
            title={"Printing"}
            style="text-white bg-navy rounded-[100rem] w-full max-w-[15rem] py-[0.8rem] text-[clamp()] text-[clamp(1.2rem,3vw,1.2rem)] font-bold"
            onClick={() => setDashboardType(1)}
          />
          <Button
            title={"Book Binding"}
            style="text-white bg-navy rounded-[100rem] w-full max-w-[15rem] py-[0.8rem] text-[clamp(1.2rem,3vw,1.2rem)] font-bold"
            onClick={() => setDashboardType(2)}
          />
          <Button
            title={"Lamination"}
            style="text-white bg-navy rounded-[100rem] w-full max-w-[15rem] py-[0.8rem] text-[clamp(1.2rem,3vw,1.2rem)] font-bold"
            onClick={() => setDashboardType(3)}
          />
        </div>
        {/* Display the selected dashboard */}
        <div className="dashboard-container">
          {dashboardType === 1 && printDashboard()}
          {showModal && selectedQueueRequest && (
            <RequestDetailsModal
              requestData={selectedQueueRequest}
              onClose={closeModal}
            />
          )}
          {dashboardType === 2 && bookBindingDashboard()}
          {bbShowModal && selectedBookBindRequest && (
            <PersonnelBookBindDetails
              requestData={selectedBookBindRequest}
              onClose={closeModal}
            />
          )}
          {dashboardType === 3 && laminationDashboard()}
          {lamShowModal && selectedLaminationRequest && (
            <PersonnelLaminationDetails
              requestData={selectedLaminationRequest}
              onClose={closeModal}
            />
          )}
        </div>
      </div>
    </div>
  );
};
