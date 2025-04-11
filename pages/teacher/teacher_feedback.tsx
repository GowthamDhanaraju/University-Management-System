import React, { useState, useEffect } from "react";
import TeacherSidebar from "@/components/teacher_sidebar";
import TopBar from "@/components/topbar";
import { FaComments, FaStar, FaFilter, FaChalkboardTeacher, FaBook } from "react-icons/fa";
import { Typography, Divider } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";

interface Feedback {
  id: number;
  courseId: number;
  courseName: string;
  studentId: string;
  studentName?: string;
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
  const [courses, setCourses] = useState<Array<{ id: number; name: string }>>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [showAllFeedback, setShowAllFeedback] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const teacherId = localStorage.getItem("userId");

        if (!token) {
          router.push("/login");
          return;
        }

        // Fetch courses
        const coursesResponse = await axios.get("/api/teacher/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (coursesResponse.data && Array.isArray(coursesResponse.data)) {
          setCourses(
            coursesResponse.data.map((course) => ({
              id: course.id,
              name: course.name,
            }))
          );
        }

        // Fetch feedback - Using the correct endpoint with teacher ID
        const feedbackResponse = await axios.get(`/api/teachers/feedback?teacherId=${teacherId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (feedbackResponse.data && feedbackResponse.data.success) {
          const feedbackData = feedbackResponse.data.data || [];
          
          const formattedFeedbacks = feedbackData.map((fb) => ({
            id: fb.id,
            courseId: fb.courseId,
            courseName: fb.courseName || "Unknown Course",
            studentId: fb.studentId || "Anonymous",
            studentName: fb.studentName || "Anonymous Student",
            date: fb.date || new Date().toISOString().split("T")[0],
            courseRatings: {
              contentQuality: fb.courseRating?.contentQuality || 0,
              difficultyLevel: fb.courseRating?.difficultyLevel || 0,
              practicalApplication: fb.courseRating?.practicalApplication || 0,
            },
            facultyRatings: {
              teachingQuality: fb.teacherRating?.teachingQuality || 0,
              communication: fb.teacherRating?.communication || 0,
              availability: fb.teacherRating?.availability || 0,
            },
            overallRating: fb.overallRating || 0,
            comments: fb.comments || "",
          }));
          
          console.log("Formatted feedback data:", formattedFeedbacks);
          setFeedbacks(formattedFeedbacks);
          setFilteredFeedbacks(formattedFeedbacks); // Set initial filtered feedback
        } else {
          console.error("Failed to fetch feedback or empty response:", feedbackResponse.data);
          setError("Failed to load feedback data. The response was empty or invalid.");
        }

        setError("");
      } catch (err) {
        console.error("Failed to fetch feedback data:", err);
        setError("Failed to load feedback data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleFilterChange = (courseName: string) => {
    setSelectedCourse(courseName);
    if (courseName) {
      setFilteredFeedbacks(feedbacks.filter((feedback) => feedback.courseName === courseName));
    } else {
      setFilteredFeedbacks(feedbacks); // Show all feedback if no course is selected
    }
  };

  const calculateAverageRatings = () => {
    if (filteredFeedbacks.length === 0)
      return {
        courseQuality: 0,
        teachingQuality: 0,
        overall: 0,
      };

    const courseQuality =
      filteredFeedbacks.reduce((sum, fb) => {
        const courseFeedback = [
          fb.courseRatings.contentQuality || 0,
          fb.courseRatings.difficultyLevel || 0,
          fb.courseRatings.practicalApplication || 0,
        ].filter(rating => rating > 0);
        
        const avgRating = courseFeedback.length > 0 ? 
          courseFeedback.reduce((a, b) => a + b, 0) / courseFeedback.length : 0;
          
        return sum + avgRating;
      }, 0) / filteredFeedbacks.length;

    const teachingQuality =
      filteredFeedbacks.reduce((sum, fb) => {
        const teachingFeedback = [
          fb.facultyRatings.teachingQuality || 0,
          fb.facultyRatings.communication || 0,
          fb.facultyRatings.availability || 0,
        ].filter(rating => rating > 0);
        
        const avgRating = teachingFeedback.length > 0 ? 
          teachingFeedback.reduce((a, b) => a + b, 0) / teachingFeedback.length : 0;
          
        return sum + avgRating;
      }, 0) / filteredFeedbacks.length;

    const overall =
      filteredFeedbacks.reduce((sum, fb) => sum + (fb.overallRating || 0), 0) / filteredFeedbacks.length;

    return {
      courseQuality: parseFloat(courseQuality.toFixed(1)) || 0,
      teachingQuality: parseFloat(teachingQuality.toFixed(1)) || 0,
      overall: parseFloat(overall.toFixed(1)) || 0,
    };
  };

  const averageRatings = calculateAverageRatings();

  const renderStars = (rating: number) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`text-lg ${i < rating ? "text-yellow-400" : "text-gray-400"}`}>
          ★
        </span>
      ))}
      <span className="ml-2 text-white font-semibold">{rating.toFixed(1)}</span>
    </div>
  );

  // Function to get course-specific feedback
  const getCourseSpecificFeedback = (courseName: string) => {
    return feedbacks.filter(f => f.courseName === courseName);
  };

  // Calculate average rating for a specific course
  const getCourseAverageRating = (courseFeedback: Feedback[]) => {
    if (courseFeedback.length === 0) return 0;
    
    return courseFeedback.reduce((sum, fb) => sum + fb.overallRating, 0) / courseFeedback.length;
  };

  // Format date for better display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      // Format: "Jan 15, 2023" with month name
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Get unique course names from feedback
  const uniqueCourses = Array.from(new Set(feedbacks.map(fb => fb.courseName)));

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex">
      <TeacherSidebar />
      <div className="flex-1 p-6 ml-16">
        <TopBar />

        {/* Dashboard Header */}
        <div className="flex items-center space-x-4 ml-6">
          <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
            <FaComments className="text-gray-100 text-2xl" />
          </div>
          <Typography variant="h4" component="h1" className="font-bold bg-blue-500 bg-clip-text text-transparent">
            Feedback Dashboard
          </Typography>
        </div>

        {/* Filter Section */}
        <div className="ml-6 mt-6 bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
          <div className="flex items-center mb-3">
            <FaFilter className="mr-2 text-blue-400" />
            <Typography variant="h6" className="text-white">
              Filter Feedback
            </Typography>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Select Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.name}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:pt-5">
              <button 
                onClick={() => setShowAllFeedback(!showAllFeedback)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors"
              >
                {showAllFeedback ? "Show Recent" : "View All Feedback"}
              </button>
            </div>
          </div>
        </div>

        {/* Ratings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ml-6 mt-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <div className="flex items-center mb-3">
              <FaBook className="text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-blue-300">Course Quality</h3>
            </div>
            {renderStars(averageRatings.courseQuality)}
            <p className="text-sm text-gray-400 mt-2">Average rating across all courses</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <div className="flex items-center mb-3">
              <FaChalkboardTeacher className="text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-blue-300">Teaching Quality</h3>
            </div>
            {renderStars(averageRatings.teachingQuality)}
            <p className="text-sm text-gray-400 mt-2">Based on communication and availability</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <div className="flex items-center mb-3">
              <FaStar className="text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-blue-300">Overall Rating</h3>
            </div>
            {renderStars(averageRatings.overall)}
            <p className="text-sm text-gray-400 mt-2">
              {filteredFeedbacks.length} {filteredFeedbacks.length === 1 ? "review" : "reviews"} received
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-60 ml-6 mt-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-xl">Loading feedback...</span>
          </div>
        ) : error ? (
          <div className="bg-red-900/40 border border-red-800 rounded-lg p-6 ml-6 mt-6">
            <p className="text-red-200">{error}</p>
          </div>
        ) : (
          <>
            {selectedCourse ? (
              // Course-specific feedback view
              <div className="ml-6 mt-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-6">
                  <h2 className="text-xl font-semibold text-white mb-3">
                    Feedback for {selectedCourse}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-blue-300 mb-2">Course Rating Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Content Quality:</span>
                          {renderStars(
                            filteredFeedbacks.filter(fb => fb.courseRatings && typeof fb.courseRatings.contentQuality === 'number')
                              .reduce((sum, fb) => sum + fb.courseRatings.contentQuality, 0) / 
                            Math.max(filteredFeedbacks.filter(fb => fb.courseRatings && typeof fb.courseRatings.contentQuality === 'number').length, 1)
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Difficulty Level:</span>
                          {renderStars(
                            filteredFeedbacks.reduce((sum, fb) => sum + fb.courseRatings.difficultyLevel, 0) / 
                            filteredFeedbacks.length
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Practical Application:</span>
                          {renderStars(
                            filteredFeedbacks.reduce((sum, fb) => sum + fb.courseRatings.practicalApplication, 0) / 
                            filteredFeedbacks.length
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-blue-300 mb-2">Teaching Rating Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Teaching Quality:</span>
                          {renderStars(
                            filteredFeedbacks.reduce((sum, fb) => sum + fb.facultyRatings.teachingQuality, 0) / 
                            filteredFeedbacks.length
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Communication:</span>
                          {renderStars(
                            filteredFeedbacks.reduce((sum, fb) => sum + fb.facultyRatings.communication, 0) / 
                            filteredFeedbacks.length
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Availability:</span>
                          {renderStars(
                            filteredFeedbacks.reduce((sum, fb) => sum + fb.facultyRatings.availability, 0) / 
                            filteredFeedbacks.length
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium text-white mb-3">
                    {filteredFeedbacks.length} {filteredFeedbacks.length === 1 ? "Student Review" : "Student Reviews"}
                  </h3>
                  
                  {filteredFeedbacks.length === 0 ? (
                    <p className="text-gray-400">No feedback found for this course.</p>
                  ) : (
                    <div className="space-y-4">
                      {(showAllFeedback ? filteredFeedbacks : filteredFeedbacks.slice(0, 5)).map((feedback) => (
                        <div key={feedback.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-green-300 font-medium">
                                {feedback.studentName !== 'Anonymous' ? feedback.studentName : 'Anonymous Student'}
                              </p>
                              <p className="text-blue-300 text-xs mt-1 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {formatDate(feedback.date)}
                              </p>
                            </div>
                            <span className="bg-blue-900 text-white px-3 py-1 rounded text-md font-bold">
                              {feedback.overallRating.toFixed(1)}
                            </span>
                          </div>
                          
                          <div className="mt-3 bg-gray-800 p-3 rounded-md">
                            <p className="text-gray-300 font-semibold text-sm mb-1">Comment:</p>
                            <p className="text-gray-200 break-words">{feedback.comments || "No additional comments provided."}</p>
                          </div>
                        </div>
                      ))}
                      
                      {!showAllFeedback && filteredFeedbacks.length > 5 && (
                        <button 
                          onClick={() => setShowAllFeedback(true)}
                          className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                        >
                          Show All {filteredFeedbacks.length} Reviews
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Course overview by subject
              <div className="ml-6 mt-6 space-y-6">
                <h2 className="text-xl font-semibold text-white mb-3">
                  Feedback by Course
                </h2>
                
                {uniqueCourses.length === 0 ? (
                  <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
                    <p className="text-gray-400">No feedback data available yet.</p>
                  </div>
                ) : (
                  uniqueCourses.map((courseName, idx) => {
                    const courseFeedback = getCourseSpecificFeedback(courseName);
                    const avgRating = getCourseAverageRating(courseFeedback);
                    
                    return (
                      <div key={idx} className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium text-white">{courseName}</h3>
                          <div className="flex items-center space-x-3">
                            <span className="text-gray-300">Average Rating:</span>
                            <span className={`px-3 py-1 rounded font-semibold text-white ${
                              avgRating >= 4.5 ? 'bg-green-600' : 
                              avgRating >= 4.0 ? 'bg-blue-600' : 
                              avgRating >= 3.5 ? 'bg-yellow-600' : 'bg-red-600'
                            }`}>
                              {avgRating.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        
                        {courseFeedback.length > 0 ? (
                          <div>
                            <p className="text-gray-300 mb-3">{courseFeedback.length} {courseFeedback.length === 1 ? "review" : "reviews"}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {courseFeedback.slice(0, 4).map((fb) => (
                                <div key={fb.id} className="bg-gray-700 p-3 rounded border border-gray-600">
                                  <div className="flex justify-between">
                                    <span className="text-green-300 text-sm">
                                      {fb.studentName !== 'Anonymous' ? fb.studentName : 'Anonymous Student'}
                                    </span>
                                    <span className="bg-blue-900 text-white px-2 rounded text-sm">
                                      {fb.overallRating.toFixed(1)}
                                    </span>
                                  </div>
                                  <p className="text-gray-400 text-xs mt-1">{formatDate(fb.date)}</p>
                                  <p className="text-gray-200 text-sm mt-2 line-clamp-2">{fb.comments || "No comment provided."}</p>
                                </div>
                              ))}
                            </div>
                            
                            {courseFeedback.length > 4 && (
                              <button 
                                onClick={() => {
                                  setSelectedCourse(courseName);
                                  setShowAllFeedback(true);
                                }}
                                className="mt-3 text-blue-400 hover:text-blue-300 text-sm flex items-center"
                              >
                                View all {courseFeedback.length} reviews
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-400">No feedback available for this course.</p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherFeedback;
