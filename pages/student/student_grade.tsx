import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import StudentSidebar from "@/components/student_sidebar";
import TopBar from "@/components/topbar";
import { Typography } from "@mui/material";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FiAward } from "react-icons/fi";

interface CourseGrade {
  code: string;
  name: string;
  credits: number;
  grade: string;
  gradePoint: number;
}

interface SemesterGrades {
  semester: string;
  year: string;
  courses: CourseGrade[];
  sgpa: number;
}

const StudentGrades: React.FC = () => {
  const router = useRouter();
  const [selectedSemester, setSelectedSemester] = useState<string>("current");
  const [gradesData, setGradesData] = useState<{
    studentName: string;
    studentId: string;
    program: string;
    cgpa: number;
    semesters: SemesterGrades[];
  }>({
    studentName: "Rajesh K",
    studentId: "CSE-2145",
    program: "B.Tech Computer Science and Engineering",
    cgpa: 8.7,
    semesters: [
      {
        semester: "1",
        year: "2022",
        courses: [
          { code: "MA101", name: "Engineering Mathematics I", credits: 4, grade: "A", gradePoint: 9 },
          { code: "PH101", name: "Engineering Physics", credits: 3, grade: "A+", gradePoint: 10 },
          { code: "CS101", name: "Introduction to Computing", credits: 4, grade: "A", gradePoint: 9 },
          { code: "HS101", name: "Communication Skills", credits: 2, grade: "B+", gradePoint: 8 },
          { code: "ME101", name: "Engineering Mechanics", credits: 3, grade: "B", gradePoint: 7 }
        ],
        sgpa: 8.69
      },
      {
        semester: "2",
        year: "2022",
        courses: [
          { code: "MA102", name: "Engineering Mathematics II", credits: 4, grade: "A", gradePoint: 9 },
          { code: "CH101", name: "Engineering Chemistry", credits: 3, grade: "B+", gradePoint: 8 },
          { code: "CS102", name: "Programming Fundamentals", credits: 4, grade: "A+", gradePoint: 10 },
          { code: "EC101", name: "Basic Electronics", credits: 3, grade: "B", gradePoint: 7 },
          { code: "EE101", name: "Electrical Engineering Basics", credits: 3, grade: "B+", gradePoint: 8 }
        ],
        sgpa: 8.53
      },
      {
        semester: "3",
        year: "2023",
        courses: [
          { code: "CS201", name: "Data Structures", credits: 4, grade: "A", gradePoint: 9 },
          { code: "CS202", name: "Discrete Mathematics", credits: 3, grade: "A", gradePoint: 9 },
          { code: "CS203", name: "Object Oriented Programming", credits: 4, grade: "A+", gradePoint: 10 },
          { code: "CS204", name: "Computer Organization", credits: 3, grade: "B+", gradePoint: 8 },
          { code: "HS201", name: "Economics for Engineers", credits: 2, grade: "A", gradePoint: 9 }
        ],
        sgpa: 9.06
      },
      {
        semester: "4",
        year: "2023",
        courses: [
          { code: "CS205", name: "Design and Analysis of Algorithms", credits: 4, grade: "A", gradePoint: 9 },
          { code: "CS206", name: "Operating Systems", credits: 4, grade: "B+", gradePoint: 8 },
          { code: "CS207", name: "Database Management Systems", credits: 4, grade: "A+", gradePoint: 10 },
          { code: "CS208", name: "Computer Networks", credits: 3, grade: "A", gradePoint: 9 },
          { code: "HS202", name: "Management Principles", credits: 2, grade: "A", gradePoint: 9 }
        ],
        sgpa: 8.94
      },
      {
        semester: "5",
        year: "2024",
        courses: [
          { code: "CS301", name: "Software Engineering", credits: 4, grade: "In Progress", gradePoint: 0 },
          { code: "CS302", name: "Theory of Computation", credits: 3, grade: "In Progress", gradePoint: 0 },
          { code: "CS303", name: "Artificial Intelligence", credits: 4, grade: "In Progress", gradePoint: 0 },
          { code: "CS304", name: "Web Technologies", credits: 3, grade: "In Progress", gradePoint: 0 },
          { code: "CS305", name: "Cloud Computing", credits: 3, grade: "In Progress", gradePoint: 0 }
        ],
        sgpa: 0
      }
    ]
  });

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole !== "student") router.push("/");
  }, [router]);

  // Get current semester (the last one)
  const currentSemester = gradesData.semesters[gradesData.semesters.length - 1];
  
  // Map for grade colors
  const gradeColors: Record<string, string> = {
    "A+": "bg-green-500",
    "A": "bg-green-400",
    "B+": "bg-blue-500",
    "B": "bg-blue-400",
    "C+": "bg-yellow-500",
    "C": "bg-yellow-400",
    "D": "bg-orange-500",
    "F": "bg-red-500",
    "In Progress": "bg-gray-500"
  };

  // Get the selected semester data
  const getDisplayedSemester = () => {
    if (selectedSemester === "current") {
      return currentSemester;
    }
    
    const [semester, year] = selectedSemester.split('-');
    return gradesData.semesters.find(s => s.semester === semester && s.year === year) || currentSemester;
  };
  
  const displayedSemester = getDisplayedSemester();

  // Calculate completed credits
  const completedCredits = gradesData.semesters
    .flatMap(sem => sem.courses)
    .filter(course => course.grade !== "In Progress")
    .reduce((total, course) => total + course.credits, 0);

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-200">
      <StudentSidebar />
      <div className="flex-1 p-6 ml-16">
        <TopBar />
        <div className="flex justify-between items-center mb-8 mx-6">
          <div className="flex items-center">
            <div className="p-3 mr-4 bg-green-600 rounded-xl shadow-lg">
              <FiAward className="text-gray-100 text-2xl" />
            </div>
            <Typography 
              variant="h4" 
              component="h1" 
              className="font-bold bg-green-600 bg-clip-text text-transparent"
            >
              Student Grades
            </Typography>
          </div>

          <div>
            <select 
              className="bg-gray-800 text-white border-none outline-none px-4 py-2 rounded-md"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="current">Current Semester</option>
              {gradesData.semesters.filter(sem => sem.sgpa > 0).map(sem => (
                <option key={`${sem.semester}-${sem.year}`} value={`${sem.semester}-${sem.year}`}>
                  Semester {sem.semester} ({sem.year})
                </option>
              ))}
            </select>
          </div>
        </div>


        {/* Student Overview */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-4 border border-gray-700 ml-6">
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{gradesData.studentName}</h2>
              <p className="text-gray-400">{gradesData.program}</p>
              <p className="text-sm text-gray-400">Student ID: {gradesData.studentId}</p>
              <p className="text-sm text-gray-400 mt-1">Completed Credits: {completedCredits}</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <span className="block text-green-400 text-3xl font-bold">{gradesData.cgpa.toFixed(2)}</span>
                <span className="text-sm text-gray-400">CGPA</span>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <span className="block text-blue-400 text-3xl font-bold">
                  {displayedSemester.sgpa > 0 ? displayedSemester.sgpa.toFixed(2) : "IP"}
                </span>
                <span className="text-sm text-gray-400">Sem {displayedSemester.semester} GPA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Semester Details */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-6 border border-gray-700 mb-6 ml-6">
          <h3 className="text-xl font-bold mb-4 text-green-500 flex items-center">
            Semester {displayedSemester.semester} ({displayedSemester.year})
            {displayedSemester.courses.some(c => c.grade === "In Progress") && 
              <span className="ml-2 text-sm bg-blue-600 px-2 py-1 rounded-full">In Progress</span>
            }
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-3 rounded-tl-lg">Course Code</th>
                  <th className="p-3">Course Name</th>
                  <th className="p-3">Credits</th>
                  <th className="p-3">Grade</th>
                  <th className="p-3 rounded-tr-lg">Grade Point</th>
                </tr>
              </thead>
              <tbody>
                {displayedSemester.courses.map((course, index) => (
                  <tr key={course.code} className={index % 2 === 0 ? 'bg-gray-750' : 'bg-gray-800'}>
                    <td className="p-3">{course.code}</td>
                    <td className="p-3">{course.name}</td>
                    <td className="p-3">{course.credits}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded ${gradeColors[course.grade] || 'bg-gray-600'}`}>
                        {course.grade}
                      </span>
                    </td>
                    <td className="p-3">{course.grade !== "In Progress" ? course.gradePoint : "-"}</td>
                  </tr>
                ))}
              </tbody>
              {displayedSemester.sgpa > 0 && (
                <tfoot>
                  <tr className="bg-gray-700">
                    <td colSpan={4} className="p-3 text-right font-bold">Semester GPA:</td>
                    <td className="p-3 font-bold text-green-400">{displayedSemester.sgpa.toFixed(2)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentGrades;