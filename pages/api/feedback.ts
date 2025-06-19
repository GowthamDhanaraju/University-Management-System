import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Get all feedback entries with related course, teacher, and student (including user)
      const feedback = await prisma.feedback.findMany({
        include: {
          course: true,
          teacher: {
            include: {
              user: {
                select: {
                  name: true,
                }
              }
            }
          },
          student: {
            include: {
              user: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: { date: 'desc' }
      });
      
      // Format feedback response with student data (no extra DB calls)
      const formattedFeedback = feedback.map((item) => {
        let studentName = 'Anonymous Student';
        if (item.student) {
          studentName = item.student.name || (item.student.user && item.student.user.name) || 'Anonymous Student';
        }
        return {
          id: item.id,
          subject: item.course.name,
          section: 'All Sections',
          date: item.date.toISOString().split('T')[0],
          rating: item.overallRating,
          comment: item.comments || '',
          studentId: item.studentId || '',
          studentName: studentName,
          courseId: item.courseId,
          courseName: item.course.name,
          teacherId: item.teacherId,
          teacherName: item.teacher.name || (item.teacher.user && item.teacher.user.name) || 'Unknown Teacher',
          courseRating: item.courseRating,
          teacherRating: item.teacherRating,
          overallRating: item.overallRating
        };
      });
      
      return res.status(200).json({ success: true, data: formattedFeedback });
    } catch (error) {
      console.error('Error fetching feedback:', error);
      return res.status(500).json({ success: false, message: 'Error fetching feedback data' });
    }
  } else if (req.method === 'POST') {
    // Keep existing POST method handler
    // ...existing code...
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
