import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import TeacherSidebar from "@/components/teacher_sidebar";
import { Pie, Line } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import TopBar from "@/components/topbar";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { Typography } from "@mui/material";

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

interface AttendanceData {
  present: number;
  absent: number;
  excused: number;
}

interface GradeDistribution {
  A: number;
  B: number;
  C: number;
  D: number;
  F: number;
}

interface CourseProgressPoint {
  week: string;
  progress: number;
}

const CourseSelector: React.FC<{
  courses: Course[];
  selectedCourse: Course | null;
  onSelectCourse: (course: Course) => void;
}> = ({ courses, selectedCourse, onSelectCourse }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
      <h3 className="font-semibold text-lg mb-4">Your Courses</h3>
      <div className="space-y-3">
        {courses.length === 0 ? (
          <div className="text-gray-400 text-center py-4">No courses assigned yet.</div>
        ) : (
          courses.map((course) => (
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
          ))
        )}
      </div>
    </div>
  );
};

const CourseOverview: React.FC<{ course: Course }> = ({ course }) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
  const [gradeData, setGradeData] = useState<GradeDistribution | null>(null);
  const [progressData, setProgressData] = useState<CourseProgressPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        
        // Fetch attendance data
        const attendanceRes = await axios.get(`/api/teacher/courses/${course.id}/attendance`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Fetch grade distribution
        const gradesRes = await axios.get(`/api/teacher/courses/${course.id}/grades`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Fetch course progress
        const progressRes = await axios.get(`/api/teacher/courses/${course.id}/progress`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setAttendanceData(attendanceRes.data);
        setGradeData(gradesRes.data);
        setProgressData(progressRes.data);
      } catch (err) {
        console.error("");
        setError("");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseData();
  }, [course.id]);

  // Prepare chart data based on API responses
  const chartAttendanceData = {
    labels: ["Present", "Absent", "Excused"],
    datasets: [
      {
        data: attendanceData ? [attendanceData.present, attendanceData.absent, attendanceData.excused] : [0, 0, 0],
        backgroundColor: ["#2ecc71", "#e74c3c", "#f39c12"],
        borderWidth: 0,
      },
    ],
  };

  const chartGradeData = {
    labels: ["A", "B", "C", "D", "F"],
    datasets: [
      {
        data: gradeData ? [gradeData.A, gradeData.B, gradeData.C, gradeData.D, gradeData.F] : [0, 0, 0, 0, 0],
        backgroundColor: ["#2ecc71", "#3498db", "#f39c12", "#e67e22", "#e74c3c"],
        borderWidth: 0,
      },
    ],
  };

  const chartProgressData = {
    labels: progressData.map(item => item.week),
    datasets: [
      {
        label: "Course Progress",
        data: progressData.map(item => item.progress),
        borderColor: "#3498db",
        backgroundColor: "rgba(52, 152, 219, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  if (loading) {
    return (
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700 flex justify-center items-center h-64">
        Loading course data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700">
        <div className="text-red-400 mb-4">{error}</div>
        <div className="bg-gray-700 p-3 rounded-lg">
          <h3 className="text-blue-400 font-medium mb-2">Course Details</h3>
          <div className="space-y-2">
            {/* Basic course details that don't require API */}
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
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-blue-400 font-medium mb-4">Course Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="text-green-400 font-medium mb-2">Attendance</h4>
          <Pie data={chartAttendanceData} />
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="text-blue-400 font-medium mb-2">Grade Distribution</h4>
          <Pie data={chartGradeData} />
        </div>
        <div className="md:col-span-2 bg-gray-700 p-4 rounded-lg">
          <h4 className="text-purple-400 font-medium mb-2">Course Progress</h4>
          <Line data={chartProgressData} />
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          router.push("/login");
          return;
        }
        
        const response = await axios.get("/api/teacher/courses", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && Array.isArray(response.data)) {
          const fetchedCourses: Course[] = response.data.map(course => ({
            id: course.id || String(course._id),
            code: course.code || "",
            name: course.name || course.title || "",
            semester: course.semester || "",
            department: course.department || "",
            sections: course.sections || [],
            students: course.enrollmentCount || 0,
            status: course.status || 'Active'
          }));
          
          setCourses(fetchedCourses);
          
          // Select the first course by default if available
          if (fetchedCourses.length > 0) {
            setSelectedCourse(fetchedCourses[0]);
          }
        }
        
        setError("");
      } catch (err) {
        console.error("Failed to load courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, [router]);

  // Function to fetch course details when a course is selected
  const fetchCourseDetails = async (courseId: string) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push("/login");
        return;
      }
      
      const response = await axios.get(`/api/teacher/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        // Update the selected course with more details
        const detailedCourse = {
          ...selectedCourse,
          ...response.data
        };
        
        setSelectedCourse(detailedCourse as Course);
      }
    } catch (err) {
      console.error(`Failed to fetch details for course ${courseId}:`, err);
    }
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    fetchCourseDetails(course.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex">
        <TeacherSidebar />
        <div className="flex-1 p-4 flex items-center justify-center">
          <div>Loading courses...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <TeacherSidebar />
      <div className="flex-1 p-6 ml-16">
        <TopBar />
        <div className="flex items-center space-x-4 ml-10">
          <div className="p-3 bg-purple-700 rounded-xl shadow-lg">
            <BookOpenIcon className="w-8 h-8" />
          </div>
          <Typography variant="h4" component="h1" className="font-bold bg-purple-600 bg-clip-text text-transparent">
            Course Management
          </Typography>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 ml-8">
          <div className="md:col-span-1">
            <CourseSelector
              courses={courses}
              selectedCourse={selectedCourse}
              onSelectCourse={handleSelectCourse}
            />
          </div>
          
          <div className="md:col-span-3">
            {selectedCourse && (
              <div>
                <div className="mb-4 border-b border-gray-700">
                  <div className="flex space-x-1">
                    <button
                      className={`px-4 py-2 rounded-lg ${
                        activeTab === "overview" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-400"
                      }`}
                      onClick={() => setActiveTab("overview")}
                    >
                      Overview
                    </button>
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
