import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const students = await prisma.student.findMany({
      select: {
        id: true,
        studentId: true,
        name: true,
        semester: true,
        contact: true,
        academicInfo: true,
        departmentId: true,
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        },
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Format the data for frontend use
    const formattedStudents = students.map(student => ({
      id: student.id,
      studentId: student.studentId,
      name: student.name || student.user.name,
      email: student.user.email,
      contact: student.contact,
      semester: student.semester,
      academicInfo: student.academicInfo,
      departmentId: student.departmentId,
      department: student.department,
      departmentCode: student.department?.code,
      departmentName: student.department?.name
    }));

    return res.status(200).json({ 
      success: true, 
      data: formattedStudents 
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch students" 
    });
  }
}
