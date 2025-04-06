import React, { useState } from "react";
import StudentSidebar from "@/components/student_sidebar";
import TopBar from "@/components/student_topbar";

const StudentFeedback = () => {
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex">
      <StudentSidebar />
      <div className="flex-1 p-6 ml-16">
        <TopBar />
      </div>
    </div>
  );
}

export default StudentFeedback