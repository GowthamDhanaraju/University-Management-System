import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify JWT token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'TEACHER') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find teacher by user ID
    const teacher = await prisma.teacher.findFirst({
      where: {
        userId: decoded.id
      }
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Find courses taught by this teacher
    const teacherCourses = await prisma.teacherCourse.findMany({
      where: {
        teacherId: teacher.id
      },
      include: {
        course: {
          include: {
            department: true,
            enrollments: true,
          }
        }
      }
    });

    // Format the response
    const courses = teacherCourses.map(tc => {
      const course = tc.course;
      
      // Get all sections from enrollments
      const sections = [...new Set(course.enrollments.map(e => e.section || 'A'))];
      
      return {
        id: course.id,
        code: course.code,
        name: course.name,
        department: course.department.name,
        semester: tc.semester || '1',
        sections: sections,
        students: course.enrollments.length,
        status: tc.status || 'Active'
      };
    });

    return res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching teacher courses:', error);
    return res.status(500).json({ message: 'Failed to fetch courses' });
  }
}
