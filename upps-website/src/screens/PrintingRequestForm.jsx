import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import "../styles/PersonnelPrintRequestForm.css";

export const PrintingRequestForm = () => {
  const [department, setDepartment] = useState([]);
  const [printingType, setPrintingType] = useState([]);
  const [paperType, setPaperType] = useState([]);
  const [position, setPosition] = useState([]);
  const [file,setFile] = useState(null);

  
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
    fetchDropdownData("http://127.0.0.1:8000/api/printingtype/", setPrintingType);
    fetchDropdownData("http://127.0.0.1:8000/api/papertype/", setPaperType);
    fetchDropdownData("http://127.0.0.1:8000/api/position/", setPosition);
    fetchDropdownData("http://127.0.0.1:8000/api/department/", setDepartment);
  }, []);

  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    request_status: "pending",
    department: null,
    position: null,
    pdf: null,
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
        printing_type: printingType[0].id // Set default value to the first item's ID
      }));
    }

    if (paperType.length > 0) {
      setPrintDetails((prevDetails) => ({
        ...prevDetails,
        paper_type: paperType[0].id // Set default value to the first item's ID
      }));
    }

    if (department.length > 0) {
      setData((prevDetails) => ({
        ...prevDetails,
        department: department[0].id // Set default value to the first item's ID
      }));
    }

    if (position.length > 0) {
      setData((prevDetails) => ({
        ...prevDetails,
        position: position[0].id // Set default value to the first item's ID
      }));
    }
  }, [printingType, paperType, department, position]);

  
  const personnelDetails = async (ids) => {
    try {

      const formData = new FormData();
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("email", data.email);
      formData.append("request_status", data.request_status || "pending");
      formData.append("department", data.department);
      formData.append("position", data.position);
      formData.append("pdf", data.pdf);
      formData.append("print_request_details", ids);

      console.log(data.pdf);
      

      const response = await axios.post("http://127.0.0.1:8000/api/createrequest/", formData)
      
    } catch (error) {
      console.error("Failed to submit personnel details", error);
      alert("Failed to submit personnel details. Please try again.");
    }
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    try {
      const printRequestResponse = await axios.post("http://127.0.0.1:8000/api/printrequestdetails/", {
        duplex: printDetails.duplex,
        quantity: printDetails.quantity,
        printing_type: printDetails.printing_type,
        paper_type: printDetails.paper_type,
      });
      

      await personnelDetails(printRequestResponse.data.id);
      alert("Request submitted successfully!");
    } catch (error) {
      console.error("Failed to submit print request", error);
      alert("Failed to submit request. Please try again.");
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
            <input type="text" placeholder="Email" onChange={(e) => setData({ ...data, email: e.target.value })} className="py-[0.5rem] pl-[0.5rem] rounded-[5px]"/>
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

            <div className="w-full max-w-[100%]">
              <p>Position</p>
            <select onChange={(e) => setData({ ...data, position: e.target.value })} className="w-full max-w-[100%] py-[0.5rem] pl-[0.5rem] rounded-[5px] border-black border-[1px]">
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
            </div>
            <input type="file" onChange={(e) => setData({ ...data, pdf: e.target.files[0]})} className="py-[0.5rem] pl-[0.5rem] rounded-[5px]"></input>
            {/* <button onClick={handleUpload}>Upload</button> */}
            <button type="submit" id="printing-submit-request">Submit Request</button>
          </div>
        </div>
      </div>
    </form>
  );
};
