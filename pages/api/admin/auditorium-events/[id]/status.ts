import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../lib/prisma';
import { verifyToken } from '../../../../../lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;
  const eventId = Array.isArray(id) ? id[0] : id;
  
  try {
    // Verify admin authorization
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { status } = req.body;
    
    const updatedEvent = await prisma.auditoriumBooking.update({
      where: {
        id: eventId as string
      },
      data: {
        status
      }
    });
    
    return res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event status:', error);
    return res.status(500).json({ message: 'Failed to update event status' });
  }
}
