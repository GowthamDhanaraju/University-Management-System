import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import TeacherSidebar from "@/components/teacher_sidebar";
import TopBar from "@/components/topbar";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Interfaces
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

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
}

// Calendar Component
const Calendar: React.FC = () => {
  const current = new Date();
  const [year, setYear] = useState(current.getFullYear());
  const [month, setMonth] = useState(current.getMonth());

  const handleMonthChange = (dir: number) => {
    if (dir === -1 && month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else if (dir === 1 && month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + dir);
    }
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const today = current.getDate();
  const events = [
    { date: 15, title: "Midterm Exam", color: "bg-red-500" },
    { date: 20, title: "Project Submission", color: "bg-blue-500" },
    { date: 25, title: "Guest Lecture", color: "bg-green-500" },
  ];

  return (
    <div className="bg-gray-800 text-white p-6 rounded-xl shadow-lg border border-gray-700 h-full flex flex-col">
      <div className="bg-gray-700/50 p-4 rounded-lg shadow-inner mb-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => handleMonthChange(-1)}
            className="bg-gray-600 hover:bg-gray-500 p-2 rounded-full"
          >
            <FaChevronLeft />
          </button>
          <h3 className="text-gray-300 text-lg font-semibold">
            {new Date(year, month).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <button
            onClick={() => handleMonthChange(1)}
            className="bg-gray-600 hover:bg-gray-500 p-2 rounded-full"
          >
            <FaChevronRight />
          </button>
        </div>
        <div className="grid grid-cols-7 text-xs text-gray-400 mb-2">
          {days.map((day) => (
            <div key={day} className="text-center">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={i}></div>
          ))}
          {Array.from({ length: totalDays }, (_, i) => {
            const d = i + 1;
            const isToday =
              d === today &&
              month === current.getMonth() &&
              year === current.getFullYear();
            return (
              <div
                key={d}
                className={`relative text-center py-1 rounded-full cursor-pointer text-sm ${
                  isToday ? "bg-blue-600 text-white font-bold" : "hover:bg-gray-600"
                }`}
              >
                {d}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// TeacherDashboard Component
const TeacherDashboard: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = (): string => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      throw new Error("Authentication token not found. Please log in.");
    }
    return token;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const response = await axios.get("/api/teacher/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (err: any) {
        console.error("Profile fetch error:", err);
        // Use fallback data instead of breaking
        setProfile({
          name: "John Doe",
          department: "Computer Science",
          designation: "Assistant Professor",
          email: "john.doe@university.edu",
          phone: "123-456-7890"
        });
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = getToken();
        const response = await axios.get("/api/teacher/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const uniqueCourses = response.data.filter(
          (course: Course, index: number, self: Course[]) =>
            index === self.findIndex((c) => c.id === course.id)
        );

        setCourses(uniqueCourses);
      } catch (err) {
        console.error("Failed to process courses:", err);
        // Fallback data
        setCourses([
          {
            id: "cs101",
            code: "CS101",
            name: "Introduction to Programming",
            sections: ["CSE-A", "CSE-B"],
            students: 45
          },
          {
            id: "cs202",
            code: "CS202",
            name: "Data Structures",
            sections: ["CSE-A"],
            students: 38
          },
          {
            id: "cs303",
            code: "CS303",
            name: "Database Systems",
            sections: ["CSE-C"],
            students: 42
          }
        ]);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = getToken();
        const role = localStorage.getItem("role");
        if (role !== "teacher") {
          router.push("/login");
          return;
        }
        
        try {
          const response = await axios.get("/api/teacher/events", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEvents(response.data);
        } catch (err) {
          console.error("Events fetch error:", err);
          // Fallback data
          setEvents([
            {
              id: "1",
              title: "Faculty Meeting",
              date: new Date(Date.now() + 86400000).toISOString(),
              location: "Conference Room 302"
            },
            {
              id: "2",
              title: "Research Symposium",
              date: new Date(Date.now() + 259200000).toISOString(),
              location: "Main Auditorium"
            },
            {
              id: "3",
              title: "Course Planning Session",
              date: new Date(Date.now() + 604800000).toISOString(),
              location: "Department Office"
            }
          ]);
        }
      } catch (err) {
        console.error("Failed to process events:", err);
        // Fallback data for events
        setEvents([
          {
            id: "1",
            title: "Faculty Meeting",
            date: new Date(Date.now() + 86400000).toISOString(),
            location: "Conference Room 302"
          },
          {
            id: "2",
            title: "Research Symposium",
            date: new Date(Date.now() + 259200000).toISOString(),
            location: "Main Auditorium"
          },
          {
            id: "3",
            title: "Course Planning Session",
            date: new Date(Date.now() + 604800000).toISOString(),
            location: "Department Office"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const performanceData = {
    labels: ["CS101", "CS202", "CS303", "AI401", "NLP505", "ML606"],
    datasets: [
      {
        label: "Average Score",
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

        {/* Profile */}
        <div className="mt-6 ml-6">
          <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700">
            {profile ? (
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-xl">{profile.name}</h3>
                  <p className="text-gray-400">
                    {profile.designation}, {profile.department}
                  </p>
                </div>
              </div>
            ) : (
              <div>Failed to load profile</div>
            )}
          </div>
        </div>

        {/* Courses and Performance */}
        <div className="mt-6 flex gap-6">
          <div className="w-1/2 bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700 ml-6">
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

          {/* Performance Chart */}
          <div className="w-1/2 bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 h-[320px]">
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
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Events and Calendar */}
        <div className="mt-6 flex gap-6">
          {/* Events */}

          {/* Calendar */}
          <div className="w-full ml-6">
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
