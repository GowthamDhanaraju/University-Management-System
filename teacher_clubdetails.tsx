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

interface Announcement {
  id: string;
  clubId: string;
  title: string;
  content: string;
  date: string;
}

interface Discussion {
  id: string;
  clubId: string;
  title: string;
  content: string;
  author: string;
  date: string;
  replies: Reply[];
}

interface Reply {
  id: string;
  author: string;
  content: string;
  date: string;
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
  },
  {
    id: "c2",
    name: "Photography Club",
    description: "Developing photography skills and visual storytelling through workshops and photo walks.",
    members: [
      { id: "m5", name: "Emma Thompson", role: "President", Dept: "AEE" },
      { id: "m6", name: "Noah Williams", role: "Vice President", Dept: "EEE" },
      { id: "m7", name: "Olivia Martin", role: "Member", Dept: "AID" },
    ],
    facultyCoordinators: [
      { id: "f2", name: "Mr. Davis", department: "Arts" }
    ]
  },
  {
    id: "c3",
    name: "IoT Club",
    description: "Building internet of things projects and smart devices using sensors, microcontrollers, and cloud services.",
    members: [
      { id: "m8", name: "William Anderson", role: "President", Dept: "ECE" },
      { id: "m9", name: "Sophia Lee", role: "Member", Dept: "EEE" },
      { id: "m10", name: "James Clark", role: "Member", Dept: "AID" },
    ],
    facultyCoordinators: [
      { id: "f3", name: "Dr. Chen", department: "Electronics" },
      { id: "f4", name: "Ms. Jennifer", department: "CSE" }
    ]
  },
];

const mockAnnouncements: Announcement[] = [
  {
    id: "a1",
    clubId: "c1",
    title: "AI Workshop Series",
    content: "Join us for a 4-week workshop series on neural networks, starting this Friday at 3 PM in Lab 2.",
    date: "2025-03-29"
  },
  {
    id: "a2",
    clubId: "c1",
    title: "Guest Speaker: Dr. Emily Ross",
    content: "We're excited to host Dr. Emily Ross from Google AI Research next Wednesday. Don't miss this opportunity!",
    date: "2025-03-25"
  },
  {
    id: "a3",
    clubId: "c2",
    title: "Photography Exhibition",
    content: "Submit your best shots for our annual exhibition by April 15th. Theme: 'Urban Wilderness'.",
    date: "2025-03-28"
  },
  {
    id: "a4",
    clubId: "c3",
    title: "Smart Home Project Deadline",
    content: "All IoT smart home project proposals are due by this Friday. Components will be ordered next week.",
    date: "2025-03-27"
  },
];

const mockDiscussions: Discussion[] = [
  {
    id: "d1",
    clubId: "c1",
    title: "TensorFlow vs PyTorch for beginners?",
    content: "I'm new to deep learning and wondering which framework I should learn first.",
    author: "Alex Johnson",
    date: "2025-03-20",
    replies: [
      {
        id: "r1",
        author: "Maria Garcia",
        content: "PyTorch has a more intuitive API in my opinion. Start with that!",
        date: "2025-03-21"
      },
      {
        id: "r2",
        author: "Dr. James Wilson",
        content: "Both are excellent choices. PyTorch is more pythonic and easier for beginners, but TensorFlow has excellent deployment options.",
        date: "2025-03-22"
      }
    ]
  },
  {
    id: "d2",
    clubId: "c2",
    title: "Recommendations for budget portrait lenses",
    content: "I'm looking to get into portrait photography. Any lens recommendations under $300?",
    author: "Noah Williams",
    date: "2025-03-18",
    replies: [
      {
        id: "r3",
        author: "Emma Thompson",
        content: "The 50mm f/1.8 is a classic choice and very affordable. Great bokeh for the price!",
        date: "2025-03-19"
      }
    ]
  },
  {
    id: "d3",
    clubId: "c3",
    title: "Which microcontroller for weather station project?",
    content: "I'm planning to build a solar-powered weather station. ESP32, Arduino, or Raspberry Pi?",
    author: "Sophia Lee",
    date: "2025-03-15",
    replies: [
      {
        id: "r4",
        author: "Dr. Robert Chen",
        content: "ESP32 would be perfect - low power consumption, WiFi capabilities, and sufficient I/O for sensors.",
        date: "2025-03-16"
      },
      {
        id: "r5",
        author: "William Anderson",
        content: "I used ESP32 for a similar project. Battery lasted for weeks with proper sleep mode configuration!",
        date: "2025-03-17"
      }
    ]
  }
];

const TeacherClubDetails: React.FC = () => {
  const [selectedClub, setSelectedClub] = useState<Club | null>(mockClubs[0]);
  const [activeTab, setActiveTab] = useState<'members' | 'announcements' | 'discussions'>('members');
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' });
  const [newReply, setNewReply] = useState({ discussionId: '', content: '' });
  const [showForm, setShowForm] = useState<'announcement' | 'discussion' | null>(null);

  const filteredAnnouncements = selectedClub 
    ? mockAnnouncements.filter(announcement => announcement.clubId === selectedClub.id)
    : [];

  const filteredDiscussions = selectedClub 
    ? mockDiscussions.filter(discussion => discussion.clubId === selectedClub.id)
    : [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleNewAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    console.log('New announcement:', newAnnouncement);
    setNewAnnouncement({ title: '', content: '' });
    setShowForm(null);
  };

  const handleNewDiscussionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    console.log('New discussion:', newDiscussion);
    setNewDiscussion({ title: '', content: '' });
    setShowForm(null);
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
                    <li className="mr-1">
                      <button
                        className={`inline-block py-2 px-4 text-sm font-medium ${
                          activeTab === 'announcements'
                            ? 'text-blue-400 border-b-2 border-blue-500'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab('announcements')}
                      >
                        Announcements
                      </button>
                    </li>
                    <li className="mr-1">
                      <button
                        className={`inline-block py-2 px-4 text-sm font-medium ${
                          activeTab === 'discussions'
                            ? 'text-blue-400 border-b-2 border-blue-500'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab('discussions')}
                      >
                        Discussions
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
                
                {activeTab === 'announcements' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-300">Announcements</h3>
                      <button 
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                        onClick={() => setShowForm('announcement')}
                      >
                        New Announcement
                      </button>
                    </div>
                    
                    {showForm === 'announcement' && (
                      <div className="bg-gray-700 p-4 rounded-lg mb-6">
                        <h4 className="font-medium mb-3">Create New Announcement</h4>
                        <form onSubmit={handleNewAnnouncementSubmit}>
                          <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-medium mb-2">Title</label>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-gray-200"
                              value={newAnnouncement.title}
                              onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-medium mb-2">Content</label>
                            <textarea 
                              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-gray-200"
                              rows={4}
                              value={newAnnouncement.content}
                              onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                              required
                            ></textarea>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button 
                              type="button" 
                              className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 rounded-md"
                              onClick={() => setShowForm(null)}
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit" 
                              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              Post Announcement
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                    
                    {filteredAnnouncements.length > 0 ? (
                      <div className="space-y-4">
                        {filteredAnnouncements.map(announcement => (
                          <div key={announcement.id} className="border border-gray-700 rounded-lg p-4 bg-gray-700">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-lg">{announcement.title}</h4>
                              <span className="text-sm text-gray-400">{formatDate(announcement.date)}</span>
                            </div>
                            <p className="mt-2 text-gray-300">{announcement.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">No announcements for this club yet.</p>
                    )}
                  </div>
                )}
                
                {activeTab === 'discussions' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-300">Discussions</h3>
                      <button 
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                        onClick={() => setShowForm('discussion')}
                      >
                        New Discussion
                      </button>
                    </div>
                    
                    {showForm === 'discussion' && (
                      <div className="bg-gray-700 p-4 rounded-lg mb-6">
                        <h4 className="font-medium mb-3">Start New Discussion</h4>
                        <form onSubmit={handleNewDiscussionSubmit}>
                          <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-medium mb-2">Title</label>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-gray-200"
                              value={newDiscussion.title}
                              onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-medium mb-2">Content</label>
                            <textarea 
                              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-gray-200"
                              rows={4}
                              value={newDiscussion.content}
                              onChange={(e) => setNewDiscussion({...newDiscussion, content: e.target.value})}
                              required
                            ></textarea>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button 
                              type="button" 
                              className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 rounded-md"
                              onClick={() => setShowForm(null)}
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit" 
                              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              Post Discussion
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                    
                    {filteredDiscussions.length > 0 ? (
                      <div className="space-y-6">
                        {filteredDiscussions.map(discussion => (
                          <div key={discussion.id} className="border border-gray-700 rounded-lg overflow-hidden">
                            <div className="p-4 bg-gray-700">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-lg">{discussion.title}</h4>
                                <span className="text-sm text-gray-400">{formatDate(discussion.date)}</span>
                              </div>
                              <p className="mt-2 text-gray-300">{discussion.content}</p>
                              <p className="mt-2 text-sm text-gray-400">Posted by: {discussion.author}</p>
                            </div>
                            
                            {/* Replies */}
                            <div className="border-t border-gray-600">
                              {discussion.replies.map(reply => (
                                <div key={reply.id} className="p-4 border-b border-gray-600 last:border-0 ml-6 bg-gray-800">
                                  <div className="flex justify-between items-start">
                                    <p className="text-sm font-medium">{reply.author}</p>
                                    <span className="text-xs text-gray-400">{formatDate(reply.date)}</span>
                                  </div>
                                  <p className="mt-1 text-gray-300">{reply.content}</p>
                                </div>
                              ))}
                            </div>
                            
                            {/* Reply Form */}
                            <div className="p-4 bg-gray-700 border-t border-gray-600">
                              <form onSubmit={(e) => handleNewReplySubmit(e, discussion.id)}>
                                <div className="flex gap-2">
                                  <input 
                                    type="text" 
                                    className="flex-1 px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-gray-200"
                                    placeholder="Write a reply..."
                                    value={newReply.discussionId === discussion.id ? newReply.content : ''}
                                    onChange={(e) => setNewReply({discussionId: discussion.id, content: e.target.value})}
                                    onClick={() => setNewReply({discussionId: discussion.id, content: ''})}
                                    required
                                  />
                                  <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                                  >
                                    Reply
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">No discussions for this club yet.</p>
                    )}
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