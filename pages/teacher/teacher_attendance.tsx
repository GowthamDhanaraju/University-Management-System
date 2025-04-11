import React, { useState, useEffect } from "react";
import Sidebar from "../../components/teacher_sidebar";
import TopBar from "@/components/topbar";
import { FaTasks, FaCalendarAlt } from "react-icons/fa";
import Typography from "@mui/material/Typography";
import { Dialog, DialogContent, DialogTitle, DialogActions, Button } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useRouter } from "next/router";

const TeacherAttendance: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [courseList, setCourseList] = useState<Array<{ id: string; name: string }>>([]);
  const [studentList, setStudentList] = useState<Array<{ id: string; name: string; roll: string }>>([]);
  const [attendanceData, setAttendanceData] = useState<Record<string, Record<string, Record<string, string>>>>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [openDateDialog, setOpenDateDialog] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(false);
  const [tempAttendance, setTempAttendance] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const dateString = selectedDate.toISOString().split("T")[0];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get("/api/teacher/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && Array.isArray(response.data)) {
          const courses = response.data.map((course: any) => ({
            id: course.id || String(course._id),
            name: course.name || course.title,
          }));

          setCourseList(courses);

          // Select the first course by default if available
          if (courses.length > 0) {
            setSelectedCourse(courses[0].id);
            fetchStudents(courses[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [router]);

  const fetchStudents = async (courseId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(`/api/teacher/courses/${courseId}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && Array.isArray(response.data)) {
        const students = response.data.map((student: any) => ({
          id: student.id || String(student._id),
          name: student.name,
          roll: student.rollNumber || student.studentId,
        }));

        setStudentList(students);
        fetchAttendance(courseId);
      }
    } catch (err) {
      console.error(`Failed to fetch students for course ${courseId}:`, err);
      setError("Failed to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async (courseId: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const formattedDate = selectedDate.toISOString().split("T")[0];

      const response = await axios.get(`/api/teacher/attendance/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { date: formattedDate },
      });

      if (response.data) {
        // Transform API response to our attendanceData format
        const courseAttendance = { ...attendanceData };

        if (!courseAttendance[courseId]) {
          courseAttendance[courseId] = {};
        }

        courseAttendance[courseId][formattedDate] = {};

        // Map attendance records
        response.data.forEach((record: any) => {
          if (record.studentId && record.status) {
            courseAttendance[courseId][formattedDate][record.studentId] = record.status;
          }
        });

        setAttendanceData(courseAttendance);
      }
    } catch (err) {
      console.error(`Failed to fetch attendance for course ${courseId}:`, err);
    }
  };

  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCourseId = event.target.value;
    setSelectedCourse(newCourseId);
    setEditingAttendance(false);
    fetchStudents(newCourseId);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setOpenDateDialog(false);
      setEditingAttendance(false);

      if (selectedCourse) {
        fetchAttendance(selectedCourse);
      }
    }
  };

  const startEditing = () => {
    setEditingAttendance(true);
    setTempAttendance({ ...(attendanceData[selectedCourse]?.[dateString] || {}) });
  };

  const cancelEditing = () => {
    setEditingAttendance(false);
  };

  const saveAttendance = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      // Prepare attendance records for API
      const attendanceRecords = Object.entries(tempAttendance).map(([studentId, status]) => ({
        studentId,
        status,
        date: dateString,
        courseId: selectedCourse,
      }));

      await axios.post(
        "/api/teacher/attendance",
        {
          courseId: selectedCourse,
          date: dateString,
          records: attendanceRecords,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
      setAttendanceData((prev) => ({
        ...prev,
        [selectedCourse]: {
          ...(prev[selectedCourse] || {}),
          [dateString]: tempAttendance,
        },
      }));

      setEditingAttendance(false);
    } catch (err) {
      console.error("Failed to save attendance:", err);
      alert("Failed to save attendance. Please try again.");
    }
  };

  const updateAttendance = (studentId: string, status: string) => {
    setTempAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const calculateStats = () => {
    const studentCount = studentList.length;
    let presentCount = 0;
    let absentCount = 0;
    let dutyLeaveCount = 0;
    let medicalCount = 0;
    let notTakenCount = 0;

    const currentAttendance = attendanceData[selectedCourse]?.[dateString] || {};

    studentList.forEach((student) => {
      const status = currentAttendance[student.id];
      if (status === "present") presentCount++;
      else if (status === "absent") absentCount++;
      else if (status === "dutyLeave") dutyLeaveCount++;
      else if (status === "medical") medicalCount++;
      else notTakenCount++;
    });

    return {
      total: studentCount,
      present: presentCount,
      absent: absentCount,
      dutyLeave: dutyLeaveCount,
      medical: medicalCount,
      notTaken: notTakenCount,
    };
  };
  
  // Helper function to get students for the current course
  const getCurrentCourseStudents = () => {
    return studentList;
  };
  
  // Calculate the stats for the current view
  const stats = calculateStats();

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 ml-16">
        <TopBar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-1">Attendance Management</h1>
                <p className="text-gray-400">Record and manage student attendance</p>
              </div>
              
              <div className="flex gap-4 mt-4 sm:mt-0">
                <div>
                  <label htmlFor="course-select" className="block text-sm font-medium text-gray-400 mb-1">
                    Select Course
                  </label>
                  <select
                    id="course-select"
                    value={selectedCourse}
                    onChange={handleCourseChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {courseList.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                  <button
                    onClick={() => setOpenDateDialog(true)}
                    className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-gray-100 hover:bg-gray-750 transition-colors"
                  >
                    <FaCalendarAlt className="text-gray-400" />
                    {selectedDate.toLocaleDateString()}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Action Button */}
            <div className="flex justify-end mb-4">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-4">
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
                  {courseList.find(c => c.id === selectedCourse)?.name} - {selectedDate.toLocaleDateString()}
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
