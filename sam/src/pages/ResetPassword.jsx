import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContent)
  const navigate = useNavigate()

  
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

  
  const inputRefs = React.useRef([])


  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('')
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })
  }


  const onSubmitEmail = async (e) => {
    e.preventDefault()
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email })

      if (data.success) {
        toast.success(data.message)
        setIsEmailSent(true)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const onSubmitOtp = async (e) => {
    e.preventDefault()
    try {
      const otpValue = inputRefs.current.map(input => input.value).join('')
      
      if (otpValue.length !== 6) {
        toast.error('Please enter complete 6-digit OTP')
        return
      }

      const { data } = await axios.post(backendUrl + '/api/auth/verify-reset-otp', { 
        email, 
        otp: otpValue 
      })
      
      if (data.success) {
        toast.success(data.message)
        setIsOtpSubmitted(true)
        setOtp(otpValue)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  
  const onSubmitPassword = async (e) => {
    e.preventDefault()
    try {
      if (newPassword.length < 6) {
        toast.error('Password must be at least 6 characters')
        return
      }

      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { 
        email, 
        otp, 
        newPassword 
      })
      
      if (data.success) {
        toast.success(data.message)
        navigate('/login')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }
 
  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 to-blue-400'>
      
    
      <div className='absolute left-5 sm:left-20 top-5 flex items-center gap-3 cursor-pointer group'
           onClick={() => navigate('/')}>
        <img 
          src={assets.logo} 
          alt="" 
          className='w-28 sm:w-38 group-hover:scale-105 transition-transform' 
        />
        <div>
          <h1 className='text-xl sm:text-2xl font-bold text-blue-600 group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500'>
            PULSE
          </h1>
        </div>
      </div>

    
      {!isEmailSent && (
        <form onSubmit={onSubmitEmail} className='bg-white p-8 rounded-lg shadow-lg w-full sm:w-96 text-sm'>
          <h1 className='text-indigo-900 text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-center mb-6 text-indigo-400'>Enter your registered email address</p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#686b8e]'>
            <img src={assets.mail_icon} alt="" className='w-4 h-4'/>
            <input 
              type="email" 
              placeholder="Email Address" 
              className='bg-transparent outline-none text-white flex-1' 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
            />
          </div>
          
          <button type="submit" className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 hover:opacity-90 transition-opacity'>
            Send OTP
          </button>

          <p className='text-gray-400 text-center text-xs mt-4'>
            Remember your password?{' '}
            <span onClick={() => navigate('/login')} className='text-blue-500 cursor-pointer underline hover:text-blue-900'>
              Back to Login
            </span>
          </p>
        </form>
      )}

      {!isOtpSubmitted && isEmailSent && (
        <form onSubmit={onSubmitOtp} className='bg-white p-8 rounded-lg shadow-lg w-full sm:w-96 text-sm'>
          <h1 className='text-indigo-900 text-2xl font-semibold text-center mb-4'>Verify OTP</h1>
          <p className='text-center mb-6 text-indigo-500'>Enter the 6-digit code sent to your email</p>
          
          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input 
                type="text" 
                maxLength="1" 
                key={index} 
                required 
                className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md border-2 border-transparent focus:border-indigo-500 focus:outline-none transition-colors' 
                ref={e => inputRefs.current[index] = e}
                onInput={(e) => handleInput(e, index)} 
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          
          <button type="submit" className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 hover:opacity-90 transition-opacity'>
            Verify OTP
          </button>
        </form>
      )}

     
      {isOtpSubmitted && isEmailSent && (
        <form onSubmit={onSubmitPassword} className='bg-white p-8 rounded-lg shadow-lg w-full sm:w-96 text-sm'>
          <h1 className='text-indigo-900 text-2xl font-semibold text-center mb-4'>Create New Password</h1>
          <p className='text-center mb-6 text-indigo-400'>Enter your new secure password</p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" className='w-4 h-4'/>
            <input 
              type="password" 
              placeholder="New Password (min 6 characters)" 
              className='bg-transparent outline-none text-white flex-1' 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              required
            />
          </div>
          <button 
            type="submit" 
            className='w-full py-2.5 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-full mt-3 hover:opacity-90 transition-opacity'
          >
            Reset Password
          </button>

  
        </form>
      )}

    </div>
  )
}

export default ResetPassword

