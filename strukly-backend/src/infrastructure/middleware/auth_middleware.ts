import { Request, Response, NextFunction } from 'express';
import JwtService from '../services/jwt_service';

declare global {
  namespace Express {
    export interface Request {
      user?: { id: string; email: string };
    }
  }
}

const jwtService = new JwtService();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    const payload = await jwtService.verify(token);

    req.user = payload;

    next();

  } catch (error) {
    return res.status(401).json({ error: 'invalid token' });
  }
};