import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (req.method === 'GET') {
    try {
      // Find teacher by ID
      const teacher = await prisma.teacher.findUnique({
        where: { id: id as string },
      });
      
      if (!teacher) {
        return res.status(404).json({ success: false, message: 'Teacher not found' });
      }
      
      // Get feedback for this teacher
      const feedback = await prisma.feedback.findMany({
        where: { teacherId: id as string },
        include: {
          course: true,
        },
      });
      
      // Format feedback response
      const formattedFeedback = await Promise.all(feedback.map(async (item) => {
        // Get student name if not anonymous
        let studentName = 'Anonymous Student';
        if (item.studentId) {
          const student = await prisma.student.findUnique({
            where: { id: item.studentId },
            select: { name: true }
          });
          if (student) {
            studentName = student.name;
          }
        }
        
        return {
          id: item.id,
          subject: item.course.name,
          section: 'All Sections', // Default - could be extended with more data
          date: item.date.toISOString().split('T')[0],
          rating: item.overallRating,
          comment: item.comments || '',
          studentId: item.studentId,
          studentName: studentName,
          courseId: item.courseId,
          courseName: item.course.name,
          courseRatings: item.courseRating,
          facultyRatings: item.teacherRating,
          overallRating: item.overallRating
        };
      }));
      
      return res.status(200).json({ success: true, data: formattedFeedback });
    } catch (error) {
      console.error('Error fetching teacher feedback:', error);
      return res.status(500).json({ success: false, message: 'Error fetching feedback data' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
