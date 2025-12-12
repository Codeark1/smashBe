import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export interface AuthenticatedUser {
  id: string;
  email: string;
}

export function authMiddleware(req: NextRequest): AuthenticatedUser | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  if (!token) return null;

  const user = verifyToken(token) as AuthenticatedUser | null;
  return user;
}
