import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { id } = req.query;
  const studentId = Array.isArray(id) ? id[0] : id;
  
  try {
    // Fetch the student's enrollments with grades
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: studentId as string,
      },
      include: {
        course: {
          include: {
            department: true,
          }
        },
      },
      orderBy: [
        { year: 'desc' },
        { semester: 'desc' }
      ],
    });

    // If no grades found
    if (enrollments.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No grades found for this student',
        data: {
          semesters: [],
          summary: {
            totalCredits: 0,
            gpa: 0
          }
        }
      });
    }
    
    // Group by semester and year
    const semesterMap = new Map();
    
    enrollments.forEach(enrollment => {
      const key = `${enrollment.semester}-${enrollment.year}`;
      
      if (!semesterMap.has(key)) {
        semesterMap.set(key, {
          semester: enrollment.semester,
          year: enrollment.year,
          courses: [],
          gpa: 0,
          totalCredits: 0,
          totalPoints: 0
        });
      }
      
      const semester = semesterMap.get(key);
      const points = enrollment.gradePoint || 0;
      const credits = enrollment.course.credits || 0;
      
      semester.courses.push({
        code: enrollment.course.code,
        name: enrollment.course.name,
        credits: credits,
        grade: enrollment.grade || 'N/A',
        points: points,
        department: enrollment.course.department.name
      });
      
      semester.totalCredits += credits;
      semester.totalPoints += (points * credits);
    });
    
    // Calculate GPA for each semester
    const semesters = Array.from(semesterMap.values()).map(semester => {
      semester.gpa = semester.totalCredits > 0 
        ? parseFloat((semester.totalPoints / semester.totalCredits).toFixed(2))
        : 0;
      return semester;
    });
    
    // Calculate overall GPA
    const totalCredits = semesters.reduce((sum, semester) => sum + semester.totalCredits, 0);
    const totalPoints = semesters.reduce((sum, semester) => sum + semester.totalPoints, 0);
    const overallGPA = totalCredits > 0 
      ? parseFloat((totalPoints / totalCredits).toFixed(2)) 
      : 0;
    
    return res.status(200).json({
      success: true,
      data: {
        semesters: semesters,
        summary: {
          totalCredits,
          gpa: overallGPA
        }
      }
    });
  } catch (error) {
    console.error('Error fetching grades:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch grades' 
    });
  }
}
