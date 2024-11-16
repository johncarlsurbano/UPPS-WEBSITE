import React, { useState, useEffect } from "react";
import Header1 from "../components/Header1.jsx";
import Dropdown from "../components/Dropdown.jsx";
import InputFields from "../components/InputFields.jsx";
import Button from "../components/Button.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { post, generateRegistrationCode, login } from "../features/user.jsx";
import axios from "axios"
export const CreateAccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // CREATE USER 
  const [user, setUser] = useState([])
  const [error, setError] = useState("")
  const[name, setName] = useState();
  const [department, setDepartment] = useState([])
  const [position, setPosition] = useState([])

  const fetchDepartment = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/department/")
      const data = response.data
      setDepartment(data)

    }catch (e) {
      console.error(e)
    }
  }
  
  const fetchPosition = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/position/")
      const data = response.data
      setPosition(data)

    }catch (e) {
      console.error(e)
    }
  }

  const fetchUsers = async () => {
    
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/getuser/")
      const data = response.data;
      setUser(data)
    } catch (error) {
       setError(error)
    }
  }



  const passregex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
  );
  const emailregex = new RegExp("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

  const [formData, setFormData] = useState({
    "first_name": "",
    "last_name": "",
    "email": "",
    "password": "",
    "confirmpassword": "",
    "day": "",
    "month": "",
    "year": "",
    "city": "",
    "barangay": "",
    "zipcode": "",
    "street_address": "",
    "department": "",
    "position": "",
    "code": "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const emailExist = user.some((user) => user.email === formData.email);

    if (emailExist) {
      alert("Email is already in use!")
      return;
    }
    

    // Basic validation for password match and regex checks
    if (formData.password !== formData.confirmpassword) {
      alert("Passwords do not match");
      return;
    }

    if (!passregex.test(formData.password)) {
      alert("Password does not meet criteria");
      return;
    }

    if (!emailregex.test(formData.email)) {
      alert("Invalid email address");
      return;
    }

    if (!formData.department) {
      alert("Please select a department");
      return;
    }

    if (!formData.position) {
      alert("Please select a position");
      return;
    }
    dispatch(post(formData))
    dispatch(generateRegistrationCode()) 
    navigate("/registrationcode");
    // try{
    //   const response = await axios.post("http://127.0.0.1:8000/api/createuser/", formData)
    //   const data = response.data
    //   dispatch(post(formData))
    //   dispatch(login(formData))
    //   dispatch(generateRegistrationCode())
    // }

    // catch (error) {
    //   console.error(error)
    // }


  }

  useEffect (() => {
    fetchDepartment()
    fetchPosition()
    fetchUsers()
  } ,[])


  return (
    <div>
      <Header1 onClick={() => navigate("/login")} />
      <form
        className="flex justify-center text-center flex-col items-center mt-12"
        onSubmit={handleSubmit}
      >
        <h1>
          Create <span>Account</span>
        </h1>
        <h2 className="text-darkblue text-3xl mt-3">Welcome!</h2>

        <div className="flex w-full justify-evenly mt-4 px-[250px]">
          <div className="">
            <div className="flex flex-1 gap-2">
              <div>
                <p className="text-start my-2 text-[1rem]">First Name</p>
                <InputFields
                  name="first_name"
                  type="text"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <p className="text-start my-2 text-[1rem]">Last Name</p>
                <InputFields
                  name="last_name"
                  type="text"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <p className="text-start mb-1.5 text-[1rem]">Email</p>
              <InputFields
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                style={"w-full"}
              />
            </div>
            <div>
              <p className="text-start mb-1.5 text-[1rem]">Password</p>
              <InputFields
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={"w-full"}
              />
            </div>
            <div>
              <p className="text-start mb-1.5 text-[1rem]">Confirm Password</p>
              <InputFields
                name="confirmpassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmpassword}
                onChange={handleChange}
                style={"w-full"}
              />
            </div>
          </div>

          <div>
            <div className="">
              <p className="text-start my-2 text-[1rem]">Date of Birth</p>
              <div className="flex gap-2  ">
                <InputFields
                  name="day"
                  value={formData.day}
                  placeholder={"Day"}
                  onChange={handleChange}
                  style={"w-[9.5rem]"} 
                />
                <InputFields
                  name="month"
                  type="text"
                  placeholder="Month"
                  value={formData.month}
                  onChange={handleChange}
                  style={"w-[9.5rem]"} 
                />
                <InputFields
                  name="year"
                  placeholder={"Year"}
                  value={formData.year}
                  onChange={handleChange}
                  style={"w-[9.5rem]"} 
                />
              </div>

              <div className="flex flex-1 gap-2">
                <div className="w-full">
                  <p className="text-start mb-2 text-[1rem]">Department</p>
                  <Dropdown
                    name="department"
                    items={department}
                    value={formData.department}
                    handleChange={handleChange}
                    valueKey="id"
                    displayKey="department_name"
                    style={"w-[full] mb-2"}
                  />
                </div>
                <div className="w-full">
                  <p className="text-start mb-2 text-[1rem]">Position</p>
                  <Dropdown
                    name="position"
                    items={position}
                    value={formData.position}
                    handleChange={handleChange}
                    style={"w-[full]"}
                    displayKey="position_name"
                    valueKey="id"
                  />
                </div>
              </div>

              <div className="flex flex-1 gap-2">
                <div className="w-full">
                  <p className="text-start my-2 text-[1rem]">Street Address</p>
                  <InputFields
                  name="street_address"
                  type="text"
                  placeholder="Street Address"
                  value={formData.street_address}
                  onChange={handleChange}
                />
                </div>
                <div className="w-full">
                  <p className="text-start my-2 text-[1rem]">Barangay</p>
                  <InputFields
                  name="barangay"
                  type="text"
                  placeholder="Barangay"
                  value={formData.barangay}
                  onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex flex-1 gap-2">
                <div className="w-full">
                  <p className="text-start mb-1.5 text-[1rem]">City</p>
                  <InputFields
                  name="city"
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                />
                </div>
                <div className="w-full">
                  <p className="text-start mb-1.5 text-[1rem]">Zip Code</p>
                  <InputFields
                    name="zipcode"
                    type="text"
                    placeholder="Zip Code"
                    value={formData.zipcode}
                    onChange={handleChange}
                />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          style="text-white bg-uppsdarkblue hover:bg-uppsyellow rounded-full py-5 px-28 mb-7 mt-3"
          title="Create Account"
          type="submit"
        />
      </form>
    </div>
  );
};

export default CreateAccount;
