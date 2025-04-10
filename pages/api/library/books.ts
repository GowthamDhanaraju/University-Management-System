import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // GET: List all books
    if (req.method === 'GET') {
      const books = await prisma.book.findMany({
        include: {
          borrowedBooks: {
            where: {
              status: 'active'
            }
          }
        }
      });

      return res.status(200).json({
        success: true,
        data: books
      });
    }

    // POST: Create a new book
    if (req.method === 'POST') {
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

      const book = await prisma.book.create({
        data: {
          title,
          author,
          category,
          isbn: isbn || '',
          publisher: publisher || '',
          copies: copies ? parseInt(copies) : 0,
          available: available ? parseInt(available) : (copies ? parseInt(copies) : 0),
          location: location || ''
        }
      });

      return res.status(201).json({ 
        success: true, 
        data: book
      });
    }

    // Method not allowed
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  } catch (error) {
    console.error('Book operation error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred during operation'
    });
  }
}
