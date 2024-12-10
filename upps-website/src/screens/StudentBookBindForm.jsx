import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import "../styles/PersonnelPrintRequestForm.css";
import {useNavigate} from "react-router-dom"

export const StudentBookBindForm = () => {
  const [department, setDepartment] = useState([]);
  const [printingType, setPrintingType] = useState([]);
  const [paperType, setPaperType] = useState([]);
  const [requestType, setRequestType] = useState([]);
  const [file,setFile] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const navigate = useNavigate()
  // Function to fetch data for dropdowns
  const fetchDropdownData = async (url, setter) => {
    try {
      const response = await axios.get(url);
      setter(response.data);
    } catch (error) {
      console.error(`Failed to fetch data from ${url}`, error);
    }
  };

  useEffect(() => {
  
    fetchDropdownData("http://127.0.0.1:8000/api/bookbind/requesttype", setRequestType)
    fetchDropdownData("http://127.0.0.1:8000/api/papertype/", setPaperType);
    fetchDropdownData("http://127.0.0.1:8000/api/department/", setDepartment);
  }, []);

  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    request_status: "pending",
    department: null,
    student_id: null,
    contact_number: null,
    pdf: null,
  });

  const [bookBindDetails, setBookBindDetails] = useState({
    quantity: "",
    request_type: null,
    paper_type: null,
  });

  useEffect(() => {
 

    if (paperType.length > 0) {
        setBookBindDetails((prevDetails) => ({
        ...prevDetails,
        paper_type: paperType[0].id // Set default value to the first item's ID
      }));
    }

    if (requestType.length > 0) {
        setBookBindDetails((prevDetails) => ({
        ...prevDetails,
        request_type: requestType[0].id,
      }));
    }

    if (department.length > 0) {
      setData((prevDetails) => ({
        ...prevDetails,
        department: department[0].id // Set default value to the first item's ID
      }));
    }

  }, [ paperType, department, requestType]);

  
  const personnelDetails = async (ids) => {
    try {

      const formData = new FormData();
      formData.append('service_type', 2)
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("email", data.email);
      formData.append("department", data.department);
      formData.append("student_id", data.student_id)
      formData.append("pdf", data.pdf);
      formData.append("contact_number", data.contact_number)
      formData.append("book_binding_request_details", ids);

      console.log(data.pdf);
      

      const studentRequest = await axios.post("http://127.0.0.1:8000/api/student/request/bookbinding", formData)

      const response = await axios.post("http://127.0.0.1:8000/api/student/paymentslip/", {
        description: "Payment Slip",
        book_bind_request: studentRequest.data.id
      })
      
      const queue = await axios.post("http://127.0.0.1:8000/api/student/queue/bookbinding", {
          "book_bind_student_request": response.data.id
      })

      console.log("You're Request Has Been Sent! Proceeding to Dashboard ..... ")
      alert("Request submitted successfully!");
      navigate('/')
      
    } catch (error) {
      console.error("Failed to submit personnel details", error);
      alert("Failed to submit personnel details. Please try again.");
    }
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    setIsDisabled(true);
    try {
      const formData = {
        quantity: bookBindDetails.quantity,
        paper_type: bookBindDetails.paper_type,
        request_type: bookBindDetails.request_type,
      }
      const bookBindRequestResponse = await axios.post("http://127.0.0.1:8000/api/bookbind/requestdetails", formData)
      
      await personnelDetails(bookBindRequestResponse.data.id);

      
    } catch (error) {
      console.error("Failed to submit print request", error);
      alert("Failed to submit request. Please try again.");
      setIsDisabled(false);
    }
    finally {
      setIsDisabled(false); // Ensure the button is re-enabled regardless of success or failure
    }
    console.log(data)
    
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
        <h1>Book Binding Request <span>Form</span></h1>
        <p>Please fill out the form below to submit your printing request. Thank you!</p>
        <div className="printing-request-form-content-inputs  w-full max-w-[60rem]">
          <div className="printing-request-form-content-inputs-left">
            <div className="flex gap-[1rem]">
            <div className="flex w-full max-w-[100%] gap-[1rem]">
            <div className="flex flex-col w-full max-w-[100%]">
            <p>First Name</p>
            <input type="text" placeholder="First name" onChange={(e) => setData({ ...data, first_name: e.target.value })} className="py-[0.5rem] pl-[0.5rem] rounded-[5px]"/>
            </div>
            <div className="flex flex-col w-full max-w-[100%]">
            <p>Last Name</p>
            <input type="text" placeholder="Last name" onChange={(e) => setData({ ...data, last_name: e.target.value })} className="py-[0.5rem] pl-[0.5rem] rounded-[5px]"/>
            </div>
            </div>
            </div>
            <div className="flex flex-col">
            <p>Email</p>
            <input type="email" placeholder="Email" onChange={(e) => setData({ ...data, email: e.target.value })} className="py-[0.5rem] pl-[0.5rem] rounded-[5px]"/>
            </div>
            <div className="flex w-full max-w-[100%] gap-[1rem]">
              <div className="flex flex-col">
              <p>Student Number</p>
              <input type="number" placeholder="Student Number" onChange={(e) => setData({ ...data, student_id: e.target.value })} className="py-[0.5rem] pl-[0.5rem] rounded-[5px]"/>
              </div>
              <div className="flex flex-col">
              <p>Contact Number</p>
              <input type="number" placeholder="Contact Number" value={data.contact_number || ''} onChange={(e) =>{
                let value = e.target.value;
                if(value.length <= 11){
                  setData({ ...data, contact_number: e.target.value })
                } 
                else{
                  setData({...data, contact_number: data.contact_number.slice(0, -1) })
                }
              }  } className="py-[0.5rem] pl-[0.5rem] rounded-[5px]"/>
              </div>
            </div>
           

            <div className="flex gap-[1rem]">
            <div className="w-full max-w-[100%]">
              <p>Department</p>
            <select onChange={(e) => setData({ ...data, department: e.target.value })} className="w-full max-w-[100%] py-[0.5rem] pl-[0.5rem] rounded-[5px] border-black border-[1px]">
              {department.map((dept, index) => (
                <option key={index} value={dept.id}>{dept.department_name}</option>
              ))}
            </select>
            </div>

            </div>
          </div>

          <div className="printing-request-form-content-inputs-right items-center">
            <div className="flex w-full max-w-[100%] gap-[1rem]">

            <div className="w-full max-w-[100%]">
              <p>Request Type</p>
            <select onChange={(e) => setBookBindDetails({ ...bookBindDetails, request_type: e.target.value })} className="w-full max-w-[100%] py-[0.5rem] pl-[0.5rem] rounded-[5px] border-black border-[1px]">
              {requestType.map((type, index) => (
                <option key={index} value={type.id}>{type.request_type_name}</option>
              ))}
            </select>
            </div>

            <div className="w-full max-w-[100%]">
              <p>Paper Size</p>
            <select onChange={(e) => setBookBindDetails({ ...bookBindDetails, paper_type: e.target.value })} className="w-full max-w-[100%] py-[0.5rem] pl-[0.5rem] rounded-[5px] border-black border-[1px]">
              {paperType.map((type, index) => (
                <option key={index} value={type.id}>{type.paper_type}</option>
              ))}
 Change     </select>
            </div>
            </div>

            <div className="flex h-[fit-content] w-full max-w-[full] items-center gap-[1rem]">
            <div className="w-full max-w-[100%]">
              <p>Quantity</p>
            <input type="number" placeholder="Quantity" onChange={(e) => setBookBindDetails({ ...bookBindDetails, quantity: e.target.value })} className="py-[0.5rem] pl-[0.5rem] rounded-[5px]"/>
            </div>
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

