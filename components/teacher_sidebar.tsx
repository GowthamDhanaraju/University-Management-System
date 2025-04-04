import React from "react";
import { useRouter } from "next/router";

const TeacherSidebar: React.FC = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="group w-16 hover:w-64 bg-gray-900 text-white h-screen fixed transition-all duration-300 overflow-hidden border-r border-gray-700">
      <ul className="list-none p-0 m-0">
        <li className="flex items-center gap-4 p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800 whitespace-nowrap" onClick={() => navigateTo("/teacher_dashboard")}>
          📊<span className="hidden group-hover:inline-block">Teacher Dashboard</span>
        </li>
        <li className="flex items-center gap-4 p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800 whitespace-nowrap" onClick={() => navigateTo("/teacher_profile")}>
          👨‍🏫<span className="hidden group-hover:inline-block">Teacher Profile</span>
        </li>
        <li className="flex items-center gap-4 p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800 whitespace-nowrap" onClick={() => navigateTo("/teacher_tasks")}>
          🎓<span className="hidden group-hover:inline-block">Teacher Tasks</span>
        </li>
        <li className="flex items-center gap-4 p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800 whitespace-nowrap" onClick={() => navigateTo("/timetable-edit")}>
          📅<span className="hidden group-hover:inline-block">Timetable</span>
        </li>
        <li className="flex items-center gap-4 p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800 whitespace-nowrap" onClick={() => navigateTo("/courses")}>
          📚<span className="hidden group-hover:inline-block">Courses</span>
        </li>
        <li className="flex items-center gap-4 p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800 whitespace-nowrap" onClick={() => navigateTo("/students")}>
          🎒<span className="hidden group-hover:inline-block">Students</span>
        </li>
        <li className="flex items-center gap-4 p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800 whitespace-nowrap" onClick={() => navigateTo("/clubdetails")}>
          🏆<span className="hidden group-hover:inline-block">Club Details</span>
        </li>
        <li className="flex items-center gap-4 p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800 whitespace-nowrap" onClick={() => navigateTo("/auditorium")}>
          🎭<span className="hidden group-hover:inline-block">Auditorium</span>
        </li>
        <li className="flex items-center gap-4 p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800 whitespace-nowrap" onClick={() => navigateTo("/publications")}>
          📖<span className="hidden group-hover:inline-block">Publications</span>
        </li>
      </ul>
    </div>
  );
};

export default TeacherSidebar;
