import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { courseId } = req.query;

  try {
    const feedbackData = await prisma.feedback.findMany({
      where: courseId ? { courseId: String(courseId) } : undefined,
      include: {
        course: true,
        teacher: true,
      },
    });

    const response = feedbackData.map((fb) => ({
      id: fb.id,
      courseId: fb.courseId,
      courseName: fb.course.name,
      studentId: fb.studentId || "Anonymous",
      date: fb.date.toISOString().split("T")[0],
      courseRatings: fb.courseRatings || {},
      facultyRatings: fb.facultyRatings || {},
      overallRating: fb.overallRating || 0,
      comments: fb.comments || "",
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ error: "Failed to fetch feedback." });
  }
}