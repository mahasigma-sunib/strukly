import { Request, Response, NextFunction } from 'express';
import { tokenService as jwtService } from "src/composition_root";

declare global {
  namespace Express {
    export interface Request {
      user?: { id: string; email: string };
    }
  }
}

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
    console.error(error)
    return res.status(401).json({ error: 'invalid token' });
  }
};
