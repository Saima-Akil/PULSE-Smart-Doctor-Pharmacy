import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";

const DoctorNavbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { doctorData, performDoctorLogout, isDoctorLoggedIn } = useContext(AppContent);

  const handleLogout = async () => {
    await performDoctorLogout();
    setIsDropdownOpen(false);
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "D";
    return (
      name
        .trim()
        .split(" ")
        .map((word) => word[0] || "")
        .join("")
        .toUpperCase()
        .slice(0, 2) || "D"
    );
  };

  const handleMobileNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="w-full flex justify-between items-center px-4 py-3 sm:px-6 sm:py-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 fixed top-0 bg-green-100/90 backdrop-blur-md z-50 shadow-sm">
        
    
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
          onClick={() => navigate("/doctor-dashboard")}
        >
          <img
            src={assets.logo}
            alt="Logo"
            className="w-24 h-auto sm:w-28 md:w-32 lg:w-36 group-hover:scale-105 transition-transform duration-300"
          />
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-green-600 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-green-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
              PULSE
            </h1>
          
          </div>
        </div>

    
        <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 2xl:space-x-8">
          <button 
            onClick={() => navigate("/doctor-dashboard")}
            className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 text-sm xl:text-base"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/doctor-appointments")}
            className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 text-sm xl:text-base"
          >
            Appointments
          </button>
          <button
            onClick={() => navigate("/doctor-patients")}
            className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 text-sm xl:text-base"
          >
            My Patients
          </button>
          <button
            onClick={() => navigate("/doctor-profile")}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 xl:px-4 xl:py-2 rounded-full font-medium transition-all duration-200 text-sm xl:text-base"
          >
            Profile
          </button>
         
          
          
        
          <button
            onClick={() => navigate("/")}
            className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 text-sm xl:text-base"
          >
            Patient Portal
          </button>
        </nav>

    
        <div className="flex items-center gap-2 sm:gap-3">
          
    
          <button 
            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 cursor-pointer group"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            aria-label="Toggle mobile menu"
          >
            <span 
              className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
              }`}
            />
            <span 
              className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 mt-1 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span 
              className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 mt-1 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`}
            />
          </button>

        
          {isDoctorLoggedIn && doctorData ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white text-sm sm:text-base md:text-lg font-bold hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white bg-green-600 border-2 border-green-700"
                title={`Logged in as Dr. ${doctorData.name || "Doctor"}`}
              >
                {getInitials(doctorData.name)}
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg py-2 z-20 border">
                    <div className="px-4 py-3 border-b">
                      <div className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        Dr. {doctorData.name || "Doctor"}
                      </div>
                      {doctorData.email && (
                        <div className="text-xs sm:text-sm text-gray-500 truncate">
                          {doctorData.email}
                        </div>
                      )}
                      <div className="text-xs text-green-600 font-medium">
                        {doctorData.specialization && doctorData.specialization.charAt(0).toUpperCase() + doctorData.specialization.slice(1)}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        navigate("/doctor-dashboard");
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                     
                      Dashboard
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate("/doctor-profile");
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >

                      Profile Settings
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate("/doctor-appointments");
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                  
                      Appointments
                    </button>

                    <div className="border-t my-2"></div>
                    
                    <button
                      onClick={() => {
                        navigate("/");
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                     
                      Patient Portal
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                   
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login-as-doctor")}
              className="flex items-center gap-1 sm:gap-2 border border-green-500 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 text-green-800 hover:bg-green-400 hover:text-white transition-all text-sm sm:text-base"
            >
              <span>Doctor Login</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>


      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}


      <div className={`lg:hidden fixed top-0 right-0 h-full w-72 sm:w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
    
        <div className="flex justify-between items-center p-4 border-b bg-green-50">
          <div className="flex items-center gap-2">
            <img src={assets.logo} alt="Logo" className="w-8 h-8" />
            <div>
              <h2 className="text-lg font-bold text-green-600">PULSE</h2>
            
            </div>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-green-100 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <span className="block w-6 h-0.5 bg-gray-600 rotate-45 translate-y-0.5" />
            <span className="block w-6 h-0.5 bg-gray-600 -rotate-45 -translate-y-0.5" />
          </button>
        </div>

    
        {isDoctorLoggedIn && doctorData && (
          <div className="p-4 bg-green-50 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                {getInitials(doctorData.name)}
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">
                  Dr. {doctorData.name || "Doctor"}
                </div>
                <div className="text-xs text-green-600 capitalize">
                  {doctorData.specialization}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="p-4 space-y-1">
          <button
            onClick={() => handleMobileNavigation("/doctor-dashboard")}
            className="block w-full text-left text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium py-3 px-4 rounded-lg transition-all"
          >
           
            Dashboard
          </button>
          
          <button
            onClick={() => handleMobileNavigation("/doctor-appointments")}
            className="block w-full text-left text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium py-3 px-4 rounded-lg transition-all"
          >
          
            Appointments
          </button>
          
          <button
            onClick={() => handleMobileNavigation("/doctor-patients")}
            className="block w-full text-left text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium py-3 px-4 rounded-lg transition-all"
          >
            My Patients
          </button>
          
          <button
            onClick={() => handleMobileNavigation("/doctor-profile")}
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all text-center"
          >
          
            Profile Settings
          </button>
        </div>

    
        {isDoctorLoggedIn && (
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-red-700 transition-all text-center"
            >
             
              Sign Out
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default DoctorNavbar;
