import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaTasks, FaChalkboardTeacher, FaComments, FaUser, FaClipboardList, FaBook, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import StudentSidebar from "@/components/student_sidebar";
import { FiAward } from "react-icons/fi";

const Header: React.FC = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold">Welcome, Rajesh K</h2>
      <p className="text-gray-300">Stay organized and keep track of your academic progress.</p>
    </div>
  );
};

const Timetable: React.FC = () => {
  return (
    <div className="bg-gray-700 p-6 rounded-lg shadow-md text-white mt-4 h-1/2">
      <h3 className="text-lg font-semibold">Timetable</h3>
      <p className="text-gray-300">Timetable Content Here</p>
    </div>
  );
};

const Buttons: React.FC = () => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <button className="bg-gradient-to-r from-green-400 to-green-600 p-4 rounded-lg flex items-center justify-center text-white font-semibold hover:opacity-90 transition" onClick={() => router.push("/student_attendance")}>
        <FaTasks className="mr-2" /> Attendance
      </button>
      <button className="bg-gradient-to-r from-orange-400 to-orange-600 p-4 rounded-lg flex items-center justify-center text-white font-semibold hover:opacity-90 transition" onClick={() => router.push("/club-activities")}>
        <FaBook className="mr-2" /> Club Activities
      </button>
      <button className="bg-gradient-to-r from-blue-400 to-blue-600 p-4 rounded-lg flex items-center justify-center text-white font-semibold hover:opacity-90 transition" onClick={() => router.push("/student_faculties")}>
        <FaChalkboardTeacher className="mr-2" /> Faculties
      </button>
      <button className="bg-gradient-to-r from-purple-400 to-purple-600 p-4 rounded-lg flex items-center justify-center text-white font-semibold hover:opacity-90 transition" onClick={() => router.push("/student_feedback")}>
        <FaComments className="mr-2" /> Feedback
      </button>
    </div>
  );
};

const RightSidebar: React.FC = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth());
  const router = useRouter();

  const handlePrevMonth = () => {
    setMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (month === 0) setYear((prev) => prev - 1);
  };

  const handleNextMonth = () => {
    setMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (month === 11) setYear((prev) => prev + 1);
  };

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700 h-full">
      <h2 className="text-xl font-bold mb-4 text-center">Academic Calendar</h2>
      <div className="bg-gray-700 p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-3">
          <button onClick={handlePrevMonth} className="bg-gray-600 px-2 py-1 rounded">
            <FaChevronLeft className="text-white" />
          </button>
          <h3 className="text-blue-400 text-lg font-semibold">
            {new Date(year, month).toLocaleString("default", { month: "long" })} {year}
          </h3>
          <button onClick={handleNextMonth} className="bg-gray-600 px-2 py-1 rounded">
            <FaChevronRight className="text-white" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => (
            <div key={day} className="text-center text-gray-400 text-sm py-1">
              {day}
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="py-2"></div>
          ))}
          {calendarDates.map((date) => (
            <div
              key={date}
              className={`text-center py-2 rounded-full cursor-pointer ${
                date === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear()
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              {date}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 space-y-4">
        <button className="bg-gradient-to-r from-teal-800 to-teal-600 p-4 rounded-lg text-center w-full h-16 flex items-center justify-center shadow-md" onClick={() => router.push("/registered_courses")}>
          <FaClipboardList className="mr-2" /> Courses Registered
        </button>
        <button className="bg-gradient-to-r from-rose-800 to-rose-600 p-4 rounded-lg text-center w-full h-16 flex items-center justify-center shadow-md" onClick={() => router.push("/student_grade")}>
          <FiAward className="mr-2" /> Grades
        </button>
      </div>
    </div>
  );
};

const StudentDashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-200">
      <StudentSidebar />
      <div className="flex flex-1 ml-16">
        <div className="flex-1 p-6">
          <Header />
          <Timetable />
          <Buttons />
        </div>
        <div className="w-1/3 p-4">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
