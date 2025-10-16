import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import { AppContextProvider } from './context/AppContext'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BookAppointment from './pages/BookAppointment'
import DoctorLogin from './pages/DoctorLogin'
import DoctorDashboard from './pages/DoctorDashboard'
import DoctorProfile from './pages/DoctorProfile'
import DoctorAppointments from './pages/DoctorAppointment'
import ContactUs from './pages/ContactUs'
import DoctorResetPassword from './pages/DoctorResetPassword'


const App = () => {
  return (
    <AppContextProvider>
      <div>
        <ToastContainer/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/reset-password' element={<ResetPassword/>}/>
          <Route path='/book-appointment' element={<BookAppointment/>}></Route>
          <Route path='/login-as-doctor' element={<DoctorLogin/>}></Route>
          <Route path ='/doctor-dashboard' element ={<DoctorDashboard/>}></Route>
           <Route path='/doctor-profile' element={<DoctorProfile/>}/>
           <Route path ='/doctor-appointments' element={<DoctorAppointments/>}></Route>
           <Route path='/contact-us' element={<ContactUs/>}></Route>
           <Route path='/doctor-reset-password' element={<DoctorResetPassword/>}></Route>
         

        </Routes>
      </div>
    </AppContextProvider>
  )
}

export default App
