import React, { useState, useContext } from 'react'
import { AppContent } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const DoctorLogin = () => {
    const { backendUrl, setDToken, setIsDoctorLoggedIn, setDoctorData } = useContext(AppContent)
    const navigate = useNavigate()
    const [state, setState] = useState('Login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        
        try {
            if (state === 'Sign Up') {
        
                const { data } = await axios.post(`${backendUrl}/api/auth/doctor-register`, {
                    name, email, password
                }, { withCredentials: true })
                
                if (data.success) {
                    toast.success('Registration successful! Please login.')
                    setState('Login')
                    setName('')
                    setEmail('')
                    setPassword('')
                } else {
                    toast.error(data.message)
                }
            } else {
                
                const { data } = await axios.post(`${backendUrl}/api/auth/doctor-login`, {
                    email, password
                }, { withCredentials: true })
                
                if (data.success) {
                    localStorage.setItem('dToken', data.token)
                    setDToken(data.token)
                    setIsDoctorLoggedIn(true)
                    
                    if (data.doctorData) {
                        setDoctorData(data.doctorData)
                    }
                    
                    toast.success('Login successful!')
                    navigate('/doctor-dashboard')
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            console.error('Doctor auth error:', error)
            toast.error(error.response?.data?.message || 'Authentication failed')
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-sky-100 to-blue-400'>
            
        
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
                <h2 className='text-3xl font-semibold text-blue-600 text-center mb-3'>
                    Doctor {state === 'Sign Up' ? 'Registration' : 'Login'}
                </h2>

                <p className='text-center mb-6 text-sm'>
                    {state === 'Sign Up' ? 'Create your doctor account' : 'Login to your doctor account'}
                </p>
                
                <form onSubmit={onSubmitHandler}>
                    {state === 'Sign Up' && (
                        <div className='mb-4 flex gap-3 items-center w-full px-5 py-2.5 rounded-full bg-[#636b8e]'>
                            {assets.person_icon && <img src={assets.person_icon} alt=""/>}
                            <input 
                                onChange={e => setName(e.target.value)} 
                                value={name}
                                className='bg-transparent outline-none text-white placeholder-gray-300 w-full' 
                                type="text" 
                                placeholder="Full Name" 
                                required
                            />
                        </div>
                    )}

                    <div className='mb-4 flex gap-3 items-center w-full px-5 py-2.5 rounded-full bg-[#636b8e]'>
                        {assets.mail_icon && <img src={assets.mail_icon} alt=""/>}
                        <input 
                            onChange={e => setEmail(e.target.value)} 
                            value={email} 
                            className='bg-transparent outline-none text-white placeholder-gray-300 w-full' 
                            type="email" 
                            placeholder="Doctor Email ID" 
                            required
                        />
                    </div>

                    <div className='mb-4 flex gap-3 items-center w-full px-5 py-2.5 rounded-full bg-[#636b8e]'>
                        {assets.lock_icon && <img src={assets.lock_icon} alt=""/>}
                        <input 
                            onChange={e => setPassword(e.target.value)} 
                            value={password} 
                            className='bg-transparent outline-none text-white placeholder-gray-300 w-full' 
                            type="password" 
                            placeholder="Password" 
                            required
                        />
                    </div>

                    {state === 'Login' && (
                        <p 
                            onClick={() => navigate('/doctor-reset-password')}
                            className='mb-4 text-blue-500 cursor-pointer hover:text-blue-700 transition-colors'
                        >
                            Forgot Password?
                        </p>
                    )}

                    <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-800 text-white font-medium hover:from-sky-600 hover:to-blue-600 transition-all hover:shadow-lg'>
                        {state === 'Sign Up' ? 'Create Account' : 'Login'}
                    </button>
                </form>

                {state === 'Sign Up' ? (
                    <p className='text-gray-400 text-center text-xs mt-4'>
                        Already have an account?{' '}
                        <span 
                            onClick={() => setState('Login')}
                            className='text-blue-500 cursor-pointer underline hover:text-blue-700 transition-colors'
                        > 
                            Login here
                        </span>
                    </p>
                ) : (
                    <p className='text-gray-400 text-center text-xs mt-4'>
                        Don't have an account?{' '}
                        <span  
                            onClick={() => setState('Sign Up')} 
                            className='text-blue-500 cursor-pointer underline hover:text-blue-700 transition-colors'
                        >
                            Register here
                        </span>
                    </p>
                )}

              
            </div>
        </div>
    )
}

export default DoctorLogin
