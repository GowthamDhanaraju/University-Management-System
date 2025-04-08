import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import TeacherSidebar from "@/components/teacher_sidebar";
import { Pie, Line } from "react-chartjs-2";
import "chart.js/auto";

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

interface ClassSession {
  id: string;
  courseId: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  topic: string;
}


 

interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  section: string;
  attendance: number;
  grade?: number;
}

const Header: React.FC = () => {
  return (
    <header className="p-4 bg-gray-800 shadow-md flex justify-between items-center rounded-lg border border-gray-700 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold text-white">Course Management</h1>
      <div className="flex items-center">
        <span className="bg-green-500 h-2.5 w-2.5 rounded-full mr-2"></span>
        <span className="text-gray-300">Online</span>
      </div>
    </header>
  );
};

interface TabProps {
  name: string;
  active: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ name, active, onClick }) => {
  return (
    <button
      className={`px-4 py-2 font-medium rounded-t-lg ${
        active
          ? "bg-gray-800 text-white border-t border-l border-r border-gray-700"
          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
      }`}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

const CourseSelector: React.FC<{
    courses: Course[];
    selectedCourse: Course | null;
    onSelectCourse: (course: Course) => void;
  }> = ({ courses, selectedCourse, onSelectCourse }) => {
    return (
      <div className="flex justify-start w-full pl-32"> {/* Adjust this padding for fine-tuning */}
        <div className="w-full max-w-3xl bg-gray-800 text-white p-6 rounded-lg shadow-md border border-gray-700">
          {/* Centered Heading */}
          <h3 className="text-blue-400 text-2xl font-bold mb-4 text-center">My Courses</h3>
  
          {/* Course List */}
          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className={`flex justify-between items-center p-4 ${
                  selectedCourse?.id === course.id ? "bg-blue-600" : "bg-gray-700"
                } rounded-lg hover:bg-gray-600 cursor-pointer`}
                onClick={() => onSelectCourse(course)}
              >
                <div>
                  <h4 className="font-medium">{course.code}: {course.name}</h4>
                  <p className="text-sm text-gray-400">{course.sections.join(", ")}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="bg-green-600 text-xs px-3 py-1 rounded">
                    {course.students} Students
                  </span>
                  <span className="text-xs text-gray-400 mt-1">{course.semester}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  

const CourseOverview: React.FC<{ course: Course }> = ({ course }) => {
  const attendanceData = {
    labels: ["Present", "Absent", "Excused"],
    datasets: [
      {
        data: [75, 15, 10],
        backgroundColor: ["#2ecc71", "#e74c3c", "#f39c12"],
        borderWidth: 0,
      },
    ],
  };

  const gradeData = {
    labels: ["A", "B", "C", "D", "F"],
    datasets: [
      {
        data: [30, 45, 15, 7, 3],
        backgroundColor: ["#2ecc71", "#3498db", "#f39c12", "#e67e22", "#e74c3c"],
        borderWidth: 0,
      },
    ],
  };

  const progressData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8"],
    datasets: [
      {
        label: "Course Progress",
        data: [5, 15, 20, 30, 45, 55, 65, 75],
        borderColor: "#3498db",
        backgroundColor: "rgba(52, 152, 219, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700">
      <h2 className="text-xl font-bold mb-4">{course.code}: {course.name}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-700 p-3 rounded-lg">
          <h3 className="text-blue-400 font-medium mb-2">Course Details</h3>
          <div className="space-y-2">
            <div>
              <span className="text-gray-400">Department:</span> {course.department}
            </div>
            <div>
              <span className="text-gray-400">Semester:</span> {course.semester}
            </div>
            <div>
              <span className="text-gray-400">Sections:</span> {course.sections.join(", ")}
            </div>
            <div>
              <span className="text-gray-400">Students:</span> {course.students}
            </div>
            <div>
              <span className="text-gray-400">Status:</span>{" "}
              <span className={`px-2 py-1 rounded text-xs ${
                course.status === 'Active' ? 'bg-green-600' : 
                course.status === 'Upcoming' ? 'bg-blue-600' : 'bg-gray-600'
              }`}>
                {course.status}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-700 p-3 rounded-lg">
          <h3 className="text-blue-400 font-medium mb-2">Class Attendance</h3>
          <div className="h-32">
            <Pie
              data={attendanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      color: 'white',
                      font: {
                        size: 10
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div className="bg-gray-700 p-3 rounded-lg">
          <h3 className="text-blue-400 font-medium mb-2">Grade Distribution</h3>
          <div className="h-32">
            <Pie
              data={gradeData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      color: 'white',
                      font: {
                        size: 10
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-blue-400 font-medium mb-2">Course Progress</h3>
        <div className="h-48 bg-gray-700 p-3 rounded-lg">
          <Line
            data={progressData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                  },
                  ticks: {
                    color: 'rgba(255, 255, 255, 0.7)'
                  }
                },
                x: {
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                  },
                  ticks: {
                    color: 'rgba(255, 255, 255, 0.7)'
                  }
                }
              },
              plugins: {
                legend: {
                  labels: {
                    color: 'white'
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}; 
// Main component
const TeacherCourseManagement: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Sample data
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
    }
  ];
  
  const classSessions: ClassSession[] = [
    {
      id: "cls1",
      courseId: "cs101",
      date: new Date("2025-03-28"),
      startTime: "10:00 AM",
      endTime: "11:30 AM",
      location: "Room 405",
      topic: "Introduction to Programming"
    },
    {
      id: "cls2",
      courseId: "cs101",
      date: new Date("2025-03-31"),
      startTime: "10:00 AM",
      endTime: "11:30 AM",
      location: "Room 405",
      topic: "Data Structures Implementation"
    },
    {
      id: "cls3",
      courseId: "cs101",
      date: new Date("2025-04-02"),
      startTime: "2:00 PM",
      endTime: "3:30 PM",
      location: "Lab 3",
      topic: "Sorting Algorithms"
    }
  ]; 
  useEffect(() => {
    if (courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0]);
    }
  }, [courses]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <TeacherSidebar />
      
      <div className="flex-1 p-4">
        <Header />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="md:col-span-1">
            <CourseSelector
              courses={courses}
              selectedCourse={selectedCourse}
              onSelectCourse={setSelectedCourse}
            />
          </div>
          
          <div className="md:col-span-3">
            {selectedCourse && (
              <div>
                <div className="mb-4 border-b border-gray-700">
                  <div className="flex space-x-1">
                    <Tab
                      name="Overview"
                      active={activeTab === "overview"}
                      onClick={() => setActiveTab("overview")}
                    />
                  </div>
                </div>
                
                {activeTab === "overview" && <CourseOverview course={selectedCourse} />} 
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCourseManagement;
