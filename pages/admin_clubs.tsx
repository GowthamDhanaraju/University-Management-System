import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin_sidebar";
import { useRouter } from "next/router";
import { Bar } from 'react-chartjs-2';


// Types
interface ClubMember {
  id: string;
  name: string;
  role: string;
  dept: string;
  email?: string;
}

interface FacultyCoordinator {
  id: string;
  name: string;
  department: string;
  email?: string;
}

interface Club {
  id: string;
  name: string;
  description: string;
  members: ClubMember[];
  facultyCoordinators: FacultyCoordinator[];
  meetingSchedule?: {
    day: string;
    time: string;
    location: string;
  };
  activities?: Activity[];
}

interface Activity {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  status: "upcoming" | "completed" | "canceled";
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

// Mock data
const mockClubs: Club[] = [
  {
    id: "c1",
    name: "AI Club",
    description: "Exploring artificial intelligence, machine learning and deep learning concepts through hands-on projects.",
    members: [
      { id: "m1", name: "Alex Johnson", role: "President", dept: "AID", email: "alex.j@example.edu" },
      { id: "m2", name: "Maria Garcia", role: "Vice President", dept: "AID", email: "maria.g@example.edu" },
      { id: "m3", name: "David Smith", role: "Member", dept: "AIE", email: "david.s@example.edu" },
      { id: "m4", name: "Sophie Brown", role: "Member", dept: "CSE", email: "sophie.b@example.edu" },
    ],
    facultyCoordinators: [
      { id: "f1", name: "Dr. James Wilson", department: "AID", email: "james.wilson@faculty.edu" }
    ],
    meetingSchedule: {
      day: "Friday",
      time: "16:00",
      location: "Tech Building, Room 305"
    },
    activities: [
      {
        id: "a1",
        name: "Neural Networks Workshop",
        description: "Introduction to neural networks with practical exercises",
        date: "2025-04-12",
        location: "Lab 2",
        status: "upcoming"
      },
      {
        id: "a2",
        name: "Industry Talk: AI Ethics",
        description: "Guest speaker from Google discussing ethical considerations in AI",
        date: "2025-04-20",
        location: "Auditorium",
        status: "upcoming"
      }
    ]
  },
  {
    id: "c2",
    name: "Photography Club",
    description: "Developing photography skills and visual storytelling through workshops and photo walks.",
    members: [
      { id: "m5", name: "Emma Thompson", role: "President", dept: "AEE", email: "emma.t@example.edu" },
      { id: "m6", name: "Noah Williams", role: "Vice President", dept: "EEE", email: "noah.w@example.edu" },
      { id: "m7", name: "Olivia Martin", role: "Member", dept: "AID", email: "olivia.m@example.edu" },
    ],
    facultyCoordinators: [
      { id: "f2", name: "Mr. Davis", department: "Arts", email: "davis@faculty.edu" }
    ],
    meetingSchedule: {
      day: "Wednesday",
      time: "15:30",
      location: "Arts Building, Room 112"
    },
    activities: [
      {
        id: "a3",
        name: "Photo Walk - Campus Architecture",
        description: "Exploring architectural elements across campus",
        date: "2025-04-14",
        location: "Campus Quad",
        status: "upcoming"
      }
    ]
  },
  {
    id: "c3",
    name: "IoT Club",
    description: "Building internet of things projects and smart devices using sensors, microcontrollers, and cloud services.",
    members: [
      { id: "m8", name: "William Anderson", role: "President", dept: "ECE", email: "william.a@example.edu" },
      { id: "m9", name: "Sophia Lee", role: "Member", dept: "EEE", email: "sophia.l@example.edu" },
      { id: "m10", name: "James Clark", role: "Member", dept: "AID", email: "james.c@example.edu" },
    ],
    facultyCoordinators: [
      { id: "f3", name: "Dr. Chen", department: "Electronics", email: "chen@faculty.edu" },
      { id: "f4", name: "Ms. Jennifer", department: "CSE", email: "jennifer@faculty.edu" }
    ],
    meetingSchedule: {
      day: "Tuesday",
      time: "17:00",
      location: "Engineering Building, Lab 203"
    },
    activities: [
      {
        id: "a4",
        name: "Smart Home Project Workshop",
        description: "Hands-on session for building home automation devices",
        date: "2025-04-10",
        location: "Electronics Lab",
        status: "upcoming"
      }
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

const mockDepartments = ["AID", "AIE", "CSE", "ECE", "EEE", "AEE", "Arts", "Electronics"];

const AdminClubManagement: React.FC = () => {
    const router = useRouter();
      
    const [clubs, setClubs] = useState<Club[]>(mockClubs);
    const [selectedClub, setSelectedClub] = useState<Club | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'faculty' | 'activities' | 'meeting'>('overview');
    
    // Member management
    const [showAddMemberForm, setShowAddMemberForm] = useState(false);
    const [showAddFacultyForm, setShowAddFacultyForm] = useState(false);
    const [showAddActivityForm, setShowAddActivityForm] = useState(false);
    const [editMeetingSchedule, setEditMeetingSchedule] = useState(false);
    
    const [newMember, setNewMember] = useState<{
        name: string;
        role: string;
        dept: string;
        email: string;
    }>({
        name: "",
        role: "Member",
        dept: "",
        email: ""
    });
    
    const [newFaculty, setNewFaculty] = useState<{
        name: string;
        department: string;
        email: string;
    }>({
        name: "",
        department: "",
        email: ""
    });
    
    const [newActivity, setNewActivity] = useState<{
        name: string;
        description: string;
        date: string;
        location: string;
        status: "upcoming" | "completed" | "canceled";
    }>({
        name: "",
        description: "",
        date: "",
        location: "",
        status: "upcoming"
    });
    
    const [updatedMeeting, setUpdatedMeeting] = useState<{
        day: string;
        time: string;
        location: string;
    }>({
        day: "",
        time: "",
        location: ""
    });
    
    useEffect(() => {
        if (selectedClub && selectedClub.meetingSchedule) {
        setUpdatedMeeting({
            day: selectedClub.meetingSchedule.day,
            time: selectedClub.meetingSchedule.time,
            location: selectedClub.meetingSchedule.location
        });
        }
    }, [selectedClub]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
        });
    };

    // Add a new student member
    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClub) return;
        
        const updatedClubs = clubs.map(club => {
        if (club.id === selectedClub.id) {
            const newMemberId = `m${Math.floor(Math.random() * 10000)}`;
            const updatedMembers = [...club.members, {...newMember, id: newMemberId}];
            return {...club, members: updatedMembers};
        }
        return club;
        });
        
        setClubs(updatedClubs);
        setSelectedClub(updatedClubs.find(club => club.id === selectedClub.id) || null);
        setShowAddMemberForm(false);
        setNewMember({ name: "", role: "Member", dept: "", email: "" });
    };

    // Remove a student member
    const handleRemoveMember = (memberId: string) => {
        if (!selectedClub) return;
        
        const updatedClubs = clubs.map(club => {
        if (club.id === selectedClub.id) {
            const updatedMembers = club.members.filter(member => member.id !== memberId);
            return {...club, members: updatedMembers};
        }
        return club;
        });
        
        setClubs(updatedClubs);
        setSelectedClub(updatedClubs.find(club => club.id === selectedClub.id) || null);
    };

    // Add a new faculty coordinator
    const handleAddFaculty = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClub) return;
        
        const updatedClubs = clubs.map(club => {
        if (club.id === selectedClub.id) {
            const newFacultyId = `f${Math.floor(Math.random() * 10000)}`;
            const updatedFaculty = [...club.facultyCoordinators, {...newFaculty, id: newFacultyId}];
            return {...club, facultyCoordinators: updatedFaculty};
        }
        return club;
        });
        
        setClubs(updatedClubs);
        setSelectedClub(updatedClubs.find(club => club.id === selectedClub.id) || null);
        setShowAddFacultyForm(false);
        setNewFaculty({ name: "", department: "", email: "" });
    };

    // Remove a faculty coordinator
    const handleRemoveFaculty = (facultyId: string) => {
        if (!selectedClub) return;
        
        const updatedClubs = clubs.map(club => {
        if (club.id === selectedClub.id) {
            const updatedFaculty = club.facultyCoordinators.filter(faculty => faculty.id !== facultyId);
            return {...club, facultyCoordinators: updatedFaculty};
        }
        return club;
        });
        
        setClubs(updatedClubs);
        setSelectedClub(updatedClubs.find(club => club.id === selectedClub.id) || null);
    };

    // Add a new activity
    const handleAddActivity = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClub) return;
        
        const updatedClubs = clubs.map(club => {
        if (club.id === selectedClub.id) {
            const newActivityId = `a${Math.floor(Math.random() * 10000)}`;
            const updatedActivities = [...(club.activities || []), {...newActivity, id: newActivityId}];
            return {...club, activities: updatedActivities};
        }
        return club;
        });
        
        setClubs(updatedClubs);
        setSelectedClub(updatedClubs.find(club => club.id === selectedClub.id) || null);
        setShowAddActivityForm(false);
        setNewActivity({ 
        name: "", 
        description: "", 
        date: "", 
        location: "", 
        status: "upcoming" 
        });
    };

    // Remove an activity
    const handleRemoveActivity = (activityId: string) => {
        if (!selectedClub || !selectedClub.activities) return;
        
        const updatedClubs = clubs.map(club => {
        if (club.id === selectedClub.id && club.activities) {
            const updatedActivities = club.activities.filter(activity => activity.id !== activityId);
            return {...club, activities: updatedActivities};
        }
        return club;
        });
        
        setClubs(updatedClubs);
        setSelectedClub(updatedClubs.find(club => club.id === selectedClub.id) || null);
    };

    // Update meeting schedule
    const handleUpdateMeeting = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClub) return;
        
        const updatedClubs = clubs.map(club => {
        if (club.id === selectedClub.id) {
            return {...club, meetingSchedule: updatedMeeting};
        }
        return club;
        });
        
        setClubs(updatedClubs);
        setSelectedClub(updatedClubs.find(club => club.id === selectedClub.id) || null);
        setEditMeetingSchedule(false);
    };

    // Get club statistics data for chart
    const getClubStatsData = () => {
        return {
        labels: clubs.map(club => club.name),
        datasets: [
            {
            label: 'Students',
            data: clubs.map(club => club.members.length),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
            label: 'Faculty',
            data: clubs.map(club => club.facultyCoordinators.length),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
            {
            label: 'Activities',
            data: clubs.map(club => club.activities?.length || 0),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }
        ]
        };
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200">
        <AdminSidebar />
            <div className="flex min-h-screen bg-gray-900 text-gray-200">
            <div className="w-64 bg-gray-800 min-h-screen fixed left-0 top-0 p-4 shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-blue-400">Admin Dashboard</h1>
                <nav>
                <ul className="space-y-2">
                    <li className="font-medium text-lg mb-4 text-gray-300">Club Management</li>
                    {clubs.map(club => (
                    <li 
                        key={club.id}
                        className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedClub?.id === club.id ? 'bg-blue-900 text-blue-200' : 'hover:bg-gray-700'
                        }`}
                        onClick={() => {
                        setSelectedClub(club);
                        setActiveTab('overview');
                        }}
                    >
                        {club.name}
                    </li>
                    ))}
                </ul>
                </nav>
            </div>
            
            <div className="ml-64 flex-1 p-6">
                <h1 className="text-3xl font-bold mb-6 text-gray-100">Club Administration</h1>
                
                {!selectedClub ? (
                <div className="bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-6">Club Overview</h2>
                    <div className="mb-10 h-80">
                    <Bar 
                        data={getClubStatsData()} 
                        options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.7)'
                            }
                            },
                            x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.7)'
                            }
                            }
                        },
                        plugins: {
                            legend: {
                            labels: {
                                color: 'rgba(255, 255, 255, 0.7)'
                            }
                            },
                            title: {
                            display: true,
                            text: 'Club Statistics',
                            color: 'rgba(255, 255, 255, 0.9)',
                            font: {
                                size: 18
                            }
                            }
                        }
                        }}
                    />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {clubs.map(club => (
                        <div key={club.id} className="bg-gray-700 rounded-lg p-4 shadow">
                        <h3 className="text-xl font-semibold mb-2">{club.name}</h3>
                        <p className="text-gray-400 mb-4 text-sm">{club.description}</p>
                        <div className="flex gap-4 justify-between text-sm">
                            <div>
                            <p className="text-blue-300">{club.members.length} Students</p>
                            <p className="text-pink-300">{club.facultyCoordinators.length} Faculty</p>
                            </div>
                            <button
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
                            onClick={() => setSelectedClub(club)}
                            >
                            Manage
                            </button>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
                ) : (
                <div className="bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-100">{selectedClub.name}</h2>
                    <button 
                        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
                        onClick={() => setSelectedClub(null)}
                    >
                        Back to All Clubs
                    </button>
                    </div>
                    
                    <p className="text-gray-400 mb-6">{selectedClub.description}</p>
                    
                    {/* Tabs */}
                    <div className="border-b border-gray-700 mb-6">
                    <ul className="flex -mb-px">
                        <li className="mr-1">
                        <button
                            className={`inline-block py-2 px-4 text-sm font-medium ${
                            activeTab === 'overview'
                                ? 'text-blue-400 border-b-2 border-blue-500'
                                : 'text-gray-400 hover:text-gray-300'
                            }`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </button>
                        </li>
                        <li className="mr-1">
                        <button
                            className={`inline-block py-2 px-4 text-sm font-medium ${
                            activeTab === 'members'
                                ? 'text-blue-400 border-b-2 border-blue-500'
                                : 'text-gray-400 hover:text-gray-300'
                            }`}
                            onClick={() => setActiveTab('members')}
                        >
                            Student Members
                        </button>
                        </li>
                        <li className="mr-1">
                        <button
                            className={`inline-block py-2 px-4 text-sm font-medium ${
                            activeTab === 'faculty'
                                ? 'text-blue-400 border-b-2 border-blue-500'
                                : 'text-gray-400 hover:text-gray-300'
                            }`}
                            onClick={() => setActiveTab('faculty')}
                        >
                            Faculty Coordinators
                        </button>
                        </li>
                        <li className="mr-1">
                        <button
                            className={`inline-block py-2 px-4 text-sm font-medium ${
                            activeTab === 'activities'
                                ? 'text-blue-400 border-b-2 border-blue-500'
                                : 'text-gray-400 hover:text-gray-300'
                            }`}
                            onClick={() => setActiveTab('activities')}
                        >
                            Activities
                        </button>
                        </li>
                        <li className="mr-1">
                        <button
                            className={`inline-block py-2 px-4 text-sm font-medium ${
                            activeTab === 'meeting'
                                ? 'text-blue-400 border-b-2 border-blue-500'
                                : 'text-gray-400 hover:text-gray-300'
                            }`}
                            onClick={() => setActiveTab('meeting')}
                        >
                            Meeting Schedule
                        </button>
                        </li>
                    </ul>
                    </div>
                    
                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-700 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3">Quick Stats</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-800 rounded-lg p-4">
                            <p className="text-gray-400 text-sm">Students</p>
                            <p className="text-2xl font-bold text-blue-400">{selectedClub.members.length}</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                            <p className="text-gray-400 text-sm">Faculty</p>
                            <p className="text-2xl font-bold text-pink-400">{selectedClub.facultyCoordinators.length}</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                            <p className="text-gray-400 text-sm">Activities</p>
                            <p className="text-2xl font-bold text-green-400">{selectedClub.activities?.length || 0}</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                            <p className="text-gray-400 text-sm">Meeting Day</p>
                            <p className="text-xl font-bold text-yellow-400">{selectedClub.meetingSchedule?.day || "Not set"}</p>
                            </div>
                        </div>
                        </div>
                        
                        <div className="bg-gray-700 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3">Department Distribution</h3>
                        <div className="h-60">
                            <Bar 
                            data={{
                                labels: Array.from(new Set(selectedClub.members.map(member => member.dept))),
                                datasets: [
                                {
                                    label: 'Students by Department',
                                    data: Array.from(new Set(selectedClub.members.map(member => member.dept)))
                                    .map(dept => selectedClub.members.filter(m => m.dept === dept).length),
                                    backgroundColor: 'rgba(54, 162, 235, 0.6)'
                                }
                                ]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                y: {
                                    beginAtZero: true,
                                    grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }
                                }
                            }}
                            />
                        </div>
                        </div>
                        
                        <div className="bg-gray-700 rounded-lg p-4 md:col-span-2">
                        <h3 className="text-lg font-semibold mb-3">Upcoming Activities</h3>
                        {selectedClub.activities && selectedClub.activities.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {selectedClub.activities
                                .filter(activity => activity.status === "upcoming")
                                .slice(0, 3)
                                .map(activity => (
                                <div key={activity.id} className="bg-gray-800 rounded-lg p-4">
                                    <h4 className="font-medium text-lg mb-2">{activity.name}</h4>
                                    <p className="text-sm text-gray-400 mb-2">{formatDate(activity.date)}</p>
                                    <p className="text-sm mb-2">{activity.description}</p>
                                    <p className="text-xs text-gray-400">Location: {activity.location}</p>
                                </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">No upcoming activities</p>
                        )}
                        </div>
                    </div>
                    )}
                    
                    {activeTab === 'members' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Student Members</h3>
                        <button
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white text-sm"
                            onClick={() => setShowAddMemberForm(true)}
                        >
                            Add New Member
                        </button>
                        </div>
                        
                        {showAddMemberForm && (
                        <div className="bg-gray-700 p-4 rounded-lg mb-6">
                            <h4 className="font-medium mb-4">Add New Member</h4>
                            <form onSubmit={handleAddMember}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md"
                                    value={newMember.name}
                                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                                    required
                                />
                                </div>
                                <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md"
                                    value={newMember.email}
                                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                                    required
                                />
                                </div>
                                <div>
                                <label className="block text-sm font-medium mb-1">Role</label>
                                <select
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md"
                                    value={newMember.role}
                                    onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                                    required
                                >
                                    <option value="Member">Member</option>
                                    <option value="President">President</option>
                                    <option value="Vice President">Vice President</option>
                                    <option value="Secretary">Secretary</option>
                                    <option value="Treasurer">Treasurer</option>
                                </select>
                                </div>
                                <div>
                                <label className="block text-sm font-medium mb-1">Department</label>
                                <select
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md"
                                    value={newMember.dept}
                                    onChange={(e) => setNewMember({...newMember, dept: e.target.value})}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {mockDepartments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                type="button"
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 text-sm"
                                onClick={() => setShowAddMemberForm(false)}
                                >
                                Cancel
                                </button>
                                <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                                >
                                Save
                                </button>
                            </div>
                            </form>
                        </div>
                        )}
                        
                        <div className="bg-gray-700 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-600">
                            <thead className="bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-600">
                            {selectedClub.members.map(member => (
                                <tr key={member.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{member.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{member.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{member.dept}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{member.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                    className="text-red-400 hover:text-red-500"
                                    onClick={() => handleRemoveMember(member.id)}
                                    >
                                    Remove
                                    </button>
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                    )}
                    
                    {activeTab === 'faculty' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Faculty Coordinators</h3>
                        <button
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white text-sm"
                            onClick={() => setShowAddFacultyForm(true)}
                        >
                            Add Faculty Coordinator
                        </button>
                        </div>
                        
                        {showAddFacultyForm && (
                        <div className="bg-gray-700 p-4 rounded-lg mb-6">
                            <h4 className="font-medium mb-4">Add Faculty Coordinator</h4>
                            <form onSubmit={handleAddFaculty}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md"
                                    value={newFaculty.name}
                                    onChange={(e) => setNewFaculty({...newFaculty, name: e.target.value})}
                                    required
                                />
                                </div>
                                <div>
                                <label className="block text-sm font-medium mb-1">Department</label>
                                <select
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md"
                                    value={newFaculty.department}
                                    onChange={(e) => setNewFaculty({...newFaculty, department: e.target.value})}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {mockDepartments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                                </div>
                                <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md"
                                    value={newFaculty.email}
                                    onChange={(e) => setNewFaculty({...newFaculty, email: e.target.value})}
                                    required
                                />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                type="button"
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 text-sm"
                                onClick={() => setShowAddFacultyForm(false)}
                                >
                                Cancel
                                </button>
                                <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                                >
                                Save
                                </button>
                            </div>
                            </form>
                        </div>
                        )}
                        
                        <div className="bg-gray-700 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-600">
                            <thead className="bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-600">
                            {selectedClub.facultyCoordinators.map(faculty => (
                                <tr key={faculty.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{faculty.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{faculty.department}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{faculty.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                    className="text-red-400 hover:text-red-500"
                                    onClick={() => handleRemoveFaculty(faculty.id)}
                                    >
                                    Remove
                                    </button>
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                    )}
                    
                    {activeTab === 'activities' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Activities & Events</h3>
                        <button
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white text-sm"
                            onClick={() => setShowAddActivityForm(true)}
                        >
                            Add Activity
                        </button>
                        </div>
                        
                        {showAddActivityForm && (
                        <div className="bg-gray-700 p-4 rounded-lg mb-6">
                            <h4 className="font-medium mb-4">Add New Activity</h4>
                            <form onSubmit={handleAddActivity}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md"
                                    value={newActivity.name}
                                    onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                                    required
                                />
                                </div>
                                <div>
                                <label className="block text-sm font-medium mb-1">Date</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md"
                                    value={newActivity.date}
                                    onChange={(e) => setNewActivity({...newActivity, date: e.target.value})}
                                    required
                                />
                                </div>
                                <div>
                                <label className="block text-sm font-medium mb-1">Location</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md"
                                    value={newActivity.location}
                                    onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                                    required
                                />
                                </div>
                                <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md"
                                    value={newActivity.status}
                                    onChange={(e) => setNewActivity({...newActivity, status: e.target.value as "upcoming" | "completed" | "canceled"})}
                                    required
                                >
                                    <option value="upcoming">Upcoming</option>
                                    <option value="completed">Completed</option>
                                    <option value="canceled">Canceled</option>
                                </select>
                                </div>
                                <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md"
                                    rows={3}
                                    value={newActivity.description}
                                    onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                                    required
                                ></textarea>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                type="button"
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 text-sm"
                                onClick={() => setShowAddActivityForm(false)}
                                >
                                Cancel
                                </button>
                                <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                                >
                                Save
                                </button>
                            </div>
                            </form>
                        </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedClub.activities && selectedClub.activities.length > 0 ? (
                            selectedClub.activities.map(activity => (
                            <div key={activity.id} className="bg-gray-700 rounded-lg p-4 relative">
                                <span 
                                className={`absolute top-4 right-4 px-2 py-1 text-xs rounded ${
                                    activity.status === 'upcoming' 
                                    ? 'bg-blue-900 text-blue-200' 
                                    : activity.status === 'completed'
                                    ? 'bg-green-900 text-green-200'
                                    : 'bg-red-900 text-red-200'
                                }`}
                                >
                                {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                                </span>
                                <h4 className="font-medium text-lg mb-2 pr-20">{activity.name}</h4>
                                <p className="text-sm text-gray-400 mb-2">{formatDate(activity.date)}</p>
                                <p className="text-sm mb-3">{activity.description}</p>
                                <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-400">Location: {activity.location}</p>
                                <button
                                    className="text-red-400 hover:text-red-500 text-sm"
                                    onClick={() => handleRemoveActivity(activity.id)}
                                >
                                    Remove
                                </button>
                                </div>
                            </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-8 text-gray-400">
                            No activities added yet
                            </div>
                        )}
                        </div>
                    </div>
                    )}
                    
                    {activeTab === 'meeting' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Meeting Schedule</h3>
                        <button
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm"
                            onClick={() => setEditMeetingSchedule(true)}
                        >
                            Edit Schedule
                        </button>
                        </div>
                        
                        {editMeetingSchedule ? (
                        <div className="bg-gray-700 p-4 rounded-lg mb-6">
                            <h4 className="font-medium mb-4">Update Meeting Schedule</h4>
                            <form onSubmit={handleUpdateMeeting}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                <label className="block text-sm font-medium mb-1">Day</label>
                                <select
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md"
                                    value={updatedMeeting.day}
                                    onChange={(e) => setUpdatedMeeting({...updatedMeeting, day: e.target.value})}
                                    required
                                >
                                    <option value="">Select Day</option>
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                    <option value="Saturday">Saturday</option>
                                    <option value="Sunday">Sunday</option>
                                </select>
                                </div>
                                <div>
                                <label className="block text-sm font-medium mb-1">Time</label>
                                <input
                                    type="time"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md"
                                    value={updatedMeeting.time}
                                    onChange={(e) => setUpdatedMeeting({...updatedMeeting, time: e.target.value})}
                                    required
                                />
                                </div>
                                <div>
                                <label className="block text-sm font-medium mb-1">Location</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md"
                                    value={updatedMeeting.location}
                                    onChange={(e) => setUpdatedMeeting({...updatedMeeting, location: e.target.value})}
                                    required
                                />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                type="button"
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 text-sm"
                                onClick={() => setEditMeetingSchedule(false)}
                                >
                                Cancel
                                </button>
                                <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                >
                                Update
                                </button>
                            </div>
                            </form>
                        </div>
                        ) : (
                        <div className="bg-gray-700 rounded-lg p-6">
                            {selectedClub.meetingSchedule ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gray-800 rounded-lg p-4 text-center">
                                <p className="text-gray-400 text-sm mb-2">Day</p>
                                <p className="text-2xl font-bold text-blue-400">{selectedClub.meetingSchedule.day}</p>
                                </div>
                                <div className="bg-gray-800 rounded-lg p-4 text-center">
                                <p className="text-gray-400 text-sm mb-2">Time</p>
                                <p className="text-2xl font-bold text-blue-400">
                                    {new Date(`2021-01-01T${selectedClub.meetingSchedule.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                </div>
                                <div className="bg-gray-800 rounded-lg p-4 text-center">
                                <p className="text-gray-400 text-sm mb-2">Location</p>
                                <p className="text-2xl font-bold text-blue-400">{selectedClub.meetingSchedule.location}</p>
                                </div>
                            </div>
                            ) : (
                            <p className="text-center text-gray-400 py-8">No meeting schedule set</p>
                            )}
                        </div>
                        )}
                    </div>
                    )}
                </div>
                )}
            </div>
            </div>

        </div>
    );
};

export default AdminClubManagement;