import React, { useState } from "react";
import Header from "../components/Header1.jsx";
import InputFields from "../components/InputFields.jsx";
import Button from "../components/Button.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from 'axios'
import Swal from "sweetalert2"

const RegistrationCode = () => {
  const navigate = useNavigate();
  const [enteredCode, setEnteredCode] = useState("");

  const user = useSelector((state) => state.user.value);
  const formData = user.user
  const registrationCode = formData.code
  
  console.log(formData.code)


  const handleChange = (e) => {
    setEnteredCode(e.target.value);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (enteredCode === registrationCode.toString()) {
       try{
          const response = await axios.post("http://127.0.0.1:8000/api/createuser/", formData)
          Swal.fire({
            title: "Sucess!",
            text: "Registration Complete",
            icon: "info"
          });
          navigate("/doneregister");
          console.log(response.data)
        }catch(e){
          console.error("Failed to register user:", e);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to register user. Please try again.",
          });
        }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Incorrect Code, Please Try Again!",
      });
   
    }
  };
  console.log(typeof enteredCode, typeof registrationCode)
  return (
    <div>
      <Header onClick={() => navigate("/")} />
      <div className="text-center flex flex-col items-center ">
        <h1 className="text-5xl text-darkblue mt-16 mb-10">
          Finish <span className="text-yellow">Registration</span>
        </h1>
        <h2 className="text-3xl text-darkblue mb-10">you're almost done!</h2>
        <p className="text-[1.1rem]">
          Please enter the verification code sent to your email to complete{" "}
          <br />
          your registration.
        </p>
        <InputFields
          style={"w-[20%] mt-[40px] mb-[60px]"}
          type={"number"}
          name={"code"}
          placeholder={"Enter Code"}
          onChange={handleChange}
        />
        <Button
          type="button"
          style="text-white bg-uppsdarkblue hover:bg-uppsyellow rounded-full py-3.5 w-[300px] "
          title={"Send"}
          onClick={handleSubmit}
        />
        <h1>{user.registrationCode}</h1>
      </div>
    </div>
  );
};

export default RegistrationCode;
