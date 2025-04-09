import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import StudentSidebar from "@/components/student_sidebar";
import TopBar from "@/components/topbar";
import { Typography } from "@mui/material";
import { FaChalkboardTeacher, FaBook, FaUserTie, FaComments, FaStar, FaInfoCircle } from "react-icons/fa";
import Link from "next/link";

interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  profileImage: string;
  designation: string;
  rating: number;
}

interface Course {
  code: string;
  name: string;
  credits: number;
  semester: string;
  description: string;
  teacher: Teacher;
  nextClass: string;
  hasFeedbackSubmitted: boolean;
}

const StudentCourses: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<Course[]>([
    {
      code: "CS301",
      name: "Software Engineering",
      credits: 4,
      semester: "5",
      description: "This course introduces the methodologies and tools used in modern software development.",
      teacher: {
        id: "T101",
        name: "Dr. Sharma",
        email: "sharma@university.edu",
        department: "Computer Science",
        profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
        designation: "Associate Professor",
        rating: 4.7
      },
      nextClass: "Monday, 10:00 AM",
      hasFeedbackSubmitted: true
    },
    {
      code: "CS302",
      name: "Theory of Computation",
      credits: 3,
      semester: "5",
      description: "Study of theoretical models of computing, including finite automata and Turing machines.",
      teacher: {
        id: "T102",
        name: "Dr. Gupta",
        email: "gupta@university.edu",
        department: "Computer Science",
        profileImage: "https://randomuser.me/api/portraits/women/41.jpg",
        designation: "Professor",
        rating: 4.5
      },
      nextClass: "Wednesday, 2:00 PM",
      hasFeedbackSubmitted: false
    },
    {
      code: "CS303",
      name: "Artificial Intelligence",
      credits: 4,
      semester: "5",
      description: "Introduction to AI concepts and techniques including search algorithms and machine learning.",
      teacher: {
        id: "T103",
        name: "Prof. Joshi",
        email: "joshi@university.edu",
        department: "Computer Science",
        profileImage: "https://randomuser.me/api/portraits/men/22.jpg",
        designation: "Assistant Professor",
        rating: 4.2
      },
      nextClass: "Thursday, 11:00 AM",
      hasFeedbackSubmitted: false
    },
    {
      code: "CS304",
      name: "Web Technologies",
      credits: 3,
      semester: "5",
      description: "Fundamentals of web development, including front-end and back-end technologies.",
      teacher: {
        id: "T104",
        name: "Dr. Patel",
        email: "patel@university.edu",
        department: "Information Technology",
        profileImage: "https://randomuser.me/api/portraits/women/26.jpg",
        designation: "Associate Professor",
        rating: 4.8
      },
      nextClass: "Tuesday, 9:00 AM",
      hasFeedbackSubmitted: false
    },
    {
      code: "CS305",
      name: "Cloud Computing",
      credits: 3,
      semester: "5",
      description: "Introduction to cloud computing services, deployment models, and applications.",
      teacher: {
        id: "T105",
        name: "Prof. Mehta",
        email: "mehta@university.edu",
        department: "Computer Science",
        profileImage: "https://randomuser.me/api/portraits/men/45.jpg",
        designation: "Professor",
        rating: 4.3
      },
      nextClass: "Friday, 3:00 PM",
      hasFeedbackSubmitted: true
    }
  ]);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole !== "student") router.push("/");
  }, [router]);

  const handleFeedbackClick = (courseCode: string, teacherId: string) => {
    router.push(`/student/student_feedback?course=${courseCode}&teacher=${teacherId}`);
  };

  const handleTeacherProfileClick = (teacherId: string) => {
    router.push(`/student/student_faculties?id=${teacherId}`);
  };

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-200">
      <StudentSidebar />
      <div className="flex-1 p-6 ml-16">
        <TopBar />
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center ml-5">
            <div className="p-3 mr-4 bg-green-600 rounded-xl shadow-lg">
              <FaBook className="text-gray-100 text-2xl" />
            </div>
            <Typography 
              variant="h4" 
              component="h1" 
              className="font-bold bg-green-600 bg-clip-text text-transparent"
            >
              My Courses
            </Typography>
          </div>

          <div className="w-1/3">
            <input
              type="text"
              placeholder="Search courses or teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6 ml-5">
          {filteredCourses.map((course) => (
            <div key={course.code} className="bg-gray-800 rounded-lg shadow-md border border-gray-700 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Course Information */}
                <div className="p-5 flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-xl font-bold text-blue-400">{course.name}</h2>
                      <p className="text-gray-400 text-sm">{course.code} • {course.credits} Credits</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-xs">
                      Semester {course.semester}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{course.description}</p>
                  <div className="text-sm text-gray-400">
                    <div className="flex items-center">
                      <FaInfoCircle className="mr-2" />
                      Next class: <span className="ml-1 text-blue-300">{course.nextClass}</span>
                    </div>
                  </div>
                </div>

                {/* Teacher Information with Feedback Link */}
                <div className="bg-gray-750 p-5 md:w-80 border-t md:border-t-0 md:border-l border-gray-700">
                  <h3 className="text-lg font-semibold mb-3">
                    Course Faculty
                  </h3>
                  
                  <div className="flex items-center mb-4">
                    <div>
                      <p className="font-medium text-white">{course.teacher.name}</p>
                      <p className="text-sm text-gray-400">{course.teacher.designation}</p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`text-xs ${i < Math.floor(course.teacher.rating) ? "text-yellow-400" : "text-gray-600"}`}
                          />
                        ))}
                        <span className="ml-2 text-gray-400">{course.teacher.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTeacherProfileClick(course.teacher.id)}
                    className="w-full py-2 mb-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    View Profile
                  </button>

                  {!course.hasFeedbackSubmitted && (
                    <button
                      onClick={() => handleFeedbackClick(course.code, course.teacher.id)}
                      className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                    >
                      Submit Feedback
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentCourses;