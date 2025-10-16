import React, { useContext, useEffect } from "react";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import DoctorNavbar from "../components/DoctorNavbar";

const DoctorDashboard = () => {
  const { isDoctorLoggedIn, doctorData, performDoctorLogout } =
    useContext(AppContent);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isDoctorLoggedIn) {
      navigate("/login-as-doctor");
    }
  }, [isDoctorLoggedIn, navigate]);

  const handleLogout = () => {
    performDoctorLogout();
    navigate("/");
  };

  if (!isDoctorLoggedIn || !doctorData) {
    return (
      <>
        <DoctorNavbar />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading doctor dashboard...</p>
          </div>
        </div>
      </>
    );
  }
  const isProfileIncomplete =
    !doctorData.phone || !doctorData.degree || !doctorData.address?.city;

  return (
    <>
      <DoctorNavbar />
      <div className="min-h-screen bg-gray-50 py-8 pt-45">
        <div className="max-w-7xl mx-auto px-4">
          {/* Welcome Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-500 rounded-lg p-8 text-white mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome, Dr. {doctorData.name}
                </h1>
                <p className="text-blue-100">
                  {doctorData.specialization} • {doctorData.experience} years
                  experience
                </p>
              </div>
              <div className="text-right">
                <button
                  onClick={handleLogout}
                  className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-red-500 "
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Patients
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                 
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Today's Appointments
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                 
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Monthly Earnings
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">₹0</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                 
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Rating
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {doctorData.rating}/5
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

        
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Profile Information
                </h2>
                <button
                  onClick={() => navigate("/doctor-profile")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {doctorData.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Phone
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {doctorData.phone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Specialization
                    </label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">
                      {doctorData.specialization}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Degree
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {doctorData.degree || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Experience
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {doctorData.experience} years
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Consultation Fees
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      ₹{doctorData.fees}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        doctorData.available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {doctorData.available ? "Available" : "Not Available"}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Working Days
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {doctorData.workingdays &&
                      doctorData.workingdays.length > 0
                        ? doctorData.workingdays.join(", ")
                        : "Not set"}
                    </p>
                  </div>
                </div>
              </div>

              {doctorData.address && (
                <div className="mt-6 pt-6 border-t">
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Clinic Address
                  </label>
                  <p className="text-sm text-gray-900">
                    {doctorData.address.street &&
                      `${doctorData.address.street}, `}
                    {doctorData.address.city && `${doctorData.address.city}, `}
                    {doctorData.address.state && `${doctorData.address.state} `}
                    {doctorData.address.pincode &&
                      `- ${doctorData.address.pincode}`}
                    {!doctorData.address.street &&
                      !doctorData.address.city &&
                      "Not provided"}
                  </p>
                </div>
              )}
            </div>


            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Quick Actions
              </h2>

              <div className="space-y-4">
                <button
                  onClick={() => navigate("/doctor-appointments")}
                  className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center">
                   
                    <span className="font-medium text-gray-900">
                      View Appointments
                    </span>
                  </div>
                 
                </button>

                <button
                  onClick={() => navigate("/doctor-profile")}
                  className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center">
                  
                    <span className="font-medium text-gray-900">
                      Update Profile
                    </span>
                  </div>
                  
                </button>

             
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorDashboard;
