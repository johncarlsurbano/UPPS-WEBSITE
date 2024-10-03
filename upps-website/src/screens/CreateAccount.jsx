import React, { useState } from "react";
import Header1 from "../components/Header1.jsx";
import Dropdown from "../components/Dropdown.jsx";
import InputFields from "../components/InputFields.jsx";
import Button from "../components/Button.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { post, generateRegistrationCode, login } from "../features/user.jsx";

export const CreateAccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value);

  const passregex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
  );
  const emailregex = new RegExp("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    day: "1",
    month: "January",
    year: "2000",
    department: "CITC",
    position: "",
    streetAddress: "Bontong",
    barangay: "Camaman-an",
    city: "Cagayan de Oro City",
    zipCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation for password match and regex checks
    if (formData.password !== formData.confirmPassword) {
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

    dispatch(login(formData));
    dispatch(generateRegistrationCode());

    console.log(formData);

    navigate("/registrationcode");
  };

  return (
    <div>
      <Header1 onClick={() => navigate("/")} />
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
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <p className="text-start my-2 text-[1rem]">Last Name</p>
                <InputFields
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
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
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={"w-full"}
              />
            </div>
          </div>

          <div>
            <div>
              <p className="text-start my-2 text-[1rem]">Date of Birth</p>
              <div className="flex flex-1 gap-2">
                <Dropdown
                  name="day"
                  items={[1, 2, 3, 4, 5]}
                  value={formData.day}
                  handleChange={handleChange}
                />
                <Dropdown
                  name="month"
                  items={["January", "February", "March", "April", "May"]}
                  value={formData.month}
                  handleChange={handleChange}
                />
                <Dropdown
                  name="year"
                  items={[2000, 2001, 2002, 2003, 2004]}
                  value={formData.year}
                  handleChange={handleChange}
                />
              </div>

              <div className="flex flex-1 gap-2">
                <div className="w-full">
                  <p className="text-start my-2 text-[1rem]">Department</p>
                  <Dropdown
                    name="department"
                    items={["CITC", "CEA", "COT", "CSM"]}
                    value={formData.department}
                    handleChange={handleChange}
                  />
                </div>
                <div className="w-full">
                  <p className="text-start my-2 text-[1rem]">Position</p>
                  <InputFields
                    name="position"
                    type="text"
                    placeholder="Position"
                    value={formData.position}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex flex-1 gap-2">
                <div className="w-full">
                  <p className="text-start my-2 text-[1rem]">Street Address</p>
                  <Dropdown
                    name="streetAddress"
                    items={["Bontong", "Bolonsori", "Emerald", "Gatter"]}
                    value={formData.streetAddress}
                    handleChange={handleChange}
                  />
                </div>
                <div className="w-full">
                  <p className="text-start my-2 text-[1rem]">Barangay</p>
                  <Dropdown
                    name="barangay"
                    items={["Camaman-an", "Iponan", "Gusa", "Lapasan"]}
                    value={formData.barangay}
                    handleChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex flex-1 gap-2">
                <div className="w-full">
                  <p className="text-start my-2 text-[1rem]">City</p>
                  <Dropdown
                    name="city"
                    items={["Cagayan de Oro City"]}
                    value={formData.city}
                    handleChange={handleChange}
                  />
                </div>
                <div className="w-full">
                  <p className="text-start my-2 text-[1rem]">Zip Code</p>
                  <InputFields
                    name="zipCode"
                    type="text"
                    placeholder="Zip Code"
                    value={formData.zipCode}
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
