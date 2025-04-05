import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TeacherSidebar from "@/components/teacher_sidebar";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const Header: React.FC = () => {
  return (
    <header className="p-4 bg-gray-800 shadow-md flex justify-between items-center rounded-lg border border-gray-700">
      <h1 className="text-xl font-bold text-white">Teacher Dashboard</h1>
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

const ProfileCard: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md border border-gray-700 flex items-center">
      <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold">
        DR
      </div>
      <div className="ml-6">
        <h2 className="text-xl font-bold">Dr. Ramesh Kumar</h2>
        <p className="text-gray-400">Associate Professor, Computer Science</p>
        <div className="flex mt-2">
          <div className="mr-6">
            <p className="text-sm text-gray-400">Email</p>
            <p>ramesh.kumar@university.edu</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Faculty ID</p>
            <p>CSE-2145</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Calendar: React.FC = () => {
  // Simple calendar display - in a real app, you'd use a calendar library
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  
  // Generate calendar dates (simplified)
  const calendarDates = Array.from({ length: 30 }, (_, i) => i + 1);
  
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-blue-400 text-lg font-semibold mb-3">March 2025</h3>
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => (
          <div key={day} className="text-center text-gray-400 text-sm py-1">{day}</div>
        ))}
        {calendarDates.map(date => (
          <div 
            key={date} 
            className={`text-center py-2 rounded-full ${currentDay === date ? 'bg-blue-600' : 'hover:bg-gray-700'} cursor-pointer`}
          >
            {date}
          </div>
        ))}
      </div>
      <div className="mt-3 border-t border-gray-700 pt-3">
        <h4 className="text-white font-medium">Todays Schedule</h4>
        <ul className="mt-2 space-y-2">
          <li className="flex justify-between">
            <span>Data Structures</span>
            <span className="text-green-400">10:00-11:30</span>
          </li>
          <li className="flex justify-between">
            <span>Faculty Meeting</span>
            <span className="text-green-400">14:00-15:00</span>
          </li>
          <li className="flex justify-between">
            <span>Office Hours</span>
            <span className="text-green-400">16:00-17:30</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const TeachingCourses: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-blue-400 text-lg font-semibold mb-3">Current Courses</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-2 bg-gray-750 rounded hover:bg-gray-600 cursor-pointer">
          <div>
            <h4 className="font-medium">CS301: Data Structures</h4>
            <p className="text-sm text-gray-400">CSE-A, CSE-B</p>
          </div>
          <span className="bg-green-600 text-xs px-2 py-1 rounded">120 Students</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer">
          <div>
            <h4 className="font-medium">CS405: Machine Learning</h4>
            <p className="text-sm text-gray-400">CSE-C, AID-A</p>
          </div>
          <span className="bg-green-600 text-xs px-2 py-1 rounded">95 Students</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer">
          <div>
            <h4 className="font-medium">CS210: Algorithm Analysis</h4>
            <p className="text-sm text-gray-400">CYS-A</p>
          </div>
          <span className="bg-green-600 text-xs px-2 py-1 rounded">60 Students</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const performanceData = {
    labels: ["CSE-A", "CSE-B", "CSE-C", "CSE-D", "AID-A", "AID-B"],
    datasets: [
      {
        label: "Average Marks (%)",
        data: [85, 78, 92, 88, 74, 69],
        backgroundColor: ["#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#9b59b6", "#1abc9c"],
      },
    ],
  };

  return (
    <div className="ml-16 p-4 w-full min-h-screen bg-gray-900">
      <Header />
      
      {/* Profile Overview */}
      <div className="mt-4">
        <ProfileCard />
      </div>
      
      {/* First row - Upcoming Classes and Current Courses side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <StatCard 
          title="Upcoming Classes" 
          content={
            <ul className="text-left space-y-2">
              <li className="border-l-4 border-blue-500 pl-2">
                <div className="font-medium">Data Structures</div>
                <div className="text-sm text-gray-400">Today, 10:00 AM • Room 405</div>
              </li>
              <li className="border-l-4 border-green-500 pl-2">
                <div className="font-medium">Algorithm Analysis</div>
                <div className="text-sm text-gray-400">Today, 2:00 PM • Room 302</div>
              </li>
              <li className="border-l-4 border-purple-500 pl-2">
                <div className="font-medium">Machine Learning</div>
                <div className="text-sm text-gray-400">Tomorrow, 11:30 AM • Lab 2</div>
              </li>
            </ul>
          } 
        />
        
        <TeachingCourses />
      </div>
      
      {/* Second row - Events/Workshops and Class Performance side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <StatCard 
          title="Upcoming Events & Workshops" 
          content={
            <ul className="text-left space-y-2">
              <li className="border-l-4 border-yellow-500 pl-2">
                <div className="font-medium">Faculty Development Program</div>
                <div className="text-sm text-gray-400">March 15, 2025 • Main Auditorium</div>
              </li>
              <li className="border-l-4 border-red-500 pl-2">
                <div className="font-medium">AI Workshop for Students</div>
                <div className="text-sm text-gray-400">March 18, 2025 • Computer Lab</div>
              </li>
              <li className="border-l-4 border-indigo-500 pl-2">
                <div className="font-medium">Research Symposium</div>
                <div className="text-sm text-gray-400">March 22, 2025 • Conference Hall</div>
              </li>
            </ul>
          } 
        />
        
        {/* Performance Chart */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
          <h3 className="text-blue-400 text-lg font-semibold mb-2">Class Performance</h3>
          <div className="h-64">
            <Bar 
              data={performanceData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false, 
                scales: { 
                  y: { 
                    beginAtZero: true, 
                    max: 100,
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    }
                  },
                  x: {
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    }
                  }
                },
                plugins: {
                  legend: {
                    labels: {
                      color: 'white'
                    }
                  }
                } 
              }} 
            />
          </div>
        </div>
      </div>
      
      {/* Calendar Section */}
      <div className="mt-4">
        <Calendar />
      </div>
    </div>
  );
};

const TeacherDashboard: React.FC = () => {
  const router = useRouter();
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole !== "teacher") router.push("/");
  }, [router]);

  return (
    <div className="flex">
      <TeacherSidebar />
      <Dashboard />
    </div>
  );
};

export default TeacherDashboard;