import { NextFunction, Request, Response } from 'express';
import { logger } from '../../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error(err.message);
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  logger.error(err.stack);
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};
