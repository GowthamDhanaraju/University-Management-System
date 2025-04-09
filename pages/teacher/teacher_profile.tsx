import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import TeacherSidebar from "@/components/teacher_sidebar";
import TopBar from "@/components/topbar";
import { Typography } from "@mui/material";
import { FiUser } from "react-icons/fi";

const TeacherProfile: React.FC = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  
  // Teacher profile data
  const [profileData, setProfileData] = useState({
    personal: {
      name: "Dr. Ramesh Kumar",
      photo: "", // URL for photo
      dob: "1978-05-15",
      gender: "Male",
      facultyId: "CSE-2145",
      joinDate: "2010-07-01"
    },
    contact: {
      email: "ramesh.kumar@university.edu",
      phone: "+91 9876543210",
      address: "123 Faculty Housing, University Campus, Bangalore - 560001"
    },
    professional: {
      department: "Computer Science",
      designation: "Associate Professor",
      specialization: "Machine Learning, Algorithms",
      officeHours: "Mon, Wed: 2PM - 4PM | Tue, Thu: 10AM - 12PM"
    }
  });
  
  // Create a copy for editing
  const [editData, setEditData] = useState({...profileData});
  
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole !== "teacher") router.push("/");
  }, [router]);
  
  const handleEdit = () => {
    setEditData({...profileData});
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const handleSave = () => {
    setProfileData({...editData});
    setIsEditing(false);
    // Here you would typically send data to backend
  };
  
  const handleInputChange = (section: keyof typeof profileData, field: string, value: string) => {
    setEditData({
      ...editData,
      [section]: {
        ...editData[section],
        [field]: value
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-200">
      <TeacherSidebar />
      <div className="flex-1 p-6 ml-16">
        <TopBar />
        <div className="flex items-center justify-between mb-8 ml-6 mr-6">
          <div className="flex items-center">
            <div className="p-3 mr-4 bg-blue-500 rounded-xl shadow-lg">
              <FiUser className="text-gray-100 text-2xl" />
            </div>
            <Typography 
              variant="h4" 
              component="h1" 
              className="font-bold bg-blue-500 bg-clip-text text-transparent"
            >
              Teacher Profile
            </Typography>
          </div>
          {!isEditing ? (
            <button 
              onClick={handleEdit}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Edit Profile
            </button>
          ) : (
            <div className="space-x-2">
              <button 
                onClick={handleSave}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                Save Changes
              </button>
              <button 
                onClick={handleCancel}
                className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Profile Header */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-4 border border-gray-700 flex flex-wrap gap-6 ml-6">
          <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold">
            {profileData.personal.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold">{profileData.personal.name}</h2>
            <p className="text-xl text-blue-400">{profileData.professional.designation}</p>
            <p className="text-gray-400">{profileData.professional.department}</p>
            <div className="mt-2 flex gap-4">
              <div className="px-3 py-1 rounded-full bg-gray-700 text-sm">Faculty ID: {profileData.personal.facultyId}</div>
              <div className="px-3 py-1 rounded-full bg-gray-700 text-sm">Joined: {new Date(profileData.personal.joinDate).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-6 border border-gray-700 ml-6">
          <h3 className="text-xl font-bold mb-4 text-blue-400">Personal Information</h3>
          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Full Name</p>
                <p>{profileData.personal.name}</p>
              </div>
              <div>
                <p className="text-gray-400">Date of Birth</p>
                <p>{new Date(profileData.personal.dob).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Gender</p>
                <p>{profileData.personal.gender}</p>
              </div>
              <div>
                <p className="text-gray-400">Faculty ID</p>
                <p>{profileData.personal.facultyId}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editData.personal.name} 
                  onChange={(e) => handleInputChange('personal', 'name', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Date of Birth</label>
                <input 
                  type="date" 
                  value={editData.personal.dob} 
                  onChange={(e) => handleInputChange('personal', 'dob', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Gender</label>
                <select 
                  value={editData.personal.gender} 
                  onChange={(e) => handleInputChange('personal', 'gender', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Faculty ID</label>
                <input 
                  type="text" 
                  value={editData.personal.facultyId} 
                  onChange={(e) => handleInputChange('personal', 'facultyId', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-6 border border-gray-700 ml-6">
          <h3 className="text-xl font-bold mb-4 text-blue-400">Contact Information</h3>
          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Email</p>
                <p>{profileData.contact.email}</p>
              </div>
              <div>
                <p className="text-gray-400">Phone</p>
                <p>{profileData.contact.phone}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-400">Address</p>
                <p>{profileData.contact.address}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Email</label>
                <input 
                  type="email" 
                  value={editData.contact.email} 
                  onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Phone</label>
                <input 
                  type="text" 
                  value={editData.contact.phone} 
                  onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-400 mb-1">Address</label>
                <textarea 
                  value={editData.contact.address} 
                  onChange={(e) => handleInputChange('contact', 'address', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Professional Information */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-6 border border-gray-700 ml-6">
          <h3 className="text-xl font-bold mb-4 text-blue-400">Professional Information</h3>
          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Department</p>
                <p>{profileData.professional.department}</p>
              </div>
              <div>
                <p className="text-gray-400">Designation</p>
                <p>{profileData.professional.designation}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-400">Specialization</p>
                <p>{profileData.professional.specialization}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-400">Office Hours</p>
                <p>{profileData.professional.officeHours}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Department</label>
                <input 
                  type="text" 
                  value={editData.professional.department} 
                  onChange={(e) => handleInputChange('professional', 'department', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Designation</label>
                <input 
                  type="text" 
                  value={editData.professional.designation} 
                  onChange={(e) => handleInputChange('professional', 'designation', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-400 mb-1">Specialization</label>
                <input 
                  type="text" 
                  value={editData.professional.specialization} 
                  onChange={(e) => handleInputChange('professional', 'specialization', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-400 mb-1">Office Hours</label>
                <input 
                  type="text" 
                  value={editData.professional.officeHours} 
                  onChange={(e) => handleInputChange('professional', 'officeHours', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;