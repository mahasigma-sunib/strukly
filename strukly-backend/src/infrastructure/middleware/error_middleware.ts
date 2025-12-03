import { Request, Response, NextFunction } from "express";
import NotFoundError from "src/domain/errors/NotFoundError";
import AlreadyExistError from "src/domain/errors/AlreadyExistError";
import UnauthorizedError from "src/domain/errors/UnauthorizedError";
import InvalidDataError from "src/domain/errors/InvalidDataError";

/**
 * Global error handling middleware
 * This should be registered after all routes
 */
export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(error);

  if (error instanceof NotFoundError) {
    return res.status(404).json({ error: error.message });
  }

  if (error instanceof AlreadyExistError) {
    return res.status(409).json({ error: error.message });
  }

  if (error instanceof UnauthorizedError) {
    return res.status(401).json({ error: error.message });
  }

  if (error instanceof InvalidDataError) {
    return res.status(400).json({ error: error.message });
  }

  // Internal server error for unhandled errors
  return res.status(500).json({ error: "Internal server error" });
};
