import React, { useState } from 'react'

const DoctorSpecialities = () => {
  const specialities = [
    { name: 'Cardiology', doctors: 20, icon: '🫀' },
    { name: 'Dental Care', doctors: 15, icon: '🦷' },
    { name: 'Neurology', doctors: 12, icon: '🧠' },
    { name: 'Gynecology', doctors: 10, icon: '👩‍⚕️' },
    { name: 'Ophthalmology', doctors: 17, icon: '👁️' },
    { name: 'Dermatology', doctors: 14, icon: '🎗' }
  ]

  return (
    <section className="py-16 px-4" id='specialities'>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
             Specialities
          </h2>
          <p className="text-gray-600 text-lg">
            Explore a Wide Range of Specialities
          </p>
 
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {specialities.map((specialty, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-6 hover:bg-indigo-600 shadow-lg hover:shadow-xl hover:-translate-y-3 transition-all duration-300 ease-out text-center transform group cursor-pointer border border-gray-100"
            >
              <div className="text-4xl mb-4 group-hover:text-white transition-colors duration-300">
                {specialty.icon}
              </div>
              <h3 className="font-semibold group-hover:text-white text-gray-900 mb-2 transition-colors duration-300">
                {specialty.name}
              </h3>
              <p className="text-blue-600 group-hover:text-white transition-colors duration-300">
                {specialty.doctors} Doctors Available
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DoctorSpecialities
