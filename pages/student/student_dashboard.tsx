import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

const Header = () => {
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
          <h2 className="text-2xl font-bold">{greeting}, Rajesh</h2>
          <p className="text-sm text-indigo-100 mt-1">
            {time.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
          <FaUserCircle className="text-xl" />
          <span className="font-medium">B.Tech CSE</span>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <InfoBox icon={<FaCalendarAlt />} label="Current Semester" value="Semester 4" />
        <InfoBox icon={<BsGraphUp />} label="CGPA" value="8.72" />
      </div>
    </div>
  );
};

const Timetable = () => {
  const [activeDay, setActiveDay] = useState(0);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const timeSlots = ["8:00-9:00", "9:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-1:00"];
  const courses = ["Data Structures", "Algorithms", "Database Systems", "Computer Networks", "Operating Systems"];
  const codes = ["CS201", "CS202", "CS203", "CS204", "CS205"];
  const rooms = ["LT-3", "LT-4", "LAB-2", "LT-1", "LT-2"];

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
              <div className="font-medium">{courses[i]}</div>
              <div className="text-xs text-gray-400">{codes[i]} • {rooms[i]}</div>
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

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex">
      <StudentSidebar />
      <div className="flex-1 p-6 ml-16">
        <TopBar />
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <Header />
            <Timetable />
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