import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { 
  HomeIcon, 
  UserGroupIcon, 
  BookOpenIcon, 
  CalendarIcon, 
  BuildingOfficeIcon, 
  TruckIcon, 
  BuildingLibraryIcon, 
  ChatBubbleLeftRightIcon, 
  UserCircleIcon
} from "@heroicons/react/24/outline";

const AdminSidebar: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const menuItems = [
    { icon: <HomeIcon className="w-6 h-6" />, path: "/admin/admin_dashboard", label: "Dashboard" },
    { icon: <UserGroupIcon className="w-6 h-6" />, path: "/admin/admin_studentmanage", label: "Students" },
    { icon: <UserGroupIcon className="w-6 h-6" />, path: "/admin/admin_teachermanage", label: "Teachers" },
    { icon: <BookOpenIcon className="w-6 h-6" />, path: "/admin/admin_books", label: "Books" },
    { icon: <CalendarIcon className="w-6 h-6" />, path: "/admin/admin_timetable", label: "Timetable" },
    { icon: <BuildingOfficeIcon className="w-6 h-6" />, path: "/admin/admin_auditorium", label: "Auditorium" },
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-16 hover:w-56 bg-gray-900 border-r border-gray-700 flex flex-col justify-between items-center py-4 transition-all duration-300 group overflow-hidden">
      <div className="flex flex-col items-center space-y-6 w-full">
        {menuItems.map((item) => (
          <Link 
            href={item.path} 
            key={item.path}
            className={`p-2 rounded-lg flex items-center w-11/12 transition-all duration-200 ${
              currentPath === item.path ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            }`}
          >
            <div className="min-w-[24px] flex justify-center">
              {item.icon}
            </div>
            <span className="ml-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
      <Link 
        href="/logout" 
        className="p-2 text-red-400 hover:text-red-300 flex items-center w-11/12"
      >
        <div className="min-w-[24px] flex justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>
        <span className="ml-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Logout
        </span>
      </Link>
    </div>
  );
};

export default AdminSidebar;