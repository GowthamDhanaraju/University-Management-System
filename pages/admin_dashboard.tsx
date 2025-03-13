import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "@/components/admin_sidebar";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center border border-gray-700">
      <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
      <div className="flex items-center">
        <span className="bg-green-500 h-2.5 w-2.5 rounded-full mr-2"></span>
        <span className="text-gray-300">Online</span>
      </div>
    </header>
  );
};

interface StatCardProps {
  title: string;
  content: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, content }) => {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md text-center border border-gray-700">
      <h3 className="text-blue-400 text-lg font-semibold">{title}</h3>
      <div className="text-md mt-2">{content}</div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const attendanceData = {
    labels: ["CSE-A", "CSE-B", "CSE-C", "CSE-D", "AID-A", "AID-B", "AIE-A", "AIE-B", "AIE-C", "CYS-A"],
    datasets: [
      {
        label: "Attendance (%)",
        data: [90, 85, 88, 80, 75, 60, 77, 100, 89, 68],
        backgroundColor: ["#3498db", "#2980b9", "#2ecc71", "#27ae60", "#e74c3c", "#c0392b", "#9b59b6", "#8e44ad", "#a29bfe", "#2c3e50"],
      },
    ],
  };

  return (
    <div className="ml-16 p-6 w-full min-h-screen bg-gray-900">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <StatCard 
          title="Total Faculty Members" 
          content={
            <ul className="text-left space-y-2 mt-2">
              <li className="border-l-4 border-blue-500 pl-2">
                <div className="font-medium">Computer Science</div>
                <div className="text-sm text-gray-400">25 faculty members</div>
              </li>
              <li className="border-l-4 border-green-500 pl-2">
                <div className="font-medium">CSE AI</div>
                <div className="text-sm text-gray-400">18 faculty members</div>
              </li>
              <li className="border-l-4 border-red-500 pl-2">
                <div className="font-medium">CYS</div>
                <div className="text-sm text-gray-400">12 faculty members</div>
              </li>
            </ul>
          }
        />
        <StatCard 
          title="Upcoming Events" 
          content={
            <ul className="text-left space-y-2 mt-2">
              <li className="border-l-4 border-yellow-500 pl-2">
                <div className="font-medium">Convocation</div>
                <div className="text-sm text-gray-400">March 15, AB3 Hall</div>
              </li>
              <li className="border-l-4 border-purple-500 pl-2">
                <div className="font-medium">Hackathon</div>
                <div className="text-sm text-gray-400">March 20, Amriteshwari Hall</div>
              </li>
            </ul>
          }
        />
        <StatCard 
          title="Hostelers & Day Scholars" 
          content={
            <ul className="text-left space-y-2 mt-2">
              <li className="border-l-4 border-pink-500 pl-2">
                <div className="font-medium">Hostelers</div>
                <div className="text-sm text-gray-400">230 students</div>
              </li>
              <li className="border-l-4 border-indigo-500 pl-2">
                <div className="font-medium">Day Scholars</div>
                <div className="text-sm text-gray-400">520 students</div>
              </li>
            </ul>
          }
        />
      </div>
      <div className="flex-grow mt-6 w-full">
        <Bar data={attendanceData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } } }} />
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole !== "admin") router.push("/");
    setRole(storedRole || "");
  }, [router]);

  return (
    <div className="flex">
      <AdminSidebar />
      <Dashboard />
    </div>
  );
};

export default AdminDashboard;
