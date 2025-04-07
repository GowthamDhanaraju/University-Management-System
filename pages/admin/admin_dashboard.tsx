import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminSidebar from "@/components/admin_sidebar";
import { Bar, Pie, Line } from "react-chartjs-2";
import "chart.js/auto";

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center border border-gray-700">
      <div>
        <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm">Welcome back, Administrator</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <span className="bg-green-500 h-2.5 w-2.5 rounded-full mr-2"></span>
          <span className="text-gray-300">Online</span>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm">
          Generate Report
        </button>
      </div>
    </header>
  );
};

interface StatCardProps {
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, content, icon }) => {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md text-center border border-gray-700">
      <div className="flex items-center mb-2">
        {icon && <div className="mr-2 text-blue-400">{icon}</div>}
        <h3 className="text-blue-400 text-lg font-semibold">{title}</h3>
      </div>
      <div className="text-md">{content}</div>
    </div>
  );
};

const QuickActionButton: React.FC<{ label: string; icon: React.ReactNode; onClick: () => void }> = ({ 
  label, icon, onClick 
}) => {
  return (
    <button 
      onClick={onClick}
      className="flex items-center justify-center flex-col p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
    >
      <div className="text-blue-400 mb-2">{icon}</div>
      <span className="text-gray-200 text-sm">{label}</span>
    </button>
  );
};

const Dashboard: React.FC = () => {
  const router = useRouter();
  
  // Sample data for charts
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

  const studentDistributionData = {
    labels: ['CSE', 'AI & DS', 'AI & ML', 'Cyber Security', 'ECE', 'Mechanical'],
    datasets: [
      {
        label: 'Students',
        data: [350, 275, 180, 120, 220, 105],
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ],
        borderWidth: 1,
      },
    ],
  };

  const monthlyFeesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Collection (Lakhs)',
        data: [25, 30, 35, 22, 18, 28, 32, 37, 29, 33, 36, 31],
        fill: false,
        borderColor: '#4BC0C0',
        tension: 0.1,
      },
    ],
  };

  const recentActivities = [
    { id: 1, action: "New teacher added", time: "10 minutes ago", user: "Admin" },
    { id: 2, action: "Timetable updated for CSE-B", time: "1 hour ago", user: "Prof. Sharma" },
    { id: 3, action: "New book added to library", time: "2 hours ago", user: "Librarian" },
    { id: 4, action: "Feedback submitted for CS301", time: "3 hours ago", user: "Student" },
    { id: 5, action: "Auditorium booked for Annual Day", time: "Yesterday", user: "Event Coordinator" },
  ];
  const criticalFeedback = [
    { id: 1, course: "CS301", feedback: "The lectures are too fast-paced.", rating: 2 },
    { id: 2, course: "AI201", feedback: "More examples needed in assignments.", rating: 1 },
    { id: 3, course: "CYS102", feedback: "Labs often crash or are disorganized.", rating: 1 },
  ];
  <div className="mt-6">
  <StatCard
    title="Critical Feedback"
    content={
      <ul className="text-left space-y-3 mt-2">
        {criticalFeedback.map((item) => (
          <li key={item.id} className="border-l-4 border-red-600 pl-3">
            <div className="font-medium text-white">{item.course}</div>
            <div className="text-sm text-gray-400">"{item.feedback}"</div>
            <div className="text-xs text-yellow-500">Rating: {item.rating}/5</div>
          </li>
        ))}
      </ul>
    }
    icon={
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-1.414-1.414L12 9.172 7.05 4.222 5.636 5.636 10.586 10.586 5.636 15.536l1.414 1.414L12 12.828l4.95 4.95 1.414-1.414-4.95-4.95z" />
      </svg>
    }
  />
</div>

  return (
    <div className="ml-16 p-6 w-full min-h-screen bg-gray-900">
      <Header />
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <StatCard 
          title="Faculty" 
          content={<span className="text-xl font-bold">55</span>}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>}
        />
        <StatCard 
          title="Students" 
          content={<span className="text-xl font-bold">1,250</span>}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>}
        />
        <StatCard 
          title="Books" 
          content={<span className="text-xl font-bold">8,750</span>}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>}
        />
        <StatCard 
          title="Buses" 
          content={<span className="text-xl font-bold">15</span>}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>}
        />
      </div>
      
      {/* Department and Student Info */}
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
                <div className="font-medium">AI Specializations</div>
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
              <li className="border-l-4 border-blue-500 pl-2">
                <div className="font-medium">AI Workshop</div>
                <div className="text-sm text-gray-400">March 25, Main Auditorium</div>
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
              <li className="border-l-4 border-green-500 pl-2">
                <div className="font-medium">Bus Users</div>
                <div className="text-sm text-gray-400">485 students</div>
              </li>
            </ul>
          }
        />
      </div>
      
      {/* Quick Actions */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

          <QuickActionButton 
            label="Add Book" 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>} 
            onClick={() => router.push('/admin/admin_books')}
          />
          <QuickActionButton 
            label="Edit Timetable" 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>} 
            onClick={() => router.push('/admin/admin_timetable')}
          />
          <QuickActionButton 
            label="Book Auditorium" 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>} 
            onClick={() => router.push('/admin/admin_auditorium')}
          />
          <QuickActionButton 
            label="View Clubs" 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>} 
            onClick={() => router.push('/admin/admin_clubs')}
          />
        </div>
      </div>
      
      {/* Charts and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Class Attendance</h3>
          <div className="h-64">
            <Bar 
              data={attendanceData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false, 
                scales: { y: { beginAtZero: true, max: 100 } } 
              }} 
            />
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Student Distribution</h3>
          <div className="h-64 flex justify-center">
            <Pie 
              data={studentDistributionData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
              }} 
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Fee Collection</h3>
          <div className="h-64">
            <Line 
              data={monthlyFeesData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
              }} 
            />
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Recent Activities</h3>
          <div className="space-y-3 max-h-64 overflow-auto">
            {recentActivities.map(activity => (
              <div key={activity.id} className="border-l-4 border-blue-500 pl-3 py-2">
                <div className="text-white font-medium">{activity.action}</div>
                <div className="text-gray-400 text-sm flex justify-between">
                  <span>{activity.time}</span>
                  <span>{activity.user}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
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