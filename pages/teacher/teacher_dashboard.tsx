import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import TeacherSidebar from "@/components/teacher_sidebar";
import TopBar from "@/components/topbar";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";

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

// Calendar Component
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
        const formattedDate = date.toISOString().split("T")[0];
        
        try {
          const response = await axios.get(`/api/teacher/schedule?date=${formattedDate}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSchedule(response.data);
        } catch (err) {
          console.error("Schedule fetch error:", err);
          // Fallback data
          setSchedule([
            {
              id: "1",
              courseName: "CS101: Intro to Programming",
              section: "CSE-A",
              time: "9:00 AM - 10:30 AM",
              room: "Room 301",
              day: "Monday"
            },
            {
              id: "2",
              courseName: "CS202: Data Structures",
              section: "CSE-A",
              time: "11:00 AM - 12:30 PM",
              room: "Lab 2",
              day: "Monday"
            }
          ]);
        }
      } catch (err) {
        console.error("Failed to process schedule:", err);
        setError("Unable to load schedule");
        setSchedule([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [date]);

  const currentDay = date.getDate();
  const calendarDates = Array.from({ length: 7 }, (_, i) => currentDay - 3 + i);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-blue-400 text-lg font-semibold mb-2">Calendar</h3>
      <div className="grid grid-cols-7 gap-1">
        {calendarDates.map((d) => (
          <div
            key={d}
            className={`text-center py-2 rounded-full ${
              currentDay === d ? "bg-blue-600" : "hover:bg-gray-700"
            } cursor-pointer`}
          >
            {d}
          </div>
        ))}
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
        let response;
        
        try {
          response = await axios.get("/api/teacher/courses", {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          console.error("Courses fetch error:", err);
          // Fallback data
          return [
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
          ];
        }

        // Remove duplicate courses by ID
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
          {/* Courses */}
          <div className="w-1/2 ml-6 bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700">
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
          <div className="w-1/2 ml-6 bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 h-[320px]">
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
          <div className="w-1/2 bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-blue-400 text-lg font-semibold mb-3">
              Upcoming Events & Workshops
            </h3>
            <ul className="text-left space-y-2">
              {events.length > 0 ? (
                events.map((event) => (
                  <li
                    key={event.id}
                    className="border-l-4 border-indigo-500 pl-2"
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(event.date).toLocaleDateString()} •{" "}
                      {event.location}
                    </div>
                  </li>
                ))
              ) : (
                <li>No upcoming events</li>
              )}
            </ul>
          </div>

          {/* Calendar */}
          <div className="w-1/2">
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
