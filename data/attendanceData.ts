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
    absentDays: string[];
    medicalDays: string[];
    dutyLeaveDays: string[];
}
  
export interface SemesterAttendance {
    semester: string;
    records: AttendanceRecord[];
}
  
export const attendanceData: SemesterAttendance[] = [
    {
        semester: "Spring 2024",
        records: [
            {
                SID: "S101",
                courseID: "CSE201",
                courseName: "Artificial Intelligence",
                faculty: "Dr. Green",
                total: 30,
                present: 26,
                dutyLeave: 2,
                absent: 2,
                medical: 1,
                absentDays: ["March 5", "March 12"],
                medicalDays: ["March 20"],
                dutyLeaveDays: ["March 8", "March 15"],
            },
            {
                SID: "S102",
                courseID: "CSE202",
                courseName: "Cloud Computing",
                faculty: "Dr. White",
                total: 30,
                present: 28,
                dutyLeave: 1,
                absent: 1,
                medical: 0,
                absentDays: ["March 10"],
                medicalDays: [],
                dutyLeaveDays: ["March 18"],
            }
        ]
    },
    {
        semester: "Fall 2023",
        records: [
            {
                SID: "S103",
                courseID: "CSE301",
                courseName: "Cybersecurity",
                faculty: "Dr. Black",
                total: 30,
                present: 24,
                dutyLeave: 3,
                absent: 3,
                medical: 0,
                absentDays: ["Oct 5", "Oct 12", "Oct 15"],
                medicalDays: [],
                dutyLeaveDays: ["Oct 8", "Oct 10"],
            },
            {
                SID: "S102",
                courseID: "CSE302",
                courseName: "Data Mining",
                faculty: "Dr. Brown",
                total: 30,
                present: 27,
                dutyLeave: 1,
                absent: 2,
                medical: 0,
                absentDays: ["Oct 9", "Oct 18"],
                medicalDays: [],
                dutyLeaveDays: ["Oct 13"],
            }
        ]
    },
    {
        semester: "Spring 2023",
        records: [
            {
                SID: "S101",
                courseID: "CSE401",
                courseName: "Machine Learning",
                faculty: "Dr. Blue",
                total: 30,
                present: 24,
                dutyLeave: 3,
                absent: 2,
                medical: 1,
                absentDays: ["April 5", "April 12"],
                medicalDays: ["April 20"],
                dutyLeaveDays: ["April 8", "April 15", "April 18"],
            },
            {
                SID: "S102",
                courseID: "CSE402",
                courseName: "Internet of Things",
                faculty: "Dr. Yellow",
                total: 30,
                present: 26,
                dutyLeave: 2,
                absent: 2,
                medical: 0,
                absentDays: ["April 10", "April 15"],
                medicalDays: [],
                dutyLeaveDays: ["April 12", "April 17"],
            }
        ]
    }
];
