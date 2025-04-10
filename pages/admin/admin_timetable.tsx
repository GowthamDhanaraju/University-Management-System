import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin_sidebar";
import { PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

// Define interfaces for data
interface Subject {
  id: string;
  name: string;
  faculty: string;
}

interface TimeTableCell {
  day: string;
  timeSlot: string;
  subject: string;
  faculty: string;
}

interface TimetableData {
  class: string;
  data: TimeTableCell[];
}

const TimetableManagement: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [timetableData, setTimetableData] = useState<TimeTableCell[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [editingCell, setEditingCell] = useState<{ day: string; timeSlot: string } | null>(null);
  const [tempSubject, setTempSubject] = useState<string>("");

  // Fetch classes, subjects, and initial timetable
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch available classes
        const classResponse = await fetch('/api/admin/timetable/classes');
        const classData = await classResponse.json();
        setClasses(classData);

        // Set default selected class if available
        if (classData.length > 0) {
          setSelectedClass(classData[0]);
        }

        // Fetch subjects
        const subjectsResponse = await fetch('/api/admin/timetable/subjects');
        const subjectsData = await subjectsResponse.json();
        setSubjects(subjectsData);
      } catch (error) {
        console.error('Error fetching initial timetable data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch timetable data when selected class changes
  useEffect(() => {
    if (selectedClass) {
      fetchTimetableForClass(selectedClass);
    }
  }, [selectedClass]);

  const fetchTimetableForClass = async (className: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/timetable/data?class=${className}`);
      const data = await response.json();
      setTimetableData(data);
    } catch (error) {
      console.error('Error fetching timetable for class:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(e.target.value);
  };

  const handleEditCell = (day: string, timeSlot: string) => {
    // Don't allow editing lunch break
    if (timeSlot === "1:00 - 1:50") return;

    setEditingCell({ day, timeSlot });

    // Set initial value in temp subject from existing timetable data
    const existingCell = timetableData.find(
      cell => cell.day === day && cell.timeSlot === timeSlot
    );
    setTempSubject(existingCell?.subject || "");
  };

  const handleSaveCell = async () => {
    if (!editingCell) return;

    const { day, timeSlot } = editingCell;

    try {
      // Send update to backend
      await fetch('/api/admin/timetable/update-cell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          class: selectedClass,
          day,
          timeSlot,
          subject: tempSubject
        }),
      });

      // Update local state
      const updatedData = [...timetableData];
      const existingIndex = updatedData.findIndex(
        cell => cell.day === day && cell.timeSlot === timeSlot
      );

      if (existingIndex !== -1) {
        // Update existing cell
        updatedData[existingIndex] = {
          ...updatedData[existingIndex],
          subject: tempSubject,
          faculty: subjects.find(s => s.id === tempSubject)?.faculty || ""
        };
      } else {
        // Add new cell
        updatedData.push({
          day,
          timeSlot,
          subject: tempSubject,
          faculty: subjects.find(s => s.id === tempSubject)?.faculty || ""
        });
      }

      setTimetableData(updatedData);
    } catch (error) {
      console.error('Error updating timetable cell:', error);
      alert('Failed to update timetable. Please try again.');
    }

    // Reset editing state
    setEditingCell(null);
    setTempSubject("");
  };

  const handleClearCell = async () => {
    if (!editingCell) return;

    const { day, timeSlot } = editingCell;

    try {
      // Send update to backend
      await fetch('/api/admin/timetable/clear-cell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          class: selectedClass,
          day,
          timeSlot
        }),
      });

      // Update local state
      const updatedData = timetableData.filter(
        cell => !(cell.day === day && cell.timeSlot === timeSlot)
      );

      setTimetableData(updatedData);
    } catch (error) {
      console.error('Error clearing timetable cell:', error);
      alert('Failed to clear timetable cell. Please try again.');
    }

    // Reset editing state
    setEditingCell(null);
    setTempSubject("");
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setTempSubject("");
  };

  if (isLoading) {
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
                  {classes.map(className => (
                    <option key={className} value={className}>{className}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Timetable */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-3">Timetable for {selectedClass}</h2>

            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border border-gray-700 bg-gray-800">Day</th>
                  <th className="p-2 border border-gray-700 bg-gray-800">Time Slot</th>
                  <th className="p-2 border border-gray-700 bg-gray-800">Subject</th>
                  <th className="p-2 border border-gray-700 bg-gray-800">Faculty</th>
                  <th className="p-2 border border-gray-700 bg-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {timetableData.map(cell => (
                  <tr key={`${cell.day}-${cell.timeSlot}`}>
                    <td className="p-2 border border-gray-700 bg-gray-800">{cell.day}</td>
                    <td className="p-2 border border-gray-700 bg-gray-800">{cell.timeSlot}</td>
                    <td className="p-2 border border-gray-700 bg-gray-800">{cell.subject}</td>
                    <td className="p-2 border border-gray-700 bg-gray-800">{cell.faculty}</td>
                    <td className="p-2 border border-gray-700 bg-gray-800">
                      <button
                        className="text-blue-500 hover:text-blue-400"
                        onClick={() => handleEditCell(cell.day, cell.timeSlot)}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableManagement;