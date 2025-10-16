import React, { useContext, useEffect } from "react";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { useLocation} from "react-router-dom";

const Header = () => {
  const { userData, isLoading, isLoggedin } = useContext(AppContent);
  const navigate = useNavigate();
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
    <div id="home" className="flex flex-col items-center pt-24 mt-24 px-4 text-center text-gray-800">
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        {isLoading ? (
          "Loading..."
        ) : (
          <>
            Hey{" "}
            {isLoggedin && userData?.name ? (
              <span className="text-indigo-600 font-semibold">
                {userData.name}
              </span>
            ) : (
              "User"
            )}
            !<span className="wave">👋</span>
          </>
        )}
      </h1>

      <h2 className="text-xl sm:text-5xl font-semibold mb-4">
        Smart Healthcare Made Simple{" "}
        <p className="text-blue-500 mt-2 text-4xl">Doctor to Pharmacy, All Connected</p>
      </h2>

      <p className="mb-8 max-w-md">
        {isLoggedin && userData?.name
          ? `Great to see you back, ${userData.name.split(" ")[0]}!`
          : "Our innovative platform brings complete healthcare solutions directly to you, featuring instant doctor consultations, prescription management, and doorstep medicine delivery. Whether you need a routine check-up or specialized treatment, we've streamlined the entire process so you can focus on what matters most - your health and well-being."}
      </p>

      <div className="flex gap-4">
        <button   
          onClick={() => navigate('/login-as-doctor')}   
          className="border border-gray-800 rounded-full px-8 py-2.5 bg-blue-500 text-white hover:bg-blue-700 transition-all"
        >
          Login as Doctor
        </button>
        
        <button  
          onClick={() => navigate('/contact-us')} 
          className="border border-gray-800 rounded-full px-8 py-2.5 text-black hover:bg-gray-400 hover:text-white transition-all"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Header;
