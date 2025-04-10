import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

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

  try {
    const books = await prisma.book.findMany({
      orderBy: {
        title: 'asc'
      }
    });

    const formattedBooks = books.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      copies: book.copies,
      available: book.available,
      coverImage: book.coverImage || `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
    }));

    return res.status(200).json({
      success: true,
      data: formattedBooks
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch books' 
    });
  }
}
