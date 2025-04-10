import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET method - Fetch all auditorium events
  if (req.method === 'GET') {
    try {
      const events = await prisma.auditoriumBooking.findMany({
        include: {
          auditorium: true,
        },
        orderBy: {
          date: 'desc'
        }
      });
      
      const formattedEvents = events.map(event => ({
        id: event.id,
        title: event.title,
        date: event.date,
        time: event.timeSlot,
        auditoriumId: event.auditoriumId,
        auditoriumName: event.auditorium.name,
        faculty: event.faculty || '',
        club: event.club || '',
        description: event.description || '',
        status: event.status
      }));
      
      return res.status(200).json(formattedEvents);
    } catch (error) {
      console.error('Error fetching auditorium events:', error);
      return res.status(500).json({ message: 'Failed to fetch events' });
    }
  }
  
  // POST method - Create a new auditorium event
  else if (req.method === 'POST') {
    try {
      // Verify admin authorization
      const token = req.headers.authorization?.split(' ')[1];
      const decoded = verifyToken(token);
      
      if (!decoded || decoded.role !== 'ADMIN') {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const { title, date, time, auditoriumId, faculty, club, description, status } = req.body;
      
      const newEvent = await prisma.auditoriumBooking.create({
        data: {
          title,
          date: new Date(date),
          timeSlot: time,
          auditoriumId,
          faculty,
          club,
          description,
          status,
          requestedBy: decoded.id
        },
        include: {
          auditorium: true
        }
      });
      
      const formattedEvent = {
        id: newEvent.id,
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.timeSlot,
        auditoriumId: newEvent.auditoriumId,
        auditoriumName: newEvent.auditorium.name,
        faculty: newEvent.faculty || '',
        club: newEvent.club || '',
        description: newEvent.description || '',
        status: newEvent.status
      };
      
      return res.status(201).json(formattedEvent);
    } catch (error) {
      console.error('Error creating auditorium event:', error);
      return res.status(500).json({ message: 'Failed to create event' });
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}
