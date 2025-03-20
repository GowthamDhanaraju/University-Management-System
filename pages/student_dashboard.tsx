"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaTasks, FaBook, FaChalkboardTeacher, FaComments } from "react-icons/fa";
import StudentSidebar from "@/components/student_sidebar";

const Header: React.FC = () => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-white">
      <h2 className="text-xl font-bold">Welcome, Rajesh K</h2>
      <p className="text-gray-300">Stay organized and keep track of your academic progress.</p>
    </div>
  );
};

const Timetable: React.FC = () => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow-md text-white mt-4">
      <h3 className="text-lg font-semibold">Timetable</h3>
      <p className="text-gray-300">Timetable Content Here</p>
    </div>
  );
};

const Buttons: React.FC = () => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <button
        className="bg-green-500 p-4 rounded-lg flex items-center justify-center text-white font-semibold hover:bg-green-600"
        onClick={() => router.push("/attendance")}
      >
        <FaTasks className="mr-2" /> Attendance
      </button>
      <button
        className="bg-orange-500 p-4 rounded-lg flex items-center justify-center text-white font-semibold hover:bg-orange-600"
        onClick={() => router.push("/club-activities")}
      >
        <FaBook className="mr-2" /> Club Activities
      </button>
      <button
        className="bg-blue-500 p-4 rounded-lg flex items-center justify-center text-white font-semibold hover:bg-blue-600"
        onClick={() => router.push("/faculties")}
      >
        <FaChalkboardTeacher className="mr-2" /> Faculties
      </button>
      <button
        className="bg-purple-500 p-4 rounded-lg flex items-center justify-center text-white font-semibold hover:bg-purple-600"
        onClick={() => router.push("/feedback")}
      >
        <FaComments className="mr-2" /> Feedback
      </button>
    </div>
  );
};

const RightSidebar: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-white flex flex-col items-center space-y-4 h-full w-full">
      <h3 className="text-lg font-semibold mb-2">Academic Calendar</h3>
      <div className="flex justify-center items-center w-full">
        <Calendar onChange={(value) => setDate(value as Date)} value={date} />
      </div>

      <div className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 cursor-pointer w-full">
        Courses Registered
      </div>
      <div className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 cursor-pointer w-full">
        Grades
      </div>

      <style jsx global>{`
        .react-calendar {
          width: 100%;
          max-width: 300px;
          background-color: #2d3748;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-family: inherit;
          padding: 10px;
        }

        .react-calendar__navigation button {
          color: white;
        }

        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: #4a5568;
        }

        .react-calendar__tile {
          color: white;
          padding: 0.75em 0.5em;
          border-radius: 4px;
        }

        .react-calendar__month-view__days__day {
          color: white;
        }

        .react-calendar__month-view__days__day--weekend {
          color: #feb2b2;
        }

        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #4a5568;
        }

        .react-calendar__tile--now {
          background: #3182ce !important;
        }

        .react-calendar__tile--active {
          background: #2b6cb0 !important;
        }
      `}</style>
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
