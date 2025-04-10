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
  const auditoriumId = Array.isArray(id) ? id[0] : id;
  
  try {
    // Verify admin authorization
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { status, statusNote } = req.body;
    
    const updatedAuditorium = await prisma.auditorium.update({
      where: {
        id: auditoriumId as string
      },
      data: {
        status,
        statusNote
      }
    });
    
    return res.status(200).json(updatedAuditorium);
  } catch (error) {
    console.error('Error updating auditorium status:', error);
    return res.status(500).json({ message: 'Failed to update auditorium status' });
  }
}
