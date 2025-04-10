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
    // Find all books borrowed by this student
    const borrowedBooks = await prisma.bookLending.findMany({
      where: {
        studentId: studentId as string,
        returnDate: null // Books that haven't been returned yet
      },
      include: {
        book: true
      }
    });

    const formattedBooks = borrowedBooks.map(lending => {
      const book = lending.book;
      return {
        id: book.id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        category: book.category,
        available: book.available,
        coverImage: book.coverImage || '',
        borrowDate: lending.borrowDate,
        dueDate: lending.dueDate
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedBooks
    });
  } catch (error) {
    console.error('Error fetching borrowed books:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch borrowed books' 
    });
  }
}
