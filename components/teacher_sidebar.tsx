import React from "react";
import { useRouter } from "next/router";

const teacherSidebar: React.FC = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="group w-16 hover:w-64 bg-gray-900 text-white h-screen fixed transition-all duration-300 overflow-hidden">
      <ul className="list-none p-0 m-0">
        <li className="flex items-center gap-4 p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800" onClick={() => navigateTo("/teacher_dashboard")}>📊<span className="hidden group-hover:inline">Teacher Dashboard</span></li>
        <li className="flex items-center gap-4 p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800" onClick={() => navigateTo("/teacher_profile")}>👨‍🏫<span className="hidden group-hover:inline">Teacher Profile</span></li>
        <li className="flex items-center gap-4 p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800" onClick={() => navigateTo("/teacher_tasks")}>🎓<span className="hidden group-hover:inline">Teacher Tasks</span></li>
        <li className="flex items-center gap-4 p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800" onClick={() => navigateTo("/timetable-edit")}>📅<span className="hidden group-hover:inline">Timetable</span></li>
      </ul>
    </div>
  );
};

export default teacherSidebar;