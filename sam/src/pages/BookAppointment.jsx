import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const BookAppointment = () => {
  const navigate = useNavigate();
  const { userData, isLoggedin, backendUrl } = useContext(AppContent);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [formData, setFormData] = useState({
    
    patientName: userData?.name || '',
    patientEmail: userData?.email || '',
    patientPhone: '',
    age: '',
    gender: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    symptoms: '',
    isEmergency: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoggedin) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }
  }, [isLoggedin, navigate]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/doctor/all`);
        if (data.success) {
          setDoctors(data.doctors);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast.error('Failed to load doctors');
      }
    };

    fetchDoctors();
  }, [backendUrl]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (formData.doctorId && formData.appointmentDate) {
        try {
          console.log('fetching slots for:',{
            doctorId:formData.doctorId,
            date:formData.appointmentDate
          })
          const { data } = await axios.get(
            `${backendUrl}/api/appointment/available-slots?doctorId=${formData.doctorId}&date=${formData.appointmentDate}`
          );
          if (data.success) {
            setAvailableSlots(data.availableSlots);
          }
        } catch (error) {
          console.error('Error fetching slots:', error);
          setAvailableSlots([]);
        }
      }
    };

    fetchSlots();
  }, [formData.doctorId, formData.appointmentDate, backendUrl]);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));

  
    if (name === 'doctorId') {
      const doctor = doctors.find(d => d.id === value);
      setSelectedDoctor(doctor);
      setFormData(prev => ({ ...prev, appointmentTime: '' })); 
      setAvailableSlots([]);
    }

    if (name === 'appointmentDate') {
      setFormData(prev => ({ ...prev, appointmentTime: '' }));
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!formData.doctorId) {
      toast.error('Please select a doctor');
      setIsSubmitting(false);
      return;
    }

    if (!formData.appointmentTime) {
      toast.error('Please select appointment time');
      setIsSubmitting(false);
      return;
    }

    try {
      const appointmentData = {
        doctorId: formData.doctorId,
        patientName: formData.patientName,
        patientPhone: formData.patientPhone,
        patientEmail: formData.patientEmail,
        age: parseInt(formData.age),
        gender: formData.gender,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        symptoms: formData.symptoms,
        isEmergency: formData.isEmergency
      };

      const { data } = await axios.post(`${backendUrl}/api/appointment/book`, appointmentData, {
        withCredentials: true
      });
      
      if (data.success) {
        toast.success('Appointment booked successfully!');
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 pt-45">
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg ">
          
        
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-600 mb-2">Book Appointment</h2>
            <p className="text-gray-600">Schedule your consultation with our qualified doctors</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">1</span>
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="patientPhone"
                    value={formData.patientPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91 9876543210"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="patientEmail"
                    value={formData.patientEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="1"
                    max="120"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === 'Male'}
                        onChange={handleInputChange}
                        className="mr-2"
                        required
                      />
                      Male
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === 'Female'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Female
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Other"
                        checked={formData.gender === 'Other'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Other
                    </label>
                  </div>
                </div>
              </div>
            </div>

      
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">2</span>
                Select Doctor
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Doctor *
                </label>
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a Doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.name} - {doctor.specialization} (₹{doctor.fees})
                    </option>
                  ))}
                </select>
              </div>

            
              {selectedDoctor && (
                <div className="mt-4 p-4 bg-white rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-2">Doctor Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Specialization:</span>
                      <span className="ml-2 capitalize">{selectedDoctor.specialization}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Experience:</span>
                      <span className="ml-2">{selectedDoctor.experience} years</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Consultation Fee:</span>
                      <span className="ml-2">₹{selectedDoctor.fees}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Rating:</span>
                      <span className="ml-2">{selectedDoctor.rating}/5 ⭐</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

        
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">3</span>
                Appointment Schedule
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Time Slots *
                  </label>
                  <select
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                    disabled={!formData.doctorId || !formData.appointmentDate}
                  >
                    <option value="">Select Time Slot</option>
                    {availableSlots.map(slot => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  {formData.doctorId && formData.appointmentDate && availableSlots.length === 0 && (
                    <p className="text-red-500 text-sm mt-1">No slots available for selected date</p>
                  )}
                </div>
              </div>
            </div>

      
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">4</span>
                Medical Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Symptoms / Reason for Visit *
                  </label>
                  <textarea
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Please describe your symptoms or reason for consultation..."
                    required
                  />
                </div>

                
              </div>
            </div>

          
            <div className="bg-gray-100 p-6 rounded-lg">
              <button
                type="submit"
                disabled={isSubmitting || !formData.doctorId}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Booking Appointment...
                  </div>
                ) : (
                  `Book Appointment${selectedDoctor ? ` - Pay ₹${selectedDoctor.fees}` : ''}`
                )}
              </button>
              
            
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BookAppointment;
