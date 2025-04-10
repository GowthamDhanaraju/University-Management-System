import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET method - Fetch all auditoriums
  if (req.method === 'GET') {
    try {
      const auditoriums = await prisma.auditorium.findMany();
      
      return res.status(200).json(auditoriums);
    } catch (error) {
      console.error('Error fetching auditoriums:', error);
      return res.status(500).json({ message: 'Failed to fetch auditoriums' });
    }
  }
  
  // POST method - Create a new auditorium
  else if (req.method === 'POST') {
    try {
      // Verify admin authorization
      const token = req.headers.authorization?.split(' ')[1];
      const decoded = verifyToken(token);
      
      if (!decoded || decoded.role !== 'ADMIN') {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const { name, location, capacity, hasWhiteboard, status, amenities } = req.body;
      
      const newAuditorium = await prisma.auditorium.create({
        data: {
          name,
          location,
          capacity,
          hasWhiteboard,
          status,
          amenities
        }
      });
      
      return res.status(201).json(newAuditorium);
    } catch (error) {
      console.error('Error creating auditorium:', error);
      return res.status(500).json({ message: 'Failed to create auditorium' });
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}
