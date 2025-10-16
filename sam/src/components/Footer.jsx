import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-white">
    
      <div className="w-full px-6 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <img 
                src={assets?.logo || "/logo.png"} 
                alt="PULSE Logo" 
                className="w-8 h-8"
              />
              <h3 className="text-xl font-bold text-blue-400">PULSE</h3>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Your trusted healthcare companion. Making quality medical care accessible 24/7.
            </p>
            
          
           
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              <a href="/" className="text-gray-300 hover:text-white transition-colors text-sm">Home</a>
              <a href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">About</a>
              <a href="/doctor" className="text-gray-300 hover:text-white transition-colors text-sm">Doctors</a>
              <a href="/book-appointment" className="text-gray-300 hover:text-white transition-colors text-sm">Book Appointment</a>
              <a href="/symptom-checker" className="text-gray-300 hover:text-white transition-colors text-sm">Symptom Checker</a>
              <a href="/buy-medicine" className="text-gray-300 hover:text-white transition-colors text-sm">Buy Medicine</a>
            </div>
          </div>

  
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Contact Us</h4>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300 flex items-center justify-center md:justify-start gap-2">
                <span>📞</span> +91 98765 43210
              </p>
              <p className="text-gray-300 flex items-center justify-center md:justify-start gap-2">
                <span>📧</span> support@pulse.healthcare
              </p>
              <p className="text-gray-300 flex items-center justify-center md:justify-start gap-2">
                <span>⏰</span> 24/7 Available
              </p>
              <p className="text-gray-300 flex items-center justify-center md:justify-start gap-2">
                <span>📍</span> Patna, Bihar
              </p>
            </div>
          </div>
        </div>
      </div>


      <div className="w-full bg-gray-800 py-4">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} PULSE Healthcare. All rights reserved.</p>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-4">
              <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
