export interface AttendanceRecord {
  SID: string;
  courseID: string;
  courseName: string;
  faculty: string;
  total: number;
  present: number;
  dutyLeave: number;
  absent: number;
  medical: number;
  absentDays: string[];    // Days when the student was absent
  medicalDays: string[];   // Days when the student was on medical leave
  dutyLeaveDays: string[]; // Days when the student was on duty leave
}

// Updated attendance data with absent, medical leave, and duty leave days
export const attendanceData: AttendanceRecord[] = [
  { 
      SID: "S101", 
      courseID: "CSE101", 
      courseName: "Data Structures", 
      faculty: "Dr. Smith", 
      total: 30, 
      present: 26, 
      dutyLeave: 2, 
      absent: 2, 
      medical: 1, 
      absentDays: ["March 5", "March 12"], 
      medicalDays: ["March 20"], 
      dutyLeaveDays: ["March 8", "March 15"] 
  },
  { 
      SID: "S102", 
      courseID: "CSE102", 
      courseName: "Algorithms", 
      faculty: "Dr. Johnson", 
      total: 30, 
      present: 28, 
      dutyLeave: 1, 
      absent: 1, 
      medical: 0, 
      absentDays: ["March 10"], 
      medicalDays: [], 
      dutyLeaveDays: ["March 18"] 
  },
  { 
      SID: "S103", 
      courseID: "CSE103", 
      courseName: "Computer Networks", 
      faculty: "Dr. Allen", 
      total: 30, 
      present: 20, 
      dutyLeave: 0, 
      absent: 8, 
      medical: 2, 
      absentDays: ["March 1", "March 3", "March 7", "March 11", "March 15", "March 18", "March 20", "March 22"], 
      medicalDays: ["March 5", "March 9"], 
      dutyLeaveDays: [] 
  },
  { 
      SID: "S104", 
      courseID: "CSE104", 
      courseName: "Operating Systems", 
      faculty: "Dr. Carter", 
      total: 30, 
      present: 27, 
      dutyLeave: 1, 
      absent: 2, 
      medical: 0, 
      absentDays: ["March 8", "March 14"], 
      medicalDays: [], 
      dutyLeaveDays: ["March 10"] 
  },
  { 
      SID: "S105", 
      courseID: "CSE105", 
      courseName: "User Interface Design", 
      faculty: "Dr. Brown", 
      total: 30, 
      present: 24, 
      dutyLeave: 3, 
      absent: 3, 
      medical: 1, 
      absentDays: ["March 6", "March 9", "March 13"], 
      medicalDays: ["March 21"], 
      dutyLeaveDays: ["March 2", "March 16", "March 19"] 
  },
];
