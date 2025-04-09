import { useRouter } from "next/router";
import AdminSidebar from "@/components/admin_sidebar";
import TopBar from "@/components/topbar";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

const TeacherTimetable = () => {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex">
        <AdminSidebar />
        <div className="flex-1 p-6 ml-16">
          <TopBar />
        </div>
      </div>
    );
  }
  
  export default TeacherTimetable;