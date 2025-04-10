import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const borrowId = String(id);

    // GET: Fetch a specific borrowed book record
    if (req.method === 'GET') {
      const borrowedBook = await prisma.borrowedBook.findUnique({
        where: { id: borrowId },
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
        }
      });

      if (!borrowedBook) {
        return res.status(404).json({
          success: false,
          message: 'Borrowed book record not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: borrowedBook
      });
    }

    // PUT: Update borrowed book record (primarily for returns)
    if (req.method === 'PUT') {
      const { status, returnDate } = req.body;

      // Get current borrowed book record
      const currentBorrow = await prisma.borrowedBook.findUnique({
        where: { id: borrowId },
        include: { book: true }
      });

      if (!currentBorrow) {
        return res.status(404).json({
          success: false,
          message: 'Borrowed book record not found'
        });
      }

      // If marking as returned, update book availability
      if (status === 'returned' && currentBorrow.status === 'active') {
        await prisma.$transaction(async (prisma) => {
          // Update the borrowed book record
          const updatedBorrow = await prisma.borrowedBook.update({
            where: { id: borrowId },
            data: {
              status,
              returnDate: returnDate ? new Date(returnDate) : new Date()
            }
          });

          // Increase available copies
          await prisma.book.update({
            where: { id: currentBorrow.bookId },
            data: { available: currentBorrow.book.available + 1 }
          });

          return updatedBorrow;
        });
      } else {
        // Just update the status without changing book availability
        await prisma.borrowedBook.update({
          where: { id: borrowId },
          data: {
            status,
            returnDate: returnDate ? new Date(returnDate) : undefined
          }
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Borrowed book record updated successfully'
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  } catch (error) {
    console.error('Borrowed book operation error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during operation'
    });
  }
}
