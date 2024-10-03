import React, { useState } from "react";
import InputFields from "../components/InputFields";
import logo from "../assets/upps-website-logo.png";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const user = useSelector((state) => state.user.value);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (email !== user.email) {
      alert("Incorrect email. Please check your email address and try again.");
      return;
    }

    if (password !== user.password) {
      alert("Incorrect password. Please check your password and try again.");
      return;
    }

    alert("Login successful!");
    navigate("/homepage");
  };

  return (
    <div className="text-center items-center flex-1 h-screen flex-col flex">
      <div className="h-[7rem] mx-auto mt-20 mb-12 md:h-[8rem]">
        <img src={logo} alt="logo" />
      </div>
      <h1 className="text-darkblue text-5xl mb-8">
        Welcome <span className="text-yellow">to UPPS!</span>
      </h1>
      <p className="text-[1.1rem] mb-5">
        Welcome! Please enter your credentials to log in.
      </p>

      <form onSubmit={handleLogin} className="flex flex-col ">
        <p className="text-start my-2 text-[20px]">Email</p>
        <InputFields
          name={"email"}
          type={"email"}
          placeholder={"Email"}
          style={"w-[420px]"}
          value={email}
          onChange={handleEmailChange}
        />

        <p className="text-start my-2 text-[20px]">Password</p>
        <InputFields
          name={"password"}
          type={"password"}
          placeholder={"Password"}
          value={password}
          onChange={handlePasswordChange}
        />

        <a
          href="#"
          className="text-uppslink text-end text-[1.1rem] mb-5"
          onClick={() => navigate("/forgotpassword")}
        >
          Forgot Password?
        </a>

        <Button
          style="text-white bg-uppsdarkblue hover:bg-uppsyellow rounded-full py-4 px-28 mb-7"
          title={"Login"}
          type="submit"
        />

        <a
          href="#"
          className="text-uppslink text-[1.1rem] mb-5"
          onClick={() => navigate("/create-account")}
        >
          Don't have an account yet?
        </a>
      </form>
    </div>
  );
};

export default Login;
