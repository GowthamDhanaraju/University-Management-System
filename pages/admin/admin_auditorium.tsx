import React, { useState } from "react";
import AdminSidebar from "@/components/admin_sidebar";

interface Auditorium {
  id: string;
  name: string;
  location: string;
  capacity: number;
  hasWhiteboard: boolean;
  status: "available" | "renovation" | "repair" | "maintenance";
  statusNote?: string;
  amenities: string[];
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  auditoriumId: string;
  faculty: string;
  club?: string;
  status: "approved" | "pending" | "rejected" | "completed";
  description: string;
}

interface BookingSlot {
  id: string;
  auditoriumId: string;
  date: string;
  timeSlot: string;
  isAvailable: boolean;
}

const AdminAuditoriumPage: React.FC = () => {
  // Sample data - would come from API in production
  const [activeTab, setActiveTab] = useState<"list" | "add" | "bookings" | "availability">("list");
  const [selectedAuditorium, setSelectedAuditorium] = useState<string | null>(null);
  
  // Form states
  const [auditoriumForm, setAuditoriumForm] = useState<Omit<Auditorium, "id">>({
    name: "",
    location: "",
    capacity: 0,
    hasWhiteboard: false,
    status: "available",
    amenities: []
  });
  
  const [bookingForm, setBookingForm] = useState({
    title: "",
    date: "",
    time: "",
    auditoriumId: "",
    faculty: "",
    club: "",
    description: ""
  });

  const [auditoriums, setAuditoriums] = useState<Auditorium[]>([
    {
      id: "a1",
      name: "Auditorium A",
      location: "Main Building, First Floor",
      capacity: 300,
      hasWhiteboard: true,
      status: "available",
      amenities: ["Projector", "Sound System", "Stage Lighting", "Backstage Area"]
    },
    {
      id: "a2",
      name: "Auditorium B",
      location: "Science Block, Ground Floor",
      capacity: 200,
      hasWhiteboard: true,
      status: "renovation",
      statusNote: "Under renovation until April 15, 2025",
      amenities: ["Projector", "Sound System", "Interactive Display"]
    },
    {
      id: "a3",
      name: "Auditorium C",
      location: "Arts Wing, Second Floor",
      capacity: 150,
      hasWhiteboard: false,
      status: "available",
      amenities: ["Projector", "Piano", "Art Display Areas"]
    },
    {
      id: "a4",
      name: "Auditorium D",
      location: "Technology Building, Basement",
      capacity: 250,
      hasWhiteboard: true,
      status: "repair",
      statusNote: "AC repairs ongoing, expected completion on April 10, 2025",
      amenities: ["Advanced AV System", "Recording Equipment", "Video Conferencing"]
    }
  ]);

  // Generate dates for the next 7 days
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  const [events, setEvents] = useState<Event[]>([
    {
      id: "e1",
      title: "Annual Drama Festival",
      date: "2025-04-08",
      time: "15:00-18:00",
      auditoriumId: "a1",
      faculty: "Arts Department",
      club: "Drama Club",
      status: "approved",
      description: "Annual school drama festival featuring performances from all grades."
    },
    {
      id: "e2",
      title: "Science Exhibition",
      date: "2025-04-10",
      time: "10:00-14:00",
      auditoriumId: "a3",
      faculty: "Science Department",
      status: "approved",
      description: "Exhibition of student science projects and innovations."
    },
    {
      id: "e3",
      title: "AI Workshop",
      date: "2025-04-07",
      time: "13:00-16:00",
      auditoriumId: "a1",
      faculty: "Computer Science",
      club: "AI Club",
      status: "approved",
      description: "Machine learning workshop for senior students."
    },
    {
      id: "e4",
      title: "Photography Exhibition",
      date: "2025-04-11",
      time: "09:00-17:00",
      auditoriumId: "a3",
      faculty: "Visual Arts",
      club: "Photography Club",
      status: "pending",
      description: "Annual photography showcase by the photography club."
    },
    {
      id: "e5",
      title: "IoT Project Demos",
      date: "2025-04-09",
      time: "14:00-17:00",
      auditoriumId: "a1",
      faculty: "Engineering Department",
      club: "IoT Club",
      status: "approved",
      description: "Demonstrations of student IoT projects."
    }
  ]);

  // Generate availability slots based on auditoriums and next 7 days
  const generateAvailabilitySlots = () => {
    const slots: BookingSlot[] = [];
    const timeSlots = ["09:00-12:00", "13:00-16:00", "16:30-19:30"];
    
    auditoriums.forEach(auditorium => {
      next7Days.forEach(date => {
        timeSlots.forEach((timeSlot, index) => {
          // Randomly set some slots as unavailable for demo
          const isAvailable = auditorium.status === "available" && Math.random() > 0.3;
          slots.push({
            id: `${auditorium.id}-${date}-${index}`,
            auditoriumId: auditorium.id,
            date,
            timeSlot,
            isAvailable
          });
        });
      });
    });
    
    return slots;
  };

  const [availabilitySlots, setAvailabilitySlots] = useState<BookingSlot[]>(generateAvailabilitySlots());

  // Event handlers
  const handleAuditoriumFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setAuditoriumForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setAuditoriumForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setAuditoriumForm(prev => ({
        ...prev,
        amenities: [...prev.amenities, value]
      }));
    } else {
      setAuditoriumForm(prev => ({
        ...prev,
        amenities: prev.amenities.filter(amenity => amenity !== value)
      }));
    }
  };

  const handleAddAuditorium = (e: React.FormEvent) => {
    e.preventDefault();
    const newAuditorium: Auditorium = {
      id: `a${auditoriums.length + 1}`,
      ...auditoriumForm
    };
    
    setAuditoriums(prev => [...prev, newAuditorium]);
    setAuditoriumForm({
      name: "",
      location: "",
      capacity: 0,
      hasWhiteboard: false,
      status: "available",
      amenities: []
    });

    alert("Auditorium added successfully!");
  };

  const handleAuditoriumDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this auditorium?")) {
      setAuditoriums(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleStatusChange = (id: string) => {
    const auditorium = auditoriums.find(a => a.id === id);
    if (auditorium) {
      let newStatus: Auditorium["status"] = "available";
      
      if (auditorium.status === "available") newStatus = "maintenance";
      else if (auditorium.status === "maintenance") newStatus = "repair";
      else if (auditorium.status === "repair") newStatus = "renovation";
      else if (auditorium.status === "renovation") newStatus = "available";
      
      setAuditoriums(prev => prev.map(a => 
        a.id === id ? { ...a, status: newStatus } : a
      ));
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: Event = {
      id: `e${events.length + 1}`,
      ...bookingForm,
      status: "pending"
    };
    
    setEvents(prev => [...prev, newEvent]);
    setBookingForm({
      title: "",
      date: "",
      time: "",
      auditoriumId: "",
      faculty: "",
      club: "",
      description: ""
    });
    
    alert("Booking added successfully!");
  };

  const handleBookingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEventDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleEventStatusChange = (id: string, newStatus: Event["status"]) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === id ? { ...event, status: newStatus } : event
      )
    );
  };

  // Filter events for a specific auditorium
  const getAuditoriumEvents = (auditoriumId: string) => {
    return events.filter(event => event.auditoriumId === auditoriumId);
  };

  // Filter availability slots for selected date range and auditorium
  const getAuditoriumAvailability = (auditoriumId: string) => {
    return availabilitySlots.filter(slot => slot.auditoriumId === auditoriumId);
  };

  // Get status color class
  const getStatusColorClass = (status: Auditorium["status"]) => {
    switch (status) {
      case "available": return "bg-green-900 text-green-300";
      case "renovation": return "bg-purple-900 text-purple-300";
      case "repair": return "bg-red-900 text-red-300";
      case "maintenance": return "bg-yellow-900 text-yellow-300";
      default: return "bg-gray-900 text-gray-300";
    }
  };

  // Get event status color class
  const getEventStatusColorClass = (status: Event["status"]) => {
    switch (status) {
      case "approved": return "bg-green-900 text-green-300";
      case "pending": return "bg-yellow-900 text-yellow-300";
      case "rejected": return "bg-red-900 text-red-300";
      case "completed": return "bg-gray-600 text-gray-300";
      default: return "bg-gray-900 text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <AdminSidebar />
      
      <div className="ml-16 p-6">
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-700">
          <h1 className="text-2xl font-bold text-gray-100 mb-4">Auditorium Management (Admin)</h1>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-6 overflow-x-auto">
            <button 
              className={`px-4 py-2 font-medium ${activeTab === "list" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-gray-200"}`}
              onClick={() => setActiveTab("list")}
            >
              Auditoriums List
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === "add" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-gray-200"}`}
              onClick={() => setActiveTab("add")}
            >
              Add New Auditorium
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === "bookings" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-gray-200"}`}
              onClick={() => setActiveTab("bookings")}
            >
              Manage Bookings
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === "availability" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-gray-200"}`}
              onClick={() => setActiveTab("availability")}
            >
              Availability Overview
            </button>
          </div>
          
          {/* Auditoriums List Tab */}
          {activeTab === "list" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-200">All Auditoriums</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {auditoriums.map(auditorium => (
                  <div key={auditorium.id} className="border border-gray-700 rounded-lg p-5 bg-gray-750">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-xl text-gray-200">{auditorium.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColorClass(auditorium.status)}`}>
                        {auditorium.status.charAt(0).toUpperCase() + auditorium.status.slice(1)}
                      </span>
                    </div>
                    
                    {auditorium.statusNote && (
                      <div className="mb-3 p-2 bg-gray-800 border-l-4 border-yellow-500 text-sm">
                        {auditorium.statusNote}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-sm text-gray-400">Location</p>
                        <p className="text-gray-300">{auditorium.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Capacity</p>
                        <p className="text-gray-300">{auditorium.capacity} people</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-400">Amenities</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {auditorium.hasWhiteboard && (
                          <span className="bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded">Whiteboard</span>
                        )}
                        {auditorium.amenities.map((amenity, index) => (
                          <span key={index} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">{amenity}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <button 
                        onClick={() => {
                          setSelectedAuditorium(auditorium.id);
                          setActiveTab("bookings");
                        }}
                        className="bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700"
                      >
                        View Bookings
                      </button>
                      <button 
                        onClick={() => handleStatusChange(auditorium.id)}
                        className="bg-yellow-600 text-white py-1 px-3 rounded text-sm hover:bg-yellow-700"
                      >
                        Change Status
                      </button>
                      <button 
                        onClick={() => handleAuditoriumDelete(auditorium.id)}
                        className="bg-red-600 text-white py-1 px-3 rounded text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Add New Auditorium Tab */}
          {activeTab === "add" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-200">Add New Auditorium</h2>
              <form onSubmit={handleAddAuditorium} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Auditorium Name</label>
                    <input
                      type="text"
                      name="name"
                      value={auditoriumForm.name}
                      onChange={handleAuditoriumFormChange}
                      className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={auditoriumForm.location}
                      onChange={handleAuditoriumFormChange}
                      className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                      required
                      placeholder="Building, Floor"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      value={auditoriumForm.capacity}
                      onChange={handleAuditoriumFormChange}
                      className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                    <select
                      name="status"
                      value={auditoriumForm.status}
                      onChange={handleAuditoriumFormChange}
                      className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                      required
                    >
                      <option value="available">Available</option>
                      <option value="renovation">Under Renovation</option>
                      <option value="repair">Under Repair</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
                
                {auditoriumForm.status !== "available" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Status Note</label>
                    <input
                      type="text"
                      name="statusNote"
                      value={auditoriumForm.statusNote || ""}
                      onChange={handleAuditoriumFormChange}
                      className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                      placeholder="Provide details about status (e.g., duration of renovation)"
                    />
                  </div>
                )}
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="hasWhiteboard"
                      checked={auditoriumForm.hasWhiteboard}
                      onChange={handleAuditoriumFormChange}
                      className="mr-2"
                    />
                    <span className="text-gray-300">Has Whiteboard</span>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Amenities</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {["Projector", "Sound System", "Stage Lighting", "Interactive Display", "Recording Equipment", "Video Conferencing", "Backstage Area", "Piano", "Art Display Areas", "Advanced AV System"].map((amenity) => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          value={amenity}
                          checked={auditoriumForm.amenities.includes(amenity)}
                          onChange={handleAmenityChange}
                          className="mr-2"
                        />
                        <span className="text-gray-300 text-sm">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Auditorium
                </button>
              </form>
            </div>
          )}
          
          {/* Manage Bookings Tab */}
          {activeTab === "bookings" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-200">
                  {selectedAuditorium 
                    ? `Bookings for ${auditoriums.find(a => a.id === selectedAuditorium)?.name}` 
                    : "All Bookings"}
                </h2>
                
                {selectedAuditorium && (
                  <button 
                    onClick={() => setSelectedAuditorium(null)}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    View All Bookings
                  </button>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 text-gray-200">Add New Booking</h3>
                <form onSubmit={handleBookingSubmit} className="space-y-4 bg-gray-750 p-4 rounded-lg border border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Event Title</label>
                      <input
                        type="text"
                        name="title"
                        value={bookingForm.title}
                        onChange={handleBookingInputChange}
                        className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Auditorium</label>
                      <select
                        name="auditoriumId"
                        value={bookingForm.auditoriumId}
                        onChange={handleBookingInputChange}
                        className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                        required
                      >
                        <option value="">Select Auditorium</option>
                        {auditoriums
                          .filter(a => a.status === "available")
                          .map(auditorium => (
                            <option key={auditorium.id} value={auditorium.id}>
                              {auditorium.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={bookingForm.date}
                        onChange={handleBookingInputChange}
                        className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Time Slot</label>
                      <select
                        name="time"
                        value={bookingForm.time}
                        onChange={handleBookingInputChange}
                        className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                        required
                      >
                        <option value="">Select time slot</option>
                        <option value="09:00-12:00">09:00 - 12:00</option>
                        <option value="13:00-16:00">13:00 - 16:00</option>
                        <option value="16:30-19:30">16:30 - 19:30</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Faculty</label>
                      <input
                        type="text"
                        name="faculty"
                        value={bookingForm.faculty}
                        onChange={handleBookingInputChange}
                        className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Club (if applicable)</label>
                      <input
                        type="text"
                        name="club"
                        value={bookingForm.club}
                        onChange={handleBookingInputChange}
                        className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                        placeholder="e.g., Photography, IoT, Drama"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                      <textarea
                        name="description"
                        value={bookingForm.description}
                        onChange={handleBookingInputChange}
                        className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                        rows={1}
                        required
                      ></textarea>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add Booking
                  </button>
                </form>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-200">Current Bookings</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-800 border border-gray-700">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="py-3 px-4 text-left border-b border-gray-600 text-gray-300">Event Title</th>
                        <th className="py-3 px-4 text-left border-b border-gray-600 text-gray-300">Auditorium</th>
                        <th className="py-3 px-4 text-left border-b border-gray-600 text-gray-300">Date & Time</th>
                        <th className="py-3 px-4 text-left border-b border-gray-600 text-gray-300">Faculty/Club</th>
                        <th className="py-3 px-4 text-left border-b border-gray-600 text-gray-300">Status</th>
                        <th className="py-3 px-4 text-left border-b border-gray-600 text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events
                        .filter(event => !selectedAuditorium || event.auditoriumId === selectedAuditorium)
                        .map(event => (
                          <tr key={event.id} className="hover:bg-gray-750">
                            <td className="py-3 px-4 border-b border-gray-700 text-gray-300">
                              {event.title}
                              <div className="text-xs text-gray-400 mt-1">{event.description}</div>
                            </td>
                            <td className="py-3 px-4 border-b border-gray-700 text-gray-300">
                              {auditoriums.find(a => a.id === event.auditoriumId)?.name}
                            </td>
                            <td className="py-3 px-4 border-b border-gray-700 text-gray-300">
                              {event.date}<br/>{event.time}
                            </td>
                            <td className="py-3 px-4 border-b border-gray-700 text-gray-300">
                              {event.faculty}
                              {event.club && <div className="text-xs text-blue-400 mt-1">{event.club} Club</div>}
                            </td>
                            <td className="py-3 px-4 border-b border-gray-700 text-gray-300">
                              <span className={`px-2 py-1 text-xs rounded-full ${getEventStatusColorClass(event.status)}`}>
                                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4 border-b border-gray-700 text-gray-300">
                              <div className="flex gap-2">
                                {event.status === "pending" && (
                                  <>
                                    <button 
                                      onClick={() => handleEventStatusChange(event.id, "approved")}
                                      className="bg-green-600 text-white py-1 px-2 rounded text-xs hover:bg-green-700"
                                    >
                                      Approve
                                    </button>
                                    <button 
                                      onClick={() => handleEventStatusChange(event.id, "rejected")}
                                      className="bg-red-600 text-white py-1 px-2 rounded text-xs hover:bg-red-700"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                                <button 
                                  onClick={() => handleEventDelete(event.id)}
                                  className="bg-gray-600 text-white py-1 px-2 rounded text-xs hover:bg-gray-700"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* Availability Overview Tab */}
          {activeTab === "availability" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-200">Availability Overview</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Select Auditorium</label>
                <select
                  value={selectedAuditorium || ""}
                  onChange={(e) => setSelectedAuditorium(e.target.value || null)}
                  className="w-full md:w-1/2 p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                >
                  <option value="">All Auditoriums</option>
                  {auditoriums.map(auditorium => (
                    <option key={auditorium.id} value={auditorium.id}>{auditorium.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="overflow-x-auto bg-gray-750 rounded-lg border border-gray-700">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="py-3 px-4 text-left border-b border-gray-600 text-gray-300">Auditorium</th>
                      {next7Days.map((date, idx) => (
                        <th key={idx} className="py-3 px-4 text-center border-b border-gray-600 text-gray-300">
                          {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {auditoriums
                      .filter(a => !selectedAuditorium || a.id === selectedAuditorium)
                      .map(auditorium => (
                        <React.Fragment key={auditorium.id}>
                          {["09:00-12:00", "13:00-16:00", "16:30-19:30"].map((timeSlot, idx) => (
                            <tr key={`${auditorium.id}-${timeSlot}`} className="hover:bg-gray-800">
                              <td className="py-3 px-4 border-b border-gray-700 text-gray-300">
                                {idx === 1 && (
                                  <span className="font-medium">{auditorium.name}</span>
                                )}
                                {idx !== 1 && <span>&nbsp;</span>}
                                <div className="text-xs text-gray-400">{timeSlot}</div>
                              </td>
                              
                              {next7Days.map((date, dateIdx) => {
                                const slot = availabilitySlots.find(
                                  s => s.auditoriumId === auditorium.id && s.date === date && s.timeSlot === timeSlot
                                );
                                
                                const event = events.find(
                                  e => e.auditoriumId === auditorium.id && e.date === date && e.time === timeSlot && e.status !== "rejected"
                                );
                                
                                return (
                                  <td key={dateIdx} className="py-3 px-4 border-b border-gray-700 text-center">
                                    {auditorium.status !== "available" ? (
                                      <span className="text-yellow-500 text-sm">Not Available</span>
                                    ) : event ? (
                                      <div>
                                        <span className="text-blue-400 text-sm">{event.title}</span>
                                        <div className="text-xs text-gray-400">{event.faculty}</div>
                                      </div>
                                    ) : slot?.isAvailable ? (
                                      <span className="text-green-400 text-sm">Available</span>
                                    ) : (
                                      <span className="text-gray-500 text-sm">Blocked</span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAuditoriumPage;