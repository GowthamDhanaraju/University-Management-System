import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { connectToDatabase } from '../../../utils/db';
import { verifyToken } from '../../../utils/auth';
import { ObjectId } from 'mongodb';

// Validation schema for creating an auditorium
const createAuditoriumSchema = z.object({
  name: z.string().min(2),
  location: z.string(),
  capacity: z.number().min(1),
  hasWhiteboard: z.boolean().default(false),
  amenities: z.array(z.string()).default([]),
  status: z.enum(['available', 'maintenance', 'repair', 'reserved']).default('available'),
  statusNote: z.string().optional()
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Verify authentication
    const user = await verifyToken(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { db } = await connectToDatabase();
    
    // GET - List auditoriums
    if (req.method === 'GET') {
      const { status, capacity, date, search, page = '1', limit = '20' } = req.query;
      const query: any = {};
      
      if (status) {
        query.status = status;
      }
      
      if (capacity) {
        query.capacity = { $gte: parseInt(capacity as string, 10) };
      }
      
      if (search) {
        const searchRegex = new RegExp(String(search), 'i');
        query.$or = [
          { name: searchRegex },
          { location: searchRegex }
        ];
      }
      
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const skip = (pageNum - 1) * limitNum;
      
      const auditoriums = await db.collection('auditoriums')
        .find(query)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limitNum)
        .toArray();
      
      // If a date is provided, check bookings for that date
      if (date) {
        const bookingsQuery: any = { date: date as string };
        const bookings = await db.collection('auditorium_bookings').find(bookingsQuery).toArray();
        
        // Map bookings to auditoriums
        const auditoriumBookings = bookings.reduce((acc, booking) => {
          if (!acc[booking.auditoriumId.toString()]) {
            acc[booking.auditoriumId.toString()] = [];
          }
          acc[booking.auditoriumId.toString()].push(booking);
          return acc;
        }, {});
        
        // Add booking info to auditoriums
        for (const auditorium of auditoriums) {
          const id = auditorium._id.toString();
          auditorium.bookings = auditoriumBookings[id] || [];
        }
      }
      
      const total = await db.collection('auditoriums').countDocuments(query);
      
      return res.status(200).json({
        success: true,
        data: auditoriums,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum)
        }
      });
    }

    // Only admins can create auditoriums
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    // POST - Create new auditorium
    if (req.method === 'POST') {
      try {
        const validatedData = createAuditoriumSchema.parse(req.body);
        
        // Check if an auditorium with the same name exists
        const existingAuditorium = await db.collection('auditoriums').findOne({
          name: validatedData.name
        });
        
        if (existingAuditorium) {
          return res.status(400).json({
            success: false,
            message: 'Auditorium with this name already exists'
          });
        }
        
        const newAuditorium = {
          ...validatedData,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: new ObjectId(user.id)
        };
        
        const result = await db.collection('auditoriums').insertOne(newAuditorium);
        
        return res.status(201).json({
          success: true,
          message: 'Auditorium created successfully',
          data: {
            _id: result.insertedId,
            ...newAuditorium
          }
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.errors
          });
        }
        throw error;
      }
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  } catch (error) {
    console.error('Auditorium error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
