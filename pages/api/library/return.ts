import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { studentId, bookId } = req.body;

    if (!studentId || !bookId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // First, get the student by userId or other identifiers
    let student = null;
    
    // Try finding by ID directly
    student = await prisma.student.findUnique({
      where: { id: studentId }
    });
    
    // If not found, try by studentId field
    if (!student) {
      student = await prisma.student.findUnique({
        where: { studentId: studentId }
      });
    }
    
    // If still not found, try by userId
    if (!student) {
      student = await prisma.student.findFirst({
        where: { userId: studentId }
      });
    }

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Find the active borrowed book record
    const borrowedBook = await prisma.borrowedBook.findFirst({
      where: {
        bookId,
        studentId: student.id,
        status: 'active',
      },
      include: {
        book: true,
      },
    });

    if (!borrowedBook) {
      return res.status(404).json({ success: false, message: 'No active borrow record found for this book' });
    }

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction([
      // Update the borrowed book record
      prisma.borrowedBook.update({
        where: { id: borrowedBook.id },
        data: {
          status: 'returned',
          returnDate: new Date(),
        },
      }),
      // Update book availability
      prisma.book.update({
        where: { id: bookId },
        data: { available: borrowedBook.book.available + 1 },
      }),
    ]);

    return res.status(200).json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error returning book:', error);
    return res.status(500).json({ success: false, message: 'Failed to return book' });
  }
}
