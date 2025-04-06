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

interface CourseMaterial {
  id: string;
  courseId: string;
  title: string;
  type: 'Lecture' | 'Assignment' | 'Reading' | 'Exam' | 'Other';
  uploadDate: Date;
  dueDate?: Date;
  fileUrl: string;
}

interface Announcement {
  id: string;
  courseId: string;
  title: string;
  content: string;
  date: Date;
  isImportant: boolean;
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-700 p-3 rounded-lg">
          <h3 className="text-blue-400 font-medium mb-2">Next Classes</h3>
          <ul className="space-y-2">
            <li className="border-l-4 border-blue-500 pl-2">
              <div className="font-medium">Topic: Data Structures Implementation</div>
              <div className="text-sm text-gray-400">Tomorrow, 10:00 AM • Room 405</div>
            </li>
            <li className="border-l-4 border-green-500 pl-2">
              <div className="font-medium">Topic: Sorting Algorithms</div>
              <div className="text-sm text-gray-400">April 2, 2:00 PM • Lab 3</div>
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-700 p-3 rounded-lg">
          <h3 className="text-blue-400 font-medium mb-2">Upcoming Deadlines</h3>
          <ul className="space-y-2">
            <li className="border-l-4 border-red-500 pl-2">
              <div className="font-medium">Assignment 2: Linked Lists</div>
              <div className="text-sm text-gray-400">Due: April 5 • 35 submissions</div>
            </li>
            <li className="border-l-4 border-yellow-500 pl-2">
              <div className="font-medium">Mid-Term Exam</div>
              <div className="text-sm text-gray-400">April 10 • 9:00 AM</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const ClassSchedule: React.FC<{ courseId: string, classSessions: ClassSession[] }> = ({ 
  courseId, 
  classSessions 
}) => {
  const sessions = classSessions.filter(session => session.courseId === courseId);
  const today = new Date();
  
  // Sort sessions by date
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Split into upcoming and previous sessions
  const upcomingSessions = sortedSessions.filter(
    session => new Date(session.date) >= today
  );
  
  const previousSessions = sortedSessions.filter(
    session => new Date(session.date) < today
  );

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700">
      <h2 className="text-xl font-bold mb-4">Class Schedule</h2>
      
      <div className="mb-6">
        <h3 className="text-blue-400 text-lg font-semibold mb-3">
          Upcoming Classes ({upcomingSessions.length})
        </h3>
        {upcomingSessions.length > 0 ? (
          <div className="space-y-3">
            {upcomingSessions.map(session => (
              <div
                key={session.id}
                className="p-3 border border-gray-600 rounded bg-gray-700 hover:bg-gray-600"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{session.topic}</h4>
                    <div className="text-sm text-gray-400 mt-1">
                      {session.startTime} - {session.endTime} • {session.location}
                    </div>
                  </div>
                  <div className="bg-blue-600 px-2 py-1 rounded text-xs">
                    {new Date(session.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex mt-3 space-x-2">
                  <button className="px-2 py-1 bg-green-600 text-xs rounded hover:bg-green-700">
                    Edit Class
                  </button>
                  <button className="px-2 py-1 bg-red-600 text-xs rounded hover:bg-red-700">
                    Cancel
                  </button>
                  <button className="px-2 py-1 bg-blue-600 text-xs rounded hover:bg-blue-700">
                    Take Attendance
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No upcoming classes</p>
        )}
      </div>
      
      <div>
        <h3 className="text-blue-400 text-lg font-semibold mb-3">
          Previous Classes ({previousSessions.length})
        </h3>
        {previousSessions.length > 0 ? (
          <div className="space-y-3">
            {previousSessions.map(session => (
              <div
                key={session.id}
                className="p-3 border border-gray-600 rounded bg-gray-700 hover:bg-gray-600"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{session.topic}</h4>
                    <div className="text-sm text-gray-400 mt-1">
                      {session.startTime} - {session.endTime} • {session.location}
                    </div>
                  </div>
                  <div className="bg-gray-600 px-2 py-1 rounded text-xs">
                    {new Date(session.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex mt-3 space-x-2">
                  <button className="px-2 py-1 bg-blue-600 text-xs rounded hover:bg-blue-700">
                    View Attendance
                  </button>
                  <button className="px-2 py-1 bg-green-600 text-xs rounded hover:bg-green-700">
                    Upload Materials
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No previous classes</p>
        )}
      </div>
      
      <div className="mt-4 flex justify-end">
        <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Schedule New Class
        </button>
      </div>
    </div>
  );
};

const CourseMaterials: React.FC<{ courseId: string, materials: CourseMaterial[] }> = ({ 
  courseId, 
  materials 
}) => {
  const courseMaterials = materials.filter(material => material.courseId === courseId);
  
  // Group materials by type
  const groupedMaterials: Record<string, CourseMaterial[]> = {};
  courseMaterials.forEach(material => {
    if (!groupedMaterials[material.type]) {
      groupedMaterials[material.type] = [];
    }
    groupedMaterials[material.type].push(material);
  });

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700">
      <h2 className="text-xl font-bold mb-4">Course Materials</h2>
      
      <div className="mb-4 flex justify-end">
        <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Upload New Material
        </button>
      </div>
      
      {Object.entries(groupedMaterials).length > 0 ? (
        Object.entries(groupedMaterials).map(([type, typeMaterials]) => (
          <div key={type} className="mb-6">
            <h3 className="text-blue-400 text-lg font-semibold mb-3">{type}s</h3>
            <div className="space-y-3">
              {typeMaterials.map(material => (
                <div
                  key={material.id}
                  className="p-3 border border-gray-600 rounded bg-gray-700 hover:bg-gray-600"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{material.title}</h4>
                      <div className="text-sm text-gray-400 mt-1">
                        Uploaded: {new Date(material.uploadDate).toLocaleDateString()}
                        {material.dueDate && ` • Due: ${new Date(material.dueDate).toLocaleDateString()}`}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-600 text-xs rounded hover:bg-blue-700">
                        Download
                      </button>
                      <button className="px-3 py-1 bg-green-600 text-xs rounded hover:bg-green-700">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No materials available for this course</p>
      )}
    </div>
  );
};

const StudentsList: React.FC<{ courseId: string, students: Student[] }> = ({ 
  courseId, 
  students 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter students by section
  const sections = [...new Set(students.map(student => student.section))];
  
  // Filter students by search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700">
      <h2 className="text-xl font-bold mb-4">Students</h2>
      
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search students by name, ID or email..."
            className="w-full p-2 pl-8 bg-gray-700 border border-gray-600 rounded text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-2 top-2.5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="p-2 rounded-tl-lg">Name</th>
              <th className="p-2">Student ID</th>
              <th className="p-2">Section</th>
              <th className="p-2">Email</th>
              <th className="p-2">Attendance</th>
              <th className="p-2">Grade</th>
              <th className="p-2 rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr 
                key={student.id} 
                className={`${index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-750'} hover:bg-gray-600`}
              >
                <td className="p-2">{student.name}</td>
                <td className="p-2">{student.studentId}</td>
                <td className="p-2">{student.section}</td>
                <td className="p-2">{student.email}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    student.attendance >= 75 ? 'bg-green-600' :
                    student.attendance >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}>
                    {student.attendance}%
                  </span>
                </td>
                <td className="p-2">
                  {student.grade ? 
                    <span className={`px-2 py-1 rounded text-xs ${
                      student.grade >= 90 ? 'bg-green-600' :
                      student.grade >= 80 ? 'bg-blue-600' :
                      student.grade >= 70 ? 'bg-yellow-600' :
                      student.grade >= 60 ? 'bg-orange-600' : 'bg-red-600'
                    }`}>
                      {student.grade}
                    </span> : 
                    <span className="text-gray-400">N/A</span>
                  }
                </td>
                <td className="p-2">
                  <div className="flex space-x-2">
                    <button className="px-2 py-1 bg-blue-600 text-xs rounded hover:bg-blue-700">
                      Details
                    </button>
                    <button className="px-2 py-1 bg-green-600 text-xs rounded hover:bg-green-700">
                      Grade
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Showing {filteredStudents.length} of {students.length} students
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700">
            Export List
          </button>
          <button className="px-3 py-1 bg-green-600 rounded hover:bg-green-700">
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
};

const Announcements: React.FC<{ courseId: string, announcements: Announcement[] }> = ({ 
  courseId, 
  announcements 
}) => {
  const courseAnnouncements = announcements.filter(
    announcement => announcement.courseId === courseId
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700">
      <h2 className="text-xl font-bold mb-4">Announcements</h2>
      
      <div className="mb-4 flex justify-end">
        <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Announcement
        </button>
      </div>
      
      {courseAnnouncements.length > 0 ? (
        <div className="space-y-4">
          {courseAnnouncements.map(announcement => (
            <div 
              key={announcement.id} 
              className={`p-4 border rounded-lg ${
                announcement.isImportant ? 'bg-red-900/30 border-red-700' : 'bg-gray-700 border-gray-600'
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">
                  {announcement.isImportant && (
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded mr-2">
                      Important
                    </span>
                  )}
                  {announcement.title}
                </h3>
                <span className="text-sm text-gray-400">
                  {new Date(announcement.date).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-gray-300">{announcement.content}</p>
              <div className="mt-3 flex justify-end space-x-2">
                <button className="px-3 py-1 bg-blue-600 text-xs rounded hover:bg-blue-700">
                  Edit
                </button>
                <button className="px-3 py-1 bg-red-600 text-xs rounded hover:bg-red-700">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No announcements for this course</p>
      )}
    </div>
  );
};

const CourseSettings: React.FC<{ course: Course }> = ({ course }) => {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700">
      <h2 className="text-xl font-bold mb-4">Course Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-blue-400 text-lg font-semibold mb-3">General Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-1">Course Name</label>
              <input
                type="text"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                defaultValue={course.name}
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Course Code</label>
              <input
                type="text"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                defaultValue={course.code}
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Department</label>
              <input
                type="text"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                defaultValue={course.department}
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Semester</label>
              <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white">

                  <option value="Fall 2025" selected={course.semester === "Fall 2025"}>
                  Fall 2025
                </option>
                <option value="Spring 2025" selected={course.semester === "Spring 2025"}>
                  Spring 2025
                </option>
                <option value="Summer 2025" selected={course.semester === "Summer 2025"}>
                  Summer 2025
                </option>
              </select>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-blue-400 text-lg font-semibold mb-3">Sections</h3>
          <div className="space-y-3">
            {course.sections.map((section, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="text"
                  className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white"
                  defaultValue={section}
                />
                <button className="ml-2 p-2 bg-red-600 rounded hover:bg-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
            <button className="px-3 py-1 bg-blue-600 text-sm rounded hover:bg-blue-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Section
            </button>
          </div>
          
          <h3 className="text-blue-400 text-lg font-semibold mt-6 mb-3">Status</h3>
          <div>
            <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white">
              <option value="Active" selected={course.status === "Active"}>Active</option>
              <option value="Upcoming" selected={course.status === "Upcoming"}>Upcoming</option>
              <option value="Archived" selected={course.status === "Archived"}>Archived</option>
            </select>
          </div>
          
          <h3 className="text-blue-400 text-lg font-semibold mt-6 mb-3">Visibility</h3>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="visible-to-students"
              className="mr-2"
              defaultChecked
            />
            <label htmlFor="visible-to-students">Visible to students</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="allow-enrollment"
              className="mr-2"
              defaultChecked
            />
            <label htmlFor="allow-enrollment">Allow enrollment</label>
          </div>
        </div>
      </div>
      
      <div className="mt-6 border-t border-gray-700 pt-4">
        <h3 className="text-blue-400 text-lg font-semibold mb-3">Danger Zone</h3>
        
        <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg">
          <h4 className="font-medium">Delete Course</h4>
          <p className="text-gray-400 my-2">
            Once you delete a course, there is no going back. Please be certain.
          </p>
          <button className="px-3 py-1 bg-red-600 rounded hover:bg-red-700">
            Delete Course
          </button>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <button className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
          Cancel
        </button>
        <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
          Save Changes
        </button>
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
    },
    {
      id: "cs210",
      code: "CS210",
      name: "Data Structures",
      semester: "Spring 2025",
      department: "Computer Science",
      sections: ["A"],
      students: 45,
      status: "Active"
    },
    {
      id: "cs315",
      code: "CS315",
      name: "Algorithms",
      semester: "Fall 2025",
      department: "Computer Science",
      sections: ["A", "B", "C"],
      students: 120,
      status: "Upcoming"
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
  
  const materials: CourseMaterial[] = [
    {
      id: "mat1",
      courseId: "cs101",
      title: "Introduction to Programming Slides",
      type: "Lecture",
      uploadDate: new Date("2025-03-27"),
      fileUrl: "/files/intro_slides.pdf"
    },
    {
      id: "mat2",
      courseId: "cs101",
      title: "Assignment 1: Basic Programming",
      type: "Assignment",
      uploadDate: new Date("2025-03-27"),
      dueDate: new Date("2025-04-03"),
      fileUrl: "/files/assignment1.pdf"
    },
    {
      id: "mat3",
      courseId: "cs101",
      title: "Assignment 2: Linked Lists",
      type: "Assignment",
      uploadDate: new Date("2025-03-29"),
      dueDate: new Date("2025-04-05"),
      fileUrl: "/files/assignment2.pdf"
    }
  ];
  
  const announcements: Announcement[] = [
    {
      id: "ann1",
      courseId: "cs101",
      title: "Welcome to the course",
      content: "Welcome to CS101! I'm looking forward to a great semester with all of you. Please review the syllabus and come prepared to our first class.",
      date: new Date("2025-03-25"),
      isImportant: false
    },
    {
      id: "ann2",
      courseId: "cs101",
      title: "Mid-Term Exam Date Change",
      content: "Please note that the mid-term exam has been moved to April 10th at 9:00 AM. The exam will cover all material from weeks 1-5.",
      date: new Date("2025-03-28"),
      isImportant: true
    }
  ];
  
  const students: Student[] = [
    {
      id: "std1",
      name: "John Smith",
      studentId: "S12345",
      email: "john.smith@university.edu",
      section: "A",
      attendance: 85
    },
    {
      id: "std2",
      name: "Alice Johnson",
      studentId: "S12346",
      email: "alice.johnson@university.edu",
      section: "A",
      attendance: 92,
      grade: 88
    },
    {
      id: "std3",
      name: "Bob Williams",
      studentId: "S12347",
      email: "bob.williams@university.edu",
      section: "B",
      attendance: 78,
      grade: 75
    },
    {
      id: "std4",
      name: "Emma Davis",
      studentId: "S12348",
      email: "emma.davis@university.edu",
      section: "B",
      attendance: 65,
      grade: 70
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
                    <Tab
                      name="Schedule"
                      active={activeTab === "schedule"}
                      onClick={() => setActiveTab("schedule")}
                    />
                    <Tab
                      name="Materials"
                      active={activeTab === "materials"}
                      onClick={() => setActiveTab("materials")}
                    />
                    <Tab
                      name="Students"
                      active={activeTab === "students"}
                      onClick={() => setActiveTab("students")}
                    />
                    <Tab
                      name="Announcements"
                      active={activeTab === "announcements"}
                      onClick={() => setActiveTab("announcements")}
                    />
                    <Tab
                      name="Settings"
                      active={activeTab === "settings"}
                      onClick={() => setActiveTab("settings")}
                    />
                  </div>
                </div>
                
                {activeTab === "overview" && <CourseOverview course={selectedCourse} />}
                {activeTab === "schedule" && <ClassSchedule courseId={selectedCourse.id} classSessions={classSessions} />}
                {activeTab === "materials" && <CourseMaterials courseId={selectedCourse.id} materials={materials} />}
                {activeTab === "students" && <StudentsList courseId={selectedCourse.id} students={students} />}
                {activeTab === "announcements" && <Announcements courseId={selectedCourse.id} announcements={announcements} />}
                {activeTab === "settings" && <CourseSettings course={selectedCourse} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCourseManagement;