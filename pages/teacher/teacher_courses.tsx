import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import TeacherSidebar from "@/components/teacher_sidebar";
import { 
  BookOpenIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  AcademicCapIcon,
  BuildingOfficeIcon
} from "@heroicons/react/24/outline";

// Type definitions
interface Course {
  id: string;
  code: string;
  name: string;
  semester: string;
  department: string;
  sections: string[];
  students: number;
  status: 'Active' | 'Upcoming' | 'Archived';
}

const TeacherCourseManagement: React.FC = () => {
  const router = useRouter();
  
  // Sample data - expanded with more courses for better demonstration
  const courses: Course[] = [
    {
      id: "cs101",
      code: "CS101",
      name: "Introduction to Computer Science",
      semester: "Spring 2025",
      department: "Computer Science",
      sections: ["A", "B"],
      students: 75,
      status: "Active"
    },
    {
      id: "cs301",
      code: "CS301",
      name: "Database Systems",
      semester: "Spring 2025",
      department: "Computer Science",
      sections: ["C"],
      students: 52,
      status: "Active"
    },
    {
      id: "cs405",
      code: "CS405",
      name: "Computer Networks",
      semester: "Spring 2025",
      department: "Computer Science",
      sections: ["A"],
      students: 45,
      status: "Active"
    },
    {
      id: "cs202",
      code: "CS202",
      name: "Data Structures and Algorithms",
      semester: "Spring 2025",
      department: "Computer Science",
      sections: ["B", "D"],
      students: 68,
      status: "Active"
    }
  ];
  
  useEffect(() => {
    // Check if user is logged in as teacher
    const storedRole = localStorage.getItem("role");
    if (storedRole !== "teacher") router.push("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex">
      <TeacherSidebar />
      
      <div className="flex-1 p-6 ml-16">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-blue-600 rounded-xl mr-4">
            <BookOpenIcon className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">My Courses</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-900/70 to-blue-800/40 p-4 rounded-lg border border-blue-700/50 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-blue-800 rounded-lg mr-3">
                <BookOpenIcon className="h-6 w-6 text-blue-200" />
              </div>
              <div>
                <h3 className="text-blue-200 text-sm font-medium">Active Courses</h3>
                <p className="text-white text-xl font-bold">{courses.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/70 to-purple-800/40 p-4 rounded-lg border border-purple-700/50 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-purple-800 rounded-lg mr-3">
                <UserGroupIcon className="h-6 w-6 text-purple-200" />
              </div>
              <div>
                <h3 className="text-purple-200 text-sm font-medium">Total Students</h3>
                <p className="text-white text-xl font-bold">
                  {courses.reduce((total, course) => total + course.students, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-900/70 to-green-800/40 p-4 rounded-lg border border-green-700/50 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-green-800 rounded-lg mr-3">
                <BuildingOfficeIcon className="h-6 w-6 text-green-200" />
              </div>
              <div>
                <h3 className="text-green-200 text-sm font-medium">Departments</h3>
                <p className="text-white text-xl font-bold">
                  {new Set(courses.map(c => c.department)).size}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-900/70 to-amber-800/40 p-4 rounded-lg border border-amber-700/50 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-amber-800 rounded-lg mr-3">
                <AcademicCapIcon className="h-6 w-6 text-amber-200" />
              </div>
              <div>
                <h3 className="text-amber-200 text-sm font-medium">Sections</h3>
                <p className="text-white text-xl font-bold">
                  {courses.reduce((total, course) => total + course.sections.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Cards - Simplified */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
              {/* Course Header */}
              <div className="p-4 border-b border-gray-700 bg-gray-750">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-blue-400">{course.code}</h2>
                    <h3 className="text-lg font-medium text-white">{course.name}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.status === 'Active' ? 'bg-green-600 text-green-100' : 
                    course.status === 'Upcoming' ? 'bg-blue-600 text-blue-100' : 
                    'bg-gray-600 text-gray-100'
                  }`}>
                    {course.status}
                  </span>
                </div>
              </div>
              
              {/* Course Details - Just the basic info */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm">{course.department}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm">{course.semester}</span>
                  </div>
                  <div className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm">{course.students} Students</span>
                  </div>
                  <div className="flex items-center">
                    <AcademicCapIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm">Section {course.sections.join(", ")}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherCourseManagement;
