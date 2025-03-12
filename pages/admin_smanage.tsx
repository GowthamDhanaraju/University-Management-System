import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin_sidebar";

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState([
    { id: "ai.121", name: "Priya Sharma", dept: "CSE AI", year: "1st Year", gpa: "9.0", gradYear: "2027" },
    { id: "cs.101", name: "Arjun Patel", dept: "CSE", year: "2nd Year", gpa: "8.5", gradYear: "2026" },
    { id: "me.113", name: "Rohan Mehta", dept: "Mechanical", year: "3rd Year", gpa: "7.8", gradYear: "2025" },
    { id: "ee.204", name: "Neha Verma", dept: "Electronics", year: "4th Year", gpa: "8.2", gradYear: "2024" },
    { id: "ci.110", name: "Amit Gupta", dept: "Civil", year: "2nd Year", gpa: "7.5", gradYear: "2026" },
    { id: "eb.106", name: "Kavya Iyer", dept: "Biotech", year: "1st Year", gpa: "8.9", gradYear: "2027" },
    { id: "cs.137", name: "Raj Malhotra", dept: "CSE", year: "3rd Year", gpa: "8.7", gradYear: "2025" },
    { id: "it.108", name: "Ananya Reddy", dept: "IT", year: "4th Year", gpa: "9.1", gradYear: "2024" }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [newStudent, setNewStudent] = useState({ id: "", name: "", dept: "", year: "", gpa: "", gradYear: "" });
  const [editingStudent, setEditingStudent] = useState<{ index: number; data: typeof newStudent } | null>(null);
  const [uniqueYears, setUniqueYears] = useState<string[]>([]);
  const [uniqueDepts, setUniqueDepts] = useState<string[]>([]);

  useEffect(() => {
    // Extract unique years and departments for filter dropdowns
    setUniqueYears([...new Set(students.map(student => student.year))]);
    setUniqueDepts([...new Set(students.map(student => student.dept))]);
  }, [students]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleYearFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYearFilter(e.target.value);
  };

  const handleDeptFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDeptFilter(e.target.value);
  };

  const handleNewStudentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editingStudent) {
      setEditingStudent({
        ...editingStudent,
        data: { ...editingStudent.data, [e.target.name]: e.target.value }
      });
    } else {
      setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
    }
  };

  const addStudent = () => {
    if (editingStudent) {
      // Update existing student
      if (Object.values(editingStudent.data).every(val => val.trim() !== "")) {
        const updatedStudents = [...students];
        updatedStudents[editingStudent.index] = editingStudent.data;
        setStudents(updatedStudents);
        setEditingStudent(null);
      } else {
        alert("Please fill in all fields.");
      }
    } else {
      // Add new student
      if (Object.values(newStudent).every(val => val.trim() !== "")) {
        setStudents([...students, newStudent]);
        setNewStudent({ id: "", name: "", dept: "", year: "", gpa: "", gradYear: "" });
      } else {
        alert("Please fill in all fields.");
      }
    }
  };

  const startEditing = (index: number) => {
    setEditingStudent({
      index,
      data: { ...students[index] }
    });
    // Scroll to the edit form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingStudent(null);
  };

  const deleteStudent = (index: number) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  // Filter students based on search term, year, and department
  const filteredStudents = students.filter(student => {
    const matchesSearch = Object.values(student).some(value =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesYear = yearFilter ? student.year === yearFilter : true;
    const matchesDept = deptFilter ? student.dept === deptFilter : true;

    return matchesSearch && matchesYear && matchesDept;
  });

  return (
    <div className="flex bg-gray-900 min-h-screen">
      <AdminSidebar />
      <div className="ml-16 p-6 w-full text-gray-200">
        <h1 className="text-2xl font-bold text-white">Student Management</h1>

        {/* Add/Edit Student Form */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100">
            {editingStudent ? "Edit Student" : "Add New Student"}
          </h3>
          <div className="grid grid-cols-3 gap-4 mt-3">
            <input
              type="text"
              name="id"
              value={editingStudent ? editingStudent.data.id : newStudent.id}
              onChange={handleNewStudentChange}
              placeholder="Student ID"
              className="bg-gray-700 border border-gray-600 p-2 rounded text-white placeholder-gray-400"
            />
            <input
              type="text"
              name="name"
              value={editingStudent ? editingStudent.data.name : newStudent.name}
              onChange={handleNewStudentChange}
              placeholder="Full Name"
              className="bg-gray-700 border border-gray-600 p-2 rounded text-white placeholder-gray-400"
            />
            <select
              name="dept"
              value={editingStudent ? editingStudent.data.dept : newStudent.dept}
              onChange={handleNewStudentChange}
              className="bg-gray-700 border border-gray-600 p-2 rounded text-white"
            >
              <option value="">Select Department</option>
              {uniqueDepts.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              name="year"
              value={editingStudent ? editingStudent.data.year : newStudent.year}
              onChange={handleNewStudentChange}
              className="bg-gray-700 border border-gray-600 p-2 rounded text-white"
            >
              <option value="">Select Year</option>
              {uniqueYears.map((year, index) => (
                <option key={index} value={year}>{year}</option>
              ))}
            </select>
            <input
              type="text"
              name="gpa"
              value={editingStudent ? editingStudent.data.gpa : newStudent.gpa}
              onChange={handleNewStudentChange}
              placeholder="GPA"
              className="bg-gray-700 border border-gray-600 p-2 rounded text-white placeholder-gray-400"
            />
            <input
              type="text"
              name="gradYear"
              value={editingStudent ? editingStudent.data.gradYear : newStudent.gradYear}
              onChange={handleNewStudentChange}
              placeholder="Graduation Year"
              className="bg-gray-700 border border-gray-600 p-2 rounded text-white placeholder-gray-400"
            />
          </div>
          <div className="flex mt-4">
            <button 
              onClick={addStudent} 
              className={`${editingStudent ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white py-2 px-4 rounded mr-2`}
            >
              {editingStudent ? "Update Student" : "Add Student"}
            </button>
            {editingStudent && (
              <button 
                onClick={cancelEditing} 
                className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md mt-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100">Search & Filter</h3>
          <div className="grid grid-cols-3 gap-4 mt-3">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search students..."
              className="bg-gray-700 border border-gray-600 p-2 rounded text-white placeholder-gray-400"
            />
            <select
              value={yearFilter}
              onChange={handleYearFilter}
              className="bg-gray-700 border border-gray-600 p-2 rounded text-white"
            >
              <option value="">Filter by Year</option>
              {uniqueYears.map((year, index) => (
                <option key={index} value={year}>{year}</option>
              ))}
            </select>
            <select
              value={deptFilter}
              onChange={handleDeptFilter}
              className="bg-gray-700 border border-gray-600 p-2 rounded text-white"
            >
              <option value="">Filter by Department</option>
              {uniqueDepts.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Student Table */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100">Student Records</h3>
          <table className="w-full border-collapse mt-4">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="p-2 border-b border-gray-600">ID</th>
                <th className="p-2 border-b border-gray-600">Name</th>
                <th className="p-2 border-b border-gray-600">Department</th>
                <th className="p-2 border-b border-gray-600">Year</th>
                <th className="p-2 border-b border-gray-600">GPA</th>
                <th className="p-2 border-b border-gray-600">Graduation Year</th>
                <th className="p-2 border-b border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="p-2">{student.id}</td>
                    <td className="p-2">{student.name}</td>
                    <td className="p-2">{student.dept}</td>
                    <td className="p-2">{student.year}</td>
                    <td className="p-2">{student.gpa}</td>
                    <td className="p-2">{student.gradYear}</td>
                    <td className="p-2">
                      <button onClick={() => startEditing(index)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mr-2">
                        Edit
                      </button>
                      <button onClick={() => deleteStudent(index)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-400">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;
