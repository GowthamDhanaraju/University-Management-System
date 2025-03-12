import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "@/components/admin_sidebar";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const Header: React.FC = () => {
  return (
    <header className="p-4 bg-gray-700 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
    </header>
  );
};

interface StatCardProps {
  title: string;
  content: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, content }) => {
  return (
    <div className="bg-gray-700 text-white p-4 rounded-lg shadow-md text-center min-w-[250px]">
      <h3 className="text-red-400 text-lg font-semibold">{title}</h3>
      <p className="text-lg font-bold mt-2">{content}</p>
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
    <div className="ml-20 p-4 w-full h-screen flex flex-col">
      <Header />
      <div className="grid grid-cols-3 gap-4 mt-4">
        <StatCard title="Total Faculty Members" content={<><b>CSE:</b> 25 <br/><b>CSE AI:</b> 18 <br/><b>CYS:</b> 12</>} />
        <StatCard title="Upcoming Events" content={<><b>Convocation - March 15</b><br/>AB3 Hall<br/><br/><b>Hackathon - March 20</b><br/>Amriteshwari Hall</>} />
        <StatCard title="Hostelers & Day Scholars" content={<><b>Hostelers:</b> 230 <br/><b>Day Scholars:</b> 520</>} />
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
