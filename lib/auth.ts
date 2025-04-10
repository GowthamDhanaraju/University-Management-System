import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from './prisma';

export interface AuthRequest extends NextApiRequest {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface DecodedToken {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export function verifyToken(token?: string): DecodedToken | null {
  if (!token) return null;
  
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function authenticate(
  req: AuthRequest,
  res: NextApiResponse,
  next: () => void
) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Helper for protected API routes
export function withAuth(handler: (req: AuthRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: AuthRequest, res: NextApiResponse) => {
    await new Promise<void>((resolve) => {
      authenticate(req, res, () => resolve());
    });
    
    // If we got here, authentication passed
    if (req.user) {
      return handler(req, res);
    }
  };
}
