import React, { useState, useEffect } from "react";
import TeacherSidebar from "@/components/teacher_sidebar";
import { CalendarIcon, MapPinIcon, UserGroupIcon, ClockIcon } from "@heroicons/react/24/outline";
import { FaChalkboardTeacher } from "react-icons/fa";

const TIME_SLOTS = [
  "9:00 - 9:50",
  "10:00 - 10:50",
  "11:00 - 11:50",
  "12:00 - 12:50",
  "1:00 - 1:50",
  "2:00 - 2:50",
  "3:00 - 3:50",
  "4:00 - 4:50"
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const CLASSES = ["CSE-A", "CSE-B", "CSE-C", "CSE-D", "AID-A", "AID-B"];

// Sample data for teacher's timetable
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

// Current teacher info
const TEACHER = {
  id: "T102",
  name: "Dr. Gupta",
  department: "Computer Science",
  subjects: ["Database Systems", "Theory of Computation"]
};

// Generate teacher timetable data
const generateTeacherTimetable = (): TeacherTimetable => {
  const timetable: TeacherTimetable = {};
  
  DAYS.forEach(day => {
    timetable[day] = {};
    TIME_SLOTS.forEach(timeSlot => {
      // Lunch break
      if (timeSlot === "1:00 - 1:50") {
        timetable[day][timeSlot] = {
          id: "BREAK",
          subject: "Lunch Break",
          className: "",
          room: "",
          type: "break"
        };
      } else {
        // 30% chance of having a class in this slot
        const hasClass = Math.random() < 0.3;
        
        if (hasClass) {
          const subjectIndex = Math.floor(Math.random() * TEACHER.subjects.length);
          const classIndex = Math.floor(Math.random() * CLASSES.length);
          const roomNumber = Math.floor(Math.random() * 10) + 101;
          const sessionTypes: ("lecture" | "lab" | "tutorial")[] = ["lecture", "lab", "tutorial"];
          const sessionType = sessionTypes[Math.floor(Math.random() * sessionTypes.length)];
          
          timetable[day][timeSlot] = {
            id: `${day}-${timeSlot}`,
            subject: TEACHER.subjects[subjectIndex],
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

  useEffect(() => {
    // Get current day of the week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    setCurrentDay(today === 'Sunday' || today === 'Saturday' ? 'Monday' : today);
    
    // Simulate API call to fetch timetable data
    setTimeout(() => {
      setTimetable(generateTeacherTimetable());
      setIsLoading(false);
    }, 800);
  }, []);

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

  // Filter days if a day filter is applied
  const daysToDisplay = filterDay ? [filterDay] : DAYS;

  // Count total teaching hours
  const getTeachingHours = () => {
    let count = 0;
    Object.values(timetable).forEach(day => {
      Object.values(day).forEach(session => {
        if (session && session.type !== "break") count++;
      });
    });
    return count;
  };

  // Get next class
  const getNextClass = () => {
    if (!timetable[currentDay]) return null;
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Convert to 24-hour format
    const convertTimeToMinutes = (timeSlot: string) => {
      const [startTime] = timeSlot.split(' - ');
      const [hours, minutes] = startTime.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    // Find the next class
    let nextClass: { timeSlot: string; session: ClassSession } | null = null;
    
    for (const timeSlot in timetable[currentDay]) {
      const session = timetable[currentDay][timeSlot];
      if (!session || session.type === "break") continue;
      
      const classTimeInMinutes = convertTimeToMinutes(timeSlot);
      
      if (classTimeInMinutes > currentTimeInMinutes) {
        nextClass = { timeSlot, session };
        break;
      }
    }
    
    return nextClass;
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
    <div className="flex bg-gray-900 min-h-screen">
      <TeacherSidebar />
      <div className="ml-16 p-6 w-full text-gray-200">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-blue-600 rounded-xl mr-4">
            <FaChalkboardTeacher className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-white">My Teaching Schedule</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-900/70 to-blue-800/40 p-4 rounded-lg border border-blue-700/50 shadow-lg">
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
          
          <div className="bg-gradient-to-br from-purple-900/70 to-purple-800/40 p-4 rounded-lg border border-purple-700/50 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-purple-800 rounded-lg mr-3">
                <UserGroupIcon className="h-6 w-6 text-purple-200" />
              </div>
              <div>
                <h3 className="text-purple-200 text-sm font-medium">Classes Assigned</h3>
                <p className="text-white text-xl font-bold">{CLASSES.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-900/70 to-green-800/40 p-4 rounded-lg border border-green-700/50 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-green-800 rounded-lg mr-3">
                <CalendarIcon className="h-6 w-6 text-green-200" />
              </div>
              <div>
                <h3 className="text-green-200 text-sm font-medium">Subjects</h3>
                <p className="text-white text-xl font-bold">{TEACHER.subjects.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Class Alert */}
        {nextClass && (
          <div className="bg-indigo-900/40 border border-indigo-700 rounded-lg p-4 mb-6 shadow-lg">
            <h3 className="text-indigo-300 font-medium flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Your Next Class
            </h3>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-xl font-bold text-white">{nextClass.session.subject}</span>
                <div className="ml-3 px-2 py-1 rounded bg-indigo-800 text-xs font-medium">
                  {nextClass.timeSlot}
                </div>
              </div>
              <div className="flex items-center text-indigo-300">
                <UserGroupIcon className="h-4 w-4 mr-1" />
                <span className="mr-4">{nextClass.session.className}</span>
                <span className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {nextClass.session.room}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">{TEACHER.name}'s Timetable</h2>
            
            <div className="w-48">
              <select 
                value={filterDay} 
                onChange={handleFilterDayChange}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Days</option>
                {DAYS.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Timetable */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto border border-gray-700">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border border-gray-700 bg-gray-800">Time</th>
                {daysToDisplay.map(day => (
                  <th key={day} className={`p-2 border border-gray-700 bg-gray-800 ${day === currentDay ? 'text-blue-400' : ''}`}>
                    {day}
                    {day === currentDay && <span className="ml-2 text-xs bg-blue-900 px-2 py-0.5 rounded-full">Today</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map(timeSlot => (
                <tr key={timeSlot}>
                  <td className="p-2 border border-gray-700 bg-gray-800 font-medium">{timeSlot}</td>
                  {daysToDisplay.map(day => {
                    const session = timetable[day]?.[timeSlot] || null;
                    
                    return (
                      <td 
                        key={day} 
                        className={`p-3 border border-gray-700 ${getCellColorClass(session)}`}
                      >
                        {session ? (
                          <div>
                            <div className="font-bold">{session.subject}</div>
                            <div className="text-sm">{session.className}</div>
                            <div className="text-xs">{session.room}</div>
                          </div>
                        ) : (
                          <div className="text-gray-500">Free</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherTimetable;