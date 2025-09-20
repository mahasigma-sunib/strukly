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
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json({ error: 'Authorization token is required.' });
    }

    const payload = await jwtService.verify(token);
    req.user = payload;
    next();

  } catch (error) {
    return res.status(401).json({ error: 'invalid token' });
  }
};