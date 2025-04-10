import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  const { studentId, bookId, borrowDate, dueDate } = req.body;

  try {
    // Check if book is available
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.available <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available for borrowing'
      });
    }

    // Begin transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create lending record
      const lending = await prisma.bookLending.create({
        data: {
          studentId,
          bookId,
          borrowDate: new Date(borrowDate),
          dueDate: new Date(dueDate)
        }
      });

      // Update book availability
      await prisma.book.update({
        where: { id: bookId },
        data: {
          available: {
            decrement: 1
          }
        }
      });

      return lending;
    });

    // Get the updated book
    const updatedBook = await prisma.book.findUnique({
      where: { id: bookId }
    });

    return res.status(200).json({
      success: true,
      message: 'Book borrowed successfully',
      data: {
        lending: result,
        book: updatedBook
      }
    });
  } catch (error) {
    console.error('Error borrowing book:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to borrow book' 
    });
  }
}
