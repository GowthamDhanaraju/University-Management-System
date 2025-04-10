import { PrismaClient } from '@prisma/client';

// Avoid multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Add named export to support both import styles
export { prisma };
export default prisma;