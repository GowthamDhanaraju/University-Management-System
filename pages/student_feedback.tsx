import React, { useState } from "react";
import { Typography, Select, MenuItem, TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SideBar from "@/components/student_sidebar";
import StarIcon from "@mui/icons-material/Star";

const FeedbackPage = () => {
  const [courseRatings, setCourseRatings] = useState<Record<number, number>>({});
  const [facultyRatings, setFacultyRatings] = useState<Record<number, number>>({});

  const handleRatingChange = (_category: string, index: number, value: number, type: string) => {
    if (type === "course") {
      setCourseRatings({ ...courseRatings, [index]: value });
    } else {
      setFacultyRatings({ ...facultyRatings, [index]: value });
    }
  };

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      {/* Sidebar */}
      <div className="w-[240px]">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Move heading to the left */}
        <Typography variant="h4" className="font-bold text-green-400 mb-6 ml-4">
          📝 Student Feedback
        </Typography>

        {/* Feedback Form */}
        <div className="flex justify-start ml-4">
          <div className="w-[900px] p-6 bg-gray-700 rounded-lg">
            <div className="flex justify-between gap-8 flex-wrap">
              {/* Course Feedback Section */}
              <div className="flex-1 min-w-[400px]">
                <Typography variant="h6" className="flex items-center mb-4">
                  📖 Course Feedback
                </Typography>
                <Select fullWidth displayEmpty className="bg-gray-700 text-white rounded-md">
                  <MenuItem value="">Select Course</MenuItem>
                </Select>

                {["Course Content & Structure", "Teaching Materials & Resources", "Practical Applications"].map(
                  (criteria, index) => (
                    <div key={index} className="flex items-center justify-between mt-4 w-full">
                      <Typography className="min-w-[200px] text-left">{criteria}</Typography>
                      <div className="flex justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            onClick={() => handleRatingChange("course", index, i + 1, "course")}
                            className={`cursor-pointer ${
                              i < (courseRatings[index] || 0) ? "text-yellow-400" : "text-gray-500"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Faculty Feedback Section */}
              <div className="flex-1 min-w-[400px]">
                <Typography variant="h6" className="flex items-center mb-4">
                  👨‍🏫 Faculty Feedback
                </Typography>
                <Select fullWidth displayEmpty className="bg-gray-700 text-white rounded-md">
                  <MenuItem value="">Select Faculty</MenuItem>
                </Select>

                {["Teaching Effectiveness", "Communication Skills", "Student Engagement"].map((criteria, index) => (
                  <div key={index} className="flex items-center justify-between mt-4 w-full">
                    <Typography className="min-w-[200px] text-left">{criteria}</Typography>
                    <div className="flex justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          onClick={() => handleRatingChange("faculty", index, i + 1, "faculty")}
                          className={`cursor-pointer ${
                            i < (facultyRatings[index] || 0) ? "text-yellow-400" : "text-gray-500"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Comments */}
            <div className="mt-6">
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Additional comments (optional)"
                className="bg-gray-700 text-white rounded-md"
              />
            </div>

            {/* Submit Button */}
            <div className="mt-6 text-center">
              <Button
                variant="contained"
                color="primary"
                startIcon={<SendIcon />}
                className="w-full bg-blue-500 hover:bg-blue-700"
              >
                Submit Feedback
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
