import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET all students
  if (req.method === 'GET') {
    try {
      const students = await prisma.student.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return res.status(200).json({ 
        success: true, 
        data: students 
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch students' });
    }
  }

  // POST create a new student
  if (req.method === 'POST') {
    try {
      const { 
        name, 
        email, 
        password, 
        dept, 
        year, 
        dob, 
        phone, 
        address 
      } = req.body;

      // Create user first
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: await bcrypt.hash(password, 10),
          role: 'student',
        },
      });

      // Then create student profile
      const student = await prisma.student.create({
        data: {
          userId: user.id,
          dept,
          year,
          dob: new Date(dob),
          phone,
          address,
        },
      });

      return res.status(201).json({ 
        success: true, 
        data: {
          id: student.id,
          name,
          email,
          dept,
          year,
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to create student' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
