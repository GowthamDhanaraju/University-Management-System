import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TeacherSidebar from "@/components/teacher_sidebar";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

// Types
interface ClubMember {
  id: string;
  name: string;
  role: string;
  Dept: string;
}

interface FacultyCoordinator {
  id: string;
  name: string;
  department: string;
}

interface Club {
  id: string;
  name: string;
  description: string;
  members: ClubMember[];
  facultyCoordinators: FacultyCoordinator[];
}  

// Mock data with your specific clubs
const mockClubs: Club[] = [
  {
    id: "c1",
    name: "AI Club",
    description: "Exploring artificial intelligence, machine learning and deep learning concepts through hands-on projects.",
    members: [
      { id: "m1", name: "Alex Johnson", role: "President", Dept: "AID" },
      { id: "m2", name: "Maria Garcia", role: "Vice President", Dept: "AID" },
      { id: "m3", name: "David Smith", role: "Member", Dept: "AIE" },
      { id: "m4", name: "Sophie Brown", role: "Member", Dept: "CSE" },
    ],
    facultyCoordinators: [
      { id: "f1", name: "Dr. James", department: "AID" }
    ]
  }
]; 
const TeacherClubDetails: React.FC = () => {
  const [selectedClub, setSelectedClub] = useState<Club | null>(mockClubs[0]);
  const [activeTab, setActiveTab] = useState<'members' >('members');
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' });
  const [newReply, setNewReply] = useState({ discussionId: '', content: '' }); 

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleNewReplySubmit = (e: React.FormEvent, discussionId: string) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    console.log('New reply for discussion', discussionId, ':', newReply.content);
    setNewReply({ discussionId: '', content: '' });
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-200">
      <TeacherSidebar />
      
      <div className="ml-16 flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-100">Club Details</h1>
        
        <div className="flex gap-6">
          {/* Club List Sidebar */}
          <div className="w-64 bg-gray-800 rounded-lg shadow-md p-4 h-fit">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">Clubs</h2>
            <ul className="space-y-2">
              {mockClubs.map(club => (
                <li 
                  key={club.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedClub?.id === club.id ? 'bg-blue-900 text-blue-200' : 'hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedClub(club)}
                >
                  {club.name}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1">
            {selectedClub ? (
              <div className="bg-gray-800 rounded-lg shadow-md p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-100">{selectedClub.name}</h2>
                  <p className="text-gray-400 mt-2">{selectedClub.description}</p>
                </div>
                
                {/* Tabs */}
                <div className="border-b border-gray-700 mb-6">
                  <ul className="flex -mb-px">
                    <li className="mr-1">
                      <button
                        className={`inline-block py-2 px-4 text-sm font-medium ${
                          activeTab === 'members'
                            ? 'text-blue-400 border-b-2 border-blue-500'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab('members')}
                      >
                        Members & Faculty
                      </button>
                    </li>  
                  </ul>
                </div>
                
                {/* Tab Content */}
                {activeTab === 'members' && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-300">Faculty Coordinators</h3>
                      <div className="bg-gray-700 rounded-lg p-4">
                        {selectedClub.facultyCoordinators.map(coordinator => (
                          <div key={coordinator.id} className="flex items-center mb-3 last:mb-0">
                            <div className="bg-blue-900 text-blue-200 rounded-full h-10 w-10 flex items-center justify-center font-bold">
                              {coordinator.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <p className="font-medium">{coordinator.name}</p>
                              <p className="text-sm text-gray-400">{coordinator.department}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-300">Student Members</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-700 rounded-lg">
                          <thead className="bg-gray-800">
                            <tr>
                              <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                              <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                              <th className="py-2 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Dept</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-600">
                            {selectedClub.members.map(member => (
                              <tr key={member.id}>
                                <td className="py-3 px-4">{member.name}</td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    member.role === 'President' 
                                      ? 'bg-green-900 text-green-200' 
                                      : member.role === 'Vice President'
                                      ? 'bg-blue-900 text-blue-200'
                                      : 'bg-gray-600 text-gray-200'
                                  }`}>
                                    {member.role}
                                  </span>
                                </td>
                                <td className="py-3 px-4">{member.Dept}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg shadow-md p-6 flex items-center justify-center h-64">
                <p className="text-gray-400">Select a club to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherClubDetails;
