import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      statusCode: err.statusCode,
    });
  }

  // Supabase errors
  if (err.message.includes('Supabase')) {
    console.error('Supabase error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Database operation failed',
      statusCode: 500,
    });
  }

  // Gemini API errors
  if (err.message.includes('Gemini') || err.message.includes('API')) {
    console.error('API error:', err);
    return res.status(503).json({
      status: 'error',
      message: 'AI service temporarily unavailable',
      statusCode: 503,
    });
  }

  // Unknown error
  console.error('Unexpected error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    statusCode: 500,
  });
}

export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
