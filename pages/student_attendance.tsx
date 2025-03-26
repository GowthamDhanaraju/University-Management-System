import React, { useState } from "react";
import Sidebar from "../components/student_sidebar";
import { FaTasks } from "react-icons/fa";
import { attendanceData, SemesterAttendance, AttendanceRecord } from "../data/attendanceData";

const Attendance: React.FC = () => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string>(attendanceData[0].semester);

  const toggleRow = (SID: string) => {
    setExpandedRow(expandedRow === SID ? null : SID);
  };

  const handleSemesterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemester(event.target.value);
  };

  // Get the records of the selected semester
  const selectedSemesterData: AttendanceRecord[] =
    attendanceData.find((sem) => sem.semester === selectedSemester)?.records || [];

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col mt-10 ml-10">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto mb-4">
          {/* Left-aligned heading */}
          <h1 className="text-2xl font-bold flex items-center">
            <FaTasks className="mr-2 text-green-400 text-3xl" /> Attendance
          </h1>

          {/* Semester Dropdown */}
          <select
            className="p-2 bg-gray-800 text-white border border-gray-600 rounded-lg"
            value={selectedSemester}
            onChange={handleSemesterChange}
          >
            {attendanceData.map((sem, index) => (
              <option key={index} value={sem.semester}>
                {sem.semester}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full max-w-7xl mx-auto">
          <table className="w-full bg-gray-800 text-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="p-4 rounded-l-xl">Course ID</th>
                <th className="p-4">Course Name</th>
                <th className="p-4">Faculty</th>
                <th className="p-4">Total</th>
                <th className="p-4">Present</th>
                <th className="p-4">Duty Leave</th>
                <th className="p-4">Absent</th>
                <th className="p-4">Percentage</th>
                <th className="p-4 rounded-r-xl">Medical</th>
              </tr>
            </thead>
            <tbody>
              {selectedSemesterData.map((row: AttendanceRecord, index: number) => {
                const attendancePercentage =
                  row.total > 0
                    ? ((row.present + row.dutyLeave + row.medical) / row.total) * 100
                    : 0;

                return (
                  <React.Fragment key={index}>
                    <tr
                      onClick={() => toggleRow(row.SID)}
                      className={`cursor-pointer transition-all duration-300 ${
                        attendancePercentage >= 75
                          ? "hover:bg-green-500"
                          : "hover:bg-red-500"
                      } hover:scale-105 rounded-xl`}
                    >
                      <td className="p-4 rounded-l-xl">{row.courseID}</td>
                      <td className="p-4 whitespace-nowrap">{row.courseName}</td>
                      <td className="p-4 whitespace-nowrap">{row.faculty}</td>
                      <td className="p-4">{row.total}</td>
                      <td className="p-4">{row.present}</td>
                      <td className="p-4">{row.dutyLeave}</td>
                      <td className="p-4">{row.absent}</td>
                      <td className="p-4">{attendancePercentage.toFixed(2)}%</td>
                      <td className="p-4 rounded-r-xl">{row.medical}</td>
                    </tr>
                    {expandedRow === row.SID && (
                      <tr className="bg-gray-700">
                        <td colSpan={9} className="p-4 text-sm">
                          <div className="flex flex-col gap-2">
                            <div>
                              <span className="font-bold text-red-400">Absent Days:</span>{" "}
                              {row.absentDays.length > 0 ? row.absentDays.join(", ") : "None"}
                            </div>
                            <div>
                              <span className="font-bold text-blue-400">Medical Leave Days:</span>{" "}
                              {row.medicalDays.length > 0 ? row.medicalDays.join(", ") : "None"}
                            </div>
                            <div>
                              <span className="font-bold text-yellow-400">Duty Leave Days:</span>{" "}
                              {row.dutyLeaveDays.length > 0 ? row.dutyLeaveDays.join(", ") : "None"}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
