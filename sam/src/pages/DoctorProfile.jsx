import React, { useState, useContext, useEffect } from "react";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import DoctorNavbar from "../components/DoctorNavbar";

const DoctorProfile = () => {
  const { isDoctorLoggedIn, doctorData, backendUrl, setDoctorData } = useContext(AppContent);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    specialization: "cardiologist",
    degree: "",
    experience: 0,
    fees: 500,
    street: "",
    city: "",
    state: "",
    pincode: "",
    workingdays: [],
    available: true,
    morningSlots: [],
    afternoonSlots: [],
    eveningSlots: []
  });

  const [isLoading, setIsLoading] = useState(false);


  const specializations = [
    "cardiologist",
    "Dermatologist",
    "Neurologist",
    "Gynecologist",
    "Eye Specialist",
    "Dentist",
    "Oncologist",
  ];

  
  const workingDaysOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];
  const timeSlots = {
    morning: [
      { time: '09:00', label: '09:00 AM' },
      { time: '09:30', label: '09:30 AM' },
      { time: '10:00', label: '10:00 AM' },
      { time: '10:30', label: '10:30 AM' },
      { time: '11:00', label: '11:00 AM' },
      { time: '11:30', label: '11:30 AM' },
    ],
    afternoon: [
      { time: '14:00', label: '02:00 PM' },
      { time: '14:30', label: '02:30 PM' },
      { time: '15:00', label: '03:00 PM' },
      { time: '15:30', label: '03:30 PM' },
      { time: '16:00', label: '04:00 PM' },
      { time: '16:30', label: '04:30 PM' },
    ],
    evening: [
      { time: '17:00', label: '05:00 PM' },
      { time: '17:30', label: '05:30 PM' },
      { time: '18:00', label: '06:00 PM' },
      { time: '18:30', label: '06:30 PM' },
      { time: '19:00', label: '07:00 PM' },
      { time: '19:30', label: '07:30 PM' },
    ]
  };


  useEffect(() => {
    if (!isDoctorLoggedIn) {
      navigate("/login-as-doctor");
      return;
    }

    if (doctorData) {
      
      const allSlots = doctorData.availableSlots || [];
      const morningSlots = allSlots.filter(slot => 
        ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'].includes(slot)
      );
      const afternoonSlots = allSlots.filter(slot => 
        ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30'].includes(slot)
      );
      const eveningSlots = allSlots.filter(slot => 
        ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30'].includes(slot)
      );

      setFormData({
        name: doctorData.name || "",
        phone: doctorData.phone || "",
        specialization: doctorData.specialization || "cardiologist",
        degree: doctorData.degree || "",
        experience: doctorData.experience || 0,
        fees: doctorData.fees || 500,
        street: doctorData.address?.street || "",
        city: doctorData.address?.city || "",
        state: doctorData.address?.state || "",
        pincode: doctorData.address?.pincode || "",
        workingdays: doctorData.workingdays || [],
        available: doctorData.available !== undefined ? doctorData.available : true,
        morningSlots,
        afternoonSlots,
        eveningSlots
      });
    }
  }, [doctorData, isDoctorLoggedIn, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  
  const handleWorkingDaysChange = (day) => {
    setFormData((prev) => ({
      ...prev,
      workingdays: prev.workingdays.includes(day)
        ? prev.workingdays.filter((d) => d !== day)
        : [...prev.workingdays, day],
    }));
  };

  
  const handleTimeSlotChange = (slotType, time) => {
    setFormData((prev) => ({
      ...prev,
      [slotType]: prev[slotType].includes(time)
        ? prev[slotType].filter((t) => t !== time)
        : [...prev[slotType], time],
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    
    if (!formData.name || !formData.phone || !formData.degree) {
      toast.error("Please fill all required fields");
      setIsLoading(false);
      return;
    }

    if (formData.workingdays.length === 0) {
      toast.error("Please select at least one working day");
      setIsLoading(false);
      return;
    }

    const totalSlots = formData.morningSlots.length + formData.afternoonSlots.length + formData.eveningSlots.length;
    if (totalSlots === 0) {
      toast.error("Please select at least some available time slots");
      setIsLoading(false);
      return;
    }

    try {

      const availableSlots = [
        ...formData.morningSlots,
        ...formData.afternoonSlots,
        ...formData.eveningSlots
      ].sort();

      const updateData = {
        ...formData,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: "India",
        },
        availableSlots,
      };

      console.log("Sending data:", updateData); 

      const { data } = await axios.put(
        `${backendUrl}/api/doctor/update-profile`,
        updateData,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setDoctorData(data.doctorData);
        toast.success("Profile updated successfully!");
        navigate("/doctor-dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DoctorNavbar />
      <div className="min-h-screen bg-gray-50 py-8 pt-28">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Complete Your Doctor Profile
              </h1>
              <p className="text-gray-600">
                Fill out your professional details to help patients find you
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
            
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                    1
                  </span>
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Dr. John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                </div>
              </div>


              <div className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                    2
                  </span>
                  Professional Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization *
                    </label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec.charAt(0).toUpperCase() + spec.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Degree/Qualification *
                    </label>
                    <input
                      type="text"
                      name="degree"
                      value={formData.degree}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="MBBS, MD, MS, etc."
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience (Years) *
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      min="0"
                      max="50"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consultation Fees (₹) *
                    </label>
                    <input
                      type="number"
                      name="fees"
                      value={formData.fees}
                      onChange={handleInputChange}
                      min="100"
                      max="5000"
                      step="50"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

            
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                    3
                  </span>
                  Clinic Address
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="123 Medical Street, Near Hospital"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Mumbai"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Maharashtra"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        pattern="[0-9]{6}"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="400001"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

            
              <div className="bg-purple-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                    4
                  </span>
                  Working Schedule
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Working Days * (Select at least one)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {workingDaysOptions.map((day) => (
                        <label
                          key={day}
                          className="flex items-center space-x-2 cursor-pointer bg-white p-3 rounded-lg border hover:bg-purple-100 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.workingdays.includes(day)}
                            onChange={() => handleWorkingDaysChange(day)}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700 font-medium">
                            {day}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="available"
                      id="available"
                      checked={formData.available}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label
                      htmlFor="available"
                      className="text-sm font-medium text-gray-700"
                    >
                      Currently Available for Consultations
                    </label>
                  </div>
                </div>
              </div>

              
              <div className="bg-indigo-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                    5
                  </span>
                  Available Time Slots *
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Select the time slots when you'll be available for appointments
                </p>

                <div className="space-y-6">
            
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Morning Slots (9:00 AM - 12:00 PM)</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {timeSlots.morning.map(({ time, label }) => (
                        <label
                          key={time}
                          className="flex items-center space-x-2 cursor-pointer bg-white p-3 rounded-lg border hover:bg-indigo-100 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.morningSlots.includes(time)}
                            onChange={() => handleTimeSlotChange('morningSlots', time)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700 font-medium">
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

    
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Afternoon Slots (2:00 PM - 5:00 PM)</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {timeSlots.afternoon.map(({ time, label }) => (
                        <label
                          key={time}
                          className="flex items-center space-x-2 cursor-pointer bg-white p-3 rounded-lg border hover:bg-indigo-100 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.afternoonSlots.includes(time)}
                            onChange={() => handleTimeSlotChange('afternoonSlots', time)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700 font-medium">
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Evening Slots (5:00 PM - 8:00 PM)</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {timeSlots.evening.map(({ time, label }) => (
                        <label
                          key={time}
                          className="flex items-center space-x-2 cursor-pointer bg-white p-3 rounded-lg border hover:bg-indigo-100 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.eveningSlots.includes(time)}
                            onChange={() => handleTimeSlotChange('eveningSlots', time)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700 font-medium">
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-indigo-200">
                    <p className="text-sm text-indigo-700">
                      <strong>Selected Slots:</strong> {
                        formData.morningSlots.length + formData.afternoonSlots.length + formData.eveningSlots.length
                      } time slots
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-lg shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Updating Profile...
                    </div>
                  ) : (
                    "Save Profile"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorProfile;
