export interface ClubActivity {
    id: string;
    title: string;
    description: string;
    facultyInCharge: string;
    facultyEmail: string;
    deadline: string;
    status: 'completed' | 'pending' | 'overdue';
    clubName: string;
    points: number;
  }
  
  export interface StudentClub {
    id: string;
    name: string;
    description: string;
    president: string;
    facultyAdvisor: string;
    meetingSchedule: string;
    totalMembers: number;
    activities: ClubActivity[];
  }
  
  export const studentClubsData: StudentClub[] = [
    {
      id: '1',
      name: 'Tech Innovators',
      description: 'A club for technology enthusiasts to build projects and learn new skills',
      president: 'Alex Johnson',
      facultyAdvisor: 'Dr. Sarah Miller',
      meetingSchedule: 'Every Wednesday, 4-6 PM',
      totalMembers: 24,
      activities: [
        {
          id: 'a1',
          title: 'Annual Hackathon',
          description: 'Participate in the 24-hour coding competition with teams',
          facultyInCharge: 'Dr. Sarah Miller',
          facultyEmail: 's.miller@university.edu',
          deadline: '2023-11-15',
          status: 'completed',
          clubName: 'Tech Innovators',
          points: 50
        },
        {
          id: 'a2',
          title: 'AI Workshop Series',
          description: 'Attend all 4 workshops on machine learning fundamentals',
          facultyInCharge: 'Dr. Robert Chen',
          facultyEmail: 'r.chen@university.edu',
          deadline: '2023-12-10',
          status: 'pending',
          clubName: 'Tech Innovators',
          points: 30
        }
      ]
    },
    {
      id: '2',
      name: 'Literary Society',
      description: 'For students passionate about writing, poetry, and literature',
      president: 'Maria Garcia',
      facultyAdvisor: 'Prof. James Wilson',
      meetingSchedule: 'Every Friday, 3-5 PM',
      totalMembers: 18,
      activities: [
        {
          id: 'a3',
          title: 'Poetry Slam',
          description: 'Submit original poetry for the annual competition',
          facultyInCharge: 'Prof. James Wilson',
          facultyEmail: 'j.wilson@university.edu',
          deadline: '2023-11-30',
          status: 'overdue',
          clubName: 'Literary Society',
          points: 20
        },
        {
          id: 'a4',
          title: 'Short Story Collection',
          description: 'Contribute to the annual student short story anthology',
          facultyInCharge: 'Prof. Emily Davis',
          facultyEmail: 'e.davis@university.edu',
          deadline: '2023-12-15',
          status: 'pending',
          clubName: 'Literary Society',
          points: 40
        }
      ]
    }
  ];
  
  export const upcomingEvents = [
    {
      id: 'e1',
      title: 'Tech Talk: Blockchain Fundamentals',
      date: '2023-11-20',
      time: '5:00 PM',
      location: 'CS Building Room 203',
      club: 'Tech Innovators'
    },
    {
      id: 'e2',
      title: 'Open Mic Night',
      date: '2023-11-25',
      time: '7:00 PM',
      location: 'Student Union Auditorium',
      club: 'Literary Society'
    }
  ];