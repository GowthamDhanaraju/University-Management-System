import React, { useState } from "react";
import TeacherSidebar from "@/components/teacher_sidebar";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  organizer: string;
  status: "approved" | "pending" | "rejected" | "completed";
  description: string;
}

interface BookingSlot {
  id: string;
  date: string;
  timeSlot: string;
  isAvailable: boolean;
}

const AuditoriumPage: React.FC = () => {
  // Sample data - would come from API in production
  const [activeTab, setActiveTab] = useState<"booking">("booking");
  const [bookingForm, setBookingForm] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
  }); 
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to an API
    alert("Booking request submitted: " + JSON.stringify(bookingForm));
    setBookingForm({ title: "", date: "", time: "", description: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };
 

  const currentDate = new Date();
 
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <TeacherSidebar />
      
      <div className="ml-16 p-6">
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
                      <option value="09:00-12:00">09:00 - 12:00</option>
                      <option value="13:00-16:00">13:00 - 16:00</option>
                      <option value="16:30-19:30">16:30 - 19:30</option>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditoriumPage;
