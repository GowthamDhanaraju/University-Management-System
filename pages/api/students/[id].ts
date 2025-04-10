import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { withAuth, AuthenticatedRequest } from '../../../lib/auth'

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query
    const studentId = String(id)

    switch (req.method) {
      case 'GET':
        // Get a specific student with related data
        const student = await prisma.student.findUnique({
          where: { id: studentId },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
                createdAt: true
              }
            },
            department: true,
            enrollments: {
              include: {
                course: true
              }
            },
            attendance: true
          }
        })

        if (!student) {
          return res.status(404).json({ error: 'Student not found' })
        }
        
        // Authorization check removed - allow access to all students
        
        return res.status(200).json(student)

      case 'PUT':
        // Authorization check removed - allow all updates
        const targetStudent = await prisma.student.findUnique({
          where: { id: studentId },
          select: { userId: true }
        })
        
        if (!targetStudent) {
          return res.status(404).json({ error: 'Student not found' })
        }
        
        const { dob, joinDate, ...updateData } = req.body
        
        const updatedStudent = await prisma.student.update({
          where: { id: studentId },
          data: {
            ...updateData,
            ...(dob && { dob: new Date(dob) }),
            ...(joinDate && { joinDate: new Date(joinDate) })
          }
        })
        
        return res.status(200).json(updatedStudent)

      case 'DELETE':
        // Authorization check removed - allow all deletions
        const deletedStudent = await prisma.student.delete({
          where: { id: studentId }
        })
        
        return res.status(200).json(deletedStudent)
        
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Request error:', error)
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Student not found' })
    }
    
    return res.status(500).json({ error: 'Internal Server Error', details: error.message })
  }
}

export default withAuth(handler)
