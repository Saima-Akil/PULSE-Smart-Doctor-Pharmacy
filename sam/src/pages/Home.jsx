import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import DoctorSpecialities from '../components/DoctorSpecialities'
import WhyChooseUs from '../components/WhyChooseUs'
import Footer from '../components/Footer'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const Home = () => {
  const location=useLocation();
  useEffect(()=>{
    if(location.hash){
      const element=document.querySelector(location.hash)
      if(element){
        element.scrollIntoView({behavior:"smooth"})
      }
    }
  },[location])
  return (
    <div className='min-h-screen'>
  
      <div className='min-h-screen bg-[url("/bgImg.jpg")] bg-cover bg-center bg-no-repeat relative'>

        <div className="absolute inset-0 "></div>
        
      
        <div className="relative z-10">
          <Navbar />
          <Header />
        </div>
      </div>


      <div className="bg-gray-50">
        <DoctorSpecialities />
      </div>

      <div className="bg-white">
        <WhyChooseUs />
      </div>

      <Footer />
    </div>
  )
}

export default Home
