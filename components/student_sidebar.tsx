import React from "react";
import { useRouter } from "next/router";
import { FiBook, FiUser, FiBarChart2, FiTruck, FiClipboard, FiAward } from "react-icons/fi";


const StudentSidebar: React.FC = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="group w-16 hover:w-64 bg-gray-900 text-white h-screen fixed transition-all duration-300 overflow-hidden border-r border-gray-700">
      <ul className="list-none p-0 m-0">
        <li className="flex items-center gap-4 p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800 whitespace-nowrap" onClick={() => navigateTo("/student_dashboard")}>
          <FiBarChart2 className="text-xl" /><span className="hidden group-hover:inline-block">Student Dashboard</span>
        </li>
        <li className="flex items-center gap-4 p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800 whitespace-nowrap" onClick={() => navigateTo("/student_profile")}>
          <FiUser className="text-xl" /><span className="hidden group-hover:inline-block">Student Profile</span>
        </li>
        <li className="flex items-center gap-4 p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800 whitespace-nowrap" onClick={() => navigateTo("/student_grade")}>
          <FiAward className="text-xl" /><span className="hidden group-hover:inline-block">Student Grades</span>
        </li>
        <li className="flex items-center gap-4 p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800 whitespace-nowrap" onClick={() => navigateTo("/student_attendance")}>
          <FiClipboard className="text-xl" /><span className="hidden group-hover:inline-block">Attendance</span>
        </li>
        <li className="flex items-center gap-4 p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800 whitespace-nowrap" onClick={() => navigateTo("/library")}>
          <FiBook className="text-xl" /><span className="hidden group-hover:inline-block">Library</span>
        </li>
        <li className="flex items-center gap-4 p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800 whitespace-nowrap" onClick={() => navigateTo("/transport")}>
          <FiTruck className="text-xl" /><span className="hidden group-hover:inline-block">Transport</span>
        </li>
      </ul>
    </div>
  );
};

export default StudentSidebar;
