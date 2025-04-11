import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  const { teacherId, courseId } = req.query;

  try {
    // Base query options
    const queryOptions: any = {
      where: {},
      include: {
        course: true,
        student: {
          select: {
            name: true,
            studentId: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    };

    // Filter by teacher if specified
    if (teacherId) {
      queryOptions.where.teacherId = String(teacherId);
    }

    // Filter by course if specified
    if (courseId) {
      queryOptions.where.courseId = String(courseId);
    }

    // Fetch feedback data
    const feedbackData = await prisma.feedback.findMany(queryOptions);

    // Format the response
    const response = feedbackData.map((fb) => ({
      id: fb.id,
      courseId: fb.courseId,
      courseName: fb.course.name,
      studentId: fb.studentId || "Anonymous",
      studentName: fb.student?.name || "Anonymous Student",
      date: fb.date.toISOString().split("T")[0],
      courseRatings: fb.courseRating || {},
      facultyRatings: fb.teacherRating || {},
      overallRating: fb.overallRating || 0,
      comments: fb.comments || "",
    }));

    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch feedback.",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}