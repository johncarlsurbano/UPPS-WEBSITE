import React from 'react'
import Header1 from '../components/Header1.jsx'
import Button from '../components/Button.jsx'
import InputFields from '../components/InputFields.jsx'
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { generateRegistrationCode, setEmail } from '../features/user.jsx';
import Swal from 'sweetalert2'



const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setIsEmail ] = useState()

  const handleSubmit = async () => {
    try {
      const emailCheckResponse = await axios.post('http://127.0.0.1:8000/api/validateemail/', { email: email });

      if (emailCheckResponse.data.exists) {
        
        dispatch(setEmail(email))
        const generatecode = await axios.post('http://127.0.0.1:8000/api/generatecode/', {
          email: email,
        })

        if (generatecode.status === 200) {

          Swal.fire({
            title: "Code Sent",
            text: "Code has sent to your email!",
            icon: "info"
          });
          dispatch(generateRegistrationCode(generatecode.data.code)); // Save the code in Redux
          navigate("/changepasswordcode");
        }

      }
      else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Email does not exist!",
        });
        return;
      }

    } catch (err) {
      console.error(err)
    }
  }
  
  return (
    <div>
        <Header1 onClick={()=>navigate("/")}/>
        <div className='text-center flex flex-col items-center '>
            <p className='mt-20 mb-11 text-xl'>To reset your password, enter your username or email address <br></br>below. If found in our database, you'll receive an email with<br></br> instructions to regain access.</p>
            <form action="" className='flex flex-col' >
                <p className='text-start mb-2 text-[1.1rem]'>Email</p>
                <InputFields placeholder={"Please enter your email"} type={"email"} name={"email"} style={"w-[400px] h-[50px]"} value={email} onChange={(e) => setIsEmail(e.target.value)} />
                <Button type="button" style="text-white bg-uppsdarkblue hover:bg-uppsyellow rounded-full py-3.5 w-[400px] mt-[23px] " title={"Send"} onClick={()=> handleSubmit()}/>
            </form>
        </div>
    </div>
  )
}

export default ForgotPassword