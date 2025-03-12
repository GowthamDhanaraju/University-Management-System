import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import StudentSidebar from "@/components/student_sidebar";

const StudentProfile: React.FC = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  
  // Student profile data
  const [profileData, setProfileData] = useState({
    personal: {
      name: "Vyshnav Kumar S",
      photo: "", // URL for photo
      dob: "2003-08-15",
      gender: "Male",
      studentId: "CSE-2145",
      joinYear: "2022",
      bloodGroup: "O+",
      nationality: "Indian"
    },
    contact: {
      email: "vyshnav.kumar@university.edu",
      phone: "+91 9876543210",
      address: "H-234 Student Hostel, University Campus, Bangalore - 560001",
      emergencyContact: "Rajesh Kumar (Father): +91 9876543211"
    },
    academic: {
      department: "Computer Science and Engineering",
      year: "3rd Year",
      semester: "5",
      cgpa: "8.7",
      attendance: "92%",
      advisor: "Prof. Anil Kumar"
    }
  });
  
  // Create a copy for editing
  const [editData, setEditData] = useState({...profileData});
  
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole !== "student") router.push("/");
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
      <StudentSidebar />
      <div className="flex-1 ml-16 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Student Profile</h1>
          {!isEditing ? (
            <button 
              onClick={handleEdit}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
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
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-4 border border-gray-700 flex flex-wrap gap-6">
          <div className="w-32 h-32 rounded-full bg-green-600 flex items-center justify-center text-4xl font-bold">
            {profileData.personal.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold">{profileData.personal.name}</h2>
            <p className="text-xl text-green-400">{profileData.academic.department}</p>
            <p className="text-gray-400">{profileData.academic.year}, {profileData.academic.semester} Semester</p>
            <div className="mt-2 flex gap-4 flex-wrap">
              <div className="px-3 py-1 rounded-full bg-gray-700 text-sm">Student ID: {profileData.personal.studentId}</div>
              <div className="px-3 py-1 rounded-full bg-gray-700 text-sm">CGPA: {profileData.academic.cgpa}</div>
              <div className="px-3 py-1 rounded-full bg-gray-700 text-sm">Attendance: {profileData.academic.attendance}</div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-green-400">Personal Information</h3>
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
                <p className="text-gray-400">Student ID</p>
                <p>{profileData.personal.studentId}</p>
              </div>
              <div>
                <p className="text-gray-400">Blood Group</p>
                <p>{profileData.personal.bloodGroup}</p>
              </div>
              <div>
                <p className="text-gray-400">Nationality</p>
                <p>{profileData.personal.nationality}</p>
              </div>
              <div>
                <p className="text-gray-400">Join Year</p>
                <p>{profileData.personal.joinYear}</p>
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
                <label className="block text-gray-400 mb-1">Student ID</label>
                <input 
                  type="text" 
                  value={editData.personal.studentId} 
                  onChange={(e) => handleInputChange('personal', 'studentId', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Blood Group</label>
                <select 
                  value={editData.personal.bloodGroup} 
                  onChange={(e) => handleInputChange('personal', 'bloodGroup', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Nationality</label>
                <input 
                  type="text" 
                  value={editData.personal.nationality} 
                  onChange={(e) => handleInputChange('personal', 'nationality', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Join Year</label>
                <input 
                  type="text" 
                  value={editData.personal.joinYear} 
                  onChange={(e) => handleInputChange('personal', 'joinYear', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                  readOnly
                />
              </div>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-green-400">Contact Information</h3>
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
              <div className="md:col-span-2">
                <p className="text-gray-400">Emergency Contact</p>
                <p>{profileData.contact.emergencyContact}</p>
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
                  rows={2}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-400 mb-1">Emergency Contact</label>
                <textarea 
                  value={editData.contact.emergencyContact} 
                  onChange={(e) => handleInputChange('contact', 'emergencyContact', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                  rows={2}
                />
              </div>
            </div>
          )}
        </div>

        {/* Academic Information */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-6 border border-gray-700 mb-6">
          <h3 className="text-xl font-bold mb-4 text-green-400">Academic Information</h3>
          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Department</p>
                <p>{profileData.academic.department}</p>
              </div>
              <div>
                <p className="text-gray-400">Current Year</p>
                <p>{profileData.academic.year}</p>
              </div>
              <div>
                <p className="text-gray-400">Current Semester</p>
                <p>{profileData.academic.semester}</p>
              </div>
              <div>
                <p className="text-gray-400">CGPA</p>
                <p>{profileData.academic.cgpa}</p>
              </div>
              <div>
                <p className="text-gray-400">Attendance</p>
                <p>{profileData.academic.attendance}</p>
              </div>
              <div>
                <p className="text-gray-400">Faculty Advisor</p>
                <p>{profileData.academic.advisor}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Department</label>
                <input 
                  type="text" 
                  value={editData.academic.department} 
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Department cannot be changed</p>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Current Year</label>
                <input 
                  type="text" 
                  value={editData.academic.year} 
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Year is updated by the system</p>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Current Semester</label>
                <input 
                  type="text" 
                  value={editData.academic.semester} 
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Semester is updated by the system</p>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">CGPA</label>
                <input 
                  type="text" 
                  value={editData.academic.cgpa} 
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">CGPA is calculated by the system</p>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Attendance</label>
                <input 
                  type="text" 
                  value={editData.academic.attendance} 
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Attendance is tracked by the system</p>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Faculty Advisor</label>
                <input 
                  type="text" 
                  value={editData.academic.advisor} 
                  className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Advisor is assigned by the department</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;