import React, { useState, useEffect } from "react";
import TeacherSidebar from "@/components/teacher_sidebar";
import TopBar from "@/components/topbar";
import { CalendarIcon, MapPinIcon, UserGroupIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";

const TIME_SLOTS = [
  "9:00 - 9:50", "10:00 - 10:50", "11:00 - 11:50",
  "12:00 - 12:50", "1:00 - 1:50", "2:00 - 2:50",
  "3:00 - 3:50", "4:00 - 4:50"
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const CLASSES = ["CSE-A", "CSE-B", "CSE-C", "CSE-D", "AID-A", "AID-B"];

interface ClassSession {
  id: string;
  subject: string;
  className: string;
  room: string;
  type: "lecture" | "lab" | "tutorial" | "break";
}

type TeacherTimetable = {
  [day: string]: {
    [timeSlot: string]: ClassSession | null;
  };
};

const generateTeacherTimetable = (): TeacherTimetable => {
  const timetable: TeacherTimetable = {};
  DAYS.forEach(day => {
    timetable[day] = {};
    TIME_SLOTS.forEach(timeSlot => {
      if (timeSlot === "1:00 - 1:50") {
        timetable[day][timeSlot] = {
          id: "BREAK",
          subject: "Lunch Break",
          className: "",
          room: "",
          type: "break"
        };
      } else {
        const hasClass = Math.random() < 0.3;
        if (hasClass) {
          const subjectIndex = Math.floor(Math.random() * CLASSES.length);
          const classIndex = Math.floor(Math.random() * CLASSES.length);
          const roomNumber = Math.floor(Math.random() * 10) + 101;
          const sessionTypes: ("lecture" | "lab" | "tutorial")[] = ["lecture", "lab", "tutorial"];
          const sessionType = sessionTypes[Math.floor(Math.random() * sessionTypes.length)];
          timetable[day][timeSlot] = {
            id: `${day}-${timeSlot}`,
            subject: CLASSES[subjectIndex],
            className: CLASSES[classIndex],
            room: sessionType === "lab" ? `Lab ${roomNumber}` : `Room ${roomNumber}`,
            type: sessionType
          };
        } else {
          timetable[day][timeSlot] = null;
        }
      }
    });
  });
  return timetable;
};

const TeacherTimetable: React.FC = () => {
  const [timetable, setTimetable] = useState<TeacherTimetable>({});
  const [filterDay, setFilterDay] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentDay, setCurrentDay] = useState<string>("");
  const [teacherInfo, setTeacherInfo] = useState({
    id: "",
    name: "",
    department: "",
    subjects: [] as string[]
  });
  const router = useRouter();

  useEffect(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    setCurrentDay(today === 'Sunday' || today === 'Saturday' ? 'Monday' : today);

    const fetchTimetableData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const profileResponse = await axios.get("/api/teacher/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (profileResponse.data) {
          setTeacherInfo({
            id: profileResponse.data.facultyId || "T102",
            name: profileResponse.data.name || "Unknown",
            department: profileResponse.data.department || "Unknown",
            subjects: profileResponse.data.subjects || []
          });
        }

        const timetableResponse = await axios.get("/api/teacher/timetable", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (timetableResponse.data) {
          const formattedTimetable: TeacherTimetable = {};
          DAYS.forEach(day => {
            formattedTimetable[day] = {};
            TIME_SLOTS.forEach(timeSlot => {
              formattedTimetable[day][timeSlot] = null;
            });
          });

          timetableResponse.data.forEach((session: any) => {
            if (session.day && session.timeSlot) {
              formattedTimetable[session.day][session.timeSlot] = {
                id: session.id || `${session.day}-${session.timeSlot}`,
                subject: session.subject || session.courseName,
                className: session.className || session.section,
                room: session.room || session.location,
                type: session.type || "lecture"
              };
            }
          });

          setTimetable(formattedTimetable);
        } else {
          setTimetable(generateTeacherTimetable());
        }
      } catch (err) {
        console.error("Failed to fetch timetable:", err);
        setTimetable(generateTeacherTimetable());
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimetableData();
  }, [router]);

  const handleFilterDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterDay(e.target.value);
  };

  const getCellColorClass = (session: ClassSession | null) => {
    if (!session) return "bg-gray-800/50";
    if (session.type === "break") return "bg-gray-700";
    const typeColors = {
      lecture: "bg-blue-900/60",
      lab: "bg-green-900/60",
      tutorial: "bg-purple-900/60"
    };
    return typeColors[session.type];
  };

  const daysToDisplay = filterDay ? [filterDay] : DAYS;

  const getTeachingHours = () => {
    let count = 0;
    Object.values(timetable).forEach(day => {
      Object.values(day).forEach(session => {
        if (session && session.type !== "break") count++;
      });
    });
    return count;
  };

  const getNextClass = () => {
    if (!timetable[currentDay]) return null;
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    const convertTimeToMinutes = (timeSlot: string) => {
      const [hours, minutes] = timeSlot.split(' - ')[0].split(':').map(Number);
      return hours * 60 + minutes;
    };

    for (const timeSlot in timetable[currentDay]) {
      const session = timetable[currentDay][timeSlot];
      if (!session || session.type === "break") continue;
      const classTimeInMinutes = convertTimeToMinutes(timeSlot);
      if (classTimeInMinutes > currentTimeInMinutes) {
        return { timeSlot, session };
      }
    }

    return null;
  };

  if (isLoading) {
    return (
      <div className="flex bg-gray-900 min-h-screen">
        <TeacherSidebar />
        <div className="ml-16 p-6 w-full text-white">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3">Loading your timetable...</span>
          </div>
        </div>
      </div>
    );
  }

  const nextClass = getNextClass();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex">
      <TeacherSidebar />
      <div className="flex-1 p-6 ml-16">
        <TopBar />
        <div className="flex flex-col gap-6 ml-6 mr-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 mr-4 bg-blue-500 rounded-xl shadow-lg">
                <CalendarIcon className="text-gray-100 w-6 h-6" />
              </div>
              <Typography variant="h4" component="h1" className="font-bold bg-blue-500 bg-clip-text text-transparent">
                My Teaching Schedule
              </Typography>
            </div>
            <select
              id="day-filter"
              value={filterDay}
              onChange={handleFilterDayChange}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Days</option>
              {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
            </select>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-900/70 p-4 rounded-lg border border-blue-700/50 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-blue-800 rounded-lg mr-3">
                  <ClockIcon className="h-6 w-6 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-blue-200 text-sm font-medium">Teaching Hours</h3>
                  <p className="text-white text-xl font-bold">{getTeachingHours()} hrs/week</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-900/70 p-4 rounded-lg border border-purple-700/50 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-purple-800 rounded-lg mr-3">
                  <UserGroupIcon className="h-6 w-6 text-purple-200" />
                </div>
                <div>
                  <h3 className="text-purple-200 text-sm font-medium">Teaching Classes</h3>
                  <p className="text-white text-xl font-bold">{teacherInfo.subjects.length || 3} Subjects</p>
                </div>
              </div>
            </div>
            <div className="bg-green-900/70 p-4 rounded-lg border border-green-700/50 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-green-800 rounded-lg mr-3">
                  <MapPinIcon className="h-6 w-6 text-green-200" />
                </div>
                <div>
                  <h3 className="text-green-200 text-sm font-medium">Department</h3>
                  <p className="text-white text-xl font-bold">{teacherInfo.department}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Class */}
          {nextClass && (
            <div className="bg-indigo-900/70 p-4 rounded-lg border border-indigo-700/50 shadow-lg">
              <h3 className="text-lg font-medium text-white mb-2 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 text-indigo-300" />
                Next Class
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-200 font-medium">{nextClass.session.subject}</p>
                  <p className="text-gray-300 text-sm">{nextClass.session.className} • {nextClass.session.room}</p>
                </div>
                <div className="bg-indigo-800/80 px-3 py-1 rounded-lg text-white font-medium">
                  {nextClass.timeSlot}
                </div>
              </div>
            </div>
          )}

          {/* Timetable Grid */}
          <div className="overflow-x-auto mt-4 bg-gray-900/50 rounded-xl border border-gray-800 w-[1320px]">
            <table className="min-w-full divide-y divide-gray-800">
              <thead>
                <tr>
                  <th className="py-3 px-4 bg-gray-800 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                  {daysToDisplay.map(day => (
                    <th key={day} className={`py-3 px-4 bg-gray-800 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${day === currentDay ? "bg-gray-700" : ""}`}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {TIME_SLOTS.map(timeSlot => (
                  <tr key={timeSlot} className="hover:bg-gray-800/60">
                    <td className="py-3 px-4 text-sm font-medium text-gray-300">{timeSlot}</td>
                    {daysToDisplay.map(day => {
                      const session = timetable[day]?.[timeSlot];
                      return (
                        <td key={`${day}-${timeSlot}`} className={`py-2 px-4 text-sm text-gray-300 ${getCellColorClass(session)}`}>
                          {session ? (
                            <div className="p-2">
                              <div className="font-medium">{session.subject}</div>
                              {session.type !== "break" && (
                                <>
                                  <div className="text-xs text-gray-400 flex items-center">
                                    <UserGroupIcon className="h-3 w-3 mr-1" />{session.className}
                                  </div>
                                  <div className="text-xs text-gray-400 flex items-center">
                                    <MapPinIcon className="h-3 w-3 mr-1" />{session.room}
                                  </div>
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="p-2 text-gray-500 italic">Free</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center">
              <span className="w-4 h-4 inline-block mr-2 rounded bg-blue-900/60"></span>
              <span className="text-sm text-gray-400">Lecture</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 inline-block mr-2 rounded bg-green-900/60"></span>
              <span className="text-sm text-gray-400">Lab</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 inline-block mr-2 rounded bg-purple-900/60"></span>
              <span className="text-sm text-gray-400">Tutorial</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 inline-block mr-2 rounded bg-gray-700"></span>
              <span className="text-sm text-gray-400">Break</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 inline-block mr-2 rounded bg-gray-800/50"></span>
              <span className="text-sm text-gray-400">Free</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeacherTimetable;
