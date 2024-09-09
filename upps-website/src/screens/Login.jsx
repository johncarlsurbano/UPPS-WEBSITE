import React from 'react'
import InputFields from '../components/InputFields'
import logo from '../assets/upps-website-logo.png'
import Button from '../components/Button'

const Login = () => {
  return (
    <div className='text-center items-center flex-1 h-screen flex-col flex'>
        <div className='h-[7rem] mx-auto mt-20 mb-12 md:h-[8rem]'>
          <img src={logo} alt="logo"/>
        </div>
        <h1 className='text-darkblue text-5xl mb-8'>Welcome <span className='text-yellow'>to UPPS!</span></h1>
        <p className=' text-[1.1rem] mb-5'>Welcome! Please enter your credentials to log in.</p>
        <form action="" className='flex flex-col '>
            <p className='text-start my-2 text-[20px]'>Email</p>
            <InputFields name={"email"} type={"email"} placeholder={"Email"}/>
            <p className='text-start my-2 text-[20px]'>Password</p>
            <InputFields name={"password"} type={"password"} placeholder={"Password"} style="w-2"/>
            <a href="#" className='text-uppslink text-end text-[1.1rem] mb-5 '>Forgot Password?</a>
            <Button style="text-white bg-uppsdarkblue hover:bg-uppsyellow rounded-full py-4 px-28 mb-7" title={"Login"}/>
            <Button style="text-white bg-uppsyellow hover:bg-uppsdarkblue rounded-full py-4 px-28 mb-7" title={"Create Account"} />
            <a href="#" className='text-uppslink  text-[1.1rem] mb-5'>Don't have account yet?</a>
        </form>
    </div>
    
  )
}

export default Login;
