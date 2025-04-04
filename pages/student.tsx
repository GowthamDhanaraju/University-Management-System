import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import TeacherSidebar from "@/components/teacher_sidebar";
import { Pie, Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const Header = () => {
  return (
    <header className="p-4 bg-gray-800 shadow-md flex w-[calc(100%-4rem)] ml-16 justify-between items-center rounded-lg border border-gray-700">
      <h1 className="text-xl font-bold text-white">Course-wise Student Management</h1>
    </header>
  );
};


interface StatCardProps {
  title: string;
  content: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, content }) => {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md text-center border border-gray-700">
      <h3 className="text-blue-400 text-lg font-semibold">{title}</h3>
      <div className="text-md mt-2">{content}</div>
    </div>
  );
};

// Types
interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentDate: string;
  courses: string[];
  department: string;
  batch: string;
}

interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  course: string;
}

interface Assignment {
  id: string;
  studentId: string;
  title: string;
  course: string;
  dueDate: string;
  score: number;
  maxScore: number;
}

interface Exam {
  id: string;
  studentId: string;
  title: string;
  course: string;
  date: string;
  score: number;
  maxScore: number;
}

interface Department {
  id: string;
  name: string;
}

interface Course {
  id: string;
  name: string;
  departmentId: string;
}

interface Batch {
  id: string;
  name: string;
  courseId: string;
}

// Mock data
const mockDepartments: Department[] = [
  { id: '1', name: 'Computer Science' },
  { id: '2', name: 'Physics' },
  { id: '3', name: 'Chemistry' },
];

const mockCourses: Course[] = [
  { id: '1', name: 'Programming Fundamentals', departmentId: '1' },
  { id: '2', name: 'Data Structures', departmentId: '1' },
  { id: '3', name: 'Quantum Mechanics', departmentId: '2' },
  { id: '4', name: 'Organic Chemistry', departmentId: '3' },
];

const mockBatches: Batch[] = [
  { id: '1', name: 'Batch A', courseId: '1' },
  { id: '2', name: 'Batch B', courseId: '1' },
  { id: '3', name: 'Batch A', courseId: '2' },
  { id: '4', name: 'Batch A', courseId: '3' },
  { id: '5', name: 'Batch B', courseId: '3' },
  { id: '6', name: 'Batch A', courseId: '4' },
];

const mockStudents: Student[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', enrollmentDate: '2023-09-01', courses: ['Programming Fundamentals', 'Data Structures'], department: 'Computer Science', batch: 'Batch A' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', enrollmentDate: '2023-09-01', courses: ['Programming Fundamentals'], department: 'Computer Science', batch: 'Batch B' },
  { id: '3', name: 'Alice Johnson', email: 'alice.johnson@example.com', enrollmentDate: '2023-09-15', courses: ['Quantum Mechanics'], department: 'Physics', batch: 'Batch A' },
  { id: '4', name: 'Bob Brown', email: 'bob.brown@example.com', enrollmentDate: '2023-09-10', courses: ['Organic Chemistry'], department: 'Chemistry', batch: 'Batch A' },
  { id: '5', name: 'Charlie Davis', email: 'charlie.davis@example.com', enrollmentDate: '2023-09-05', courses: ['Quantum Mechanics'], department: 'Physics', batch: 'Batch B' },
  { id: '6', name: 'Diana Evans', email: 'diana.evans@example.com', enrollmentDate: '2023-09-20', courses: ['Data Structures'], department: 'Computer Science', batch: 'Batch A' },
];

const mockAttendance: Attendance[] = [
  { id: '1', studentId: '1', date: '2023-10-01', status: 'present', course: 'Programming Fundamentals' },
  { id: '2', studentId: '1', date: '2023-10-02', status: 'present', course: 'Data Structures' },
  { id: '3', studentId: '1', date: '2023-10-03', status: 'absent', course: 'Programming Fundamentals' },
  { id: '4', studentId: '2', date: '2023-10-01', status: 'present', course: 'Programming Fundamentals' },
  { id: '5', studentId: '2', date: '2023-10-02', status: 'late', course: 'Programming Fundamentals' },
  { id: '6', studentId: '3', date: '2023-10-01', status: 'absent', course: 'Quantum Mechanics' },
  { id: '7', studentId: '3', date: '2023-10-02', status: 'present', course: 'Quantum Mechanics' },
];

const mockAssignments: Assignment[] = [
  { id: '1', studentId: '1', title: 'Programming Assignment 1', course: 'Programming Fundamentals', dueDate: '2023-10-10', score: 85, maxScore: 100 },
  { id: '2', studentId: '1', title: 'Data Structures Project', course: 'Data Structures', dueDate: '2023-10-15', score: 92, maxScore: 100 },
  { id: '3', studentId: '2', title: 'Programming Assignment 1', course: 'Programming Fundamentals', dueDate: '2023-10-10', score: 78, maxScore: 100 },
  { id: '4', studentId: '3', title: 'Quantum Problem Set', course: 'Quantum Mechanics', dueDate: '2023-10-12', score: 88, maxScore: 100 },
  { id: '5', studentId: '4', title: 'Chemistry Lab Report', course: 'Organic Chemistry', dueDate: '2023-10-15', score: 75, maxScore: 100 },
  { id: '6', studentId: '5', title: 'Quantum Problem Set', course: 'Quantum Mechanics', dueDate: '2023-10-18', score: 90, maxScore: 100 },
];

const mockExams: Exam[] = [
  { id: '1', studentId: '1', title: 'Midterm Exam', course: 'Programming Fundamentals', date: '2023-10-25', score: 88, maxScore: 100 },
  { id: '2', studentId: '1', title: 'Midterm Exam', course: 'Data Structures', date: '2023-10-27', score: 85, maxScore: 100 },
  { id: '3', studentId: '2', title: 'Midterm Exam', course: 'Programming Fundamentals', date: '2023-10-25', score: 82, maxScore: 100 },
  { id: '4', studentId: '3', title: 'Midterm Exam', course: 'Quantum Mechanics', date: '2023-10-26', score: 79, maxScore: 100 },
  { id: '5', studentId: '4', title: 'Midterm Exam', course: 'Organic Chemistry', date: '2023-10-27', score: 76, maxScore: 100 },
  { id: '6', studentId: '5', title: 'Midterm Exam', course: 'Quantum Mechanics', date: '2023-10-28', score: 91, maxScore: 100 },
];

const DepartmentList: React.FC<{ 
  departments: Department[]; 
  onSelectDepartment: (departmentId: string) => void;
  selectedDepartmentId: string | null;
}> = ({ departments, onSelectDepartment, selectedDepartmentId }) => {
  return (
    <div className="bg-gray-800 text-white p-4 w-[calc(100%-4rem)] ml-16 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-blue-400 text-lg font-semibold mb-3">Departments</h3>
      <ul>
        {departments.map(department => (
          <li key={department.id} className="mb-2">
            <button 
              className={`w-full text-left p-2 rounded-lg transition-colors ${selectedDepartmentId === department.id ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-blue-500'}`}
              onClick={() => onSelectDepartment(department.id)}
            >
              {department.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CourseList: React.FC<{ 
  courses: Course[]; 
  departmentId: string;
  onSelectCourse: (courseId: string) => void;
  selectedCourseId: string | null;
}> = ({ courses, departmentId, onSelectCourse, selectedCourseId }) => {
  const filteredCourses = courses.filter(course => course.departmentId === departmentId);
  
  return (
    <div className="bg-gray-800 text-white p-4 w-[calc(100%-4rem)] ml-16 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-blue-400 text-lg font-semibold mb-3">Courses</h3>
      {filteredCourses.length > 0 ? (
        <ul>
          {filteredCourses.map(course => (
            <li key={course.id} className="mb-2">
              <button 
                className={`w-full text-left p-2 w-[calc(100%-4rem)] ml-16 rounded-lg transition-colors ${selectedCourseId === course.id ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-blue-500'}`}
                onClick={() => onSelectCourse(course.id)}
              >
                {course.name}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No courses found for this department</p>
      )}
    </div>
  );
};

const BatchList: React.FC<{ 
  batches: Batch[]; 
  courseId: string;
  onSelectBatch: (batchId: string) => void;
  selectedBatchId: string | null;
}> = ({ batches, courseId, onSelectBatch, selectedBatchId }) => {
  const filteredBatches = batches.filter(batch => batch.courseId === courseId);
  
  return (
    <div className="bg-gray-800 text-white p-4 w-[calc(100%-4rem)] ml-16 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-blue-400 text-lg font-semibold mb-3">Batches</h3>
      {filteredBatches.length > 0 ? (
        <ul>
          {filteredBatches.map(batch => (
            <li key={batch.id} className="mb-2">
              <button 
                className={`w-full text-left p-2 rounded-lg transition-colors ${selectedBatchId === batch.id ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-blue-500'}`}
                onClick={() => onSelectBatch(batch.id)}
              >
                {batch.name}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No batches found for this course</p>
      )}
    </div>
  );
};

const StudentList: React.FC<{
  students: Student[];
  batchId: string;
  courseId: string | null; // Allow null
  batches: Batch[];
  courses: Course[];
  searchTerm: string;
  onStudentSelect: (student: Student) => void;
}> = ({ students, batchId, courseId, batches, courses, searchTerm, onStudentSelect }) => {
  const batch = batches.find(b => b.id === batchId);
  const course = courses.find(c => c.id === courseId);

  
  const filteredStudents = students.filter(student => {
    const matchesBatch = student.batch === batch?.name;
    const matchesCourse = student.courses.includes(course?.name || '');
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesBatch && matchesCourse && (searchTerm === '' || matchesSearch);
  });

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-blue-400 text-lg font-semibold mb-3">
        Student List - {course?.name} - {batch?.name}
      </h3>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-400"
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-gray-200 bg-gray-700">
            <tr>
              <th className="px-4 py-2 rounded-tl-lg">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Enrollment Date</th>
              <th className="px-4 py-2 rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="px-4 py-3">{student.name}</td>
                <td className="px-4 py-3">{student.email}</td>
                <td className="px-4 py-3">{student.enrollmentDate}</td>
                <td className="px-4 py-3">
                  <button 
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    onClick={() => onStudentSelect(student)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredStudents.length === 0 && (
        <p className="text-center text-gray-400 mt-4">No students found</p>
      )}
    </div>
  );
};

const AttendanceEntry: React.FC<{
  students: Student[];
  batches: Batch[];
  courses: Course[];
  batchId: string | null;  // Allow null
  courseId: string | null; // Allow null
  attendance: Attendance[];
  onSaveAttendance: (newAttendance: Attendance[]) => void;
}> = ({ students, batches, courses, batchId, courseId, attendance, onSaveAttendance }) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<{[key: string]: 'present' | 'absent' | 'late'}>({});
  const batch = batchId ? batches.find(b => b.id === batchId) : null;
  const course = courseId ? courses.find(c => c.id === courseId) : null;
  
  const filteredStudents = students.filter(student => {
    const matchesBatch = student.batch === batch?.name;
    const matchesCourse = student.courses.includes(course?.name || '');
    return matchesBatch && matchesCourse;
  });

  useEffect(() => {
    // Initialize with existing attendance data for this date if any
    const existingAttendance: {[key: string]: 'present' | 'absent' | 'late'} = {};
    
    filteredStudents.forEach(student => {
      const record = attendance.find(a => 
        a.studentId === student.id && 
        a.date === date && 
        a.course === course?.name
      );
      
      if (record) {
        existingAttendance[student.id] = record.status;
      } else {
        existingAttendance[student.id] = 'present'; // Default value
      }
    });
    
    setAttendanceData(existingAttendance);
  }, [date, filteredStudents, course, attendance]);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceData({
      ...attendanceData,
      [studentId]: status
    });
  };

  const handleSave = () => {
    const newAttendanceRecords: Attendance[] = [];
    
    // Find existing records for this date and course
    const existingIds = new Set(
      attendance
        .filter(a => a.date === date && a.course === course?.name)
        .map(a => a.studentId)
    );
    
    // Keep attendance records for other dates and courses
    const otherRecords = attendance.filter(a => 
      a.date !== date || a.course !== course?.name
    );
    
    // Create or update attendance records
    Object.entries(attendanceData).forEach(([studentId, status]) => {
      const existingRecord = attendance.find(a => 
        a.studentId === studentId && 
        a.date === date && 
        a.course === course?.name
      );
      
      if (existingRecord) {
        newAttendanceRecords.push({
          ...existingRecord,
          status
        });
      } else {
        newAttendanceRecords.push({
          id: `${Date.now()}-${studentId}`, // Generate a unique ID
          studentId,
          date,
          status,
          course: course?.name || ''
        });
      }
    });
    
    onSaveAttendance([...otherRecords, ...newAttendanceRecords]);
    alert('Attendance saved successfully!');
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-blue-400 text-lg font-semibold mb-3">
        Attendance Entry - {course?.name} - {batch?.name}
      </h3>
      
      <div className="mb-4">
        <label className="block text-gray-400 mb-2">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-400"
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-gray-200 bg-gray-700">
            <tr>
              <th className="px-4 py-2 rounded-tl-lg">Name</th>
              <th className="px-4 py-2">Present</th>
              <th className="px-4 py-2">Absent</th>
              <th className="px-4 py-2 rounded-tr-lg">Late</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-b border-gray-700">
                <td className="px-4 py-3">{student.name}</td>
                <td className="px-4 py-3">
                  <input
                    type="radio"
                    name={`attendance-${student.id}`}
                    checked={attendanceData[student.id] === 'present'}
                    onChange={() => handleStatusChange(student.id, 'present')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="radio"
                    name={`attendance-${student.id}`}
                    checked={attendanceData[student.id] === 'absent'}
                    onChange={() => handleStatusChange(student.id, 'absent')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="radio"
                    name={`attendance-${student.id}`}
                    checked={attendanceData[student.id] === 'late'}
                    onChange={() => handleStatusChange(student.id, 'late')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={handleSave}
        >
          Save Attendance
        </button>
      </div>
    </div>
  );
};

const AttendanceTracker: React.FC<{
  attendance: Attendance[];
  studentId: string;
}> = ({ attendance, studentId }) => {
  const studentAttendance = attendance.filter(a => a.studentId === studentId);
  const total = studentAttendance.length;
  const present = studentAttendance.filter(a => a.status === 'present').length;
  const absent = studentAttendance.filter(a => a.status === 'absent').length;
  const late = studentAttendance.filter(a => a.status === 'late').length;
  
  const presentPercentage = total ? Math.round((present / total) * 100) : 0;
  const absentPercentage = total ? Math.round((absent / total) * 100) : 0;
  const latePercentage = total ? Math.round((late / total) * 100) : 0;

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-blue-400 text-lg font-semibold mb-3">Attendance Summary</h3>
      
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="text-gray-400 text-sm">Total</div>
          <div className="text-xl font-bold">{total}</div>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="text-gray-400 text-sm">Present</div>
          <div className="text-xl font-bold text-green-500">
            {present} ({presentPercentage}%)
          </div>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="text-gray-400 text-sm">Absent</div>
          <div className="text-xl font-bold text-red-500">
            {absent} ({absentPercentage}%)
          </div>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="text-gray-400 text-sm">Late</div>
          <div className="text-xl font-bold text-yellow-500">
            {late} ({latePercentage}%)
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-gray-200 bg-gray-700">
            <tr>
              <th className="px-4 py-2 rounded-tl-lg">Date</th>
              <th className="px-4 py-2">Course</th>
              <th className="px-4 py-2 rounded-tr-lg">Status</th>
            </tr>
          </thead>
          <tbody>
            {studentAttendance.map((record) => (
              <tr key={record.id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="px-4 py-3">{record.date}</td>
                <td className="px-4 py-3">{record.course}</td>
                <td className="px-4 py-3">
                  <span className={
                    record.status === 'present' ? 'text-green-500' :
                    record.status === 'absent' ? 'text-red-500' : 'text-yellow-500'
                  }>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PerformanceChart: React.FC<{
  studentId: string;
  students: Student[];
  assignments: Assignment[];
  exams: Exam[];
  attendance: Attendance[];
}> = ({ studentId, students, assignments, exams, attendance }) => {
  const studentCourses = students.find(s => s.id === studentId)?.courses || [];
  
  const getAssignmentAverage = (course: string) => {
    const courseAssignments = assignments.filter(a => a.studentId === studentId && a.course === course);
    if (courseAssignments.length === 0) return 0;
    const total = courseAssignments.reduce((sum, assignment) => sum + (assignment.score / assignment.maxScore) * 100, 0);
    return Math.round(total / courseAssignments.length);
  };
  
  const getExamAverage = (course: string) => {
    const courseExams = exams.filter(e => e.studentId === studentId && e.course === course);
    if (courseExams.length === 0) return 0;
    const total = courseExams.reduce((sum, exam) => sum + (exam.score / exam.maxScore) * 100, 0);
    return Math.round(total / courseExams.length);
  };
  
  const getAttendanceRate = (course: string) => {
    const courseAttendance = attendance.filter(a => a.studentId === studentId && a.course === course);
    if (courseAttendance.length === 0) return 0;
    const present = courseAttendance.filter(a => a.status === 'present').length;
    return Math.round((present / courseAttendance.length) * 100);
  };
  
  const chartData = {
    labels: studentCourses,
    datasets: [
      {
        label: "Assignments",
        data: studentCourses.map(course => getAssignmentAverage(course)),
        backgroundColor: "#3498db",
      },
      {
        label: "Exams",
        data: studentCourses.map(course => getExamAverage(course)),
        backgroundColor: "#2ecc71",
      },
      {
        label: "Attendance",
        data: studentCourses.map(course => getAttendanceRate(course)),
        backgroundColor: "#e74c3c",
      },
    ],
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-blue-400 text-lg font-semibold mb-2">Course Performance</h3>
      <div className="h-64">
        <Bar 
          data={chartData} 
          options={{ 
            responsive: true, 
            maintainAspectRatio: false, 
            scales: { 
              y: { 
                beginAtZero: true, 
                max: 100,
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                }
              },
              x: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: 'white'
                }
              }
            } 
          }} 
        />
      </div>
    </div>
  );
};
const CourseReports: React.FC<{
  studentId: string;
  courses: string[];
  attendance: Attendance[];
  assignments: Assignment[];
  exams: Exam[];
}> = ({ studentId, courses, attendance, assignments, exams }) => {
  const [selectedCourse, setSelectedCourse] = useState(courses.length > 0 ? courses[0] : '');
  
  if (courses.length === 0) {
    return (
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700">
        <h3 className="text-blue-400 text-lg font-semibold mb-3">Course Reports</h3>
        <p>No courses available</p>
      </div>
    );
  }
  
  const courseAttendance = attendance.filter(a => a.studentId === studentId && a.course === selectedCourse);
  const courseAssignments = assignments.filter(a => a.studentId === studentId && a.course === selectedCourse);
  const courseExams = exams.filter(e => e.studentId === studentId && e.course === selectedCourse);
  
  // Calculate attendance statistics
  const totalClasses = courseAttendance.length;
  const presentCount = courseAttendance.filter(a => a.status === 'present').length;
  const absentCount = courseAttendance.filter(a => a.status === 'absent').length;
  const lateCount = courseAttendance.filter(a => a.status === 'late').length;
  
  const attendancePercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;
  
  // Calculate assignment statistics
  const assignmentAverage = courseAssignments.length > 0 
    ? Math.round(courseAssignments.reduce((sum, a) => sum + (a.score / a.maxScore) * 100, 0) / courseAssignments.length) 
    : 0;
  
  // Calculate exam statistics
  const examAverage = courseExams.length > 0 
    ? Math.round(courseExams.reduce((sum, e) => sum + (e.score / e.maxScore) * 100, 0) / courseExams.length) 
    : 0;
  
  // Chart data for attendance
  const attendanceData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        data: [presentCount, absentCount, lateCount],
        backgroundColor: ['#2ecc71', '#e74c3c', '#f39c12'],
        borderWidth: 0,
      },
    ],
  };
  
  // Chart data for performance over time
  const performanceData = {
    labels: courseAssignments.map(a => a.title),
    datasets: [
      {
        label: 'Assignment Scores (%)',
        data: courseAssignments.map(a => (a.score / a.maxScore) * 100),
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-blue-400 text-lg font-semibold mb-3">Course Report</h3>
      
      <div className="mb-4">
        <label className="block text-gray-400 mb-2">Select Course</label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-400"
        >
          {courses.map(course => (
            <option key={course} value={course}>{course}</option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="text-gray-400 text-sm">Attendance Rate</div>
          <div className="text-2xl font-bold text-blue-400">{attendancePercentage}%</div>
          <div className="text-xs text-gray-400">
            {presentCount} present, {absentCount} absent, {lateCount} late
          </div>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="text-gray-400 text-sm">Assignment Average</div>
          <div className="text-2xl font-bold text-green-400">{assignmentAverage}%</div>
          <div className="text-xs text-gray-400">
            {courseAssignments.length} assignments
          </div>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="text-gray-400 text-sm">Exam Average</div>
          <div className="text-2xl font-bold text-purple-400">{examAverage}%</div>
          <div className="text-xs text-gray-400">
            {courseExams.length} exams
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-medium mb-2">Attendance Breakdown</h4>
          <div className="h-64">
            {totalClasses > 0 ? (
              <Pie 
                data={attendanceData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: 'white'
                      }
                    }
                  }
                }} 
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No attendance data available
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-2">Assignment Performance</h4>
          <div className="h-64">
            {courseAssignments.length > 0 ? (
              <Line 
                data={performanceData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                      }
                    },
                    x: {
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        maxRotation: 45,
                        minRotation: 45
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      labels: {
                        color: 'white'
                      }
                    }
                  }
                }} 
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No assignment data available
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="text-lg font-medium mb-2">Assignments</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-gray-200 bg-gray-700">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Due Date</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {courseAssignments.map((assignment) => (
                <tr key={assignment.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="px-4 py-3">{assignment.title}</td>
                  <td className="px-4 py-3">{assignment.dueDate}</td>
                  <td className="px-4 py-3">{assignment.score} / {assignment.maxScore}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-600 rounded-full h-2.5">
                        <div 
                          className="bg-blue-500 h-2.5 rounded-full" 
                          style={{ width: `${(assignment.score / assignment.maxScore) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2">{Math.round((assignment.score / assignment.maxScore) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
              {courseAssignments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-center text-gray-400">No assignments found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="text-lg font-medium mb-2">Exams</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-gray-200 bg-gray-700">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {courseExams.map((exam) => (
                <tr key={exam.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="px-4 py-3">{exam.title}</td>
                  <td className="px-4 py-3">{exam.date}</td>
                  <td className="px-4 py-3">{exam.score} / {exam.maxScore}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-600 rounded-full h-2.5">
                        <div 
                          className="bg-purple-500 h-2.5 rounded-full" 
                          style={{ width: `${(exam.score / exam.maxScore) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2">{Math.round((exam.score / exam.maxScore) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
              {courseExams.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-center text-gray-400">No exams found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
const CourseWiseStudentManagement: React.FC = () => {
  const [departments] = useState<Department[]>(mockDepartments);
  const [courses] = useState<Course[]>(mockCourses);
  const [batches] = useState<Batch[]>(mockBatches);
  const [students] = useState<Student[]>(mockStudents);
  const [attendance, setAttendance] = useState<Attendance[]>(mockAttendance);
  const [assignments] = useState<Assignment[]>(mockAssignments);
  const [exams] = useState<Exam[]>(mockExams);
  
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'students' | 'attendance' | 'report'>('students');
  
  const handleDepartmentSelect = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
    setSelectedCourseId(null);
    setSelectedBatchId(null);
    setSelectedStudent(null);
  };
  
  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedBatchId(null);
    setSelectedStudent(null);
  };
  
  const handleBatchSelect = (batchId: string) => {
    setSelectedBatchId(batchId);
    setSelectedStudent(null);
  };
  
  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setActiveTab('report');
  };
  
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleSaveAttendance = (newAttendance: Attendance[]) => {
    setAttendance(newAttendance);
  };
  
  const onSearchChange = (term: string) => {
    setSearchTerm(term);
  };
  
  return (
    <div className="flex">
      <TeacherSidebar />
      
      <div className="flex-1 p-6 bg-gray-900 min-h-screen">
        <Header />
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Selection Panel */}
          <div className="col-span-1 space-y-6">
            <DepartmentList 
              departments={departments} 
              onSelectDepartment={handleDepartmentSelect}
              selectedDepartmentId={selectedDepartmentId}
            />
            
            {selectedDepartmentId && (
              <CourseList 
                courses={courses} 
                departmentId={selectedDepartmentId}
                onSelectCourse={handleCourseSelect}
                selectedCourseId={selectedCourseId}
              />
            )}
            
            {selectedCourseId && (
              <BatchList 
                batches={batches} 
                courseId={selectedCourseId}
                onSelectBatch={handleBatchSelect}
                selectedBatchId={selectedBatchId}
              />
            )}
          </div>
          
          {/* Main Content Area */}
          <div className="col-span-1 md:col-span-3">
            {selectedBatchId && !selectedStudent && (
              <div className="mb-6">
                <div className="flex mb-4 border-b border-gray-700">
                  <button 
                    className={`py-2 px-4 ${activeTab === 'students' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('students')}
                  >
                    Student List
                  </button>
                  <button 
                    className={`py-2 px-4 ${activeTab === 'attendance' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('attendance')}
                  >
                    Attendance Entry
                  </button>
                </div>
                
                {activeTab === 'students' && (
                  <StudentList 
                    students={students}
                    batchId={selectedBatchId}
                    courseId={selectedCourseId}
                    batches={batches}
                    courses={courses}
                    searchTerm={searchTerm}
                    onStudentSelect={handleStudentSelect}
                  />
                )}
                
                {activeTab === 'attendance' && (
                  <AttendanceEntry 
                    students={students}
                    batches={batches}
                    courses={courses}
                    batchId={selectedBatchId}
                    courseId={selectedCourseId}
                    attendance={attendance}
                    onSaveAttendance={handleSaveAttendance}
                  />
                )}
              </div>
            )}
            
            {/* Student Detail View */}
            {selectedStudent && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedStudent.name}
                  </h2>
                  <button 
                    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                    onClick={() => setSelectedStudent(null)}
                  >
                    Back to List
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <StatCard 
                    title="Email" 
                    content={selectedStudent.email} 
                  />
                  <StatCard 
                    title="Department" 
                    content={selectedStudent.department} 
                  />
                  <StatCard 
                    title="Batch" 
                    content={selectedStudent.batch} 
                  />
                </div>
                
                <div className="mb-6">
                  <PerformanceChart 
                    studentId={selectedStudent.id}
                    students={students}
                    assignments={assignments}
                    exams={exams}
                    attendance={attendance}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <AttendanceTracker 
                    attendance={attendance}
                    studentId={selectedStudent.id}
                  />
                  
                  <CourseReports 
                    studentId={selectedStudent.id}
                    courses={selectedStudent.courses}
                    attendance={attendance}
                    assignments={assignments}
                    exams={exams}
                  />
                </div>
              </div>
            )}
            
            {/* Initial State - No Selection */}
            {!selectedBatchId && !selectedStudent && (
              <div className="bg-gray-800 text-white p-8 rounded-lg shadow-md text-center border border-gray-700">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-200">Select a Department, Course, and Batch</h3>
                <p className="mt-1 text-gray-400">
                  Start by selecting a department from the left panel
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseWiseStudentManagement;