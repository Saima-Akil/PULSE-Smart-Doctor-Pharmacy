import React, { useState, useContext, useEffect } from "react";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import DoctorNavbar from "../components/DoctorNavbar";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorAppointments = () => {
  const { isDoctorLoggedIn, doctorData, backendUrl } = useContext(AppContent);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); 

  useEffect(() => {
    if (!isDoctorLoggedIn) {
      navigate("/login-as-doctor");
      return;
    }
    fetchAppointments();
  }, [isDoctorLoggedIn, navigate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/appointment/doctor-appointments`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (
    appointmentId,
    status,
    notes = "",
    prescription = ""
  ) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/appointment/update-status`,
        {
          appointmentId,
          status,
          doctorNotes: notes,
          prescription,
        },
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success("Appointment updated successfully");
        fetchAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "all") return true;
    return appointment.status === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  if (loading) {
    return (
      <>
        <DoctorNavbar />
        <div className="min-h-screen bg-gray-50 pt-28">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DoctorNavbar />
      <div className="min-h-screen bg-gray-50 pt-40">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Appointments
            </h1>
            <p className="text-gray-600">Manage your patient appointments</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl font-bold text-gray-900">
                {appointments.length}
              </div>
              <div className="text-sm text-gray-500">Total Appointments</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl font-bold text-yellow-600">
                {appointments.filter((a) => a.status === "pending").length}
              </div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl font-bold text-blue-600">
                {appointments.filter((a) => a.status === "confirmed").length}
              </div>
              <div className="text-sm text-gray-500">Confirmed</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl font-bold text-green-600">
                {appointments.filter((a) => a.status === "completed").length}
              </div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>


          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {["all", "pending", "confirmed", "completed", "cancelled"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filter === status
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>

    
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No appointments found
              </h3>
              <p className="text-gray-500">
                No appointments match the selected filter.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.patientName}
                      </h3>
                      <p className="text-gray-600">
                        {appointment.gender} • Age {appointment.age}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Date
                      </label>
                      <p className="text-gray-900">
                        {formatDate(appointment.appointmentDate)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Time
                      </label>
                      <p className="text-gray-900">
                        {formatTime(appointment.appointmentTime)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Phone
                      </label>
                      <p className="text-gray-900">
                        {appointment.patientPhone}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Fee
                      </label>
                      <p className="text-gray-900">
                        ₹{appointment.consultationFees}
                      </p>
                    </div>
                  </div>

                  {appointment.symptoms && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Symptoms
                      </label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                        {appointment.symptoms}
                      </p>
                    </div>
                  )}

                  {appointment.isEmergency && (
                    <div className="mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        🚨 Emergency
                      </span>
                    </div>
                  )}

            
                  <div className="flex flex-wrap gap-2">
                    {appointment.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateAppointmentStatus(appointment.id, "confirmed")
                          }
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() =>
                            updateAppointmentStatus(appointment.id, "cancelled")
                          }
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {appointment.status === "confirmed" && (
                      <button
                        onClick={() =>
                          updateAppointmentStatus(appointment.id, "completed")
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Mark Complete
                      </button>
                    )}

                    <button
                      onClick={() =>
                        window.open(`tel:${appointment.patientPhone}`)
                      }
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Call Patient
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorAppointments;
