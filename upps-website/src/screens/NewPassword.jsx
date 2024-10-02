import React from 'react'
import Header from '../components/Header1.jsx'
import InputFields from '../components/InputFields.jsx'
import Button from '../components/Button.jsx'
import { useNavigate } from 'react-router-dom';

const NewPassword = () => {
  const navigate = useNavigate();
  return (
    <div>
        <Header onClick={()=>navigate("/")}/>
        <div className='text-center flex flex-col items-center '>
            <h1 className='text-5xl text-darkblue mt-16 mb-12'>Reset <span className='text-yellow'>Password</span></h1>
            <p className='mb-20'>You can now change your password. Please enter your new <br></br> password below to complete the process</p>
            <form action="" className='flex flex-col'>
                <p className='text-start mb-2'>New password</p>
                 <InputFields type={"password"} name={"password"} placeholder={"Please enter your new password"} />
                 <p className='text-start mb-2'>Confirm password</p>
                 <InputFields  type={"password"} name={"password"} placeholder={"Confirm password"}/>
                 <Button type="button" style="text-white bg-uppsyellow hover:bg-uppsdarkblue rounded-full py-3.5 w-[400px] " title={"Reset Password"} onClick={()=>navigate("/donechangepassword")}/>

            </form>
        </div>

    </div>
  )
}

export default NewPassword