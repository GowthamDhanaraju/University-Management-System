import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Fetch courses the student is enrolled in
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: id as string,
      },
      include: {
        course: {
          include: {
            department: true,
            teacherCourses: {
              include: {
                teacher: {
                  include: {
                    user: true
                  }
                },
              },
            },
          },
        },
      },
    });

    // Format the data to match your frontend expectations
    const courses = enrollments.map(enrollment => {
      const teacherCourse = enrollment.course.teacherCourses[0];
      return {
        id: enrollment.courseId,
        code: enrollment.course.code,
        title: enrollment.course.name,
        description: enrollment.course.description || "",
        credits: enrollment.course.credits,
        department: enrollment.course.department.name,
        instructorId: teacherCourse?.teacherId || '',
        instructorName: teacherCourse?.teacher.user?.name || '',
        instructorDesignation: teacherCourse?.teacher.designation || 'Professor',
        instructorRating: teacherCourse?.teacher.rating || 4.5,
        semester: `${enrollment.year} - Semester ${enrollment.semester}`,
        sections: [enrollment.section || 'A'],
        hasFeedbackSubmitted: false, // You may need to implement a check for this
        status: "Enrolled",
        schedule: enrollment.schedule || "Mon, Wed 10:00-11:30 AM",
        location: enrollment.location || "Room 101"
      };
    });

    return res.status(200).json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Failed to fetch student courses:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch courses' 
    });
  }
}
