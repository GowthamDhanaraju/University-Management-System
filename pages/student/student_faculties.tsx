import React, { useState } from "react";
import { HiUserCircle } from "react-icons/hi";
import StudentSidebar from "@/components/student_sidebar";
import TopBar from "@/components/student_topbar";
import { facultiesData, Faculty } from "../../data/FacultyData";
import { FaChalkboardTeacher} from "react-icons/fa";
import { Typography } from "@mui/material";

const Faculties = () => {
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex relative">
      <StudentSidebar />
      <div className="flex-1 p-6 ml-16">
        <TopBar />
        <div className="flex items-center mb-8"> {/* Increased margin-bottom */}
          <div className="p-3 mr-4 bg-blue-500 rounded-xl shadow-lg">
            <FaChalkboardTeacher className="text-gray-100 text-2xl" />
          </div>
          <Typography 
            variant="h4" 
            component="h1" 
            className="font-bold bg-blue-500 bg-clip-text text-transparent"
          >
            Faculties Corner
          </Typography>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Increased gap between cards */}
          {facultiesData.map((faculty) => (
            <FacultyCard key={faculty.id} faculty={faculty} onClick={() => setSelectedFaculty(faculty)} />
          ))}
        </div>
      </div>

      {selectedFaculty && (
        <Modal faculty={selectedFaculty} onClose={() => setSelectedFaculty(null)} />
      )}
    </div>
  );
};

const FacultyCard = ({ faculty, onClick }: { faculty: Faculty; onClick: () => void }) => (
  <div
    className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl cursor-pointer group transition duration-300 h-full flex flex-col" /* Added h-full and flex-col */
    onClick={onClick}
  >
    <div className="flex items-center mb-4">
      <HiUserCircle className="text-blue-500 group-hover:text-blue-400 transition text-5xl mr-4" />
      <div>
        <h2 className="text-xl font-semibold group-hover:text-blue-400">{faculty.name}</h2>
        <p className="text-gray-400">{faculty.department}</p>
      </div>
    </div>
    <div className="mb-4"> {/* Added margin-bottom */}
      <Subjects subjects={faculty.subjects} />
    </div>
    <div className="flex justify-between items-center mt-auto"> {/* Pushed contact to bottom */}
      <a href={`mailto:${faculty.email}`} onClick={(e) => e.stopPropagation()} className="text-blue-400 hover:text-blue-300 text-sm font-medium">Contact</a>
      <span className="text-xs text-gray-500">Click for details</span>
    </div>
  </div>
);

const Subjects = ({ subjects }: { subjects: string[] }) => (
  <div className="flex flex-wrap gap-2">
    {subjects.slice(0, 3).map((s, i) => (
      <span key={i} className="px-3 py-1 bg-gray-700 rounded-full text-sm">{s}</span>
    ))}
    {subjects.length > 3 && (
      <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">+{subjects.length - 3} more</span>
    )}
  </div>
);

const Section = ({ title, items }: { title: string; items: string[] }) => (
  <div className="mb-6"> {/* Added margin-bottom */}
    <h3 className="text-lg font-semibold border-b border-gray-700 pb-2 mb-3">{title}</h3>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start">
          <span className="text-blue-400 mr-2">•</span>
          <span className="text-gray-300">{item}</span> {/* Added text color */}
        </li>
      ))}
    </ul>
  </div>
);

const Modal = ({ faculty, onClose }: { faculty: Faculty; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700 relative">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 rounded-full p-2 transition-colors duration-200"
      >
        ✕
      </button>
      <div className="p-8 flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 text-center md:text-left"> {/* Added text alignment */}
          <HiUserCircle className="text-blue-500 mx-auto md:mx-0 text-[12rem]" /> {/* Responsive centering */}
          <h2 className="text-2xl font-bold mt-4">{faculty.name}</h2>
          <p className="text-blue-400 mb-4">{faculty.department}</p> {/* Added margin-bottom */}
          {faculty.officeHours && (
            <div className="bg-gray-700 p-3 rounded-lg inline-block"> {/* Styled office hours */}
              <p className="text-sm text-gray-300">Office Hours: <span className="text-white">{faculty.officeHours}</span></p>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-8"> {/* Increased space between sections */}
          <div>
            <h3 className="text-lg font-semibold border-b border-gray-700 pb-2 mb-4">Bio</h3> {/* Increased margin-bottom */}
            <p className="text-gray-300 leading-relaxed">{faculty.bio}</p> {/* Added line-height */}
          </div>
          <Section title="Qualifications" items={faculty.qualifications} />
          <Section title="Experience" items={faculty.experience} />
          {faculty.publications && <Section title="Publications" items={faculty.publications} />}
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-700 px-8 pb-6 flex flex-wrap justify-between items-center gap-4"> {/* Added gap and padding */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">Contact</h4> {/* Added margin-bottom */}
          <div className="flex flex-wrap gap-4">
            <a href={`mailto:${faculty.email}`} className="text-blue-400 hover:text-blue-300 transition-colors">{faculty.email}</a>
            {faculty.phone && <a href={`tel:${faculty.phone}`} className="text-blue-400 hover:text-blue-300 transition-colors">{faculty.phone}</a>}
          </div>
        </div>
        <div className="bg-gray-700 px-4 py-2 rounded-lg"> {/* Styled subjects container */}
          <Subjects subjects={faculty.subjects} />
        </div>
      </div>
    </div>
  </div>
);

export default Faculties;