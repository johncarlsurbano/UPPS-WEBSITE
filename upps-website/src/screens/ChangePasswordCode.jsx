import React from 'react'
import Header from '../components/Header1.jsx'
import InputFields from '../components/InputFields.jsx'
import Button from '../components/Button.jsx'
import { useNavigate } from 'react-router-dom';

const ChangePasswordCode = () => {
  const navigate = useNavigate();
  return (
    <div>
        <Header onClick={()=>navigate("/")}/>
        <div className='text-center flex flex-col items-center '>
            <h1 className='text-5xl text-darkblue mt-16 mb-10'>Reset <span className='text-yellow'>Password</span></h1>
            <h2 className='text-3xl text-darkblue mb-10'>you're almost done!</h2>
            <p className='text-[1.1rem]'>Please enter the verification code sent to your email to complete your <br />changing your password.</p>
            <InputFields style={"w-[20%] mt-[40px] mb-[60px]"} type={"text"} name={"code"} placeholder={"Enter Code"}/>
            <Button type="button" style="text-white bg-uppsdarkblue hover:bg-uppsyellow rounded-full py-3.5 w-[300px] " title={"Send"} onClick={()=>navigate("/donechangepassword")}/>
            

            </div>
        
    </div>
  )
}

export default ChangePasswordCode