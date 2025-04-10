import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin_sidebar";
import TopBar from "@/components/topbar";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { Typography } from "@mui/material";

interface Auditorium {
  id: string;
  name: string;
  location: string;
  capacity: number;
  hasWhiteboard: boolean;
  status: "available" | "maintenance" | "renovation" | "occupied";
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
  description: string;
  status: "pending" | "approved" | "rejected" | "completed";
}

const AdminAuditoriumPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"list" | "add" | "bookings" | "availability">("list");
  const [selectedAuditorium, setSelectedAuditorium] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Data states
  const [auditoriums, setAuditoriums] = useState<Auditorium[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

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

  // Fetch auditoriums and events data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch auditoriums
        const audResponse = await fetch('/api/admin/auditoriums');
        const audData = await audResponse.json();
        setAuditoriums(audData);

        // Fetch events/bookings
        const eventsResponse = await fetch('/api/admin/auditorium-events');
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching auditorium data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAuditoriumFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setAuditoriumForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setAuditoriumForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setAuditoriumForm(prev => {
      if (checked) {
        return { ...prev, amenities: [...prev.amenities, value] };
      } else {
        return { ...prev, amenities: prev.amenities.filter(a => a !== value) };
      }
    });
  };

  const handleAddAuditorium = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/admin/auditoriums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(auditoriumForm),
      });

      if (!response.ok) {
        throw new Error('Failed to add auditorium');
      }

      const newAuditorium = await response.json();

      // Update local state
      setAuditoriums(prev => [...prev, newAuditorium]);

      // Reset form
      setAuditoriumForm({
        name: "",
        location: "",
        capacity: 0,
        hasWhiteboard: false,
        status: "available",
        amenities: []
      });

      // Switch to list view
      setActiveTab("list");

      alert('Auditorium added successfully!');
    } catch (error) {
      console.error('Error adding auditorium:', error);
      alert('Failed to add auditorium. Please try again.');
    }
  };

  const handleAuditoriumDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this auditorium?")) {
      try {
        await fetch(`/api/admin/auditoriums/${id}`, {
          method: 'DELETE',
        });

        // Update local state
        setAuditoriums(prev => prev.filter(a => a.id !== id));

        alert('Auditorium deleted successfully!');
      } catch (error) {
        console.error('Error deleting auditorium:', error);
        alert('Failed to delete auditorium. Please try again.');
      }
    }
  };

  const handleStatusChange = async (id: string) => {
    const auditorium = auditoriums.find(a => a.id === id);
    if (!auditorium) return;

    const newStatus = prompt("Enter new status (available, maintenance, renovation, occupied)", auditorium.status);
    if (!newStatus) return;

    if (!["available", "maintenance", "renovation", "occupied"].includes(newStatus)) {
      alert("Invalid status. Status must be one of: available, maintenance, renovation, occupied");
      return;
    }

    let statusNote = "";
    if (newStatus !== "available") {
      statusNote = prompt("Enter status note (e.g., duration of renovation)") || "";
    }

    try {
      await fetch(`/api/admin/auditoriums/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, statusNote }),
      });

      // Update local state
      setAuditoriums(prev => prev.map(a => 
        a.id === id ? { ...a, status: newStatus as any, statusNote } : a
      ));

      alert('Status updated successfully!');
    } catch (error) {
      console.error('Error updating auditorium status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleBookingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/admin/auditorium-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingForm,
          status: "pending"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add booking');
      }

      const newEvent = await response.json();

      // Update local state
      setEvents(prev => [...prev, newEvent]);

      // Reset form
      setBookingForm({
        title: "",
        date: "",
        time: "",
        auditoriumId: "",
        faculty: "",
        club: "",
        description: ""
      });

      alert('Booking added successfully!');
    } catch (error) {
      console.error('Error adding booking:', error);
      alert('Failed to add booking. Please try again.');
    }
  };

  const handleEventStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/admin/auditorium-events/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      // Update local state
      setEvents(prev => prev.map(event => 
        event.id === id ? { ...event, status: newStatus as any } : event
      ));

      alert(`Event ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating event status:', error);
      alert('Failed to update event status. Please try again.');
    }
  };

  const handleEventDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await fetch(`/api/admin/auditorium-events/${id}`, {
          method: 'DELETE',
        });

        // Update local state
        setEvents(prev => prev.filter(e => e.id !== id));

        alert('Event deleted successfully!');
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  // Helper functions for styling
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "available": return "bg-green-900 text-green-300";
      case "maintenance": return "bg-yellow-900 text-yellow-300";
      case "renovation": return "bg-purple-900 text-purple-300";
      case "occupied": return "bg-red-900 text-red-300";
      default: return "bg-gray-900 text-gray-300";
    }
  };

  const getEventStatusColorClass = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-900 text-green-300";
      case "pending": return "bg-yellow-900 text-yellow-300";
      case "rejected": return "bg-red-900 text-red-300";
      case "completed": return "bg-gray-600 text-gray-300";
      default: return "bg-gray-900 text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200">
        <AdminSidebar />
        <div className="ml-16 p-6 flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-xl">Loading auditorium data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <AdminSidebar />
      <div className="flex-1 p-6 ml-16">
        <TopBar />
        <div className="flex items-center space-x-4 ml-6">
          <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
            <BuildingOfficeIcon className="w-8 h-8" />
          </div>
          <Typography variant="h4" component="h1" className="font-bold bg-blue-500 bg-clip-text text-transparent">
            Auditorium Management
          </Typography>
        </div>
        <div className="ml-16 p-6">
          <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-700">
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
            {/* Content based on activeTab */}
            {/* Add your content here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuditoriumPage;