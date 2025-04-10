import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  FaTasks, FaChalkboardTeacher, FaComments, FaBell, FaSignOutAlt,
  FaClipboardList, FaBook, FaChevronLeft, FaChevronRight,
  FaUserCircle, FaCalendarAlt
} from "react-icons/fa";
import { FiAward } from "react-icons/fi";
import { BsGraphUp } from "react-icons/bs";
import StudentSidebar from "@/components/student_sidebar";
import TopBar from "@/components/topbar";

const InfoBox = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-center space-x-2">
    <div className="bg-white/20 p-2 rounded-lg">{icon}</div>
    <div>
      <p className="text-xs text-indigo-100">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const DashboardButton = ({ icon, text, color, route }: any) => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(route)}
      className={`bg-gradient-to-r ${color} p-4 rounded-xl flex items-center justify-center text-white font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5 h-full`}
    >
      {icon}
      {text}
    </button>
  );
};

const Header = ({ studentName, program }: { studentName: string, program: string }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);
  const hour = time.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="bg-gradient-to-r from-green-700 to-emerald-800 p-6 rounded-xl shadow-lg text-white ml-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{greeting}, {studentName}</h2>
          <p className="text-sm text-indigo-100 mt-1">
            {time.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
          <FaUserCircle className="text-xl" />
          <span className="font-medium">{program}</span>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <InfoBox icon={<FaCalendarAlt />} label="Current Semester" value="Semester 4" />
        <InfoBox icon={<BsGraphUp />} label="CGPA" value="8.72" />
      </div>
    </div>
  );
};

const Timetable = ({ courses }: { courses: any[] }) => {
  const [activeDay, setActiveDay] = useState(0);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const timeSlots = ["8:00-9:00", "9:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-1:00"];

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-white mt-6 ml-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Today's Schedule</h3>
        <div className="flex space-x-1 bg-gray-700 p-1 rounded-lg">
          {days.map((day, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              className={`px-3 py-1 text-sm rounded-md ${activeDay === i ? "bg-green-500 text-white" : "text-grey-200 hover:bg-green-600"}`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {timeSlots.map((time, i) => (
          <div key={time} className="flex items-center bg-gray-700/50 p-3 rounded-lg hover:bg-gray-700 transition">
            <div className="w-24 text-sm text-gray-300">{time}</div>
            <div className="flex-1">
              <div className="font-medium">{courses[i]?.name || "No Class"}</div>
              <div className="text-xs text-gray-400">{courses[i]?.code || ""} • {courses[i]?.room || ""}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RightSidebar = () => {
  const router = useRouter();
  const current = new Date();
  const [year, setYear] = useState(current.getFullYear());
  const [month, setMonth] = useState(current.getMonth());

  const handleMonthChange = (dir: number) => {
    if (dir === -1 && month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else if (dir === 1 && month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + dir);
    }
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const today = current.getDate();

  return (
    <div className="bg-gray-800 text-white p-6 rounded-xl shadow-lg border border-gray-700 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 flex items-center"><FaCalendarAlt className="mr-2 text-green-400" />Academic Calendar</h2>

      {/* Calendar Grid */}
      <div className="bg-gray-700/50 p-4 rounded-lg shadow-inner mb-6">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => handleMonthChange(-1)} className="bg-gray-600 hover:bg-gray-500 p-2 rounded-full"><FaChevronLeft /></button>
          <h3 className="text-grey-300 text-lg font-semibold">
            {new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" })}
          </h3>
          <button onClick={() => handleMonthChange(1)} className="bg-gray-600 hover:bg-gray-500 p-2 rounded-full"><FaChevronRight /></button>
        </div>
        <div className="grid grid-cols-7 text-xs text-gray-400 mb-2">{days.map(day => <div key={day} className="text-center">{day}</div>)}</div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={i}></div>)}
          {Array.from({ length: totalDays }, (_, i) => {
            const d = i + 1;
            const isToday = d === today && month === current.getMonth() && year === current.getFullYear();
            return (
              <div key={d} className={`relative text-center py-1 rounded-full cursor-pointer text-sm ${isToday ? "bg-green-600 text-white font-bold" : "hover:bg-gray-600"}`}>
                {d}
              </div>
            );
          })}
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-4 mt-auto">
        <button className="bg-gradient-to-r from-teal-600 to-teal-800 p-3 rounded-lg w-full flex items-center justify-center shadow-md hover:shadow-lg"
          onClick={() => router.push("/student/student_courses")}>
          <FaClipboardList className="mr-2" /> Courses Registered
        </button>
        <button className="bg-gradient-to-r from-purple-600 to-purple-800 p-3 rounded-lg w-full flex items-center justify-center shadow-md hover:shadow-lg"
          onClick={() => router.push("/student/student_attendance")}>
          <FaClipboardList className="mr-2" /> Attendance
        </button>
        <button className="bg-gradient-to-r from-rose-600 to-rose-800 p-3 rounded-lg w-full flex items-center justify-center shadow-md hover:shadow-lg"
          onClick={() => router.push("/student/student_grade")}>
          <FiAward className="mr-2" /> View Grades
        </button>
      </div>
    </div>
  );
};

const StudentDashboard: React.FC = () => {
  const [studentData, setStudentData] = useState<any>(null);
  const [courseData, setCourseData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attendanceSummary, setAttendanceSummary] = useState({
    good: 0,
    warning: 0,
    critical: 0
  });
  const router = useRouter();
  
  useEffect(() => {
    // Authentication check
    const storedRole = localStorage.getItem("role");
    if (storedRole !== "student") {
      router.push("/");
      return;
    }
    
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        // Get student ID from localStorage
        const studentId = localStorage.getItem("userId") || "";
        
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/students/${studentId}?t=${timestamp}`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Save student data to state and localStorage for other components
          setStudentData(data.data);
          localStorage.setItem("userName", data.data.name || "Student");
          localStorage.setItem("userEmail", data.data.email || "student@university.edu");
          
          // Fetch courses for timetable
          try {
            const coursesResponse = await fetch(`/api/students/${studentId}/courses?t=${timestamp}`);
            
            if (!coursesResponse.ok) {
              throw new Error(`Error ${coursesResponse.status}: ${coursesResponse.statusText}`);
            }
            
            const coursesData = await coursesResponse.json();
            
            if (coursesData.success) {
              setCourseData(coursesData.data || []);
            } else {
              console.warn("Failed to fetch courses:", coursesData.message);
            }

            // Fetch attendance summary
            const attendanceResponse = await fetch(`/api/students/${studentId}/attendance/summary?t=${timestamp}`);
            
            if (attendanceResponse.ok) {
              const attendanceData = await attendanceResponse.json();
              if (attendanceData.success) {
                setAttendanceSummary({
                  good: attendanceData.data.good || 0,
                  warning: attendanceData.data.warning || 0,
                  critical: attendanceData.data.critical || 0
                });
              }
            }
          } catch (courseErr) {
            console.error("Error fetching additional data:", courseErr);
          }
        } else {
          setError(data.message || "Failed to load student data");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to fetch student data: ${errorMessage}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentData();
  }, [router]);
  
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-900 text-gray-200">
        <StudentSidebar />
        <div className="flex-1 p-6 ml-16">
          <TopBar />
          <div className="flex justify-center items-center h-[80vh]">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            <span className="ml-3 text-xl">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-900 text-gray-200">
        <StudentSidebar />
        <div className="flex-1 p-6 ml-16">
          <TopBar />
          <div className="flex justify-center items-center h-[80vh] flex-col">
            <div className="bg-red-800/30 border border-red-700 rounded-lg p-6 max-w-md">
              <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Dashboard</h2>
              <p className="text-gray-300">{error}</p>
              <p className="mt-4 text-sm text-gray-400">
                There may be an issue with the server or API connection. Please try refreshing the page or contact support.
              </p>
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
    <div className="min-h-screen bg-gray-900 text-gray-200 flex">
      <StudentSidebar />
      <div className="flex-1 p-6 ml-16">
        <TopBar />
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <Header 
              studentName={studentData?.name || "Student"} 
              program={studentData?.dept || "B.Tech CSE"} 
            />
            <Timetable courses={courseData} />
          </div>
          <div className="w-full lg:w-96">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;