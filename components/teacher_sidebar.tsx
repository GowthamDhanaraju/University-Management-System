import React from "react";
import { useRouter } from "next/router";
import { 
  ChartBarIcon, 
  UserIcon, 
  CalendarIcon, 
  BookOpenIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon,
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";

const TeacherSidebar: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const menuItems = [
    { icon: <ChartBarIcon className="w-6 h-6" />, path: "/teacher/teacher_dashboard", label: "Dashboard" },
    { icon: <UserIcon className="w-6 h-6" />, path: "/teacher/teacher_profile", label: "Profile" },
    { icon: <CalendarIcon className="w-6 h-6" />, path: "/teacher/teacher_timetable", label: "Timetable" },
    { icon: <BookOpenIcon className="w-6 h-6" />, path: "/teacher/teacher_courses", label: "Courses" },
    { icon: <BuildingOfficeIcon className="w-6 h-6" />, path: "/teacher/teacher_auditorium", label: "Auditorium" },
    { icon: <ClipboardDocumentCheckIcon className="w-6 h-6" />, path: "/teacher/teacher_attendance", label: "Attendance" },
    { icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />, path: "/teacher/teacher_feedback", label: "Feedback" },
  ];

  return (
    <div className="group w-16 hover:w-64 bg-gray-900 text-white h-screen fixed transition-all duration-300 ease-in-out overflow-hidden border-r border-gray-700">
      <div className="flex flex-col items-center space-y-2 mt-4 w-full">
        {menuItems.map((item) => (
          <div
            key={item.path}
            className={`flex items-center w-11/12 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              currentPath === item.path 
                ? "bg-blue-600 text-white" 
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            }`}
            onClick={() => router.push(item.path)}
          >
            <div className="min-w-[24px] flex justify-center">
              {item.icon}
            </div>
            <span className="ml-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherSidebar;
