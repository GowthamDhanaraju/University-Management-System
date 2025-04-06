import React, { useState } from "react";
import AdminSidebar from "@/components/admin_sidebar";
import { useRouter } from "next/router";

// Define TypeScript interfaces for our data structures
interface Teacher {
  name: string;
  id: string;
  dept: string;
  subjects: string;
  email: string;
  phone: string;
  feedback?: FeedbackEntry[];
}

interface FeedbackEntry {
  id: string;
  subject: string; 
  section: string;
  date: string;
  rating: number;
  comment: string;
  studentId?: string;
}

const AdminTFeedback: React.FC = () => {
  const router = useRouter();
  
  // Enhanced teacher data with feedback arrays
  const [teachers, setTeachers] = useState<Teacher[]>([
    { 
      name: "Dr. Rajesh Sharma", 
      id: "PHY101", 
      dept: "Physics", 
      subjects: "Quantum Mechanics, Thermodynamics", 
      email: "rajesh.sharma@example.com", 
      phone: "+91 9876543210",
      feedback: [
        { id: "f1", subject: "Quantum Mechanics", section: "AIE-C", date: "2025-03-30", rating: 4.5, comment: "Excellent explanation of complex concepts" },
        { id: "f2", subject: "Quantum Mechanics", section: "AIE-C", date: "2025-03-28", rating: 4.8, comment: "Very engaging lecturer" },
        { id: "f3", subject: "Thermodynamics", section: "AID-A", date: "2025-03-25", rating: 4.2, comment: "Clear explanations but could provide more examples" },
        { id: "f4", subject: "Thermodynamics", section: "AID-A", date: "2025-03-20", rating: 4.0, comment: "Good teaching style but fast paced" },
        { id: "f5", subject: "Quantum Mechanics", section: "CYS-G", date: "2025-03-18", rating: 4.7, comment: "Excellent problem-solving sessions" },
        { id: "f6", subject: "Quantum Mechanics", section: "CYS-G", date: "2025-03-15", rating: 4.6, comment: "Very helpful with doubts" },
        { id: "f7", subject: "Thermodynamics", section: "AID-A", date: "2025-03-12", rating: 4.3, comment: "Practical applications were very helpful" },
        { id: "f8", subject: "Thermodynamics", section: "AID-A", date: "2025-03-10", rating: 4.1, comment: "Could improve on assignment clarity" },
        { id: "f9", subject: "Quantum Mechanics", section: "AIE-C", date: "2025-03-05", rating: 4.9, comment: "Best physics professor" },
        { id: "f10", subject: "Quantum Mechanics", section: "AIE-C", date: "2025-03-01", rating: 4.4, comment: "Great at simplifying difficult concepts" },
        { id: "f11", subject: "Thermodynamics", section: "AID-A", date: "2025-02-28", rating: 4.2, comment: "Good lecture notes and materials" }
      ]
    },
    
    {
      name: "Prof. Ananya Iyer", 
      id: "CSE202", 
      dept: "Computer Science", 
      subjects: "Artificial Intelligence, Data Structures", 
      email: "ananya.iyer@example.com", 
      phone: "+91 8765432109",
      feedback: [
        { id: "f12", subject: "Artificial Intelligence", section: "AIML-A", date: "2025-03-29", rating: 4.8, comment: "Excellent project guidance" },
        { id: "f13", subject: "Data Structures", section: "AID-B", date: "2025-03-27", rating: 4.7, comment: "Very clear explanations of complex algorithms" },
        { id: "f14", subject: "Artificial Intelligence", section: "AIML-A", date: "2025-03-24", rating: 4.9, comment: "Inspiring lectures on machine learning" },
        { id: "f15", subject: "Data Structures", section: "AID-B", date: "2025-03-22", rating: 4.6, comment: "Great coding examples" },
        { id: "f16", subject: "Artificial Intelligence", section: "AIML-A", date: "2025-03-19", rating: 4.7, comment: "Excellent hands-on exercises" },
        { id: "f17", subject: "Data Structures", section: "AID-B", date: "2025-03-17", rating: 4.5, comment: "Very helpful office hours" },
        { id: "f18", subject: "Artificial Intelligence", section: "AIML-A", date: "2025-03-14", rating: 4.8, comment: "Cutting-edge course content" },
        { id: "f19", subject: "Data Structures", section: "AID-B", date: "2025-03-10", rating: 4.6, comment: "Clear problem sets" },
        { id: "f20", subject: "Artificial Intelligence", section: "AIML-A", date: "2025-03-07", rating: 4.9, comment: "Excellent industry insights" },
        { id: "f21", subject: "Data Structures", section: "AID-B", date: "2025-03-03", rating: 4.7, comment: "Great visualization of complex data structures" }
      ]
    },
    
    {
      name: "Dr. Vikram Patel",
      id: "MATH303",
      dept: "Mathematics",
      subjects: "Linear Algebra, Probability",
      email: "vikram.patel@example.com",
      phone: "+91 7654321098",
      feedback: [
        { id: "f22", subject: "Linear Algebra", section: "DSA-A", date: "2025-03-26", rating: 4.6, comment: "Explains matrix operations clearly" },
        { id: "f23", subject: "Probability", section: "CYS-D", date: "2025-03-24", rating: 4.7, comment: "Engaging examples and real-world use cases" },
        { id: "f24", subject: "Linear Algebra", section: "DSA-A", date: "2025-03-21", rating: 4.5, comment: "Good use of visual aids" },
        { id: "f25", subject: "Probability", section: "CYS-D", date: "2025-03-19", rating: 4.4, comment: "Well-structured lectures" },
        { id: "f26", subject: "Linear Algebra", section: "DSA-A", date: "2025-03-16", rating: 4.6, comment: "Concepts made very intuitive" },
        { id: "f27", subject: "Probability", section: "CYS-D", date: "2025-03-13", rating: 4.8, comment: "Very helpful with assignments" },
        { id: "f28", subject: "Linear Algebra", section: "DSA-A", date: "2025-03-10", rating: 4.3, comment: "Could slow down a bit in difficult topics" },
        { id: "f29", subject: "Probability", section: "CYS-D", date: "2025-03-08", rating: 4.5, comment: "Explained Bayes' theorem excellently" }
      ]
    },
    {
      name: "Prof. Sushmita Banerjee",
      id: "ENG404",
      dept: "English",
      subjects: "Literature, Creative Writing",
      email: "sushmita.banerjee@example.com",
      phone: "+91 6543210987",
      feedback: [
        { id: "f30", subject: "Literature", section: "AIE-B", date: "2025-03-28", rating: 4.7, comment: "Passionate and deeply knowledgeable" },
        { id: "f31", subject: "Creative Writing", section: "AID-G", date: "2025-03-26", rating: 4.8, comment: "Encourages imaginative thinking and originality" },
        { id: "f32", subject: "Literature", section: "AIE-B", date: "2025-03-23", rating: 4.6, comment: "Brilliant interpretation of classic texts" },
        { id: "f33", subject: "Creative Writing", section: "AID-G", date: "2025-03-21", rating: 4.9, comment: "Fosters a creative and supportive environment" },
        { id: "f34", subject: "Literature", section: "AIE-B", date: "2025-03-18", rating: 4.5, comment: "Very interactive and analytical discussions" },
        { id: "f35", subject: "Creative Writing", section: "AID-G", date: "2025-03-15", rating: 4.7, comment: "Excellent feedback on writing assignments" },
        { id: "f36", subject: "Literature", section: "AIE-B", date: "2025-03-12", rating: 4.6, comment: "Great coverage of themes and symbolism" },
        { id: "f37", subject: "Creative Writing", section: "AID-G", date: "2025-03-10", rating: 4.8, comment: "Inspires creativity and confidence in writing" }
      ]
    },
    {
      name: "Dr. Arvind Kumar",
      id: "MECH505",
      dept: "Mechanical",
      subjects: "Fluid Mechanics, Robotics",
      email: "arvind.kumar@example.com",
      phone: "+91 5432109876",
      feedback: [
        { id: "f38", subject: "Fluid Mechanics", section: "CYS-C", date: "2025-03-30", rating: 4.6, comment: "Explained Bernoulli's principle with real-life examples" },
        { id: "f39", subject: "Robotics", section: "AIE-D", date: "2025-03-28", rating: 4.7, comment: "Hands-on sessions were highly informative" },
        { id: "f40", subject: "Fluid Mechanics", section: "CYS-C", date: "2025-03-25", rating: 4.5, comment: "Excellent use of simulations" },
        { id: "f41", subject: "Robotics", section: "AIE-D", date: "2025-03-23", rating: 4.8, comment: "Great integration of theory and practicals" },
        { id: "f42", subject: "Fluid Mechanics", section: "CYS-C", date: "2025-03-21", rating: 4.4, comment: "Clear concepts but needs better pacing" },
        { id: "f43", subject: "Robotics", section: "AIE-D", date: "2025-03-18", rating: 4.9, comment: "Cutting-edge content and robotics demos" },
        { id: "f44", subject: "Fluid Mechanics", section: "CYS-C", date: "2025-03-15", rating: 4.3, comment: "Well-structured lectures" },
        { id: "f45", subject: "Robotics", section: "AIE-D", date: "2025-03-12", rating: 4.6, comment: "Very engaging and forward-thinking topics" }
      ]
    }
  ]);

  const [newTeacher, setNewTeacher] = useState<Teacher>({ 
    name: "", id: "", dept: "", subjects: "", email: "", phone: "", feedback: [] 
  });

  // State to track which teacher's feedback is being displayed
  const [selectedTeacherIndex, setSelectedTeacherIndex] = useState<number | null>(null);
  const [isEditingFeedback, setIsEditingFeedback] = useState(false);
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null);
  const [editFeedbackForm, setEditFeedbackForm] = useState<FeedbackEntry>({
    id: "", subject: "", section: "", date: "", rating: 0, comment: ""
  });

  const [showAllFeedback, setShowAllFeedback] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTeacher({ ...newTeacher, [e.target.name]: e.target.value });
  };

  const addTeacher = () => {
    if (Object.entries(newTeacher).every(([key, val]) => key === 'feedback' || val.trim() !== "")) {
      setTeachers([...teachers, { ...newTeacher, feedback: [] }]);
      setNewTeacher({ name: "", id: "", dept: "", subjects: "", email: "", phone: "", feedback: [] });
    } else {
      alert("Please fill in all fields.");
    }
  };

  const deleteTeacher = (index: number) => {
    setTeachers(teachers.filter((_, i) => i !== index));
    if (selectedTeacherIndex === index) {
      setSelectedTeacherIndex(null);
    }
  };

  const viewFeedback = (index: number) => {
    setSelectedTeacherIndex(index);
    setIsEditingFeedback(false);
    setShowAllFeedback(false); // Reset to show limited feedback initially
  };

  const handleEditFeedback = (feedback: FeedbackEntry) => {
    setIsEditingFeedback(true);
    setEditingFeedbackId(feedback.id);
    setEditFeedbackForm({ ...feedback });
  };

  const handleFeedbackFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.name === 'rating' ? parseFloat(e.target.value) : e.target.value;
    setEditFeedbackForm({ ...editFeedbackForm, [e.target.name]: value });
  };

  const saveFeedbackChanges = () => {
    if (selectedTeacherIndex !== null && editingFeedbackId) {
      const updatedTeachers = [...teachers];
      const teacherFeedback = updatedTeachers[selectedTeacherIndex].feedback || [];
      
      const feedbackIndex = teacherFeedback.findIndex(f => f.id === editingFeedbackId);
      if (feedbackIndex !== -1) {
        teacherFeedback[feedbackIndex] = { ...editFeedbackForm };
      }
      
      updatedTeachers[selectedTeacherIndex].feedback = teacherFeedback;
      setTeachers(updatedTeachers);
      setIsEditingFeedback(false);
      setEditingFeedbackId(null);
    }
  };

  const addNewFeedback = () => {
    if (selectedTeacherIndex !== null) {
      const newFeedback: FeedbackEntry = {
        id: `f${Date.now()}`,
        subject: "",
        section: "",
        date: new Date().toISOString().split('T')[0],
        rating: 0,
        comment: ""
      };
      
      setEditFeedbackForm(newFeedback);
      setIsEditingFeedback(true);
      setEditingFeedbackId(newFeedback.id);
    }
  };

  const saveFeedback = () => {
    if (selectedTeacherIndex !== null) {
      const updatedTeachers = [...teachers];
      const teacherFeedback = updatedTeachers[selectedTeacherIndex].feedback || [];
      
      if (editingFeedbackId) {
        // If editing existing feedback
        const feedbackIndex = teacherFeedback.findIndex(f => f.id === editingFeedbackId);
        if (feedbackIndex !== -1) {
          teacherFeedback[feedbackIndex] = { ...editFeedbackForm };
        } else {
          // If it's a new feedback entry
          teacherFeedback.push({ ...editFeedbackForm });
        }
      } else {
        // If adding new feedback
        teacherFeedback.push({
          ...editFeedbackForm,
          id: `f${Date.now()}`
        });
      }
      
      updatedTeachers[selectedTeacherIndex].feedback = teacherFeedback.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      setTeachers(updatedTeachers);
      setIsEditingFeedback(false);
      setEditingFeedbackId(null);
      setEditFeedbackForm({ id: "", subject: "", section: "", date: "", rating: 0, comment: "" });
    }
  };

  const deleteFeedback = (feedbackId: string) => {
    if (selectedTeacherIndex !== null) {
      const updatedTeachers = [...teachers];
      const teacherFeedback = updatedTeachers[selectedTeacherIndex].feedback || [];
      
      updatedTeachers[selectedTeacherIndex].feedback = teacherFeedback.filter(
        feedback => feedback.id !== feedbackId
      );
      
      setTeachers(updatedTeachers);
    }
  };

  const viewAllFeedback = (teacherId: string) => {
    const index = teachers.findIndex((t) => t.id === teacherId);
    if (index !== -1) {
      setSelectedTeacherIndex(index);
      setShowAllFeedback(true);
    }
  };

  // Get subject-specific feedback
  const getSubjectSpecificFeedback = (teacherIndex: number, subject: string) => {
    if (teacherIndex < 0 || !teachers[teacherIndex].feedback) return [];
    return teachers[teacherIndex].feedback!.filter(f => f.subject === subject);
  };

  // Getting unique subject names from subjects string
  const getSubjectNames = (subjects: string): string[] => {
    return subjects.split(", ");
  };

  return (
    <div className="flex bg-gray-900 min-h-screen">
      <AdminSidebar />
      <div className="ml-16 p-6 w-full text-gray-200">
        <h1 className="text-2xl font-bold text-white">Teacher Management</h1>
        
        {selectedTeacherIndex === null ? (
          <>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-gray-100">Add Teacher</h3>
              <div className="grid grid-cols-3 gap-4 mt-3">
                <input
                  type="text"
                  name="name"
                  value={newTeacher.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="bg-gray-700 border border-gray-600 p-2 rounded text-white placeholder-gray-400"
                />
                <input
                  type="text"
                  name="id"
                  value={newTeacher.id}
                  onChange={handleInputChange}
                  placeholder="ID"
                  className="bg-gray-700 border border-gray-600 p-2 rounded text-white placeholder-gray-400"
                />
                <input
                  type="text"
                  name="dept"
                  value={newTeacher.dept}
                  onChange={handleInputChange}
                  placeholder="Department"
                  className="bg-gray-700 border border-gray-600 p-2 rounded text-white placeholder-gray-400"
                />
                <input
                  type="text"
                  name="subjects"
                  value={newTeacher.subjects}
                  onChange={handleInputChange}
                  placeholder="Subjects (comma separated)"
                  className="bg-gray-700 border border-gray-600 p-2 rounded text-white placeholder-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  value={newTeacher.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="bg-gray-700 border border-gray-600 p-2 rounded text-white placeholder-gray-400"
                />
                <input
                  type="text"
                  name="phone"
                  value={newTeacher.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className="bg-gray-700 border border-gray-600 p-2 rounded text-white placeholder-gray-400"
                />
              </div>
              <button onClick={addTeacher} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                Add Teacher
              </button>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-gray-100">Faculty Information</h3>
              <table className="w-full border-collapse mt-4">
                <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="p-2 border-b border-gray-600">Name</th>
                    <th className="p-2 border-b border-gray-600">ID</th>
                    <th className="p-2 border-b border-gray-600">Department</th>
                    <th className="p-2 border-b border-gray-600">Subjects</th>
                    <th className="p-2 border-b border-gray-600">Email</th>
                    <th className="p-2 border-b border-gray-600">Phone</th>
                    <th className="p-2 border-b border-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-2">{teacher.name}</td>
                      <td className="p-2">{teacher.id}</td>
                      <td className="p-2">{teacher.dept}</td>
                      <td className="p-2">{teacher.subjects}</td>
                      <td className="p-2">{teacher.email}</td>
                      <td className="p-2">{teacher.phone}</td>
                      <td className="p-2 flex space-x-2">
                        <button onClick={() => deleteTeacher(index)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                          Delete
                        </button>
                        <button onClick={() => viewFeedback(index)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                          Feedback
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-4 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-100">
                Teacher Feedback: {teachers[selectedTeacherIndex].name}
              </h3>
              <div className="flex space-x-2">
                <button 
                   onClick={() => setSelectedTeacherIndex(null)}
                   className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                   title="Return to teacher list" >
                  Back to List
                </button>
                <button 
                   onClick={addNewFeedback}
                   className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                   title="Add a new feedback entry for this teacher">
                  Add Feedback
                </button>
                <button 
                   onClick={() => setShowAllFeedback(!showAllFeedback)}
                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                   title="Toggle between showing all feedback or recent feedback">
                  {showAllFeedback ? "Show Recent" : "View All Feedback"}
                </button>
              </div>
            </div>

            {isEditingFeedback ? (
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 mb-6">
                <h4 className="text-white font-semibold mb-3">
                  {editingFeedbackId ? "Edit Feedback" : "Add New Feedback"}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-1">Subject</label>
                    <select
                      name="subject"
                      value={editFeedbackForm.subject}
                      onChange={handleFeedbackFormChange}
                      className="w-full bg-gray-800 border border-gray-600 p-2 rounded text-white"
                    >
                      <option value="">Select Subject</option>
                      {getSubjectNames(teachers[selectedTeacherIndex].subjects).map((subjectName, idx) => (
                        <option key={idx} value={subjectName}>{subjectName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Section</label>
                    <input
                      type="text"
                      name="section"
                      value={editFeedbackForm.section}
                      onChange={handleFeedbackFormChange}
                      placeholder="e.g. AIE-C, AID-A"
                      className="w-full bg-gray-800 border border-gray-600 p-2 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={editFeedbackForm.date}
                      onChange={handleFeedbackFormChange}
                      className="w-full bg-gray-800 border border-gray-600 p-2 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Rating (0-5)</label>
                    <input
                      type="number"
                      name="rating"
                      min="0"
                      max="5"
                      step="0.1"
                      value={editFeedbackForm.rating}
                      onChange={handleFeedbackFormChange}
                      className="w-full bg-gray-800 border border-gray-600 p-2 rounded text-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-gray-300 mb-1">Comment</label>
                    <textarea
                      name="comment"
                      value={editFeedbackForm.comment}
                      onChange={handleFeedbackFormChange}
                      className="w-full bg-gray-800 border border-gray-600 p-2 rounded text-white h-24"
                    ></textarea>
                  </div>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <button 
                      onClick={() => setIsEditingFeedback(false)}
                          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                          title="Cancel editing or adding feedback">
                    Cancel
                  </button>
                  <button 
                     onClick={saveFeedback}
                     className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition"
                     title="Save feedback entry">
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h4 className="font-semibold text-lg text-white mb-2">
                    {showAllFeedback ? "All Feedback" : "Recent Feedback"}
                  </h4>
                  {teachers[selectedTeacherIndex].feedback && teachers[selectedTeacherIndex].feedback!.length > 0 ? (
                    <div className="space-y-4">
                      {(showAllFeedback 
                        ? teachers[selectedTeacherIndex].feedback 
                        : teachers[selectedTeacherIndex].feedback!.slice(0, 10)
                      ).map((feedback) => (
                        <div key={feedback.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-blue-400 font-medium">{feedback.subject} ({feedback.section})</p>
                              <p className="text-gray-400 text-sm">{feedback.date}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="bg-blue-900 text-white px-2 py-1 rounded text-sm">
                                {feedback.rating.toFixed(1)} / 5
                              </span>
                              <button 
                                onClick={() => handleEditFeedback(feedback)}
                                className="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700 text-sm transition"
                                title="Edit this feedback entry">
                                Edit
                              </button>
                              <button 
                                onClick={() => deleteFeedback(feedback.id)}
                                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-sm transition"
                                title="Delete this feedback entry">
                                Delete
                              </button>
                            </div>
                          </div>
                          <p className="mt-2 text-gray-200">{feedback.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No feedback available for this teacher.</p>
                  )}
                </div>

                <div className="space-y-6">
                  <h4 className="font-semibold text-lg text-white">Feedback by Subject</h4>
                  {getSubjectNames(teachers[selectedTeacherIndex].subjects).map((subjectName, idx) => {
                    const subjectFeedback = getSubjectSpecificFeedback(selectedTeacherIndex, subjectName);
                    
                    // Calculate average rating for this subject
                    const avgRating = subjectFeedback.length > 0 
                      ? subjectFeedback.reduce((sum, fb) => sum + fb.rating, 0) / subjectFeedback.length
                      : 0;
                      
                    return (
                      <div key={idx} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="text-white font-medium">{subjectName}</h5>
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
                        
                        {subjectFeedback.length > 0 ? (
                          <div>
                            <p className="text-gray-300 mb-2">{subjectFeedback.length} feedback entries</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {subjectFeedback.slice(0, 4).map((fb) => (
                                <div key={fb.id} className="bg-gray-800 p-3 rounded">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400 text-sm">{fb.date} ({fb.section})</span>
                                    <span className="bg-blue-900 text-white px-2 rounded text-sm">
                                      {fb.rating.toFixed(1)}
                                    </span>
                                  </div>
                                  <p className="text-gray-200 text-sm mt-1 truncate">{fb.comment}</p>
                                </div>
                              ))}
                            </div>
                            
                            {subjectFeedback.length > 4 && (
                              <button 
                                onClick={() => viewAllFeedback(teachers[selectedTeacherIndex].id)}
                                className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
                              >
                                View all {subjectFeedback.length} entries
                              </button>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-400">No feedback available for this subject.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTFeedback;