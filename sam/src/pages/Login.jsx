import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

    const navigate=useNavigate()

    const {backendUrl,setIsLoggedin,getUserData}=useContext(AppContent)

  const [state,setState]=useState('Sign Up')
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]= useState('')
  const onSubmitHandler=async (e)=>{
   try{
    e.preventDefault()
    axios.defaults.withCredentials=true

    if(state ==='Sign Up'){
         
      const {data} = await axios.post(backendUrl+ '/api/auth/register',{name,email,password})
         
       if(data.success){
        setIsLoggedin(true)

      await getUserData()
        navigate('/')
       }
       else{
       toast.error(data.message)
       }
    }else{
 const {data} = await axios.post(backendUrl+ '/api/auth/login',{email,password})
         
       if(data.success){
        setIsLoggedin(true)
       await getUserData()
        navigate('/')
       }
       else{
       toast.error(data.message)
       }
        
    }

   } catch(error) {
      toast.error(error.response?.data?.message || error.message || "Login failed")
}
}
 
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-sky-100 to-blue-400 '>

  <div className='absolute left-5 sm:left-20 top-5 flex items-center gap-3 cursor-pointer group'
         onClick={() => navigate('/')}>
        <img 
            src={assets.logo} 
            alt="" 
            className='w-32 sm:w-38 group-hover:scale-105 transition-transform' 
        />
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-blue-600 group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500'>
            PULSE
        </h1>
        </div>
    </div>
    <div className='bg-white p-10 rounded-lg shadow-lg w-full sm:w-96 text-sm'> 

        <h2 className='text-3xl font-semibold text-blue-600 text-center mb-3'>{state==='Sign Up'?'Create Account':'Login'}</h2>

        <p className='text-center mb-6 text-sm'>{state==='Sign Up'?'Create Your account':'Login to your account!'}</p>
        
        <form onSubmit={onSubmitHandler}>
            {state ==='Sign Up' && ( <div className='mb-4 flex gap-3 items-center w-full px-5 py-2.5 rounded-full bg-[#636b8e]'>
        <img src={assets.person_icon} alt=""/>
        <input onChange={e=>setName(e.target.value)} value={name}className='bg-transparent outline-none' type="text" placeholder="Full Name" required/>
            </div>)}
       

        <div className='mb-4 flex gap-3 items-center w-full px-5 py-2.5 rounded-full bg-[#636b8e]'>
        <img src={assets.mail_icon} alt=""/>
        <input onChange={e=>setEmail(e.target.value)} value={email} className='bg-transparent outline-none ' type="email" placeholder="Email id" required/>
        </div>


        <div className='mb-4 flex gap-3 items-center w-full px-5 py-2.5 rounded-full bg-[#636b8e] '>
          <img src={assets.lock_icon} alt=""/>
          <input onChange={e=>setPassword(e.target.value)} value={password} className='bg-transparent outline-none ' type="password" placeholder="Password" required/>
              </div>
              <p onClick={()=>navigate('/reset-password')}className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password?</p>

              <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-800 text-white font-medium hover:from-sky-600 hover:to-blue-600 transition-all hover:shadow-lg'>{state}</button>

        </form>
        {state ==='Sign Up'?( <p className='text-gray-400 text-center textxs mt-4'>Already have an account?{' '}
            <span onClick={()=>setState('Login')}className='text-blue-400 cursor-pointer underline'> Login here</span>
        </p>):( <p className='text-gray-400 text-center textxs mt-4'>Don't have an account?{' '}
            <span  onClick={()=>setState('Sign Up')} className='text-blue-400 cursor-pointer underline'>Sign Up</span>
        </p>)}
       
       
        

    </div>
    </div>
  )
}

export default Login


