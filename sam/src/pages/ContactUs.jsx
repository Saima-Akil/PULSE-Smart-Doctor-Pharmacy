import React from 'react'

const ContactUs = () => {
  return (
    <div>
     <div className='min-h-screen bg-green-100 flex flex-col items-center justify-center px-4 py-10'>
    <div className='max-w-3xl w-full bg-blue-50 shadow-lg rounded-2xl p-8'>
          <h2 className='text-4xl font-bold text-center text-blue-700 mb-6'>Contact Us</h2>

          <p className='text-center text-gray-600 mb-8'> Have any questions or feedback? We’d love to hear from you!</p>
          <form className='space-y-6'>
            <div>
                <label className='block text-gray-700 font-medium mb-2'>
                Full Name
                </label>
                <input type="text" placeholder='Enter your Name' className='w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none'></input>
            </div>
             <div>
                <label className='block text-gray-700 font-medium mb-2'>
                Email
                </label>
                <input type="text" placeholder='Enter your Email' className='w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none'></input>
            </div>
                 <div>
                <label className='block text-gray-700 font-medium mb-2'>
                Message
                </label>
              <textarea rows='5' placeholder='write your message...' className='w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none'>

              </textarea>
            </div>
            <button type='submit' className='w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition duration-300'> Send Message</button>
          </form>
          <div className='mt-8 text-center text-gray-600'>
            <p> 📍Patna,India</p>
            <p> 📞+91 9882288222</p>
            <p> ✉️ mern@example.com</p>

          </div>
    </div>
      
     </div>
      
    </div>
  )
}

export default ContactUs
