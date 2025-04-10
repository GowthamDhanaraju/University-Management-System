import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import TeacherSidebar from "@/components/teacher_sidebar";
import TopBar from "@/components/topbar";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";

// Interfaces for API response types
interface TeacherProfile {
  name: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
}

interface Course {
  id: string;
  code: string;
  name: string;
  sections: string[];
  students: number;
}

interface ClassSchedule {
  id: string;
  courseName: string;
  section: string;
  time: string;
  room: string;
  day: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
}

// Components
const ProfileCard: React.FC = () => {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/teacher/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">Loading profile...</div>;
  if (error) return <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 text-red-400">{error}</div>;
  if (!profile) return null;

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
          {profile.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-bold text-xl">{profile.name}</h3>
          <p className="text-gray-400">{profile.designation}, {profile.department}</p>
          <div className="flex space-x-2 mt-1 text-sm">
            <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeachingCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/teacher/courses", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(response.data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700">Loading courses...</div>;
  if (error) return <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700 text-red-400">{error}</div>;
  if (courses.length === 0) return <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700">No courses assigned yet.</div>;

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-blue-400 text-lg font-semibold mb-3">
        Current Courses
      </h3>
      <div className="space-y-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex justify-between items-center p-2 bg-gray-750 rounded hover:bg-gray-600 cursor-pointer"
            onClick={() =>
              router.push(`/teacher/teacher_courses?id=${course.id}`)
            }
          >
            <div>
              <h4 className="font-medium">
                {course.code}: {course.name}
              </h4>
              <p className="text-sm text-gray-400">
                {course.sections.join(", ")}
              </p>
            </div>
            <span className="bg-green-600 text-xs px-2 py-1 rounded">
              {course.students} Students
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  content: React.ReactNode;
}> = ({ title, content }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-blue-400 text-lg font-semibold mb-3">{title}</h3>
      {content}
    </div>
  );
};

const Calendar: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [schedule, setSchedule] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const formattedDate = date.toISOString().split('T')[0];
        const response = await axios.get(`/api/teacher/schedule?date=${formattedDate}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSchedule(response.data);
      } catch (err) {
        console.error("Failed to fetch schedule:", err);
        setError("Failed to load schedule");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchedule();
  }, [date]);

  const currentDay = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDates = Array.from({ length: 7 }, (_, i) => currentDay - 3 + i);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-blue-400 text-lg font-semibold mb-2">Calendar</h3>
      
      <div className="grid grid-cols-7 gap-1">
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
        {loading && <div className="text-gray-400 text-sm py-2">Loading schedule...</div>}
        {error && <div className="text-red-400 text-sm py-2">{error}</div>}
        {!loading && !error && schedule.length === 0 && <div className="text-gray-400 text-sm py-2">No classes scheduled for today</div>}
        {!loading && !error && schedule.length > 0 && (
          <ul className="mt-2 space-y-2">
            {schedule.map(item => (
              <li key={item.id} className="flex justify-between">
                <span>{item.courseName} ({item.section})</span>
                <span className="text-green-400">{item.time}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const TeacherDashboard: React.FC = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      
      if (!token || role !== "teacher") {
        router.push("/login");
        return;
      }
      
      try {
        // Fetch upcoming events
        const eventsResponse = await axios.get("/api/teacher/events", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(eventsResponse.data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Could not load some dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  // Performance data for the chart
  const performanceData = {
    labels: ["CS101", "CS202", "CS303", "AI401", "NLP505", "ML606"],
    datasets: [
      {
        label: "Average Score",
        data: [85, 78, 92, 88, 74, 69],
        backgroundColor: ["#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#9b59b6", "#1abc9c"],
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex">
      <TeacherSidebar />

      <div className="flex-1 ml-16 p-6">
        <TopBar />

        <div className="mt-6 ml-6">
          <ProfileCard />
        </div>

        <div className="mt-6 flex gap-6">
          <div className="w-1/2 ml-6">
            <TeachingCourses />
          </div>

          <div className="w-1/2 ml-6">
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

        <div className="mt-6 flex gap-6">
          <div className="w-1/2 ml-6">
            <StatCard 
              title="Upcoming Events & Workshops" 
              content={
                <ul className="text-left space-y-2">
                  {loading && <li>Loading events...</li>}
                  {error && <li className="text-red-400">Error loading events</li>}
                  {!loading && !error && events.length === 0 && <li className="text-gray-400">No upcoming events</li>}
                  {!loading && !error && events.map((event) => (
                    <li key={event.id} className="border-l-4 border-indigo-500 pl-2">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-400">{new Date(event.date).toLocaleDateString()} • {event.location}</div>
                    </li>
                  ))}
                </ul>
              } 
            />
          </div>

          <div className="w-1/2 ml-6">
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;