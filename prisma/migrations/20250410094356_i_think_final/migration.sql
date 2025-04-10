/*
  Warnings:

  - You are about to drop the column `student` on the `Feedback` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "student",
ADD COLUMN     "studentId" TEXT;
