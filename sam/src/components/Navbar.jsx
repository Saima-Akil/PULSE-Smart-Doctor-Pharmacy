import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userData, performLogout, isLoading, isLoggedin } = useContext(AppContent);

  const handleLogout = async () => {
    await performLogout();
    setIsDropdownOpen(false);
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "U";
    return (
      name
        .trim()
        .split(" ")
        .map((word) => word[0] || "")
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  const getAvatarColor = (name) => {
    if (!name) return "bg-gray-500";
    const colors = [
      "bg-blue-500",
      "bg-green-500", 
      "bg-purple-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-indigo-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };
  const handleMobileNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
    
      <div className="w-full flex justify-between items-center px-4 py-3 sm:px-6 sm:py-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 fixed top-0 bg-blue-100/90 backdrop-blur-md z-50 shadow-sm">
        

        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <img
            src={assets.logo}
            alt="Logo"
            className="w-24 h-auto sm:w-28 md:w-32 lg:w-36 group-hover:scale-105 transition-transform duration-300"
          />
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-600 group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
              PULSE
            </h1>
          </div>
        </div>

        <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 2xl:space-x-8">
          <button 
            onClick={() => navigate("/#home")}
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm xl:text-base"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/#specialities")}
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm xl:text-base"
          >
            Specialities
          </button>
          <button
            onClick={() => navigate("/doctor")}
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm xl:text-base"
          >
            Doctors
          </button>
          <button
            onClick={() => navigate("/book-appointment")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 xl:px-4 xl:py-2 rounded-full font-medium transition-all duration-200 text-sm xl:text-base"
          >
            Book Appointment
          </button>
         
          <button
            onClick={() => navigate("/buy-medicine")}
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm xl:text-base"
          >
            Buy Medicine
          </button>
           <button
            onClick={() => navigate("/contact-us")}
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-sm xl:text-base"
          >
            Contact Us
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

        
          {isLoading ? (
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gray-200 animate-pulse" />
          ) : isLoggedin && userData ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white text-sm sm:text-base md:text-lg font-bold hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white ${getAvatarColor(
                  userData.name
                )}`}
                title={`Logged in as ${userData.name || "User"}`}
              >
                {getInitials(userData.name)}
              </button>

            
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg py-2 z-20 border">
                    <div className="px-4 py-2 border-b">
                      <div className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        {userData.name || "User"}
                      </div>
                      {userData.email && (
                        <div className="text-xs sm:text-sm text-gray-500 truncate">
                          {userData.email}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
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
              onClick={() => navigate("/login")}
              className="flex items-center gap-1 sm:gap-2 border border-gray-500 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 text-gray-800 hover:bg-gray-400 hover:text-white transition-all text-sm sm:text-base"
            >
              <span className="hidden xs:inline">Login</span>
              <span className="xs:hidden">Login</span>
              <img src={assets.arrow_icon} alt="" className="w-2.5 sm:w-3 md:w-4" />
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
        
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <img src={assets.logo} alt="Logo" className="w-8 h-8" />
            <h2 className="text-lg font-bold text-blue-600">PULSE</h2>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <span className="block w-6 h-0.5 bg-gray-600 rotate-45 translate-y-0.5" />
            <span className="block w-6 h-0.5 bg-gray-600 -rotate-45 -translate-y-0.5" />
          </button>
        </div>
        <div className="p-4 space-y-1">
          <button
            onClick={() => handleMobileNavigation("/#home")}
            className="block w-full text-left text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition-all"
          >
             Home
          </button>
          <button
            onClick={() => handleMobileNavigation("/#specialities")}
            className="block w-full text-left text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition-all"
          >
             specialities
          </button>
          <button
            onClick={() => handleMobileNavigation("/doctor")}
            className="block w-full text-left text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition-all"
          >
             Doctors
          </button>
          <button
            onClick={() => handleMobileNavigation("/book-appointment")}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all text-center"
          >
             Book Appointment
          </button>
        
          <button
            onClick={() => handleMobileNavigation("/buy-medicine")}
            className="block w-full text-left text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition-all"
          >
             Buy Medicine
          </button>
          <button
            onClick={() => handleMobileNavigation("/contact-us")}
            className="block w-full text-left text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition-all"
          >
            Contact Us
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;

         
          
