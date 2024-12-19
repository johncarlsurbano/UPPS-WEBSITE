  import Button from "./Button";
  import { GenericDashBoard } from "./GenericDashBoard";
  import { useState, useEffect } from "react";
  import axios from "axios"
  import { StudentPrintQueue } from "./StudentPrintQueue";
  import { StudentBookBindingQueue } from "./StudentBookBindingQueue";
  import { StudentLaminationQueue } from "./StudentLaminationQueue";
  import { userSlice } from "../features/user";
  import { useSelector } from "react-redux";
  import { StudentPrintDetails } from "./StudentPrintDetails";
  import { StudentBookBindDetails } from "./StudentBookBindDetails";
  import { StudentLaminationDetails } from "./StudentLaminationDetails";
  import { useNavigate } from "react-router-dom"
  import Alert from "../components/Alert.jsx";
  import Swal from "sweetalert2"
  


  export const StudentDashboard = () => {
    const [dashboardType, setDashboardType] = useState(1);
    const [studentRequest, setStudentRequest] = useState([])
    const [readyToClaimStudentRequesst, setreadyToClaimStudentRequesst] = useState([])
    const [selectedQueueRequest, setSelectedQueueRequest] = useState(null)
    const [showModal , setShowModal] = useState(null)
    const [serializedData, setSerializedData] = useState([])
    const [serializedBookBindData, setSerializedBookBindData] = useState([])
    const [serializedLaminationData, setSerializedLaminationData] = useState([])
    const [filteredCustomer, setFilteredCustomer] = useState('')
    const [filteredBookBindCustomer, setFilteredBookBindCustomer] = useState('')
    const [filteredLaminationCustomer, setFilteredLaminationCustomer] = useState('')

    const [filteredRequest, setFiltereRequest] = useState([])
    const [filteredBookBindRequest, setFilteredBookBindRequest] = useState([])
    const [filteredLaminationRequest, setFilteredLaminationRequest] = useState([])

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


    const [showAlert, setShowAlert] = useState(false);
    const [alertData, setAlertData] = useState({ id: null, newStatus: null })

    const navigate = useNavigate()
    const user = useSelector((state) => state.user.value.user);

    const printDashboardVisible = dashboardType === 1;
    const bookBindingDashboardVisible = dashboardType === 2;
    const laminationDashboardVisible = dashboardType === 3;

    const customerFilter = (e) => {
      const value = e.target.value

      setFilteredCustomer(value)
      setFilteredBookBindCustomer(value)
      setFilteredLaminationCustomer(value)

      console.log(value)

    }

    const handleLaminationDetailsClick = (requestDetail) => {
      setLamShowModal(true);
      setSelectedLaminationRequest(requestDetail);
    }

    const handleBookBindDetailsClick = (requestDetail) => {
      setBBShowModal(true);
      setSelectedBookBindRequest(requestDetail);
    }


    const closeModal = () => {
      setShowModal(false);
      setLamShowModal(false)
      setBBShowModal(false);
      setSelectedQueueRequest(null);
      setSelectedBookBindRequest(null);
      setSelectedLaminationRequest(null);
    };

    
    const generatePaymentSlip = () => {
      let selectedRequest;
      let url;
    
      if (dashboardType === 1) {
        selectedRequest = selectedQueueRequest;
        url = '/student/paymentslip';
      } else if (dashboardType === 2) {
        selectedRequest = selectedBookBindRequest;
        url = '/bookbind/paymentslip';
      } else {
        selectedRequest = selectedLaminationRequest;
        url = '/lamination/paymentslip';
      }
    
      if (selectedRequest) {
        sessionStorage.setItem('paymentSlipData', JSON.stringify(selectedRequest));
        const newTab = window.open(url, '_blank');
        if (!newTab) {
          console.error('Failed to open a new tab. Check browser settings.');
        }
      } else {
        console.error('No selected request for payment slip generation.');
      }
    };

    useEffect(() => {
      if (selectedQueueRequest) {
        sessionStorage.setItem("paymentSlipData", JSON.stringify(selectedQueueRequest));
        console.log("Updated sessionStorage after queue request change:", selectedQueueRequest);
      }
    }, [selectedQueueRequest]);

    
    const handlePaymentStatus = async () => {
      try {
        const response = await axios.patch(
          `http://127.0.0.1:8000/api/student/paymentstatus/${alertData.id}/`,
          { paid_status: alertData.newStatus }
        );
    
        const data = response.data;

        alert("Updated Payment")
        

        setStudentRequest((prev) =>
          prev.map((request) =>
            request.id === alertData.id
              ? { ...request, student_print_request: { ...request.student_print_request, paid_status: data.paid_status } }
              : request
          )
        );
    
        await fetchStudentRequest()
        await fetchBookBind()
        await fetchLamination()
        console.log("Payment status updated successfully:", data);
      } catch (e) {
        console.error("Error processing payment status:", e);
      }


    };

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

    const handleDetailsClick = (queueDetail) => {
      setSelectedQueueRequest(queueDetail);
      setShowModal(true);
    };
  


    const handleQueueStatus = async (id, newStatus) => {
      try {
        const response = await axios.patch(`http://127.0.0.1:8000/api/updatestudent/queue/${id}/`, {
          queue_status: newStatus,
        });
  
  
        setStudentRequest((prev) =>
          prev.map((request) =>
            request.id === id ? { ...request, queue_status: response.data.queue_status } : request
          )
        );

        await fetchStudentRequest();
  
        
      } catch (err) {
        console.error("Error updating queue status:", err);
      }
    };

    const removeQueue = async (id,servicettype) => {
      try{
        if(servicettype === "Printing"){
          const response = await axios.delete(`http://127.0.0.1:8000/api/deletestudent/request/${id}/`)
          const data = response.data

          fetchStudentRequest();
          console.log(data)
          Swal.fire({
            title: "Success!",
            text: "Request Completed!",
            icon: "success"
          });
        }
        else if (servicettype === "Book Binding"){
          const response = await axios.delete(`http://127.0.0.1:8000/api/deletestudent/request/bookbind/${id}/`)
          const data = response.data

          fetchBookBind();
          console.log(data)
          Swal.fire({
            title: "Success!",
            text: "Request Completed!",
            icon: "success"
          });
        }
        else if (servicettype === 'Lamination'){
          const response = await axios.delete(`http://127.0.0.1:8000/api/deletestudent/request/lamination/${id}/`)
          const data = response.data

          fetchLamination();
          console.log(data)
          Swal.fire({
            title: "Success!",
            text: "Request Completed!",
            icon: "success"
          });
        }
        else {
          console.log("UNDEFINED SERVICE TYPE! ")
        }

      } catch(e){   
        console.error("Error Delete queue requests:", e);
      }
      console.log(id)
      console.log(servicettype)
    }

    const handleRemoveClick = (id) => {
      setStudentRequest((prev) => prev.filter((request) => request.id !== id));
      setreadyToClaimStudentRequesst((prev) => prev.filter((request) => request.id !== id));
  };

  const confirmPaymentStatusChange = (id, newStatus) => {
    setAlertData({ id, newStatus });
    setShowAlert(true);
  };

  

    const fetchStudentRequest = async () => {
      setLoading(true);
      try { 
        const response = await axios.get('http://127.0.0.1:8000/api/getstudent/queue')
        const data = response.data

        const filteredRequests = data.filter(
          (request) => request.queue_status === "Pending" || request.queue_status === "In Progress"
        );
  
        const filteredReadyToClaimRequests = data.filter((request) => request.queue_status === "Ready to Claim")

        setSerializedData(data)


        const mappedRequest = filteredRequests.map((queueDetail) => StudentPrintQueue({
          queueDetail,
          isTextStatus: !user || user.role !== "Office Head" ,
          handleQueueStatus,  
          selectColor: selectInitialColor,
          handleDetailsClick,
          handlePaymentStatus,
          confirmPaymentStatusChange
        }))

        const mappedReadyToClaimData = filteredReadyToClaimRequests.map((queueDetail) => StudentPrintQueue({
          queueDetail,
          isTextStatus: !user.role || user.role !== "Office Head",
          handleDetailsClick,
          handleQueueStatus,
          selectColor: selectInitialColor,
          handleRemoveClick,
          removeQueue
        }))
        
        setStudentRequest(mappedRequest)
        setreadyToClaimStudentRequesst(mappedReadyToClaimData)


      } catch (e) {

        console.error("Error fetching student requests:", e);
      }
    }

  useEffect( () => {
    fetchStudentRequest()

    const interval = setInterval(fetchStudentRequest, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);

  },[])

    useEffect(() => {

      const filteredData = studentRequest.filter((request) =>

        (filteredCustomer ? request["Name"].toLowerCase().match(filteredCustomer) || request["Name"].match(filteredCustomer) : true),
        
    );  

      const filteredBookBind = bookBindRequest.filter((request) =>

      (filteredBookBindCustomer ? request["Name"].toLowerCase().match(filteredBookBindCustomer) || request["Name"].match(filteredBookBindCustomer) : true),
      
    );  

      const filteredLamination = laminationRequest.filter((request) =>

      (filteredLaminationCustomer ? request["Name"].toLowerCase().match(filteredLaminationCustomer) || request["Name"].match(filteredLaminationCustomer) : true),
      
    );  


    setFiltereRequest(filteredData)
    setFilteredBookBindRequest(filteredBookBind)
    setFilteredLaminationRequest(filteredLamination)

    
    },[filteredCustomer,filteredBookBindCustomer,filteredLaminationCustomer,studentRequest,bookBindRequest,laminationRequest])

    // BOOKBINDING 

    const handleBookBindQueueStatus = async (id, newStatus) => {
      try {
        const response = await axios.patch(`http://127.0.0.1:8000/api/student/updatequeue/bookbinding/${id}/`,{
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
        const response = await axios.get('http://127.0.0.1:8000/api/getstudent/queue/bookbinding')
        const data = response.data
       
        setSerializedBookBindData(data)

        const filteredBookBindRequests = data.filter(
          (request) => request.queue_status === "Pending" || request.queue_status === "In Progress"
        );

        const readyToClaimBookBindRequests = data.filter((request) => request.queue_status === "Ready to Claim")

        const mappedBookBindRequest = filteredBookBindRequests.map((requestDetail) => StudentBookBindingQueue({
          requestDetail,
          handleBookBindQueueStatus,
          selectColor: selectInitialColor,
          handleBookBindDetailsClick,
          isTextStatus: !user.role || user.role !== "Office Head",
          confirmPaymentStatusChange
        }))

        const readytoClaimMappedBookBind = readyToClaimBookBindRequests.map((requestDetail) => StudentBookBindingQueue({
          requestDetail,
          handleBookBindQueueStatus,
          selectColor: selectInitialColor,
          handleBookBindDetailsClick,
          removeQueue,
          isTextStatus: !user.role || user.role !== "Office Head",
        }))

        setBookBindRequest(mappedBookBindRequest)
        setReadyToClaimBBRequest(readytoClaimMappedBookBind)

      } catch(e){
        console.error("Error fetching book binding requests:", e);
      }
    }

    useEffect(() => {
      fetchBookBind()

      const interval = setInterval(fetchBookBind, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
    }, [])

    // LAMINATION 

    const handleLaminationQueueStatus = async (id, newStatus) => {
      try {
        const response = await axios.patch(`http://127.0.0.1:8000/api/student/updatequeue/lamination/${id}/`,{
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
        const response = await axios.get('http://127.0.0.1:8000/api/getstudent/queue/lamination')
        const data = response.data

        setSerializedLaminationData(data)

        const filteredLamRequest = data.filter(
          (request) => request.queue_status === "Pending" || request.queue_status === "In Progress"
        );


        const readyToClaimLamRequest = data.filter((request) => request.queue_status === "Ready to Claim")

        const mappedLamRequest = filteredLamRequest.map((requestDetail) => StudentLaminationQueue({
          requestDetail,
          handleLaminationDetailsClick,
          selectColor: selectInitialColor,
          handleLaminationQueueStatus,
          isTextStatus: !user.role || user.role !== "Office Head",
          confirmPaymentStatusChange
        }))

        const readyToClaimMapRequest = readyToClaimLamRequest.map((requestDetail) => StudentLaminationQueue({
          requestDetail,
          handleLaminationDetailsClick,
          selectColor: selectInitialColor,
          handleLaminationQueueStatus,
          removeQueue,
          isTextStatus: !user.role || user.role !== "Office Head",
        }))

        setLaminationRequest(mappedLamRequest)
        setReadyToClaimLamRequest(readyToClaimMapRequest)

      } catch(e){
        console.error("Error fetching book binding requests:", e);
      }
    }


    useEffect(() => {
      fetchLamination()
      
      const interval = setInterval(fetchLamination, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
    }, [])



    

    const printDashboard = () => {


        

      return (
        
        <GenericDashBoard
          dashboardHeader={[
            "Student ID",
            "Name",
            "Time-In",
            "Type",
            "Request-Type",
            "Status",
            "Details",
            ...(user.role === "Office Head" ? ["Payment Status"] : [])
          ]}
          dashboardData={filteredRequest}
          readyToClaimHeader={[
            "Student ID",
            "Name",
            "Time-In",
            "Type",
            "Request-Type",
            "Status",
            "Details",
            ...(user.role === "Office Head" ? ["Action"] : [])
          ]}
          readyToClaimData={readyToClaimStudentRequesst}
          dashboardTitle="Student Printing Dashboard"
          readyToClaimTitle="Ready To Claim Student Printing Request"
          pendingCount={serializedData.filter((request) => request.queue_status !== "Ready to Claim").length}
          totalCount={serializedData.length}
          readyCount={serializedData.filter((request) => request.queue_status === "Ready to Claim").length}
          onChange={customerFilter}
        />
        
      );
    };
    console.log(serializedData.filter((request) => request.queue_status === "Ready to Claim").length)

    const bookBindingDashboard = () => {
      return (
        <GenericDashBoard
          dashboardHeader={[
            "Student ID",
            "Name",
            "Time-In",
            "Type",
            "Request-Type",
            "Status",
            "Details",
            ...(user.role === "Office Head" ? ["Payment Status"] : [])
          ]}
          dashboardData={filteredBookBindRequest}
          readyToClaimHeader={[
            "Student ID",
            "Name",
            "Time-In",
            "Type",
            "Request-Type",
            "Status",
            "Details",
            ...(user.role === "Office Head" ? ["Action"] : [])
          ]}
          readyToClaimData={readyToClaimBBRequest}
          dashboardTitle="Student Book Binding Dashboard"
          readyToClaimTitle="Ready To Claim Student Book Binding Request"
          pendingCount={serializedBookBindData.filter((request) => request.queue_status !== "Ready to Claim").length}
          totalCount={serializedBookBindData.length}
          readyCount={serializedBookBindData.filter((request) => request.queue_status === "Ready to Claim").length}
          onChange={customerFilter}
        />
      );
    };
    console.log(serializedBookBindData)

    const laminationDashboard = () => {
      

      return (
        
        <GenericDashBoard
          dashboardHeader={[
            "Student ID",
            "Name",
            "Time-In",
            "Type",
            "Request-Type",
            "Status",
            "Details",
            ...(user.role === "Office Head" ? ["Payment Status"] : [])
          ]}
          dashboardData={filteredLaminationRequest}
          readyToClaimHeader={[
            "Student ID",
            "Name",
            "Time-In",
            "Type",
            "Request-Type",
            "Status",
            "Details",
            ...(user.role === "Office Head" ? ["Action"] : [])
          ]}
          readyToClaimData={readyToClaimLamRequest}
          dashboardTitle="Student Lamination Dashboard"
          readyToClaimTitle="Ready To Claim Student Lamination Request"
          pendingCount={serializedLaminationData.filter((request) => request.queue_status !== "Ready to Claim").length}
          totalCount={serializedLaminationData.length}
          readyCount={serializedLaminationData.filter((request) => request.queue_status === "Ready to Claim").length}
          onChange={customerFilter}
        />
      );
    };
    return (
      
      <div className="student-dashboard flex flex-col">
        <div className="student-dashboard-content flex flex-col m-auto my-0 w-full max-w-[1200px]">
          <h1 className="text-center mt-[5rem] text-[clamp(1.5rem,3vw,2.5rem)] text-navy font-bold">
            Student Dashboard
          </h1>
          <div className="flex justify-center gap-3 mt-20 w-full max-w-[100%]">
            <Button
              title={"Printing"}
              style="text-white bg-yellow rounded-[100rem] w-full max-w-[15rem] py-[0.8rem] text-[clamp()] text-[clamp(1.2rem,3vw,1.2rem)] font-bold"
              onClick={() => setDashboardType(1)}
            />
            <Button
              title={"Book Binding"}
              style="text-white bg-yellow rounded-[100rem] w-full max-w-[15rem] py-[0.8rem] text-[clamp(1.2rem,3vw,1.2rem)] font-bold"
              onClick={() => setDashboardType(2)}
            />
            <Button
              title={"Lamination"}
              style="text-white bg-yellow rounded-[100rem] w-full max-w-[15rem] py-[0.8rem] text-[clamp(1.2rem,3vw,1.2rem)] font-bold"
              onClick={() => setDashboardType(3)}
            />
          </div>
          {/* Display the selected dashboard */}
          <div className="dashboard-container">
        
            <div style={{ display: printDashboardVisible ? 'block' : 'none' }}>
              {printDashboard()}
            </div>
            <div style={{ display: bookBindingDashboardVisible ? 'block' : 'none' }}>
              {bookBindingDashboard()}
            </div>
            <div style={{ display: laminationDashboardVisible ? 'block' : 'none' }}>
              {laminationDashboard()}
            </div>
          {showModal && selectedQueueRequest && (
            <StudentPrintDetails
              requestData={selectedQueueRequest}
              onClose={closeModal}
              onClick={generatePaymentSlip}
            />
          )}
          {bbShowModal && selectedBookBindRequest && (
            <StudentBookBindDetails
              requestData={selectedBookBindRequest}
              onClose={closeModal}
              onClick={generatePaymentSlip}
            />
          )}
          {lamShowModal && selectedLaminationRequest && (
            <StudentLaminationDetails
              requestData={selectedLaminationRequest}
              onClose={closeModal}
              onClick={generatePaymentSlip}
            />
          )}
            <Alert
                show={showAlert}
                handleClose={() => setShowAlert(false)} // Close the alert
                handleFunction={() => {
                    if (alertData.id) {
                      handlePaymentStatus(alertData.id, alertData.newStatus); // Trigger payment status change
                    }
                }}
                title="Confirm Payment Status Change"
                paragraph="Are you sure you want to update the payment status for this student?"
                Yes="Cancel"
                No="Confirm"
            />

          </div>
        </div>
      </div>
    );
  };
