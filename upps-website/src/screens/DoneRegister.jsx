import React from 'react'
import Header from '../components/Header1.jsx'
import Button from '../components/Button.jsx'
import { useNavigate } from 'react-router-dom';

const DoneRegister = () => {
  const navigate = useNavigate();
  return (
    <div>
        <Header onClick={()=>navigate("/")}/>
        <div className='text-center flex flex-col items-center '>
            <h1 className='text-5xl text-darkblue mt-16 mb-12'>Thank <span className='text-yellow'>you!</span></h1>
            <p className='mb-14'>You have successfully created your account. <br></br>Your registration must be reviewed first by the chairman.<br></br>We will send you an email if you get approved or not by the chairman.</p>
            <Button type={"button"} style={"text-white bg-uppsdarkblue hover:bg-uppsyellow rounded-full py-4 px-28 mb-10"} title={"Back to login"} onClick={()=>navigate("/")}/>
        </div>
    </div>
  )
}

export default DoneRegister