"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaTasks, FaBook, FaChalkboardTeacher, FaComments } from "react-icons/fa";
import StudentSidebar from "@/components/student_sidebar";

const Header: React.FC = () => {
  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-md text-white max-w-7xl mb-8">
      <h2 className="text-3xl font-bold">Welcome, Rajesh K</h2>
      <p className="text-gray-400 mt-2">Stay organized and keep track of your academic progress.</p>
    </div>
  );
};

const Timetable: React.FC = () => {
  return (
    <div className="bg-gray-700 p-8 rounded-lg shadow-md text-white w-full mb-8">
      <h3 className="text-2xl font-semibold">Timetable</h3>
      <p className="text-gray-400 mt-2">Timetable Content Here</p>
    </div>
  );
};

const Buttons: React.FC = () => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <button
        className="bg-green-500 p-6 rounded-lg flex items-center justify-center text-white font-semibold hover:bg-green-600 transition duration-300"
        onClick={() => router.push("/attendance")}
      >
        <FaTasks className="mr-3" /> Attendance
      </button>
      <button
        className="bg-orange-500 p-6 rounded-lg flex items-center justify-center text-white font-semibold hover:bg-orange-600 transition duration-300"
        onClick={() => router.push("/club-activities")}
      >
        <FaBook className="mr-3" /> Club Activities
      </button>
      <button
        className="bg-blue-500 p-6 rounded-lg flex items-center justify-center text-white font-semibold hover:bg-blue-600 transition duration-300"
        onClick={() => router.push("/faculties")}
      >
        <FaChalkboardTeacher className="mr-3" /> Faculties
      </button>
      <button
        className="bg-purple-500 p-6 rounded-lg flex items-center justify-center text-white font-semibold hover:bg-purple-600 transition duration-300"
        onClick={() => router.push("/feedback")}
      >
        <FaComments className="mr-3" /> Feedback
      </button>
    </div>
  );
};

const RightSidebar: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md text-white w-full h-full flex flex-col justify-between space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-4">Academic Calendar</h3>
        <div className="calendar-container">
          <Calendar
            onChange={(value) => setDate(value as Date)}
            value={date}
            className="react-calendar w-full"
          />
        </div>
        <style jsx global>{`
          .react-calendar {
            background-color: #2d3748;
            color: white;
            border-radius: 0.5rem;
            padding: 1rem;
          }
          .react-calendar__navigation button {
            color: white;
          }
          .react-calendar__navigation button:hover {
            background-color: #4a5568;
          }
          .react-calendar__tile {
            color: white;
            text-align: center;
          }
          .react-calendar__tile--active {
            background: #2b6cb0;
          }
          .react-calendar__tile--active:hover {
            background: #2c5282;
          }
        `}</style>
      </div>
      <div className="flex flex-col space-y-4">
        <div className="bg-gray-700 p-5 rounded-lg text-center hover:bg-gray-600 cursor-pointer transition duration-300">
          Courses Registered
        </div>
        <div className="bg-gray-700 p-5 rounded-lg text-center hover:bg-gray-600 cursor-pointer transition duration-300">
          Grades
        </div>
      </div>
    </div>
  );
};

const StudentDashboard: React.FC = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-900 text-gray-200">
      {/* Sidebar */}
      <div className="w-1/6">
        <StudentSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row p-6 space-y-6 md:space-y-0 md:space-x-6">
        <div className="flex-1">
          <Header />
          <Timetable />
          <Buttons />
        </div>

        {/* Right Sidebar */}
        <div className="w-full md:w-1/3">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;