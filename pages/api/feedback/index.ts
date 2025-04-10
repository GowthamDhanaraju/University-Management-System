import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET all feedback
  if (req.method === 'GET') {
    try {
      const feedbacks = await prisma.feedback.findMany({
        include: {
          course: {
            select: {
              name: true,
            },
          },
          teacher: {
            select: {
              name: true,
            },
          },
        },
      });

      return res.status(200).json({ success: true, data: feedbacks });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch feedback' });
    }
  }

  // POST create new feedback
  if (req.method === 'POST') {
    try {
      const {
        courseId,
        teacherId,
        studentId,
        courseRatings,
        facultyRatings,
        overallRating,
        comments,
      } = req.body;

      const feedback = await prisma.feedback.create({
        data: {
          courseId,
          teacherId,
          studentId,
          courseRatings,
          facultyRatings,
          overallRating: parseFloat(overallRating),
          comments,
        },
      });

      return res.status(201).json({ success: true, data: feedback });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to submit feedback' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
