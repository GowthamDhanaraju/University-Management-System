import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { verifyToken } from '../../../../lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const studentId = String(id);

  // Handle GET request to fetch student profile
  if (req.method === 'GET') {
    try {
      // Get student with user data and department
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          department: true,
        },
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found',
        });
      }

      // Format the response to match the expected profile structure
      const profileData = {
        success: true,
        data: {
          personal: {
            name: student.user?.name || "Student",
            photo: student.photo || '',
            dob: student.dob?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
            gender: student.gender || 'Male',
            studentId: student.studentId || studentId,
            joinYear: student.joinYear || new Date().getFullYear().toString(),
            bloodGroup: student.bloodGroup || 'O+',
            nationality: student.nationality || 'Indian',
          },
          contact: {
            email: student.user?.email || '',
            phone: student.phone || '1234567890',
            address: student.address || 'University Campus',
            emergencyContact: student.emergencyContact || 'Parent: 9876543210',
          },
          academic: {
            department: student.department?.name || 'Computer Science',
            year: student.year || '2',
            semester: student.semester || '3', 
            cgpa: student.cgpa?.toString() || '3.75',
            attendance: student.attendance || '92%',
            advisor: student.advisor || 'Prof. Johnson',
          },
        },
      };

      return res.status(200).json(profileData);
    } catch (error) {
      console.error('Error fetching student profile:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch student profile',
      });
    }
  }

  // Handle PUT request to update student profile
  if (req.method === 'PUT') {
    try {
      const { personal, contact } = req.body;

      // Find student to update
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { userId: true },
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found',
        });
      }

      // Update user info if provided (name and email)
      if (personal?.name || contact?.email) {
        await prisma.user.update({
          where: { id: student.userId },
          data: {
            ...(personal?.name && { name: personal.name }),
            ...(contact?.email && { email: contact.email }),
          },
        });
      }

      // Update student specific information
      await prisma.student.update({
        where: { id: studentId },
        data: {
          ...(personal?.dob && { dob: new Date(personal.dob) }),
          ...(personal?.gender && { gender: personal.gender }),
          ...(personal?.bloodGroup && { bloodGroup: personal.bloodGroup }),
          ...(personal?.nationality && { nationality: personal.nationality }),
          ...(contact?.phone && { phone: contact.phone }),
          ...(contact?.address && { address: contact.address }),
          ...(contact?.emergencyContact && { emergencyContact: contact.emergencyContact }),
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating student profile:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update profile',
      });
    }
  }

  // Handle other methods
  return res.status(405).json({
    success: false,
    message: 'Method not allowed',
  });
}
