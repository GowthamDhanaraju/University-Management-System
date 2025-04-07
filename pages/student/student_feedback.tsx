import React, { useState } from "react";
import StudentSidebar from "@/components/student_sidebar";
import TopBar from "@/components/student_topbar";
import { FaChalkboardTeacher, FaComments, FaPaperPlane } from "react-icons/fa";
import { Typography } from "@mui/material";

interface Ratings {
  [key: string]: number;
}

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
  maxRating?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating, maxRating = 5 }) => {
  return (
    <div className="flex items-center">
      {[...Array(maxRating)].map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setRating(i + 1)}
          className={`text-2xl ${i < rating ? "text-yellow-400" : "text-gray-400"}`}
          aria-label={`Rate ${i + 1} out of ${maxRating}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const StudentFeedback: React.FC = () => {
  // Sample data - replace with your actual data
  const courses = [
    { id: 1, name: "Mathematics" },
    { id: 2, name: "Computer Science" },
    { id: 3, name: "Physics" },
    { id: 4, name: "Chemistry" },
  ];

  const faculties = [
    { id: 1, name: "Dr. Smith" },
    { id: 2, name: "Prof. Johnson" },
    { id: 3, name: "Dr. Williams" },
    { id: 4, name: "Prof. Brown" },
  ];

  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedFaculty, setSelectedFaculty] = useState<string>("");
  const [courseRatings, setCourseRatings] = useState<Ratings>({
    contentQuality: 0,
    difficultyLevel: 0,
    practicalApplication: 0,
  });

  const [facultyRatings, setFacultyRatings] = useState<Ratings>({
    teachingQuality: 0,
    communication: 0,
    availability: 0,
  });

  const [overallRating, setOverallRating] = useState<number>(0);
  const [additionalFeedback, setAdditionalFeedback] = useState<string>("");

  const handleCourseRatingChange = (aspect: string, rating: number) => {
    setCourseRatings((prev) => ({
      ...prev,
      [aspect]: rating,
    }));
  };

  const handleFacultyRatingChange = (aspect: string, rating: number) => {
    setFacultyRatings((prev) => ({
      ...prev,
      [aspect]: rating,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !selectedFaculty) {
      alert("Please select both a course and a faculty member");
      return;
    }
    
    console.log({
      course: selectedCourse,
      faculty: selectedFaculty,
      courseRatings,
      facultyRatings,
      overallRating,
      additionalFeedback,
    });
    alert("Feedback submitted successfully!");
    // Reset form
    setSelectedCourse("");
    setSelectedFaculty("");
    setCourseRatings({
      contentQuality: 0,
      difficultyLevel: 0,
      practicalApplication: 0,
    });
    setFacultyRatings({
      teachingQuality: 0,
      communication: 0,
      availability: 0,
    });
    setOverallRating(0);
    setAdditionalFeedback("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex">
      <StudentSidebar />
      <div className="flex-1 p-6 ml-16 flex flex-col">
        <TopBar />

        <div className="flex items-center mb-8 ml-6"> {/* Increased margin-bottom */}
          <div className="p-3 mr-4 bg-purple-500 rounded-xl shadow-lg">
            <FaComments className="text-gray-100 text-2xl" />
          </div>
          <Typography 
            variant="h4" 
            component="h1" 
            className="font-bold bg-purple-500 bg-clip-text text-transparent"
          >
            Feedback Form
          </Typography>
        </div>
        
        <div className="flex-1 flex items-center justify-start w-full ml-6">
          <form 
            onSubmit={handleSubmit}
            className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-lg p-8"
          >

            {/* Selection Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label htmlFor="course" className="block text-sm font-medium mb-2">
                  Select Course
                </label>
                <select
                  id="course"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Select a course --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="faculty" className="block text-sm font-medium mb-2">
                  Select Faculty
                </label>
                <select
                  id="faculty"
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Select a faculty member --</option>
                  {faculties.map((faculty) => (
                    <option key={faculty.id} value={faculty.name}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Feedback Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Course Feedback */}
              <div className="bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-center text-purple-300">
                  Course Feedback
                </h2>
                <div className="space-y-6">
                  {["contentQuality", "difficultyLevel", "practicalApplication"].map((aspect) => (
                    <div key={aspect} className="space-y-2">
                      <p className="font-medium capitalize">
                        {aspect.replace(/([A-Z])/g, " $1")}
                      </p>
                      <StarRating
                        rating={courseRatings[aspect] || 0}
                        setRating={(rating) => handleCourseRatingChange(aspect, rating)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Faculty Feedback */}
              <div className="bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-center text-purple-300">
                  Faculty Feedback
                </h2>
                <div className="space-y-6">
                  {["teachingQuality", "communication", "availability"].map((aspect) => (
                    <div key={aspect} className="space-y-2">
                      <p className="font-medium capitalize">
                        {aspect.replace(/([A-Z])/g, " $1")}
                      </p>
                      <StarRating
                        rating={facultyRatings[aspect] || 0}
                        setRating={(rating) => handleFacultyRatingChange(aspect, rating)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Overall Feedback */}
            <div className="bg-gray-700 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4 text-center text-purple-300">
                Overall Feedback
              </h2>
              <div className="flex justify-center">
                <StarRating rating={overallRating} setRating={setOverallRating} />
              </div>
            </div>

            {/* Additional Feedback */}
            <div className="mb-8">
              <label htmlFor="additionalFeedback" className="block text-sm font-medium mb-2">
                Additional Comments
              </label>
              <textarea
                id="additionalFeedback"
                rows={4}
                className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Please share any additional thoughts about the course or faculty..."
                value={additionalFeedback}
                onChange={(e) => setAdditionalFeedback(e.target.value)}
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-lg text-white transition duration-200 shadow-lg hover:shadow-blue-500/20"
              >
                <FaPaperPlane className="text-white text-xl" />
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentFeedback;