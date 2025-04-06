export interface Faculty {
    id: number;
    name: string;
    email: string;
    department: string;
    subjects: string[];
    bio: string;
    qualifications: string[];
    experience: string[];
    publications?: string[];
    officeHours?: string;
    phone?: string;
  }
  
  export const facultiesData: Faculty[] = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@university.edu",
      department: "Computer Science",
      subjects: ["Data Structures", "Algorithms", "Machine Learning"],
      bio: "Dr. Johnson specializes in artificial intelligence and has over 15 years of teaching experience. Her research focuses on neural networks and deep learning applications.",
      qualifications: [
        "PhD in Computer Science, Stanford University",
        "MS in Artificial Intelligence, MIT",
        "BS in Computer Engineering, UC Berkeley"
      ],
      experience: [
        "Professor at University (2015-Present)",
        "Senior Researcher at TechCorp (2010-2015)",
        "Visiting Scholar at Cambridge (2008-2010)"
      ],
      publications: [
        "Deep Learning for Image Recognition (2022)",
        "Neural Network Optimization Techniques (2020)",
        "AI Ethics in Modern Applications (2018)"
      ],
      officeHours: "Mon/Wed 2:00-4:00 PM",
      phone: "+1 (555) 123-4567"
    },
    {
      id: 2,
      name: "Dr. James Lee",
      email: "james.lee@university.edu",
      department: "Electrical Engineering",
      subjects: ["Digital Circuits", "Embedded Systems", "Signal Processing"],
      bio: "Dr. Lee's expertise lies in microcontroller architecture and digital signal processing. He has led several funded projects in embedded systems.",
      qualifications: [
        "PhD in Electrical Engineering, Georgia Tech",
        "MEng in Electronics, University of Michigan",
        "BE in Electrical Engineering, Purdue University"
      ],
      experience: [
        "Associate Professor at University (2016-Present)",
        "Systems Engineer at EmbeddedTech Inc. (2011-2016)"
      ],
      publications: [
        "Advanced DSP Algorithms (2021)",
        "Designing Real-time Embedded Systems (2019)"
      ],
      officeHours: "Tue/Thu 10:00-12:00 PM",
      phone: "+1 (555) 234-5678"
    },
    {
      id: 3,
      name: "Dr. Priya Nair",
      email: "priya.nair@university.edu",
      department: "Mechanical Engineering",
      subjects: ["Thermodynamics", "Fluid Mechanics", "Heat Transfer"],
      bio: "Dr. Nair focuses her research on thermal systems and renewable energy technologies. She brings over a decade of industrial and academic experience.",
      qualifications: [
        "PhD in Mechanical Engineering, IIT Bombay",
        "MS in Thermal Sciences, NUS",
        "BE in Mechanical Engineering, Anna University"
      ],
      experience: [
        "Assistant Professor at University (2018-Present)",
        "R&D Engineer at ThermoSys Pvt. Ltd. (2012-2018)"
      ],
      publications: [
        "Renewable Energy Systems for Industry (2020)",
        "Modern Approaches in Heat Transfer (2017)"
      ],
      officeHours: "Mon/Fri 3:00-5:00 PM",
      phone: "+1 (555) 345-6789"
    },
    {
      id: 4,
      name: "Dr. Omar El-Tayeb",
      email: "omar.eltayeb@university.edu",
      department: "Civil Engineering",
      subjects: ["Structural Analysis", "Construction Management", "Geotechnics"],
      bio: "Dr. El-Tayeb is a seasoned structural engineer and academic with multiple international collaborations. His work contributes to sustainable construction practices.",
      qualifications: [
        "PhD in Structural Engineering, ETH Zurich",
        "MSc in Civil Engineering, University of Toronto",
        "BSc in Civil Engineering, Cairo University"
      ],
      experience: [
        "Professor at University (2012-Present)",
        "Consultant at Global Build Co. (2005-2011)"
      ],
      publications: [
        "Green Materials in Modern Construction (2021)",
        "Structural Health Monitoring Techniques (2018)"
      ],
      officeHours: "Wed/Fri 1:00-3:00 PM",
      phone: "+1 (555) 456-7890"
    },
    {
      id: 5,
      name: "Dr. Emily Chen",
      email: "emily.chen@university.edu",
      department: "Mathematics",
      subjects: ["Calculus", "Linear Algebra", "Statistics"],
      bio: "Dr. Chen is passionate about making complex math concepts accessible and engaging. Her recent research delves into mathematical modeling in epidemiology.",
      qualifications: [
        "PhD in Mathematics, Harvard University",
        "MS in Applied Mathematics, UCLA",
        "BA in Mathematics, University of Chicago"
      ],
      experience: [
        "Lecturer at University (2020-Present)",
        "Data Analyst at HealthStat (2016-2020)"
      ],
      publications: [
        "Mathematical Models in Disease Spread (2022)",
        "Applications of Linear Algebra in Data Science (2019)"
      ],
      officeHours: "Tue/Thu 4:00-6:00 PM",
      phone: "+1 (555) 567-8901"
    }
  ];
  