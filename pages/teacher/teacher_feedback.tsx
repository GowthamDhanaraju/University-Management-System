import React, { useState, useEffect } from "react";
import TeacherSidebar from "@/components/teacher_sidebar";
import { FaChalkboardTeacher, FaComments, FaStar, FaFilter } from "react-icons/fa";
import { Typography, Paper, Divider, Box, Chip } from "@mui/material";

interface Feedback {
  id: number;
  courseId: number;
  courseName: string;
  studentId: string;
  date: string;
  courseRatings: {
    contentQuality: number;
    difficultyLevel: number;
    practicalApplication: number;
  };
  facultyRatings: {
    teachingQuality: number;
    communication: number;
    availability: number;
  };
  overallRating: number;
  comments: string;
}

const TeacherFeedback: React.FC = () => {
  // Sample data - replace with actual API calls
  const courses = [
    { id: 1, name: "Mathematics" },
    { id: 2, name: "Computer Science" },
    { id: 3, name: "Physics" },
    { id: 4, name: "Chemistry" },
  ];

  const mockFeedbacks: Feedback[] = [
    {
      id: 1,
      courseId: 1,
      courseName: "Mathematics",
      studentId: "S12345",
      date: "2023-05-10",
      courseRatings: {
        contentQuality: 4,
        difficultyLevel: 3,
        practicalApplication: 5,
      },
      facultyRatings: {
        teachingQuality: 5,
        communication: 4,
        availability: 4,
      },
      overallRating: 4,
      comments: "Excellent teaching methods and course material was well structured."
    },
    {
      id: 2,
      courseId: 1,
      courseName: "Mathematics",
      studentId: "S67890",
      date: "2023-05-15",
      courseRatings: {
        contentQuality: 5,
        difficultyLevel: 4,
        practicalApplication: 4,
      },
      facultyRatings: {
        teachingQuality: 5,
        communication: 5,
        availability: 3,
      },
      overallRating: 5,
      comments: "The professor was very knowledgeable and helped me understand complex concepts."
    },
    {
      id: 3,
      courseId: 2,
      courseName: "Computer Science",
      studentId: "S23456",
      date: "2023-05-12",
      courseRatings: {
        contentQuality: 4,
        difficultyLevel: 5,
        practicalApplication: 5,
      },
      facultyRatings: {
        teachingQuality: 4,
        communication: 3,
        availability: 4,
      },
      overallRating: 4,
      comments: "Great practical examples, but sometimes the explanations were too complex."
    },
    {
      id: 4,
      courseId: 3,
      courseName: "Physics",
      studentId: "S45678",
      date: "2023-05-18",
      courseRatings: {
        contentQuality: 5,
        difficultyLevel: 5,
        practicalApplication: 4,
      },
      facultyRatings: {
        teachingQuality: 5,
        communication: 5,
        availability: 5,
      },
      overallRating: 5,
      comments: "The best professor I've had. Perfectly balanced theory and practical applications."
    }
  ];

  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(mockFeedbacks);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>(mockFeedbacks);

  useEffect(() => {
    if (selectedCourse) {
      setFilteredFeedbacks(feedbacks.filter(feedback => feedback.courseName === selectedCourse));
    } else {
      setFilteredFeedbacks(feedbacks);
    }
  }, [selectedCourse, feedbacks]);

  const calculateAverageRatings = () => {
    if (filteredFeedbacks.length === 0) return {
      courseQuality: 0,
      teachingQuality: 0,
      overall: 0
    };

    const courseQuality = filteredFeedbacks.reduce((sum, fb) => {
      return sum + (
        (fb.courseRatings.contentQuality + 
         fb.courseRatings.difficultyLevel + 
         fb.courseRatings.practicalApplication) / 3
      );
    }, 0) / filteredFeedbacks.length;

    const teachingQuality = filteredFeedbacks.reduce((sum, fb) => {
      return sum + (
        (fb.facultyRatings.teachingQuality + 
         fb.facultyRatings.communication + 
         fb.facultyRatings.availability) / 3
      );
    }, 0) / filteredFeedbacks.length;

    const overall = filteredFeedbacks.reduce((sum, fb) => sum + fb.overallRating, 0) / filteredFeedbacks.length;

    return {
      courseQuality: parseFloat(courseQuality.toFixed(1)),
      teachingQuality: parseFloat(teachingQuality.toFixed(1)),
      overall: parseFloat(overall.toFixed(1))
    };
  };

  const averageRatings = calculateAverageRatings();

  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-lg ${i < rating ? "text-yellow-400" : "text-gray-400"}`}>★</span>
        ))}
        <span className="ml-2 text-white">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex">
      <TeacherSidebar />
      <div className="flex-1 p-6 ml-16 flex flex-col">
        {/* TopBar component removed */}

        <div className="flex items-center mb-8 ml-6">
          <div className="p-3 mr-4 bg-purple-500 rounded-xl shadow-lg">
            <FaComments className="text-gray-100 text-2xl" />
          </div>
          <Typography 
            variant="h4" 
            component="h1" 
            className="font-bold bg-purple-500 bg-clip-text text-transparent"
          >
            Feedback Dashboard
          </Typography>
        </div>
        
        <div className="ml-6 mb-6">
          <div className="flex items-center mb-4">
            <FaFilter className="mr-2 text-purple-400" />
            <Typography variant="h6" component="h2" className="text-white">
              Filter by Course
            </Typography>
          </div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.name}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        {/* Feedback Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ml-6">
          <div className="bg-gray-800 p-5 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-2 text-purple-300">Course Quality</h3>
            <div className="flex items-center">
              {renderStars(averageRatings.courseQuality)}
            </div>
          </div>
          <div className="bg-gray-800 p-5 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-2 text-purple-300">Teaching Quality</h3>
            <div className="flex items-center">
              {renderStars(averageRatings.teachingQuality)}
            </div>
          </div>
          <div className="bg-gray-800 p-5 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-2 text-purple-300">Overall Rating</h3>
            <div className="flex items-center">
              {renderStars(averageRatings.overall)}
            </div>
          </div>
        </div>

        {/* Feedback Items */}
        <div className="ml-6">
          <Typography variant="h5" component="h2" className="mb-4 font-semibold text-white">
            {filteredFeedbacks.length} {filteredFeedbacks.length === 1 ? 'Feedback' : 'Feedbacks'} Received
          </Typography>

          {filteredFeedbacks.length === 0 ? (
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
              <Typography variant="body1">No feedback found for the selected course.</Typography>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredFeedbacks.map((feedback) => (
                <div key={feedback.id} className="bg-gray-800 p-6 rounded-xl shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <Typography variant="h6" className="text-blue-400">
                        {feedback.courseName}
                      </Typography>
                      <Typography variant="body2" className="text-gray-400">
                        Student ID: {feedback.studentId} • {feedback.date}
                      </Typography>
                    </div>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-bold">{feedback.overallRating}/5</span>
                    </div>
                  </div>
                  
                  <Divider className="bg-gray-600 mb-4" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Typography variant="subtitle2" className="text-purple-300 mb-2">
                        Course Ratings
                      </Typography>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Content Quality:</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`${i < feedback.courseRatings.contentQuality ? "text-yellow-400" : "text-gray-400"}`}>★</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span>Difficulty Level:</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`${i < feedback.courseRatings.difficultyLevel ? "text-yellow-400" : "text-gray-400"}`}>★</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span>Practical Application:</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`${i < feedback.courseRatings.practicalApplication ? "text-yellow-400" : "text-gray-400"}`}>★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Typography variant="subtitle2" className="text-purple-300 mb-2">
                        Faculty Ratings
                      </Typography>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Teaching Quality:</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`${i < feedback.facultyRatings.teachingQuality ? "text-yellow-400" : "text-gray-400"}`}>★</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span>Communication:</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`${i < feedback.facultyRatings.communication ? "text-yellow-400" : "text-gray-400"}`}>★</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span>Availability:</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`${i < feedback.facultyRatings.availability ? "text-yellow-400" : "text-gray-400"}`}>★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {feedback.comments && (
                    <>
                      <Typography variant="subtitle2" className="text-purple-300 mb-2">
                        Comments
                      </Typography>
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <Typography variant="body2">{feedback.comments}</Typography>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherFeedback;
