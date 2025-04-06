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
    { icon: <HomeIcon className="w-6 h-6" />, path: "/admin_dashboard", label: "Dashboard" },
    { icon: <UserGroupIcon className="w-6 h-6" />, path: "/admin_smanage", label: "Students" },
    { icon: <UserGroupIcon className="w-6 h-6" />, path: "/admin_tmanage", label: "Teachers" },
    { icon: <BookOpenIcon className="w-6 h-6" />, path: "/admin_books", label: "Books" },
    { icon: <CalendarIcon className="w-6 h-6" />, path: "/admin_timetable", label: "Timetable" },
    { icon: <BuildingOfficeIcon className="w-6 h-6" />, path: "/admin_auditorium", label: "Auditorium" },
    { icon: <TruckIcon className="w-6 h-6" />, path: "/admin_transport", label: "Transport" },
    { icon: <BuildingLibraryIcon className="w-6 h-6" />, path: "/admin_library", label: "Library" },
    { icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />, path: "/admin_feedback", label: "Feedback" },
    { icon: <UserCircleIcon className="w-6 h-6" />, path: "/admin_clubs", label: "Clubs" },
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-16 bg-gray-900 border-r border-gray-700 flex flex-col justify-between items-center py-4">
      <div className="flex flex-col items-center space-y-6">
        {menuItems.map((item) => (
          <Link 
            href={item.path} 
            key={item.path}
            className={`p-2 rounded-lg transition-all duration-200 tooltip-container ${
              currentPath === item.path ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            }`}
          >
            {item.icon}
            <span className="tooltip">{item.label}</span>
          </Link>
        ))}
      </div>
      <Link 
        href="/logout" 
        className="p-2 text-red-400 hover:text-red-300 tooltip-container"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="tooltip">Logout</span>
      </Link>
      
      <style jsx>{`
        .tooltip-container {
          position: relative;
        }
        .tooltip {
          visibility: hidden;
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          background-color: #1e293b;
          color: white;
          text-align: center;
          padding: 4px 8px;
          border-radius: 4px;
          margin-left: 8px;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.3s;
          z-index: 1;
        }
        .tooltip-container:hover .tooltip {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default AdminSidebar;