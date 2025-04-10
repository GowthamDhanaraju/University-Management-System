import React, { useState, useEffect } from "react";
import TeacherSidebar from "@/components/teacher_sidebar";
import axios from "axios";
import { useRouter } from "next/router";

interface Event {
  id: string;
  title: string;
  date: string;
  timeSlot: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  auditoriumName: string;
}

interface BookingSlot {
  id: string;
  date: string;
  timeSlot: string;
  isAvailable: boolean;
}

const AuditoriumPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("booking");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [myBookings, setMyBookings] = useState<Event[]>([]);
  const [availableSlots, setAvailableSlots] = useState<BookingSlot[]>([]);
  const [bookingForm, setBookingForm] = useState({
    title: "",
    date: "",
    time: "",
    description: ""
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchAuditoriumData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          router.push("/login");
          return;
        }
        
        // Fetch my bookings
        const bookingsRes = await axios.get("/api/teacher/auditorium/bookings", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (bookingsRes.data && Array.isArray(bookingsRes.data)) {
          setMyBookings(bookingsRes.data.map((booking: any) => ({
            id: booking.id || String(booking._id),
            title: booking.title,
            date: booking.date,
            timeSlot: booking.timeSlot || booking.time,
            description: booking.description,
            status: booking.status
          })));
        }
        
        // Fetch available slots
        const slotsRes = await axios.get("/api/teacher/auditorium/available-slots", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (slotsRes.data && Array.isArray(slotsRes.data)) {
          setAvailableSlots(slotsRes.data.map((slot: any) => ({
            id: slot.id || String(slot._id),
            date: slot.date,
            timeSlot: slot.timeSlot || slot.time
          })));
        }
        
        setError("");
      } catch (err) {
        console.error("Failed to fetch auditorium data:", err);
        setError("Failed to load auditorium data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuditoriumData();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      
      // Reset form and show success message
      setBookingForm({ title: "", date: "", time: "", description: "" });
      setSubmitSuccess(true);
      
      // Refresh bookings list
      const bookingsRes = await axios.get("/api/teacher/auditorium/bookings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyBookings(bookingsRes.data);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to submit booking request:", err);
      setSubmitError("Failed to submit booking request. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push("/login");
        return;
      }
      
      await axios.delete(`/api/teacher/auditorium/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update bookings list after cancellation
      setMyBookings(prev => prev.filter(booking => booking.id !== bookingId));
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      alert("Failed to cancel booking. Please try again.");
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200">
        <TeacherSidebar />
        <div className="ml-16 p-6 flex items-center justify-center">
          <div>Loading auditorium data...</div>
        </div>
      </div>
    );
  }
  
  const currentDate = new Date();
  const formattedCurrentDate = currentDate.toISOString().split('T')[0];
 
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <TeacherSidebar />
      
      <div className="ml-16 p-6">
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 mb-6 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-700">
          <h1 className="text-2xl font-bold text-gray-100 mb-4">Auditorium Management</h1>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-6">
            <button 
              className={`px-4 py-2 font-medium ${activeTab === "booking" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-gray-200"}`}
              onClick={() => setActiveTab("booking")}
            >
              Booking Details
            </button> 
          </div>
          
          {/* Booking Details Tab */}
          {activeTab === "booking" && (
            <div>
              {/* Success Message */}
              {submitSuccess && (
                <div className="bg-green-900/50 border border-green-500 text-green-200 p-4 mb-6 rounded-lg">
                  Booking request submitted successfully!
                </div>
              )}
              
              {/* Error Message */}
              {submitError && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 mb-6 rounded-lg">
                  {submitError}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* My Bookings Section */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-4 text-gray-200">My Bookings</h2>
                  
                  {myBookings.length === 0 ? (
                    <div className="text-gray-400 text-center py-4">No bookings found</div>
                  ) : (
                    <div className="space-y-4">
                      {myBookings.map(booking => (
                        <div key={booking.id} className="bg-gray-800 rounded-lg p-3 flex flex-col">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-white">{booking.title}</h3>
                              <p className="text-gray-400 text-sm">{booking.auditoriumName}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${
                              booking.status === 'approved' ? 'bg-green-800 text-green-200' : 
                              booking.status === 'rejected' ? 'bg-red-800 text-red-200' : 
                              'bg-yellow-800 text-yellow-200'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-gray-300">
                            <div>Date: {new Date(booking.date).toLocaleDateString()}</div>
                            <div>Time: {booking.timeSlot}</div>
                          </div>
                          <p className="text-gray-400 text-sm mt-2">{booking.description}</p>
                          
                          {booking.status === 'pending' && (
                            <button 
                              onClick={() => handleCancelBooking(booking.id)}
                              className="mt-2 self-end text-red-400 hover:text-red-300 text-sm"
                            >
                              Cancel Request
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Request Booking Form */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-4 text-gray-200">Request Auditorium Booking</h2>
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Event Title</label>
                      <input
                        type="text"
                        name="title"
                        value={bookingForm.title}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                        <input
                          type="date"
                          name="date"
                          value={bookingForm.date}
                          onChange={handleInputChange}
                          min={formattedCurrentDate} // Prevent selecting past dates
                          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Time Slot</label>
                        <select
                          name="time"
                          value={bookingForm.time}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                          required
                        >
                          <option value="">Select time slot</option>
                          {availableSlots
                            .filter(slot => !bookingForm.date || slot.date === bookingForm.date)
                            .map(slot => (
                              <option key={slot.id} value={slot.timeSlot}>
                                {slot.timeSlot}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Event Description</label>
                      <textarea
                        name="description"
                        value={bookingForm.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                        rows={3}
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Submit Booking Request
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditoriumPage;
