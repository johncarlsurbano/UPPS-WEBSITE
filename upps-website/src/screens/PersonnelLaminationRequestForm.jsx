import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import "../styles/PersonnelPrintRequestForm.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const PersonnelLaminationRequestForm = () => {
  const [department, setDepartment] = useState([]);
  const [laminationType, setLaminationType] = useState([]);
  const [paperType, setPaperType] = useState([]);
  const [position, setPosition] = useState([]);
  const [file, setFile] = useState(null);

  const user = useSelector((state) => state.user.value.user);
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(false);

  

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
    fetchDropdownData(
      "http://127.0.0.1:8000/api/lamination/type",
      setLaminationType,
    );
    fetchDropdownData("http://127.0.0.1:8000/api/papertype/", setPaperType);
    fetchDropdownData("http://127.0.0.1:8000/api/position/", setPosition);
    fetchDropdownData("http://127.0.0.1:8000/api/department/", setDepartment);
  }, []);

  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    request_status: "pending",
    department: user.department.id,
    position: user.position.id,
    pdf: null,
  });

  const [laminationDetails, setLaminationDetails] = useState({
    quantity: null,
    request_type: null,
    paper_type: null
  });

  useEffect(() => {
    if (laminationType.length > 0) {
      setLaminationDetails((prevDetails) => ({
        ...prevDetails,
        request_type: laminationType[0].id, // Set default value to the first item's ID
      }));
    }

    if (paperType.length > 0) {
      setLaminationDetails((prevDetails) => ({
        ...prevDetails,
        paper_type: paperType[0].id, // Set default value to the first item's ID
      }));
    }

    if (department.length > 0) {
      setData((prevDetails) => ({
        ...prevDetails,
        department: department[0].id, // Set default value to the first item's ID
      }));
    }

    if (position.length > 0) {
      setData((prevDetails) => ({
        ...prevDetails,
        position: position[0].id, // Set default value to the first item's ID
      }));
    }
  }, [laminationType, paperType, department, position]);
  
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

  const personnelDetails = async (ids) => {
    try {
      const formData = new FormData();
      formData.append('service_type', 3)
      formData.append("user", user.id)
      formData.append("request_status", data.request_status || "pending");
      formData.append("pdf", data.pdf);
      formData.append("lamination_request_details", ids);

      console.log(data.pdf);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/personnel/request/lamination",
        formData
      );

      const updatedRequest = response.data

      await axios.post("http://127.0.0.1:8000/api/personnel/queue/lamination", {
        lamination_personnel_request: updatedRequest.id,
        queue_status: "Pending",
      });

      console.log("Request added to queue successfully.");
      alert("Request submitted successfully!");
      navigate('/personnel/dashboard')

    } catch (error) {
      console.error("Failed to submit personnel details", error);
      alert("Failed to submit personnel details. Please try again.");
    }
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    setIsDisabled(true)
    try {
      const laminationRequestResponse = await axios.post(
        "http://127.0.0.1:8000/api/lamination/requestdetails",
        {
          quantity: laminationDetails.quantity,
          request_type: laminationDetails.request_type,
          paper_type: laminationDetails.paper_type,
        }
      );

      await personnelDetails(laminationRequestResponse.data.id);
     
    } catch (error) {
      console.error("Failed to submit print request", error);
      alert("Failed to submit request. Please try again.");
      setIsDisabled(false);
    }
    finally {
      setIsDisabled(false); // Ensure the button is re-enabled regardless of success or failure
    }

    console.log(laminationDetails.request_type)

  };

  const handleUpload = () => {
    if (!file) {
      console.log("No File Selected!");
      return;
    }
    const formData = new FormData();
    formData.append("pdf", file);
  };

  return (
    <form className="printing-request-form " onSubmit={submitRequest}>
      <div className="printing-request-form-content ">
        <h1>Lamination Request Form</h1>
        <p>
          Please fill out the form below to submit your lamination request.
          Thank you!
        </p>
        <div className="printing-request-form-content-inputs  w-full max-w-[60rem]">
          <div className="printing-request-form-content-inputs-left">
            <div className="flex gap-[1rem]">
              <div className="flex w-full max-w-[100%] gap-[1rem]">
                <div className="flex flex-col w-full max-w-[100%]">
                  <p>First Name</p>
                  <input
                    type="text"
                    placeholder="First name"
                    value={data.first_name} 
                    disabled
                    onChange={(e) =>
                      setData({ ...data, first_name: e.target.value })
                    }
                    className="py-[0.5rem] pl-[0.5rem] rounded-[5px]"
                  />
                </div>
                <div className="flex flex-col w-full max-w-[100%]">
                  <p>Last Name</p>
                  <input
                    type="text"
                    value={data.last_name} 
                    disabled
                    placeholder="Last name"
                    onChange={(e) =>
                      setData({ ...data, last_name: e.target.value })
                    }
                    className="py-[0.5rem] pl-[0.5rem] rounded-[5px]"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <p>Email</p>
              <input
                type="text"
                placeholder="Email"
                value={data.email} 
                disabled
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="py-[0.5rem] pl-[0.5rem] rounded-[5px]"
              />
            </div>

            <div className="flex gap-[1rem]">
              <div className="w-full max-w-[100%]">
                <p>Department</p>
                <select
                  value={data.department.id}
                  disabled
                  onChange={(e) =>
                    setData({ ...data, department: e.target.value })
                  }
                  className="w-full max-w-[100%] py-[0.5rem] pl-[0.5rem] rounded-[5px] border-black border-[1px]"
                >
                  {department.map((dept, index) => (
                    <option key={index} value={dept.id}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full max-w-[100%]">
                <p>Position</p>
                <select
                  value={data.department.id}
                  disabled
                  onChange={(e) =>
                    setData({ ...data, position: e.target.value })
                  }
                  className="w-full max-w-[100%] py-[0.5rem] pl-[0.5rem] rounded-[5px] border-black border-[1px]"
                >
                  {position.map((pos, index) => (
                    <option key={index} value={pos.id}>
                      {pos.position_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="printing-request-form-content-inputs-right items-center">
            <div className="flex w-full max-w-[100%] gap-[1rem]">
              <div className="w-full max-w-[100%]">
                <p>Type</p>
                <select
                  onChange={(e) =>
                    setLaminationDetails({
                      ...laminationDetails,
                      request_type: e.target.value,
                    })
                  }
                  className="w-full max-w-[100%] py-[0.5rem] pl-[0.5rem] rounded-[5px] border-black border-[1px]"
                >
                  {laminationType.map((type, index) => (
                    <option key={index} value={type.id}>
                      {type.request_type_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full max-w-[100%]">
                <p>Size</p>
                <select
                  onChange={(e) =>
                    setLaminationDetails({
                      ...laminationDetails,
                      paper_type: e.target.value,
                    })
                  }
                  className="w-full max-w-[100%] py-[0.5rem] pl-[0.5rem] rounded-[5px] border-black border-[1px]"
                >
                  {paperType.map((type, index) => (
                    <option key={index} value={type.id}>
                      {type.paper_type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* <div className="flex h-[fit-content] w-full max-w-[full] items-center gap-[1rem]">
              <div className="w-full max-w-[100%]">
                <p>Quantity</p>
                <input
                  type="number"
                  placeholder="Quantity"
                  onChange={(e) =>
                    setPrintDetails({
                      ...printDetails,
                      quantity: e.target.value,
                    })
                  }
                  className="py-[0.5rem] pl-[0.5rem] rounded-[5px]"
                />
              </div>
              <div className="w-full max-w-[100%rem] flex flex-col">
                <p className="text-center">Duplex</p>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setPrintDetails({
                      ...printDetails,
                      duplex: e.target.checked,
                    })
                  }
                  className="h-[1.5rem]"
                />
              </div>
            </div> */}
            <div className="w-full max-w-[100%]">
                <p>Quantity</p>
                <input
                  type="number"
                  placeholder="Quantity"
                  onChange={(e) =>
                    setLaminationDetails({
                      ...laminationDetails,
                      quantity: e.target.value,
                    })
                  }
                  className="py-[0.5rem] pl-[0.5rem] rounded-[5px]"
                />
              </div>
            <input
              type="file"
              onChange={(e) => setData({ ...data, pdf: e.target.files[0] })}
              className="py-[0.5rem] pl-[0.5rem] rounded-[5px]"
            ></input>
            {/* <button onClick={handleUpload}>Upload</button> */}
            <button type="submit" id="printing-submit-request" disabled={isDisabled}>{isDisabled ? 'Processing...' : 'Submit Request'}</button>
          </div>
        </div>
      </div>
    </form>
  );
};
