import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import "../styles/PersonnelPrintRequestForm.css";
import {useNavigate} from "react-router-dom"
import {useSelector} from "react-redux"
import Swal from 'sweetalert2'


export const StudentForm = () => {
  const [department, setDepartment] = useState([]); 
  const [printingType, setPrintingType] = useState([]);
  const [paperType, setPaperType] = useState([]);
  const [requestType, setRequestType] = useState([]);
  const [serviceType, setServiceType] = useState([]);
  const [file,setFile] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState("1");
  const [bookBindRequestType, setBookBindRequestType] = useState([])
  const [laminationRequestType, setLaminationRequestType] = useState([])
  const [errors, setErrors] = useState({});

  const user = useSelector((state) => state.user.value.user);
  

  const navigate = useNavigate()

  
  const validateForm = () => {
    const newErrors = {};
    if (!data.first_name.trim()) newErrors.first_name = "First name is required.";
    if (!data.last_name.trim()) newErrors.last_name = "Last name is required.";
    if (!data.email.trim() || !/\S+@\S+\.\S+/.test(data.email)) newErrors.email = "Valid email is required.";
    if (!data.student_id) newErrors.student_id = "Student number is required.";
    if (!data.pdf) newErrors.pdf = "File upload is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



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
    fetchDropdownData("http://127.0.0.1:8000/api/print/printingtype/", setPrintingType);
    fetchDropdownData("http://127.0.0.1:8000/api/print/requesttype/", setRequestType)
    fetchDropdownData("http://127.0.0.1:8000/api/servicetype/", setServiceType)
    fetchDropdownData("http://127.0.0.1:8000/api/papertype/", setPaperType);
    fetchDropdownData("http://127.0.0.1:8000/api/department/", setDepartment);

    //

    fetchDropdownData("http://127.0.0.1:8000/api/bookbind/requesttype", setBookBindRequestType)
    fetchDropdownData("http://127.0.0.1:8000/api/lamination/type", setLaminationRequestType)

  }, []);

  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department: null,
    student_id: null,
    contact_number: null,
    pdf: null,
    remarks: ""
  });

  const [printDetails, setPrintDetails] = useState({
    duplex: false,
    quantity: null,
    printing_type: null,
    paper_type: null,
  });

  const [bookBindDetails, setBookBindDetails] = useState({
    quantity: null,
    request_type: null,
    paper_type: null,
  });

  const [laminationDetails, setLaminationDetails] = useState({
    quantity: null,
    request_type: null,
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

    if (requestType.length > 0) {
      setPrintDetails((prevDetails) => ({
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

    if (paperType.length > 0) {
        setBookBindDetails((prevDetails) => ({
        ...prevDetails,
        paper_type: paperType[0].id // Set default value to the first item's ID
      }));
    }

    if (bookBindRequestType.length > 0) {
        setBookBindDetails((prevDetails) => ({
        ...prevDetails,
        request_type: bookBindRequestType[0].id,
      }));
    }


    if (paperType.length > 0) {
        setLaminationDetails((prevDetails) => ({
        ...prevDetails,
        paper_type: paperType[0].id // Set default value to the first item's ID
      }));
    }

    if (laminationRequestType.length > 0) {
        setLaminationDetails((prevDetails) => ({
        ...prevDetails,
        request_type: laminationRequestType[0].id,
      }));
    }

    if (serviceType.length > 0) {
      setData((prevDetails) => ({
        ...prevDetails,
        service_type: serviceType[0].id, // Set default value to the first item's ID
      }))
    }

  }, [printingType, paperType, department, requestType, serviceType, bookBindRequestType, laminationRequestType]);

  
  const personnelDetails = async (ids) => {
    try {
    if(selectedServiceType === "1") {
        try {
            const formData = new FormData();
            formData.append("service_type", 1); 
            formData.append("first_name", data.first_name);
            formData.append("last_name", data.last_name);
            formData.append("email", data.email);
            formData.append("department", data.department);
            formData.append("student_id", data.student_id)
            formData.append("pdf", data.pdf);
            formData.append("contact_number", data.contact_number)
            formData.append("print_request_details", ids);

            console.log("Logging formData contents:");
            for (let pair of formData.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }
            
            const studentRequest = await axios.post("http://127.0.0.1:8000/api/studentform/", formData)

            const response = await axios.post("http://127.0.0.1:8000/api/student/paymentslip/", {
                description: "Payment Slip",
                request: studentRequest.data.id
            })
            
            const queue = await axios.post("http://127.0.0.1:8000/api/student/queue", {
                "student_print_request": response.data.id
            })
            Swal.fire({
                title: "Success!",
                text: "Your request was successfully submitted!",
                icon: "success"
            });
            navigate('/')
            

        } catch (e) {
            console.error("Failed to submit request", e);

            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed to submit request. Please try again.",
              });
        }
    }
    else if(selectedServiceType === "2") {
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
            formData.append("remarks", data.remarks)
      
            console.log(data.pdf);
            
      
            const studentRequest = await axios.post("http://127.0.0.1:8000/api/student/request/bookbinding", formData)
      
            const response = await axios.post("http://127.0.0.1:8000/api/student/paymentslip/", {
              description: "Payment Slip",
              book_bind_request: studentRequest.data.id
            })
            
            const queue = await axios.post("http://127.0.0.1:8000/api/student/queue/bookbinding", {
                "book_bind_student_request": response.data.id
            })
      
            Swal.fire({
                title: "Success!",
                text: "Your request was successfully submitted!",
                icon: "success"
            });
            navigate('/')
            
        } catch (error) {
            console.error("Failed to submit student details", error);

            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed to submit student details. Please try again.",
              });
            
        }
    }
    else if(selectedServiceType === "3") {
        try {
            const formData = new FormData();
            formData.append('service_type', 3)
            formData.append("first_name", data.first_name);
            formData.append("last_name", data.last_name);
            formData.append("email", data.email);
            formData.append("department", data.department);
            formData.append("student_id", data.student_id)
            formData.append("pdf", data.pdf);
            formData.append("contact_number", data.contact_number)
            formData.append("lamination_request_details", ids);
            formData.append("remarks", data.remarks)


            console.log(data.pdf);
            

            const studentRequest = await axios.post("http://127.0.0.1:8000/api/student/request/lamination", formData)

            const response = await axios.post("http://127.0.0.1:8000/api/student/paymentslip/", {
                description: "Payment Slip",
                lamination_request: studentRequest.data.id
            })
            
            const queue = await axios.post("http://127.0.0.1:8000/api/student/queue/lamination", {
                "lamination_student_request": response.data.id
            })

            Swal.fire({
                title: "Success!",
                text: "Your request was successfully submitted!",
                icon: "success"
            });
            navigate('/')
            
        } catch (error) {
            console.error("Failed to submit student details", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed to submit student details. Please try again.",
              });
        }

    } 
    else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Request Failed",
          });
    }
    console.log(selectedServiceType)
    }
    
    catch (error) {
      console.error("Failed to submit student details", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to submit student details. Please try again.",
      });
    }
  };  

  const submitRequest = async (e) => {
    
    e.preventDefault();
    console.log(data)
    if (!validateForm()) {
        // Optionally show a message to the user or handle the validation failure
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Form is invalid. Please check your input.",
          });
        return; // Prevent form submission if validation fails
      }

    try {
      setIsDisabled(true)
      if(selectedServiceType === "1"){
        const formData = {
            duplex: printDetails.duplex,
            quantity: printDetails.quantity,
            printing_type: printDetails.printing_type,
            paper_type: printDetails.paper_type,
            request_type: printDetails.request_type,
        }
        const printRequestResponse = await axios.post("http://127.0.0.1:8000/api/printrequestdetails/", formData)

        await personnelDetails(printRequestResponse.data.id);

    
      } else if (selectedServiceType === "2") {
        setIsDisabled(true)
        const formData = {
            quantity: bookBindDetails.quantity,
            paper_type: bookBindDetails.paper_type,
            request_type: bookBindDetails.request_type,
          }
          const bookBindRequestResponse = await axios.post("http://127.0.0.1:8000/api/bookbind/requestdetails", formData)
          
          await personnelDetails(bookBindRequestResponse.data.id);
          
          console.log(formData)
    
      } else if (selectedServiceType === "3") {
        setIsDisabled(true)
        const formData = {
            quantity: laminationDetails.quantity,
            paper_type: laminationDetails.paper_type,
            request_type: laminationDetails.request_type,
          }
          const laminationRequestResponse = await axios.post("http://127.0.0.1:8000/api/lamination/requestdetails", formData)
          
          await personnelDetails(laminationRequestResponse.data.id);
          console.log(formData)
     }
     else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No Service Selected",
          });
 
     }
    
    }
      
 
    catch (error) {
      console.error("Failed to submit print request", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to submit request. Please try again.",
      });
      setIsDisabled(false);
    }
    finally {
      setIsDisabled(false); // Ensure the button is re-enabled regardless of success or failure
    }

  
    
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
        <h1>Student Request <span className="text-yellow">Form</span></h1>
        <p>Please fill out the form below to submit your printing request. Thank you!</p>
        <div className="printing-request-form-content-inputs  w-full max-w-[60rem]">
          <div className="printing-request-form-content-inputs-left">
            <div className="flex gap-[1rem]">
            <div className="flex w-full max-w-[100%] gap-[1rem]">
            <div className="flex flex-col w-full max-w-[100%]">
            <p>First Name</p>
            <input type="text" placeholder="First name" onChange={(e) => setData({ ...data, first_name: e.target.value })} className={`w-full p-2 border rounded-lg ${errors.first_name ? "border-red-500" : "border-black"}`}/>
            {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
            </div>
            <div className="flex flex-col w-full max-w-[100%]">
            <p>Last Name</p>
            <input type="text" placeholder="Last name" onChange={(e) => setData({ ...data, last_name: e.target.value })} className={`w-full p-2 border rounded-lg ${ errors.last_name ? "border-red-500" : "border-black" }`}/>
            {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
            </div>
            </div>
            </div>
            <div className="flex flex-col">
            <p>Email</p>
            <input type="email" placeholder="Email" onChange={(e) => setData({ ...data, email: e.target.value })} className={`w-full p-2 border rounded-lg ${ errors.email ? "border-red-500" : "border-black" }`}/>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="flex w-full max-w-[100%] gap-[1rem]">
              <div className="flex flex-col">
              <p>Student Number</p>
              <input type="number" placeholder="Student Number" onChange={(e) => setData({ ...data, student_id: e.target.value })} className={`w-full p-2 border rounded-lg ${ errors.student_id ? "border-red-500" : "border-black" }`}/>
              {errors.student_id && <p className="text-red-500 text-sm mt-1">{errors.student_id}</p>}
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
           
          {}
          <div className="printing-request-form-content-inputs-right items-center">
  <div className="w-full max-w-[100%]">
    <p>Service Type</p>
    <select
      onChange={(e) => setSelectedServiceType(e.target.value)}
      className="w-full max-w-[100%] py-[0.5rem] pl-[0.5rem] rounded-[5px] border-black border-[1px]"
      value={selectedServiceType}
    >
      {serviceType.map((type, index) => (
        <option key={index} value={type.id}>
          {type.service_type_name}
        </option>
      ))}
    </select>
  </div>

  {selectedServiceType === "1" ? (
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
      <select onChange={(e) => setPrintDetails({ ...printDetails, request_type: e.target.value })} className="w-full max-w-[100%] py-[0.5rem] pl-[0.5rem] rounded-[5px] border-black border-[1px]">
        {requestType.map((type, index) => (
          type.request_type_name !== "Examination" && (
            <option key={index} value={type.id}>{type.request_type_name}</option>
          )
        ))}
      </select>
    </div>

    <div className="w-full max-w-[100%]">
      <p>Paper Size</p>
    <select onChange={(e) => setPrintDetails({ ...printDetails, paper_type: e.target.value })} className="w-full max-w-[100%] py-[0.5rem] pl-[0.5rem] rounded-[5px] border-black border-[1px]">
      {paperType.map((type, index) => (
        <option key={index} value={type.id}>{type.paper_type}</option>
      ))}
Change     </select>
    </div>
    </div>

    <div className="flex h-[fit-content] w-full max-w-[full] items-center gap-[1rem]">
    <div className="w-full max-w-[100%]">
      <p>Number of Copies</p>
    <input type="number" placeholder="Number of Copies" onChange={(e) => setPrintDetails({ ...printDetails, quantity: e.target.value })} className="py-[0.5rem] pl-[0.5rem] rounded-[5px]"/>
    </div>
    <div className="w-full max-w-[100%rem] flex flex-col">
      <p className="text-center">Back to back</p>
    <input type="checkbox" onChange={(e) => setPrintDetails({ ...printDetails, duplex: e.target.checked })} className="h-[1.5rem]"/>
    </div>
    </div>
   
    <div>
        <label className="block text-sm font-medium mb-1">Upload File</label>
        <input
          accept=".pdf"
          type="file"
          onChange={(e) => setData({ ...data, pdf: e.target.files[0]})}
          className={`w-full p-2 border rounded-lg ${
            errors.pdf ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.pdf && <p className="text-red-500 text-sm mt-1">{errors.pdf}</p>}
    </div>
    <button type="submit" id="printing-submit-request" disabled={isDisabled}>{isDisabled ? 'Processing...' : 'Submit Request'}</button>
  </div>
    ) : selectedServiceType === "2" ? (
        <div className="printing-request-form-content-inputs-right items-center">
            <div className="flex w-full max-w-[100%] gap-[1rem]">

            <div className="w-full max-w-[100%]">
              <p>Request Type</p>
            <select onChange={(e) => setBookBindDetails({ ...bookBindDetails, request_type: e.target.value })} className="w-full max-w-[100%] py-[0.5rem] pl-[0.5rem] rounded-[5px] border-black border-[1px]">
              {bookBindRequestType.map((type, index) => (
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
            <input type="number" placeholder="Qty" onChange={(e) => setBookBindDetails({ ...bookBindDetails, quantity: e.target.value })} className="py-[0.5rem] pl-[0.5rem] rounded-[5px]"/>
            </div>
            <div>
                <p>Remarks:</p>
                <textarea className="border-black border-1" rows={2} cols={25} onChange={(e) => setData({
                  ...data, remarks: e.target.value,
                })}/>
            </div>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Upload File</label>
                <input
                accept=".pdf"
                type="file"
                onChange={(e) => setData({ ...data, pdf: e.target.files[0]})}
                className={`w-full p-2 border rounded-lg ${
                    errors.pdf ? "border-red-500" : "border-gray-300"
                }`}
                />
                {errors.pdf && <p className="text-red-500 text-sm mt-1">{errors.pdf}</p>}
            </div>
            <button type="submit" id="printing-submit-request" disabled={isDisabled}>{isDisabled ? 'Processing...' : 'Submit Request'}</button>
          </div>
    ) : selectedServiceType === "3" ? (
        <div className="printing-request-form-content-inputs-right items-center">
            <div className="flex w-full max-w-[100%] gap-[1rem]">

            <div className="w-full max-w-[100%]">
              <p>Request Type</p>
            <select onChange={(e) => setLaminationDetails({ ...laminationDetails, request_type: e.target.value })} className="w-full max-w-[100%] py-[0.5rem] pl-[0.5rem] rounded-[5px] border-black border-[1px]">
              {laminationRequestType.map((type, index) => (
                <option key={index} value={type.id}>{type.request_type_name}</option>
              ))}
            </select>
            </div>

            <div className="w-full max-w-[100%]">
              <p>Paper Size</p>
            <select onChange={(e) => setLaminationDetails({ ...laminationDetails, paper_type: e.target.value })} className="w-full max-w-[100%] py-[0.5rem] pl-[0.5rem] rounded-[5px] border-black border-[1px]">
              {paperType.map((type, index) => (
                <option key={index} value={type.id}>{type.paper_type}</option>
              ))}
 Change     </select>
            </div>
            </div>

            <div className="flex h-[fit-content] w-full max-w-[full] items-center gap-[1rem]">
            <div className="w-full max-w-[100%]">
              <p>Quantity</p>
            <input type="number" placeholder="Quantity" onChange={(e) => setLaminationDetails({ ...laminationDetails, quantity: e.target.value })} className="py-[0.5rem] pl-[0.5rem] rounded-[5px]"/>
            </div>
            <div>
                <p>Remarks:</p>
                <textarea className="border-black border-1" rows={2} cols={25} onChange={(e) => setData({
                  ...data, remarks: e.target.value,
                })}/>
            </div>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Upload File</label>
                <input
                type="file"
                accept=".pdf"
                onChange={(e) => setData({ ...data, pdf: e.target.files[0]})}
                className={`w-full p-2 border rounded-lg ${
                    errors.pdf ? "border-red-500" : "border-gray-300"
                }`}
                />
                {errors.pdf && <p className="text-red-500 text-sm mt-1">{errors.pdf}</p>}
            </div>
            <button type="submit" id="printing-submit-request" disabled={isDisabled}>{isDisabled ? 'Processing...' : 'Submit Request'}</button>
          </div>
    ) : null}
    </div>
          </div>
        </div>
      
    </form>
  );
};

