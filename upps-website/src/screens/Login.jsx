import React, { useState, useEffect } from "react";
import InputFields from "../components/InputFields";
import logo from "../assets/upps-website-logo.png";
import Button from "../components/Button";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux";
import { login,post } from "../features/user"

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState([])

  const fetchUser = async () => {
    try{
      const response = await axios.get('http://127.0.0.1:8000/api/getuser/')
      setUser(response.data)

    } catch(e) {
      console.error(`Failed to fetch user`, e);
      alert("Failed to fetch user. Please try again later.");
    }
  }

  const handleEmailChange = (e) => { 
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        'email': email,
        'password': password
      })
      

      console.log('Full API response:', response.data); // Log entire response
      console.log('Dispatched user:', response.data.data); // Check for 'user' in the response

      if (response.data.data) {
        const userData = response.data.data;
        dispatch(login(userData));
        alert("Login successful!");

        const redirectTo = location.state?.from || "/";

        // Redirect to the target URL or the dashboard based on role
        if (redirectTo !== "/") {
          navigate(redirectTo);
        } else {
          switch (userData.role) {
            case "Personnel":
              navigate("/personnel/dashboard");
              break;
            case "Chairman":
              navigate("/chairman/dashboard");
              break;
            case "Office Head":
              navigate("/officehead/dashboard");
              break;
            default:
              alert("Unknown role. Please contact support.");
              break;
          }
        }

      } else {
        console.log('User data not found in response');
      }
  
    } catch (e){
      alert(e.response?.data?.message[0] || "Login failed.");
    }
   

    // const foundUser = user.find((e) => e.email === email);

    // if (!foundUser) {
    //   alert("Incorrect email. Please check your email address and try again.");
    //   return;
    // }

    // if (foundUser.password !== password) {
    //   alert("Incorrect password. Please check your password and try again.");
    //   return;
    // }

    
  };

  // useEffect(() => {
  //   fetchUser()
  // }, [])

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
