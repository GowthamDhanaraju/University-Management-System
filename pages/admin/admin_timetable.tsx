import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin_sidebar";
import TopBar from "@/components/topbar";
import { PencilIcon, XMarkIcon, PlusIcon, CheckIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { Typography } from "@mui/material";

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

const CLASSES = [
  "CSE-A",
  "CSE-B",
  "CSE-C",
  "CSE-D",
  "AID-A",
  "AID-B",
  "AIE-A",
  "AIE-B",
  "CYS-A"
];

// Sample subjects data
const SUBJECTS = [
  { id: "CS301", name: "Data Structures", faculty: "Dr. Sharma" },
  { id: "CS302", name: "Database Systems", faculty: "Prof. Gupta" },
  { id: "CS303", name: "Operating Systems", faculty: "Dr. Verma" },
  { id: "CS304", name: "Computer Networks", faculty: "Dr. Singh" },
  { id: "CS305", name: "Web Technologies", faculty: "Prof. Kumar" },
  { id: "AI301", name: "Machine Learning", faculty: "Dr. Patel" },
  { id: "AI302", name: "Deep Learning", faculty: "Dr. Reddy" },
  { id: "AI303", name: "NLP", faculty: "Prof. Rao" },
  { id: "CY301", name: "Cybersecurity Fundamentals", faculty: "Dr. Malik" },
  { id: "CY302", name: "Network Security", faculty: "Prof. Joshi" },
  { id: "BREAK", name: "Lunch Break", faculty: "" },
  { id: "FREE", name: "Free Period", faculty: "" }
];

interface TimetableCell {
  id: string;
  subject: string;
  faculty: string;
}

type Timetable = {
  [className: string]: {
    [day: string]: {
      [timeSlot: string]: TimetableCell;
    };
  };
};

// Generate initial timetable data
const generateInitialTimetable = (): Timetable => {
  const timetable: Timetable = {};

  CLASSES.forEach(className => {
    timetable[className] = {};
    DAYS.forEach(day => {
      timetable[className][day] = {};
      TIME_SLOTS.forEach(timeSlot => {
        // Lunch break at 1:00 - 1:50
        if (timeSlot === "1:00 - 1:50") {
          timetable[className][day][timeSlot] = {
            id: "BREAK",
            subject: "Lunch Break",
            faculty: ""
          };
        } else {
          // Randomly assign subjects or free periods
          const randomSubject = Math.random() > 0.2 
            ? SUBJECTS[Math.floor(Math.random() * (SUBJECTS.length - 2))] 
            : SUBJECTS[SUBJECTS.length - 1]; // Free Period

          timetable[className][day][timeSlot] = {
            id: randomSubject.id,
            subject: randomSubject.name,
            faculty: randomSubject.faculty
          };
        }
      });
    });
  });

  return timetable;
};

const AdminTimetable: React.FC = () => {
  const [timetable, setTimetable] = useState<Timetable>({});
  const [selectedClass, setSelectedClass] = useState<string>(CLASSES[0]);
  const [editingCell, setEditingCell] = useState<{day: string, timeSlot: string} | null>(null);
  const [currentSubject, setCurrentSubject] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterDay, setFilterDay] = useState<string>("");

  useEffect(() => {
    // Initialize timetable data
    setTimetable(generateInitialTimetable());
  }, []);

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(e.target.value);
    setEditingCell(null);
  };

  const handleEditCell = (day: string, timeSlot: string) => {
    setEditingCell({ day, timeSlot });
    const currentCell = timetable[selectedClass]?.[day]?.[timeSlot];
    setCurrentSubject(currentCell?.id || "");
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setCurrentSubject("");
  };

  const handleSaveCell = () => {
    if (!editingCell) return;

    const { day, timeSlot } = editingCell;
    const selectedSubject = SUBJECTS.find(subj => subj.id === currentSubject);

    if (selectedSubject) {
      const updatedTimetable = { ...timetable };
      updatedTimetable[selectedClass][day][timeSlot] = {
        id: selectedSubject.id,
        subject: selectedSubject.name,
        faculty: selectedSubject.faculty
      };
      
      setTimetable(updatedTimetable);
    }
    
    setEditingCell(null);
    setCurrentSubject("");
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentSubject(e.target.value);
  };

  const handleClearCell = () => {
    if (!editingCell) return;

    const { day, timeSlot } = editingCell;
    const updatedTimetable = { ...timetable };
    
    updatedTimetable[selectedClass][day][timeSlot] = {
      id: "FREE",
      subject: "Free Period",
      faculty: ""
    };
    
    setTimetable(updatedTimetable);
    setEditingCell(null);
    setCurrentSubject("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterDay(e.target.value);
  };

  const getCellColorClass = (subjectId: string) => {
    if (subjectId === "BREAK") return "bg-gray-700 text-gray-300";
    if (subjectId === "FREE") return "bg-gray-800";
    
    // Different subjects get different background colors
    const subjectIndex = SUBJECTS.findIndex(s => s.id === subjectId);
    const colorClasses = [
      "bg-blue-900/50", "bg-green-900/50", "bg-purple-900/50", 
      "bg-red-900/50", "bg-yellow-900/50", "bg-indigo-900/50",
      "bg-pink-900/50", "bg-teal-900/50", "bg-orange-900/50", "bg-cyan-900/50"
    ];
    
    return colorClasses[subjectIndex % colorClasses.length];
  };

  // Filter days if a day filter is applied
  const daysToDisplay = filterDay ? [filterDay] : DAYS;

  if (!timetable[selectedClass]) {
    return (
      <div className="flex bg-gray-900 min-h-screen">
        <AdminSidebar />
        
        <div className="ml-16 p-6 w-full text-white">
          <div className="text-center mt-10">Loading timetable data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-900 min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6 ml-16">
          <TopBar />
          <div className="flex items-center space-x-4 ml-12">
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <CalendarIcon className="w-8 h-8" />
            </div>
            <Typography variant="h4" component="h1" className="font-bold bg-blue-500 bg-clip-text text-transparent">
              Time Table Creation
            </Typography>
          </div>
      <div className="ml-6 p-6 w-full text-gray-200">
        {/* Control Panel */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6 border border-gray-700">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-400 mb-1">Select Class</label>
              <select 
                value={selectedClass} 
                onChange={handleClassChange}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CLASSES.map(className => (
                  <option key={className} value={className}>{className}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-400 mb-1">Filter by Day</label>
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

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-400 mb-1">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search subjects or faculty..."
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-none mt-4">
              <button 
                onClick={() => setTimetable(generateInitialTimetable())}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Reset All Timetables
              </button>
            </div>
          </div>
        </div>

        {/* Timetable */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-3">Timetable for {selectedClass}</h2>
          
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border border-gray-700 bg-gray-800">Time Slots</th>
                {daysToDisplay.map(day => (
                  <th key={day} className="p-2 border border-gray-700 bg-gray-800">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map(timeSlot => {
                // Skip this row if searching and no match
                if (searchTerm) {
                  const hasMatch = daysToDisplay.some(day => {
                    const cell = timetable[selectedClass][day][timeSlot];
                    return (
                      cell.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      cell.faculty.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                  });
                  if (!hasMatch) return null;
                }

                return (
                  <tr key={timeSlot}>
                    <td className="p-2 border border-gray-700 bg-gray-800 font-medium">{timeSlot}</td>
                    {daysToDisplay.map(day => {
                      const cell = timetable[selectedClass][day][timeSlot];
                      const isEditing = editingCell?.day === day && editingCell?.timeSlot === timeSlot;
                      
                      // Skip this cell if searching and no match
                      if (searchTerm && !cell.subject.toLowerCase().includes(searchTerm.toLowerCase()) && 
                          !cell.faculty.toLowerCase().includes(searchTerm.toLowerCase())) {
                        return <td key={day} className="p-2 border border-gray-700 bg-gray-900"></td>;
                      }

                      return (
                        <td 
                          key={day} 
                          className={`p-0 border border-gray-700 relative ${
                            isEditing ? 'bg-gray-700' : getCellColorClass(cell.id)
                          }`}
                        >
                          {isEditing ? (
                            <div className="p-3">
                              <select
                                value={currentSubject}
                                onChange={handleSubjectChange}
                                className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white mb-2"
                              >
                                <option value="">Select Subject</option>
                                {SUBJECTS.map(subject => (
                                  <option key={subject.id} value={subject.id}>
                                    {subject.name} {subject.faculty ? `- ${subject.faculty}` : ''}
                                  </option>
                                ))}
                              </select>
                              <div className="flex justify-between mt-2">
                                <button
                                  onClick={handleSaveCell}
                                  className="p-1 text-green-400 hover:text-green-300"
                                >
                                  <CheckIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={handleClearCell}
                                  className="p-1 text-red-400 hover:text-red-300"
                                >
                                  <XMarkIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="p-1 text-gray-400 hover:text-gray-300"
                                >
                                  <XMarkIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div 
                              className="p-3 h-full cursor-pointer"
                              onClick={() => handleEditCell(day, timeSlot)}
                            >
                              <div className="font-medium text-sm">{cell.subject}</div>
                              {cell.faculty && <div className="text-xs text-gray-300">{cell.faculty}</div>}
                              <button
                                className="absolute top-1 right-1 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditCell(day, timeSlot);
                                }}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {/* Help text */}
          <div className="mt-4 text-sm text-gray-400 italic">
            <p>Click on any cell to edit. The lunch break (1:00 - 1:50) is fixed for all classes.</p>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md mt-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {SUBJECTS.slice(0, -2).map(subject => (
              <div key={subject.id} className="flex items-center">
                <div className={`w-4 h-4 ${getCellColorClass(subject.id)} rounded mr-2`}></div>
                <span className="text-sm">{subject.name}</span>
              </div>
            ))}
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-700 rounded mr-2"></div>
              <span className="text-sm">Lunch Break</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-800 border border-gray-700 rounded mr-2"></div>
              <span className="text-sm">Free Period</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default AdminTimetable;