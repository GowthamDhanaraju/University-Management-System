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
  const [activeTab, setActiveTab] = useState<"booking" | "events" | "availability" | "manage">("booking");
  const [bookingForm, setBookingForm] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
  });

  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Annual Drama Festival",
      date: "2025-04-15",
      time: "15:00-18:00",
      organizer: "Drama Club",
      status: "approved",
      description: "Annual school drama festival featuring performances from all grades."
    },
    {
      id: "2",
      title: "Science Exhibition",
      date: "2025-04-10",
      time: "10:00-14:00",
      organizer: "Science Department",
      status: "approved",
      description: "Exhibition of student science projects and innovations."
    },
    {
      id: "3",
      title: "Parent-Teacher Meeting",
      date: "2025-03-25",
      time: "16:00-19:00",
      organizer: "School Administration",
      status: "completed",
      description: "End of term parent-teacher conference."
    }
  ]);

  const [availabilitySlots, setAvailabilitySlots] = useState<BookingSlot[]>([
    { id: "a1", date: "2025-04-05", timeSlot: "09:00-12:00", isAvailable: true },
    { id: "a2", date: "2025-04-05", timeSlot: "13:00-16:00", isAvailable: false },
    { id: "a3", date: "2025-04-06", timeSlot: "09:00-12:00", isAvailable: true },
    { id: "a4", date: "2025-04-06", timeSlot: "13:00-16:00", isAvailable: true },
    { id: "a5", date: "2025-04-07", timeSlot: "09:00-12:00", isAvailable: false },
    { id: "a6", date: "2025-04-07", timeSlot: "13:00-16:00", isAvailable: true },
  ]);

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

  const toggleAvailability = (id: string) => {
    setAvailabilitySlots(prev => 
      prev.map(slot => 
        slot.id === id ? { ...slot, isAvailable: !slot.isAvailable } : slot
      )
    );
  };

  const handleStatusChange = (id: string, newStatus: Event["status"]) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === id ? { ...event, status: newStatus } : event
      )
    );
  };

  const currentDate = new Date();
  const upcomingEvents = events.filter(event => new Date(event.date) >= currentDate && event.status !== "completed");
  const previousEvents = events.filter(event => new Date(event.date) < currentDate || event.status === "completed");

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
            <button 
              className={`px-4 py-2 font-medium ${activeTab === "events" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-gray-200"}`}
              onClick={() => setActiveTab("events")}
            >
              Events
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === "availability" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-gray-200"}`}
              onClick={() => setActiveTab("availability")}
            >
              Availability Status
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === "manage" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-gray-200"}`}
              onClick={() => setActiveTab("manage")}
            >
              Manage Bookings
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
          
          {/* Events Tab */}
          {activeTab === "events" && (
            <div>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-200">Upcoming Events</h2>
                {upcomingEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {upcomingEvents.map(event => (
                      <div key={event.id} className="border border-gray-700 rounded-lg p-4 bg-gray-750">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-lg text-gray-200">{event.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            event.status === "approved" ? "bg-green-900 text-green-300" : 
                            event.status === "pending" ? "bg-yellow-900 text-yellow-300" : 
                            "bg-red-900 text-red-300"
                          }`}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-400 mt-1">{event.date} | {event.time}</p>
                        <p className="text-gray-400">Organizer: {event.organizer}</p>
                        <p className="text-gray-300 mt-2">{event.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No upcoming events scheduled.</p>
                )}
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-200">Previous Events</h2>
                {previousEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {previousEvents.map(event => (
                      <div key={event.id} className="border border-gray-700 rounded-lg p-4 bg-gray-750 opacity-80">
                        <h3 className="font-medium text-lg text-gray-200">{event.title}</h3>
                        <p className="text-gray-400 mt-1">{event.date} | {event.time}</p>
                        <p className="text-gray-400">Organizer: {event.organizer}</p>
                        <p className="text-gray-300 mt-2">{event.description}</p>
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-600 text-gray-300 mt-2 inline-block">
                          Completed
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No previous events found.</p>
                )}
              </div>
            </div>
          )}
          
          {/* Availability Status Tab */}
          {activeTab === "availability" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-200">Auditorium Availability</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 border border-gray-700">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="py-3 px-4 text-left border-b border-gray-600 text-gray-300">Date</th>
                      <th className="py-3 px-4 text-left border-b border-gray-600 text-gray-300">Time Slot</th>
                      <th className="py-3 px-4 text-left border-b border-gray-600 text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availabilitySlots.map(slot => (
                      <tr key={slot.id} className="hover:bg-gray-750">
                        <td className="py-3 px-4 border-b border-gray-700 text-gray-300">{slot.date}</td>
                        <td className="py-3 px-4 border-b border-gray-700 text-gray-300">{slot.timeSlot}</td>
                        <td className="py-3 px-4 border-b border-gray-700">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            slot.isAvailable ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                          }`}>
                            {slot.isAvailable ? "Available" : "Booked"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2 text-gray-200">Booking Guidelines</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-400">
                  <li>Bookings must be made at least 7 days in advance</li>
                  <li>The auditorium capacity is 300 people</li>
                  <li>Technical equipment requests must be submitted 3 days before the event</li>
                  <li>Cancellations should be notified at least 48 hours before the scheduled event</li>
                </ul>
              </div>
            </div>
          )}
          
          {/* Manage Bookings Tab */}
          {activeTab === "manage" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-200">Manage Bookings</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 border border-gray-700">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="py-3 px-4 text-left border-b border-gray-600 text-gray-300">Event Title</th>
                      <th className="py-3 px-4 text-left border-b border-gray-600 text-gray-300">Date & Time</th>
                      <th className="py-3 px-4 text-left border-b border-gray-600 text-gray-300">Organizer</th>
                      <th className="py-3 px-4 text-left border-b border-gray-600 text-gray-300">Status</th>
                      <th className="py-3 px-4 text-left border-b border-gray-600 text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(event => (
                      <tr key={event.id} className="hover:bg-gray-750">
                        <td className="py-3 px-4 border-b border-gray-700 text-gray-300">{event.title}</td>
                        <td className="py-3 px-4 border-b border-gray-700 text-gray-300">{event.date}<br/>{event.time}</td>
                        <td className="py-3 px-4 border-b border-gray-700 text-gray-300">{event.organizer}</td>
                        <td className="py-3 px-4 border-b border-gray-700">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            event.status === "approved" ? "bg-green-900 text-green-300" : 
                            event.status === "pending" ? "bg-yellow-900 text-yellow-300" : 
                            event.status === "rejected" ? "bg-red-900 text-red-300" :
                            "bg-gray-600 text-gray-300"
                          }`}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 border-b border-gray-700">
                          <select 
                            value={event.status}
                            onChange={(e) => handleStatusChange(event.id, e.target.value as Event["status"])}
                            className="p-1 border border-gray-600 rounded-md text-sm bg-gray-700 text-white"
                            disabled={event.status === "completed"}
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approve</option>
                            <option value="rejected">Reject</option>
                            <option value="completed">Mark Completed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2 text-gray-200">Manage Availability</h3>
                <p className="text-gray-400 mb-3">Toggle time slots to mark them as available or unavailable:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availabilitySlots.map(slot => (
                    <div key={slot.id} className="border border-gray-700 rounded-lg p-4 bg-gray-750 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-300">{slot.date}</p>
                        <p className="text-gray-400">{slot.timeSlot}</p>
                      </div>
                      <button
                        onClick={() => toggleAvailability(slot.id)}
                        className={`px-3 py-1 rounded-md ${
                          slot.isAvailable 
                            ? "bg-green-900 text-green-300 hover:bg-green-800" 
                            : "bg-red-900 text-red-300 hover:bg-red-800"
                        }`}
                      >
                        {slot.isAvailable ? "Available" : "Booked"}
                      </button>
                    </div>
                  ))}
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