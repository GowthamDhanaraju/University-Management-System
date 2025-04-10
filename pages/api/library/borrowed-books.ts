import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // GET: List all borrowed books
    if (req.method === 'GET') {
      const borrowedBooks = await prisma.borrowedBook.findMany({
        include: {
          book: true,
          student: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: {
          borrowDate: 'desc'
        }
      });

      // Format the response to match the expected format in the UI
      const formattedBorrowedBooks = borrowedBooks.map(borrow => ({
        id: borrow.id,
        bookId: borrow.bookId,
        studentId: borrow.studentId,
        borrowDate: borrow.borrowDate.toISOString(),
        dueDate: borrow.dueDate.toISOString(),
        returnDate: borrow.returnDate ? borrow.returnDate.toISOString() : null,
        status: borrow.status,
        book: borrow.book,
        student: {
          name: borrow.student.user.name,
          studentId: borrow.student.studentId
        }
      }));

      return res.status(200).json({
        success: true,
        data: formattedBorrowedBooks
      });
    }

    // POST: Create a new borrowed book record
    if (req.method === 'POST') {
      const { bookId, studentId, dueDate } = req.body;

      // Validate required fields
      if (!bookId || !studentId || !dueDate) {
        return res.status(400).json({
          success: false,
          message: 'Book ID, student ID, and due date are required'
        });
      }

      // Check if book exists and has available copies
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
          message: 'No available copies of this book'
        });
      }

      // Check if student exists
      const student = await prisma.student.findUnique({
        where: { id: studentId }
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Create the borrowed book record and update book availability
      const borrowedBook = await prisma.$transaction(async (prisma) => {
        // Decrease available copies
        await prisma.book.update({
          where: { id: bookId },
          data: { available: book.available - 1 }
        });

        // Create borrowed book record
        return prisma.borrowedBook.create({
          data: {
            bookId,
            studentId,
            borrowDate: new Date(),
            dueDate: new Date(dueDate),
            status: 'active'
          }
        });
      });

      return res.status(201).json({
        success: true,
        data: borrowedBook
      });
    }

    // Method not allowed
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  } catch (error) {
    console.error('Borrowed books operation error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during operation'
    });
  }
}
