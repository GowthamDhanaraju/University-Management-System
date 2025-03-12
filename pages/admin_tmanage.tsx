import React, { useState } from "react";
import AdminSidebar from "@/components/admin_sidebar";

const TeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState([
    { name: "Dr. Rajesh Sharma", id: "PHY101", dept: "Physics", subjects: "Quantum Mechanics, Thermodynamics", email: "rajesh.sharma@example.com", phone: "+91 9876543210" },
    { name: "Prof. Ananya Iyer", id: "CSE202", dept: "Computer Science", subjects: "Artificial Intelligence, Data Structures", email: "ananya.iyer@example.com", phone: "+91 8765432109" },
    { name: "Dr. Vikram Patel", id: "MATH303", dept: "Mathematics", subjects: "Linear Algebra, Probability", email: "vikram.patel@example.com", phone: "+91 7654321098" },
    { name: "Prof. Sushmita Banerjee", id: "ENG404", dept: "English", subjects: "Literature, Creative Writing", email: "sushmita.banerjee@example.com", phone: "+91 6543210987" },
    { name: "Dr. Arvind Kumar", id: "MECH505", dept: "Mechanical", subjects: "Fluid Mechanics, Robotics", email: "arvind.kumar@example.com", phone: "+91 5432109876" }
  ]);

  const [newTeacher, setNewTeacher] = useState({ name: "", id: "", dept: "", subjects: "", email: "", phone: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTeacher({ ...newTeacher, [e.target.name]: e.target.value });
  };

  const addTeacher = () => {
    if (Object.values(newTeacher).every(val => val.trim() !== "")) {
      setTeachers([...teachers, newTeacher]);
      setNewTeacher({ name: "", id: "", dept: "", subjects: "", email: "", phone: "" });
    } else {
      alert("Please fill in all fields.");
    }
  };

  const deleteTeacher = (index: number) => {
    setTeachers(teachers.filter((_, i) => i !== index));
  };

  return (
    <div className="flex bg-gray-900 min-h-screen">
      <AdminSidebar />
      <div className="ml-16 p-6 w-full text-gray-200">
        <h1 className="text-2xl font-bold text-white">Teacher Management</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100">Add Teacher</h3>
          <div className="grid grid-cols-3 gap-4 mt-3">
            {Object.keys(newTeacher).map((key) => (
              <input
                key={key}
                type="text"
                name={key}
                value={(newTeacher as any)[key]}
                onChange={handleInputChange}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                className="bg-gray-700 border border-gray-600 p-2 rounded text-white placeholder-gray-400"
              />
            ))}
          </div>
          <button onClick={addTeacher} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Add Teacher
          </button>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100">Faculty Information</h3>
          <table className="w-full border-collapse mt-4">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="p-2 border-b border-gray-600">Name</th>
                <th className="p-2 border-b border-gray-600">ID</th>
                <th className="p-2 border-b border-gray-600">Department</th>
                <th className="p-2 border-b border-gray-600">Subjects</th>
                <th className="p-2 border-b border-gray-600">Email</th>
                <th className="p-2 border-b border-gray-600">Phone</th>
                <th className="p-2 border-b border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="p-2">{teacher.name}</td>
                  <td className="p-2">{teacher.id}</td>
                  <td className="p-2">{teacher.dept}</td>
                  <td className="p-2">{teacher.subjects}</td>
                  <td className="p-2">{teacher.email}</td>
                  <td className="p-2">{teacher.phone}</td>
                  <td className="p-2">
                    <button onClick={() => deleteTeacher(index)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherManagement;
