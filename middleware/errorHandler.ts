import { Request, Response, NextFunction } from 'express';
import { ApiError } from "../errors/apiError";

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  let statusCode = 500;
  let message = 'An unknown error occurred';

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  res.status(statusCode).json({ message });
};