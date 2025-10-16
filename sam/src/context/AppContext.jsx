import { createContext, useState, useEffect } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContent = createContext()

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
    const [isLoggedin, setIsLoggedin] = useState(false)
    const [userData, setUserData] = useState(null) 
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthChecked, setIsAuthChecked] = useState(false)
    

    const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(false)
    const [doctorData, setDoctorData] = useState(null)
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '')
    
    const getAuthState = async () => {
        try {
            setIsLoading(true)
            axios.defaults.withCredentials = true
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth')
            
            if (data.success) {
                setIsLoggedin(true)
                await getUserData()
            } else {
                setIsLoggedin(false)
                setUserData(null)
            }
        } catch (error) {
            console.error('Auth check failed:', error)
            setIsLoggedin(false)
            setUserData(null)
            
            if (error.response && error.response.status !== 401 && error.response.status!==403) {
                toast.error('Authentication check failed')
            }
        } finally {
            setIsLoading(false)
            setIsAuthChecked(true)
        }
    }

    const getUserData = async () => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.get(backendUrl + '/api/user/data')

            if (data.success && data.userData) {
                const cleanUserData = {
                    name: data.userData.name || 'User',
                    email: data.userData.email || '',
                    id: data.userData.id || data.userData._id || null,
                    ...data.userData
                }
                
                setUserData(cleanUserData)
                console.log('User data loaded:', cleanUserData)
                return cleanUserData
            } else {
                setUserData(null)
                setIsLoggedin(false)
                return null
            }
        } catch (error) {
            console.error('getUserData error:', error)
            toast.error(error.response?.data?.message || 'Failed to fetch user data')
            setUserData(null)
            setIsLoggedin(false)
            return null
        }
    }

    const getDoctorData = async () => {
        try {
            if (dToken) {
                axios.defaults.withCredentials = true
                const { data } = await axios.get(backendUrl + '/api/doctor/doctordata')
                
                if (data.success) {
                    setDoctorData(data.doctorData)
                    setIsDoctorLoggedIn(true)
                    return data.doctorData
                } else {
                    setIsDoctorLoggedIn(false)
                    setDoctorData(null)
                }
            }
        } catch (error) {
            console.error('Get doctor data error:', error)
            setIsDoctorLoggedIn(false)
            setDoctorData(null)
        }
    }
    const performLogin = async (credentials) => {
        try {
            setIsLoading(true)
            axios.defaults.withCredentials = true
            
            const endpoint = credentials.name ? '/api/auth/register' : '/api/auth/login'
            const { data } = await axios.post(backendUrl + endpoint, credentials)
            
            if (data.success) {
                setIsLoggedin(true)
                const userData = await getUserData()
                
                if (userData) {
                    toast.success(credentials.name ? 'Account created successfully!' : 'Welcome back!')
                    return { success: true, userData }
                } else {
                    throw new Error('Failed to load user data after login')
                }
            } else {
                toast.error(data.message || 'Authentication failed')
                return { success: false, message: data.message }
            }
        } catch (error) {
            console.error('Login error:', error)
            const errorMessage = error.response?.data?.message || error.message || 'Authentication failed'
            toast.error(errorMessage)
            setIsLoggedin(false)
            setUserData(null)
            return { success: false, message: errorMessage }
        } finally {
            setIsLoading(false)
        }
    }

    const performLogout = async () => {
        try {
            await axios.post(backendUrl + '/api/auth/logout')
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            setIsLoggedin(false)
            setUserData(null)
            setIsAuthChecked(true)
            toast.success('Logged out successfully')
        }
    }

    const performDoctorLogout = () => {
        setDToken('')
        setIsDoctorLoggedIn(false)
        setDoctorData(null)
        localStorage.removeItem('dToken')
        toast.success('Doctor logged out successfully')
    }
  
    useEffect(() => {
        let isMounted = true
        
        const checkAuth = async () => {
            if (isMounted) {
                await getAuthState()
            
                if (dToken) {
                    await getDoctorData()
                }
            }
        }
        
        checkAuth()
        
        return () => {
            isMounted = false
        }
    }, [dToken])

    const value = {
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData,
        performLogin,
        performLogout,
        isLoading,
        isAuthChecked,
        isDoctorLoggedIn,
        setIsDoctorLoggedIn,
        doctorData,
        setDoctorData,
        getDoctorData,
        dToken,
        setDToken,
        performDoctorLogout
    }

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}
