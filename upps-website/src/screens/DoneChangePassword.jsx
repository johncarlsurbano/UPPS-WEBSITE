import React from 'react'
import Header from '../components/Header1.jsx'
import Button from '../components/Button.jsx'
import { useNavigate } from 'react-router-dom';

const DoneChangePassword = () => {
  const navigate = useNavigate();
  
  return (
    <div>
        <Header onClick={()=>navigate("/")}/>
        <div className='text-center flex flex-col items-center '>
            <h1 className='text-5xl text-darkblue mt-16 mb-12'>Password <span className='text-yellow'>Set</span></h1>
            <p className='mb-14'>You have successfully change your password! <br></br>You can now login.</p>
            <Button type={"button"} style={"text-white bg-uppsdarkblue hover:bg-uppsyellow rounded-full py-4 px-28 mb-10"} title={"Back to Home"} onClick={()=>navigate("/")}/>
        </div>

    </div>
  )
}

export default DoneChangePassword