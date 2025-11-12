import { Response } from 'express';
import logger from './logger';

/**
 * Standardized success response format
 */
export interface SuccessResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    pages?: number;
    nextCursor?: string | null;
    hasMore?: boolean;
  };
  timestamp: string;
}

/**
 * Standardized error response format
 */
export interface ErrorResponse {
  success: boolean;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

/**
 * Send standardized success response
 */
export const ok = <T>(
  res: Response,
  data: T,
  message?: string,
  pagination?: SuccessResponse['pagination']
): Response => {
  const response: SuccessResponse<T> = {
    success: true,
    data,
    message,
    pagination,
    timestamp: new Date().toISOString(),
  };

  logger.debug('API Success Response', {
    url: res.req?.url,
    method: res.req?.method,
    statusCode: 200,
    message,
  });

  return res.status(200).json(response);
};

/**
 * Send standardized created response (201)
 */
export const created = <T>(
  res: Response,
  data: T,
  message: string = 'Resource created successfully'
): Response => {
  const response: SuccessResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };

  logger.debug('API Created Response', {
    url: res.req?.url,
    method: res.req?.method,
    statusCode: 201,
    message,
  });

  return res.status(201).json(response);
};

/**
 * Send standardized error response
 */
export const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: any
): Response => {
  const errorCode = code || getDefaultErrorCode(statusCode);
  
  const response: ErrorResponse = {
    success: false,
    error: {
      code: errorCode,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };

  // Log error for monitoring
  if (statusCode >= 500) {
    logger.error('API Error Response', {
      url: res.req?.url,
      method: res.req?.method,
      statusCode,
      errorCode,
      message,
      details,
    });
  } else {
    logger.warn('API Client Error Response', {
      url: res.req?.url,
      method: res.req?.method,
      statusCode,
      errorCode,
      message,
      details,
    });
  }

  return res.status(statusCode).json(response);
};

/**
 * Send standardized validation error response
 */
export const validationError = (
  res: Response,
  errors: any[],
  message: string = 'Validation failed'
): Response => {
  return errorResponse(
    res,
    message,
    422,
    'VALIDATION_ERROR',
    errors
  );
};

/**
 * Send standardized not found response
 */
export const notFound = (
  res: Response,
  message: string = 'Resource not found'
): Response => {
  return errorResponse(
    res,
    message,
    404,
    'NOT_FOUND'
  );
};

/**
 * Send standardized unauthorized response
 */
export const unauthorized = (
  res: Response,
  message: string = 'Unauthorized access'
): Response => {
  return errorResponse(
    res,
    message,
    401,
    'UNAUTHORIZED'
  );
};

/**
 * Send standardized forbidden response
 */
export const forbidden = (
  res: Response,
  message: string = 'Access forbidden'
): Response => {
  return errorResponse(
    res,
    message,
    403,
    'FORBIDDEN'
  );
};

/**
 * Send standardized bad request response
 */
export const badRequest = (
  res: Response,
  message: string = 'Bad request',
  details?: any
): Response => {
  return errorResponse(
    res,
    message,
    400,
    'BAD_REQUEST',
    details
  );
};

/**
 * Send standardized conflict response
 */
export const conflict = (
  res: Response,
  message: string = 'Resource conflict',
  details?: any
): Response => {
  return errorResponse(
    res,
    message,
    409,
    'CONFLICT',
    details
  );
};

/**
 * Send standardized too many requests response
 */
export const tooManyRequests = (
  res: Response,
  message: string = 'Too many requests',
  retryAfter?: number
): Response => {
  if (retryAfter) {
    res.setHeader('Retry-After', retryAfter.toString());
  }

  return errorResponse(
    res,
    message,
    429,
    'RATE_LIMIT_EXCEEDED',
    { retryAfter }
  );
};

/**
 * Get default error code based on status code
 */
const getDefaultErrorCode = (statusCode: number): string => {
  const errorCodes: { [key: number]: string } = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'VALIDATION_ERROR',
    429: 'RATE_LIMIT_EXCEEDED',
    500: 'INTERNAL_SERVER_ERROR',
    502: 'BAD_GATEWAY',
    503: 'SERVICE_UNAVAILABLE',
    504: 'GATEWAY_TIMEOUT',
  };

  return errorCodes[statusCode] || 'INTERNAL_SERVER_ERROR';
};

/**
 * Send standardized paginated response
 */
export const paginated = <T>(
  res: Response,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  },
  message?: string
): Response => {
  return ok(
    res,
    data,
    message,
    pagination
  );
};

/**
 * Send standardized keyset paginated response
 */
export const keysetPaginated = <T>(
  res: Response,
  data: T[],
  pagination: {
    nextCursor: string | null;
    limit: number;
    total?: number;
    hasMore: boolean;
  },
  message?: string
): Response => {
  return ok(
    res,
    data,
    message,
    pagination
  );
};

/**
 * Send standardized no content response
 */
export const noContent = (res: Response): Response => {
  logger.debug('API No Content Response', {
    url: res.req?.url,
    method: res.req?.method,
    statusCode: 204,
  });

  return res.status(204).send();
};

export default {
  ok,
  created,
  errorResponse,
  validationError,
  notFound,
  unauthorized,
  forbidden,
  badRequest,
  conflict,
  tooManyRequests,
  paginated,
  keysetPaginated,
  noContent,
};
