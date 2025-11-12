
import { Request, Response, NextFunction } from 'express';
import { QueryFailedError } from 'typeorm';
import logger from '../utils/logger';
//import { AuthenticatedRequest } from './auth.middleware'; // Import the AuthenticatedRequest

// ... (keep your existing error classes and other code)

// Update the asyncErrorHandler to work with AuthenticatedRequest
export const asyncErrorHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as Request, res, next)).catch(next);
  };
};


export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);
  
  // Default error
  let statusCode = 500;
  let message = 'Internal server error';
  
  // TypeORM errors
  if (error.code === '23505') {
    statusCode = 409;
    message = 'Duplicate entry';
  } else if (error.name === 'EntityNotFound') {
    statusCode = 404;
    message = 'Resource not found';
  }
  
  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  
  // Validation errors
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = error.message;
  }
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};
