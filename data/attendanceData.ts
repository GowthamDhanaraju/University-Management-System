// Define or import the SemesterAttendance type
export interface SemesterAttendance {
  semester: string;
  records: {
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
  }[];
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
        },
        {
          SID: "S103",
          courseID: "CSE203",
          courseName: "Computer Vision",
          faculty: "Dr. Grey",
          total: 30,
          present: 19,
          dutyLeave: 2,
          absent: 9,
          medical: 0,
          absentDays: ["March 1", "March 3", "March 6", "March 10", "March 12", "March 15", "March 17", "March 19", "March 22"],
          medicalDays: [],
          dutyLeaveDays: ["March 5", "March 8"],
        },
        {
          SID: "S104",
          courseID: "CSE204",
          courseName: "Software Engineering",
          faculty: "Dr. Violet",
          total: 30,
          present: 21,
          dutyLeave: 1,
          absent: 6,
          medical: 2,
          absentDays: ["March 2", "March 4", "March 6", "March 11", "March 13", "March 20"],
          medicalDays: ["March 22", "March 25"],
          dutyLeaveDays: ["March 9"],
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
          dutyLeaveDays: ["Oct 8", "Oct 10", "Oct 20"],
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
        },
        {
          SID: "S105",
          courseID: "CSE303",
          courseName: "Mobile App Development",
          faculty: "Dr. Orange",
          total: 30,
          present: 17,
          dutyLeave: 1,
          absent: 10,
          medical: 2,
          absentDays: ["Oct 1", "Oct 3", "Oct 6", "Oct 10", "Oct 12", "Oct 13", "Oct 15", "Oct 18", "Oct 22", "Oct 25"],
          medicalDays: ["Oct 8", "Oct 20"],
          dutyLeaveDays: ["Oct 5"],
        },
        {
          SID: "S106",
          courseID: "CSE304",
          courseName: "Web Technologies",
          faculty: "Dr. Aqua",
          total: 30,
          present: 22,
          dutyLeave: 2,
          absent: 5,
          medical: 1,
          absentDays: ["Oct 2", "Oct 6", "Oct 9", "Oct 11", "Oct 17"],
          medicalDays: ["Oct 14"],
          dutyLeaveDays: ["Oct 5", "Oct 10"],
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
        },
        {
          SID: "S107",
          courseID: "CSE403",
          courseName: "Blockchain Tech",
          faculty: "Dr. Cyan",
          total: 30,
          present: 18,
          dutyLeave: 3,
          absent: 9,
          medical: 0,
          absentDays: ["April 1", "April 3", "April 5", "April 7", "April 9", "April 11", "April 13", "April 15", "April 17"],
          medicalDays: [],
          dutyLeaveDays: ["April 4", "April 6", "April 10"],
        },
        {
          SID: "S108",
          courseID: "CSE404",
          courseName: "Big Data Analytics",
          faculty: "Dr. Pink",
          total: 30,
          present: 20,
          dutyLeave: 2,
          absent: 6,
          medical: 2,
          absentDays: ["April 2", "April 5", "April 8", "April 12", "April 15", "April 18"],
          medicalDays: ["April 20", "April 22"],
          dutyLeaveDays: ["April 6", "April 9"],
        }
      ]
    }
  ];
  