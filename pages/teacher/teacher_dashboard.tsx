import React, { useEffect, useState } from "react";
import StudentSidebar from "@/components/teacher_sidebar";
import TopBar from "@/components/topbar";
import { useRouter } from "next/router";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Header: React.FC = () => {
  const [time, setTime] = useState(new Date());
    useEffect(() => {
      const interval = setInterval(() => setTime(new Date()), 60000);
      return () => clearInterval(interval);
    }, []);
    const hour = time.getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
    
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md border border-gray-700 flex items-center">
      <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold">
        DR
      </div>
      <div className="ml-6">
        <h1 className="text-xl font-bold">{greeting}, Dr. Ramesh Kumar</h1>
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

const Calendar: React.FC = () => {
    const router = useRouter();
    const current = new Date();
    const [year, setYear] = useState(current.getFullYear());
    const [month, setMonth] = useState(current.getMonth());
  
    const handleMonthChange = (dir: number) => {
      if (dir === -1 && month === 0) {
        setMonth(11);
        setYear(y => y - 1);
      } else if (dir === 1 && month === 11) {
        setMonth(0);
        setYear(y => y + 1);
      } else {
        setMonth(m => m + dir);
      }
    };
  
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const today = current.getDate();

    return (
      <div className="bg-gray-800 text-white p-6 rounded-xl shadow-lg border border-gray-700 h-[480px] flex flex-col mt-8">
        
        {/* Calendar Grid */}
        <div className="bg-gray-700/50 p-4 rounded-lg shadow-inner mb-6">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => handleMonthChange(-1)} className="bg-gray-600 hover:bg-gray-500 p-2 rounded-full"><FaChevronLeft /></button>
            <h3 className="text-grey-300 text-lg font-semibold">
              {new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" })}
            </h3>
            <button onClick={() => handleMonthChange(1)} className="bg-gray-600 hover:bg-gray-500 p-2 rounded-full"><FaChevronRight /></button>
          </div>
          <div className="grid grid-cols-7 text-xs text-gray-400 mb-2">{days.map(day => <div key={day} className="text-center">{day}</div>)}</div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={i}></div>)}
            {Array.from({ length: totalDays }, (_, i) => {
              const d = i + 1;
              const isToday = d === today && month === current.getMonth() && year === current.getFullYear();
              return (
                <div key={d} className={`relative text-center py-1 rounded-full cursor-pointer text-sm ${isToday ? "bg-blue-600 text-white font-bold" : "hover:bg-gray-600"}`}>
                  {d}
                </div>
              );
            })}
          </div>
        </div>
      <div className="mt-3 border-t border-gray-700 pt-3">
        <h4 className="text-white font-medium">Todays Schedule</h4>
        <ul className="mt-2 space-y-2">
          <li className="flex justify-between">
            <span>Data Structures</span>
            <span className="text-blue-400">10:00-11:30</span>
          </li>
          <li className="flex justify-between">
            <span>Faculty Meeting</span>
            <span className="text-blue-400">14:00-15:00</span>
          </li>
          <li className="flex justify-between">
            <span>Office Hours</span>
            <span className="text-blue-400">16:00-17:30</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const TeachingCourses: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700 h-[320px]">
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

const TeacherDashboard = () => {
    const performanceData = {
      labels: ["CSE-A", "CSE-B", "CSE-C", "CSE-D", "AID-A", "AID-B"],
      datasets: [
        {
          label: "Average Marks (%)",
          data: [85, 78, 92, 88, 74, 69],
          backgroundColor: [
            "#3498db",
            "#2ecc71",
            "#e74c3c",
            "#f39c12",
            "#9b59b6",
            "#1abc9c",
          ],
        },
      ],
    };
  
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex">
        <StudentSidebar />
  
        {/* Main content area */}
        <div className="flex-1 ml-16 p-6">
          <TopBar />
  
          {/* Header */}
          <div className="mt-6 ml-6">
            <Header />
          </div>
  
          {/* Below header: TeachingCourses (left) & BarChart (right) */}
          <div className="mt-6 flex gap-6">
            {/* Teaching Courses - Left */}
            <div className="w-1/2 ml-6">
              <TeachingCourses />
            </div>
  
            {/* Class Performance Chart - Right */}
            <div className="w-1/2" ml-6>
              <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 h-[320px]">
                <h3 className="text-blue-400 text-lg font-semibold mb-2">
                  Class Performance
                </h3>
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
                            color: "rgba(255, 255, 255, 0.1)",
                          },
                        },
                        x: {
                          grid: {
                            color: "rgba(255, 255, 255, 0.1)",
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          labels: {
                            color: "white",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="ml-6">
            <Calendar />
          </div>
        </div>
      </div>
    );
  };
  
export default TeacherDashboard;