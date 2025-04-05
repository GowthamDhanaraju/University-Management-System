import React, { useState } from "react";
import {
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  Divider,
  Box,
} from "@mui/material";
import { FaStar, FaPaperPlane } from "react-icons/fa"; // ✅ React Icons
import SideBar from "@/components/student_sidebar";

const FeedbackPage = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [comments, setComments] = useState("");

  const [ratings, setRatings] = useState({
    courseContent: 0,
    teachingMaterials: 0,
    practicalApplications: 0,
    teachingEffectiveness: 0,
    communicationSkills: 0,
    studentEngagement: 0,
    courseDifficulty: 0,
    workload: 0,
    gradingFairness: 0,
    overallSatisfaction: 0,
  });

  const handleRatingChange = (name: string, value: number) => {
    setRatings({ ...ratings, [name]: value });
  };

  const handleSubmit = () => {
    console.log({ selectedCourse, selectedFaculty, ratings, comments });
    // Add actual submission logic here
  };

  return (
    <Box className="flex min-h-screen bg-gray-900 text-white">
      <Box className="w-[240px] fixed h-full">
        <SideBar />
      </Box>

      <Box className="flex-1 pl-[240px] bg-gray-800 min-h-screen">
        <Box className="p-6 max-w-6xl">
          <Box className="mb-4">
            <Typography variant="h4" className="font-bold text-green-400 mb-1">
              📝 Student Feedback Form
            </Typography>
            <Typography variant="body2" className="text-gray-300">
              Your feedback helps us improve the quality of education.
            </Typography>
          </Box>

          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Box>
              <Typography variant="subtitle1" className="text-green-300 mb-1">
                📖 Select Course
              </Typography>
              <Select
                fullWidth
                size="small"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                displayEmpty
                renderValue={(selected) =>
                  selected ? selected : <span style={{ color: "#9ca3af" }}>Select Course</span>}
                className="bg-gray-700 text-white rounded"
                sx={{ "& .MuiSelect-select": { padding: "8px 12px" } }}
              >
                <MenuItem value="cs101">Computer Science 101</MenuItem>
                <MenuItem value="math201">Mathematics 201</MenuItem>
                <MenuItem value="phy301">Physics 301</MenuItem>
                <MenuItem value="eng401">Engineering 401</MenuItem>
              </Select>
            </Box>

            <Box>
              <Typography variant="subtitle1" className="text-green-300 mb-1">
                👨‍🏫 Select Faculty
              </Typography>
              <Select
                fullWidth
                size="small"
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                displayEmpty
                renderValue={(selected) =>
                  selected ? selected : <span style={{ color: "#9ca3af" }}>Select Faculties</span>}
                className="bg-gray-700 text-white rounded"
                sx={{ "& .MuiSelect-select": { padding: "8px 12px" } }}
              >
                <MenuItem value="dr_smith">Dr. Smith</MenuItem>
                <MenuItem value="prof_johnson">Prof. Johnson</MenuItem>
                <MenuItem value="dr_williams">Dr. Williams</MenuItem>
                <MenuItem value="prof_brown">Prof. Brown</MenuItem>
              </Select>
            </Box>
          </Box>

          <Divider className="bg-gray-600 my-3" />

          <Box className="mb-4">
            <Typography variant="h6" className="text-green-400 mb-2">
              Course Evaluation
            </Typography>

            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "courseContent", label: "Course Content & Structure" },
                { name: "teachingMaterials", label: "Teaching Materials & Resources" },
                { name: "practicalApplications", label: "Practical Applications" },
                { name: "courseDifficulty", label: "Course Difficulty Level" },
                { name: "workload", label: "Workload Appropriateness" },
                { name: "gradingFairness", label: "Grading Fairness" },
              ].map((item) => (
                <Box key={item.name} className="flex flex-col">
                  <Typography variant="body2" className="mb-1 text-gray-300">
                    {item.label}
                  </Typography>
                  <Box className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        onClick={() => handleRatingChange(item.name, star)}
                        className={`cursor-pointer ${
                          star <= ratings[item.name as keyof typeof ratings]
                            ? "text-yellow-400"
                            : "text-gray-500"
                        }`}
                        size={20}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Divider className="bg-gray-600 my-3" />

          <Box className="mb-4">
            <Typography variant="h6" className="text-green-400 mb-2">
              Faculty Evaluation
            </Typography>

            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "teachingEffectiveness", label: "Teaching Effectiveness" },
                { name: "communicationSkills", label: "Communication Skills" },
                { name: "studentEngagement", label: "Student Engagement" },
              ].map((item) => (
                <Box key={item.name} className="flex flex-col">
                  <Typography variant="body2" className="mb-1 text-gray-300">
                    {item.label}
                  </Typography>
                  <Box className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        onClick={() => handleRatingChange(item.name, star)}
                        className={`cursor-pointer ${
                          star <= ratings[item.name as keyof typeof ratings]
                            ? "text-yellow-400"
                            : "text-gray-500"
                        }`}
                        size={20}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Divider className="bg-gray-600 my-3" />

          <Box className="mb-4">
            <Typography variant="h6" className="text-green-400 mb-2">
              Overall Rating
            </Typography>
            <Box className="flex flex-col">
              <Typography variant="body2" className="mb-1 text-gray-300">
                Overall Satisfaction with the Course
              </Typography>
              <Box className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    onClick={() => handleRatingChange("overallSatisfaction", star)}
                    className={`cursor-pointer ${
                      star <= ratings.overallSatisfaction
                        ? "text-yellow-400"
                        : "text-gray-500"
                    }`}
                    size={22}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          <Divider className="bg-gray-600 my-3" />

          <Box className="mb-4">
            <Typography variant="h6" className="text-green-400 mb-2">
              Additional Feedback
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Please share any additional comments, suggestions, or concerns about the course or faculty..."
              className="bg-gray-700"
              InputProps={{
                style: {
                  color: "white",
                  padding: "8px 12px",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgb(75, 85, 99)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgb(74, 222, 128)",
                  },
                },
              }}
            />
          </Box>

          <Box className="mt-6 flex justify-center">
            <Button
              variant="contained"
              startIcon={<FaPaperPlane />} // ✅ React Icon
              onClick={handleSubmit}
              sx={{
                width: { xs: "100%", md: "50%" },
                backgroundColor: "#16a34a",
                padding: "10px 16px",
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "#15803d",
                },
                "&:disabled": {
                  backgroundColor: "#374151",
                  color: "#6b7280",
                },
              }}
            >
              Submit Feedback
            </Button>
          </Box>

          <Box className="mt-8 text-center text-gray-400 text-sm">
            <Typography>
              Thank you for your time and valuable input!
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FeedbackPage;
