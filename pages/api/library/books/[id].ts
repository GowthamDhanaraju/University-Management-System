import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const bookId = String(id);

    // GET: Fetch a specific book
    if (req.method === 'GET') {
      const book = await prisma.book.findUnique({
        where: { id: bookId },
        include: {
          borrowedBooks: {
            where: {
              status: 'active'
            },
            include: {
              student: {
                include: {
                  user: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!book) {
        return res.status(404).json({ 
          success: false, 
          message: 'Book not found' 
        });
      }

      return res.status(200).json({
        success: true,
        data: book
      });
    }

    // PUT: Update a book
    if (req.method === 'PUT') {
      const { 
        title, 
        author, 
        category, 
        isbn, 
        publisher,
        copies,
        available,
        location 
      } = req.body;

      // Validate required fields
      if (!title || !author || !category) {
        return res.status(400).json({ 
          success: false, 
          message: 'Title, author and category are required' 
        });
      }

      const updatedBook = await prisma.book.update({
        where: { id: bookId },
        data: {
          title,
          author,
          category,
          isbn: isbn || '',
          publisher: publisher || '',
          copies: copies ? parseInt(copies) : 0,
          available: available ? parseInt(available) : 0,
          location: location || ''
        }
      });

      return res.status(200).json({
        success: true,
        data: updatedBook
      });
    }

    // DELETE: Remove a book
    if (req.method === 'DELETE') {
      // First check if this book has any active borrows
      const activeBorrows = await prisma.borrowedBook.count({
        where: {
          bookId: bookId,
          status: 'active'
        }
      });

      if (activeBorrows > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete book with active borrows'
        });
      }

      // Delete the book
      await prisma.book.delete({
        where: { id: bookId }
      });

      return res.status(200).json({
        success: true,
        message: 'Book deleted successfully'
      });
    }

    // Method not allowed
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  } catch (error) {
    console.error('Book operation error:', error);
    
    // Check for Prisma errors related to foreign key constraints
    if (error.code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete book because it is referenced by borrowed books records'
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred during operation' 
    });
  }
}
