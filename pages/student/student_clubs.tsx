import React, { useState } from "react";
import StudentSidebar from "@/components/student_sidebar";
import TopBar from "@/components/student_topbar";
import { studentClubsData, upcomingEvents, StudentClub } from "../../data/ClubData";
import { FaUsers } from "react-icons/fa";
import { Typography } from "@mui/material";

const StudentClubs = () => {
  const [selectedClub, setSelectedClub] = useState<StudentClub | null>(studentClubsData[0]);
  const [activeTab, setActiveTab] = useState<'activities' | 'info'>('activities');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'pending': return 'bg-blue-600';
      case 'overdue': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex">
      <StudentSidebar />
      <div className="flex-1 p-4 md:p-6 ml-16">
        <TopBar />
        
        {/* Header Section */}
        <div className="flex items-center mb-6 md:mb-8 ml-6">
          <div className="p-3 mr-4 bg-orange-600 rounded-xl shadow-lg">
            <FaUsers className="text-gray-100 text-2xl" />
          </div>
          <Typography 
            variant="h4" 
            component="h1" 
            className="font-bold bg-orange-600 bg-clip-text text-transparent"
          >
            Club Activity Dashboard
          </Typography>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Clubs List */}
          <div className="w-[400px] bg-gray-800 rounded-lg p-4 ml-6">
            <h2 className="text-xl font-semibold mb-4 text-orange-400">Your Clubs</h2>
            <div className="space-y-3">
              {studentClubsData.map(club => (
                <div 
                  key={club.id}
                  onClick={() => setSelectedClub(club)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedClub?.id === club.id 
                      ? 'bg-orange-900 border-l-4 border-orange-400' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <h3 className="font-medium">{club.name}</h3>
                  <p className="text-sm text-gray-400">{club.totalMembers} members</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Club Details */}
          <div className="w-full lg:w-3/4 space-y-4 md:space-y-6">
            {selectedClub && (
              <>
                {/* Club Header */}
                <div className="bg-gray-800 rounded-lg p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-orange-300">{selectedClub.name}</h2>
                      <p className="text-gray-400 mt-2">{selectedClub.description}</p>
                    </div>
                    <div className="bg-gray-700 px-3 py-1 rounded-full text-sm self-start md:self-center">
                      {selectedClub.totalMembers} members
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    <div className="bg-gray-700 px-3 py-2 rounded-lg">
                      <span className="text-gray-400">President:</span> {selectedClub.president}
                    </div>
                    <div className="bg-gray-700 px-3 py-2 rounded-lg">
                      <span className="text-gray-400">Faculty Advisor:</span> {selectedClub.facultyAdvisor}
                    </div>
                    <div className="bg-gray-700 px-3 py-2 rounded-lg">
                      <span className="text-gray-400">Meetings:</span> {selectedClub.meetingSchedule}
                    </div>
                  </div>
                </div>
                
                {/* Tabs */}
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="flex border-b border-gray-700">
                    <button
                      onClick={() => setActiveTab('activities')}
                      className={`px-4 py-3 font-medium ${
                        activeTab === 'activities' 
                          ? 'text-orange-500 border-b-2 border-orange-500' 
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      Activities
                    </button>
                    <button
                      onClick={() => setActiveTab('info')}
                      className={`px-4 py-3 font-medium ${
                        activeTab === 'info' 
                          ? 'text-orange-400 border-b-2 border-orange-400' 
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      Club Information
                    </button>
                  </div>
                  
                  <div className="p-4 md:p-6">
                    {activeTab === 'activities' ? (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-orange-400">Club Activities</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="text-green-400 font-medium">Completed</h4>
                            <p className="text-2xl font-bold mt-1">
                              {selectedClub.activities.filter(a => a.status === 'completed').length}
                            </p>
                          </div>
                          <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="text-blue-400 font-medium">Pending</h4>
                            <p className="text-2xl font-bold mt-1">
                              {selectedClub.activities.filter(a => a.status === 'pending').length}
                            </p>
                          </div>
                          <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="text-red-400 font-medium">Overdue</h4>
                            <p className="text-2xl font-bold mt-1">
                              {selectedClub.activities.filter(a => a.status === 'overdue').length}
                            </p>
                          </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-700">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Activity</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Faculty</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Deadline</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Points</th>
                              </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                              {selectedClub.activities.map(activity => (
                                <tr key={activity.id}>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="font-medium">{activity.title}</div>
                                    <div className="text-sm text-gray-400 mt-1">{activity.description}</div>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <div>{activity.facultyInCharge}</div>
                                    <div className="text-sm text-gray-400 mt-1">{activity.facultyEmail}</div>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap">{activity.deadline}</td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                                      {activity.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-orange-500 font-medium">
                                    {activity.points}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-orange-400">Club Details</h3>
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <h4 className="font-medium mb-3">About {selectedClub.name}</h4>
                          <p className="text-gray-300">{selectedClub.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="font-medium mb-3">Leadership</h4>
                            <p className="mb-2"><span className="text-gray-400">President:</span> {selectedClub.president}</p>
                            <p><span className="text-gray-400">Faculty Advisor:</span> {selectedClub.facultyAdvisor}</p>
                          </div>
                          
                          <div className="bg-gray-700 p-4 rounded-lg">
                            <h4 className="font-medium mb-3">Schedule</h4>
                            <p className="mb-2"><span className="text-gray-400">Meetings:</span> {selectedClub.meetingSchedule}</p>
                            <p><span className="text-gray-400">Total Members:</span> {selectedClub.totalMembers}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            
            {/* Upcoming Events */}
            <div className="bg-gray-800 rounded-lg p-4 md:p-6">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">Upcoming Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingEvents.filter(event => 
                  studentClubsData.some(club => club.name === event.club)
                ).map(event => (
                  <div key={event.id} className="bg-gray-700 p-4 rounded-lg border-l-4 border-orange-500">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-400 mt-2">{event.club}</p>
                    <div className="flex items-center mt-3 text-sm">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{event.date} at {event.time}</span>
                    </div>
                    <div className="flex items-center mt-2 text-sm">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentClubs;