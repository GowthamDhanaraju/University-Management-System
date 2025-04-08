import React, { useState, useEffect } from "react";
import Sidebar from "../../components/teacher_sidebar";
import { FaTasks, FaChevronDown, FaChevronUp, FaCalendarAlt } from "react-icons/fa";
import Typography from "@mui/material/Typography";
import { Dialog, DialogContent, DialogTitle, DialogActions, Button } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Mock data for courses taught by teacher
const teacherCourses = [
  { id: "CS101", name: "Introduction to Computer Science", 
    students: [
      { id: "S001", name: "John Doe", roll: "CSE001" },
      { id: "S002", name: "Jane Smith", roll: "CSE002" },
      { id: "S003", name: "Bob Johnson", roll: "CSE003" },
      { id: "S004", name: "Alice Brown", roll: "CSE004" },
      { id: "S005", name: "Chris Davis", roll: "CSE005" },
    ]
  },
  { id: "CS201", name: "Data Structures", 
    students: [
      { id: "S006", name: "Emily Wilson", roll: "CSE006" },
      { id: "S007", name: "Michael Clark", roll: "CSE007" },
      { id: "S008", name: "Sarah Miller", roll: "CSE008" },
      { id: "S009", name: "David Taylor", roll: "CSE009" },
    ]
  },
  { id: "CS301", name: "Database Management Systems", 
    students: [
      { id: "S010", name: "James Anderson", roll: "CSE010" },
      { id: "S011", name: "Olivia White", roll: "CSE011" },
      { id: "S012", name: "Thomas Martin", roll: "CSE012" },
    ]
  },
];

// Mock attendance data
const mockAttendanceData = {
  "CS101": {
    "2023-05-15": {
      "S001": "present",
      "S002": "present",
      "S003": "absent",
      "S004": "present",
      "S005": "dutyLeave",
    },
    "2023-05-16": {
      "S001": "present",
      "S002": "medical",
      "S003": "present",
      "S004": "present",
      "S005": "present",
    }
  },
  "CS201": {
    "2023-05-15": {
      "S006": "present",
      "S007": "absent",
      "S008": "present",
      "S009": "present",
    }
  },
  "CS301": {
    "2023-05-15": {
      "S010": "present",
      "S011": "present",
      "S012": "medical",
    }
  }
};

const TeacherAttendance: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>(teacherCourses[0].id);
  const [attendanceData, setAttendanceData] = useState(mockAttendanceData);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [openDateDialog, setOpenDateDialog] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(false);
  const [tempAttendance, setTempAttendance] = useState<{[key: string]: string}>({});

  const dateString = selectedDate.toISOString().split('T')[0];
  
  const getCurrentCourseStudents = () => {
    return teacherCourses.find(course => course.id === selectedCourse)?.students || [];
  };

  // Initialize attendance data for a new date if not exists
  useEffect(() => {
    if (selectedCourse && dateString) {
      if (!attendanceData[selectedCourse]) {
        setAttendanceData(prev => ({
          ...prev,
          [selectedCourse]: {}
        }));
      }
      
      if (!attendanceData[selectedCourse]?.[dateString]) {
        const newAttendance: {[key: string]: string} = {};
        getCurrentCourseStudents().forEach(student => {
          newAttendance[student.id] = "notTaken";
        });
        
        setAttendanceData(prev => ({
          ...prev,
          [selectedCourse]: {
            ...(prev[selectedCourse] || {}),
            [dateString]: newAttendance
          }
        }));

        setTempAttendance(newAttendance);
      } else {
        setTempAttendance(attendanceData[selectedCourse][dateString] || {});
      }
    }
  }, [selectedCourse, dateString]);

  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(event.target.value);
    setEditingAttendance(false);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setOpenDateDialog(false);
    setEditingAttendance(false);
  };

  const startEditing = () => {
    setEditingAttendance(true);
    setTempAttendance({...(attendanceData[selectedCourse]?.[dateString] || {})});
  };

  const cancelEditing = () => {
    setEditingAttendance(false);
  };

  const saveAttendance = () => {
    setAttendanceData(prev => ({
      ...prev,
      [selectedCourse]: {
        ...(prev[selectedCourse] || {}),
        [dateString]: tempAttendance
      }
    }));
    setEditingAttendance(false);
  };

  const updateAttendance = (studentId: string, status: string) => {
    setTempAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Calculate statistics
  const calculateStats = () => {
    const students = getCurrentCourseStudents();
    const studentCount = students.length;
    let presentCount = 0;
    let absentCount = 0;
    let dutyLeaveCount = 0;
    let medicalCount = 0;
    let notTakenCount = 0;

    const currentAttendance = attendanceData[selectedCourse]?.[dateString] || {};
    
    students.forEach(student => {
      const status = currentAttendance[student.id];
      if (status === "present") presentCount++;
      else if (status === "absent") absentCount++;
      else if (status === "dutyLeave") dutyLeaveCount++;
      else if (status === "medical") medicalCount++;
      else if (status === "notTaken") notTakenCount++;
    });

    return {
      total: studentCount,
      present: presentCount,
      absent: absentCount,
      dutyLeave: dutyLeaveCount,
      medical: medicalCount,
      notTaken: notTakenCount,
      presentPercentage: studentCount > 0 ? (presentCount / studentCount) * 100 : 0
    };
  };

  const stats = calculateStats();

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-200 overflow-x-hidden">
      {/* Sidebar */}
      <div className="fixed z-50">
        <Sidebar />
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-6 ml-16 w-[calc(100%-4rem)] relative">
        <div className="flex-1 p-4">
          <div className="w-full mx-auto max-w-7xl">
            {/* Header */}
            <div className="flex items-center mb-6">
              <div className="p-3 mr-4 bg-blue-500 rounded-xl shadow-lg">
                <FaTasks className="text-gray-100 text-2xl" />
              </div>
              <Typography 
                variant="h4" 
                component="h1" 
                className="font-bold bg-blue-500 bg-clip-text text-transparent"
              >
                Live Attendance
              </Typography>
            </div>

            {/* Top action bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-gray-800 p-4 rounded-xl">
              {/* Course selection */}
              <div className="flex items-center gap-3">
                <select
                  className="p-3 pl-4 pr-10 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  value={selectedCourse}
                  onChange={handleCourseChange}
                  aria-label="Select course"
                >
                  {teacherCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({course.id})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setOpenDateDialog(true)}
                  className="p-3 flex items-center justify-center gap-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  aria-label="Select date"
                >
                  <FaCalendarAlt className="text-blue-400" />
                  <span>{selectedDate.toLocaleDateString()}</span>
                </button>
              </div>

              {!editingAttendance ? (
                <button
                  onClick={startEditing}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors"
                  aria-label="Take attendance"
                >
                  Take Attendance
                </button>
              ) : (
                <div className="flex gap-4">
                  <button
                    onClick={cancelEditing}
                    className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-md transition-colors"
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveAttendance}
                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-colors"
                    aria-label="Save attendance"
                  >
                    Save Attendance
                  </button>
                </div>
              )}
            </div>

            {/* Stats cards - simplified */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
              <div className="bg-gray-800 p-3 rounded-xl shadow-md hover:bg-gray-750 transition-colors">
                <h3 className="text-xs font-semibold text-gray-400">Total</h3>
                <p className="text-xl font-bold text-gray-200">{stats.total}</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-xl shadow-md hover:bg-gray-750 transition-colors">
                <h3 className="text-xs font-semibold text-gray-400">Not Taken</h3>
                <p className="text-xl font-bold text-gray-400">{stats.notTaken}</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-xl shadow-md hover:bg-gray-750 transition-colors">
                <h3 className="text-xs font-semibold text-gray-400">Present</h3>
                <p className="text-xl font-bold text-green-400">{stats.present}</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-xl shadow-md hover:bg-gray-750 transition-colors">
                <h3 className="text-xs font-semibold text-gray-400">Absent</h3>
                <p className="text-xl font-bold text-red-400">{stats.absent}</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-xl shadow-md hover:bg-gray-750 transition-colors">
                <h3 className="text-xs font-semibold text-gray-400">Duty Leave</h3>
                <p className="text-xl font-bold text-yellow-400">{stats.dutyLeave}</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-xl shadow-md hover:bg-gray-750 transition-colors">
                <h3 className="text-xs font-semibold text-gray-400">Medical</h3>
                <p className="text-xl font-bold text-blue-400">{stats.medical}</p>
              </div>
            </div>

            {/* Students Attendance Table */}
            <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gray-750 p-3 flex justify-between items-center">
                <h3 className="font-medium text-gray-100">
                  {teacherCourses.find(c => c.id === selectedCourse)?.name} - {selectedDate.toLocaleDateString()}
                </h3>
                {editingAttendance && (
                  <div className="text-sm text-gray-400">
                    Click on status to change • {stats.notTaken} remaining
                  </div>
                )}
              </div>
              <table className="w-full" aria-label="Student attendance list">
                <thead>
                  <tr className="bg-gray-700 text-gray-100">
                    <th className="p-3 text-left">Roll No</th>
                    <th className="p-3 text-left">Student Name</th>
                    <th className="p-3 text-center">Attendance Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-700">
                  {getCurrentCourseStudents().length > 0 ? (
                    getCurrentCourseStudents().map((student) => {
                      const currentStatus = editingAttendance 
                        ? tempAttendance[student.id] 
                        : attendanceData[selectedCourse]?.[dateString]?.[student.id] || "notTaken";
                      
                      return (
                        <tr key={student.id} className="hover:bg-gray-750 transition-colors">
                          <td className="p-3 text-gray-300">{student.roll}</td>
                          <td className="p-3">
                            <div className="font-medium text-gray-100">{student.name}</div>
                            <div className="text-sm text-gray-400">{student.id}</div>
                          </td>
                          <td className="p-3 text-center">
                            {editingAttendance ? (
                              <div className="flex justify-center gap-2">
                                <button 
                                  onClick={() => updateAttendance(student.id, "present")}
                                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors
                                    ${currentStatus === 'present' ? 'bg-green-700 text-white' : 'bg-gray-700 text-green-400 hover:bg-green-900'}`}
                                >
                                  Present
                                </button>
                                <button 
                                  onClick={() => updateAttendance(student.id, "absent")}
                                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors
                                    ${currentStatus === 'absent' ? 'bg-red-700 text-white' : 'bg-gray-700 text-red-400 hover:bg-red-900'}`}
                                >
                                  Absent
                                </button>
                                <div className="relative group">
                                  <button 
                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors
                                      ${currentStatus !== 'present' && currentStatus !== 'absent' && currentStatus !== 'notTaken' ? 'bg-blue-700 text-white' : 'bg-gray-700 text-blue-400 hover:bg-blue-900'}`}
                                  >
                                    {currentStatus === 'notTaken' ? 'More...' : 
                                     currentStatus === 'dutyLeave' ? 'Duty Leave' : 
                                     currentStatus === 'medical' ? 'Medical' : 'More...'}
                                  </button>
                                  <div className="absolute z-10 right-0 mt-1 hidden group-hover:block">
                                    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1">
                                      <button 
                                        onClick={() => updateAttendance(student.id, "dutyLeave")}
                                        className="block w-full text-left px-4 py-1 text-sm text-yellow-400 hover:bg-gray-700"
                                      >
                                        Duty Leave
                                      </button>
                                      <button 
                                        onClick={() => updateAttendance(student.id, "medical")}
                                        className="block w-full text-left px-4 py-1 text-sm text-blue-400 hover:bg-gray-700"
                                      >
                                        Medical
                                      </button>
                                      <button 
                                        onClick={() => updateAttendance(student.id, "notTaken")}
                                        className="block w-full text-left px-4 py-1 text-sm text-gray-400 hover:bg-gray-700"
                                      >
                                        Not Taken
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                                ${currentStatus === 'present' ? 'bg-green-900 bg-opacity-30 text-green-400' : 
                                  currentStatus === 'absent' ? 'bg-red-900 bg-opacity-30 text-red-400' : 
                                  currentStatus === 'dutyLeave' ? 'bg-yellow-900 bg-opacity-30 text-yellow-400' : 
                                  currentStatus === 'medical' ? 'bg-blue-900 bg-opacity-30 text-blue-400' : 
                                  'bg-gray-700 bg-opacity-30 text-gray-400'}`}
                              >
                                {currentStatus === 'notTaken' ? 'Not Taken' : 
                                 currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-6 text-center text-gray-400">
                        No students found for this course.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Date Picker Dialog */}
      <Dialog open={openDateDialog} onClose={() => setOpenDateDialog(false)}>
        <DialogTitle className="bg-gray-800 text-gray-200">Select Date</DialogTitle>
        <DialogContent className="bg-gray-800 text-gray-200 pt-4">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            inline
            className="bg-gray-700 text-white border-gray-600"
          />
        </DialogContent>
        <DialogActions className="bg-gray-800">
          <Button onClick={() => setOpenDateDialog(false)} className="text-gray-300">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TeacherAttendance;
