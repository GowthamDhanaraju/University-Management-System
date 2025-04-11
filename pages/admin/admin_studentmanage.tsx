import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin_sidebar";
import TopBar from "@/components/topbar";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { Typography } from "@mui/material";

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [uniqueYears, setUniqueYears] = useState<string[]>([]);
  const [uniqueDepts, setUniqueDepts] = useState<string[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students');
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();

        if (data.success) {
          const deptResponse = await fetch('/api/departments');
          let departmentsMap = {};
          if (deptResponse.ok) {
            const deptData = await deptResponse.json();
            if (deptData.success && Array.isArray(deptData.data)) {
              departmentsMap = deptData.data.reduce((map, dept) => {
                map[dept.id] = dept.name;
                return map;
              }, {});
            }
          }

          const formattedStudents = data.data.map((student: any) => {
            // Get department name through multiple fallback options
            let departmentName = "Unassigned";
            
            // First try department object
            if (student.department && student.department.name) {
              departmentName = student.department.name;
            } 
            // Then try departmentId with map
            else if (student.departmentId && departmentsMap[student.departmentId]) {
              departmentName = departmentsMap[student.departmentId];
            }
            // If we have a department code directly, use that
            else if (student.departmentCode) {
              departmentName = student.departmentCode;
            }
            
            // Parse academicInfo - could be a string or object
            let academicInfo = {};
            if (typeof student.academicInfo === 'object' && student.academicInfo !== null) {
              academicInfo = student.academicInfo;
            } else if (typeof student.academicInfo === 'string') {
              try {
                academicInfo = JSON.parse(student.academicInfo);
              } catch (e) {
                console.warn("Could not parse academicInfo for student:", student.id);
              }
            }
            
            // Try to access GPA with multiple fallback options
            let gpa = "N/A";
            if (academicInfo && typeof academicInfo.currentGPA !== 'undefined') {
              gpa = academicInfo.currentGPA;
            } else if (academicInfo && typeof academicInfo.gpa !== 'undefined') {
              gpa = academicInfo.gpa;
            } else if (student.gpa) {
              gpa = student.gpa;
            } else if (student.academic && student.academic.cgpa) {
              gpa = student.academic.cgpa;
            }
            
            // Get phone number directly from contact field
            let phoneNumber = "N/A";
            if (student.contact) {
              phoneNumber = student.contact;
            } else if (student.phone) {
              phoneNumber = student.phone;
            } else if (student.contactNumber) {
              phoneNumber = student.contactNumber;
            }

            return {
              id: student.id || "Unknown ID",
              name: student.name || student.user?.name || "Unknown",
              dept: departmentName,
              year: calculateYearFromSemester(student.semester),
              gpa: gpa,
              gradYear: new Date().getFullYear() + (4 - calculateYearNumber(student.semester)),
              contact: phoneNumber
            };
          });

          setStudents(formattedStudents);
          setUniqueDepts([...new Set(formattedStudents.map(s => s.dept).filter(Boolean))]);
          setUniqueYears([...new Set(formattedStudents.map(s => s.year).filter(Boolean))]);
        } else {
          setError("Failed to load students: " + (data.message || "Unknown error"));
        }
      } catch (err) {
        setError(`Failed to fetch students: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []); // No dependency on students array to avoid infinite loop

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleYearFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYearFilter(e.target.value);
  };

  const handleDeptFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDeptFilter(e.target.value);
  };

  // Helper function to calculate year from semester
  const calculateYearFromSemester = (semester: number | string | undefined) => {
    if (!semester) return "1st Year";
    
    const semesterNum = typeof semester === 'string' ? parseInt(semester) : semester;
    
    if (semesterNum <= 2) return "1st Year";
    if (semesterNum <= 4) return "2nd Year";
    if (semesterNum <= 6) return "3rd Year";
    return "4th Year";
  };
  
  // Helper function to calculate year number from semester (for graduation year calculation)
  const calculateYearNumber = (semester: number | string | undefined) => {
    if (!semester) return 1;
    
    const semesterNum = typeof semester === 'string' ? parseInt(semester) : semester;
    
    if (semesterNum <= 2) return 1;
    if (semesterNum <= 4) return 2;
    if (semesterNum <= 6) return 3;
    return 4;
  };

  // Filter students based on search term, year, and department
  const filteredStudents = students.filter(student => {
    const matchesSearch = Object.values(student).some(value =>
      typeof value === 'string' ? value.toLowerCase().includes(searchTerm.toLowerCase()) : String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesYear = yearFilter ? student.year === yearFilter : true;
    const matchesDept = deptFilter ? student.dept === deptFilter : true;

    return matchesSearch && matchesYear && matchesDept;
  });

  if (loading) {
    return (
      <div className="flex bg-gray-900 min-h-screen">
        <AdminSidebar />
        <div className="flex-1 p-6 ml-16">
          <TopBar />
          <div className="flex justify-center items-center h-[80vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-xl">Loading students...</span>
          </div>
        </div>
      </div>
    );
  }

  // Display error message if there is one
  if (error) {
    return (
      <div className="flex bg-gray-900 min-h-screen">
        <AdminSidebar />
        <div className="flex-1 p-6 ml-16">
          <TopBar />
          <div className="flex justify-center items-center h-[80vh] flex-col">
            <div className="bg-red-800/30 border border-red-700 rounded-lg p-6 max-w-md">
              <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Students</h2>
              <p className="text-gray-300">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-700 hover:bg-red-600 px-4 py-2 rounded-md text-white"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-900 min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6 ml-16">
        <TopBar />
        <div className="flex items-center space-x-4 ml-10">
          <div className="p-3 bg-purple-700 rounded-xl shadow-lg">
            <AcademicCapIcon className="w-8 h-8" />
          </div>
          <Typography variant="h4" component="h1" className="font-bold bg-purple-600 bg-clip-text text-transparent">
            Student Management
          </Typography>
        </div>
      <div className="ml-16 p-6 w-full text-gray-200 ml-4">
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
                <th className="p-2 border-b border-gray-600">Phone Number</th>
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
                    <td className="p-2">{student.contact}</td>
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
  </div>
  );
};

export default StudentManagement;
