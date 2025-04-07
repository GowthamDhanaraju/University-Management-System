import React from "react";
import { useRouter } from "next/router";
import { FiUser, FiBarChart2, FiAward, FiChevronRight } from "react-icons/fi";
import { FaChalkboardTeacher, FaClipboardList, FaUsers, FaComments, FaTasks, FaUniversity, FaUser } from "react-icons/fa";

const StudentSidebar: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const menuItems = [
    { path: "/student/student_dashboard", icon: <FiBarChart2 className="text-xl" />, label: "Dashboard" },
    { path: "/student/student_profile", icon: <FiUser className="text-xl" />, label: "Profile" },
    { path: "/student/student_grade", icon: <FiAward className="text-xl" />, label: "Grades" },
    { path: "/student/student_courses", icon: <FaClipboardList className="text-xl" />, label: "Courses" },
    { path: "/student/student_faculties", icon: <FaChalkboardTeacher className="text-xl" />, label: "Faculties" },
    { path: "/student/student_attendance", icon: <FaTasks className="text-xl" />, label: "Attendance" },
    { path: "/student/student_clubs", icon: <FaUsers className="text-xl" />, label: "Clubs" },
    { path: "/student/student_feedback", icon: <FaComments className="text-xl" />, label: "Feedback" },
    { path: "/library", icon: <FaUniversity className="text-xl" />, label: "Library" }
  ];
  
  return (
    <div className="group w-20 hover:w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white h-screen fixed transition-all duration-300 ease-in-out overflow-hidden border-r border-gray-700 shadow-xl">
      <ul className="list-none p-2 m-0">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={`flex items-center gap-4 p-3 rounded-lg mx-2 mb-1 cursor-pointer transition-all duration-200 ${
              currentPath === item.path
                ? "bg-gray-700 text-black shadow-inner"
                : "hover:bg-gray-700 hover:pl-4"
            }`}
            onClick={() => navigateTo(item.path)}
          >
            <div className="min-w-[24px] flex justify-center">
              {React.cloneElement(item.icon, {
                className: `text-xl ${currentPath === item.path ? "text-white" : "text-gray-300"}`,
              })}
            </div>
            <span className="hidden group-hover:inline-block font-medium text-gray-200">
              {item.label}
            </span>
            <FiChevronRight className="ml-auto hidden group-hover:inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </li>
        ))}
      </ul>

      <div className="absolute bottom-0 w-full p-4 border-t border-gray-700 hidden group-hover:block bg-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <FaUser className="text-white" />
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="font-medium">Student Name</p>
            <p className="text-xs text-gray-400">student@university.edu</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;