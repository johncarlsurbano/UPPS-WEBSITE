import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import "../styles/PersonnelPrintRequestForm.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client"; 
import { useWebSocket } from "../hooks/useWebSocket";


export const PersonnelPrintRequestForm = () => {
  
  const user = useSelector((state) => state.user.value.user);
  const navigate = useNavigate();

  const [department, setDepartment] = useState([]);
  const [printingType, setPrintingType] = useState([]);
  const [requestType, setRequestType] = useState([]);
  const [paperType, setPaperType] = useState([]);
  const [position, setPosition] = useState([]);
  const [file,setFile] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);


  
  // Function to fetch data for dropdowns
  const fetchDropdownData = async (url, setter) => {
    try {
      const response = await axios.get(url);
      setter(response.data || []);
    } catch (error) {
      console.error(`Failed to fetch data from ${url}`, error);
    }
  };

  useEffect(() => {
    // Log the user data to the console
    console.log("Logged-in user:", user);
  }, [user]);

  useEffect(() => {
    fetchDropdownData("http://127.0.0.1:8000/api/print/printingtype/", setPrintingType);
    fetchDropdownData("http://127.0.0.1:8000/api/papertype/", setPaperType);
    fetchDropdownData("http://127.0.0.1:8000/api/position/", setPosition);
    fetchDropdownData("http://127.0.0.1:8000/api/department/", setDepartment);
    fetchDropdownData("http://127.0.0.1:8000/api/print/requesttype/", setRequestType)
  }, []);

  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    request_status: "pending",
    department: user.department.id,
    position: user.position.id,
    pdf: null,
    urgent: false
  });

  const [printDetails, setPrintDetails] = useState({
    duplex: false,
    quantity: "",
    printing_type: null,
    paper_type: null,
  });

  useEffect(() => {
    if (printingType.length > 0) {
      setPrintDetails((prevDetails) => ({
        ...prevDetails,
        printing_type: printingType[0].id,
      }));
    }
  
    if (paperType.length > 0) {
      setPrintDetails((prevDetails) => ({
        ...prevDetails,
        paper_type: paperType[0].id,
      }));
    }
  
    if (requestType.length > 0) {
      setPrintDetails((prevDetails) => ({
        ...prevDetails,
        request_type: requestType[0].id,
      }));
    }
  
    if (department.length > 0 ) {
      setData((prevDetails) => ({
        ...prevDetails,
        department: department[0].id,
      }));
    }
  
    if (position.length > 0) {
      setData((prevDetails) => ({
        ...prevDetails,
        position: position[0].id,
      }));
    }
  }, [printingType, paperType, requestType, department, position]);
  
  useEffect(() => {
    if (user) {
      // Set default values from user data
      setData((prevData) => ({
        ...prevData,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        department: user.department || null, // Ensure department and position match available values
        position: user.position || null,
      }));
    }
  }, [user]);
  
  
  const personnelDetails = async (ids, requestStatus) => {
    try {

      const formData = new FormData();
      formData.append("service_type", 1)
      formData.append("user", user.id)
      formData.append("request_status", requestStatus);
      formData.append("pdf", data.pdf);
      formData.append("urgent", data.urgent)
      formData.append("print_request_details", ids);

      console.log(data.pdf);
      

      const response = await axios.post("http://127.0.0.1:8000/api/createrequest/", formData)

      const updatedRequest = response.data;

    // Automatically post to queue if the status is "accepted"
      if (requestStatus === "accepted") {
        await axios.post("http://127.0.0.1:8000/api/queue/", {
          personnel_print_request: updatedRequest.id,
          queue_status: "Pending",
        });
        console.log("Request added to queue successfully.");
      }

      alert("Request submitted successfully!");
      navigate('/personnel/dashboard')
      
    } catch (error) {
      console.error("Failed to submit personnel details", error);
      alert(error.response.data.error);
    }
  };

  const submitRequest = async (e) => {
    setIsDisabled(true)
    e.preventDefault();

    const isExamination = requestType.some(
      (type) => type.id === parseInt(printDetails.request_type) && type.request_type_name === "Examination"
    );

    console.log(isExamination)
    
    const updatedStatus = isExamination ? "pending" : "accepted";

    try {
      const printRequestResponse = await axios.post("http://127.0.0.1:8000/api/printrequestdetails/", {
        duplex: printDetails.duplex,
        quantity: printDetails.quantity,
        printing_type: printDetails.printing_type,
        request_type: printDetails.request_type,
        paper_type: printDetails.paper_type,
      });

    

      await personnelDetails(printRequestResponse.data.id,updatedStatus);

      
      
    } catch (error) {
      console.error("Failed to submit print request", error);
      alert("Failed to submit request. Please try again.");
      setIsDisabled(false);
    }
    finally {
      setIsDisabled(false); // Ensure the button is re-enabled regardless of success or failure
    }

    console.log(data)
    console.log(printDetails);
    
  };
  
  const handleUpload = () => {
    if (!file) {
      console.log("No File Selected!");
      return;
    }
    const formData = new FormData();
    formData.append("pdf", file);
    
  }
  
  return (
    <form className="printing-request-form " onSubmit={submitRequest}>
      <div className="printing-request-form-content ">
        <h1>Printing Request <span>Form</span></h1>
        <p>Please fill out the form below to submit your printing request. Thank you!</p>
        <div className="printing-request-form-content-inputs  w-full max-w-[60rem]">
          <div className="printing-request-form-content-inputs-left">
            <div className="flex gap-[1rem]">
            <div className="flex w-full max-w-[100%] gap-[1rem]">
            <div className="flex flex-col w-full max-w-[100%]">
            <p>First Name</p>
            <input type="text" placeholder="First name" value={data.first_name} disabled className="py-[0.5rem] pl-[0.5rem] rounded-[5px]"/>
            </div>
            <div className="flex flex-col w-full max-w-[100%]">
            <p>Last Name</p>
            <input type="text" placeholder="Last name" value={data.last_name} className="py-[0.5rem] pl-[0.5rem] rounded-[5px]"/>
            </div>
            </div>
            </div>
            <div className="flex flex-col">
            <p>Email</p>
            <input type="text" placeholder="Email" value={data.email} className="py-[0.5rem] pl-[0.5rem] rounded-[5px]"/>
            </div>

            <div className="flex gap-[1rem]">
            <div className="w-full max-w-[100%]">
              <p>Department</p>
            <select  value={data.department.id} disabled className="w-full max-w-[100%] py-[0.5rem] pl-[0.5rem] rounded-[5px] border-black border-[1px]">
              {department.map((dept, index) => (
                <option key={index} value={dept.id}>{dept.department_name}</option>
              ))}
            </select>
            </div>

            <div className="w-full max-w-[100%]">
              <p>Position</p>
            <select value={data.position.id} disabled className="w-full max-w-[100%] py-[0.5rem] pl-[0.5rem] rounded-[5px] border-black border-[1px]">
              {position.map((pos, index) => (
                <option key={index} value={pos.id}>{pos.position_name}</option>
              ))}
            </select>
            </div>
            </div>
          </div>

          <div className="printing-request-form-content-inputs-right items-center">
            <div className="flex w-full max-w-[100%] gap-[1rem]">
            <div className="w-full max-w-[100%]">
              <p>Type</p>
            <select onChange={(e) => setPrintDetails({ ...printDetails, printing_type: e.target.value })} className="w-full max-w-[100%] py-[0.5rem] pl-[0.5rem] rounded-[5px] border-black border-[1px]">
              {printingType.map((type, index) => (
                <option key={index} value={type.id}>{type.printing_type_name}</option>
              ))}
            </select>
            </div>
            <div className="w-full max-w-[100%]">
              <p>Request Type</p>
              <select
                onChange={(e) => setPrintDetails({ ...printDetails, request_type: e.target.value })}
                className="w-full max-w-[100%] py-[0.5rem] pl-[0.5rem] rounded-[5px] border-black border-[1px]"
                >
                {Array.isArray(requestType) &&
                    requestType.map((type, index) => (
                    <option key={index} value={type.id}>
                        {type.request_type_name}
                    </option>
                    ))}
                </select>
            </div>

            <div className="w-full max-w-[100%]">
              <p>Paper Size</p>
            <select onChange={(e) => setPrintDetails({ ...printDetails, paper_type: e.target.value })} className="w-full max-w-[100%] py-[0.5rem] pl-[0.5rem] rounded-[5px] border-black border-[1px]">
              {paperType.map((type, index) => (
                <option key={index} value={type.id}>{type.paper_type}</option>
              ))}
            </select>
            </div>
            </div>

            <div className="flex h-[fit-content] w-full max-w-[full] items-center gap-[1rem]">
            <div className="w-full max-w-[100%]">
              <p>Quantity</p>
            <input type="number" placeholder="Quantity" onChange={(e) => setPrintDetails({ ...printDetails, quantity: e.target.value })} className="py-[0.5rem] pl-[0.5rem] rounded-[5px]"/>
            </div>
            <div className="w-full max-w-[100%rem] flex flex-col">
              <p className="text-center">Duplex</p>
            <input type="checkbox" onChange={(e) => setPrintDetails({ ...printDetails, duplex: e.target.checked })} className="h-[1.5rem]"/>
            </div>
            {user.role === "Chairman" ? (
              <div className="w-full max-w-[100%rem] flex flex-col">
                <p className="text-center">Urgent</p>
                <input type="checkbox" onChange={(e) => setData({ ...data, urgent: e.target.checked })} className="h-[1.5rem]" checked={data.urgent}/>
              </div>
            ) : (
              <></>
            )}
            </div>
            <input type="file" onChange={(e) => setData({ ...data, pdf: e.target.files[0]})} className="py-[0.5rem] pl-[0.5rem] rounded-[5px]"></input>
            {/* <button onClick={handleUpload}>Upload</button> */}
            <button type="submit" id="printing-submit-request" disabled={isDisabled}>{isDisabled ? 'Processing...' : 'Submit Request'}</button>
          </div>
        </div>
      </div>
    </form>
  );
};

