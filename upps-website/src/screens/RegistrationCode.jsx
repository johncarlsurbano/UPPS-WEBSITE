import React, { useState } from "react";
import Header from "../components/Header1.jsx";
import InputFields from "../components/InputFields.jsx";
import Button from "../components/Button.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RegistrationCode = () => {
  const navigate = useNavigate();
  const [enteredCode, setEnteredCode] = useState("");
  const user = useSelector((state) => state.user.value);

  const registrationCode = useSelector(
    (state) => state.user.value.registrationCode
  );

  const handleChange = (e) => {
    setEnteredCode(e.target.value);
  };

  const handleSubmit = (e) => {
    if (enteredCode === registrationCode) {
      alert("Code is Correct, Registration Complete");
      navigate("/doneregister");
    } else {
      alert("Incorrect Code, Please Try Again!");
    }
  };

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
          type={"text"}
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
