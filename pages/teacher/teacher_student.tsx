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
  { id: '1', name: 'Computer Science' }
];

const mockCourses: Course[] = [
  { id: '1', name: 'Programming Fundamentals', departmentId: '1' }
];

const mockBatches: Batch[] = [
  { id: '1', name: 'Batch A', courseId: '1' },
  { id: '2', name: 'Batch B', courseId: '1' }
];

const mockStudents: Student[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', enrollmentDate: '2023-09-01', courses: ['Programming Fundamentals', 'Data Structures'], department: 'Computer Science', batch: 'Batch A' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', enrollmentDate: '2023-09-01', courses: ['Programming Fundamentals'], department: 'Computer Science', batch: 'Batch B' }
];

const mockAttendance: Attendance[] = [
  { id: '1', studentId: '1', date: '2023-10-01', status: 'present', course: 'Programming Fundamentals' },
  { id: '2', studentId: '1', date: '2023-10-02', status: 'present', course: 'Data Structures' }
];

const mockAssignments: Assignment[] = [
  { id: '1', studentId: '1', title: 'Programming Assignment 1', course: 'Programming Fundamentals', dueDate: '2023-10-10', score: 85, maxScore: 100 },
  { id: '2', studentId: '1', title: 'Data Structures Project', course: 'Data Structures', dueDate: '2023-10-15', score: 92, maxScore: 100 }
];

const mockExams: Exam[] = [
  { id: '1', studentId: '1', title: 'Midterm Exam', course: 'Programming Fundamentals', date: '2023-10-25', score: 88, maxScore: 100 },
  { id: '2', studentId: '1', title: 'Midterm Exam', course: 'Data Structures', date: '2023-10-27', score: 85, maxScore: 100 }
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
            </div>
        </div>
      </div>
    </div>
  );
};

export default CourseWiseStudentManagement;
