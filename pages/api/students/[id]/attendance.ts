import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  const { id } = req.query;
  const studentId = Array.isArray(id) ? id[0] : id;

  try {
    // Fetch student's enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: studentId as string,
      },
      include: {
        course: true,
        attendances: {
          orderBy: {
            date: 'desc',
          },
        },
      },
      orderBy: [
        { year: 'desc' },
        { semester: 'desc' },
      ],
    });

    // Group by semester
    const semesterData = [];
    const semesterGroups = new Map();

    for (const enrollment of enrollments) {
      const key = `${enrollment.semester}-${enrollment.year}`;
      
      if (!semesterGroups.has(key)) {
        semesterGroups.set(key, {
          semester: enrollment.semester,
          year: enrollment.year,
          courses: []
        });
      }
      
      const courseAttendances = enrollment.attendances.map(att => ({
        date: att.date,
        status: att.status,
        note: att.note || ''
      }));
      
      // Calculate attendance percentages
      const totalClasses = courseAttendances.length;
      const presentCount = courseAttendances.filter(att => att.status === 'PRESENT').length;
      const absentCount = courseAttendances.filter(att => att.status === 'ABSENT').length;
      const excusedCount = courseAttendances.filter(att => att.status === 'EXCUSED').length;
      
      const attendancePercentage = totalClasses > 0 
        ? Math.round((presentCount / totalClasses) * 100) 
        : 0;
      
      semesterGroups.get(key).courses.push({
        id: enrollment.courseId,
        code: enrollment.course.code,
        name: enrollment.course.name,
        section: enrollment.section || 'A',
        attendancePercentage: attendancePercentage,
        totalClasses: totalClasses,
        present: presentCount,
        absent: absentCount,
        excused: excusedCount,
        records: courseAttendances
      });
    }

    // Convert Map to array for response
    for (const [key, value] of semesterGroups) {
      semesterData.push(value);
    }

    return res.status(200).json({
      success: true,
      data: semesterData
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch attendance data' 
    });
  }
}
