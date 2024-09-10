import React from 'react'
import Header1 from '../components/Header1.jsx'
import Button from '../components/Button.jsx'
import InputFields from '../components/InputFields.jsx'
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();

  return (
    <div>
        <Header1 onClick={()=>navigate("/")}/>
        <div className='text-center flex flex-col items-center '>
            <p className='mt-20 mb-11 text-xl'>To reset your password, enter your username or email address <br></br>below. If found in our database, you'll receive an email with<br></br> instructions to regain access.</p>
            <form action="" className='flex flex-col'>
                <p className='text-start mb-2 text-[1.1rem]'>Email</p>
                <InputFields placeholder={"Please enter your email"} type={"email"} name={"email"} style={"w-[400px] h-[50px]"} />
                <Button type="button" style="text-white bg-uppsdarkblue hover:bg-uppsyellow rounded-full py-3.5 w-[400px] mt-[23px] " title={"Send"} onClick={()=>navigate("/changepasswordcode")}/>
            </form>
        </div>
    </div>
  )
}

export default ForgotPassword