// src/data/attendanceData.ts
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
  }
  
  // Manually stored attendance data
  export const attendanceData: AttendanceRecord[] = [
    { SID: "S101", courseID: "CSE101", courseName: "Data Structures", faculty: "Dr. Smith", total: 30, present: 26, dutyLeave: 2, absent: 2, medical: 1 },
    { SID: "S102", courseID: "CSE102", courseName: "Algorithms", faculty: "Dr. Johnson", total: 30, present: 28, dutyLeave: 1, absent: 1, medical: 0 },
    { SID: "S103", courseID: "CSE103", courseName: "Computer Networks", faculty: "Dr. Allen", total: 30, present: 20, dutyLeave: 0, absent: 8, medical: 2 },
    { SID: "S104", courseID: "CSE104", courseName: "Operating Systems", faculty: "Dr. Carter", total: 30, present: 27, dutyLeave: 1, absent: 2, medical: 0 },
    { SID: "S105", courseID: "CSE105", courseName: "User Interface Design", faculty: "Dr. Brown", total: 30, present: 24, dutyLeave: 3, absent: 3, medical: 1 },
  ];
  